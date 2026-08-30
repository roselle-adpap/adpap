import { MembershipPlan } from "@/types";

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "individual",
    name: "Individual Professional",
    price: 5000,
    priceLabel: "₱5,000",
    tagline: "For professionals who want to stay current, capable, and connected.",
    highlight:
      "Your ₱5,000 membership already includes access to a DPIA Builder valued at ₱9,000.",
    representatives: 1,
    indicativeValue: "Up to ~₱25,000 in potential training savings + tools",
    benefits: [
      "20%–50% discount on selected GlobalKnowledge PH Data Privacy Training Programs",
      "1-year DPIA Builder access (value: ₱9,000)",
      "20% discount on National Data Privacy Conventions",
      "Eligible to participate in ADPAP Election of Officers, subject to membership rules",
      "Access to selected video recordings",
      "Access to the latest DPO and Data Privacy updates",
      "1 Free Certification Exam Review Session",
      "20% discount on eligible exam retakes",
      "10% discount on ADPAP / DPO merchandise",
      "Official ADPAP Membership ID",
      "Digital Certificate of Membership",
    ],
    trainingBenefits: [],
  },
  {
    id: "institutional",
    name: "Institutional",
    price: 15000,
    priceLabel: "₱15,000",
    tagline: "Build stronger privacy capability within your organization.",
    highlight: "₱28,000+ indicative value for only ₱15,000/year.",
    representatives: 2,
    indicativeValue: "₱28,000+ indicative value",
    benefits: [
      "2 official organization representatives",
      "Each representative enjoys all Individual Membership benefits (value: ₱10,000)",
      "1 Free DPO Novice Training (value: ₱18,000)",
      "Institutional recognition",
      "Participation in applicable ADPAP activities",
      "Membership ID and Certificates for representatives",
    ],
    trainingBenefits: ["DPO Novice Training"],
  },
  {
    id: "premium_institutional",
    name: "Premium Institutional",
    price: 35000,
    priceLabel: "₱35,000",
    tagline: "Build your organization's complete privacy team.",
    highlight: "₱63,000+ indicative value before other discounts and benefits.",
    representatives: 3,
    recommended: true,
    indicativeValue: "₱63,000+ indicative value",
    benefits: [
      "3 official organization representatives",
      "Each representative enjoys all Individual Membership benefits",
      "1 Free DPO Novice Training (value: ₱18,000)",
      "1 Free DPO 2.0 Self-Paced Training (value: ₱15,000)",
      "1 Free DPO 3.0 Self-Paced Training (value: ₱15,000)",
      "Institutional recognition",
      "Membership IDs and Certificates for all representatives",
    ],
    trainingBenefits: ["DPO Novice Training", "DPO 2.0 Self-Paced Training", "DPO 3.0 Self-Paced Training"],
  },
];

export function getPlan(id: string | undefined | null) {
  return MEMBERSHIP_PLANS.find((p) => p.id === id);
}

export function formatPHP(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
}
