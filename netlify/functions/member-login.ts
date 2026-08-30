import type { Handler, HandlerEvent } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

// This function exists because the `members` table intentionally has no
// public/anon SELECT policy (see supabase/schema.sql) — member records
// contain PII (email, organization, benefit usage) that should not be
// broadly queryable with the anon key. Instead, the Member Portal login
// calls this function, which uses the service_role key server-side to look
// up the member and returns only that one record if the email AND
// membership/reference number both match.

function jsonResponse(statusCode: number, body: unknown) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let body: any;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { error: "Invalid request body." });
  }

  const email = (body.email || "").trim().toLowerCase();
  const membershipOrRef = (body.membershipOrRef || "").trim();

  if (!email || !membershipOrRef) {
    return jsonResponse(400, { error: "Email and membership/reference number are required." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return jsonResponse(500, { error: "Server is not fully configured. Contact the site administrator." });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("email", email)
    .or(`membership_number.eq.${membershipOrRef},reference_number.eq.${membershipOrRef}`)
    .maybeSingle();

  if (error || !data) {
    return jsonResponse(404, {
      error:
        "We couldn't find a matching membership. Check your email and membership/reference number, or contact secretariat@gkphilippines.com.",
    });
  }

  const member = {
    membershipNumber: data.membership_number,
    fullNameOrOrg: data.full_name_or_org,
    membershipType: data.membership_type,
    status: data.status,
    startDate: data.start_date,
    expirationDate: data.expiration_date,
    organization: data.organization ?? undefined,
    foundingMember: Boolean(data.founding_member),
    benefits: data.benefits,
  };

  return jsonResponse(200, { member });
};
