import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StepIndicator from "@/components/apply/StepIndicator";
import StepMembershipType from "@/components/apply/StepMembershipType";
import StepApplicantInfo from "@/components/apply/StepApplicantInfo";
import StepOrganizationInfo from "@/components/apply/StepOrganizationInfo";
import StepPayment from "@/components/apply/StepPayment";
import StepDeclaration from "@/components/apply/StepDeclaration";
import StepReview from "@/components/apply/StepReview";
import Confirmation from "@/components/apply/Confirmation";
import { ApplicationFormState, MembershipType, SubmittedApplication } from "@/types";
import { initialFormState, representativeCountFor, emptyRepresentative } from "@/lib/formState";
import {
  validateApplicantStep,
  validateOrganizationStep,
  validatePaymentStep,
  validateDeclarationStep,
  hasErrors,
  Errors,
} from "@/lib/validation";
import { submitApplication } from "@/lib/applications";
import { getPlan } from "@/data/membershipPlans";

export default function ApplyPage() {
  const [searchParams] = useSearchParams();
  const preselect = searchParams.get("type") as MembershipType | null;

  const [form, setForm] = useState<ApplicationFormState>(() =>
    initialFormState(preselect && ["individual", "institutional", "premium_institutional"].includes(preselect) ? preselect : "")
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [applicantErrors, setApplicantErrors] = useState<Errors>({});
  const [orgErrors, setOrgErrors] = useState<Errors>({});
  const [repErrors, setRepErrors] = useState<Errors[]>([]);
  const [paymentErrors, setPaymentErrors] = useState<Errors>({});
  const [declarationError, setDeclarationError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ app: SubmittedApplication; demo: boolean } | null>(null);

  const isIndividual = form.membershipType === "individual";
  const isOrg = form.membershipType === "institutional" || form.membershipType === "premium_institutional";

  // Sync representatives array length to membership type
  useEffect(() => {
    if (!isOrg) return;
    const needed = representativeCountFor(form.membershipType);
    setForm((f) => {
      if (f.representatives.length === needed) return f;
      const reps = [...f.representatives];
      while (reps.length < needed) reps.push(emptyRepresentative());
      reps.length = needed;
      return { ...f, representatives: reps };
    });
  }, [form.membershipType, isOrg]);

  const steps = useMemo(() => {
    if (isIndividual) {
      return ["Membership Type", "Applicant Information", "Payment", "Declaration", "Review"];
    }
    if (isOrg) {
      return ["Membership Type", "Organization & Representatives", "Payment", "Declaration", "Review"];
    }
    return ["Membership Type"];
  }, [isIndividual, isOrg]);

  const plan = getPlan(form.membershipType);

  function goNext() {
    setSubmitError(null);
    // Validate current logical step before advancing
    if (stepIndex === 0) {
      if (!form.membershipType) return;
      setStepIndex(1);
      return;
    }

    if (isIndividual) {
      if (stepIndex === 1) {
        const errs = validateApplicantStep(form);
        setApplicantErrors(errs);
        if (hasErrors(errs)) return;
      } else if (stepIndex === 2) {
        const errs = validatePaymentStep(form);
        setPaymentErrors(errs);
        if (hasErrors(errs)) return;
      } else if (stepIndex === 3) {
        const err = validateDeclarationStep(form);
        setDeclarationError(err);
        if (err) return;
      }
    } else if (isOrg) {
      if (stepIndex === 1) {
        const { org, reps } = validateOrganizationStep(form);
        setOrgErrors(org);
        setRepErrors(reps);
        if (hasErrors(org) || reps.some(hasErrors)) return;
      } else if (stepIndex === 2) {
        const errs = validatePaymentStep(form);
        setPaymentErrors(errs);
        if (hasErrors(errs)) return;
      } else if (stepIndex === 3) {
        const err = validateDeclarationStep(form);
        setDeclarationError(err);
        if (err) return;
      }
    }

    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStepIndex((i) => Math.max(i - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    const res = await submitApplication(form);
    setSubmitting(false);
    if (res.ok && res.application) {
      setResult({ app: res.application, demo: res.mode === "demo" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitError(res.error ?? "Something went wrong while submitting your application. Please try again.");
    }
  }

  if (result) {
    return (
      <div className="section py-16">
        <Confirmation application={result.app} demoMode={result.demo} />
      </div>
    );
  }

  const isReviewStep = stepIndex === steps.length - 1 && steps.length > 1;

  return (
    <div className="section py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <StepIndicator steps={steps} currentStep={stepIndex} />

        <div className="mt-10">
          {stepIndex === 0 && (
            <>
              <div className="mb-8 rounded-lg border border-navy-900/10 bg-mist-50 p-5">
                <p className="text-sm font-semibold text-navy-900">Before you begin</p>
                <p className="mt-1 text-xs text-navy-700/60">Have these ready and this should take just a few minutes:</p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  <li className="flex items-start gap-2 text-xs text-navy-700/75">
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-royal-600" />
                    Basic professional information
                  </li>
                  <li className="flex items-start gap-2 text-xs text-navy-700/75">
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-royal-600" />
                    Organization details, if applying institutionally
                  </li>
                  <li className="flex items-start gap-2 text-xs text-navy-700/75">
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-royal-600" />
                    Representative details, if applicable
                  </li>
                  <li className="flex items-start gap-2 text-xs text-navy-700/75">
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-royal-600" />
                    Proof of payment, if already coordinated
                  </li>
                </ul>
                <p className="mt-3 text-xs text-navy-700/50">
                  Need assistance? Email{" "}
                  <a href="mailto:secretariat@gkphilippines.com" className="text-royal-600 hover:underline">
                    secretariat@gkphilippines.com
                  </a>
                </p>
              </div>
              <StepMembershipType
                value={form.membershipType}
                onChange={(v) => setForm((f) => ({ ...initialFormState(v) }))}
              />
            </>
          )}

          {isIndividual && stepIndex === 1 && (
            <StepApplicantInfo
              data={form.applicant}
              errors={applicantErrors}
              onChange={(patch) => setForm((f) => ({ ...f, applicant: { ...f.applicant, ...patch } }))}
            />
          )}
          {isIndividual && stepIndex === 2 && (
            <StepPayment
              amountDue={plan?.price ?? 0}
              data={form.payment}
              errors={paymentErrors}
              onChange={(patch) => setForm((f) => ({ ...f, payment: { ...f.payment, ...patch } }))}
            />
          )}
          {isIndividual && stepIndex === 3 && (
            <StepDeclaration
              data={form.declaration}
              error={declarationError}
              onChange={(patch) => setForm((f) => ({ ...f, declaration: { ...f.declaration, ...patch } }))}
            />
          )}

          {isOrg && stepIndex === 1 && (
            <StepOrganizationInfo
              org={form.organization}
              orgErrors={orgErrors}
              onOrgChange={(patch) => setForm((f) => ({ ...f, organization: { ...f.organization, ...patch } }))}
              representatives={form.representatives}
              repErrors={repErrors}
              onRepChange={(index, patch) =>
                setForm((f) => {
                  const reps = [...f.representatives];
                  reps[index] = { ...reps[index], ...patch };
                  return { ...f, representatives: reps };
                })
              }
              requiredReps={representativeCountFor(form.membershipType)}
            />
          )}
          {isOrg && stepIndex === 2 && (
            <StepPayment
              amountDue={plan?.price ?? 0}
              data={form.payment}
              errors={paymentErrors}
              onChange={(patch) => setForm((f) => ({ ...f, payment: { ...f.payment, ...patch } }))}
            />
          )}
          {isOrg && stepIndex === 3 && (
            <StepDeclaration
              data={form.declaration}
              error={declarationError}
              onChange={(patch) => setForm((f) => ({ ...f, declaration: { ...f.declaration, ...patch } }))}
            />
          )}

          {isReviewStep && <StepReview form={form} onEditStep={(i) => setStepIndex(i)} />}
        </div>

        {submitError && (
          <div className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {submitError}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between border-t border-navy-900/8 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={stepIndex === 0}
            className="btn-outline disabled:invisible"
          >
            Back
          </button>

          {isReviewStep ? (
            <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-gold">
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          ) : (
            <button type="button" onClick={goNext} disabled={stepIndex === 0 && !form.membershipType} className="btn-primary">
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
