import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ApplicationStatus, MemberRecord, MembershipType, SubmittedApplication } from "@/types";
import { generateMembershipNumber } from "@/lib/ids";
import { getPlan } from "@/data/membershipPlans";
import { listDemoApplications, updateDemoApplicationStatus, readDemoMembers, upsertDemoMember } from "@/lib/applications";

export async function listApplications(): Promise<SubmittedApplication[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("submitted_at", { ascending: false });
    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((row: any) => row.payload as SubmittedApplication);
  }
  return listDemoApplications();
}

export async function listMembers(): Promise<MemberRecord[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.from("members").select("*");
    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((row: any) => ({
      membershipNumber: row.membership_number,
      fullNameOrOrg: row.full_name_or_org,
      membershipType: row.membership_type,
      status: row.status,
      startDate: row.start_date,
      expirationDate: row.expiration_date,
      organization: row.organization ?? undefined,
      foundingMember: Boolean(row.founding_member),
      benefits: row.benefits,
    }));
  }
  return readDemoMembers();
}

async function setApplicationStatus(referenceNumber: string, status: ApplicationStatus) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from("applications").update({ status }).eq("reference_number", referenceNumber);
    return;
  }
  updateDemoApplicationStatus(referenceNumber, status);
}

export async function markPaymentVerified(referenceNumber: string) {
  await setApplicationStatus(referenceNumber, "payment_verification");
}

export async function rejectApplication(referenceNumber: string) {
  await setApplicationStatus(referenceNumber, "rejected");
}

export async function requestMoreInfo(referenceNumber: string) {
  await setApplicationStatus(referenceNumber, "for_review");
}

function defaultBenefitsFor(type: MembershipType, membershipNumber: string) {
  const plan = getPlan(type);
  return {
    dpiaBuilder: true,
    conventionDiscount: true,
    examReview: { total: type === "individual" ? 1 : (plan?.representatives ?? 1), used: 0 },
    examRetakeDiscount: true,
    merchandiseDiscount: true,
    trainingVouchers: (plan?.trainingBenefits ?? []).map((benefit, i) => ({
      benefit,
      code: `${membershipNumber}-TRN-${i + 1}`,
      redeemed: false,
    })),
  };
}

/** Approves an application: assigns a permanent membership number and creates the member record
 * with status "approved" (not yet "active" — see activateMembership). */
export async function approveApplication(
  application: SubmittedApplication,
  opts?: { sequence?: number }
): Promise<MemberRecord | null> {
  if (!application.membershipType) return null;
  const type = application.membershipType as MembershipType;

  const existingMembers = await listMembers();
  const sameTypeCount = existingMembers.filter((m) => m.membershipType === type).length;
  const sequence = opts?.sequence ?? sameTypeCount + 1;
  const membershipNumber = generateMembershipNumber(type, sequence);

  const fullNameOrOrg =
    type === "individual" ? application.applicant.fullName : application.organization.organizationName;

  const startDate = new Date().toISOString().slice(0, 10);
  const expiration = new Date();
  expiration.setFullYear(expiration.getFullYear() + 1);
  const expirationDate = expiration.toISOString().slice(0, 10);

  const member: MemberRecord = {
    membershipNumber,
    fullNameOrOrg,
    membershipType: type,
    status: "approved",
    startDate,
    expirationDate,
    organization: type !== "individual" ? application.organization.organizationName : undefined,
    foundingMember: false,
    benefits: defaultBenefitsFor(type, membershipNumber),
  };

  if (isSupabaseConfigured && supabase) {
    await supabase.from("members").insert({
      membership_number: member.membershipNumber,
      full_name_or_org: member.fullNameOrOrg,
      membership_type: member.membershipType,
      status: member.status,
      start_date: member.startDate,
      expiration_date: member.expirationDate,
      organization: member.organization,
      founding_member: member.foundingMember,
      benefits: member.benefits,
      email: type === "individual" ? application.applicant.email : application.organization.mainContactEmail,
      reference_number: application.referenceNumber,
    });
    await supabase
      .from("applications")
      .update({ status: "approved" })
      .eq("reference_number", application.referenceNumber);
  } else {
    upsertDemoMember(member);
    updateDemoApplicationStatus(application.referenceNumber, "approved");
  }

  return member;
}

export async function activateMembership(membershipNumber: string) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from("members").update({ status: "active" }).eq("membership_number", membershipNumber);
    return;
  }
  const members = readDemoMembers();
  const idx = members.findIndex((m) => m.membershipNumber === membershipNumber);
  if (idx >= 0) {
    members[idx].status = "active";
    upsertDemoMember(members[idx]);
  }
}

export async function toggleFoundingMember(membershipNumber: string, value: boolean) {
  if (isSupabaseConfigured && supabase) {
    await supabase.from("members").update({ founding_member: value }).eq("membership_number", membershipNumber);
    return;
  }
  const members = readDemoMembers();
  const idx = members.findIndex((m) => m.membershipNumber === membershipNumber);
  if (idx >= 0) {
    members[idx].foundingMember = value;
    upsertDemoMember(members[idx]);
  }
}

/** Marks a training voucher as redeemed once the Secretariat has coordinated the nominated
 * attendee with the institution by email (see the notice shown in the application form and
 * Member Portal). */
export async function redeemTrainingVoucher(membershipNumber: string, code: string) {
  const members = await listMembers();
  const member = members.find((m) => m.membershipNumber === membershipNumber);
  if (!member) return;
  const trainingVouchers = member.benefits.trainingVouchers.map((v) =>
    v.code === code ? { ...v, redeemed: true } : v
  );
  const benefits = { ...member.benefits, trainingVouchers };

  if (isSupabaseConfigured && supabase) {
    await supabase.from("members").update({ benefits }).eq("membership_number", membershipNumber);
    return;
  }
  upsertDemoMember({ ...member, benefits });
}

export async function updateMemberDates(membershipNumber: string, startDate: string, expirationDate: string) {
  if (isSupabaseConfigured && supabase) {
    await supabase
      .from("members")
      .update({ start_date: startDate, expiration_date: expirationDate })
      .eq("membership_number", membershipNumber);
    return;
  }
  const members = readDemoMembers();
  const idx = members.findIndex((m) => m.membershipNumber === membershipNumber);
  if (idx >= 0) {
    members[idx].startDate = startDate;
    members[idx].expirationDate = expirationDate;
    upsertDemoMember(members[idx]);
  }
}

export function exportMembersToCSV(members: MemberRecord[]): string {
  const headers = [
    "Membership Number",
    "Name / Organization",
    "Type",
    "Status",
    "Start Date",
    "Expiration Date",
    "Founding Member",
  ];
  const rows = members.map((m) => [
    m.membershipNumber,
    m.fullNameOrOrg,
    m.membershipType,
    m.status,
    m.startDate,
    m.expirationDate,
    m.foundingMember ? "Yes" : "No",
  ]);
  return [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
