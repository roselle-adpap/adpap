import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getPlan, formatPHP } from "@/data/membershipPlans";
import DigitalMembershipCard from "@/components/DigitalMembershipCard";
import MembershipCertificate from "@/components/MembershipCertificate";
import StatusBadge from "@/components/StatusBadge";
import FoundingBadge from "@/components/FoundingBadge";

function daysUntil(dateStr: string): number {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24));
}

export default function MemberPortalPage() {
  const { member, logoutMember } = useAuth();

  if (!member) {
    return <Navigate to="/member-login" replace />;
  }

  const plan = getPlan(member.membershipType);
  const daysLeft = daysUntil(member.expirationDate);
  const renewalDue = daysLeft <= 60;

  return (
    <div className="section py-12 lg:py-16">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow">Member Portal</span>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
              Welcome, {member.fullNameOrOrg.split(" ")[0]}
            </h1>
            {member.foundingMember ? (
              <FoundingBadge size="sm" />
            ) : (
              member.status === "active" && (
                <span className="badge bg-emerald-100 text-emerald-700">Active Member</span>
              )
            )}
          </div>
        </div>
        <button onClick={logoutMember} className="btn-outline !py-2 !px-4 text-sm">
          Sign Out
        </button>
      </div>

      {renewalDue && (
        <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-lg border border-gold-500/40 bg-gold-400/10 px-5 py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-navy-800">
            <strong className="font-semibold">Membership Renewal Due</strong> — your membership{" "}
            {daysLeft >= 0 ? `expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}` : "has expired"}{" "}
            ({member.expirationDate}).
          </p>
          <button className="btn-gold !py-2 !px-4 text-xs shrink-0">Renew Membership</button>
        </div>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        {/* Digital ID */}
        <div className="flex flex-col items-center gap-4">
          <DigitalMembershipCard member={member} />
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-outline !py-2 !px-3.5 text-xs">
              View / Print ID
            </button>
            <a href="mailto:secretariat@gkphilippines.com" className="btn-outline !py-2 !px-3.5 text-xs">
              Contact Secretariat
            </a>
          </div>
        </div>

        {/* Status & benefits */}
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900">Membership Status</h2>
              <StatusBadge status={member.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <Field label="Membership No." value={member.membershipNumber} mono />
              <Field label="Category" value={plan?.name ?? member.membershipType} />
              <Field label="Annual Fee" value={plan ? formatPHP(plan.price) : "—"} />
              <Field label="Start Date" value={member.startDate} />
              <Field label="Expiration Date" value={member.expirationDate} />
              {member.organization && <Field label="Organization" value={member.organization} />}
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900">Membership Benefits</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <BenefitRow label="DPIA Builder Access" active={member.benefits.dpiaBuilder} />
              <BenefitRow label="National Convention Discount" active={member.benefits.conventionDiscount} />
              <BenefitRow
                label="Certification Exam Review"
                active={member.benefits.examReview.total > 0}
                detail={`${member.benefits.examReview.used}/${member.benefits.examReview.total} used`}
              />
              <BenefitRow label="Exam Retake Discount" active={member.benefits.examRetakeDiscount} />
              <BenefitRow label="Merchandise Discount" active={member.benefits.merchandiseDiscount} />
            </ul>

            {member.benefits.trainingVouchers.length > 0 && (
              <div className="mt-5 border-t border-navy-900/8 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-700/60">
                  Training Benefit Vouchers
                </p>
                <ul className="mt-3 space-y-2.5">
                  {member.benefits.trainingVouchers.map((v) => (
                    <li key={v.code} className="rounded-md border border-navy-900/10 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-navy-900">{v.benefit}</span>
                        <span className={`badge ${v.redeemed ? "bg-mist-200 text-navy-700" : "bg-emerald-100 text-emerald-700"}`}>
                          {v.redeemed ? "Redeemed" : "Available"}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-royal-700">{v.code}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs leading-relaxed text-navy-700/55">
                  Ready to use a voucher? Email the Secretariat with the voucher code and your
                  nominated attendee's details (this year, or any time before it expires — new
                  hires welcome) at{" "}
                  <a href="mailto:secretariat@gkphilippines.com" className="text-royal-600 hover:underline">
                    secretariat@gkphilippines.com
                  </a>
                  .
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">Download Membership Certificate</button>
            <button className="btn-outline">Update Profile</button>
            <Link to="/verify" className="btn-outline">
              View Public Verification Page
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-navy-900">Certificate Preview</h2>
        <div className="mt-4 max-w-2xl">
          <MembershipCertificate member={member} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-navy-700/50">{label}</p>
      <p className={`mt-0.5 font-medium text-navy-900 ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}

function BenefitRow({ label, active, detail }: { label: string; active: boolean; detail?: string }) {
  return (
    <li className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-navy-800">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full ${
            active ? "bg-emerald-100 text-emerald-700" : "bg-mist-200 text-mist-400"
          }`}
        >
          {active && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
              <path d="m4 12 6 6L20 6" />
            </svg>
          )}
        </span>
        {label}
      </span>
      <span className="text-xs text-navy-700/50">{detail ?? (active ? "Included" : "Not included")}</span>
    </li>
  );
}
