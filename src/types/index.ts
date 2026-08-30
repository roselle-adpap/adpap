// Core domain types for the ADPAP Membership Application & Member Portal.
// These mirror the Supabase schema in /supabase/schema.sql

export type MembershipType = "individual" | "institutional" | "premium_institutional";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "for_review"
  | "payment_verification"
  | "approved"
  | "active"
  | "rejected"
  | "expired"
  | "renewal_due";

export type PaymentMethod = "bank_transfer" | "gcash" | "maya" | "bill_company" | "other";

export interface MembershipPlan {
  id: MembershipType;
  name: string;
  price: number;
  priceLabel: string;
  tagline: string;
  highlight: string;
  representatives: number;
  recommended?: boolean;
  indicativeValue: string;
  benefits: string[];
  trainingBenefits: string[];
}

export interface Representative {
  fullName: string;
  email: string;
  mobile: string;
  position: string;
  dataPrivacyRole: string;
}

export interface TrainingVoucher {
  benefit: string;
  code: string;
  redeemed: boolean;
}

export interface ApplicantInfo {
  fullName: string;
  preferredName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender?: string;
  address: string;
  cityProvince: string;
  company: string;
  positionTitle: string;
  industry: string;
  yearsExperience: string;
  linkedIn?: string;
  facebook?: string;
  isDpo: boolean;
  isAlternateDpo: boolean;
  involvedInCompliance: boolean;
  trainingCompleted: string;
  trainingProvider: string;
  trainingCompletionDate: string;
  certificationsHeld: string;
  certificationNumber?: string;
  currentResponsibilities: string;
  reasonForJoining: string;
  attendedGkTraining: boolean;
  gkProgramAttended?: string;
  gkApproxDate?: string;
  gkCertificateNumber?: string;
}

export interface OrganizationInfo {
  organizationName: string;
  organizationType: string;
  industry: string;
  officeAddress: string;
  website?: string;
  mainContactName: string;
  mainContactPosition: string;
  mainContactEmail: string;
  mainContactNumber: string;
}

export interface PaymentInfo {
  method: PaymentMethod | "";
  amountPaid: string;
  paymentDate: string;
  referenceNumber: string;
  payorName: string;
  proofFileName?: string;
  proofFileBase64?: string;
  proofFileType?: string;
  /** Only used when method === "bill_company" */
  billingCompanyName?: string;
  billingContactPerson?: string;
  billingCompanyAddress?: string;
  billingEmail?: string;
  billingMobile?: string;
}

export interface DeclarationInfo {
  certifyTrue: boolean;
  understandNoGuarantee: boolean;
  agreePolicies: boolean;
  consentProcessing: boolean;
  acknowledgeOperator: boolean;
}

export interface ApplicationFormState {
  membershipType: MembershipType | "";
  applicant: ApplicantInfo;
  organization: OrganizationInfo;
  representatives: Representative[];
  payment: PaymentInfo;
  declaration: DeclarationInfo;
}

export interface SubmittedApplication extends ApplicationFormState {
  referenceNumber: string;
  status: ApplicationStatus;
  submittedAt: string;
  amountDue: number;
}

export interface MemberRecord {
  membershipNumber: string;
  fullNameOrOrg: string;
  membershipType: MembershipType;
  status: ApplicationStatus;
  startDate: string;
  expirationDate: string;
  organization?: string;
  foundingMember: boolean;
  benefits: {
    dpiaBuilder: boolean;
    conventionDiscount: boolean;
    examReview: { total: number; used: number };
    examRetakeDiscount: boolean;
    merchandiseDiscount: boolean;
    trainingVouchers: TrainingVoucher[];
  };
}
