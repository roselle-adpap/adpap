import type { ReactNode } from "react";
import { ApplicationFormState } from "@/types";
import { getPlan, formatPHP } from "@/data/membershipPlans";

interface Props {
  form: ApplicationFormState;
  onEditStep: (step: number) => void;
}

function ReviewRow({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value === "" || value === undefined || value === null) return null;
  return (
    <div className="grid grid-cols-[1fr_1.4fr] gap-3 py-1.5 text-sm">
      <span className="text-navy-700/55">{label}</span>
      <span className="font-medium text-navy-900">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </span>
    </div>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-navy-900">{title}</h3>
        <button type="button" onClick={onEdit} className="text-xs font-semibold text-royal-600 hover:underline">
          Edit
        </button>
      </div>
      <div className="divide-y divide-navy-900/5">{children}</div>
    </div>
  );
}

export default function StepReview({ form, onEditStep }: Props) {
  const plan = getPlan(form.membershipType);
  const isIndividual = form.membershipType === "individual";
  const isOrg = form.membershipType === "institutional" || form.membershipType === "premium_institutional";

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy-950">Review your application</h2>
      <p className="mt-1.5 text-sm text-navy-700/65">
        Please check everything carefully before submitting. You can edit any section below.
      </p>

      <div className="mt-7 space-y-5">
        <ReviewCard title="Membership" onEdit={() => onEditStep(0)}>
          <ReviewRow label="Category" value={plan?.name} />
          <ReviewRow label="Annual fee" value={plan ? formatPHP(plan.price) : undefined} />
        </ReviewCard>

        {isIndividual && (
          <ReviewCard title="Applicant Information" onEdit={() => onEditStep(1)}>
            <ReviewRow label="Full Name" value={form.applicant.fullName} />
            <ReviewRow label="Email" value={form.applicant.email} />
            <ReviewRow label="Mobile" value={form.applicant.mobile} />
            <ReviewRow label="Date of Birth" value={form.applicant.dateOfBirth} />
            <ReviewRow label="Address" value={form.applicant.address} />
            <ReviewRow label="City / Province" value={form.applicant.cityProvince} />
            <ReviewRow label="Company" value={form.applicant.company} />
            <ReviewRow label="Position" value={form.applicant.positionTitle} />
            <ReviewRow label="Industry" value={form.applicant.industry} />
            <ReviewRow label="Years of Experience" value={form.applicant.yearsExperience} />
            <ReviewRow label="Currently a DPO" value={form.applicant.isDpo} />
            <ReviewRow label="Alternate DPO" value={form.applicant.isAlternateDpo} />
            <ReviewRow label="Certifications Held" value={form.applicant.certificationsHeld} />
            <ReviewRow label="Reason for joining" value={form.applicant.reasonForJoining} />
          </ReviewCard>
        )}

        {isOrg && (
          <>
            <ReviewCard title="Organization" onEdit={() => onEditStep(1)}>
              <ReviewRow label="Organization Name" value={form.organization.organizationName} />
              <ReviewRow label="Type" value={form.organization.organizationType} />
              <ReviewRow label="Industry" value={form.organization.industry} />
              <ReviewRow label="Office Address" value={form.organization.officeAddress} />
              <ReviewRow label="Website" value={form.organization.website} />
              <ReviewRow label="Main Contact" value={form.organization.mainContactName} />
              <ReviewRow label="Contact Email" value={form.organization.mainContactEmail} />
              <ReviewRow label="Contact Number" value={form.organization.mainContactNumber} />
            </ReviewCard>
            <ReviewCard title="Representatives" onEdit={() => onEditStep(1)}>
              {form.representatives.map((r, i) => (
                <div key={i} className="py-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-royal-600">Rep {i + 1}</p>
                  <ReviewRow label="Name" value={r.fullName} />
                  <ReviewRow label="Email" value={r.email} />
                  <ReviewRow label="Mobile" value={r.mobile} />
                  <ReviewRow label="Position" value={r.position} />
                </div>
              ))}
            </ReviewCard>
          </>
        )}

        <ReviewCard title="Payment" onEdit={() => onEditStep(2)}>
          <ReviewRow label="Method" value={form.payment.method} />
          {form.payment.method === "bill_company" ? (
            <>
              <ReviewRow label="Company Name" value={form.payment.billingCompanyName} />
              <ReviewRow label="Person to be Billed" value={form.payment.billingContactPerson} />
              <ReviewRow label="Company Address" value={form.payment.billingCompanyAddress} />
              <ReviewRow label="Email Address" value={form.payment.billingEmail} />
              <ReviewRow label="Mobile Number" value={form.payment.billingMobile} />
            </>
          ) : (
            <>
              <ReviewRow label="Amount Paid" value={form.payment.amountPaid ? `₱${form.payment.amountPaid}` : undefined} />
              <ReviewRow label="Payment Date" value={form.payment.paymentDate} />
              <ReviewRow label="Reference Number" value={form.payment.referenceNumber} />
              <ReviewRow label="Proof of Payment" value={form.payment.proofFileName ?? "Not attached — will be sent separately"} />
            </>
          )}
        </ReviewCard>

        <div className="flex items-center justify-between rounded-lg bg-navy-950 px-6 py-5 text-white">
          <span className="text-sm font-medium text-white/70">Total membership fee</span>
          <span className="text-2xl font-bold text-gold-400">{plan ? formatPHP(plan.price) : "—"}</span>
        </div>
      </div>
    </div>
  );
}
