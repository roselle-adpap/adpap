import { QRCodeSVG } from "qrcode.react";
import { MemberRecord } from "@/types";
import { getPlan } from "@/data/membershipPlans";
import { ORG } from "@/data/siteConfig";
import FoundingBadge from "@/components/FoundingBadge";
import FoundingSeal from "@/components/FoundingSeal";

export default function MembershipCertificate({ member }: { member: MemberRecord }) {
  const plan = getPlan(member.membershipType);
  const verifyUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify/${encodeURIComponent(member.membershipNumber)}`
      : `/verify/${member.membershipNumber}`;

  return (
    <div className="relative w-full rounded-lg border-[5px] border-gold-500 bg-white p-6 shadow-elevated sm:border-[6px] sm:p-10">
      <div className="pointer-events-none absolute inset-2 rounded border border-navy-900/15 sm:inset-3" />
      {member.foundingMember && (
        <div className="pointer-events-none absolute bottom-3 right-3 opacity-90 sm:bottom-5 sm:right-5">
          <FoundingSeal size={52} />
        </div>
      )}
      <div className="relative flex flex-col items-center gap-6 text-center sm:gap-8">
        <div>
          <img src="/assets/adpap-logo.png" alt="ADPAP" width="44" height="44" className="mx-auto h-9 w-9 object-contain sm:h-11 sm:w-11" />
          <p className="mt-2 font-display text-xs font-semibold uppercase tracking-[0.1em] text-navy-950 sm:text-sm sm:tracking-[0.14em]">
            Alliance of Data Privacy Advocates Philippines
          </p>
          <p className="mt-3 font-display text-lg font-semibold text-navy-950 sm:mt-4 sm:text-2xl">Certificate of Membership</p>
          {member.foundingMember && (
            <div className="mt-2 flex justify-center">
              <FoundingBadge size="sm" />
            </div>
          )}
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-navy-700/60 sm:text-xs sm:tracking-[0.2em]">This is to certify that</p>
          <p className="mt-2 text-balance font-display text-xl font-semibold text-royal-700 sm:mt-3 sm:text-3xl">{member.fullNameOrOrg}</p>
          <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-navy-700/70 sm:mt-4 sm:text-xs">
            is a duly recognized member of the Alliance of Data Privacy Advocates Philippines for
            the membership period stated below.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs sm:mt-5 sm:flex-nowrap sm:gap-10">
            <div>
              <p className="uppercase tracking-wide text-navy-700/50">Membership No.</p>
              <p className="mt-1 font-mono font-semibold text-navy-900">{member.membershipNumber}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-navy-700/50">Category</p>
              <p className="mt-1 font-semibold text-navy-900">{plan?.name}</p>
            </div>
            <div>
              <p className="uppercase tracking-wide text-navy-700/50">Valid</p>
              <p className="mt-1 font-semibold text-navy-900">
                {member.startDate} – {member.expirationDate}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-0 sm:px-6">
          <div className="text-center">
            <div className="h-8 w-24 border-b border-navy-900/30 sm:h-10 sm:w-32" />
            <p className="mt-1 text-[10px] uppercase tracking-wide text-navy-700/50">President, ADPAP</p>
          </div>
          <div className="rounded bg-white p-1">
            <QRCodeSVG value={verifyUrl} size={48} />
          </div>
          <div className="text-center">
            <div className="h-8 w-24 border-b border-navy-900/30 sm:h-10 sm:w-32" />
            <p className="mt-1 text-[10px] uppercase tracking-wide text-navy-700/50">Secretary / Membership Chair</p>
          </div>
        </div>
        <p className="-mt-3 text-[9px] leading-relaxed text-navy-700/35 sm:-mt-5">
          {ORG.brandName} is a professional membership community operated by {ORG.operator}.
          <br className="sm:hidden" /> Secretariat Reference: {member.membershipNumber}
        </p>
      </div>
    </div>
  );
}
