import { ApplicationFormState } from "@/types";

export type Errors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateApplicantStep(form: ApplicationFormState): Errors {
  const a = form.applicant;
  const errors: Errors = {};
  if (!a.fullName.trim()) errors.fullName = "Full name is required.";
  if (!a.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_RE.test(a.email)) errors.email = "Enter a valid email address.";
  if (!a.mobile.trim()) errors.mobile = "Mobile number is required.";
  if (!a.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
  if (!a.address.trim()) errors.address = "Address is required.";
  if (!a.cityProvince.trim()) errors.cityProvince = "City / Province is required.";
  if (!a.company.trim()) errors.company = "Company / organization is required.";
  if (!a.positionTitle.trim()) errors.positionTitle = "Position / job title is required.";
  if (!a.industry.trim()) errors.industry = "Industry is required.";
  if (!a.yearsExperience.trim()) errors.yearsExperience = "Years of experience is required.";
  if (!a.currentResponsibilities.trim()) errors.currentResponsibilities = "Please describe your current responsibilities.";
  if (!a.reasonForJoining.trim()) errors.reasonForJoining = "Please share your reason for joining.";
  return errors;
}

export function validateOrganizationStep(form: ApplicationFormState): {
  org: Errors;
  reps: Errors[];
} {
  const o = form.organization;
  const org: Errors = {};
  if (!o.organizationName.trim()) org.organizationName = "Organization name is required.";
  if (!o.organizationType.trim()) org.organizationType = "Organization type is required.";
  if (!o.industry.trim()) org.industry = "Industry is required.";
  if (!o.officeAddress.trim()) org.officeAddress = "Office address is required.";
  if (!o.mainContactName.trim()) org.mainContactName = "Main contact name is required.";
  if (!o.mainContactPosition.trim()) org.mainContactPosition = "Main contact position is required.";
  if (!o.mainContactEmail.trim()) org.mainContactEmail = "Main contact email is required.";
  else if (!EMAIL_RE.test(o.mainContactEmail)) org.mainContactEmail = "Enter a valid email address.";
  if (!o.mainContactNumber.trim()) org.mainContactNumber = "Main contact number is required.";

  const reps: Errors[] = form.representatives.map((r) => {
    const e: Errors = {};
    if (!r.fullName.trim()) e.fullName = "Required.";
    if (!r.email.trim()) e.email = "Required.";
    else if (!EMAIL_RE.test(r.email)) e.email = "Invalid email.";
    if (!r.mobile.trim()) e.mobile = "Required.";
    if (!r.position.trim()) e.position = "Required.";
    if (!r.dataPrivacyRole.trim()) e.dataPrivacyRole = "Required.";
    return e;
  });

  return { org, reps };
}

export function validatePaymentStep(form: ApplicationFormState): Errors {
  const p = form.payment;
  const errors: Errors = {};
  if (!p.method) {
    errors.method = "Select a payment method.";
    return errors;
  }

  if (p.method === "bill_company") {
    if (!p.billingCompanyName?.trim()) errors.billingCompanyName = "Company name is required.";
    if (!p.billingContactPerson?.trim()) errors.billingContactPerson = "Person to be billed is required.";
    if (!p.billingCompanyAddress?.trim()) errors.billingCompanyAddress = "Company address is required.";
    if (!p.billingEmail?.trim()) errors.billingEmail = "Email address is required.";
    else if (!EMAIL_RE.test(p.billingEmail)) errors.billingEmail = "Enter a valid email address.";
    if (!p.billingMobile?.trim()) errors.billingMobile = "Mobile number is required.";
    return errors;
  }

  if (!p.amountPaid.trim()) errors.amountPaid = "Amount paid is required.";
  if (!p.paymentDate) errors.paymentDate = "Payment date is required.";
  if (!p.referenceNumber.trim()) errors.referenceNumber = "Reference number is required.";
  if (!p.payorName.trim()) errors.payorName = "Payor name is required.";
  // Proof of payment is optional — applicants may send it to the Secretariat afterward.
  return errors;
}

export function validateDeclarationStep(form: ApplicationFormState): string | undefined {
  const d = form.declaration;
  if (!d.certifyTrue || !d.understandNoGuarantee || !d.agreePolicies || !d.consentProcessing || !d.acknowledgeOperator) {
    return "Please confirm all five statements to continue.";
  }
  return undefined;
}

export function hasErrors(errors: Errors): boolean {
  return Object.keys(errors).length > 0;
}
