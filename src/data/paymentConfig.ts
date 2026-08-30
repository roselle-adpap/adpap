// Payment methods for ADPAP membership applications.
// -----------------------------------------------------------------------
// Real payment details are filled in below, as provided by GlobalKnowledge
// PH / ADPAP Secretariat. To update or add a method, edit an entry below
// and set `enabled: true`/`false` to show or hide it on the application
// form. The GCash/Maya account name is intentionally partially masked
// (as provided) for the account holder's privacy on the public site.
// -----------------------------------------------------------------------

export interface PaymentMethodConfig {
  id: "bank_transfer" | "gcash" | "maya" | "bill_company" | "other";
  label: string;
  enabled: boolean;
  instructions?: string;
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
}

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: "bank_transfer",
    label: "Bank Deposit (BDO)",
    enabled: true,
    bankName: "BDO Unibank",
    accountName: "GlobalKnowledge PH, Inc.",
    accountNumber: "00466-0143824",
    instructions:
      "Deposit or transfer to the BDO account below, then upload your proof of payment and email a copy together with your member details to secretariat@gkphilippines.com.",
  },
  {
    id: "gcash",
    label: "GCash",
    enabled: true,
    accountName: "Ro*** R**",
    accountNumber: "0916-292-1470",
    instructions:
      "Send payment via GCash to the number below, then upload your proof of payment and email a copy together with your member details to secretariat@gkphilippines.com.",
  },
  {
    id: "maya",
    label: "Maya",
    enabled: true,
    accountName: "Ro*** R**",
    accountNumber: "0916-292-1470",
    instructions:
      "Send payment via Maya to the number below, then upload your proof of payment and email a copy together with your member details to secretariat@gkphilippines.com.",
  },
  {
    id: "bill_company",
    label: "Bill My Company",
    enabled: true,
    instructions:
      "Provide your company's billing details below and the Secretariat will send an invoice for the membership fee to the person and email address you indicate.",
  },
  {
    id: "other",
    label: "Other / To be advised",
    enabled: true,
    instructions:
      "Payment Instructions will be provided by the ADPAP Secretariat after your application is reviewed.",
  },
];

export const DEFAULT_PAYMENT_NOTICE =
  "Payment Instructions will be provided by the ADPAP Secretariat. You may proceed with your application now and settle payment once instructions are sent to your email, or upload proof of payment now if you have already coordinated with the Secretariat.";
