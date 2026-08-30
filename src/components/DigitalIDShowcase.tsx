import { Link } from "react-router-dom";
import { MemberRecord } from "@/types";
import DigitalMembershipCard from "@/components/DigitalMembershipCard";
import MembershipCertificate from "@/components/MembershipCertificate";

const SAMPLE_MEMBER: MemberRecord = {
  membershipNumber: "ADPAP-I-2026-00125",
  fullNameOrOrg: "Juan Dela Cruz",
  membershipType: "individual",
  status: "active",
  startDate: "2026-01-15",
  expirationDate: "2027-01-15",
  foundingMember: true,
  benefits: {
    dpiaBuilder: true,
    conventionDiscount: true,
    examReview: { total: 1, used: 0 },
    examRetakeDiscount: true,
    merchandiseDiscount: true,
    trainingVouchers: [],
  },
};

export default function DigitalIDShowcase() {
  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-sm">
          <span className="pointer-events-none absolute -right-3 -top-3 z-10 rotate-3 rounded bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-700/50 shadow-card">
            Sample
          </span>
          <DigitalMembershipCard member={SAMPLE_MEMBER} />
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute -right-3 -top-3 z-10 rotate-3 rounded bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy-700/50 shadow-card">
            Sample
          </span>
          <MembershipCertificate member={SAMPLE_MEMBER} />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <p className="max-w-md text-sm text-navy-700/60">
          Every ADPAP member receives a professional digital membership identity with built-in
          verification — a QR code that confirms it's real, current, and active.
        </p>
        <Link to="/verify" className="btn-outline">
          Verify a Membership
        </Link>
      </div>
    </div>
  );
}
