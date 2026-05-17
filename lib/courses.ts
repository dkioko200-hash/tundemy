export interface Course {
  slug: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price_kes: number;
  lessons_count: number;
  duration: string;
  tag: string;
  tag_color: string;
  icon: string;
  badge_label?: string;
  badge_bg?: string;
  banner_gradient?: string;
  what_you_will_learn: [string, string, string, string, string];
}

export const courses: Course[] = [
  {
    slug: "intro-to-ai",
    title: "Introduction to AI",
    description:
      "The fastest way to go from zero to productive with AI. Understand how AI works, which tools matter, and how to apply them to real business problems — no coding required.",
    level: "Beginner",
    price_kes: 1500,
    lessons_count: 8,
    duration: "3 weeks",
    tag: "AI Foundations",
    tag_color: "#f59e0b",
    icon: "🚀",
    what_you_will_learn: [
      "Explain how large language models generate text and make decisions",
      "Use ChatGPT, Claude, and Gemini confidently for real everyday tasks",
      "Identify the highest-value AI opportunities in your own industry",
      "Critically evaluate AI tools — understanding their limits and failure modes",
      "Build a personal AI adoption roadmap tailored to your career goals",
    ],
  },
  {
    slug: "prompt-engineering",
    title: "Prompt Engineering Mastery",
    description:
      "The most in-demand AI skill right now. Learn to write prompts that get professional results from any AI tool — for marketing, operations, customer service, coding, and more.",
    level: "Intermediate",
    price_kes: 2500,
    lessons_count: 12,
    duration: "5 weeks",
    tag: "Certified Prompt Engineer",
    tag_color: "#2d8a4e",
    icon: "🧠",
    badge_label: "🔥 Most Popular",
    what_you_will_learn: [
      "Write prompts that reduce AI back-and-forth by up to 70%",
      "Build a reusable prompt library for your most common business workflows",
      "Chain multi-step prompts to handle complex, multi-stage tasks",
      "Evaluate and compare output quality across ChatGPT, Claude, and Gemini",
      "Deploy a prompt-powered assistant your entire team can use daily",
    ],
  },
  {
    slug: "ai-data-analysis",
    title: "AI for Data Analysis",
    description:
      "Turn raw data into decisions using AI. Learn to clean, analyze, and visualize business data without a data science degree. Skills valued by companies across every industry.",
    level: "Intermediate",
    price_kes: 2800,
    lessons_count: 10,
    duration: "4 weeks",
    tag: "AI Data Analyst",
    tag_color: "#2563eb",
    icon: "📊",
    what_you_will_learn: [
      "Clean and structure messy real-world datasets using AI assistance",
      "Generate professional dashboards and charts with natural language",
      "Write and debug SQL queries using AI code generation",
      "Build automated reports that surface actionable business insights",
      "Present AI-generated insights clearly to non-technical decision-makers",
    ],
  },
  {
    slug: "whatsapp-ai-integration",
    title: "WhatsApp Business AI Integration",
    description:
      "Build production-ready WhatsApp bots using the Meta Cloud API. Automate customer support, order updates, and lead qualification. Deployable from day one.",
    level: "Advanced",
    price_kes: 3500,
    lessons_count: 14,
    duration: "6 weeks",
    tag: "WhatsApp AI Developer",
    tag_color: "#16a34a",
    icon: "💬",
    badge_label: "🇰🇪 Kenya Track",
    what_you_will_learn: [
      "Configure a Meta Cloud API WhatsApp Business account from scratch",
      "Build a bot that resolves customer FAQs without human intervention",
      "Send automated transactional alerts and order updates via WhatsApp",
      "Design multi-step conversational flows using NLP techniques",
      "Deploy and monitor a production WhatsApp AI bot from day one",
    ],
  },
  {
    slug: "mpesa-daraja-api",
    title: "M-Pesa Daraja API Integration",
    description:
      "Build fully functional payment systems using Safaricom's Daraja API. From sandbox setup through to production deployment — skills that fintech companies globally are hiring for.",
    level: "Advanced",
    price_kes: 4500,
    lessons_count: 16,
    duration: "7 weeks",
    tag: "Daraja Certified Developer",
    tag_color: "#bb0000",
    icon: "💳",
    badge_label: "⭐ Most In Demand",
    what_you_will_learn: [
      "Authenticate with Safaricom's Daraja sandbox and production environments",
      "Implement STK Push for seamless mobile payment initiation",
      "Handle C2B and B2C payment callbacks securely with full validation",
      "Build a payment confirmation, logging, and receipt system",
      "Ship a production-ready payment integration with error handling and retries",
    ],
  },
  {
    slug: "ai-agriculture",
    title: "AI for Agriculture and Agritech",
    description:
      "Apply AI to crop prediction, supply chain optimization, market pricing, and agricultural data analysis. Skills valued by agritech startups, NGOs, and food tech companies worldwide.",
    level: "Intermediate",
    price_kes: 3000,
    lessons_count: 10,
    duration: "4 weeks",
    tag: "Agritech AI Specialist",
    tag_color: "#2d8a4e",
    icon: "🌱",
    badge_label: "🌱 High Demand",
    badge_bg: "#2d8a4e",
    banner_gradient: "linear-gradient(135deg, #0d3320 0%, #2d8a4e 100%)",
    what_you_will_learn: [
      "Apply machine learning models to crop yield prediction and weather analysis",
      "Build supply chain optimization tools using AI and historical datasets",
      "Analyze agricultural market pricing data to surface trends and opportunities",
      "Create AI-powered dashboards for farm management and resource planning",
      "Deploy practical agritech solutions ready for startups, NGOs, and food companies",
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
