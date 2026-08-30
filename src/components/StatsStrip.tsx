import { CREDIBILITY_STATS } from "@/data/siteConfig";

const COLS_CLASS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

export default function StatsStrip() {
  const visible = CREDIBILITY_STATS.filter((s) => s.value !== null);
  if (visible.length === 0) return null;
  const colsClass = COLS_CLASS[Math.min(visible.length, 4)] ?? "sm:grid-cols-4";

  return (
    <div className={`grid gap-px overflow-hidden rounded-xl border border-navy-900/8 bg-navy-900/8 ${colsClass}`}>
      {visible.map((s) => (
        <div key={s.label} className="bg-white px-6 py-7 text-center">
          <p className="font-display text-3xl font-semibold text-navy-950 sm:text-4xl">{s.value}</p>
          <p className="mt-1.5 text-xs leading-snug text-navy-700/60">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
