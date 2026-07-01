import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const sections = [
  { id: "collect", label: "1. What Data We Collect" },
  { id: "use", label: "2. How We Use Your Data" },
  { id: "sharing", label: "3. Third Parties We Share Data With" },
  { id: "retention", label: "4. Data Retention" },
  { id: "rights", label: "5. Your Rights Under the Data Protection Act" },
  { id: "exercise", label: "6. How to Exercise Your Rights" },
  { id: "cookies", label: "7. Cookies" },
  { id: "security", label: "8. Data Security" },
  { id: "children", label: "9. Children's Privacy" },
  { id: "changes", label: "10. Changes to This Policy" },
  { id: "contact", label: "11. Contact" },
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

export default function PrivacyPage() {
  return (
    <main style={{ fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-6">Last updated: 29 June 2026</p>

        <div
          className="rounded-xl px-5 py-4 mb-10 text-sm leading-relaxed"
          style={{ backgroundColor: "rgba(187,0,0,0.06)", color: "#7a1212", border: "1px solid rgba(187,0,0,0.15)" }}
        >
          <strong>Draft notice:</strong> This is a draft policy. Tundemy recommends consulting a
          Kenyan-licensed attorney before relying on this as your final legal terms.
        </div>

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
          <Section id="collect" title="1. What Data We Collect">
            <p>
              <strong>Account information:</strong> your full name, email address, account type
              (student or employer), and password (stored securely hashed by our authentication
              provider, Supabase — we never see or store your plain-text password).
            </p>
            <p>
              <strong>Payment information:</strong> when you pay for a course or an employer
              unlock, your payment is processed directly by Pesapal (for M-Pesa and card payments
              in Kenya) or Stripe (for international cards). We receive and store only the
              transaction reference, amount, and status — never your full card number, M-Pesa PIN,
              or banking credentials.
            </p>
            <p>
              <strong>Course activity:</strong> enrolments, lesson completion progress, quiz and
              sandbox answers, assessment scores, and capstone project submissions.
            </p>
            <p>
              <strong>Self-reported profile data:</strong> if you choose to build a talent profile,
              the headline, bio, skills, years of experience, availability, and portfolio links
              you enter yourself, plus a phone number if you provide one for employer contact
              purposes.
            </p>
          </Section>

          <Section id="use" title="2. How We Use Your Data">
            <p>
              We use your data to: deliver the courses and features you have paid for; grade your
              sandbox, assessment, and capstone submissions using Anthropic's Claude API and
              generate feedback and certificates; build and display your talent profile if you opt
              in, and match you to relevant job postings; process payments and prevent fraud; and,
              only if you opt in, send you marketing communications about new courses or features.
              You can opt out of marketing emails at any time without affecting your access to
              paid course content.
            </p>
          </Section>

          <Section id="sharing" title="3. Third Parties We Share Data With">
            <p>We share data with the following service providers, only as needed to run Tundemy:</p>
            <p>
              <strong>Anthropic</strong> — receives the text of your sandbox, assessment, and
              capstone submissions in order to grade them via the Claude API. Anthropic processes
              this data to generate a grade and feedback and does not use it to train its models.
            </p>
            <p>
              <strong>Pesapal / Safaricom (M-Pesa)</strong> — receives your name, email, phone
              number, and payment amount to process M-Pesa and card payments made in Kenya.
            </p>
            <p>
              <strong>Stripe</strong> — receives your name, email, and card details to process
              international card payments. Tundemy never sees or stores your full card number.
            </p>
            <p>
              <strong>Resend</strong> — receives your email address to deliver transactional
              emails such as signup confirmation, password resets, and certificate notifications.
            </p>
            <p>
              <strong>Supabase</strong> — hosts our database and authentication system. All
              account, course, and profile data described above is stored on Supabase's
              infrastructure.
            </p>
            <p>
              We do not sell your personal data to anyone, and we do not share talent-pool contact
              details with an employer unless that employer has paid to unlock your specific
              profile.
            </p>
          </Section>

          <Section id="retention" title="4. Data Retention">
            <p>
              We retain your account and course data for as long as your account remains active,
              so that you keep access to your course history, certificates, and talent profile.
              If you request account deletion, we will delete or anonymise your personal data
              within 30 days, except where we are required to keep certain records (such as
              payment records) for longer to comply with Kenyan tax or financial regulations.
              Certificate verification records may be retained indefinitely in anonymised or
              minimal form (certificate ID, course, and completion date) so employers can continue
              to verify certificates you have already shared with them.
            </p>
          </Section>

          <Section id="rights" title="5. Your Rights Under the Data Protection Act">
            <p>
              As a data subject under Kenya's Data Protection Act, 2019, you have the right to:
              access the personal data we hold about you; request correction of inaccurate or
              outdated data; request deletion of your data, subject to the retention exceptions
              described above; object to or restrict certain processing of your data, including
              marketing communications; and request a copy of your data in a portable format.
            </p>
          </Section>

          <Section id="exercise" title="6. How to Exercise Your Rights">
            <p>
              To exercise any of the rights above, email{" "}
              <a href="mailto:hello@tundemy.com" className="font-bold" style={{ color: "#2d8a4e" }}>
                hello@tundemy.com
              </a>{" "}
              from the email address associated with your account. We will verify your identity
              and respond within the timeframes required under the Data Protection Act (generally
              within 7 days to acknowledge, and without undue delay to fulfil a valid request).
            </p>
          </Section>

          <Section id="cookies" title="7. Cookies">
            <p>
              Tundemy uses essential cookies to keep you signed in and to remember your session —
              these are required for the platform to function and cannot be disabled while using
              the service. We do not currently use third-party advertising or tracking cookies.
            </p>
          </Section>

          <Section id="security" title="8. Data Security">
            <p>
              We use industry-standard measures to protect your data, including encrypted
              connections (HTTPS) for all traffic, row-level access controls on our database so
              users can only access their own data, hashed password storage, and restricted
              internal access to payment and personal data. No system is completely secure, but we
              work to keep these protections current.
            </p>
          </Section>

          <Section id="children" title="9. Children's Privacy">
            <p>
              Tundemy is not intended for, and is not directed at, anyone under the age of 18. We
              do not knowingly collect personal data from children. If we become aware that a user
              under 18 has created an account, we will close the account and delete the associated
              data.
            </p>
          </Section>

          <Section id="changes" title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time to reflect changes to our
              practices or applicable law. We will update the "Last updated" date above when we
              do, and for material changes we will make reasonable efforts to notify active users
              by email.
            </p>
          </Section>

          <Section id="contact" title="11. Contact">
            <p>
              Questions about this policy or your data can be sent to{" "}
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
