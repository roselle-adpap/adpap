import { Link } from "react-router-dom";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import StatsStrip from "@/components/StatsStrip";
import PhotoGallery from "@/components/PhotoGallery";
import { ORG } from "@/data/siteConfig";

const PILLARS = [
  "Data Privacy",
  "Data Protection",
  "Responsible Data Governance",
  "Compliance",
  "Professional Development",
  "Privacy Advocacy",
  "Continuing Education",
];

const JOURNEY = [
  { step: "Learn", desc: "Build capability.", icon: IconLearn },
  { step: "Connect", desc: "Build relationships.", icon: IconConnect },
  { step: "Practice", desc: "Apply privacy.", icon: IconPractice },
  { step: "Lead", desc: "Influence organizations.", icon: IconLead },
  { step: "Advocate", desc: "Strengthen privacy culture.", icon: IconAdvocate },
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-navy-950 py-20 text-white">
        <div className="section max-w-3xl">
          <span className="eyebrow !text-gold-400">About ADPAP</span>
          <h1 className="text-balance mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            A national community for the people who protect personal data every day.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-white/70">
            {ORG.brandName} ({ORG.acronym}) brings together professionals and organizations
            committed to strengthening responsible data privacy practice across the Philippines.
          </p>
          <p className="mt-3 text-base leading-relaxed text-white/70">
            {ORG.acronym} is operated by {ORG.operator} as part of its continuing commitment to
            professional development, responsible data governance, continuing education, and
            privacy advocacy.
          </p>
        </div>
      </section>

      {/* The five pillars */}
      <section className="section py-16 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-5">
          {JOURNEY.map((j) => (
            <div key={j.step} className="card card-hover p-5 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-navy-950 text-gold-400">
                <j.icon />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-navy-950">{j.step}</h3>
              <p className="mt-1 text-xs text-navy-700/60">{j.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="text-2xl font-semibold text-navy-950">What ADPAP stands for</h2>
            <p className="mt-4 text-sm leading-relaxed text-navy-700/85">
              ADPAP exists to support the people who carry data privacy responsibility inside
              their organizations — Data Protection Officers, alternate DPOs, compliance and
              cybersecurity practitioners, HR professionals, lawyers, consultants, educators, and
              business owners. Membership is built around practical continuity: tools you can use,
              training you can access at preferential rates, and a network of peers navigating the
              same obligations.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {PILLARS.map((p) => (
                <span
                  key={p}
                  className="rounded-full border border-royal-600/20 bg-royal-600/5 px-3.5 py-1.5 text-xs font-medium text-royal-700"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-7">
            <img
              src="/assets/globalknowledge-logo.png"
              alt={ORG.operator}
              className="h-14 w-14 object-contain"
            />
            <h3 className="mt-4 font-display text-lg font-semibold text-navy-950">Operated by</h3>
            <p className="mt-2 text-xl font-semibold text-royal-700">{ORG.operator}</p>
            <p className="mt-4 text-sm leading-relaxed text-navy-700/80">
              {ORG.acronym} is a professional membership community operated by {ORG.operator} as
              a way to extend the value of data privacy training beyond the classroom. {ORG.operator}{" "}
              administers {ORG.acronym}'s Secretariat functions, member communications, and
              administrative operations.
            </p>
            <div className="mt-6 border-t border-navy-900/8 pt-5">
              <p className="text-sm font-medium text-navy-900">Secretariat contact</p>
              <a href={`mailto:${ORG.secretariatEmail}`} className="text-sm text-royal-600 hover:underline">
                {ORG.secretariatEmail}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <ImagePlaceholder
            slotId="about-heritage"
            label="GlobalKnowledge PH Training History"
            className="aspect-[14/9] w-full rounded-xl shadow-card"
          />
          <div>
            <span className="eyebrow">Built From an Existing Community</span>
            <h3 className="mt-2 text-xl font-semibold text-navy-950">
              Grown from years of privacy training and practice
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-navy-700/75">
              {ORG.acronym} is operated by {ORG.operator} following years of engagement with
              Data Protection Officers, privacy practitioners, and organizations through
              professional training, certification, learning programs, and national Data Privacy
              events.
            </p>
          </div>
        </div>
        <div className="mt-10">
          <StatsStrip />
        </div>

        <div className="mt-14">
          <span className="eyebrow">Our Privacy Community</span>
          <h3 className="mt-2 text-xl font-semibold text-navy-950">From our events and forums</h3>
          <div className="mt-6">
            <PhotoGallery />
          </div>
        </div>

        <div className="mt-14 rounded-xl border border-gold-500/30 bg-gold-400/10 p-6">
          <p className="text-sm leading-relaxed text-navy-800">
            <strong className="font-semibold">Disclaimer:</strong> {ORG.operatorRelationshipLong}{" "}
            {ORG.regulatorDisclaimer}
          </p>
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link to="/membership" className="btn-primary">
            Compare Membership Categories
          </Link>
          <Link to="/apply" className="btn-outline">
            Apply for Membership
          </Link>
        </div>
      </section>
    </div>
  );
}

function IconLearn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M6 10.5V16c0 1.1 2.7 3 6 3s6-1.9 6-3v-5.5" />
    </svg>
  );
}
function IconConnect() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="6" cy="7" r="2.3" />
      <circle cx="18" cy="7" r="2.3" />
      <circle cx="12" cy="18" r="2.3" />
      <path d="M7.8 8.5 10.5 16M16.2 8.5 13.5 16M8.3 7h7.4" />
    </svg>
  );
}
function IconPractice() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14.7 6.3a4 4 0 1 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2 2.5-2.5Z" />
    </svg>
  );
}
function IconLead() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 3v18" />
      <path d="M5 4h12l-3 4 3 4H5" />
    </svg>
  );
}
function IconAdvocate() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
