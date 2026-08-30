import { OrganizationInfo, Representative } from "@/types";
import { TextField, TextAreaField, FieldsetTitle } from "@/components/form/Field";

interface Props {
  org: OrganizationInfo;
  orgErrors: Partial<Record<keyof OrganizationInfo, string>>;
  onOrgChange: (patch: Partial<OrganizationInfo>) => void;
  representatives: Representative[];
  repErrors: Partial<Record<keyof Representative, string>>[];
  onRepChange: (index: number, patch: Partial<Representative>) => void;
  requiredReps: number;
}

const ORDINALS = ["First", "Second", "Third"];

export default function StepOrganizationInfo({
  org,
  orgErrors,
  onOrgChange,
  representatives,
  repErrors,
  onRepChange,
  requiredReps,
}: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold text-navy-950">Organization information</h2>
        <p className="mt-1.5 text-sm text-navy-700/65">
          This membership includes {requiredReps} official representative{requiredReps > 1 ? "s" : ""}.
        </p>
      </div>

      <section>
        <FieldsetTitle>Organization</FieldsetTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Organization Name" required value={org.organizationName} error={orgErrors.organizationName}
            onChange={(e) => onOrgChange({ organizationName: e.target.value })} className="sm:col-span-2" />
          <TextField label="Business / Organization Type" required value={org.organizationType} error={orgErrors.organizationType}
            onChange={(e) => onOrgChange({ organizationType: e.target.value })} placeholder="Corporation, NGO, Government, etc." />
          <TextField label="Industry" required value={org.industry} error={orgErrors.industry}
            onChange={(e) => onOrgChange({ industry: e.target.value })} />
          <TextAreaField label="Office Address" required value={org.officeAddress} error={orgErrors.officeAddress}
            onChange={(e) => onOrgChange({ officeAddress: e.target.value })} className="sm:col-span-2" />
          <TextField label="Website" value={org.website}
            onChange={(e) => onOrgChange({ website: e.target.value })} placeholder="https://" />
        </div>
      </section>

      <section>
        <FieldsetTitle subtitle="The person we should contact regarding this application and membership account.">
          Main contact person
        </FieldsetTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Full Name" required value={org.mainContactName} error={orgErrors.mainContactName}
            onChange={(e) => onOrgChange({ mainContactName: e.target.value })} />
          <TextField label="Position" required value={org.mainContactPosition} error={orgErrors.mainContactPosition}
            onChange={(e) => onOrgChange({ mainContactPosition: e.target.value })} />
          <TextField label="Contact Email" type="email" required value={org.mainContactEmail} error={orgErrors.mainContactEmail}
            onChange={(e) => onOrgChange({ mainContactEmail: e.target.value })} />
          <TextField label="Contact Number" required value={org.mainContactNumber} error={orgErrors.mainContactNumber}
            onChange={(e) => onOrgChange({ mainContactNumber: e.target.value })} />
        </div>
      </section>

      <section>
        <FieldsetTitle subtitle="Each representative receives applicable Individual Professional Membership benefits.">
          Official representatives
        </FieldsetTitle>
        <div className="space-y-6">
          {representatives.map((rep, i) => (
            <div key={i} className="rounded-lg border border-navy-900/10 p-5">
              <p className="mb-4 text-sm font-semibold text-navy-900">
                {ORDINALS[i] ?? `#${i + 1}`} representative
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Full Name" required value={rep.fullName} error={repErrors[i]?.fullName}
                  onChange={(e) => onRepChange(i, { fullName: e.target.value })} />
                <TextField label="Email" type="email" required value={rep.email} error={repErrors[i]?.email}
                  onChange={(e) => onRepChange(i, { email: e.target.value })} />
                <TextField label="Mobile" required value={rep.mobile} error={repErrors[i]?.mobile}
                  onChange={(e) => onRepChange(i, { mobile: e.target.value })} />
                <TextField label="Position" required value={rep.position} error={repErrors[i]?.position}
                  onChange={(e) => onRepChange(i, { position: e.target.value })} />
                <TextField label="Data Privacy Role" required value={rep.dataPrivacyRole} error={repErrors[i]?.dataPrivacyRole}
                  onChange={(e) => onRepChange(i, { dataPrivacyRole: e.target.value })}
                  placeholder="DPO, Alternate DPO, Compliance Officer, etc." className="sm:col-span-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="rounded-lg border border-royal-600/20 bg-royal-600/5 p-5">
        <p className="text-sm font-semibold text-navy-900">About your free training &amp; exam review benefits</p>
        <p className="mt-2 text-sm leading-relaxed text-navy-700/80">
          You don't need to nominate anyone right now. Once your membership is approved, ADPAP
          will issue voucher numbers for your free DPO training(s) and other seat-based benefits.
          You can coordinate directly with the Secretariat at{" "}
          <a href="mailto:secretariat@gkphilippines.com" className="font-medium text-royal-600 hover:underline">
            secretariat@gkphilippines.com
          </a>{" "}
          to redeem a voucher and nominate an attendee whenever you're ready — this year, or later
          when you have a new hire or a different staff member to send.
        </p>
      </div>
    </div>
  );
}
