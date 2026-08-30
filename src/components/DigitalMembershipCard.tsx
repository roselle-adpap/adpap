import { QRCodeSVG } from "qrcode.react";
import { MemberRecord } from "@/types";
import { getPlan } from "@/data/membershipPlans";
import { ORG } from "@/data/siteConfig";

export default function DigitalMembershipCard({ member }: { member: MemberRecord }) {
  const plan = getPlan(member.membershipType);
  const verifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/${encodeURIComponent(member.membershipNumber)}`
      : `/verify/${member.membershipNumber}`;

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-navy-950 p-6 text-white shadow-elevated">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-royal-600/30 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gold-500/15 blur-2xl" />
      {member.foundingMember && (
        <div className="absolute -right-11 top-5 w-40 rotate-45 bg-gradient-to-r from-gold-400 to-gold-600 py-1 text-center text-[10px] font-bold uppercase tracking-wide text-navy-950 shadow-md">
          Founding
        </div>
      )}

      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display text-sm font-semibold leading-tight">
            Alliance of Data Privacy
            <br />
            Advocates Philippines
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/50">Official Member ID</p>
        </div>
        <img src="/assets/adpap-logo.png" alt="" width="30" height="30" className="h-[30px] w-[30px] shrink-0 object-contain" aria-hidden="true" />
      </div>

      <div className="relative mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <p className="text-lg font-semibold">{member.fullNameOrOrg}</p>
          {member.organization && <p className="text-xs text-white/55">{member.organization}</p>}
          <p className="mt-3 break-all font-mono text-sm tracking-wide text-gold-300">{member.membershipNumber}</p>
          <p className="mt-1 text-xs text-white/55">{plan?.name}</p>
          <div className="mt-4 flex gap-6 text-[11px] text-white/60">
            <div>
              <p className="uppercase tracking-wide text-white/40">Member Since</p>
              <p className="mt-0.5 text-white/85">{member.startDate}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-white/40">Expires</p>
              <p className="mt-0.5 text-white/85">{member.expirationDate}</p>
            </div>
          </div>
        </div>
        <div className="shrink-0 rounded-lg bg-white p-2">
          <QRCodeSVG value={verifyUrl} size={72} />
        </div>
      </div>
      <p className="relative mt-5 border-t border-white/10 pt-3 text-[9px] leading-relaxed text-white/35">
        Professional membership community operated by {ORG.operator}
      </p>
    </div>
  );
}
