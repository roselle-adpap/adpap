import { TESTIMONIALS } from "@/data/siteConfig";

/**
 * Renders nothing when there are no verified testimonials — never shows
 * placeholder skeletons or developer instructions to public visitors. The
 * parent section (HomePage) also hides its own heading when this returns
 * null, so no empty "Voices From the Privacy Community" heading is left
 * dangling above nothing.
 */
export default function Testimonials() {
  if (TESTIMONIALS.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <div key={t.name} className="card p-6">
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" className="text-gold-400/60">
            <path
              fill="currentColor"
              d="M0 18V9.6C0 4.3 3.3.8 8.6 0l1 2.6C6.4 3.5 4.4 5.6 4.2 8.4H9V18H0Zm13 0V9.6c0-5.3 3.3-8.8 8.6-9.6l1 2.6c-3.2.9-5.2 3-5.4 5.8H22V18h-9Z"
            />
          </svg>
          <p className="mt-3 text-sm leading-relaxed text-navy-800">{t.quote}</p>
          <div className="mt-5 flex items-center gap-3 border-t border-navy-900/8 pt-4">
            {t.photo ? (
              <img src={t.photo} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-royal-600/10 text-xs font-semibold text-royal-700">
                {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-navy-900">{t.name}</p>
              <p className="text-[11px] text-navy-700/55">
                {t.organization ? `${t.position}, ${t.organization}` : t.position}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
