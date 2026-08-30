import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// ---------------------------------------------------------------------------
// ADMIN SETUP REQUIRED
// This function needs the following Netlify environment variables set
// (Site settings -> Environment variables). NEVER put these in frontend code.
//
//   SUPABASE_URL                 - same as VITE_SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY    - Supabase Project Settings -> API -> service_role (secret!)
//   RESEND_API_KEY               - from https://resend.com/api-keys
//   RESEND_FROM_EMAIL            - a verified sending address, e.g. "ADPAP Secretariat <noreply@yourdomain.com>"
//   SECRETARIAT_EMAIL            - comma-separated list of recipients; defaults to
//                                  "secretariat@gkphilippines.com,roselle@gkphilippines.com" if unset
// ---------------------------------------------------------------------------

const SECRETARIAT_EMAILS = (process.env.SECRETARIAT_EMAIL || "secretariat@gkphilippines.com,roselle@gkphilippines.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);
const PROOF_BUCKET = "proof-of-payment";

const MEMBERSHIP_FEES: Record<string, number> = {
  individual: 5000,
  institutional: 15000,
  premium_institutional: 35000,
};

const MEMBERSHIP_LABELS: Record<string, string> = {
  individual: "Individual Professional",
  institutional: "Institutional",
  premium_institutional: "Premium Institutional",
};

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let payload: any;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid request body." });
  }

  // ---- Server-side validation (never trust the client) ----------------
  const membershipType = payload.membershipType;
  if (!membershipType || !(membershipType in MEMBERSHIP_FEES)) {
    return jsonResponse(400, { error: "Invalid or missing membership type." });
  }

  const isIndividual = membershipType === "individual";
  const contactEmail = isIndividual ? payload.applicant?.email : payload.organization?.mainContactEmail;
  const contactName = isIndividual ? payload.applicant?.fullName : payload.organization?.organizationName;

  if (!contactName || !contactEmail || !isValidEmail(contactEmail)) {
    return jsonResponse(400, { error: "Applicant/organization name and a valid email are required." });
  }
  if (!payload.declaration?.certifyTrue || !payload.declaration?.understandNoGuarantee ||
      !payload.declaration?.agreePolicies || !payload.declaration?.consentProcessing ||
      !payload.declaration?.acknowledgeOperator) {
    return jsonResponse(400, { error: "All declaration and consent checkboxes must be accepted." });
  }
  if (!payload.payment?.method) {
    return jsonResponse(400, { error: "Payment method is required." });
  }
  if (payload.payment.method === "bill_company") {
    if (!payload.payment.billingCompanyName || !payload.payment.billingContactPerson ||
        !payload.payment.billingCompanyAddress || !payload.payment.billingEmail ||
        !isValidEmail(payload.payment.billingEmail) || !payload.payment.billingMobile) {
      return jsonResponse(400, { error: "Company billing details are incomplete." });
    }
  } else if (!payload.payment.referenceNumber || !payload.payment.amountPaid) {
    return jsonResponse(400, { error: "Payment details are incomplete." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return jsonResponse(500, {
      error:
        "The server is not fully configured yet (missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY environment variables). Contact the site administrator.",
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // ---- Generate a unique reference number using a Postgres sequence ----
  const year = new Date().getFullYear();
  const { data: seqData, error: seqError } = await supabase.rpc("next_application_sequence");
  if (seqError) {
    return jsonResponse(500, { error: "Could not generate an application reference number. Please try again." });
  }
  const referenceNumber = `ADPAP-${year}-${String(seqData).padStart(5, "0")}`;

  // ---- Upload proof of payment to Supabase Storage, if provided --------
  let proofUrl: string | null = null;
  if (payload.payment?.proofFileBase64 && payload.payment?.proofFileName) {
    try {
      const matches = /^data:(.+);base64,(.+)$/.exec(payload.payment.proofFileBase64);
      if (matches) {
        const contentType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const safeName = payload.payment.proofFileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
        const path = `${referenceNumber}/${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from(PROOF_BUCKET)
          .upload(path, buffer, { contentType, upsert: true });
        if (!uploadError) {
          const { data: signedUrl } = await supabase.storage
            .from(PROOF_BUCKET)
            .createSignedUrl(path, 60 * 60 * 24 * 30); // 30 days
          proofUrl = signedUrl?.signedUrl ?? null;
        }
      }
    } catch {
      // Non-fatal: continue without the file link rather than blocking submission.
      proofUrl = null;
    }
  }

  const amountDue = MEMBERSHIP_FEES[membershipType];
  const submittedAt = new Date().toISOString();

  const application = {
    ...payload,
    referenceNumber,
    status: "submitted",
    submittedAt,
    amountDue,
  };

  // ---- Persist to Supabase ----------------------------------------------
  const { error: insertError } = await supabase.from("applications").insert({
    reference_number: referenceNumber,
    membership_type: membershipType,
    status: "submitted",
    submitted_at: submittedAt,
    amount_due: amountDue,
    contact_name: contactName,
    contact_email: contactEmail,
    proof_of_payment_url: proofUrl,
    payload: application,
  });

  if (insertError) {
    return jsonResponse(500, { error: "Could not save your application. Please try again or contact the Secretariat." });
  }

  // ---- Send emails via Resend --------------------------------------------
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (resendKey && fromEmail) {
    const resend = new Resend(resendKey);
    const planLabel = MEMBERSHIP_LABELS[membershipType];

    try {
      await resend.emails.send({
        from: fromEmail,
        to: SECRETARIAT_EMAILS,
        subject: `NEW ADPAP MEMBERSHIP APPLICATION – ${contactName} – ${planLabel}`,
        html: buildSecretariatEmailHtml(application, planLabel, proofUrl),
      });

      await resend.emails.send({
        from: fromEmail,
        to: contactEmail,
        subject: "ADPAP Membership Application Received",
        html: buildApplicantEmailHtml(application, planLabel),
      });
    } catch {
      // Do not fail the whole submission if email sending fails; the application is already saved.
      // Consider logging this to a monitoring service in production.
    }
  }

  return jsonResponse(200, { application });
};

function buildSecretariatEmailHtml(app: any, planLabel: string, proofUrl: string | null): string {
  const isIndividual = app.membershipType === "individual";
  const rows: [string, string][] = [
    ["Application Reference Number", app.referenceNumber],
    ["Membership Category", planLabel],
    ["Membership Fee", `PHP ${app.amountDue.toLocaleString("en-PH")}`],
    ["Date/Time Submitted", new Date(app.submittedAt).toLocaleString("en-PH")],
  ];

  if (isIndividual) {
    rows.push(
      ["Applicant Name", app.applicant.fullName],
      ["Email", app.applicant.email],
      ["Mobile", app.applicant.mobile],
      ["Company", app.applicant.company],
      ["Position", app.applicant.positionTitle],
      ["Currently a DPO", app.applicant.isDpo ? "Yes" : "No"],
      ["Reason for Joining", app.applicant.reasonForJoining]
    );
  } else {
    rows.push(
      ["Organization Name", app.organization.organizationName],
      ["Main Contact", app.organization.mainContactName],
      ["Contact Email", app.organization.mainContactEmail],
      ["Contact Number", app.organization.mainContactNumber]
    );
    app.representatives?.forEach((r: any, i: number) => {
      rows.push([`Representative ${i + 1}`, `${r.fullName} — ${r.email} — ${r.position}`]);
    });
  }

  if (app.payment.method === "bill_company") {
    rows.push(
      ["Payment Method", "Bill My Company (invoice requested)"],
      ["Billing Company Name", app.payment.billingCompanyName],
      ["Person to be Billed", app.payment.billingContactPerson],
      ["Billing Company Address", app.payment.billingCompanyAddress],
      ["Billing Email", app.payment.billingEmail],
      ["Billing Mobile", app.payment.billingMobile]
    );
  } else {
    rows.push(
      ["Payment Method", app.payment.method],
      ["Amount Paid", `PHP ${app.payment.amountPaid}`],
      ["Payment Date", app.payment.paymentDate],
      ["Payment Reference No.", app.payment.referenceNumber],
      ["Payor Name", app.payment.payorName]
    );
    if (!app.payment.proofFileBase64) {
      rows.push(["Proof of Payment", "Not yet attached — applicant will send separately"]);
    }
  }
  if (proofUrl) rows.push(["Proof of Payment", `<a href="${proofUrl}">View file</a>`]);

  const rowsHtml = rows
    .map(([label, value]) => `<tr><td style="padding:6px 12px;color:#555;font-size:13px;">${label}</td><td style="padding:6px 12px;font-size:13px;"><strong>${value}</strong></td></tr>`)
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
      <h2 style="color:#0A1633;">New ADPAP Membership Application</h2>
      <table style="border-collapse:collapse;width:100%;">${rowsHtml}</table>
      <p style="margin-top:20px;color:#555;font-size:12px;">Submitted via the ADPAP membership application form.</p>
    </div>
  `;
}

function buildApplicantEmailHtml(app: any, planLabel: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
      <h2 style="color:#0A1633;">Thank you for applying to ADPAP</h2>
      <p style="color:#333;font-size:14px;line-height:1.6;">
        Thank you for submitting your application to the Alliance of Data Privacy Advocates
        Philippines. Your application has been received and is currently under review.
      </p>
      <table style="border-collapse:collapse;margin-top:16px;">
        <tr><td style="padding:4px 12px;color:#555;font-size:13px;">Application Reference Number</td><td style="padding:4px 12px;font-size:13px;"><strong>${app.referenceNumber}</strong></td></tr>
        <tr><td style="padding:4px 12px;color:#555;font-size:13px;">Membership Category</td><td style="padding:4px 12px;font-size:13px;"><strong>${planLabel}</strong></td></tr>
        <tr><td style="padding:4px 12px;color:#555;font-size:13px;">Membership Fee</td><td style="padding:4px 12px;font-size:13px;"><strong>PHP ${app.amountDue.toLocaleString("en-PH")}</strong></td></tr>
        <tr><td style="padding:4px 12px;color:#555;font-size:13px;">Status</td><td style="padding:4px 12px;font-size:13px;"><strong>For Review</strong></td></tr>
      </table>
      <p style="margin-top:20px;color:#333;font-size:13px;">
        Questions? Contact the ADPAP Secretariat at
        <a href="mailto:secretariat@gkphilippines.com">secretariat@gkphilippines.com</a>.
      </p>
    </div>
  `;
}
