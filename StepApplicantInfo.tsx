import { ApplicantInfo } from "@/types";
import { TextField, SelectField, TextAreaField, CheckboxField, FieldsetTitle } from "@/components/form/Field";

interface Props {
  data: ApplicantInfo;
  errors: Partial<Record<keyof ApplicantInfo, string>>;
  onChange: (patch: Partial<ApplicantInfo>) => void;
}

export default function StepApplicantInfo({ data, errors, onChange }: Props) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-xl font-semibold text-navy-950">Applicant information</h2>
        <p className="mt-1.5 text-sm text-navy-700/65">Tell us about you.</p>
      </div>

      <section>
        <FieldsetTitle>Personal details</FieldsetTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Full Name" required value={data.fullName} error={errors.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })} placeholder="Juan Dela Cruz" />
          <TextField label="Preferred Name" value={data.preferredName}
            onChange={(e) => onChange({ preferredName: e.target.value })} placeholder="Juan" />
          <TextField label="Email Address" type="email" required value={data.email} error={errors.email}
            onChange={(e) => onChange({ email: e.target.value })} placeholder="juan@company.com" />
          <TextField label="Mobile Number" required value={data.mobile} error={errors.mobile}
            onChange={(e) => onChange({ mobile: e.target.value })} placeholder="09XX XXX XXXX" />
          <TextField label="Date of Birth" type="date" required value={data.dateOfBirth} error={errors.dateOfBirth}
            onChange={(e) => onChange({ dateOfBirth: e.target.value })} />
          <SelectField label="Gender" value={data.gender} onChange={(e) => onChange({ gender: e.target.value })}>
            <option value="">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Other</option>
          </SelectField>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <TextAreaField label="Complete Address" required value={data.address} error={errors.address}
            onChange={(e) => onChange({ address: e.target.value })} className="sm:col-span-2" />
          <TextField label="City / Province" required value={data.cityProvince} error={errors.cityProvince}
            onChange={(e) => onChange({ cityProvince: e.target.value })} placeholder="Makati City, Metro Manila" />
        </div>
      </section>

      <section>
        <FieldsetTitle>Employment</FieldsetTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Company / Organization" required value={data.company} error={errors.company}
            onChange={(e) => onChange({ company: e.target.value })} />
          <TextField label="Position / Job Title" required value={data.positionTitle} error={errors.positionTitle}
            onChange={(e) => onChange({ positionTitle: e.target.value })} />
          <TextField label="Industry" required value={data.industry} error={errors.industry}
            onChange={(e) => onChange({ industry: e.target.value })} placeholder="BPO, Banking, Healthcare, etc." />
          <TextField label="Years of Experience" type="number" min={0} required value={data.yearsExperience} error={errors.yearsExperience}
            onChange={(e) => onChange({ yearsExperience: e.target.value })} />
          <TextField label="LinkedIn Profile" value={data.linkedIn}
            onChange={(e) => onChange({ linkedIn: e.target.value })} placeholder="linkedin.com/in/..." />
          <TextField label="Facebook Profile" value={data.facebook}
            onChange={(e) => onChange({ facebook: e.target.value })} placeholder="facebook.com/..." />
        </div>
      </section>

      <section>
        <FieldsetTitle>Professional information</FieldsetTitle>
        <div className="space-y-3">
          <CheckboxField label="I am currently a Data Protection Officer (DPO)" checked={data.isDpo}
            onChange={(v) => onChange({ isDpo: v })} />
          <CheckboxField label="I am an Alternate DPO" checked={data.isAlternateDpo}
            onChange={(v) => onChange({ isAlternateDpo: v })} />
          <CheckboxField label="I am involved in Data Privacy or Compliance work" checked={data.involvedInCompliance}
            onChange={(v) => onChange({ involvedInCompliance: v })} />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <TextField label="Data Privacy Training Completed" value={data.trainingCompleted}
            onChange={(e) => onChange({ trainingCompleted: e.target.value })} placeholder="e.g. DPO Certification Course" />
          <TextField label="Training Provider" value={data.trainingProvider}
            onChange={(e) => onChange({ trainingProvider: e.target.value })} />
          <TextField label="Training Completion Date" type="date" value={data.trainingCompletionDate}
            onChange={(e) => onChange({ trainingCompletionDate: e.target.value })} />
          <TextField label="Certifications Held" value={data.certificationsHeld}
            onChange={(e) => onChange({ certificationsHeld: e.target.value })} placeholder="e.g. CDPO, CIPP/A" />
          <TextField label="Certification Number" value={data.certificationNumber}
            onChange={(e) => onChange({ certificationNumber: e.target.value })} />
        </div>

        <div className="mt-5 grid gap-5">
          <TextAreaField label="Current privacy-related responsibilities" required value={data.currentResponsibilities}
            error={errors.currentResponsibilities}
            onChange={(e) => onChange({ currentResponsibilities: e.target.value })} />
          <TextAreaField label="Brief reason for joining ADPAP" required value={data.reasonForJoining}
            error={errors.reasonForJoining}
            onChange={(e) => onChange({ reasonForJoining: e.target.value })} />
        </div>

        <div className="mt-6 rounded-lg border border-navy-900/10 bg-mist-50 p-5">
          <CheckboxField
            label="I have previously attended a GlobalKnowledge PH Data Privacy Training or Certification."
            checked={data.attendedGkTraining}
            onChange={(v) => onChange({ attendedGkTraining: v })}
          />
          {data.attendedGkTraining && (
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <TextField label="Program Attended" value={data.gkProgramAttended}
                onChange={(e) => onChange({ gkProgramAttended: e.target.value })} />
              <TextField label="Approximate Date" type="date" value={data.gkApproxDate}
                onChange={(e) => onChange({ gkApproxDate: e.target.value })} />
              <TextField label="Certificate Number (if available)" value={data.gkCertificateNumber}
                onChange={(e) => onChange({ gkCertificateNumber: e.target.value })} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
