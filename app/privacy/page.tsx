import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main style={{ fontFamily: "Inter, sans-serif" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <h1 className="text-3xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: 2026</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>1. Information We Collect</h2>
            <p>
              When you create a Tundemy account we collect your name, email address, and any profile
              information you choose to add (such as a headline, bio, skills, and portfolio links).
              When you enrol in a course, we record your enrollment, course progress, lesson
              completions, quiz and assessment results, and capstone submissions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>2. Payments</h2>
            <p>
              Course and unlock payments are processed by Pesapal. Tundemy does not store your
              card or M-Pesa PIN details — Pesapal handles payment collection and shares only the
              transaction status and reference with us so we can activate your enrollment or
              employer unlock.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>3. AI Grading</h2>
            <p>
              Sandbox tasks, assessments, and capstone submissions may be sent to a third-party AI
              provider (Anthropic) for automated grading and feedback. Submissions are processed
              solely to generate your grade and feedback and are not used to train third-party models.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>4. The Talent Pool</h2>
            <p>
              If you opt in to the talent pool, your profile (name, headline, bio, skills, verified
              badges, course completions, and assessment scores) becomes visible to employers
              browsing Tundemy. Contact details such as email and phone are only revealed to an
              employer after they unlock your profile. You can control your visibility from your
              dashboard at any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>5. Certificates</h2>
            <p>
              When you complete a course, Tundemy issues a certificate record containing your name,
              the course title, and a unique certificate ID. This record can be looked up via our
              public certificate verification page so employers can confirm a certificate is genuine.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>6. Data Storage</h2>
            <p>
              Account and platform data is stored using Supabase. We retain your data for as long
              as your account is active. You may request deletion of your account and associated
              data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-2" style={{ color: "#0f1f3d" }}>7. Contact</h2>
            <p>
              Questions about this policy or your data can be sent to{" "}
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
