import { MembershipType } from "@/types";

/** Client-side fallback reference number (demo mode only).
 * In production, the Netlify Function `submit-application` generates the
 * authoritative, collision-checked reference number server-side using a
 * Postgres sequence — see supabase/schema.sql (applications_ref_seq). */
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");
  return `ADPAP-${year}-${rand}`;
}

export function membershipNumberPrefix(type: MembershipType): string {
  switch (type) {
    case "individual":
      return "ADPAP-I";
    case "institutional":
      return "ADPAP-INST";
    case "premium_institutional":
      return "ADPAP-PREM";
  }
}

export function generateMembershipNumber(type: MembershipType, sequence: number): string {
  const year = new Date().getFullYear();
  return `${membershipNumberPrefix(type)}-${year}-${sequence.toString().padStart(5, "0")}`;
}
