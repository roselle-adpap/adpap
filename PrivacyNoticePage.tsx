import { ORG } from "@/data/siteConfig";

export default function PrivacyNoticePage() {
  return (
    <div className="section max-w-3xl py-16 lg:py-20">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-3 font-display text-3xl font-semibold text-navy-950 sm:text-4xl">Data Privacy Notice</h1>
      <p className="mt-3 text-sm text-navy-700/60">Last updated: 2026</p>

      <div className="prose-sm mt-10 space-y-8 text-sm leading-relaxed text-navy-800">
        <section>
          <h2 className="text-base font-semibold text-navy-950">1. Who we are</h2>
          <p className="mt-2">
            {ORG.operatorRelationshipLong} This notice explains how {ORG.operator}, as the
            organization operating {ORG.acronym} and administering {ORG.acronym} membership
            information, handles personal information collected through this website, the
            membership application process, and the Member Portal.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-950">2. What we collect</h2>
          <p className="mt-2">
            When you apply for or renew membership, we collect identity and contact details
            (name, email, mobile number, address), professional details (employer, position,
            industry, DPO status, training and certifications), organizational details for
            institutional applications (organization name, representatives), and payment
            information you provide (payment method, reference number, proof of payment). We do
            not collect more personal information than is reasonably necessary for these
            purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-950">3. Why we collect it</h2>
          <p className="mt-2">
            We use this information to evaluate and process membership applications, verify
            payment, administer membership benefits and records, issue membership IDs and
            certificates, communicate with members about ADPAP activities and renewals, and
            maintain accurate records for the Secretariat.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-950">4. Who may access it</h2>
          <p className="mt-2">
            Access is limited to the {ORG.acronym} Secretariat and authorized personnel of{" "}
            {ORG.operator} who need the information to administer membership. We do not sell
            personal information. The public Membership Verification page displays only a
            member's name, membership number, category, status, and validity period — never
            contact details, date of birth, address, or payment information.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-950">5. Retention</h2>
          <p className="mt-2">
            We retain member information for as long as the membership is active, and for a
            reasonable period afterward to support renewal, recordkeeping, and legitimate
            administrative or audit purposes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-950">6. Your rights</h2>
          <p className="mt-2">
            You may request access to, correction of, or deletion of your personal information,
            subject to our reasonable recordkeeping obligations. You may also ask questions about
            how your information is used at any time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-navy-950">7. Contact us</h2>
          <p className="mt-2">
            For privacy-related concerns or requests, contact the {ORG.acronym} Secretariat at{" "}
            <a href={`mailto:${ORG.secretariatEmail}`} className="text-royal-600 hover:underline">
              {ORG.secretariatEmail}
            </a>
            .
          </p>
        </section>

        <div className="rounded-lg border border-gold-500/30 bg-gold-400/10 p-5">
          <p className="text-xs leading-relaxed text-navy-800">
            {ORG.operator}, as operator of {ORG.acronym}, aims to process personal information
            responsibly and in accordance with applicable Philippine data protection
            requirements. This notice is provided for transparency and does not constitute legal
            advice or a guarantee of regulatory compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
