import { ApplicationFormState, SubmittedApplication, MemberRecord } from "@/types";
import { generateReferenceNumber } from "./ids";
import { getPlan } from "@/data/membershipPlans";

const DEMO_STORAGE_KEY = "adpap_demo_applications_v1";

function readDemoApplications(): SubmittedApplication[] {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SubmittedApplication[]) : [];
  } catch {
    return [];
  }
}

function writeDemoApplications(apps: SubmittedApplication[]) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(apps));
}

export interface SubmitResult {
  ok: boolean;
  application?: SubmittedApplication;
  error?: string;
  mode: "live" | "demo";
}

/**
 * Submits the completed application.
 * - In production (Netlify), this POSTs to /.netlify/functions/submit-application,
 *   which validates the payload server-side, writes to Supabase, generates the
 *   official reference number, uploads the proof-of-payment file to Supabase
 *   Storage, and sends both the Secretariat notification email and the
 *   applicant acknowledgement email via Resend.
 * - If that endpoint is unreachable (e.g. local `vite dev` without `netlify dev`),
 *   the app falls back to a local "demo mode" so the UI can still be exercised
 *   end-to-end without a backend. Demo submissions are stored only in this
 *   browser's localStorage and no email is sent.
 */
export async function submitApplication(form: ApplicationFormState): Promise<SubmitResult> {
  const plan = getPlan(form.membershipType);
  const amountDue = plan ? plan.price : 0;

  try {
    const res = await fetch("/.netlify/functions/submit-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      return { ok: true, application: data.application as SubmittedApplication, mode: "live" };
    }

    // Endpoint exists but rejected the request (validation error, etc.)
    if (res.status !== 404) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, error: data.error || "The application could not be submitted. Please review your entries and try again.", mode: "live" };
    }
    // 404 -> function not deployed (local dev without netlify dev) -> fall through to demo mode
  } catch {
    // Network error -> fall through to demo mode
  }

  const application: SubmittedApplication = {
    ...form,
    referenceNumber: generateReferenceNumber(),
    status: "submitted",
    submittedAt: new Date().toISOString(),
    amountDue,
  };
  const apps = readDemoApplications();
  apps.unshift(application);
  writeDemoApplications(apps);

  return { ok: true, application, mode: "demo" };
}

export function listDemoApplications(): SubmittedApplication[] {
  return readDemoApplications();
}

export function findDemoApplication(referenceNumber: string): SubmittedApplication | undefined {
  return readDemoApplications().find((a) => a.referenceNumber === referenceNumber);
}

export function updateDemoApplicationStatus(referenceNumber: string, status: SubmittedApplication["status"]) {
  const apps = readDemoApplications();
  const idx = apps.findIndex((a) => a.referenceNumber === referenceNumber);
  if (idx >= 0) {
    apps[idx].status = status;
    writeDemoApplications(apps);
  }
}

// ---------------------------------------------------------------------------
// Demo member storage (used only when Supabase is not configured)
// ---------------------------------------------------------------------------
const DEMO_MEMBERS_KEY = "adpap_demo_members_v1";

export function readDemoMembers(): MemberRecord[] {
  try {
    const raw = localStorage.getItem(DEMO_MEMBERS_KEY);
    return raw ? (JSON.parse(raw) as MemberRecord[]) : [];
  } catch {
    return [];
  }
}

export function writeDemoMembers(members: MemberRecord[]) {
  localStorage.setItem(DEMO_MEMBERS_KEY, JSON.stringify(members));
}

export function upsertDemoMember(member: MemberRecord) {
  const members = readDemoMembers();
  const idx = members.findIndex((m) => m.membershipNumber === member.membershipNumber);
  if (idx >= 0) members[idx] = member;
  else members.push(member);
  writeDemoMembers(members);
}

