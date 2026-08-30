import { ApplicationFormState, MembershipType, Representative } from "@/types";

export function emptyRepresentative(): Representative {
  return { fullName: "", email: "", mobile: "", position: "", dataPrivacyRole: "" };
}

export function initialFormState(membershipType: MembershipType | "" = ""): ApplicationFormState {
  return {
    membershipType,
    applicant: {
      fullName: "",
      preferredName: "",
      email: "",
      mobile: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      cityProvince: "",
      company: "",
      positionTitle: "",
      industry: "",
      yearsExperience: "",
      linkedIn: "",
      facebook: "",
      isDpo: false,
      isAlternateDpo: false,
      involvedInCompliance: false,
      trainingCompleted: "",
      trainingProvider: "",
      trainingCompletionDate: "",
      certificationsHeld: "",
      certificationNumber: "",
      currentResponsibilities: "",
      reasonForJoining: "",
      attendedGkTraining: false,
      gkProgramAttended: "",
      gkApproxDate: "",
      gkCertificateNumber: "",
    },
    organization: {
      organizationName: "",
      organizationType: "",
      industry: "",
      officeAddress: "",
      website: "",
      mainContactName: "",
      mainContactPosition: "",
      mainContactEmail: "",
      mainContactNumber: "",
    },
    representatives: [],
    payment: {
      method: "",
      amountPaid: "",
      paymentDate: "",
      referenceNumber: "",
      payorName: "",
    },
    declaration: {
      certifyTrue: false,
      understandNoGuarantee: false,
      agreePolicies: false,
      consentProcessing: false,
      acknowledgeOperator: false,
    },
  };
}

export function representativeCountFor(type: MembershipType | ""): number {
  if (type === "institutional") return 2;
  if (type === "premium_institutional") return 3;
  return 0;
}
