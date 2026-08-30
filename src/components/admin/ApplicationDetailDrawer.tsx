import type { ReactNode } from "react";
import { SubmittedApplication } from "@/types";
import { getPlan, formatPHP } from "@/data/membershipPlans";
import StatusBadge from "@/components/StatusBadge";

interface Props {
  application: SubmittedApplication;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRequestInfo: () => void;
  onVerifyPayment: () => void;
  onActivate: () => void;
  busy: boolean;
}

export default function ApplicationDetailDrawer({
  application,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
  onVerifyPayment,
  onActivate,
  busy,
}: Props) {
  const plan = getPlan(application.membershipType);
  const isIndividual = application.membershipType === "individual";
  const name = isIndividual ? application.applicant.fullName : application.organization.organizationName;
  const email = isIndividual ? application.applicant.email : application.organization.mainContactEmail;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-navy-950/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-xl overflow-y-auto bg-white p-7 shadow-elevated"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-xs text-navy-700/50">{application.referenceNumber}</p>
            <h2 className="mt-1 text-lg font-semibold text-navy-950">{name}</h2>
            <p className="text-sm text-navy-700/60">{email}</p>
          </div>
          <button onClick={onClose} className="rounded-md p-2 text-navy-700/50 hover:bg-mist-100" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <StatusBadge status={application.status} />
          <span className="text-xs text-navy-700/50">
            Submitted {new Date(application.submittedAt).toLocaleString("en-PH")}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-mist-50 p-4 text-sm">
          <div>
            <p className="text-xs text-navy-700/50">Membership Category</p>
            <p className="font-medium text-navy-900">{plan?.name}</p>
          </div>
          <div>
            <p className="text-xs text-navy-700/50">Fee</p>
            <p className="font-medium text-navy-900">{plan ? formatPHP(plan.price) : "—"}</p>
          </div>
        </div>

        {!isIndividual && (
          <Section title="Representatives">
            {application.representatives.map((r, i) => (
              <p key={i} className="text-sm text-navy-800">
                {r.fullName} — {r.email} — {r.position}
              </p>
            ))}
          </Section>
        )}

        <Section title="Payment">
          <Row label="Method" value={application.payment.method} />
          {application.payment.method === "bill_company" ? (
            <>
              <Row label="Company Name" value={application.payment.billingCompanyName ?? ""} />
              <Row label="Person to be Billed" value={application.payment.billingContactPerson ?? ""} />
              <Row label="Company Address" value={application.payment.billingCompanyAddress ?? ""} />
              <Row label="Email Address" value={application.payment.billingEmail ?? ""} />
              <Row label="Mobile Number" value={application.payment.billingMobile ?? ""} />
              <p className="mt-2 text-xs text-navy-700/50">
                No proof of payment yet — an invoice is to be sent to this company contact.
              </p>
            </>
          ) : (
            <>
              <Row label="Amount Paid" value={application.payment.amountPaid ? `₱${application.payment.amountPaid}` : "—"} />
              <Row label="Payment Date" value={application.payment.paymentDate} />
              <Row label="Reference No." value={application.payment.referenceNumber} />
              <Row label="Payor Name" value={application.payment.payorName} />
              {application.payment.proofFileBase64 ? (
                application.payment.proofFileType === "application/pdf" ? (
                  <a
                    href={application.payment.proofFileBase64}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-royal-600 hover:underline"
                  >
                    Open proof of payment (PDF) ↗
                  </a>
                ) : (
                  <img
                    src={application.payment.proofFileBase64}
                    alt="Proof of payment"
                    className="mt-2 max-h-56 rounded-md border border-navy-900/10"
                  />
                )
              ) : (
                <p className="text-xs text-navy-700/50">No file attached yet — applicant may send it separately.</p>
              )}
            </>
          )}
        </Section>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-navy-900/8 pt-6">
          <button disabled={busy} onClick={onVerifyPayment} className="btn-outline !py-2 !px-3.5 text-xs">
            Mark Payment Verified
          </button>
          <button disabled={busy} onClick={onRequestInfo} className="btn-outline !py-2 !px-3.5 text-xs">
            Request Additional Info
          </button>
          <button disabled={busy} onClick={onReject} className="btn-outline !py-2 !px-3.5 text-xs !border-rose-300 !text-rose-600">
            Reject
          </button>
          <button disabled={busy} onClick={onApprove} className="btn-primary !py-2 !px-3.5 text-xs">
            Approve &amp; Assign Membership No.
          </button>
          {application.status === "approved" && (
            <button disabled={busy} onClick={onActivate} className="btn-gold !py-2 !px-3.5 text-xs">
              Activate Membership
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6 border-t border-navy-900/8 pt-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-700/50">{title}</p>
      <div className="mt-2 space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p className="flex justify-between text-sm">
      <span className="text-navy-700/55">{label}</span>
      <span className="font-medium text-navy-900">{value}</span>
    </p>
  );
}
