import { FOUNDING_CAMPAIGN } from "@/data/siteConfig";

interface Props {
  size?: "sm" | "md";
  /** Use "onDark" when placed on navy/dark backgrounds (Digital ID card, dark hero
   * sections) for correct contrast; default "onLight" suits white/light cards
   * (certificate, portal, verification page). */
  tone?: "onLight" | "onDark";
}

export default function FoundingBadge({ size = "md", tone = "onLight" }: Props) {
  const isSmall = size === "sm";
  const toneClass =
    tone === "onDark"
      ? "border-gold-400/60 bg-gold-400/15 text-gold-300"
      : "border-gold-500/50 bg-gradient-to-b from-gold-400/15 to-gold-500/10 text-gold-600";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${toneClass} ${
        isSmall ? "px-2.5 py-0.5 text-[10px]" : "px-3.5 py-1.5 text-xs"
      }`}
    >
      <svg width={isSmall ? 9 : 11} height={isSmall ? 9 : 11} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2 14.7 8.6 22 9.3l-5.5 4.7L18.2 21 12 17.1 5.8 21l1.7-7-5.5-4.7 7.3-.7Z" />
      </svg>
      Founding Member{!isSmall && ` \u00B7 ${FOUNDING_CAMPAIGN.year}`}
    </span>
  );
}
