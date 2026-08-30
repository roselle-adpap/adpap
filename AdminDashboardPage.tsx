import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SubmittedApplication, MemberRecord, ApplicationStatus, MembershipType } from "@/types";
import { getPlan, formatPHP } from "@/data/membershipPlans";
import StatusBadge from "@/components/StatusBadge";
import StatCard from "@/components/StatCard";
import GrowthChart from "@/components/GrowthChart";
import ApplicationDetailDrawer from "@/components/admin/ApplicationDetailDrawer";
import {
  listApplications,
  listMembers,
  approveApplication,
  rejectApplication,
  requestMoreInfo,
  markPaymentVerified,
  activateMembership,
  toggleFoundingMember,
  exportMembersToCSV,
  downloadCSV,
} from "@/lib/adminData";

const STATUS_FILTERS: (ApplicationStatus | "all")[] = [
  "all",
  "submitted",
  "for_review",
  "payment_verification",
  "approved",
  "active",
  "rejected",
];

const TYPE_FILTERS: (MembershipType | "all")[] = ["all", "individual", "institutional", "premium_institutional"];

export default function AdminDashboardPage() {
  const { isAdmin, adminEmail, logoutAdmin } = useAuth();
  const [tab, setTab] = useState<"applications" | "members">("applications");
  const [applications, setApplications] = useState<SubmittedApplication[]>([]);
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<MembershipType | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SubmittedApplication | null>(null);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setLoading(true);
    const [apps, mems] = await Promise.all([listApplications(), listMembers()]);
    setApplications(apps);
    setMembers(mems);
    setLoading(false);
  }

  useEffect(() => {
    if (isAdmin) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  const filteredApplications = useMemo(() => {
    return applications.filter((a) => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (typeFilter !== "all" && a.membershipType !== typeFilter) return false;
      if (search.trim()) {
        const name =
          a.membershipType === "individual" ? a.applicant.fullName : a.organization.organizationName;
        const haystack = `${name} ${a.referenceNumber}`.toLowerCase();
        if (!haystack.includes(search.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [applications, statusFilter, typeFilter, search]);

  const stats = useMemo(() => {
    const activeMembers = members.filter((m) => m.status === "active");
    const individual = activeMembers.filter((m) => m.membershipType === "individual").length;
    const institutional = activeMembers.filter((m) => m.membershipType === "institutional").length;
    const premium = activeMembers.filter((m) => m.membershipType === "premium_institutional").length;
    const pending = applications.filter((a) =>
      ["submitted", "for_review", "payment_verification"].includes(a.status)
    ).length;
    const expiringSoon = members.filter((m) => {
      const days = Math.ceil((new Date(m.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days >= 0 && days <= 60;
    }).length;
    const revenue = activeMembers.reduce((sum, m) => sum + (getPlan(m.membershipType)?.price ?? 0), 0);
    const expectedRenewal = members
      .filter((m) => {
        const days = Math.ceil((new Date(m.expirationDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return days >= 0 && days <= 60;
      })
      .reduce((sum, m) => sum + (getPlan(m.membershipType)?.price ?? 0), 0);

    return { activeMembers: activeMembers.length, individual, institutional, premium, pending, expiringSoon, revenue, expectedRenewal };
  }, [applications, members]);

  const growthData = useMemo(() => {
    const months: { label: string; value: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString("en-PH", { month: "short" });
      const count = applications.filter((a) => {
        const s = new Date(a.submittedAt);
        return s.getFullYear() === d.getFullYear() && s.getMonth() === d.getMonth();
      }).length;
      months.push({ label, value: count });
    }
    return months;
  }, [applications]);

  async function withBusy(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  function handleExport() {
    const csv = exportMembersToCSV(members);
    downloadCSV(`adpap-members-${new Date().toISOString().slice(0, 10)}.csv`, csv);
  }

  return (
    <div className="section py-10 lg:py-14">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="eyebrow">Secretariat</span>
          <h1 className="mt-2 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-navy-700/55">Signed in as {adminEmail}</p>
        </div>
        <button onClick={logoutAdmin} className="btn-outline !py-2 !px-4 text-sm">
          Sign Out
        </button>
      </div>

      {/* Analytics */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Active Members" value={String(stats.activeMembers)} />
        <StatCard label="Individual Members" value={String(stats.individual)} />
        <StatCard label="Institutional Members" value={String(stats.institutional)} />
        <StatCard label="Premium Institutional" value={String(stats.premium)} />
        <StatCard label="Pending Applications" value={String(stats.pending)} accent="royal" />
        <StatCard label="Expiring Soon (60d)" value={String(stats.expiringSoon)} accent="gold" />
        <StatCard label="Annual Membership Revenue" value={formatPHP(stats.revenue)} accent="royal" />
        <StatCard label="Expected Renewal Revenue" value={formatPHP(stats.expectedRenewal)} accent="gold" />
      </div>

      <div className="card mt-6 p-6">
        <p className="text-sm font-semibold text-navy-900">Monthly Application Growth</p>
        <div className="mt-4">
          <GrowthChart data={growthData} />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10 flex gap-1 border-b border-navy-900/8">
        {(["applications", "members"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize ${
              tab === t ? "border-b-2 border-royal-600 text-royal-700" : "text-navy-700/55"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "applications" && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <input
              className="input max-w-xs"
              placeholder="Search by name or reference no."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="input max-w-[180px]" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "all")}>
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All Statuses" : s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <select className="input max-w-[200px]" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as MembershipType | "all")}>
              {TYPE_FILTERS.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All Categories" : getPlan(t)?.name ?? t}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-navy-900/8 bg-white shadow-card">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-mist-100 text-left text-xs uppercase tracking-wide text-navy-700/55">
                <tr>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Applicant / Org</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/5">
                {loading && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-navy-700/50">Loading…</td></tr>
                )}
                {!loading && filteredApplications.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-navy-700/50">No applications match these filters.</td></tr>
                )}
                {filteredApplications.map((a) => {
                  const plan = getPlan(a.membershipType);
                  const name = a.membershipType === "individual" ? a.applicant.fullName : a.organization.organizationName;
                  return (
                    <tr key={a.referenceNumber} className="cursor-pointer hover:bg-mist-50" onClick={() => setSelected(a)}>
                      <td className="px-4 py-3 font-mono text-xs text-navy-700/70">{a.referenceNumber}</td>
                      <td className="px-4 py-3 font-medium text-navy-900">{name}</td>
                      <td className="px-4 py-3 text-navy-700/80">{plan?.name}</td>
                      <td className="px-4 py-3 text-navy-700/80">{plan ? formatPHP(plan.price) : "—"}</td>
                      <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                      <td className="px-4 py-3 text-navy-700/60">{new Date(a.submittedAt).toLocaleDateString("en-PH")}</td>
                      <td className="px-4 py-3 text-right text-xs font-semibold text-royal-600">Review →</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "members" && (
        <div className="mt-6">
          <div className="flex justify-end">
            <button onClick={handleExport} className="btn-outline !py-2 !px-4 text-sm">
              Export Members to CSV
            </button>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-navy-900/8 bg-white shadow-card">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-mist-100 text-left text-xs uppercase tracking-wide text-navy-700/55">
                <tr>
                  <th className="px-4 py-3">Membership No.</th>
                  <th className="px-4 py-3">Name / Organization</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3">Founding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-900/5">
                {members.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-navy-700/50">No members yet. Approve an application to create one.</td></tr>
                )}
                {members.map((m) => (
                  <tr key={m.membershipNumber}>
                    <td className="px-4 py-3 font-mono text-xs text-navy-700/70">{m.membershipNumber}</td>
                    <td className="px-4 py-3 font-medium text-navy-900">{m.fullNameOrOrg}</td>
                    <td className="px-4 py-3 text-navy-700/80">{getPlan(m.membershipType)?.name}</td>
                    <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                    <td className="px-4 py-3 text-navy-700/60">{m.expirationDate}</td>
                    <td className="px-4 py-3">
                      <button
                        disabled={busy}
                        onClick={() => withBusy(() => toggleFoundingMember(m.membershipNumber, !m.foundingMember))}
                        className={`badge ${m.foundingMember ? "bg-gold-500 text-navy-950" : "bg-mist-200 text-navy-700"}`}
                      >
                        {m.foundingMember ? "Founding" : "Mark Founding"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <ApplicationDetailDrawer
          application={selected}
          busy={busy}
          onClose={() => setSelected(null)}
          onApprove={() => withBusy(async () => { await approveApplication(selected); setSelected(null); })}
          onReject={() => withBusy(async () => { await rejectApplication(selected.referenceNumber); setSelected(null); })}
          onRequestInfo={() => withBusy(async () => { await requestMoreInfo(selected.referenceNumber); setSelected(null); })}
          onVerifyPayment={() => withBusy(async () => { await markPaymentVerified(selected.referenceNumber); })}
          onActivate={() => withBusy(async () => {
            const member = members.find((m) => m.fullNameOrOrg === (selected.membershipType === "individual" ? selected.applicant.fullName : selected.organization.organizationName));
            if (member) await activateMembership(member.membershipNumber);
            setSelected(null);
          })}
        />
      )}
    </div>
  );
}
