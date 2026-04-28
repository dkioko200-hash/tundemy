"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";
import PreviewModal, { type PreviewCourse } from "./PreviewModal";

const courses: PreviewCourse[] = [
  {
    title: "Introduction to AI",
    description:
      "The fastest way to go from zero to productive with AI. Understand how AI works, which tools matter, and how to apply them to real business problems — no coding required.",
    level: "Beginner",
    lessons: 8,
    price: 1500,
    duration: "3 weeks",
    tag: "AI Foundations",
    tagColor: "#f59e0b",
    icon: "🚀",
    accomplishments: [
      "Explain how large language models generate text and make decisions",
      "Use ChatGPT, Claude, and Gemini confidently for real everyday tasks",
      "Identify the highest-value AI opportunities in your own industry",
      "Critically evaluate AI tools — understanding their limits and failure modes",
      "Build a personal AI adoption roadmap tailored to your career goals",
    ],
  },
  {
    title: "Prompt Engineering Mastery",
    description:
      "The most in-demand AI skill right now. Learn to write prompts that get professional results from any AI tool — for marketing, operations, customer service, coding, and more.",
    level: "Intermediate",
    lessons: 12,
    price: 2500,
    duration: "5 weeks",
    tag: "Certified Prompt Engineer",
    tagColor: "#2d8a4e",
    icon: "🧠",
    badge: "🔥 Most Popular",
    accomplishments: [
      "Write prompts that reduce AI back-and-forth by up to 70%",
      "Build a reusable prompt library for your most common business workflows",
      "Chain multi-step prompts to handle complex, multi-stage tasks",
      "Evaluate and compare output quality across ChatGPT, Claude, and Gemini",
      "Deploy a prompt-powered assistant your entire team can use daily",
    ],
  },
  {
    title: "AI for Data Analysis",
    description:
      "Turn raw data into decisions using AI. Learn to clean, analyze, and visualize business data without a data science degree. Skills valued by companies across every industry.",
    level: "Intermediate",
    lessons: 10,
    price: 2800,
    duration: "4 weeks",
    tag: "AI Data Analyst",
    tagColor: "#2563eb",
    icon: "📊",
    accomplishments: [
      "Clean and structure messy real-world datasets using AI assistance",
      "Generate professional dashboards and charts with natural language",
      "Write and debug SQL queries using AI code generation",
      "Build automated reports that surface actionable business insights",
      "Present AI-generated insights clearly to non-technical decision-makers",
    ],
  },
  {
    title: "WhatsApp Business AI Integration",
    description:
      "Build production-ready WhatsApp bots using the Meta Cloud API. Automate customer support, order updates, and lead qualification. Deployable from day one.",
    level: "Advanced",
    lessons: 14,
    price: 3500,
    duration: "6 weeks",
    tag: "WhatsApp AI Developer",
    tagColor: "#16a34a",
    icon: "💬",
    badge: "🇰🇪 Kenya Track",
    accomplishments: [
      "Configure a Meta Cloud API WhatsApp Business account from scratch",
      "Build a bot that resolves customer FAQs without human intervention",
      "Send automated transactional alerts and order updates via WhatsApp",
      "Design multi-step conversational flows using NLP techniques",
      "Deploy and monitor a production WhatsApp AI bot from day one",
    ],
  },
  {
    title: "M-Pesa Daraja API Integration",
    description:
      "Build fully functional payment systems using Safaricom's Daraja API. From sandbox setup through to production deployment — skills that fintech companies globally are hiring for.",
    level: "Advanced",
    lessons: 16,
    price: 4500,
    duration: "7 weeks",
    tag: "Daraja Certified Developer",
    tagColor: "#bb0000",
    icon: "💳",
    badge: "⭐ Most In Demand",
    accomplishments: [
      "Authenticate with Safaricom's Daraja sandbox and production environments",
      "Implement STK Push for seamless mobile payment initiation",
      "Handle C2B and B2C payment callbacks securely with full validation",
      "Build a payment confirmation, logging, and receipt system",
      "Ship a production-ready payment integration with error handling and retries",
    ],
  },
  {
    title: "AI for Agriculture and Agritech",
    description:
      "Apply AI to crop prediction, supply chain optimization, market pricing, and agricultural data analysis. Skills valued by agritech startups, NGOs, and food tech companies worldwide.",
    level: "Intermediate",
    lessons: 10,
    price: 3000,
    duration: "4 weeks",
    tag: "Agritech AI Specialist",
    tagColor: "#2d8a4e",
    icon: "🌱",
    badge: "🌱 High Demand",
    badgeBg: "#2d8a4e",
    bannerGradient: "linear-gradient(135deg, #0d3320 0%, #2d8a4e 100%)",
    accomplishments: [
      "Apply machine learning models to crop yield prediction and weather analysis",
      "Build supply chain optimization tools using AI and historical datasets",
      "Analyze agricultural market pricing data to surface trends and opportunities",
      "Create AI-powered dashboards for farm management and resource planning",
      "Deploy practical agritech solutions ready for startups, NGOs, and food companies",
    ],
  },
];

export default function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState<PreviewCourse | null>(null);
  const [activeFilter, setActiveFilter] = useState("All Courses");

  const filteredCourses = courses.filter((c) => {
    if (activeFilter === "All Courses") return true;
    if (activeFilter === "Most Popular") return c.badge?.includes("Popular");
    return c.level === activeFilter;
  });

  return (
    <>
      <section id="courses" className="pt-0 pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-14 space-y-4">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(45,138,78,0.1)",
                color: "#2d8a4e",
              }}
            >
              In-Demand AI Courses
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: "#0f1f3d" }}
            >
              Skills global employers{" "}
              <span style={{ color: "#2d8a4e" }}>hire for</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Every course includes video lessons, a hands-on sandbox, graded
              quizzes, and a portfolio project. Built with real business
              scenarios. Recognised by employers worldwide.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["All Courses", "Beginner", "Intermediate", "Advanced", "Most Popular"].map((filter) => {
              const isActive = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="px-4 py-1.5 text-sm font-semibold rounded-full border-2 transition-all duration-200"
                  style={
                    isActive
                      ? { backgroundColor: "#2d8a4e", borderColor: "#2d8a4e", color: "#ffffff" }
                      : { backgroundColor: "#ffffff", borderColor: "#0f1f3d", color: "#0f1f3d" }
                  }
                >
                  {filter}
                </button>
              );
            })}
          </div>

          {/* Single flex layout — 2 columns, last odd card centres itself */}
          <div className="flex flex-wrap justify-center gap-6">
            {filteredCourses.map((course) => (
              <div key={course.title} className="w-full sm:w-[calc(50%-12px)]">
                <CourseCard
                  title={course.title}
                  description={course.description}
                  level={course.level}
                  lessons={course.lessons}
                  price={course.price}
                  icon={course.icon}
                  tag={course.tag}
                  tagColor={course.tagColor}
                  badge={course.badge}
                  badgeBg={course.badgeBg}
                  bannerGradient={course.bannerGradient}
                  onPreview={() => setSelectedCourse(course)}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <PreviewModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
      />
    </>
  );
}
