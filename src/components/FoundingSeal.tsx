import { FOUNDING_CAMPAIGN } from "@/data/siteConfig";

/**
 * A larger ceremonial "seal" rendition of Founding Member status, for
 * feature placements (Founding Member section, certificate). For inline/
 * small-format use (ID card corner, portal header, verification result),
 * use FoundingBadge instead.
 */
export default function FoundingSeal({ size = 132 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" role="img" aria-label={`Founding Member ${FOUNDING_CAMPAIGN.year} seal`}>
      <defs>
        <linearGradient id="seal-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EFD48A" />
          <stop offset="50%" stopColor="#C9982F" />
          <stop offset="100%" stopColor="#A87B1F" />
        </linearGradient>
      </defs>

      {/* ribbon tails */}
      <path d="M78 168 68 198 92 184 100 196 108 184 132 198 122 168Z" fill="url(#seal-gold)" opacity="0.9" />

      {/* outer ring */}
      <circle cx="100" cy="92" r="76" fill="#0A1633" stroke="url(#seal-gold)" strokeWidth="3" />
      <circle cx="100" cy="92" r="66" fill="none" stroke="url(#seal-gold)" strokeWidth="1" opacity="0.5" />

      {/* laurel wreath, left */}
      <g fill="none" stroke="url(#seal-gold)" strokeWidth="2.5" strokeLinecap="round">
        <path d="M46 118c-10-16-10-40 4-58" />
        {[...Array(6)].map((_, i) => {
          const t = i / 5;
          const x = 46 - t * 4;
          const y = 118 - t * 56;
          return <ellipse key={i} cx={x - 8} cy={y} rx="7" ry="3.2" transform={`rotate(${-40 + t * 55} ${x - 8} ${y})`} fill="url(#seal-gold)" stroke="none" />;
        })}
      </g>
      {/* laurel wreath, right (mirrored) */}
      <g fill="none" stroke="url(#seal-gold)" strokeWidth="2.5" strokeLinecap="round">
        <path d="M154 118c10-16 10-40-4-58" />
        {[...Array(6)].map((_, i) => {
          const t = i / 5;
          const x = 154 + t * 4;
          const y = 118 - t * 56;
          return <ellipse key={i} cx={x + 8} cy={y} rx="7" ry="3.2" transform={`rotate(${40 - t * 55} ${x + 8} ${y})`} fill="url(#seal-gold)" stroke="none" />;
        })}
      </g>

      {/* star */}
      <path
        d="M100 40 105.9 51.9 119 53.8 109.5 63.1 111.8 76.2 100 70 88.2 76.2 90.5 63.1 81 53.8 94.1 51.9Z"
        fill="url(#seal-gold)"
      />

      {/* text */}
      <text x="100" y="98" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="15" fill="#EFD48A">
        FOUNDING
      </text>
      <text x="100" y="116" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" fontSize="15" fill="#EFD48A">
        MEMBER
      </text>
      <text x="100" y="134" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="11" letterSpacing="2" fill="#C9D0DB">
        {FOUNDING_CAMPAIGN.year}
      </text>
    </svg>
  );
}
