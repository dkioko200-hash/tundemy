import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main style={{ fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: 2026</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>1. Using Tundemy</h2>
            <p>
              Tundemy is a learning platform that provides AI skills courses, hands-on sandbox
              exercises, assessments, and a talent pool connecting verified graduates with
              employers. By creating an account you agree to use the platform honestly — including
              submitting your own work for assessments, sandboxes, and capstone projects.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>2. Payments and Refunds</h2>
            <p>
              Course fees and employer talent-unlock fees are charged in Kenyan Shillings via
              Pesapal. Access is granted once payment is confirmed. Because course content is
              unlocked immediately on payment, fees are generally non-refundable once a course has
              been accessed, except where required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>3. Certificates and Badges</h2>
            <p>
              Certificates and skill badges are issued automatically when course or assessment
              requirements are met. Tundemy reserves the right to revoke a certificate or badge if
              it was obtained through dishonest means (for example, plagiarised capstone
              submissions).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>4. The Talent Pool</h2>
            <p>
              Opting into the talent pool makes your profile, badges, and verified scores visible to
              employers. Employers who unlock a profile receive your contact details for the
              purpose of recruitment. You are responsible for the accuracy of the information in
              your profile.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>5. Employer Accounts</h2>
            <p>
              Employers may post jobs and unlock candidate profiles for a fee. Unlocked contact
              information must only be used for legitimate recruitment purposes and must not be
              resold or shared with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>6. Acceptable Use</h2>
            <p>
              You may not use Tundemy to upload harmful content, attempt to bypass payment or
              access controls, or misrepresent your identity or qualifications. Accounts found to
              violate these terms may be suspended or terminated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>7. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of Tundemy after an update
              constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>8. Contact</h2>
            <p>
              Questions about these terms can be sent to{" "}
              <a href="mailto:hello@tundemy.com" className="font-bold" style={{ color: "#2d8a4e" }}>
                hello@tundemy.com
              </a>.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
