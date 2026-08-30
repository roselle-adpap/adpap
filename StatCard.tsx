export default function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "gold" | "royal";
}) {
  return (
    <div className="card p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-navy-700/50">{label}</p>
      <p
        className={`mt-2 text-2xl font-bold ${
          accent === "gold" ? "text-gold-600" : accent === "royal" ? "text-royal-700" : "text-navy-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
