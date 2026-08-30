import { MEMBERSHIP_PLANS } from "@/data/membershipPlans";
import { MembershipType } from "@/types";

export default function StepMembershipType({
  value,
  onChange,
}: {
  value: MembershipType | "";
  onChange: (v: MembershipType) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-navy-950">Select your membership type</h2>
      <p className="mt-1.5 text-sm text-navy-700/65">
        The rest of the application will adjust based on your selection.
      </p>

      <div className="mt-7 grid gap-4 lg:grid-cols-3">
        {MEMBERSHIP_PLANS.map((plan) => {
          const selected = value === plan.id;
          return (
            <button
              type="button"
              key={plan.id}
              onClick={() => onChange(plan.id)}
              className={`card relative flex flex-col p-6 text-left transition ${
                selected ? "border-2 border-royal-600 shadow-elevated" : "hover:border-royal-600/40"
              }`}
            >
              {plan.recommended && (
                <span className="badge absolute -top-3 left-6 bg-gold-500 text-navy-950">Best Value</span>
              )}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-navy-950">{plan.name}</h3>
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? "border-royal-600 bg-royal-600" : "border-navy-900/20"
                  }`}
                >
                  {selected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                      <path d="m4 12 6 6L20 6" />
                    </svg>
                  )}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-navy-950">{plan.priceLabel}</p>
              <p className="text-xs text-navy-700/55">per year</p>
              <p className="mt-3 text-xs leading-relaxed text-navy-700/75">{plan.tagline}</p>
              <p className="mt-3 text-xs font-medium text-royal-700">
                {plan.representatives} representative{plan.representatives > 1 ? "s" : ""}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
