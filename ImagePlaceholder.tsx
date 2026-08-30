import { useState } from "react";
import { getImageSlot } from "@/data/images";

interface Props {
  slotId: string;
  className?: string;
  /** Short label shown in the placeholder state, e.g. "Community Photo" */
  label?: string;
}

/**
 * Renders the real photo for a manifest slot if the file has been added to
 * /public/images/... . Until then (the default state for a fresh checkout),
 * it renders a tasteful, on-brand placeholder — never a fabricated "AI
 * person" photo — so the layout looks intentional and the person deploying
 * the site knows exactly what to drop in and where.
 */
export default function ImagePlaceholder({ slotId, className = "", label }: Props) {
  const [failed, setFailed] = useState(false);
  const slot = getImageSlot(slotId);

  if (!slot || failed) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-900 to-navy-800 ${className}`}
        role="img"
        aria-label={slot?.alt ?? label ?? "Photo placeholder"}
      >
        <div className="pointer-events-none absolute inset-0 bg-navy-grid bg-[length:28px_28px] opacity-[0.15]" />
        <div className="relative flex flex-col items-center gap-2 px-6 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold-400/70">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <circle cx="9" cy="10.5" r="2" />
            <path d="m5 17 4.5-4.5a2 2 0 0 1 2.8 0L17 17" />
          </svg>
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/45">
            {label ?? "Photo to be added"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={slot.path}
      alt={slot.alt}
      className={`object-cover ${className}`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
