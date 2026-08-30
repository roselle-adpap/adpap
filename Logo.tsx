export default function Logo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  const textColor = dark ? "text-navy-950" : "text-white";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src="/assets/adpap-logo.png" alt="ADPAP" width="34" height="34" className="h-[34px] w-[34px] shrink-0 object-contain" />
      <div className={`leading-tight ${textColor}`}>
        <div className="font-display text-[15px] font-semibold tracking-tight">ADPAP</div>
        <div className="text-[10px] font-medium uppercase tracking-[0.14em] opacity-70">Philippines</div>
      </div>
    </div>
  );
}
