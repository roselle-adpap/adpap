import { Link } from "react-router-dom";
import { MEMBERSHIP_PLANS } from "@/data/membershipPlans";
import { ORG, FOUNDING_CAMPAIGN, TESTIMONIALS } from "@/data/siteConfig";
import PlanCard from "@/components/PlanCard";
import AdvocateNetwork from "@/components/AdvocateNetwork";
import StatsStrip from "@/components/StatsStrip";
import MembershipActivityGrid from "@/components/MembershipActivityGrid";
import DigitalIDShowcase from "@/components/DigitalIDShowcase";
import Testimonials from "@/components/Testimonials";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import FoundingSeal from "@/components/FoundingSeal";

const FEATURES = [
  { title: "Professional Growth", desc: "Access expert trainings, resources, and tools to strengthen your privacy expertise.", icon: FeatureIconCap },
  { title: "Practical Tools", desc: "Use industry-leading tools like the DPIA Builder for privacy by design.", icon: FeatureIconTool },
  { title: "Powerful Connections", desc: "Network with DPOs, practitioners, and advocates from across industries.", icon: FeatureIconNetwork },
  { title: "Leadership Opportunities", desc: "Be a leader and help shape the future of data privacy in the Philippines.", icon: FeatureIconFlag },
  { title: "Advocacy and Impact", desc: "Promote privacy rights and responsible data stewardship in your organization and beyond.", icon: FeatureIconTag },
  { title: "Exclusive Member Perks", desc: "Enjoy big savings, special access, and member-only privileges.", icon: FeatureIconCheck },
];

export default function HomePage() {
  return (
    <div>
      {/* ============================== 1. HERO ============================== */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="pointer-events-none absolute inset-0 bg-navy-grid bg-[length:44px_44px] opacity-40" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-royal-600/20 blur-3xl" />

        <div className="section relative py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            {FOUNDING_CAMPAIGN.active && (
              <span className="eyebrow !text-gold-400 justify-center">
                Founding Membership &middot; {FOUNDING_CAMPAIGN.year}
              </span>
            )}
            <h1 className="text-balance mt-5 font-display text-[2.5rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
              Building Privacy Advocates
              <br />
              <span className="text-gold-400">Across Every Organization.</span>
            </h1>
            <p className="mt-6 font-display text-lg italic text-gold-300/90 sm:text-xl">
              Learn. Connect. Practice. Lead. Advocate.
            </p>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70">
              Your Data Privacy journey should not end after training or certification. Join a
              growing professional community committed to strengthening privacy capability,
              responsible data governance, professional development, and advocacy across the
              Philippines.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link to="/apply" className="btn-gold">
                Become a Founding Member
              </Link>
              <Link to="/membership" className="text-sm font-semibold text-white/75 hover:text-white">
                Explore Membership Benefits →
              </Link>
            </div>
          </div>

          <div className="relative mx-auto mt-14 max-w-4xl">
            <div className="absolute -inset-4 -z-10 rounded-2xl bg-gradient-to-br from-gold-500/10 to-transparent blur-2xl" />
            <ImagePlaceholder
              slotId="hero-professionals"
              label="ADPAP Professional Community"
              className="!object-contain aspect-[16/9] w-full rounded-2xl border border-white/10 bg-navy-950 shadow-elevated"
            />
          </div>
        </div>
      </section>

      {/* ============================ 2. CREDIBILITY ============================ */}
      <section className="section -mt-1 py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">Built From an Existing Community</span>
          <h2 className="text-balance mt-3 text-2xl font-semibold text-navy-950 sm:text-3xl">
            Grown from years of privacy training and practice
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-navy-700/65">
            ADPAP is operated by {ORG.operator} following years of engagement with Data
            Protection Officers, privacy practitioners, and organizations through professional
            training, certification, learning programs, and national Data Privacy events.
          </p>
        </div>
        <div className="mt-10">
          <StatsStrip />
        </div>
      </section>

      {/* ================ 3. PRIVACY BEYOND THE DPO / ADVOCATE NETWORK ================ */}
      <section className="bg-mist-100 py-20 lg:py-24">
        <div className="section">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center">Privacy Beyond the DPO</span>
            <h2 className="text-balance mt-4 font-display text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl">
              Every organization needs a DPO. But privacy can't be the job of one person alone.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy-700/70">
              Data moves through every department, not just the compliance office. HR handles
              employee data. Marketing handles customer data. Finance handles financial data. IT
              protects systems. Management establishes governance. Educators handle student
              information. Frontliners collect customer information every day. Every one of them
              can become a Data Privacy Advocate.
            </p>
          </div>

          <div className="mt-16 lg:mt-20">
            <AdvocateNetwork />
          </div>

          <div className="mt-14 flex flex-col items-center gap-2 text-center">
            <p className="font-display text-lg font-semibold text-navy-950">
              Privacy is everyone's responsibility.
            </p>
            <p className="max-w-md text-sm text-navy-700/60">
              ADPAP builds the advocates who make privacy part of everyday organizational culture.
            </p>
          </div>
        </div>
      </section>

      {/* ============================ 4 & 5. COMMUNITY + WHY ADPAP ============================ */}
      <section className="section py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="eyebrow">A Professional Community</span>
            <h2 className="text-balance mt-3 font-display text-3xl font-semibold leading-tight text-navy-950 sm:text-4xl">
              You don't have to practice privacy alone.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-navy-700/70">
              Connect with professionals who face the same responsibilities, challenges, and
              opportunities you do — across industries, across roles, across the Philippines.
            </p>
          </div>
          <ImagePlaceholder
            slotId="community-forum"
            label="ADPAP Community & Forums"
            className="aspect-[8/5] w-full rounded-2xl shadow-card"
          />
        </div>

        <div className="mt-16 lg:mt-20">
          <div className="max-w-2xl">
            <span className="eyebrow">Why ADPAP</span>
            <h3 className="mt-3 text-2xl font-semibold text-navy-950 sm:text-3xl">
              Why ADPAP members choose to belong
            </h3>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card card-hover p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-950 text-gold-400">
                    <f.icon />
                  </div>
                  <span className="font-display text-2xl font-semibold text-navy-900/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h4 className="mt-5 text-base font-semibold text-navy-950">{f.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-navy-700/80">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {TESTIMONIALS.length > 0 && (
          <div className="mt-16 lg:mt-20">
            <div className="max-w-2xl">
              <span className="eyebrow">Voices From the Privacy Community</span>
              <h3 className="mt-3 text-2xl font-semibold text-navy-950 sm:text-3xl">
                What our audience say
              </h3>
            </div>
            <div className="mt-8">
              <Testimonials />
            </div>
          </div>
        )}
      </section>

      {/* ============================ 6. ACTIVE ALL YEAR ============================ */}
      <section className="bg-mist-100 py-20 lg:py-24">
        <div className="section">
          <div className="max-w-2xl">
            <span className="eyebrow">Beyond the Membership Card</span>
            <h2 className="mt-3 text-3xl font-semibold text-navy-950 sm:text-4xl">
              A membership that stays active all year.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-700/65">
              ADPAP membership is designed to keep professionals learning, connected, visible, and
              involved throughout the year.
            </p>
          </div>
          <div className="mt-10">
            <MembershipActivityGrid />
          </div>
        </div>
      </section>

      {/* Compact CTA after year-round benefits */}
      <section className="bg-navy-950 py-14">
        <div className="section flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
              Your professional community is waiting.
            </h3>
            <p className="mt-1.5 text-sm text-white/60">
              Join professionals committed to strengthening privacy practice across the
              Philippines.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-3">
            <Link to="/membership" className="btn-ghost-light">
              Explore Membership
            </Link>
            <Link to="/apply" className="btn-gold">
              Join ADPAP
            </Link>
          </div>
        </div>
      </section>

      {/* ============================ 7. MEMBERSHIP ============================ */}
      <section className="py-20 lg:py-28">
        <div className="section">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Membership</span>
              <h2 className="mt-3 text-3xl font-semibold text-navy-950 sm:text-4xl">
                Choose the category that fits you
              </h2>
            </div>
            <Link to="/membership" className="btn-outline">
              Compare all benefits
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {MEMBERSHIP_PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================ 8. DIGITAL ID ============================ */}
      <section className="bg-mist-100 py-20 lg:py-24">
        <div className="section">
          <div className="mx-auto max-w-2xl text-center">
            <span className="eyebrow justify-center">Membership, Made Visible</span>
            <h2 className="mt-3 text-3xl font-semibold text-navy-950 sm:text-4xl">
              Your professional membership. Recognized. Verifiable.
            </h2>
          </div>
          <div className="mt-12">
            <DigitalIDShowcase />
          </div>
        </div>
      </section>

      {/* ============================ 9. FOUNDING MEMBER ============================ */}
      {FOUNDING_CAMPAIGN.active && (
        <section className="section py-20 lg:py-24">
          <div className="overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-navy-950 to-navy-900 px-8 py-14 text-white sm:px-14">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
              <FoundingSeal size={140} />
              <div>
                <span className="eyebrow !text-gold-400 justify-center sm:justify-start">Founding Membership</span>
                <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Become a Founding Member</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/65">
                  Be among the pioneers building a stronger privacy community in the Philippines.
                  Members admitted during the ADPAP founding period receive the Founding Member
                  designation as part of their membership history — displayed on your digital ID,
                  certificate, and verification profile.
                </p>
                <Link to="/apply" className="btn-gold mt-7 inline-flex">
                  Become a Founding Member
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================ 10. GK HERITAGE / SECRETARIAT ============================ */}
      <section className="section pb-20 lg:pb-24">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-navy-900/8 bg-white px-8 py-8 text-center shadow-card sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <img
              src="/assets/globalknowledge-logo.png"
              alt="GlobalKnowledge PH, Inc."
              className="h-12 w-12 shrink-0 object-contain"
            />
            <p className="text-sm leading-relaxed text-navy-700/75">
              A professional membership community operated by{" "}
              <span className="font-semibold text-navy-900">{ORG.operator}</span>
            </p>
          </div>
          <Link to="/about" className="btn-outline shrink-0 !py-2 !px-4 text-sm">
            About ADPAP
          </Link>
        </div>
      </section>

      {/* ============================ 11. FINAL CTA ============================ */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="pointer-events-none absolute inset-0 bg-navy-grid bg-[length:44px_44px] opacity-30" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="section relative flex flex-col items-center gap-4 py-20 text-center text-white">
          <span className="eyebrow !text-gold-400">Your training was the beginning.</span>
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            From privacy practitioner to privacy leader.
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-white/60">
            Become part of the founding community of the Alliance of Data Privacy Advocates
            Philippines.
          </p>
          <Link to="/apply" className="btn-gold mt-3">
            Become a Founding Member
          </Link>
        </div>
      </section>

      {/* ============================ 12. DATA PRIVACY NOTICE ============================ */}
      <section className="border-t border-navy-900/8 bg-white py-16 lg:py-20">
        <div className="section">
          <div className="max-w-2xl">
            <span className="eyebrow">Data Privacy Notice</span>
            <h2 className="mt-3 text-2xl font-semibold text-navy-950 sm:text-3xl">
              Your privacy, protected.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-navy-700/70">
              As a membership community for data privacy advocates, ADPAP holds itself to the
              standard it promotes. This notice summarizes how {ORG.operator}, as the
              organization operating ADPAP and administering ADPAP membership information,
              handles your personal information in accordance with the Data Privacy Act of 2012
              (Republic Act No. 10173) and its Implementing Rules and Regulations.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold text-navy-950">What we collect &amp; why</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
                We collect the information you provide when applying for membership, using the
                Member Portal, or contacting the Secretariat — such as your name, contact
                details, professional information, payment details, and, for institutional
                applications, organization and representative information. We use this to
                process applications, administer membership, verify payments, issue membership
                IDs and certificates, and communicate with you about ADPAP.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-950">Your rights as a data subject</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
                Under the Data Privacy Act, you have the right to be informed, to access and
                correct your data, to object to or request the erasure or blocking of your data,
                to data portability, to damages for violations of your rights, and to file a
                complaint with the National Privacy Commission (NPC).
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-navy-950">How we protect it</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
                We do not sell personal information, and access is limited to the Secretariat and
                authorized personnel who need it to administer membership. Our public
                Membership Verification page displays only your name, membership number,
                category, status, and validity — never contact details or payment information.
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-start gap-3 rounded-lg border border-navy-900/8 bg-mist-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-relaxed text-navy-700/60">
              For privacy-related concerns, or to exercise any of your rights above, contact the
              ADPAP Secretariat at{" "}
              <a href="mailto:secretariat@gkphilippines.com" className="font-medium text-royal-600 hover:underline">
                secretariat@gkphilippines.com
              </a>
              .
            </p>
            <Link to="/privacy-notice" className="btn-outline shrink-0 !py-2 !px-4 text-xs">
              Read the Full Privacy Notice
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureIconCap() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M6 10.5V16c0 1.1 2.7 3 6 3s6-1.9 6-3v-5.5" />
    </svg>
  );
}
function FeatureIconTool() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14.7 6.3a4 4 0 1 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" />
    </svg>
  );
}
function FeatureIconTag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3h6a2 2 0 0 1 2 2v6L11 20l-9-9L11 3Z" />
      <circle cx="15" cy="8" r="1.3" />
    </svg>
  );
}
function FeatureIconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5" />
    </svg>
  );
}
function FeatureIconNetwork() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="6" cy="7" r="2.3" />
      <circle cx="18" cy="7" r="2.3" />
      <circle cx="12" cy="18" r="2.3" />
      <path d="M7.8 8.5 10.5 16M16.2 8.5 13.5 16M8.3 7h7.4" />
    </svg>
  );
}
function FeatureIconFlag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 3v18" />
      <path d="M5 4h12l-3 4 3 4H5" />
    </svg>
  );
}
