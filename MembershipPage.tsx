import { Link } from "react-router-dom";
import { MEMBERSHIP_PLANS, formatPHP } from "@/data/membershipPlans";
import PlanCard from "@/components/PlanCard";
import ImagePlaceholder from "@/components/ImagePlaceholder";

type Cell = string | boolean;

interface Row {
  label: string;
  values: [Cell, Cell, Cell];
}

const ROWS: Row[] = [
  { label: "Annual fee", values: [formatPHP(5000), formatPHP(15000), formatPHP(35000)] },
  { label: "Official representatives", values: ["1 (yourself)", "2", "3"] },
  { label: "Training discount (GlobalKnowledge PH)", values: ["20%–50%", "Per representative", "Per representative"] },
  { label: "DPIA Builder access (1 year, value ₱9,000)", values: [true, "Per representative", "Per representative"] },
  { label: "National Data Privacy Convention discount", values: ["20%", true, true] },
  { label: "Free DPO Novice Training (value ₱18,000)", values: [false, "1", "1"] },
  { label: "Free DPO 2.0 Self-Paced Training (value ₱15,000)", values: [false, false, "1"] },
  { label: "Free DPO 3.0 Self-Paced Training (value ₱15,000)", values: [false, false, "1"] },
  { label: "Certification Exam Review Session", values: ["1 free session", "Per representative", "Per representative"] },
  { label: "Exam retake discount", values: ["20%", "20%", "20%"] },
  { label: "ADPAP/DPO merchandise discount", values: ["10%", "10%", "10%"] },
  { label: "Eligible to vote in Election of Officers", values: [true, "Via representatives", "Via representatives"] },
  { label: "Access to selected video recordings", values: [true, true, true] },
  { label: "Official Membership ID", values: [true, "Per representative", "Per representative"] },
  { label: "Digital Certificate of Membership", values: [true, "Per representative", "Per representative"] },
  { label: "Institutional recognition", values: [false, true, true] },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true) {
    return (
      <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="m4 12 6 6L20 6" />
        </svg>
      </span>
    );
  }
  if (value === false) {
    return <span className="mx-auto block text-mist-400">—</span>;
  }
  return <span className="text-sm text-navy-800">{value}</span>;
}

export default function MembershipPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 py-16 text-white lg:py-20">
        <div className="pointer-events-none absolute inset-0 bg-navy-grid bg-[length:44px_44px] opacity-30" />
        <div className="pointer-events-none absolute -right-32 -top-24 h-[380px] w-[380px] rounded-full bg-royal-600/25 blur-3xl" />
        <div className="section relative max-w-2xl">
          <span className="eyebrow !text-gold-400">Membership Categories</span>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Built for individuals and organizations
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-white/70">
            All fees are annual. Renewal keeps your original membership number. Institutional
            categories cover multiple named representatives who each receive individual-level
            benefits.
          </p>
        </div>
      </section>

      {/* Plan cards */}
      <section className="section -mt-10 pb-4">
        <div className="grid gap-6 lg:grid-cols-3">
          {MEMBERSHIP_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </section>

      {/* Value callouts */}
      <section className="section py-16 lg:py-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Individual: pay-for-itself framing */}
          <div className="card p-7">
            <span className="eyebrow">Individual Professional</span>
            <h3 className="mt-2 font-display text-lg font-semibold text-navy-950">
              Your membership can already pay for itself.
            </h3>
            <div className="mt-4 rounded-lg bg-royal-600/[0.06] p-4">
              <p className="text-sm font-semibold text-royal-700">Includes 1-Year DPIA Builder Access</p>
              <p className="mt-1 text-xs text-navy-700/60">Stated Value: ₱9,000 — more than the ₱5,000 annual fee.</p>
            </div>
          </div>

          {/* Institutional: representatives + training */}
          <div className="card p-7">
            <span className="eyebrow">Institutional</span>
            <h3 className="mt-2 font-display text-lg font-semibold text-navy-950">
              Two representatives, fully covered.
            </h3>
            <div className="mt-4 flex items-center gap-3 rounded-lg bg-royal-600/[0.06] p-4">
              <span className="font-display text-2xl font-bold text-royal-700">2</span>
              <span className="text-sm text-navy-700/70">Official Representatives</span>
              <span className="text-navy-700/30">+</span>
              <span className="text-sm text-navy-700/70">1 Free DPO Novice Training</span>
            </div>
          </div>

          {/* Premium: executive training stack */}
          <div className="card border-2 border-gold-500 p-7">
            <span className="eyebrow">Premium Institutional</span>
            <h3 className="mt-2 font-display text-lg font-semibold text-navy-950">
              Build your organization's privacy team.
            </h3>
            <ul className="mt-4 space-y-1.5 text-sm text-navy-800">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold-500" /> 3 Professional Members
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold-500" /> DPO Novice
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold-500" /> DPO 2.0 Self-Paced
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold-500" /> DPO 3.0 Self-Paced
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold-500" /> Year-Round Member Privileges
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Institutional team image */}
      <section className="bg-mist-100 py-16 lg:py-20">
        <div className="section grid gap-10 lg:grid-cols-2 lg:items-center">
          <figure className="order-1">
            <ImagePlaceholder
              slotId="institutional-team"
              label="Institutional Team"
              className="aspect-[16/10] w-full rounded-2xl shadow-card"
            />
            <figcaption className="mt-2.5 text-center text-xs text-navy-700/45">
              GlobalKnowledge PH Data Privacy Community
            </figcaption>
          </figure>
          <div className="order-2">
            <span className="eyebrow">Build Stronger Privacy Capability</span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-navy-950 sm:text-3xl">
              Give your privacy team a professional home.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-700/70">
              Institutional and Premium Institutional membership means your representatives don't
              just get individual perks — they get official standing as your organization's
              recognized privacy team, with training, recognition, and a community built around
              exactly what they're responsible for.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section py-20 lg:py-24">
        <div className="max-w-2xl">
          <span className="eyebrow">Side by side</span>
          <h2 className="mt-3 text-2xl font-semibold text-navy-950 sm:text-3xl">Full benefits comparison</h2>
        </div>
        <div className="mt-8 overflow-x-auto rounded-xl border border-navy-900/8 bg-white shadow-card">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-navy-950 text-white">
                <th className="px-5 py-4 text-left font-medium">Benefit</th>
                {MEMBERSHIP_PLANS.map((p) => (
                  <th key={p.id} className="px-5 py-4 text-center font-medium">
                    {p.name}
                    <div className="mt-0.5 text-xs font-normal text-white/60">{p.priceLabel}/yr</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => (
                <tr key={row.label} className={`transition-colors hover:bg-royal-600/[0.04] ${i % 2 === 0 ? "bg-white" : "bg-mist-50"}`}>
                  <td className="px-5 py-3.5 font-medium text-navy-800">{row.label}</td>
                  {row.values.map((v, idx) => (
                    <td key={idx} className="px-5 py-3.5 text-center">
                      <CellValue value={v} />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-navy-950/5">
                <td className="px-5 py-4 font-semibold text-navy-950">Apply</td>
                {MEMBERSHIP_PLANS.map((p) => (
                  <td key={p.id} className="px-5 py-4 text-center">
                    <Link to={`/apply?type=${p.id}`} className="btn-primary !py-2 !px-4 text-xs">
                      Apply Now
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-navy-700/60">
          Indicative peso values reflect standard list pricing of referenced GlobalKnowledge PH
          programs and are provided for illustration; actual savings depend on programs attended.
        </p>
      </section>
    </div>
  );
}
