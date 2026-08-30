// =============================================================================
// ADPAP Site Configuration
// Centralizes editable business information so it isn't scattered across
// components. Membership prices/benefits stay in data/membershipPlans.ts
// (unchanged, per instruction not to rename/restructure working fields) —
// this file covers everything else: org identity, credibility statistics,
// the Founding Member campaign, and contact/social info.
//
// ADMIN SETUP REQUIRED: update the values below as real, verified numbers
// become available. Do not invent statistics — see `stats` below for the
// verified-only policy.
// =============================================================================

// =============================================================================
// ORGANIZATIONAL / LEGAL POSITIONING
// -----------------------------------------------------------------------
// ADPAP does not currently operate as a separate corporation or juridical
// entity. GlobalKnowledge PH, Inc. is the legal operating entity; ADPAP is
// the professional membership community it operates. Every place on the
// site that states this relationship should pull from here rather than
// hard-coding its own wording, so the relationship is described
// consistently everywhere. ADPAP remains the primary public-facing brand —
// GlobalKnowledge PH appears as the operator, not as a bigger/louder logo.
// =============================================================================
export const ORG = {
  brandName: "Alliance of Data Privacy Advocates Philippines",
  acronym: "ADPAP",
  type: "Professional Membership Community",
  operator: "GlobalKnowledge PH, Inc.",
  /** Short form for tight spaces (footer credit lines, card fine print). */
  operatorRelationship: "Operated by GlobalKnowledge PH, Inc.",
  /** Full sentence form for About/Terms/Privacy/Application copy. */
  operatorRelationshipLong:
    "Alliance of Data Privacy Advocates Philippines (ADPAP) is a professional membership community operated by GlobalKnowledge PH, Inc.",
  /** Standard legal disclaimer — use as-is, don't paraphrase differently in different places. */
  regulatorDisclaimer:
    "ADPAP is not a government agency or regulatory body and does not claim affiliation with, accreditation by, or endorsement from the National Privacy Commission unless expressly stated and documented.",
  /** Governance framework name — use instead of "Constitution" / "By-Laws". */
  governanceDocumentName: "ADPAP Charter and Membership Governance Rules",
  secretariatEmail: "secretariat@gkphilippines.com",
  website: "www.adpap.ph",
};

export const SOCIAL_LINKS = {
  // ADMIN SETUP REQUIRED — add real URLs when available; omitted links won't render.
  facebook: "",
  linkedin: "",
};

/**
 * Credibility statistics shown in the "Built from an Existing Community"
 * section. Only include verified, real figures. Set `value` to null to hide
 * a stat instead of showing a fabricated or placeholder number.
 */
export const CREDIBILITY_STATS: { label: string; value: string | null }[] = [
  { label: "DPOs & Privacy Professionals Trained", value: "1,300+" },
  { label: "Organizations Served", value: null }, // ADMIN SETUP REQUIRED — add verified figure to display this stat
  { label: "Years of Privacy Training", value: null }, // ADMIN SETUP REQUIRED
  { label: "National Events Conducted", value: null }, // ADMIN SETUP REQUIRED
];

/**
 * Founding Member campaign. ADPAP is in its founding stage; this drives the
 * "Become a Founding Member" messaging across the site. Set `active` to
 * false to quietly retire founding-member framing once the campaign ends
 * (existing members keep their founding_member flag regardless).
 */
export const FOUNDING_CAMPAIGN = {
  active: true,
  year: "2026",
  // Set a real target only if/when ADPAP commits to one publicly, e.g. "Founding 300".
  campaignName: null as string | null,
  // Live counts should come from the members table via an admin-configured
  // value once available — do not hardcode a fabricated count.
  verifiedFoundingMemberCount: null as number | null,
};

/**
 * Testimonials are opt-in and verified only — see components/Testimonials.tsx.
 * Add real entries here once collected; leave empty to show the
 * "Voices from the Privacy Community" section in its placeholder state.
 */
export interface Testimonial {
  quote: string;
  name: string;
  position: string;
  organization?: string;
  photo?: string;
}
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "The industry has been longing to be part of a solid organization for data privacy practitioners — and ADPAP answers that need. Excited for the membership!",
    name: "Eric",
    position: "Privacy Practitioner",
    organization: "Insurance Industry",
  },
  {
    quote:
      "I've been waiting for a venue to network with fellow privacy practitioners, and ADPAP is exactly that — a place to meet like-minded individuals.",
    name: "Prof. Marilen",
    position: "Professor",
    organization: "Academe",
  },
  {
    quote:
      "The benefits far outweigh the membership fee — a great investment for both me and my company.",
    name: "John",
    position: "DPO Practitioner",
  },
  {
    quote:
      "I've been attending GlobalKnowledge's seminars and summits since 2022, and they've been incredibly helpful in my data privacy practice.",
    name: "Samuel",
    position: "Privacy Professional",
    organization: "Airline Industry",
  },
  {
    quote:
      "I'm new to data privacy, and ADPAP has been very accommodating to members who are just starting their privacy journey. More power!",
    name: "Dan",
    position: "Privacy Practitioner",
    organization: "Local Government Unit",
  },
  {
    quote:
      "The strength of this organization lies in its training, seminars, and summits — all of which have been helpful in my professional career as a practicing DPO. Salute!",
    name: "Grace",
    position: "Data Protection Officer",
    organization: "Hotel and Restaurant Industry",
  },
];

/**
 * "A Membership That Stays Active All Year" — activities ADPAP membership is
 * designed to support. Per the brief, these are described as planned/
 * designed-for activities, not claimed as already-scheduled events, unless
 * `scheduled` is explicitly set true for a specific item.
 */
export const MEMBER_ACTIVITIES = [
  { category: "Connect", title: "Privacy Leaders Forum", desc: "Peer discussions and leadership conversations.", scheduled: false },
  { category: "Stay Current", title: "Quarterly Privacy Updates", desc: "Stay current on developments affecting privacy practice.", scheduled: false },
  { category: "Learn", title: "Member Masterclasses", desc: "Focused learning sessions led by experienced privacy practitioners.", scheduled: false },
  { category: "Gather", title: "National Data Privacy Convention", desc: "Connect with practitioners and organizations nationwide.", scheduled: false },
  { category: "Practice", title: "DPO Case Discussions", desc: "Learn through practical scenarios and professional exchange.", scheduled: false },
  { category: "Build Relationships", title: "Professional Networking", desc: "Build meaningful relationships with professionals across industries.", scheduled: false },
  { category: "Lead", title: "Leadership & Committees", desc: "Participate in initiatives that help shape the Alliance.", scheduled: false },
  { category: "Be Recognized", title: "Member Recognition", desc: "Celebrate meaningful contributions to privacy advocacy and professional practice.", scheduled: false },
];
