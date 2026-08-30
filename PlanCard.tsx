import { Link } from "react-router-dom";
import { MembershipPlan } from "@/types";

export default function PlanCard({ plan, compact = false }: { plan: MembershipPlan; compact?: boolean }) {
  return (
    <div
      className={`card card-hover relative flex flex-col overflow-hidden p-7 ${
        plan.recommended ? "border-2 border-gold-500 shadow-elevated" : ""
      }`}
    >
      {plan.recommended && (
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400" />
      )}
      {plan.recommended && (
        <span className="badge absolute right-6 top-5 bg-gold-500 text-navy-950">Best Value</span>
      )}

      <span className="eyebrow">{plan.representatives} representative{plan.representatives > 1 ? "s" : ""}</span>
      <h3 className="mt-2 font-display text-xl font-semibold text-navy-950">{plan.name}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-navy-700/65">{plan.tagline}</p>

      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-bold tracking-tight text-navy-950">{plan.priceLabel}</span>
        <span className="text-sm text-navy-700/55">/ year</span>
      </div>

      <p className="mt-3 rounded-md bg-royal-600/[0.06] px-3 py-2 text-xs font-medium leading-relaxed text-royal-700">
        {plan.highlight}
      </p>

      {!compact && (
        <ul className="mt-6 space-y-2.5">
          {plan.benefits.slice(0, 5).map((b) => (
            <li key={b} className="flex gap-2.5 text-[13px] leading-relaxed text-navy-700/85">
              <svg
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="m4 12 6 6L20 6" />
              </svg>
              {b}
            </li>
          ))}
        </ul>
      )}

      <Link
        to={`/apply?type=${plan.id}`}
        className={`mt-7 ${plan.recommended ? "btn-gold" : "btn-primary"}`}
      >
        Apply Now
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
