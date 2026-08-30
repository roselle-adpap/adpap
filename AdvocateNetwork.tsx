interface RoleNode {
  role: string;
  detail: string;
  icon: (props: { className?: string }) => JSX.Element;
}

const ROLES: RoleNode[] = [
  { role: "DPO", detail: "Privacy leadership", icon: IconShieldPerson },
  { role: "HR", detail: "Employee data", icon: IconUsers },
  { role: "Marketing", detail: "Customer data", icon: IconMegaphone },
  { role: "Finance", detail: "Financial data", icon: IconCoins },
  { role: "IT / Cybersecurity", detail: "Systems & information security", icon: IconServer },
  { role: "Management", detail: "Governance & accountability", icon: IconCompass },
  { role: "Frontliners", detail: "Customer information", icon: IconHandshake },
  { role: "Educators", detail: "Student information", icon: IconBook },
];

// Angles start at top (-90deg) and go clockwise, evenly spaced.
const RADIUS_PCT = 39;
function nodePosition(index: number, total: number) {
  const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
  const x = 50 + RADIUS_PCT * Math.cos(angle);
  const y = 50 + RADIUS_PCT * Math.sin(angle);
  return { x, y };
}

export default function AdvocateNetwork() {
  return (
    <div>
      {/* Desktop / tablet: radial diagram */}
      <div className="relative mx-auto hidden aspect-square w-full max-w-[720px] lg:block">
        {/* ambient glow */}
        <div className="absolute inset-[8%] rounded-full bg-royal-600/[0.06] blur-3xl" />

        {/* connecting lines */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          {ROLES.map((_, i) => {
            const { x, y } = nodePosition(i, ROLES.length);
            return (
              <line
                key={i}
                x1={50}
                y1={50}
                x2={x}
                y2={y}
                stroke="#1E40AF"
                strokeOpacity={0.16}
                strokeWidth={0.35}
                strokeDasharray="1.2 1.4"
              />
            );
          })}
        </svg>

        {/* center emblem */}
        <div className="absolute left-1/2 top-1/2 flex w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold-400/40 bg-navy-950 shadow-elevated">
            <img src="/assets/adpap-logo.png" alt="ADPAP" className="h-16 w-16 object-contain" />
          </div>
          <p className="mt-3 font-display text-sm font-semibold leading-tight text-navy-950">
            Data Privacy
            <br />
            Advocate
          </p>
        </div>

        {/* role nodes */}
        {ROLES.map((r, i) => {
          const { x, y } = nodePosition(i, ROLES.length);
          const Icon = r.icon;
          return (
            <div
              key={r.role}
              className="group absolute w-[152px] -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-navy-900/10 bg-white text-royal-600 shadow-card transition-transform duration-300 group-hover:-translate-y-1 group-hover:border-gold-400 group-hover:text-gold-600 group-hover:shadow-elevated">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-2 text-[13px] font-semibold text-navy-950">{r.role}</p>
              <p className="text-[11px] leading-snug text-navy-700/60">{r.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Mobile: stacked list */}
      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {ROLES.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.role} className="card p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-royal-600/8 text-royal-600">
                <Icon className="h-4 w-4" />
              </div>
              <p className="mt-2.5 text-sm font-semibold text-navy-950">{r.role}</p>
              <p className="text-xs leading-snug text-navy-700/60">{r.detail}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M15.5 6a3 3 0 0 1 0 5.9" />
      <path d="M21 20c0-2.8-2-5.1-4.7-5.8" />
    </svg>
  );
}
function IconMegaphone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11v2a2 2 0 0 0 2 2h1l3 5V6L6 9H5a2 2 0 0 0-2 2Z" />
      <path d="M14 6.5v11c2.5-.7 5-2.6 5-5.5s-2.5-4.8-5-5.5Z" />
    </svg>
  );
}
function IconCoins({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <ellipse cx="9" cy="7" rx="6" ry="3" />
      <path d="M3 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
      <path d="M3 11v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" />
      <path d="M15 9.3c2.9.3 6 1.5 6 3.2v4c0 1.7-3.1 3-6 3" />
    </svg>
  );
}
function IconServer({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="6" rx="1.5" />
      <rect x="3" y="14" width="18" height="6" rx="1.5" />
      <path d="M7 7h.01M7 17h.01" />
    </svg>
  );
}
function IconCompass({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-2 5-3 1.5 2-5 3-1.5Z" />
    </svg>
  );
}
function IconBook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5V5.5" />
    </svg>
  );
}
function IconShieldPerson({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z" />
      <circle cx="12" cy="10" r="2.2" />
      <path d="M8.5 16c.6-1.8 1.9-2.7 3.5-2.7s2.9.9 3.5 2.7" />
    </svg>
  );
}
function IconHandshake({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m3 10 4-3 4 2 3-2 3 1 4 3" />
      <path d="m7 9 4 4-1.5 1.5a1.5 1.5 0 0 1-2.1 0 1.5 1.5 0 0 1 0-2.1" />
      <path d="m11 13 2 2-1.3 1.3a1.4 1.4 0 0 1-2 0" />
      <path d="M15 9l-4.5 4.5" />
    </svg>
  );
}
