import { MEMBER_ACTIVITIES } from "@/data/siteConfig";
import ImagePlaceholder from "@/components/ImagePlaceholder";

// Every tile gets a real (or placeholder-safe) photo background for a unified look.
const TILE_PHOTOS: Record<string, string> = {
  "Privacy Leaders Forum": "event-gallery-4",
  "Quarterly Privacy Updates": "activity-updates",
  "Member Masterclasses": "about-heritage",
  "National Data Privacy Convention": "activity-convention",
  "DPO Case Discussions": "event-gallery-2",
  "Professional Networking": "event-gallery-3",
  "Leadership & Committees": "activity-leadership",
  "Member Recognition": "institutional-team",
};

export default function MembershipActivityGrid() {
  const anyScheduled = MEMBER_ACTIVITIES.some((a) => a.scheduled);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MEMBER_ACTIVITIES.map((a) => {
          const photoSlot = TILE_PHOTOS[a.title];
          return (
            <div
              key={a.title}
              className="group relative aspect-[4/5] overflow-hidden rounded-xl shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated"
            >
              <ImagePlaceholder
                slotId={photoSlot}
                label={a.title}
                className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/50 to-navy-950/10" />
              <div className="relative flex h-full flex-col justify-end p-5 text-white">
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300">
                  {a.category}
                </span>
                <h3 className="mt-1.5 text-sm font-semibold leading-snug">{a.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-white/75">{a.desc}</p>
                {a.scheduled && (
                  <span className="badge mt-3 w-fit bg-emerald-500/90 text-white">Scheduled</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!anyScheduled && (
        <p className="mt-6 text-center text-xs text-navy-700/45">
          ADPAP membership is designed to support activities such as these. Specific schedules
          will be announced to members as they are confirmed.
        </p>
      )}
    </div>
  );
}
