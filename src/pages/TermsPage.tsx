import { ORG } from "@/data/siteConfig";

export default function TermsPage() {
  return (
    <div className="section max-w-3xl py-16 lg:py-20">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">Terms &amp; Conditions</h1>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-navy-800">
        <section>
          <h2 className="text-base font-semibold text-navy-950">1. Membership</h2>
          <p className="mt-2">
            {ORG.acronym} Professional Membership is offered on an annual basis across three
            categories: Individual Professional, Institutional, and Premium Institutional.
            Submission of a membership application does not automatically guarantee approval.
            The {ORG.acronym} Secretariat reviews each application and verifies payment before
            activating membership.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy-950">2. Fees and payment</h2>
          <p className="mt-2">
            Membership fees are payable annually as stated on the Membership page at the time of
            application. Fees are non-transferable between membership categories except at the
            Secretariat's discretion. Payment instructions are provided by the {ORG.acronym}{" "}
            Secretariat.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy-950">3. Benefits</h2>
          <p className="mt-2">
            Benefits described on the Membership page (training discounts, DPIA Builder access,
            convention discounts, exam review sessions, and similar) are subject to the terms of
            the underlying {ORG.operator} programs and may change from time to time. Stated
            indicative peso values are illustrative and not a guarantee of savings.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy-950">4. Code of conduct</h2>
          <p className="mt-2">
            Members are expected to engage with the {ORG.acronym} community professionally and in
            good faith, and to represent their credentials and affiliations accurately.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy-950">5. Community leadership and governance</h2>
          <p className="mt-2">
            Eligible members may participate in {ORG.acronym} community leadership and elections,
            subject to the {ORG.governanceDocumentName}. Community leadership positions within
            {" "}{ORG.acronym} (such as elected officers or committee members) are positions of
            community leadership within the membership program, and do not confer corporate
            officer status, signing authority, or any legal authority to act on behalf of{" "}
            {ORG.operator}.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy-950">6. Renewal and expiration</h2>
          <p className="mt-2">
            Memberships expire one year from activation unless renewed. Renewal reminders are
            sent in advance of expiration. Expired memberships lose access to member benefits
            until renewed; the original membership number is retained upon renewal.
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy-950">7. Status of {ORG.acronym}</h2>
          <p className="mt-2">
            {ORG.operatorRelationshipLong} {ORG.regulatorDisclaimer}
          </p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy-950">8. Contact</h2>
          <p className="mt-2">
            Questions about these Terms should be directed to{" "}
            <a href={`mailto:${ORG.secretariatEmail}`} className="text-royal-600 hover:underline">
              {ORG.secretariatEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
