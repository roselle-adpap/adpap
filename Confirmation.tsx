import { Link } from "react-router-dom";
import { SubmittedApplication } from "@/types";
import { getPlan, formatPHP } from "@/data/membershipPlans";
import StatusBadge from "@/components/StatusBadge";

export default function Confirmation({ application, demoMode }: { application: SubmittedApplication; demoMode: boolean }) {
  const plan = getPlan(application.membershipType);
  const name =
    application.membershipType === "individual"
      ? application.applicant.fullName
      : application.organization.organizationName;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m4 12 6 6L20 6" />
          </svg>
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold text-navy-950">Application Received</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-700/70">
          Thank you for applying for membership with the Alliance of Data Privacy Advocates
          Philippines.
        </p>
      </div>

      {demoMode && (
        <div className="mt-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          Demo mode: this submission was saved to your browser only. No email was sent because a
          live backend (Netlify Functions + Supabase) is not connected in this preview. See the
          README for deployment steps.
        </div>
      )}

      <div id="printable-summary" className="card mt-8 p-8">
        <div className="flex items-start justify-between border-b border-navy-900/8 pb-5">
          <div>
            <p className="font-display text-lg font-semibold text-navy-950">
              Alliance of Data Privacy Advocates Philippines
            </p>
            <p className="text-xs text-navy-700/55">Membership Application Summary</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="mt-5 space-y-3 text-sm">
          <Row label="Application Reference Number" value={application.referenceNumber} strong />
          <Row label="Applicant / Organization" value={name} />
          <Row label="Membership Category" value={plan?.name ?? application.membershipType} />
          <Row label="Amount" value={formatPHP(application.amountDue)} />
          <Row label="Date Submitted" value={new Date(application.submittedAt).toLocaleString("en-PH")} />
        </div>

        <div className="mt-6 rounded-md bg-mist-50 p-4 text-xs leading-relaxed text-navy-700/75">
          The ADPAP Secretariat will review your application and payment details. Membership
          activation information will be sent after approval. For questions, contact{" "}
          <a href="mailto:secretariat@gkphilippines.com" className="text-royal-600 hover:underline">
            secretariat@gkphilippines.com
          </a>
          .
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3 print:hidden">
        <button type="button" onClick={() => window.print()} className="btn-outline">
          Print Summary
        </button>
        <Link to="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-navy-700/55">{label}</span>
      <span className={strong ? "font-mono text-base font-semibold text-royal-700" : "font-medium text-navy-900"}>
        {value}
      </span>
    </div>
  );
}
