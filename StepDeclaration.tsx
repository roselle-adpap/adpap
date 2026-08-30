import { Link } from "react-router-dom";
import { DeclarationInfo } from "@/types";
import { CheckboxField } from "@/components/form/Field";
import { ORG } from "@/data/siteConfig";

interface Props {
  data: DeclarationInfo;
  error?: string;
  onChange: (patch: Partial<DeclarationInfo>) => void;
}

export default function StepDeclaration({ data, error, onChange }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-navy-950">Declaration and consent</h2>
      <p className="mt-1.5 text-sm text-navy-700/65">
        Please read and confirm the following before submitting your application.
      </p>

      <div className="mt-7 rounded-lg border border-navy-900/10 bg-mist-50 p-6">
        <h3 className="text-sm font-semibold text-navy-950">Data Privacy Notice</h3>
        <div className="mt-3 space-y-2 text-xs leading-relaxed text-navy-700/80">
          <p>
            <strong>What we collect:</strong> the information you provide in this application
            (identity, contact, professional, and payment details) and, where applicable,
            information about your organization and its representatives.
          </p>
          <p>
            <strong>Why we collect it:</strong> to evaluate and administer your membership
            application, deliver membership benefits, communicate with you about ADPAP
            activities, and maintain accurate membership records.
          </p>
          <p>
            <strong>Who may access it:</strong> the {ORG.acronym} Secretariat and authorized
            personnel of {ORG.operator} involved in membership administration. Publicly displayed
            information is limited to what appears on the Membership Verification page (name,
            membership number, category, status, validity).
          </p>
          <p>
            <strong>Retention:</strong> your information is retained for as long as your
            membership is active and for a reasonable period afterward for recordkeeping,
            renewal, and legitimate administrative purposes.
          </p>
          <p>
            <strong>Your rights:</strong> you may request access, correction, or deletion of your
            personal information, subject to our recordkeeping obligations, by contacting the
            Secretariat.
          </p>
          <p>
            {ORG.operator}, as operator of {ORG.acronym}, aims to process personal information
            responsibly and in accordance with applicable Philippine data protection
            requirements. For privacy concerns, contact{" "}
            <a href={`mailto:${ORG.secretariatEmail}`} className="text-royal-600 hover:underline">
              {ORG.secretariatEmail}
            </a>
            .
          </p>
        </div>
        <Link to="/privacy-notice" target="_blank" className="mt-3 inline-block text-xs font-semibold text-royal-600 hover:underline">
          Read the full Privacy Notice ↗
        </Link>
      </div>

      <div className="mt-7 space-y-4">
        <CheckboxField
          label="I certify that the information provided in this membership application is true and correct."
          checked={data.certifyTrue}
          onChange={(v) => onChange({ certifyTrue: v })}
        />
        <CheckboxField
          label="I understand that submission of this application does not automatically guarantee membership approval."
          checked={data.understandNoGuarantee}
          onChange={(v) => onChange({ understandNoGuarantee: v })}
        />
        <CheckboxField
          label={
            <>
              I agree to comply with ADPAP membership policies, Code of Conduct, and applicable
              rules. See{" "}
              <Link to="/terms" target="_blank" className="text-royal-600 hover:underline">
                Terms &amp; Conditions
              </Link>
              .
            </>
          }
          checked={data.agreePolicies}
          onChange={(v) => onChange({ agreePolicies: v })}
        />
        <CheckboxField
          label="I consent to the processing of my personal information for membership administration, communication, professional activities, membership benefits, and related legitimate purposes."
          checked={data.consentProcessing}
          onChange={(v) => onChange({ consentProcessing: v })}
        />
        <CheckboxField
          label={
            <>
              I understand that {ORG.acronym} is a professional membership community operated by{" "}
              {ORG.operator}, and that membership is subject to the {ORG.governanceDocumentName}.
            </>
          }
          checked={data.acknowledgeOperator}
          onChange={(v) => onChange({ acknowledgeOperator: v })}
        />
      </div>
      {error && <p className="field-error mt-3">{error}</p>}
    </div>
  );
}
