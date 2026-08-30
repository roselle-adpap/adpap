// =============================================================================
// ADPAP Image Manifest
// -----------------------------------------------------------------------------
// Every photograph the site uses is listed here, pointing at a path under
// /public/images/. Most slots now use real event photography from
// GlobalKnowledge PH / ADPAP events (credit: CreziaSpace/Red D. Jay), supplied
// directly by the client. The "institutional-team" slot still uses an
// AI-generated concept photo, explicitly approved by the client as realistic
// placeholder imagery, pending a real equivalent shot.
//
// TO REPLACE AN IMAGE:
//   1. Drop the real file into the `path` shown below, using the same
//      filename (or update `path` here to point at the new file).
//   2. That's it — components read this manifest, so no other code changes
//      are needed. If a file is ever missing, ImagePlaceholder.tsx falls
//      back to a tasteful on-brand placeholder rather than a broken image.
//
// Keep alt text accurate to what each photo actually shows.
// =============================================================================

export interface ImageSlot {
  id: string;
  path: string; // relative to /public
  alt: string;
  section: string;
  recommendedDimensions: string;
}

export const IMAGE_MANIFEST: ImageSlot[] = [
  {
    id: "hero-professionals",
    path: "/images/hero/hero-professionals.jpg",
    alt: "Five GlobalKnowledge PH / ADPAP colleagues smiling together, wearing Data Protection Officer and Data Privacy Professional lanyards",
    section: "Homepage hero",
    recommendedDimensions: "1600x900 (landscape, ~16:9 to 4:3), WebP or AVIF preferred",
  },
  {
    id: "community-forum",
    path: "/images/community/community-forum.jpg",
    alt: "Attendees seated in a lecture hall, engaged and taking notes during a Data Privacy Professional forum",
    section: "You Don't Have to Practice Privacy Alone",
    recommendedDimensions: "1600x850, WebP or AVIF preferred",
  },
  {
    id: "about-heritage",
    path: "/images/about/about-heritage.jpg",
    alt: "A trainer presenting on lawful processing under the Data Privacy Act at the DPO 2.0: AI-Ready Summit",
    section: "About page / Heritage section",
    recommendedDimensions: "1600x850, WebP or AVIF preferred",
  },
  {
    id: "institutional-team",
    path: "/images/membership/institutional-team.jpg",
    alt: "An ADPAP/GlobalKnowledge PH leader presenting a Certificate of Appreciation to a DPO 3.0 Summit speaker",
    section: "Membership page / Institutional callout",
    recommendedDimensions: "1600x850, WebP or AVIF preferred",
  },
  {
    id: "event-gallery-1",
    path: "/images/events/event-gallery-1.jpg",
    alt: "Panel discussion on stage at the \"DPO Beyond: AI Governance, Privacy, Cybersecurity & Digital Trust\" event",
    section: "Our Privacy Community gallery",
    recommendedDimensions: "1200x1200 (square), WebP or AVIF preferred",
  },
  {
    id: "event-gallery-2",
    path: "/images/events/event-gallery-2.jpg",
    alt: "Wide view of a full lecture hall during a DPO 2.0: AI-Ready Summit session",
    section: "Our Privacy Community gallery",
    recommendedDimensions: "1200x1200 (square), WebP or AVIF preferred",
  },
  {
    id: "event-gallery-3",
    path: "/images/events/event-gallery-3.jpg",
    alt: "Professionals mingling and talking during an event networking reception",
    section: "Our Privacy Community gallery",
    recommendedDimensions: "1200x1200 (square), WebP or AVIF preferred",
  },
  {
    id: "event-gallery-4",
    path: "/images/events/event-gallery-4.jpg",
    alt: "Attendees with laptops open, listening attentively in a full lecture hall",
    section: "Our Privacy Community gallery",
    recommendedDimensions: "1200x1200 (square), WebP or AVIF preferred",
  },
  {
    id: "activity-updates",
    path: "/images/events/activity-updates.jpg",
    alt: "A host speaking at the podium in front of the DPO 2.0: AI-Ready Summit backdrop",
    section: "Membership activity tile — Quarterly Privacy Updates",
    recommendedDimensions: "1200x900, WebP or AVIF preferred",
  },
  {
    id: "activity-convention",
    path: "/images/events/activity-convention.jpg",
    alt: "Four panelists seated on stage in front of the \"DPO Beyond\" summit screen",
    section: "Membership activity tile — National Data Privacy Convention",
    recommendedDimensions: "1200x900, WebP or AVIF preferred",
  },
  {
    id: "activity-leadership",
    path: "/images/events/activity-leadership.jpg",
    alt: "A host addressing the room from the podium at the DPO 2.0: AI-Ready Summit",
    section: "Membership activity tile — Leadership & Committees",
    recommendedDimensions: "1200x900, WebP or AVIF preferred",
  },
];

export function getImageSlot(id: string): ImageSlot | undefined {
  return IMAGE_MANIFEST.find((i) => i.id === id);
}
