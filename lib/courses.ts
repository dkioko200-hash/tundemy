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
  what_you_will_learn: string[];
}

export const courses: Course[] = [
  {
    slug: "ai-foundations",
    title: "AI Foundations",
    description:
      "Go from zero to AI-capable professional. Use AI for real work tasks better than someone with 3 years experience. Built for the Kenyan job market.",
    level: "Beginner",
    price_kes: 1500,
    lessons_count: 7,
    duration: "3 weeks",
    tag: "AI Professional",
    tag_color: "#2d8a4e",
    icon: "🚀",
    badge_label: "Start Here",
    badge_bg: "#0f1f3d",
    what_you_will_learn: [
      "Use AI for any professional task better than a 3-year experienced non-AI user",
      "Build reusable AI workflows that save 2 hours every working day",
      "Write research and analyse at professional standard using AI",
      "Understand exactly what AI can and cannot do",
      "Apply AI ethics in professional contexts",
      "Graduate to the Tundemy verified talent pool",
    ],
  },
  {
    slug: "prompt-engineering",
    title: "Prompt Engineering Mastery",
    description:
      "Master the skill that separates casual AI users from professionals. Build a complete prompt system that gets expert-level output every single time.",
    level: "Intermediate",
    price_kes: 2500,
    lessons_count: 12,
    duration: "4 weeks",
    tag: "AI Professional",
    tag_color: "#2d8a4e",
    icon: "🧠",
    badge_label: "Most Popular",
    badge_bg: "#0f1f3d",
    what_you_will_learn: [
      "Write prompts that produce professional output every time",
      "Diagnose and fix any failing prompt in under 60 seconds",
      "Use few-shot and chain-of-thought techniques",
      "Build a personal prompt library for your specific role",
      "Get hired specifically as a prompt engineer",
      "Produce expert-level AI output for any task",
    ],
  },
  {
    slug: "ai-data-analysis",
    title: "AI for Data and Decisions",
    description:
      "Turn raw data into business decisions using AI. Analyst-level insights from any dataset. No coding required. Built around real Kenyan business data.",
    level: "Intermediate",
    price_kes: 2800,
    lessons_count: 7,
    duration: "4 weeks",
    tag: "AI Professional",
    tag_color: "#2d8a4e",
    icon: "📊",
    what_you_will_learn: [
      "Analyse any dataset with AI assistance",
      "Build dashboards that answer business questions",
      "Present data insights to non-technical executives",
      "Work with real Kenyan business datasets",
      "Automate reporting workflows completely",
      "Get hired as a data analyst in any industry",
    ],
  },
  {
    slug: "whatsapp-ai-integration",
    title: "WhatsApp Business AI",
    description:
      "Build production-ready WhatsApp bots using Meta Cloud API and AI. The highest-demand technical skill in East African business right now.",
    level: "Advanced",
    price_kes: 3500,
    lessons_count: 8,
    duration: "4 weeks",
    tag: "AI Developer",
    tag_color: "#1a56db",
    icon: "💬",
    badge_label: "Kenya Track",
    badge_bg: "#0f1f3d",
    what_you_will_learn: [
      "Set up Meta Cloud API from scratch",
      "Build intelligent conversation flows",
      "Integrate AI responses into WhatsApp",
      "Automate customer service completely",
      "Handle payments through WhatsApp",
      "Deploy to production for real businesses",
    ],
  },
  {
    slug: "mpesa-daraja-api",
    title: "M-Pesa Daraja API",
    description:
      "Build fully functional payment systems using Safaricom Daraja API. The skill fintech companies across Africa are actively hiring for right now.",
    level: "Advanced",
    price_kes: 4500,
    lessons_count: 9,
    duration: "5 weeks",
    tag: "AI Developer",
    tag_color: "#1a56db",
    icon: "💳",
    badge_label: "Most In Demand",
    badge_bg: "#bb0000",
    what_you_will_learn: [
      "Set up Daraja sandbox and production credentials",
      "Build STK Push customer payment flows",
      "Handle C2B and B2C transactions",
      "Build secure webhook callbacks",
      "Handle reversals and reconciliation",
      "Deploy production payment systems",
    ],
  },
  {
    slug: "ai-agriculture",
    title: "AI for Agriculture and Agritech",
    description:
      "Apply AI to crop prediction market pricing supply chain and farmer advisory systems. Built specifically for East African agricultural context.",
    level: "Intermediate",
    price_kes: 3000,
    lessons_count: 6,
    duration: "3 weeks",
    tag: "African Business Tech",
    tag_color: "#7e3af2",
    icon: "🌱",
    badge_label: "High Demand",
    badge_bg: "#2d8a4e",
    banner_gradient: "linear-gradient(135deg, #0d3320 0%, #2d8a4e 100%)",
    what_you_will_learn: [
      "Build crop prediction and yield models",
      "Analyse Kenyan market pricing with AI",
      "Design farmer advisory systems for WhatsApp",
      "Optimise agricultural supply chains",
      "Work with real Kenyan agricultural data",
      "Get hired by agritech companies and NGOs",
    ],
  },
  {
    slug: "ai-evaluation-engineering",
    title: "AI Data and Evaluation Engineering",
    description:
      "Write training data evaluate AI systems and red-team models. The skill that Western AI companies pay $30-80 per hour for. Hireable remotely from Kenya.",
    level: "Intermediate",
    price_kes: 3500,
    lessons_count: 7,
    duration: "4 weeks",
    tag: "Global AI Talent",
    tag_color: "#e3a008",
    icon: "🎯",
    badge_label: "Western Hiring",
    badge_bg: "#0f1f3d",
    what_you_will_learn: [
      "Write high-quality AI training data at professional standard",
      "Build systematic AI evaluation frameworks",
      "Red-team AI systems to find failure modes",
      "Understand RLHF and preference data collection",
      "Build evaluation pipelines in Python",
      "Get hired remotely by Western AI companies",
    ],
  },
  {
    slug: "rag-ai-engineering",
    title: "RAG and AI Engineering",
    description:
      "Build retrieval-augmented generation systems from scratch. Deploy production AI applications on real datasets. The core technical skill for AI engineering roles globally.",
    level: "Advanced",
    price_kes: 4000,
    lessons_count: 7,
    duration: "5 weeks",
    tag: "Global AI Talent",
    tag_color: "#e3a008",
    icon: "⚙️",
    badge_label: "High Value",
    badge_bg: "#0f1f3d",
    what_you_will_learn: [
      "Build complete RAG pipelines from scratch",
      "Work with Pinecone Chroma and Supabase pgvector",
      "Deploy production AI applications live",
      "Evaluate and improve RAG system quality",
      "Build on African language datasets",
      "Get hired as an AI engineer at global rates",
    ],
  },
  {
    slug: "freelancing-with-ai",
    title: "Freelancing with AI Skills",
    description:
      "Turn your AI skills into consistent freelance income. Build a profile that wins international clients. Work from Kenya at global rates.",
    level: "Beginner",
    price_kes: 2000,
    lessons_count: 6,
    duration: "3 weeks",
    tag: "Income Track",
    tag_color: "#0f1f3d",
    icon: "💼",
    badge_label: "Income Fast Track",
    badge_bg: "#0f1f3d",
    what_you_will_learn: [
      "Build a freelance profile that gets hired",
      "Write proposals that win against global competition",
      "Price your AI skills at professional rates",
      "Find and close clients on Upwork and LinkedIn",
      "Deliver projects to professional standard",
      "Scale from side income to full-time freelance",
    ],
  },
  {
    slug: "selling-to-western-clients",
    title: "Selling AI to Western Clients",
    description:
      "Position yourself for Western AI budgets. Close international contracts from Kenya. Set up international payment infrastructure and build recurring dollar income.",
    level: "Intermediate",
    price_kes: 2500,
    lessons_count: 6,
    duration: "3 weeks",
    tag: "Income Track",
    tag_color: "#0f1f3d",
    icon: "🌍",
    badge_label: "Dollar Income",
    badge_bg: "#0f1f3d",
    what_you_will_learn: [
      "Position yourself for Western AI budgets",
      "Write proposals that close at international rates",
      "Handle contracts and international payments",
      "Build long-term Western client relationships",
      "Set up Wise and Payoneer from Kenya",
      "Scale to consistent dollar-denominated income",
    ],
  },
];

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}
