import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { id: "service", label: "1. Service Description & Eligibility" },
  { id: "accounts", label: "2. Account Creation & Responsibilities" },
  { id: "payments", label: "3. Payment Terms" },
  { id: "certificates", label: "4. Certificates & Badges" },
  { id: "talent-pool", label: "5. The Talent Pool" },
  { id: "employers", label: "6. Employer Obligations" },
  { id: "ip", label: "7. Intellectual Property" },
  { id: "ai-grading", label: "8. AI Grading Disclaimer" },
  { id: "conduct", label: "9. Prohibited Conduct" },
  { id: "termination", label: "10. Termination" },
  { id: "liability", label: "11. Limitation of Liability" },
  { id: "law", label: "12. Governing Law" },
  { id: "changes", label: "13. Changes to These Terms" },
  { id: "contact", label: "14. Contact" },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="pt-2">
      <h2 className="text-lg font-bold mb-2 scroll-mt-24" style={{ color: "#0f1f3d" }}>
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <main style={{ fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: 29 June 2026</p>

        <div
          className="rounded-xl px-5 py-4 mb-10 text-sm leading-relaxed"
          style={{ backgroundColor: "rgba(187,0,0,0.06)", color: "#7a1212", border: "1px solid rgba(187,0,0,0.15)" }}
        >
          <strong>Draft notice:</strong> This is a draft policy. Tundemy recommends consulting a
          Kenyan-licensed attorney before relying on this as your final legal terms.
        </div>

        {/* Table of contents */}
        <nav
          className="rounded-xl border border-gray-100 p-5 mb-12"
          style={{ backgroundColor: "rgba(15,31,61,0.03)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            On this page
          </p>
          <ol className="grid sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:underline" style={{ color: "#2d8a4e" }}>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10 text-sm text-gray-600 leading-relaxed">
          <Section id="service" title="1. Service Description & Eligibility">
            <p>
              Tundemy ("Tundemy", "we", "us") is an online platform based in Kenya that teaches
              practical AI skills to individuals across Africa through paid courses, hands-on
              sandbox exercises, AI-graded assessments and capstone projects, and issues
              certificates to students who demonstrate competence. Tundemy also operates a talent
              pool that connects certified students with employers seeking AI-skilled talent, and
              an employer-facing job posting and candidate matching service.
            </p>
            <p>
              You must be at least 18 years old to create an account on Tundemy, whether as a
              student or as an employer. By creating an account, you confirm that you meet this
              age requirement and that the information you provide is accurate.
            </p>
          </Section>

          <Section id="accounts" title="2. Account Creation & Responsibilities">
            <p>
              You need an account to enrol in courses, submit assessments, or access the employer
              dashboard. You are responsible for keeping your login credentials confidential and
              for all activity that happens under your account. Notify us immediately at{" "}
              <a href="mailto:hello@tundemy.com" className="font-bold" style={{ color: "#2d8a4e" }}>
                hello@tundemy.com
              </a>{" "}
              if you suspect unauthorised use of your account.
            </p>
            <p>
              Each account belongs to one person or one organisation. Sharing a single account
              between multiple people (for example, to split the cost of a course) is not
              permitted — see Section 9, Prohibited Conduct.
            </p>
          </Section>

          <Section id="payments" title="3. Payment Terms">
            <p>
              Course fees are one-time payments made via M-Pesa/Pesapal (for payments in Kenyan
              Shillings) or Stripe (for international card payments). Once payment is confirmed,
              you are granted lifetime access to that course's lessons, sandboxes, and
              assessments.
            </p>
            <p>
              <strong>Refund policy:</strong> Because course content is unlocked in full
              immediately upon payment, fees are non-refundable once you have accessed any lesson
              content within a course. If a payment was taken in error, was duplicated, or you
              have not accessed any course content within 48 hours of purchase, you may request a
              refund by emailing{" "}
              <a href="mailto:hello@tundemy.com" className="font-bold" style={{ color: "#2d8a4e" }}>
                hello@tundemy.com
              </a>
              . We will review each request on its individual facts and respond within 7 business
              days. This policy does not limit any refund right you have under Kenyan consumer
              protection law.
            </p>
            <p>
              Employer talent-pool unlock fees (single-candidate unlocks and unlock bundles) are
              also one-time payments and follow the same non-refundable-after-use principle: once
              an employer has viewed a candidate's unlocked contact details, that unlock is not
              refundable.
            </p>
          </Section>

          <Section id="certificates" title="4. Certificates & Badges">
            <p>
              Tundemy issues a certificate and/or skill badge when you complete a course's
              required lessons and pass its assessments and capstone project at the required
              score threshold. A certificate reflects the skill you demonstrated at the time you
              completed that assessment. It is evidence of demonstrated competence on that date —
              it is <strong>not a guarantee of employment</strong>, a professional license, or an
              endorsement of your future performance.
            </p>
            <p>
              Tundemy reserves the right to revoke or invalidate a certificate or badge at any
              time if we determine, in our reasonable judgment, that it was obtained dishonestly —
              for example through plagiarism, account sharing, or submitting someone else's work
              as your own.
            </p>
          </Section>

          <Section id="talent-pool" title="5. The Talent Pool">
            <p>
              Students may opt in to the talent pool from their dashboard. Opting in makes a
              public profile visible to employers browsing Tundemy, showing information such as
              your name, headline, bio, skills, completed courses, badges earned, and (where you
              choose to make it public) assessment scores. Your direct contact details (email and
              phone number) are <strong>never shown publicly</strong> — they are only revealed to
              a specific employer after that employer pays to "unlock" your profile.
            </p>
            <p>
              You can hide your profile from the talent pool, or remove it entirely, at any time
              from your dashboard. Hiding your profile stops new employers from finding or
              unlocking you going forward; it does not retroactively hide your contact details
              from employers who unlocked your profile before you hid it.
            </p>
          </Section>

          <Section id="employers" title="6. Employer Obligations">
            <p>
              Employers may create an account to post job listings and pay to unlock candidate
              contact details, either individually or via a bundle. By unlocking a candidate's
              contact information, an employer agrees to:
            </p>
            <p>
              use the unlocked information solely to evaluate and contact that candidate for
              legitimate recruitment purposes; not send unsolicited bulk messages, spam, or
              marketing unrelated to a specific role; and not resell, sublicense, rent, or share
              unlocked candidate data with any third party, including other recruiters or
              external databases.
            </p>
            <p>
              Violation of this section is treated as a material breach of these Terms and may
              result in immediate suspension of the employer account without refund of unlock
              fees already paid.
            </p>
          </Section>

          <Section id="ip" title="7. Intellectual Property">
            <p>
              All course content — lesson text, videos, sandbox exercises, quiz and assessment
              questions, and grading rubrics — is owned by Tundemy or its licensors and is
              provided to you for your personal, non-commercial learning use only. You may not
              copy, redistribute, resell, or publicly republish course content.
            </p>
            <p>
              Your capstone project submissions and any other original work you create remain
              your property. By submitting a capstone project, you grant Tundemy a non-exclusive,
              royalty-free licence to store it, have it reviewed by our AI grading system and
              human staff, and — if you opt in to the talent pool — to display a summary or
              excerpt of it on your public talent profile to demonstrate your skills to employers.
              You may withdraw this licence for future display at any time by hiding your talent
              profile or deleting your account.
            </p>
          </Section>

          <Section id="ai-grading" title="8. AI Grading Disclaimer">
            <p>
              Sandbox exercises, assessments, and capstone projects on Tundemy are graded using an
              AI system (currently built on Anthropic's Claude models) against a defined rubric.
              AI-generated grades and feedback are treated as final for the purpose of awarding
              certificates and badges.
            </p>
            <p>
              If you believe an AI grading decision was clearly incorrect, you may dispute it by
              emailing{" "}
              <a href="mailto:hello@tundemy.com" className="font-bold" style={{ color: "#2d8a4e" }}>
                hello@tundemy.com
              </a>{" "}
              with your submission and course details. Tundemy will have a human reviewer examine
              disputed gradings and may, at our discretion, adjust the result. Submitting a
              dispute does not guarantee the outcome will change.
            </p>
          </Section>

          <Section id="conduct" title="9. Prohibited Conduct">
            <p>You agree not to, while using Tundemy:</p>
            <p>
              submit work in an assessment, sandbox, or capstone that is not your own (cheating or
              plagiarism); share your account credentials with another person or use an account
              that is not your own; attempt to scrape, bulk-download, or systematically extract
              course content, candidate profiles, or other platform data; attempt to circumvent
              payment, access controls, or rate limits; or misrepresent your identity,
              qualifications, or (for employers) the organisation you represent.
            </p>
            <p>
              Violating this section may result in suspension or termination of your account, and
              revocation of any certificates or badges obtained as a result.
            </p>
          </Section>

          <Section id="termination" title="10. Termination">
            <p>
              You may stop using Tundemy and request deletion of your account at any time by
              emailing{" "}
              <a href="mailto:hello@tundemy.com" className="font-bold" style={{ color: "#2d8a4e" }}>
                hello@tundemy.com
              </a>
              . We may suspend or terminate your account, with or without notice, if we
              reasonably believe you have violated these Terms, engaged in fraudulent payment
              activity, or misused the platform in a way that harms other users or Tundemy.
              Termination does not entitle you to a refund of fees already paid for content you
              have accessed.
            </p>
          </Section>

          <Section id="liability" title="11. Limitation of Liability">
            <p>
              Tundemy is provided on an "as is" and "as available" basis. To the fullest extent
              permitted by Kenyan law, Tundemy and its directors, employees, and partners are not
              liable for indirect, incidental, or consequential damages arising from your use of
              the platform, including but not limited to loss of income, loss of employment
              opportunities, or loss of data, even where a certificate, talent profile, or AI
              grading outcome did not lead to the result you expected. Our total liability to you
              for any claim arising from these Terms is limited to the amount you paid to Tundemy
              in the 12 months preceding the claim. Nothing in this section limits liability that
              cannot lawfully be limited, such as liability for fraud or gross negligence.
            </p>
          </Section>

          <Section id="law" title="12. Governing Law">
            <p>
              These Terms are governed by the laws of the Republic of Kenya. Any dispute arising
              from these Terms or your use of Tundemy will be subject to the exclusive
              jurisdiction of the courts of Kenya.
            </p>
          </Section>

          <Section id="changes" title="13. Changes to These Terms">
            <p>
              We may update these Terms from time to time to reflect changes to the platform or
              applicable law. We will update the "Last updated" date above when we do. Continuing
              to use Tundemy after an update takes effect constitutes your acceptance of the
              revised Terms. For material changes, we will make reasonable efforts to notify
              active users by email.
            </p>
          </Section>

          <Section id="contact" title="14. Contact">
            <p>
              Questions about these Terms can be sent to{" "}
              <a href="mailto:hello@tundemy.com" className="font-bold" style={{ color: "#2d8a4e" }}>
                hello@tundemy.com
              </a>
              .
            </p>
          </Section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
