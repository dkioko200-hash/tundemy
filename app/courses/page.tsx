import Navbar from "@/components/Navbar";
import CoursesSection from "@/components/CoursesSection";
import Footer from "@/components/Footer";

export default function CoursesPage() {
  return (
    <main>
      <Navbar />
      <div className="pt-16">
        <CoursesSection />
      </div>
      <Footer />
    </main>
  );
}
