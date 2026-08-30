import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useParams } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { MemberRecord } from "@/types";
import StatusBadge from "@/components/StatusBadge";
import FoundingBadge from "@/components/FoundingBadge";
import { getPlan } from "@/data/membershipPlans";
import { ORG } from "@/data/siteConfig";

interface PublicResult {
  name: string;
  membershipNumber: string;
  category: string;
  status: MemberRecord["status"];
  validUntil: string;
  founding: boolean;
}

export default function VerifyPage() {
  const { membershipNumber: paramNumber } = useParams();
  const [query, setQuery] = useState(paramNumber ?? "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PublicResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  async function handleSearch(e?: FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setResult(null);

    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("members")
        .select("full_name_or_org, membership_number, membership_type, status, expiration_date, founding_member")
        .eq("membership_number", query.trim())
        .maybeSingle();
      setLoading(false);
      if (!data) {
        setNotFound(true);
        return;
      }
      setResult({
        name: data.full_name_or_org,
        membershipNumber: data.membership_number,
        category: getPlan(data.membership_type)?.name ?? data.membership_type,
        status: data.status,
        validUntil: data.expiration_date,
        founding: Boolean(data.founding_member),
      });
      return;
    }

    // Demo mode
    const raw = localStorage.getItem("adpap_demo_members_v1");
    const members: MemberRecord[] = raw ? JSON.parse(raw) : [];
    const match = members.find((m) => m.membershipNumber.toLowerCase() === query.trim().toLowerCase());
    setLoading(false);
    if (!match) {
      setNotFound(true);
      return;
    }
    setResult({
      name: match.fullNameOrOrg,
      membershipNumber: match.membershipNumber,
      category: getPlan(match.membershipType)?.name ?? match.membershipType,
      status: match.status,
      validUntil: match.expirationDate,
      founding: match.foundingMember,
    });
  }

  useEffect(() => {
    if (paramNumber) handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramNumber]);

  return (
    <div className="section py-16 lg:py-24">
      <div className="mx-auto max-w-xl text-center">
        <span className="eyebrow justify-center">Membership Verification</span>
        <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">
          Verify an ADPAP membership
        </h1>
        <p className="mt-4 text-sm text-navy-700/65">
          Enter a membership number to confirm whether it is current and active. Scanning a
          member's Digital Membership ID QR code brings you directly here.
        </p>

        <form onSubmit={handleSearch} className="mt-8 flex gap-2">
          <input
            className="input"
            placeholder="e.g. ADPAP-I-2026-00001"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0" disabled={loading}>
            {loading ? "Checking…" : "Verify"}
          </button>
        </form>

        {notFound && (
          <div className="mt-8 rounded-md border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
            No membership record was found for that number. Double-check the number, or contact{" "}
            <a href="mailto:secretariat@gkphilippines.com" className="underline">
              secretariat@gkphilippines.com
            </a>
            .
          </div>
        )}

        {result && (
          <div className="mt-8">
            {(result.status === "active" || result.status === "approved") && (
              <div className="mb-3 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="m8.5 12.2 2.4 2.4 4.6-5" />
                </svg>
                Active ADPAP Member
              </div>
            )}
            <div className="card p-7 text-left">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-navy-950">{result.name}</p>
                  <p className="mt-0.5 font-mono text-sm text-navy-700/60">{result.membershipNumber}</p>
                </div>
                <StatusBadge status={result.status} />
              </div>
              {result.founding && (
                <div className="mt-3">
                  <FoundingBadge size="sm" />
                </div>
              )}
              <div className="mt-5 space-y-2 border-t border-navy-900/8 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-navy-700/55">Membership Category</span>
                  <span className="font-medium text-navy-900">{result.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-navy-700/55">Valid Until</span>
                  <span className="font-medium text-navy-900">{result.validUntil}</span>
                </div>
              </div>
              <p className="mt-5 border-t border-navy-900/8 pt-4 text-xs text-navy-700/50">
                Membership verified by {ORG.brandName}.
                <br />
                Membership records are administered by {ORG.operator} as operator of {ORG.acronym}.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
