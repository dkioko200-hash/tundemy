"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";
import PreviewModal, { type PreviewCourse } from "./PreviewModal";

const courses: PreviewCourse[] = [
  {
    title: "Introduction to AI",
    description:
      "The perfect starting point if you're new to artificial intelligence. Understand how AI works, explore the tools shaping Kenya's digital economy, and use AI confidently in your everyday work — no coding required.",
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
      "Go beyond basic prompts. Learn advanced techniques for structuring, chaining, and refining prompts that deliver consistent, high-quality results from any AI model. Build reusable systems your whole team can rely on.",
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
      "Harness AI to turn raw data into clear business intelligence — no data science degree required. Work with real Kenyan business datasets to generate charts, automated reports, and actionable insights using natural language.",
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
      "Build automated weekly reports tailored to Kenyan business metrics",
      "Present AI-generated insights clearly to non-technical decision-makers",
    ],
  },
  {
    title: "WhatsApp Business AI Integration",
    description:
      "Build production-ready WhatsApp bots using the Meta Cloud API. Automate customer support, order updates, and full conversational flows for Kenyan businesses — without enterprise-level budgets or teams.",
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
      "Deploy and monitor a live WhatsApp AI bot for a real Kenyan business",
    ],
  },
  {
    title: "M-Pesa Daraja API Integration",
    description:
      "Build fully functional payment systems with Safaricom's Daraja API. From sandbox setup through to production — covering STK Push, C2B, B2C, callbacks, and robust error handling at every step.",
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
      "Ship a production-ready M-Pesa integration with error handling and retries",
    ],
  },
];

export default function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState<PreviewCourse | null>(null);

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
              What You&apos;ll Learn
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: "#0f1f3d" }}
            >
              Courses built for the{" "}
              <span style={{ color: "#2d8a4e" }}>Kenyan market</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Every course uses real Kenyan business cases, local APIs, and
              projects you can actually deploy — not just theory.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {["All Courses", "Beginner", "Intermediate", "Advanced"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200"
                style={
                  filter === "All Courses"
                    ? { backgroundColor: "#0f1f3d", borderColor: "#0f1f3d", color: "#ffffff" }
                    : { backgroundColor: "transparent", borderColor: "#e5e7eb", color: "#6b7280" }
                }
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Single flex layout — 2 columns, last odd card centres itself */}
          <div className="flex flex-wrap justify-center gap-6">
            {courses.map((course) => (
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
