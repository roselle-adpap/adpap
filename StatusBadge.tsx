import { ApplicationStatus } from "@/types";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  draft: "bg-mist-200 text-navy-700",
  submitted: "bg-royal-500/10 text-royal-700",
  for_review: "bg-amber-100 text-amber-800",
  payment_verification: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-700",
  active: "bg-emerald-600 text-white",
  rejected: "bg-rose-100 text-rose-700",
  expired: "bg-mist-300 text-navy-700",
  renewal_due: "bg-gold-400/25 text-gold-600",
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  for_review: "For Review",
  payment_verification: "Payment Verification",
  approved: "Approved",
  active: "Active",
  rejected: "Rejected",
  expired: "Expired",
  renewal_due: "Renewal Due",
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`badge ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}
