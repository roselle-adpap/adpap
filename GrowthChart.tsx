interface Props {
  data: { label: string; value: number }[];
}

export default function GrowthChart({ data }: Props) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex h-40 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end">
            <div
              className="w-full rounded-t-md bg-royal-600/85 transition-all"
              style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? 4 : 0 }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-[10px] font-medium text-navy-700/50">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
