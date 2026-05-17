export type LessonType = "video" | "reading" | "quiz" | "sandbox" | "project" | "intro";

export interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
}

export interface TheoryQuizQuestion {
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface LessonTheory {
  concept: string;
  badExample: string;
  badBreakdown: { element: string; present: string; problem: string }[];
  badOutput: string;
  goodExample: string;
  goodBreakdown: { element: string; present: string; improvement: string }[];
  goodOutput: string;
  keyInsight: string;
  ruleToRemember: string;
  checkYourUnderstanding: TheoryQuizQuestion[];
}

export interface Lesson {
  lessonNumber: number;
  title: string;
  type: LessonType;
  hook: string;
  duration_mins: number;
  isAvailable: boolean;
  content: string;
  sandboxTask?: string;
  readingTopics?: string[];
  quizQuestions?: QuizQuestion[];
  theory?: LessonTheory;
  videoUrl?: string;
  introWhoFor?: string[];
  introOutcomes?: string[];
  introStructure?: { lessonsCount: number; hours: number; sandboxCount: number; finalProject: string };
  introFirstTask?: string;
}

export interface CourseContent {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price_kes: number;
  lessons_count: number;
  badge_name: string;
  what_you_will_learn: [string, string, string, string, string];
  lessons: Lesson[];
}

export const courseContent: CourseContent[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 1 — intro-to-ai
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "intro-to-ai",
    title: "Introduction to AI",
    tagline: "From Zero to Dangerous in 8 Lessons",
    description:
      "The fastest way to go from zero to productive with AI. Understand how AI works, which tools matter, and how to apply them to real business problems — no coding required.",
    level: "Beginner",
    price_kes: 1500,
    lessons_count: 8,
    badge_name: "AI Foundations",
    what_you_will_learn: [
      "Understand how AI tools actually work",
      "Identify AI opportunities in any business",
      "Build your first AI workflow",
      "Use ChatGPT, Claude, and Gemini professionally",
      "Design an AI adoption strategy for a business",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Course Introduction",
        type: "intro" as const,
        hook: "Welcome. Here is everything you need to know before your first lesson.",
        duration_mins: 5,
        isAvailable: true,
        videoUrl: "/videos/course1/C1_L0_Introduction.mp4",
        content: "This course exists because AI is changing every job in Kenya right now. The people who understand how to use it are already earning more, getting hired faster, and doing in hours what used to take days. No technical background required. No coding. No mathematics. Just willingness to learn the most powerful professional tools available today.",
        introWhoFor: [
          "A recent graduate who wants to stand out in a competitive job market",
          "A professional who hears about AI at work but does not know where to start",
          "A business owner who wants to understand what AI could do for their operations",
          "Anyone who wants to future-proof their career in the next 5 years",
        ],
        introOutcomes: [
          "Explain how AI works to any colleague or employer in plain language",
          "Use ChatGPT, Claude, and Gemini for real work tasks in half the time",
          "Identify AI opportunities in any business you work for",
          "Build a simple AI workflow for a real business problem",
          "Present a professional AI adoption strategy as your first portfolio piece",
        ],
        introStructure: {
          lessonsCount: 8,
          hours: 4,
          sandboxCount: 3,
          finalProject: "AI adoption roadmap for a fictional Nairobi business",
        },
        introFirstTask: "why do you want to learn AI?",
      },
      {
        lessonNumber: 1,
        title: "What AI Actually Is",
        type: "video",
        hook: "In 2024 a Kenyan marketing agency fired 3 content writers and replaced them with one person who knew how to use AI. That person was not a programmer.",
        duration_mins: 8,
        isAvailable: true,
        videoUrl: "/videos/course1/C1_L1_What_AI_Actually_Is.mp4",
        content: "What AI is, what it is not, and why the difference matters for your career.",
        theory: {
          concept: "Artificial intelligence is not robots, not magic, and not a replacement for human judgment. It is software that predicts the most statistically likely response to any input — trained on billions of examples of human text, images, and data.",
          badExample: "Tell me about marketing.",
          badBreakdown: [
            { element: "Role", present: "Not present", problem: "AI has no perspective or expertise to draw from" },
            { element: "Context", present: "Not present", problem: "What business? What problem? What industry?" },
            { element: "Task", present: "Too broad", problem: "Marketing is an entire field, not a task" },
            { element: "Constraints", present: "Not present", problem: "No scope, depth, or audience specified" },
            { element: "Format", present: "Not present", problem: "Essay? List? Definition? Unknown" },
          ],
          badOutput: "Marketing is the process of promoting products and services to potential customers through various channels including digital media, print, and in-person events...",
          goodExample: "I run a small restaurant in Westlands, Nairobi. I have KSh 5,000 to spend on marketing this week. Give me 3 specific ideas I can execute by Friday, each with an action, estimated cost, and expected result.",
          goodBreakdown: [
            { element: "Role", present: "Implied", improvement: "Context establishes who the AI is advising" },
            { element: "Context", present: "Rich", improvement: "Location, business type, specific problem, and budget all given" },
            { element: "Task", present: "Specific", improvement: "Exactly 3 ideas, weekday focus, clear goal" },
            { element: "Constraints", present: "Present", improvement: "Low-cost, KSh 5,000 budget limit" },
            { element: "Format", present: "Present", improvement: "Each idea needs action, cost, and timeline" },
          ],
          goodOutput: "Here are 3 targeted strategies for your Westlands restaurant this week: 1. WhatsApp Status Campaign (KSh 0) — Post a daily special with a photo at 11am and 5pm...",
          keyInsight: "AI is not a search engine. It is a thinking partner that produces output proportional to the quality of your input. Garbage in, garbage out — but also: clarity in, value out.",
          ruleToRemember: "AI tools are only as useful as the questions you ask them. Master the question and you master the tool.",
          checkYourUnderstanding: [
            {
              question: "What are ChatGPT, Claude, and Gemini classified as?",
              options: ["Search engines", "Databases", "Large Language Models", "Expert systems"],
              correctAnswer: 2,
              explanation: "ChatGPT, Claude, and Gemini are Large Language Models — AI systems trained on vast amounts of text to understand and generate human language.",
            },
            {
              question: "What does an AI language model actually do when it responds to you?",
              options: ["Searches the internet for answers", "Predicts the most statistically likely next word based on training data", "Connects to expert databases", "Reasons logically like a human"],
              correctAnswer: 1,
              explanation: "Language models predict the most statistically likely response based on patterns learned during training — they do not search or reason the way humans do.",
            },
            {
              question: "Why does a vague prompt produce a poor AI response?",
              options: ["The AI model is malfunctioning", "Vague inputs give the model no constraints so it defaults to the most generic possible response", "AI cannot understand informal language", "The AI needs more computing power for complex questions"],
              correctAnswer: 1,
              explanation: "With no constraints, role, or context, the AI produces the statistically average response — which is generic and rarely useful.",
            },
          ],
        },
        quizQuestions: [
          { question: "A friend says AI will replace all workers. Based on this lesson, what is the most accurate response?", options: ["True — AI can do everything humans can", "False — AI replaces tasks not people, and those who use AI well gain an advantage", "True — but only for low-skill jobs", "False — AI is too unreliable to use professionally"], correctAnswer: 1 },
          { question: "What is the PRIMARY difference between a good and bad AI prompt?", options: ["Length — longer prompts always work better", "Specificity — clear context, task, constraints and format produce better output", "Politeness — saying please improves results", "Speed — typing faster gives better responses"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 2,
        title: "How AI Actually Thinks",
        type: "reading",
        hook: "AI gave a lawyer fake court cases. The lawyer submitted them. He was nearly disbarred. Here is exactly why that happened and how to make sure it never happens to you.",
        duration_mins: 6,
        videoUrl: "/videos/course1/C1_L2_How_AI_Actually_Thinks.mp4",
        isAvailable: true,
        content: "Tokens, probability, and why AI confidently makes things up — and what to do about it.",
        readingTopics: [
          "What a token is and why it matters",
          "How AI generates text one prediction at a time",
          "What hallucination is and why it happens",
          "The verification habit every professional AI user needs",
          "When to trust AI output and when to check it",
        ],
        theory: {
          concept: "Every word you read from an AI was predicted one token at a time. A token is roughly one word or word fragment. The model looks at everything written so far and asks: what is the most likely next token? It repeats this millions of times per response. It has no memory, no internet access during generation, and no ability to detect its own errors.",
          badExample: "What cases support my argument that a landlord must provide written notice before eviction in Kenya?",
          badBreakdown: [
            { element: "Role", present: "Not present", problem: "No legal jurisdiction or expertise level specified" },
            { element: "Verification instruction", present: "Not present", problem: "User assumes AI output is factually reliable" },
            { element: "Source requirement", present: "Not present", problem: "AI will generate plausible-sounding case names that may not exist" },
            { element: "Format", present: "Not present", problem: "No instruction to flag uncertainty" },
          ],
          badOutput: "Several cases support this position including Mwangi v. Kariuki [2019] eKLR and Omondi v. City Properties Ltd [2021] where the court held that...",
          goodExample: "I need to understand the general legal principle around landlord notice requirements before eviction in Kenya. Do not cite specific cases — I will verify those independently. Explain the principle only, and flag anything you are uncertain about.",
          goodBreakdown: [
            { element: "Scope", present: "Limited to principles", improvement: "Removes the invitation to fabricate specific citations" },
            { element: "Verification", present: "Explicit", improvement: "User commits to independent verification of specifics" },
            { element: "Uncertainty flag", present: "Requested", improvement: "AI is instructed to signal when it is less confident" },
            { element: "Task", present: "Clear", improvement: "Principle only — not case law" },
          ],
          goodOutput: "In Kenya, landlord-tenant relationships are primarily governed by the Rent Restriction Act and the Landlord and Tenant (Shops, Hotels and Catering Establishments) Act. The general principle is that landlords must provide reasonable notice before eviction, though the specific notice period depends on the tenancy type. I'd recommend verifying the exact statutory requirements with the Kenya Law website (kenyalaw.org) as these provisions can be amended.",
          keyInsight: "AI hallucination is not a bug — it is a feature working as designed. The model is optimised to produce fluent, plausible text, not verified facts. Your job is to use AI for structure, drafting, and ideas — and verify anything that will be relied upon.",
          ruleToRemember: "Never publish AI-generated facts, statistics, case citations, or names without independent verification. AI drafts; you verify.",
          checkYourUnderstanding: [
            {
              question: "What is an AI hallucination?",
              options: ["When AI refuses to answer a question", "When AI generates confident, fluent text that is factually incorrect", "When AI produces an error message", "When AI gives different answers to the same question"],
              correctAnswer: 1,
              explanation: "Hallucination is when AI produces text that sounds correct and authoritative but is factually wrong — caused by the model optimising for plausibility rather than truth.",
            },
            {
              question: "Why does AI produce hallucinations even when given a clear question?",
              options: ["The model has a poor internet connection", "The model predicts likely text rather than retrieving verified facts", "The user did not phrase the question correctly", "The model needs more training data"],
              correctAnswer: 1,
              explanation: "AI generates the most statistically likely next token — it does not retrieve facts from a database. When it lacks reliable training data on a topic, it generates plausible-sounding but potentially false content.",
            },
            {
              question: "What is the safest way to use AI for legal, medical, or financial information?",
              options: ["Trust AI completely — it is trained on expert content", "Use AI for principles and structure, then verify specific facts independently", "Never use AI for professional topics", "Ask the same question three times and take the most common answer"],
              correctAnswer: 1,
              explanation: "AI is reliable for explaining concepts and producing structure. Specific citations, statistics, and facts must always be verified against authoritative sources.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is a token in the context of AI language models?", options: ["A security password", "Roughly a word or word fragment that the model processes one at a time", "A unit of payment for AI usage", "A bookmark in the AI conversation"], correctAnswer: 1 },
          { question: "What should you ALWAYS do before using AI-generated facts in a professional document?", options: ["Ask AI to confirm the facts are correct", "Run the document through a spell checker", "Verify the facts independently from authoritative sources", "Ask a colleague to read it"], correctAnswer: 2 },
        ],
      },
      {
        lessonNumber: 3,
        title: "Your First AI Workflow",
        type: "sandbox",
        hook: "The people who get the most out of AI are not the ones with the best prompts. They are the ones with the best systems.",
        duration_mins: 10,
        videoUrl: "/videos/course1/C1_L3_Your_First_AI_Workflow.mp4",
        isAvailable: true,
        content: "Build your first repeatable AI workflow using the three-part structure used by professional AI practitioners.",
        sandboxTask: "You are the owner of a small business in Nairobi. Build a complete AI workflow for one of these tasks: (1) Responding to customer complaints on WhatsApp, (2) Writing weekly social media posts, (3) Summarising supplier quotes for a decision. Choose one task, define your system context, user input template, and output format. Then test it with a real example.",
        quizQuestions: [
          { question: "What are the three components of a professional AI workflow?", options: ["Prompt, response, edit", "System context, user input, output format", "Question, answer, summary", "Draft, review, publish"], correctAnswer: 1 },
          { question: "Why is a reusable workflow more valuable than a one-off prompt?", options: ["It uses less AI credits", "It produces consistent results across different inputs without redesigning from scratch", "It is easier to type", "It works on all AI models simultaneously"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 4,
        title: "AI for Communication",
        type: "video",
        hook: "A Nairobi sales manager started using AI for email. She cut her writing time by 70% and her reply rate doubled. Same person, same relationships — different tool.",
        duration_mins: 8,
        isAvailable: true,
        videoUrl: "/videos/course1/C1_L4_AI_for_Communication.mp4",
        content: "How to use AI to write emails, prepare for meetings, and repurpose content — without losing your voice.",
        theory: {
          concept: "AI does not replace your communication judgment — it eliminates the friction between your thinking and the finished document. You provide the structure, audience, purpose, and key points. AI produces the draft. You review, refine, and send. The output reflects your judgment at a fraction of the time cost.",
          badExample: "Write me a professional email.",
          badBreakdown: [
            { element: "Recipient", present: "Not present", problem: "AI does not know who you are writing to" },
            { element: "Purpose", present: "Not present", problem: "No goal — what should this email achieve?" },
            { element: "Tone", present: "Only implied", problem: "Professional covers a very wide range" },
            { element: "Required action", present: "Not present", problem: "What should the recipient do?" },
            { element: "Context", present: "Not present", problem: "No relationship, history, or relevant background" },
          ],
          badOutput: "Dear Sir/Madam, I hope this email finds you well. I am writing to bring to your attention a matter of some importance...",
          goodExample: "Write an email to a supplier named James Mwangi at Safara Logistics. We agreed on a delivery date of 15 January but the goods have not arrived. I need an update and a new confirmed date. Tone: firm but professional — we want to keep the relationship. End with a clear deadline for his response of 48 hours.",
          goodBreakdown: [
            { element: "Recipient", present: "Named and contextualised", improvement: "AI can calibrate the relationship register" },
            { element: "Purpose", present: "Clear", improvement: "Update request with specific missing information" },
            { element: "Tone", present: "Specific", improvement: "Firm but relationship-preserving — not aggressive" },
            { element: "Required action", present: "Explicit", improvement: "New confirmed date plus 48-hour response deadline" },
            { element: "Context", present: "Rich", improvement: "Original agreement date given for reference" },
          ],
          goodOutput: "Dear James, I hope you are well. I am following up on our delivery scheduled for 15 January, which we have not yet received. Could you please provide an update on the current status and confirm a new delivery date at your earliest convenience? To keep our planning on track, I would appreciate a response within 48 hours. Thank you for your attention to this — I look forward to continuing our partnership. Best regards,",
          keyInsight: "The professional model: you own the thinking, AI owns the typing. Every minute you spend specifying context saves five minutes of editing a generic draft.",
          ruleToRemember: "Always review AI-drafted communications before sending. AI cannot verify facts, relationships, or organisational context that you hold.",
          checkYourUnderstanding: [
            {
              question: "What four inputs make an email drafting prompt most effective?",
              options: ["Word count, font, language, and deadline", "Purpose, recipient context, required action, and tone", "Subject line, greeting, body, and sign-off", "AI model, examples, temperature, and length"],
              correctAnswer: 1,
              explanation: "Purpose, recipient context, required action, and tone are the four inputs that consistently produce usable email drafts.",
            },
            {
              question: "What is content repurposing in an AI communication workflow?",
              options: ["Translating content into Swahili", "Transforming one source document into multiple formats for different audiences", "Reusing old emails with updated dates", "Copying competitor content"],
              correctAnswer: 1,
              explanation: "Content repurposing uses AI to produce multiple formats from one source — a report becomes a WhatsApp summary, an email update, and a full document.",
            },
            {
              question: "After AI drafts a client email, what must you do before sending?",
              options: ["Nothing — AI output is ready to send", "Review for accuracy, tone, and context only you can verify", "Run it through a second AI tool", "Add more formal language"],
              correctAnswer: 1,
              explanation: "You must review AI drafts before sending. AI cannot verify your specific facts, relationship history, or organisational context.",
            },
          ],
        },
        quizQuestions: [
          { question: "A colleague complains that AI emails sound generic. What is the most likely cause?", options: ["The AI model is low quality", "The prompt lacks recipient context, relationship detail, and specific tone instructions", "AI cannot write good emails", "The colleague needs a premium subscription"], correctAnswer: 1 },
          { question: "What is the fastest way to produce a WhatsApp message, email, and formal report from the same information?", options: ["Write each manually", "Write the longest version first then shorten it twice", "Use AI content repurposing — one source, three format instructions in one prompt", "Hire a communications assistant"], correctAnswer: 2 },
        ],
      },
      {
        lessonNumber: 5,
        title: "Research and Analysis with AI",
        type: "reading",
        hook: "A financial analyst at a Nairobi bank used to spend 3 hours preparing a competitor briefing. With AI she now does it in 25 minutes — and the briefings are better.",
        duration_mins: 7,
        videoUrl: "/videos/course1/C1_L5_Research_and_Analysis_with_AI.mp4",
        isAvailable: true,
        content: "How to use AI to read, summarise, compare, and extract insight from documents — faster and more systematically than any manual process.",
        readingTopics: [
          "The four AI research patterns that save the most time",
          "How to write a structured document summary prompt",
          "Comparative analysis across multiple documents",
          "Question answering from source material",
          "The two verification rules you cannot skip",
        ],
        theory: {
          concept: "AI compresses research and analysis work by 60-80% when used correctly. Vague analytical prompts produce generic summaries. Structured analytical prompts produce targeted, actionable outputs.",
          badExample: "Summarise this report for me.",
          badBreakdown: [
            { element: "Structure", present: "Not specified", problem: "AI will choose its own summary structure" },
            { element: "Audience", present: "Not specified", problem: "Executive summary vs technical summary are completely different" },
            { element: "Focus", present: "Not specified", problem: "AI surfaces what it calculates as significant, not what matters to you" },
            { element: "Length", present: "Not specified", problem: "Could be 2 sentences or 2 pages" },
            { element: "Format", present: "Not specified", problem: "Paragraph? Bullets? Table?" },
          ],
          badOutput: "This report discusses the performance of the organisation over the past year. Key themes include revenue growth, operational challenges, and strategic initiatives...",
          goodExample: "Summarise the following report for a CFO who has 2 minutes to read. Use this exact structure: (1) One sentence bottom line, (2) Three key financial findings with specific figures, (3) Two risks flagged, (4) One recommended action. Maximum 200 words.",
          goodBreakdown: [
            { element: "Audience", present: "CFO with 2 minutes", improvement: "Calibrates register and what to prioritise" },
            { element: "Structure", present: "Explicit 4-part format", improvement: "AI follows your structure not its own" },
            { element: "Data requirement", present: "Specific figures required", improvement: "Forces AI to include actual numbers" },
            { element: "Length", present: "200 words maximum", improvement: "Hard constraint prevents padding" },
            { element: "Action orientation", present: "One recommended action", improvement: "Forces a conclusion not just a summary" },
          ],
          goodOutput: "Bottom line: Revenue grew 18% but operating costs rose faster, compressing margins by 4 points. Key findings: (1) Revenue KSh 2.3B up from KSh 1.95B; (2) Staff costs +31% driven by headcount expansion; (3) Digital channel now 44% of revenue. Risks: Supply chain disruption flagged for Q3; compliance gap in northern region. Recommended action: Commission operating cost review before Q2 board meeting.",
          keyInsight: "The quality of analytical output from AI is determined almost entirely by the quality of the analytical question. A good analyst asks better questions — AI just answers faster.",
          ruleToRemember: "Always verify key figures, dates, and names against the original source. AI can misread numbers even when given the source material.",
          checkYourUnderstanding: [
            {
              question: "What is source-grounded analysis?",
              options: ["Analysis citing academic journals", "Instructing AI to base its analysis only on documents you provide", "Analysis by a qualified human researcher", "Using AI to search the internet for sources"],
              correctAnswer: 1,
              explanation: "Source-grounded analysis constrains AI to your provided documents, reducing hallucination risk. Verify key figures regardless.",
            },
            {
              question: "What produces the biggest improvement in AI analytical output quality?",
              options: ["Using a more expensive AI model", "Asking the same question multiple times", "Specifying analytical structure, audience, and output format explicitly", "Making the prompt shorter"],
              correctAnswer: 2,
              explanation: "Specifying structure, audience, and format explicitly is the single highest-leverage change for analytical prompts.",
            },
            {
              question: "You paste a financial report into AI and ask for revenue growth. AI says 23%. The actual figure is 2.3%. What happened?",
              options: ["The AI model has a mathematical error", "AI misread the figure — hallucination within source material", "The report was formatted incorrectly", "You asked the wrong question"],
              correctAnswer: 1,
              explanation: "AI can misread figures in source documents. Always verify key numbers against the original.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is most important to specify in a document summarisation prompt?", options: ["The author of the document", "The structure, audience, and required length", "The date the document was written", "The file format"], correctAnswer: 1 },
          { question: "Why verify AI-extracted figures even when you gave AI the source document?", options: ["AI ignores source documents", "AI can misread numbers — hallucination can occur even with source material", "The figures are always outdated", "AI rounds all numbers"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 6,
        title: "AI Ethics and Professional Responsibility",
        type: "quiz",
        hook: "An AI hiring tool in the US rejected 76% of qualified female candidates for a technical role. The company did not programme discrimination. The training data did.",
        duration_mins: 6,
        videoUrl: "/videos/course1/C1_L6_AI_Ethics_and_Professional_Responsibility.mp4",
        isAvailable: true,
        content: "Bias, accountability, privacy, and the professional standards every AI practitioner must understand.",
        quizQuestions: [
          { question: "Where does AI bias most commonly originate?", options: ["Deliberate programming by developers", "Historical training data that reflects real-world inequalities", "Random mathematical errors in the model", "Interference from internet noise"], correctAnswer: 1 },
          { question: "An AI tool systematically ranks candidates from a specific region lower despite equal qualifications. This is:", options: ["A technical malfunction", "AI bias — a systematic discriminatory pattern from biased training data", "Correct behaviour", "User error"], correctAnswer: 1 },
          { question: "A lawyer uses AI to draft a contract clause containing a legal error that harms the client. Who bears professional responsibility?", options: ["The AI model provider", "The lawyer — they published and are responsible for the output", "The client for not reviewing independently", "Shared equally"], correctAnswer: 1 },
          { question: "What is the data privacy risk of pasting client information into a commercial AI tool?", options: ["Data may be encrypted incorrectly", "Client will be notified automatically", "Data leaves your organisation and is processed by a third party", "AI will refuse to process personal information"], correctAnswer: 2 },
          { question: "Why does AI increase the importance of professional discipline rather than reducing it?", options: ["AI tools are expensive so errors cost more", "AI scales output — a flawed workflow deployed at scale creates systemic harm much faster than individual error", "AI requires more technical expertise", "Professional bodies require AI certification"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 7,
        title: "Your AI Toolkit and Next Steps",
        type: "project",
        hook: "You now know more about using AI professionally than 90% of the workforce in Kenya. The question is what you do with it in the next 7 days.",
        duration_mins: 10,
        videoUrl: "/videos/course1/C1_L7_Your_AI_Toolkit_and_Next_Steps.mp4",
        isAvailable: true,
        content: "The complete AI tools landscape, how to choose the right tool for each task, and your personal action plan.",
        sandboxTask: "Build your personal AI adoption plan. Answer these four questions: (1) Which ONE task in your current role will you automate or accelerate with AI this week? (2) Which AI tool will you use and why? (3) How will you measure whether it is working? (4) What is the first thing you will do in the next 24 hours after finishing this course?",
        quizQuestions: [
          { question: "Which AI tool is best known for strong analytical reasoning and careful instruction-following?", options: ["Midjourney", "Claude by Anthropic", "Stable Diffusion", "Zapier"], correctAnswer: 1 },
          { question: "What is the primary purpose of automation platforms like Zapier and Make?", options: ["To train custom AI models", "To connect AI outputs to business tools so workflows run without manual input", "To store AI-generated content", "To improve AI model accuracy"], correctAnswer: 1 },
          { question: "What are the three recommended actions after completing this course?", options: ["Post on LinkedIn, join a community, read a book", "Complete the proof-of-skill assessment, build one daily workflow, and start the next course", "Download three AI tools and test them", "Apply for a job immediately"], correctAnswer: 1 },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 2 — prompt-engineering
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "prompt-engineering",
    title: "Prompt Engineering Mastery",
    tagline: "The Skill That Makes Every Other AI Skill Better",
    description:
      "The most in-demand AI skill right now. Learn to write prompts that get professional results from any AI tool — for marketing, operations, customer service, coding, and more.",
    level: "Intermediate",
    price_kes: 2500,
    lessons_count: 12,
    badge_name: "Certified Prompt Engineer",
    what_you_will_learn: [
      "Write prompts that produce professional results first time",
      "Master role, context, and constraint techniques",
      "Build reusable prompt libraries for your team",
      "Chain prompts for complex multi-step tasks",
      "Debug and fix underperforming prompts systematically",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Course Introduction",
        type: "intro" as const,
        hook: "Welcome. Here is everything you need to know before your first lesson.",
        duration_mins: 5,
        isAvailable: true,
        content: "Prompt engineering is the skill of communicating with AI effectively. Every AI tool produces results that are only as good as the instructions you give it. This course teaches you to give better instructions than 95% of people using these tools today. That gap in prompt quality is the gap in professional output — and increasingly the gap in salary.",
        introWhoFor: [
          "A professional who uses AI daily but gets inconsistent results",
          "A marketer or writer who wants AI output without losing quality",
          "A manager who wants to build AI workflows for their team",
          "A developer integrating AI into products who needs reliable outputs",
        ],
        introOutcomes: [
          "Write a prompt that produces professional output on the first try",
          "Build reusable prompt templates for any business function",
          "Chain prompts together for complex multi-step tasks",
          "Debug a failing prompt and fix it in under 5 minutes",
          "Deliver a complete prompt training guide as your portfolio project",
        ],
        introStructure: {
          lessonsCount: 12,
          hours: 6,
          sandboxCount: 5,
          finalProject: "Prompt engineering training guide for a Kenyan bank",
        },
        introFirstTask: "why do you want to master prompt engineering?",
      },
      {
        lessonNumber: 1,
        title: "What Makes a Prompt Good or Bad",
        type: "video",
        hook: "The same AI tool gives a consultant professional results and gives their colleague garbage. The only difference is the prompt.",
        duration_mins: 8,
        isAvailable: true,
        content:
          "Anatomy of a prompt: role, context, task, constraints, and format. We dissect good and bad prompts side by side so the difference is immediately obvious.",
        theory: {
          concept: `A prompt is every piece of text you send to an AI. Every single word. The AI has nothing else to work with — it cannot read your mind and cannot ask follow-up questions unless you tell it to. Everything it needs to produce a great result must be in your prompt.\n\nThe best prompts have five parts: ROLE — Who should the AI be? CONTEXT — What is the situation? TASK — What exactly do you want? CONSTRAINTS — How should it be done? FORMAT — What should the output look like?\n\nMost people only include the task. That is like hiring a new employee, showing them to a desk, and saying "do the thing" with no other information. The result is exactly what you would expect.`,
          badExample: `write something about our product for social media`,
          badBreakdown: [
            { element: "Role", present: "Not present", problem: "AI does not know who it is" },
            { element: "Context", present: "Not present", problem: "What product? What brand?" },
            { element: "Task", present: "Vague", problem: "Social media means nothing specific" },
            { element: "Constraints", present: "Not present", problem: "No platform, length, or tone" },
            { element: "Format", present: "Not present", problem: "Post? Thread? Caption?" },
          ],
          badOutput: `"Introducing our amazing product! It is designed to make your life easier and better. Check it out today and see the difference! #product #amazing #mustbuy"`,
          goodExample: `You are a social media manager for a Nairobi-based organic skincare brand called Asili Beauty. Our target customer is a professional Kenyan woman aged 25-40 who cares about natural ingredients and supporting local businesses.\n\nWrite a LinkedIn post announcing our new Shea Butter Face Cream. The post should:\n- Be 150-200 words\n- Lead with a relatable problem (dry skin in Nairobi weather)\n- Highlight 2 key ingredients: shea butter and baobab oil\n- End with a soft call to action\n- Use a warm, confident, professional tone\n- Include 3 relevant hashtags at the end`,
          goodBreakdown: [
            { element: "Role", present: "Present", improvement: "Social media manager with full brand context" },
            { element: "Context", present: "Present", improvement: "Brand, audience, and location all clear" },
            { element: "Task", present: "Specific", improvement: "Platform, product, and format all defined" },
            { element: "Constraints", present: "Present", improvement: "Word count, tone, and structure all set" },
            { element: "Format", present: "Present", improvement: "LinkedIn post with hashtags" },
          ],
          goodOutput: `"Living in Nairobi means battling dust, humidity changes, and air conditioning — and your skin feels every bit of it. That is why we created Asili Beauty's new Shea Butter Face Cream, crafted right here in Kenya with pure shea butter for deep hydration and baobab oil to lock in moisture for up to 12 hours.\n\nNo parabens. No artificial fragrances. Just what your skin actually needs.\n\nTap the link in our bio to try it.\n\n#AsiliBeauty #MadeInKenya #NaturalSkincare"`,
          keyInsight: `The difference between these two prompts is not intelligence — it is information. The AI is equally capable in both cases. What changed is how much you told it. Every piece of relevant information you add directly improves the output.`,
          ruleToRemember: `If you would not give these instructions to a new employee on their first day and expect a great result — do not give them to an AI.`,
          checkYourUnderstanding: [
            {
              question: "Which element is most commonly missing from bad prompts?",
              options: ["Role", "Task", "Constraints", "Format"],
              correctAnswer: 2,
              explanation: "Most people include a task but forget to tell the AI how to do it. Constraints are what separate generic output from professional output.",
            },
            {
              question: "The bad prompt example failed mainly because:",
              options: [
                "It was too short",
                "It gave the AI no context, constraints, or format",
                "It used informal language",
                "It mentioned social media",
              ],
              correctAnswer: 1,
              explanation: "Length alone does not make a prompt good. The bad prompt failed because it gave the AI nothing to work with except a vague topic.",
            },
            {
              question: "Adding more words always makes a prompt better — true or false?",
              options: [
                "True — longer prompts always produce better output",
                "False — more relevant information helps, but irrelevant words confuse",
                "True — AI needs as much text as possible to work well",
                "False — shorter prompts always outperform longer ones",
              ],
              correctAnswer: 1,
              explanation: "More relevant information helps. More irrelevant words confuse. A prompt should be complete, not just long.",
            },
          ],
        },
      },
      {
        lessonNumber: 2,
        title: "Role Prompting",
        type: "sandbox",
        hook: "You would not ask a receptionist to perform brain surgery. Stop asking a general-purpose AI to act like a specialist when you have not told it to.",
        duration_mins: 15,
        isAvailable: true,
        content:
          "How role prompting transforms output quality. Assigning a specific expert persona changes vocabulary, depth, structure, and assumptions — dramatically improving relevance.",
        sandboxTask:
          "Write 3 role prompts for a customer service scenario at a Nairobi telecom company. Each prompt should assign a different persona (customer service agent, escalation manager, technical support specialist) and handle the same difficult customer complaint. Compare outputs and note the differences.",
        theory: {
          concept: `Role prompting is telling the AI who to be before you tell it what to do. When you define a role you are giving the AI an expertise framework — a set of knowledge, attitudes, and communication styles to draw from.\n\nWithout a role the AI responds as a general assistant trying to please everyone. With a strong role it responds as a specific expert optimized for your exact situation. The difference in output quality is significant.\n\nA generic AI writes generic content. An AI playing the role of a senior Kenyan lawyer writes legal content that sounds like it came from a senior Kenyan lawyer. The role does not just change tone — it changes the knowledge base the AI draws from.`,
          badExample: `Help me write a contract for a freelance developer.`,
          badBreakdown: [
            { element: "Role", present: "Not present", problem: "AI has no expertise context" },
            { element: "Context", present: "Not present", problem: "What kind of contract? Which jurisdiction?" },
            { element: "Task", present: "Vague", problem: "What sections should the contract cover?" },
            { element: "Constraints", present: "Not present", problem: "Kenyan law? What currency?" },
            { element: "Format", present: "Not present", problem: "What sections are needed?" },
          ],
          badOutput: `"Freelance Developer Agreement\n\nThis agreement is between Client and Developer.\nDeveloper will complete the project as discussed.\nPayment will be made upon completion.\nBoth parties agree to these terms."`,
          goodExample: `You are a senior commercial lawyer with 15 years of experience drafting technology contracts in Kenya. You are familiar with Kenya's ICT Act and standard software development agreements used by Nairobi tech companies.\n\nDraft a freelance developer contract for a 3-month mobile app development project. The contract should cover: scope of work, payment schedule in KSh, intellectual property ownership, confidentiality, termination clauses, and dispute resolution under Kenyan law. Use professional legal language but make it readable for a non-lawyer business owner.`,
          goodBreakdown: [
            { element: "Role", present: "Present", improvement: "Senior Kenyan commercial lawyer with 15 years' experience" },
            { element: "Context", present: "Present", improvement: "Kenya ICT Act, Nairobi tech context established" },
            { element: "Task", present: "Specific", improvement: "All 6 contract sections clearly listed" },
            { element: "Constraints", present: "Present", improvement: "KSh, professional but readable language" },
            { element: "Format", present: "Present", improvement: "Contract document structure implied" },
          ],
          goodOutput: `"FREELANCE SOFTWARE DEVELOPMENT AGREEMENT\n\nThis Agreement is entered into as of [Date] between [Client Name] (the Client) and [Developer Name] (the Developer) for the development of a mobile application as described herein.\n\n1. SCOPE OF WORK\nThe Developer agrees to design, develop, and deliver [specific app description] in accordance with the specifications attached as Schedule A...\n\n[Full professional contract with all 6 sections follows]"`,
          keyInsight: `The role you assign does not just change the tone of the response — it changes the knowledge base the AI draws from. A lawyer role activates legal knowledge. A Kenyan context activates local market knowledge. Both together produce output that could not come from a generic prompt.`,
          ruleToRemember: `Always define who the AI is before you define what you want it to do.`,
          checkYourUnderstanding: [
            {
              question: "What does defining a role do to an AI response?",
              options: [
                "Makes it shorter",
                "Changes the expertise framework the AI draws from",
                "Makes it more formal regardless of context",
                "Reduces hallucinations completely",
              ],
              correctAnswer: 1,
              explanation: "A role activates specific knowledge patterns, making the AI respond as a genuine expert rather than a generic assistant.",
            },
            {
              question: "Which role prompt would produce the best legal content for a Kenyan tech contract?",
              options: [
                "\"You are a helpful assistant\"",
                "\"You are a lawyer\"",
                "\"You are a senior commercial lawyer with 15 years of experience in Kenyan technology contracts\"",
                "\"You are very smart and know the law\"",
              ],
              correctAnswer: 2,
              explanation: "Specificity in the role directly improves output quality. The more specific the expertise, the more expert the response.",
            },
            {
              question: "Role prompting is most useful when:",
              options: [
                "You need a short, casual answer",
                "You need specialist knowledge or a specific professional perspective",
                "You want the AI to be more friendly",
                "You are asking about general topics with no domain expertise required",
              ],
              correctAnswer: 1,
              explanation: "Role prompting shines when you need the AI to think like a specific type of expert rather than a general assistant.",
            },
          ],
        },
      },
      {
        lessonNumber: 3,
        title: "Context and Background",
        type: "sandbox",
        hook: "AI has no memory. Every prompt is a conversation with someone who knows nothing about you, your company, or your situation. Give context or get generic.",
        duration_mins: 15,
        isAvailable: true,
        content:
          "How context changes everything: company background, audience, prior decisions, constraints, and goals. The more relevant context you add, the more tailored and useful the output.",
        sandboxTask:
          "Take 3 weak, context-free prompts and rewrite each one with full context (company, audience, goal, constraints). Compare the before and after outputs. Document which context elements made the biggest difference.",
        theory: {
          concept: `Every time you send a prompt to an AI it starts from zero. It has no idea who you are, what your business does, what you have talked about before, or what success looks like for you. Context is the background information that transforms a generic prompt into a personalized one.\n\nWithout context the AI makes assumptions. Those assumptions are almost never right for your specific situation. Think of context as the briefing you give a consultant on their first day — the better the briefing, the better the work.\n\nContext includes: who you are, what your company does, who your audience is, what happened before this conversation, what constraints you are working within, and what a great result looks like. You do not need all of these every time — but you need the ones that are relevant.`,
          badExample: `Write an email to follow up on our meeting.`,
          badBreakdown: [
            { element: "Role", present: "Not present", problem: "AI does not know who is sending this" },
            { element: "Context", present: "Not present", problem: "What meeting? With whom? About what?" },
            { element: "Task", present: "Present but vague", problem: "Follow up how? Asking for what?" },
            { element: "Constraints", present: "Not present", problem: "Tone, length, and goal all missing" },
            { element: "Format", present: "Not present", problem: "No structure or length specified" },
          ],
          badOutput: `"Dear [Name],\n\nThank you for meeting with me. It was great to connect. I look forward to working together.\n\nBest regards"`,
          goodExample: `You are a business development manager at a Nairobi fintech startup called PaySmart.\n\nYesterday you had a 45-minute meeting with Sarah Kimani, the Head of Partnerships at Equity Bank. You discussed integrating PaySmart's payment API into Equity Bank's mobile banking app. Sarah showed strong interest but said she needed to present it to her technical team first. She mentioned budget approval happens in Q4.\n\nWrite a professional follow-up email that:\n- Thanks her specifically for her time and insights\n- Recaps the 2 key benefits you discussed\n- Offers to provide technical documentation for her team\n- Suggests a follow-up call in 2 weeks\n- Keeps it under 200 words`,
          goodBreakdown: [
            { element: "Role", present: "Present", improvement: "Business development manager with company context" },
            { element: "Context", present: "Rich", improvement: "Company, meeting attendee, topic, and outcome all clear" },
            { element: "Task", present: "Specific", improvement: "All 4 email requirements listed explicitly" },
            { element: "Constraints", present: "Present", improvement: "Under 200 words, professional tone" },
            { element: "Format", present: "Present", improvement: "Email structure with subject line implied" },
          ],
          goodOutput: `"Subject: Follow-up: PaySmart × Equity Bank Integration\n\nDear Sarah,\n\nThank you for the time yesterday — your insights on Equity Bank's mobile strategy were genuinely valuable.\n\nTo recap our discussion: PaySmart's API reduces payment processing time by 60% and requires zero changes to your existing core banking infrastructure — two factors I believe will resonate with your technical team.\n\nI would be happy to prepare a full technical brief and API documentation tailored to Equity Bank's stack. Would a call in two weeks work to walk through any questions they have?\n\nLooking forward to the next step.\n\nBest regards\n[Name]\nBusiness Development | PaySmart"`,
          keyInsight: `The AI did not invent the details about 60% processing time or the Equity Bank infrastructure constraint — those came from the context you provided. The richer your context, the more accurate and specific the output. Garbage in, garbage out applies to prompts just as much as data.`,
          ruleToRemember: `Context is not optional. It is the difference between output you can use immediately and output you have to rewrite from scratch.`,
          checkYourUnderstanding: [
            {
              question: "Why does every AI prompt effectively start from zero?",
              options: [
                "AI is not intelligent enough to remember things",
                "AI has no memory between conversations",
                "Context makes prompts too long to be useful",
                "AI prefers simple questions without background",
              ],
              correctAnswer: 1,
              explanation: "Unlike a human colleague who remembers previous conversations, the AI has no memory between sessions. Every prompt must be self-contained.",
            },
            {
              question: "What is the main purpose of adding context to a prompt?",
              options: [
                "To make prompts appear more professional",
                "To replace the task instruction entirely",
                "To give the AI the background it needs to produce accurate, specific output",
                "To make the AI more creative and unpredictable",
              ],
              correctAnswer: 2,
              explanation: "Context transforms a generic response into one that is specifically tailored to your exact situation, business, and goals.",
            },
            {
              question: "Which is better context for a follow-up email prompt?",
              options: [
                "\"I had a meeting yesterday\"",
                "\"I met with Sarah Kimani at Equity Bank about integrating our payment API into their mobile app\"",
                "\"Please write a professional follow-up email\"",
                "\"The meeting went really well\"",
              ],
              correctAnswer: 1,
              explanation: "Specific names, companies, topics, and outcomes give the AI exactly what it needs to produce a relevant and accurate response.",
            },
          ],
        },
      },
      {
        lessonNumber: 4,
        title: "Constraints and Format Control",
        type: "sandbox",
        hook: "A prompt without constraints is like a job description with no requirements — you get whatever the AI feels like giving you.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Controlling output: length, tone, format, reading level, and audience. How to get bullet points vs. paragraphs, formal vs. casual, 100 words vs. 1000 words — every time.",
        sandboxTask:
          "Write 4 versions of a prompt for the same task (summarizing a business meeting) that each produce a different format: a formal executive memo, a casual Slack message, a structured bullet list, and a three-sentence WhatsApp update. Submit all 4 outputs.",
      },
      {
        lessonNumber: 5,
        title: "Prompt Chaining",
        type: "sandbox",
        hook: "Complex tasks are not one prompt. They are a conversation where each response feeds the next. Master this and you can automate entire workflows.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Building multi-step prompt chains where output from step 1 becomes input for step 2. Design patterns for research → analysis → writing chains, and how to handle errors between steps.",
        sandboxTask:
          "Build a 3-prompt chain for a full research and writing task: (1) generate a structured outline for 'AI adoption in Kenyan SMEs', (2) expand each section using the outline as input, (3) edit the full draft into a polished 500-word article. Submit the chain and final output.",
      },
      {
        lessonNumber: 6,
        title: "Few-Shot Prompting",
        type: "sandbox",
        hook: "Show, do not tell. Providing examples is the most powerful prompting technique that most people never use — and it works every time.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Using examples to guide AI output. Few-shot prompting tells the AI exactly what you want by showing it 2–5 worked examples before the real task. Works for tone, format, structure, and style consistency.",
        sandboxTask:
          "Use few-shot prompting to generate consistent branded social media captions for a fictional Kenyan food delivery startup called Chapati Express. Provide 3 example captions as part of the prompt, then generate 5 new ones. All 5 must match the brand voice of the examples.",
      },
      {
        lessonNumber: 7,
        title: "Advanced Techniques",
        type: "sandbox",
        hook: "The techniques that separate a KSh 80,000 prompt engineer from a KSh 250,000 one are not secret — they just require deliberate practice.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Chain-of-thought prompting, self-critique loops, persona stacking, and iterative refinement. How to get AI to check its own work, reason step by step, and produce consistently high-quality output.",
        sandboxTask:
          "Use chain-of-thought prompting to solve a complex business problem: a Kenyan e-commerce company has declining repeat purchase rates. Prompt AI to reason through the problem step by step, identify 5 root causes, rank them by impact, and propose solutions for the top 2. Then prompt it to critique its own recommendations.",
      },
      {
        lessonNumber: 8,
        title: "Building a Prompt Library",
        type: "sandbox",
        hook: "Every hour you spend building a prompt library saves 10 hours in the future. The best professionals do not start from scratch — they remix.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "How to structure a reusable prompt library: categories, variables, version control, and team access. We build a template system with placeholders that works for any team size.",
        sandboxTask:
          "Build a personal prompt library with 10 entries across 3 categories (communication, research, content). Each entry must include: the prompt template with variables in [BRACKETS], a one-line description of when to use it, and a sample output. Format it as a shareable document.",
      },
      {
        lessonNumber: 9,
        title: "Prompts for Your Industry",
        type: "sandbox",
        hook: "Generic prompts get generic results. Industry-specific prompting is what companies are actually paying for.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Adapting prompt techniques for specific industries: finance, healthcare, logistics, education, and tech. Understanding the vocabulary, regulatory constraints, and output formats each industry expects.",
        sandboxTask:
          "Choose one industry: banking, agriculture, healthcare, or logistics. Write 5 specialized prompts for common tasks in that industry. Each prompt must include role, context, task, constraints, and format. Submit with sample outputs.",
      },
      {
        lessonNumber: 10,
        title: "Debugging Bad Prompts",
        type: "sandbox",
        hook: "When AI gives you bad output, 90% of the time the problem is your prompt — not the AI. Diagnosing and fixing it is a professional skill.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Systematic debugging framework: identifying the failure mode (vague output, wrong format, missed requirements, hallucinations), applying targeted fixes, and testing iteratively.",
        sandboxTask:
          "You are given 5 broken prompts that produce poor output. Diagnose the failure mode of each, apply the appropriate fix, and submit the improved prompt with before/after output comparison.",
      },
      {
        lessonNumber: 11,
        title: "Quiz: Prompt Engineering Mastery",
        type: "quiz",
        hook: "Certification-level knowledge check. If you can answer all 4 correctly, you are ready for your badge.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Comprehensive quiz covering all core prompt engineering techniques from this course.",
        quizQuestions: [
          {
            question:
              "Which prompting technique involves providing 2–5 worked examples before stating the real task?",
            options: [
              "Chain-of-thought prompting",
              "Role prompting",
              "Few-shot prompting",
              "Constraint prompting",
            ],
            correctAnswer: 2,
          },
          {
            question:
              "Your AI output is 800 words when you need 150. What is the most effective fix?",
            options: [
              "Ask the AI to 'be shorter' in a follow-up message",
              "Add an explicit word count constraint and format instruction to the original prompt",
              "Copy the output and delete words manually",
              "Switch to a different AI model",
            ],
            correctAnswer: 1,
          },
          {
            question: "What does 'prompt chaining' mean?",
            options: [
              "Writing very long prompts with many instructions in one message",
              "Using the output of one prompt as the input to the next in a sequence",
              "Copying prompts from other professionals and modifying them",
              "Asking multiple AI tools the same prompt and comparing answers",
            ],
            correctAnswer: 1,
          },
          {
            question:
              "A client needs a prompt that always produces responses in a very specific format. What is the best approach?",
            options: [
              "Describe the format in words only",
              "Provide a filled-in example of the exact format you want as part of the prompt",
              "Ask the AI to invent a good format for the task",
              "Use separate prompts for each field in the format",
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        lessonNumber: 12,
        title: "Final Project: Team Prompt Playbook",
        type: "project",
        hook: "This is the deliverable that gets you hired. Companies are actively looking for people who can build systems — not just use AI themselves.",
        duration_mins: 60,
        isAvailable: false,
        content:
          "Build a complete Prompt Engineering Playbook for a fictional Nairobi-based marketing agency (15 staff, B2B clients). The playbook must include: 15 reusable prompt templates covering client proposals, social media, reporting, and research; a style guide for prompt writing; a quick-reference cheat sheet; and onboarding instructions for a new staff member. Submit as a professionally formatted document.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 3 — ai-data-analysis
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-data-analysis",
    title: "AI for Data Analysis",
    tagline: "Turn Raw Numbers into Business Decisions",
    description:
      "Turn raw data into decisions using AI. Learn to clean, analyze, and visualize business data without a data science degree. Skills valued by companies across every industry.",
    level: "Intermediate",
    price_kes: 2800,
    lessons_count: 10,
    badge_name: "AI Data Analyst",
    what_you_will_learn: [
      "Clean and structure messy real-world datasets using AI",
      "Generate professional charts and dashboards with natural language",
      "Write and debug SQL queries using AI code generation",
      "Build automated reports that surface actionable insights",
      "Present AI-generated insights clearly to non-technical decision-makers",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Course Introduction",
        type: "intro" as const,
        hook: "Welcome. Here is everything you need to know before your first lesson.",
        duration_mins: 5,
        isAvailable: true,
        content: "Every Kenyan business is sitting on data they cannot read. Sales records, customer feedback, delivery times, transaction logs — all of it is potential insight living in spreadsheets nobody analyzes. This course teaches you to use AI to turn raw data into decisions. No coding. No statistics degree. Just the right questions and the right prompts.",
        introWhoFor: [
          "An operations manager who gets weekly reports but cannot find the insight",
          "A business analyst who wants to work 10x faster with AI-assisted tools",
          "An entrepreneur who wants to understand their data without hiring a data scientist",
          "A graduate who wants a skill every Kenyan company needs right now",
        ],
        introOutcomes: [
          "Clean any messy dataset using AI in under 30 minutes",
          "Write prompts that extract specific insights from complex business data",
          "Find patterns and anomalies that manual review would miss entirely",
          "Build an automated reporting dashboard for your business",
          "Present data-driven recommendations to any executive audience",
        ],
        introStructure: {
          lessonsCount: 10,
          hours: 5,
          sandboxCount: 4,
          finalProject: "Business intelligence report for a fictional Kenyan FMCG company",
        },
        introFirstTask: "what business data problem do you most want to solve?",
      },
      {
        lessonNumber: 1,
        title: "The Modern Data Analyst",
        type: "video",
        hook: "Ten years ago, data analysis required a statistics degree. Today, a business analyst who knows AI tools can outperform a traditional data scientist on most business problems.",
        duration_mins: 10,
        isAvailable: true,
        content:
          "What has changed in data analysis with AI: the new workflow, which tools matter (ChatGPT Code Interpreter, Claude, Julius AI, Google Sheets AI), and where AI adds the most value versus where human judgment remains essential.",
        theory: {
          concept: `Data literacy in the AI era does not mean knowing how to code. It means knowing how to ask the right questions of your data and use AI tools to find the answers.\n\nEvery business generates data constantly. Every M-Pesa transaction is data. Every customer complaint is data. Every delivery time is data. Every sale is data. The businesses that grow fastest are the ones that turn this raw data into decisions rather than letting it sit in a spreadsheet untouched.\n\nBefore AI, you needed a data scientist with Python skills to analyze complex datasets. Now you need a person who can ask the right questions and write the right prompts. That skill gap is what this course closes. The analyst's job has not disappeared — it has been upgraded. AI handles the mechanical work; you provide the questions and the judgment.`,
          badExample: `A manager receives a spreadsheet with 6 months of sales data. They look at it for 10 minutes and conclude: "Sales are okay. Some months are better than others."`,
          badBreakdown: [
            { element: "Questions asked", present: "None", problem: "No specific patterns or anomalies identified" },
            { element: "Comparison", present: "None", problem: "No benchmarks or targets referenced" },
            { element: "Insight", present: "Not present", problem: "Observation made but no actionable conclusion" },
            { element: "Anomaly detection", present: "Not present", problem: "Unusual data points go unnoticed" },
            { element: "Next action", present: "Not present", problem: "No decision or recommendation produced" },
          ],
          badOutput: `"Sales are okay. Some months are better than others. Q3 looks decent. We should probably keep doing what we are doing."`,
          goodExample: `I have 6 months of daily sales data for my Nairobi supermarket. Analyze this data and:\n1. Identify the 3 highest-performing days of the week by average revenue\n2. Find any months where sales dropped more than 15% from the previous month\n3. Calculate the average transaction value and identify which product categories are above and below average\n4. Identify any unusual spikes or drops that need investigation\n\nPresent findings as a brief executive summary under 200 words, followed by a detailed breakdown with specific numbers.`,
          goodBreakdown: [
            { element: "Questions asked", present: "4 specific questions", improvement: "Each question targets a distinct business insight" },
            { element: "Comparison", present: "Present", improvement: "Month-over-month and category benchmarks specified" },
            { element: "Insight type", present: "Defined", improvement: "Anomaly detection, ranking, and averages all requested" },
            { element: "Threshold", present: "Present", improvement: "15% drop defined as significant — removes ambiguity" },
            { element: "Format", present: "Present", improvement: "Executive summary + detail breakdown structure specified" },
          ],
          goodOutput: `"EXECUTIVE SUMMARY\nSaturdays outperform Mondays by 340%. March showed a 23% revenue drop — likely linked to school fees season. Fresh produce transactions are 45% below store average, suggesting a pricing or availability issue. An unusual spike on March 14 (3× normal volume) requires investigation.\n\nDETAILED BREAKDOWN\n- Top days: Saturday (KSh 145K avg), Friday (KSh 128K), Sunday (KSh 119K)\n- March drop: KSh 890K → KSh 684K (-23%) vs February\n- Avg transaction value: KSh 1,240. Electronics above (KSh 4,200), Fresh produce below (KSh 680)\n- March 14 spike: KSh 432K — possible event nearby or promotion not recorded in system"`,
          keyInsight: `Data analysis is not about looking at numbers — it is about asking specific questions and finding actionable answers. AI does not replace the analyst. It replaces the hours of manual calculation so the analyst can focus entirely on the questions and the decisions.`,
          ruleToRemember: `A dataset without questions is just numbers. Questions turn data into decisions.`,
          checkYourUnderstanding: [
            {
              question: "What does data literacy mean in the AI era?",
              options: [
                "Knowing how to write Python or R code for data science",
                "Knowing how to ask the right questions of your data and use AI to find answers",
                "Being able to create complex pivot tables and charts manually",
                "Having a statistics or mathematics degree",
              ],
              correctAnswer: 1,
              explanation: "AI has democratized data analysis. You no longer need to code to analyze data — you need to know what questions to ask.",
            },
            {
              question: "What is the main failure in the bad data analysis example?",
              options: [
                "The manager did not have enough data to draw conclusions",
                "The spreadsheet was too complex for manual review",
                "No specific questions were asked, so no actionable insights were produced",
                "The manager needed better software before analyzing",
              ],
              correctAnswer: 2,
              explanation: "Data only becomes useful when you ask specific questions of it. Looking at data without questions produces vague observations, not insights.",
            },
            {
              question: "What does AI replace in data analysis?",
              options: [
                "The need to define questions before starting",
                "The data analyst entirely, including judgment and interpretation",
                "Hours of manual calculation, freeing the analyst to focus on decisions",
                "The need for accurate and clean input data",
              ],
              correctAnswer: 2,
              explanation: "AI accelerates the mechanical parts of analysis. The human still defines the questions, interprets the findings, and makes the decisions.",
            },
          ],
        },
      },
      {
        lessonNumber: 2,
        title: "Cleaning Messy Data with AI",
        type: "sandbox",
        hook: "Data analysts spend 80% of their time cleaning data. With AI, that drops to 20% — freeing the other 60% for actual thinking.",
        duration_mins: 15,
        isAvailable: true,
        content:
          "Using AI to clean real-world datasets: handling missing values, fixing inconsistent formatting, deduplicating records, standardizing categories, and validating data integrity — without writing code manually.",
        sandboxTask:
          "You are given a messy CSV of 200 fictional M-Pesa transactions with missing values, duplicate entries, inconsistent date formats, and mixed currency notations. Use AI tools to clean and standardize the dataset. Submit the cleaned file and a one-paragraph description of every issue you found and fixed.",
      },
      {
        lessonNumber: 3,
        title: "AI-Powered SQL for Business",
        type: "sandbox",
        hook: "SQL is the language of business data — and AI means you no longer need years of practice to write it fluently.",
        duration_mins: 20,
        isAvailable: true,
        content:
          "Using AI to generate, explain, and debug SQL queries. From basic SELECT statements to JOINs, GROUP BY aggregations, and subqueries — covering the patterns that appear in 80% of real business data questions.",
        sandboxTask:
          "Using a fictional e-commerce database schema (customers, orders, products, payments tables), write AI-assisted SQL queries to answer 5 business questions: (1) top 10 customers by spend last quarter, (2) products with declining sales, (3) average order value by region, (4) payment failure rate by method, (5) customers who bought once but never returned. Submit queries and results.",
      },
      {
        lessonNumber: 4,
        title: "Visualizing Data That Tells a Story",
        type: "sandbox",
        hook: "A chart that requires explanation has failed. The goal is a visualization so clear that the decision it implies is obvious.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Chart type selection, data-to-ink ratio, color use, annotation, and how to use AI to generate and refine visualizations. When to use bar charts vs. line charts vs. scatter plots — and how to make each immediately readable.",
        sandboxTask:
          "Given monthly sales data for a fictional Kenyan retail chain with 6 branches over 24 months, use AI tools to produce 4 visualizations: (1) overall sales trend, (2) branch performance comparison, (3) seasonal patterns, (4) a single executive summary chart that tells the whole story. Submit images and explain your chart type choices.",
      },
      {
        lessonNumber: 5,
        title: "Analyzing Customer Behavior",
        type: "sandbox",
        hook: "Every purchase a customer makes is a data point. The companies that read those data points correctly grow faster than the ones that guess.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Customer segmentation, RFM analysis (Recency, Frequency, Monetary), churn prediction signals, and cohort analysis — all performed using AI tools on real-world-style datasets.",
        sandboxTask:
          "Analyze a fictional dataset of 500 customer transactions for a Nairobi fashion retailer. Use AI to: (1) segment customers into high, medium, and low value groups, (2) identify customers at risk of churning, (3) find the top 3 actionable insights for the marketing team. Submit analysis and recommendations.",
      },
      {
        lessonNumber: 6,
        title: "Financial Analysis with AI",
        type: "sandbox",
        hook: "Financial analysis is the lingua franca of business. Every manager who can read the numbers with AI assistance makes better decisions faster.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "P&L analysis, cash flow forecasting, variance analysis, and financial KPI tracking — using AI to do the number-crunching and generate plain-language explanations of what the numbers mean.",
        sandboxTask:
          "You are given a fictional 12-month P&L statement for a Kenyan logistics company. Use AI to: (1) calculate key ratios (gross margin, operating margin, expense ratios), (2) identify the 3 biggest cost drivers, (3) spot months with unusual patterns and hypothesize causes, (4) write a one-page CFO briefing in plain language. Submit all outputs.",
      },
      {
        lessonNumber: 7,
        title: "Building Automated Reports",
        type: "sandbox",
        hook: "The best analysts do not spend every Friday afternoon making the same report. They build systems that generate it automatically.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Designing report templates, using AI to generate narrative commentary on data, connecting data sources to reporting tools, and building dashboards that update automatically — without engineering support.",
        sandboxTask:
          "Design a weekly operations dashboard for a fictional Kenyan delivery company (orders, on-time rate, driver utilization, customer complaints). Build the report template, write the AI prompts that would generate the narrative commentary, and produce one complete sample report using fictional data.",
      },
      {
        lessonNumber: 8,
        title: "Presenting Insights to Non-Technical Audiences",
        type: "reading",
        hook: "An analysis that cannot be communicated clearly is worth nothing. The gap between 'correct' and 'actionable' is how you explain it.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "The pyramid principle for data storytelling, how to lead with the recommendation not the methodology, translating statistical concepts into plain language, and handling questions from skeptical executives.",
        readingTopics: [
          "The Pyramid Principle: leading with the so-what before the how-we-got-there",
          "Translating analysis outputs into language executives actually use",
          "Choosing the right level of detail for the audience",
          "Handling objections: 'Where does this data come from?' and 'Can we trust this?'",
          "One-page executive summaries: structure, length, and what to leave out",
        ],
      },
      {
        lessonNumber: 9,
        title: "Quiz: Data Analysis Fundamentals",
        type: "quiz",
        hook: "Test your readiness for real-world data analysis work before you submit your final project.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Covering key concepts from data cleaning, SQL, visualization, and business analysis communication.",
        quizQuestions: [
          {
            question:
              "A dataset has 1,000 rows. 150 rows are missing values in a key column. What is the best first step?",
            options: [
              "Delete all 150 rows immediately to keep the data clean",
              "Investigate why the values are missing before deciding how to handle them",
              "Fill all missing values with the column average",
              "Leave the missing values in place and note them in the analysis",
            ],
            correctAnswer: 1,
          },
          {
            question:
              "RFM analysis segments customers by which three factors?",
            options: [
              "Revenue, Frequency, Market share",
              "Recency, Frequency, Monetary value",
              "Reach, Funnel, Margin",
              "Registration date, Feedback score, Monthly spend",
            ],
            correctAnswer: 1,
          },
          {
            question:
              "You need to compare sales performance across 6 branches over 12 months. Which chart type is most appropriate?",
            options: [
              "Pie chart — shows proportions clearly",
              "Scatter plot — shows correlation between variables",
              "Grouped bar chart or small-multiple line charts — shows comparison over time",
              "Histogram — shows distribution of a single variable",
            ],
            correctAnswer: 2,
          },
          {
            question:
              "An executive says 'just give me the bottom line' during your data presentation. What does this tell you?",
            options: [
              "They want more charts and visualizations",
              "They want you to lead with the recommendation and save the methodology for questions",
              "They do not trust your analysis and you should start over",
              "They want the raw data so they can analyze it themselves",
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        lessonNumber: 10,
        title: "Final Project: Business Intelligence Report",
        type: "project",
        hook: "This project is your proof that you can turn raw data into decisions — the one deliverable data-adjacent roles actually ask for in interviews.",
        duration_mins: 60,
        isAvailable: false,
        content:
          "You are the data analyst for Savannah Foods Ltd., a fictional Kenyan FMCG company with 8 product lines and distribution across 4 regions. Using the provided datasets, produce a complete quarterly business review: executive summary (one page), 5 key visualizations with annotations, a customer segment breakdown, a top 3 recommendations section with supporting evidence, and an appendix with your methodology. Submit as a PDF or formatted document.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 4 — whatsapp-ai-integration
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "whatsapp-ai-integration",
    title: "WhatsApp Business AI Integration",
    tagline: "Build Bots That Handle Customers 24/7",
    description:
      "Build production-ready WhatsApp bots using the Meta Cloud API. Automate customer support, order updates, and lead qualification. Deployable from day one.",
    level: "Advanced",
    price_kes: 3500,
    lessons_count: 14,
    badge_name: "WhatsApp AI Developer",
    what_you_will_learn: [
      "Configure a Meta Cloud API WhatsApp Business account from scratch",
      "Build a bot that resolves customer FAQs without human intervention",
      "Send automated transactional alerts and order updates via WhatsApp",
      "Design multi-step conversational flows using NLP techniques",
      "Deploy and monitor a production WhatsApp AI bot from day one",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Course Introduction",
        type: "intro" as const,
        hook: "Welcome. Here is everything you need to know before your first lesson.",
        duration_mins: 5,
        isAvailable: true,
        content: "WhatsApp is not just a messaging app in Kenya — it is the primary customer communication channel for businesses of every size. This course teaches you to build AI-powered WhatsApp bots that handle customer questions, take orders, qualify leads, and send automated updates without any human intervention. If you can build on WhatsApp, you can work with any business in East Africa.",
        introWhoFor: [
          "A developer who wants to build marketable products for Kenyan businesses",
          "A business owner who wants to automate customer service without hiring more staff",
          "A freelancer looking for a high-value technical skill with immediate market demand",
          "A software student who wants a portfolio project companies will actually pay for",
        ],
        introOutcomes: [
          "Set up a Meta Cloud API account and send your first WhatsApp message via code",
          "Build a bot that handles customer FAQs without any human involvement",
          "Design multi-step conversation flows for booking, ordering, and lead qualification",
          "Integrate an LLM so your bot understands free-form customer messages",
          "Deploy a production WhatsApp bot that runs 24/7 for a real business client",
        ],
        introStructure: {
          lessonsCount: 14,
          hours: 7,
          sandboxCount: 6,
          finalProject: "Production-deployed customer service bot for a fictional property company",
        },
        introFirstTask: "what kind of WhatsApp bot would you build for a Kenyan business?",
      },
      {
        lessonNumber: 1,
        title: "WhatsApp as a Business Platform",
        type: "video",
        hook: "WhatsApp has 3 billion active users. In Kenya, it is the primary customer communication channel for businesses of every size. If you can build on WhatsApp, you can build for any of them.",
        duration_mins: 10,
        isAvailable: true,
        content:
          "The WhatsApp Business ecosystem: the free Business app, the Business Platform (Cloud API), and the difference between them. What businesses are doing with WhatsApp automation today — from M-Pesa confirmations to appointment booking.",
      },
      {
        lessonNumber: 2,
        title: "Setting Up the Meta Cloud API",
        type: "sandbox",
        hook: "The setup is the hardest part for most developers. We will get you from zero to your first working API call in this lesson.",
        duration_mins: 20,
        isAvailable: true,
        content:
          "Creating a Meta developer account, setting up a Facebook App, configuring a WhatsApp Business account, getting your test phone number, and making your first API call. Covers the authentication flow and common setup errors.",
        sandboxTask:
          "Complete the full Meta Cloud API setup and send a test 'Hello World' message to your own WhatsApp number via the API. Submit a screenshot of the received message and the API call you used (with credentials redacted).",
      },
      {
        lessonNumber: 3,
        title: "Sending Messages — Text, Media, and Templates",
        type: "sandbox",
        hook: "The API can send text, images, documents, audio, video, and interactive buttons. Most developers only ever learn text. We will teach you all of it.",
        duration_mins: 20,
        isAvailable: true,
        content:
          "The full message types available in the WhatsApp Cloud API: text messages, image/document/audio attachments, location messages, interactive list messages, and reply button messages. Message template creation and approval.",
        sandboxTask:
          "Build a Node.js or Python script that sends 4 different message types to a test number: (1) a plain text message, (2) an image with a caption, (3) an interactive message with 3 reply buttons, (4) a pre-approved message template. Submit your code and screenshots of each received message.",
      },
      {
        lessonNumber: 4,
        title: "Receiving Messages — Webhooks",
        type: "sandbox",
        hook: "Sending messages is easy. Receiving them and acting on them is where real bots are built.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Setting up a webhook endpoint, verifying the webhook with Meta, parsing incoming message payloads (text, media, button replies, location), and handling the event structure. Using ngrok for local development.",
        sandboxTask:
          "Build a webhook server that receives incoming WhatsApp messages and logs the sender's number, message type, and content to a console. Then extend it to auto-reply 'We received your message and will respond shortly.' Submit your webhook code and a screenshot of the console log from a real test message.",
      },
      {
        lessonNumber: 5,
        title: "Building a Customer FAQ Bot",
        type: "sandbox",
        hook: "The number one use case for WhatsApp bots in East Africa is FAQ automation. It cuts customer service costs by 60–80% for most businesses.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Building a rule-based FAQ bot: keyword detection, intent matching, response mapping, and a fallback to human agent. Structuring the FAQ knowledge base and handling variations in how customers phrase the same question.",
        sandboxTask:
          "Build a working FAQ bot for a fictional Nairobi insurance company (10 common questions about policy coverage, claims, and payments). The bot must handle at least 3 variations of each question, provide structured answers, and send 'Connecting you to an agent' when it cannot match intent. Submit code and a demonstration log.",
      },
      {
        lessonNumber: 6,
        title: "Transactional Alerts and Order Updates",
        type: "sandbox",
        hook: "Every time a customer completes a transaction and does not immediately get a WhatsApp confirmation, that is a customer experience failure waiting to happen.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Triggering outbound WhatsApp messages from backend events: order confirmation, payment receipt, shipping updates, appointment reminders. Using approved message templates correctly and handling opt-in compliance.",
        sandboxTask:
          "Build a backend trigger system that sends WhatsApp notifications for 4 events: order placed, payment confirmed, order shipped, delivery completed. Use a fictional e-commerce order flow. Each message must use the correct template format. Submit code and sample messages.",
      },
      {
        lessonNumber: 7,
        title: "Lead Qualification Bot",
        type: "sandbox",
        hook: "Sales teams spend 60% of their time on leads that will never buy. A WhatsApp bot can qualify 1,000 leads overnight while your team sleeps.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Designing a conversational lead qualification flow: collecting name, company, budget, timeline, and use case through natural WhatsApp conversation. Scoring leads and routing qualified ones to the sales team.",
        sandboxTask:
          "Build a lead qualification bot for a fictional B2B software company. The bot must collect 5 qualification criteria, score the lead (hot/warm/cold), send a summary to a Slack channel or email for hot leads, and thank cold leads politely. Submit code and a sample conversation log.",
      },
      {
        lessonNumber: 8,
        title: "NLP and AI-Powered Intent Detection",
        type: "sandbox",
        hook: "Rule-based bots break when customers phrase things unexpectedly. AI-powered intent detection handles anything a human would say.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Integrating an LLM (Claude or GPT) as the intelligence layer of a WhatsApp bot. Designing the system prompt, passing conversation history, extracting structured data from natural language responses, and handling edge cases.",
        sandboxTask:
          "Upgrade your FAQ bot from Lesson 5 to use an LLM for intent detection instead of keyword matching. The bot must handle free-form questions, maintain conversation context across 3 turns, and escalate gracefully when confidence is low. Submit the upgraded code and a comparison of 5 test queries handled by the old vs. new system.",
      },
      {
        lessonNumber: 9,
        title: "Multi-Step Conversation Flows",
        type: "sandbox",
        hook: "Single-turn bots answer questions. Multi-turn bots complete transactions. The difference in business value is enormous.",
        duration_mins: 30,
        isAvailable: false,
        content:
          "State machine design for multi-step conversations: managing conversation state, handling interruptions and restarts, timeout handling, and confirmation steps. Building flows that guide users through booking, ordering, or support processes.",
        sandboxTask:
          "Build a complete appointment booking flow for a fictional Nairobi dental clinic: collect service type, preferred date, preferred time, patient name, and phone number — confirm the booking — send a calendar invitation message. The bot must handle invalid inputs at each step. Submit code and a full conversation trace.",
      },
      {
        lessonNumber: 10,
        title: "Media Handling and Rich Messages",
        type: "sandbox",
        hook: "Customers send photos of receipts, screenshots of errors, and voice notes. A production bot needs to handle all of it.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Receiving and downloading media (images, documents, audio) via the API, storing to cloud storage, processing with AI (OCR, transcription, image analysis), and responding appropriately.",
        sandboxTask:
          "Build a bot that accepts a photo of a receipt, extracts the total amount and merchant name using AI vision, and replies with a structured expense summary. Submit code and a demo with a real receipt photo.",
      },
      {
        lessonNumber: 11,
        title: "Security, Rate Limits, and Compliance",
        type: "reading",
        hook: "Getting your WhatsApp Business account banned because you violated Meta's policies is a very bad day. This lesson prevents that.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Meta's messaging policies, opt-in requirements, rate limits (per-user and per-account), webhook signature verification, secure credential storage, and how to avoid common compliance violations.",
        readingTopics: [
          "WhatsApp Business Policy: what is and is not allowed",
          "Opt-in requirements: getting and recording customer consent",
          "Rate limits: messaging windows, 24-hour session rules, and template-only conversations",
          "Webhook security: verifying request signatures to prevent spoofing",
          "Credential management: never hardcode API keys — use environment variables and secret managers",
        ],
      },
      {
        lessonNumber: 12,
        title: "Monitoring, Analytics, and Error Handling",
        type: "sandbox",
        hook: "A bot that fails silently is worse than no bot at all. Customers think they were answered — but they were not.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Message delivery status callbacks (sent/delivered/read/failed), error code handling, retry logic, logging, and building a simple monitoring dashboard for bot health.",
        sandboxTask:
          "Add full observability to your bot: (1) log every incoming and outgoing message with timestamp, user ID, and message type to a database, (2) handle all API error codes with appropriate retries, (3) build a simple admin page showing message volume, delivery success rate, and top intents for the last 7 days.",
      },
      {
        lessonNumber: 13,
        title: "Production Deployment",
        type: "sandbox",
        hook: "Getting a bot working locally is proof of concept. Getting it running reliably for 10,000 users is the actual job.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Deploying a WhatsApp bot to production: hosting options (Railway, Render, DigitalOcean), environment configuration, SSL for webhooks, scaling considerations, uptime monitoring, and graceful error recovery.",
        sandboxTask:
          "Deploy your bot to a free-tier cloud host (Railway or Render). Configure environment variables for all credentials, set up the production webhook URL in Meta, and verify end-to-end message flow works in production. Submit the live bot URL and a screenshot of a test conversation in production.",
      },
      {
        lessonNumber: 14,
        title: "Final Project: Full Customer Service Bot",
        type: "project",
        hook: "This is your portfolio centerpiece. WhatsApp bot developers with deployed, working bots earn between KSh 150,000 and KSh 400,000 per project.",
        duration_mins: 90,
        isAvailable: false,
        content:
          "Build a complete, production-deployed WhatsApp bot for Savannah Properties Ltd. — a fictional Kenyan real estate company. The bot must: answer FAQs about 5 property listings, qualify leads with a 5-question flow, book property viewing appointments, send confirmation messages, and escalate to an agent when needed. Submit the GitHub repo, live demo link, and a 500-word technical write-up.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 5 — mpesa-daraja-api
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "mpesa-daraja-api",
    title: "M-Pesa Daraja API Integration",
    tagline: "Get Paid. Build the Payments Layer Africa Runs On.",
    description:
      "Build fully functional payment systems using Safaricom's Daraja API. From sandbox setup through to production deployment — skills that fintech companies globally are hiring for.",
    level: "Advanced",
    price_kes: 4500,
    lessons_count: 16,
    badge_name: "Daraja Certified Developer",
    what_you_will_learn: [
      "Authenticate with Safaricom's Daraja sandbox and production environments",
      "Implement STK Push for seamless mobile payment initiation",
      "Handle C2B and B2C payment callbacks securely with full validation",
      "Build a payment confirmation, logging, and receipt system",
      "Ship a production-ready payment integration with error handling and retries",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Course Introduction",
        type: "intro" as const,
        hook: "Welcome. Here is everything you need to know before your first lesson.",
        duration_mins: 5,
        isAvailable: true,
        content: "Every business in Kenya that takes digital payments eventually needs to integrate M-Pesa. The Daraja API is the technical gateway that makes that happen. This course takes you from creating a Safaricom developer account all the way to deploying a fully tested payment system in production. Developers with this skill command premium rates because this integration is notoriously difficult to get right.",
        introWhoFor: [
          "A developer who wants the most in-demand fintech skill in East Africa on their CV",
          "A freelancer who wants to build payment systems for businesses and charge premium rates",
          "A startup founder who needs to integrate M-Pesa without outsourcing it entirely",
          "A software student who wants a real, deployable financial project for their portfolio",
        ],
        introOutcomes: [
          "Authenticate with the Daraja API and manage OAuth tokens reliably in production",
          "Build an STK Push integration that initiates and confirms payments in real time",
          "Handle C2B and B2C payment flows with proper callback validation",
          "Build a payment logging system with receipts, audit trails, and reconciliation reports",
          "Deploy a production-ready payment system with error handling and retry logic",
        ],
        introStructure: {
          lessonsCount: 16,
          hours: 8,
          sandboxCount: 7,
          finalProject: "Complete payment system for a fictional Kenyan e-commerce platform",
        },
        introFirstTask: "what payment problem would you solve with M-Pesa integration?",
      },
      {
        lessonNumber: 1,
        title: "M-Pesa and the Daraja API",
        type: "video",
        hook: "M-Pesa processes over KSh 1 trillion per month. Every one of those transactions passes through an API. Understanding that API is a career-defining skill in East Africa.",
        duration_mins: 10,
        isAvailable: true,
        content:
          "The M-Pesa ecosystem: consumer vs. business M-Pesa, the Daraja API product suite (STK Push, C2B, B2C, Account Balance, Transaction Status, Reversal), and which endpoint solves which business problem.",
      },
      {
        lessonNumber: 2,
        title: "Developer Account and Sandbox Setup",
        type: "sandbox",
        hook: "Every Daraja developer starts with one painful afternoon setting up their sandbox. We will compress that into 20 minutes.",
        duration_mins: 20,
        isAvailable: true,
        content:
          "Creating a Safaricom Developer Portal account, creating an app, getting sandbox credentials (Consumer Key and Consumer Secret), understanding the sandbox test phone numbers, and setting up your development environment.",
        sandboxTask:
          "Create a Safaricom Developer Portal account, create a sandbox app, and retrieve your Consumer Key and Consumer Secret. Make your first successful OAuth token request and print the access token. Submit a screenshot of the Developer Portal app dashboard and the token response (with credentials redacted).",
      },
      {
        lessonNumber: 3,
        title: "OAuth Authentication",
        type: "sandbox",
        hook: "Every Daraja API call requires a valid OAuth token. Botching authentication is the #1 reason Daraja integrations fail in production.",
        duration_mins: 20,
        isAvailable: true,
        content:
          "OAuth 2.0 client credentials flow: Base64 encoding your key:secret pair, making the token request, parsing the response, token expiry (3600 seconds), and implementing automatic token refresh in your application.",
        sandboxTask:
          "Build an authentication module in Node.js, Python, or PHP that: fetches a new OAuth token, caches it with its expiry time, automatically refreshes it 60 seconds before expiry, and handles API errors gracefully. Submit the module code with unit tests.",
      },
      {
        lessonNumber: 4,
        title: "STK Push — Initiating Payments",
        type: "sandbox",
        hook: "STK Push is the prompt that appears on a customer's phone asking them to enter their M-Pesa PIN. This is the most valuable API endpoint in East African fintech.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "The STK Push (Lipa Na M-Pesa Online) request: all required parameters (BusinessShortCode, Password, Timestamp, TransactionType, Amount, PartyA, PartyB, PhoneNumber, CallBackURL, AccountReference, TransactionDesc), generating the password, and handling the initiation response.",
        sandboxTask:
          "Build a function that accepts a phone number and amount, constructs a valid STK Push request, sends it to the Daraja sandbox, and returns the CheckoutRequestID. Test it with the sandbox phone number 254708374149. Submit code and a successful API response screenshot.",
      },
      {
        lessonNumber: 5,
        title: "STK Push — Handling Callbacks",
        type: "sandbox",
        hook: "Initiating a payment is step one. Knowing whether it succeeded or failed — and acting on that — is the actual product.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Building the STK Push callback endpoint: parsing the callback payload, extracting ResultCode, ResultDesc, MpesaReceiptNumber, TransactionDate, and Amount, distinguishing success (0) from failure, updating your database, and sending confirmation to the customer.",
        sandboxTask:
          "Build a callback endpoint that receives the STK Push result, stores it in a database table (CheckoutRequestID, ResultCode, ReceiptNumber, Amount, PhoneNumber, Timestamp, Status), and responds with the required acknowledgement JSON. Simulate both a successful and failed payment. Submit code and database records from both tests.",
      },
      {
        lessonNumber: 6,
        title: "STK Push Status Query",
        type: "sandbox",
        hook: "Callbacks sometimes do not arrive. When a customer says 'I paid but nothing happened,' you need to query transaction status — not apologize.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Using the Query Request API to check the status of an STK Push transaction: when to use it (callback timeout, customer dispute), building the request, parsing the response, and integrating it into your payment reconciliation flow.",
        sandboxTask:
          "Build a transaction status query function and integrate it with your callback system: if a callback does not arrive within 60 seconds of initiation, automatically query the status and update the database accordingly. Submit code with a demonstration of the timeout-and-query flow.",
      },
      {
        lessonNumber: 7,
        title: "C2B Payments — Register URLs",
        type: "sandbox",
        hook: "C2B lets customers pay your business directly from their M-Pesa menu — no app required. It is the payment method preferred by most Kenyan consumers for bill payments.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "C2B payment flow: registering your Validation and Confirmation URLs with Daraja, the difference between validation (real-time approval) and confirmation (final notification), and the data structure of each callback.",
        sandboxTask:
          "Register your Validation and Confirmation URLs for a C2B shortcode in the Daraja sandbox. Build both endpoint handlers. The Validation URL must check if the AccountReference exists in your system and return Accept or Reject. The Confirmation URL must record the payment. Test with a simulated C2B payment. Submit code and logs.",
      },
      {
        lessonNumber: 8,
        title: "B2C Payments — Paying Out",
        type: "sandbox",
        hook: "B2C is how you pay your customers, suppliers, or employees via M-Pesa — programmatically, at scale. Every payroll system and disbursement platform in Kenya runs on this.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Business to Customer payments: the B2C API parameters, the three CommandID types (BusinessPayment, SalaryPayment, PromotionPayment), generating the security credential, and handling the result and queue timeout callbacks.",
        sandboxTask:
          "Build a B2C disbursement function that sends KSh 10 to the sandbox test number. Handle both the Result callback (success) and QueueTimeoutURL callback (failure/timeout). Log all disbursements to a database with status tracking. Submit code and successful disbursement proof.",
      },
      {
        lessonNumber: 9,
        title: "Account Balance API",
        type: "sandbox",
        hook: "Every financial application needs to know its own balance. Building balance checks into your system prevents overdrafts, failed transactions, and reconciliation errors.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "The Account Balance API: requesting your M-Pesa business account balance, parsing the callback response, and using balance checks to gate high-value transactions.",
        sandboxTask:
          "Build an account balance check function and integrate it as a pre-flight check before B2C disbursements: if the balance is below 1.5x the disbursement amount, abort the transaction and send an alert. Submit code and a demonstration of both the pass and abort flows.",
      },
      {
        lessonNumber: 10,
        title: "Transaction Status and Reversal",
        type: "sandbox",
        hook: "When a transaction goes wrong, your response time is measured in minutes before you lose customer trust permanently.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Transaction Status Query: checking any past transaction by TransactionID. Reversal API: reversing completed transactions, the parameters required, compliance rules around reversals, and when to automate the decision.",
        sandboxTask:
          "Build a transaction management module with two functions: (1) query_status(transactionID) returns full transaction details, (2) reverse_transaction(transactionID, amount, remarks) initiates a reversal and handles the callback. Test both against real sandbox transactions. Submit code and test logs.",
      },
      {
        lessonNumber: 11,
        title: "Error Handling and Retry Logic",
        type: "sandbox",
        hook: "Production payment systems are measured by uptime and accuracy. A single unhandled exception in a payment flow can mean thousands of lost transactions.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "All Daraja API error codes and what they mean, exponential backoff retry strategies, idempotency keys for preventing duplicate payments, circuit breakers for API outage protection, and dead letter queues for failed transactions.",
        sandboxTask:
          "Harden your STK Push integration with: (1) retry with exponential backoff (3 attempts, 2s/4s/8s delays) for network errors, (2) idempotency key generation to prevent duplicate charges on retry, (3) a circuit breaker that stops retrying after 5 consecutive failures and sends an alert. Submit hardened code with test cases for each scenario.",
      },
      {
        lessonNumber: 12,
        title: "Payment Receipts and Logging",
        type: "sandbox",
        hook: "KRA requires transaction records. Your business requires an audit trail. Your customers require receipts. One good logging system satisfies all three.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Designing a comprehensive payment logging schema, generating customer-facing M-Pesa receipts (HTML and WhatsApp format), implementing an audit trail, and building a reconciliation report that matches your system records against M-Pesa statements.",
        sandboxTask:
          "Build a payment logging system that: stores all transactions with full metadata, generates a branded HTML receipt for each successful payment, produces a daily reconciliation report showing totals by status (success/failed/pending), and exposes a simple admin endpoint to view logs by date range. Submit code and sample outputs.",
      },
      {
        lessonNumber: 13,
        title: "Security Best Practices",
        type: "reading",
        hook: "Payment systems are the highest-value targets for attackers. A security mistake here is not a bug report — it is a fraud investigation.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Security requirements for production Daraja integrations: credential management, IP whitelisting, HTTPS enforcement, callback payload validation, SQL injection prevention in payment records, and the Safaricom security audit process.",
        readingTopics: [
          "Credential management: environment variables, secret managers, and rotation schedules",
          "IP whitelisting: restricting Daraja callback access to Safaricom's published IP ranges",
          "Callback validation: verifying that callbacks genuinely originate from Safaricom",
          "Database security: parameterized queries for all payment record writes",
          "The Safaricom production go-live checklist and security requirements",
        ],
      },
      {
        lessonNumber: 14,
        title: "Going Live — Production Deployment",
        type: "sandbox",
        hook: "The gap between sandbox and production is where most developers get stuck. We will walk through every step of the go-live process.",
        duration_mins: 30,
        isAvailable: false,
        content:
          "The Safaricom go-live process: business verification requirements, production shortcode application, moving from sandbox to production credentials, updating callback URLs to your production domain, smoke testing, and common production-only issues.",
        sandboxTask:
          "Prepare a production deployment checklist for your payment integration: environment variable audit, callback URL verification, error handling review, logging completeness check, and a pre-go-live smoke test plan. Submit the completed checklist and a 5-minute walkthrough recording of your sandbox integration working end-to-end.",
      },
      {
        lessonNumber: 15,
        title: "Building the Payment Dashboard",
        type: "sandbox",
        hook: "Business owners do not want to read database logs. They want a dashboard that tells them exactly what is happening with their money.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Building a payment management dashboard: real-time transaction feed, daily/weekly/monthly volume charts, success rate monitoring, failed transaction alerts, and one-click export to Excel for accounting.",
        sandboxTask:
          "Build a minimal web dashboard (HTML/CSS/JS or React) connected to your payment database that shows: total transactions today with KSh amounts, success/failure rate, a live feed of the last 20 transactions, and a date-range filter. Submit deployed dashboard URL and code.",
      },
      {
        lessonNumber: 16,
        title: "Final Project: Full Payment System",
        type: "project",
        hook: "Daraja-certified developers command KSh 150,000–400,000 per integration project. This is the project you show to get that rate.",
        duration_mins: 90,
        isAvailable: false,
        content:
          "Build a complete payment system for Duka Smart — a fictional Kenyan e-commerce platform. The system must include: STK Push checkout with callback handling, C2B payment registration, B2C refund capability, a transaction status dashboard, automated receipts via email and WhatsApp, full audit logging, and error recovery. Submit GitHub repo, live demo, and a 600-word technical architecture document.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 6 — ai-agriculture
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-agriculture",
    title: "AI for Agriculture and Agritech",
    tagline: "Feed the Future with AI-Powered Farming",
    description:
      "Apply AI to crop prediction, supply chain optimization, market pricing, and agricultural data analysis. Skills valued by agritech startups, NGOs, and food tech companies worldwide.",
    level: "Intermediate",
    price_kes: 3000,
    lessons_count: 10,
    badge_name: "Agritech AI Specialist",
    what_you_will_learn: [
      "Apply AI models to crop yield prediction and weather analysis",
      "Build supply chain optimization tools using historical datasets",
      "Analyze agricultural market pricing data to find trends and opportunities",
      "Create AI-powered dashboards for farm management and resource planning",
      "Deploy agritech solutions ready for startups, NGOs, and food companies",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Course Introduction",
        type: "intro" as const,
        hook: "Welcome. Here is everything you need to know before your first lesson.",
        duration_mins: 5,
        isAvailable: true,
        content: "Agriculture employs 40% of Kenya's workforce and contributes 26% of GDP — yet most farms still operate on guesswork. This course applies AI to the problems that matter most in East African agriculture: predicting crop yields, forecasting market prices, reducing post-harvest losses, and building tools that help farmers make better decisions with the data they already have.",
        introWhoFor: [
          "An agritech professional who wants to add AI capabilities to their existing work",
          "A data analyst with an interest in agriculture or food systems in East Africa",
          "A developer who wants to build meaningful tools for the agricultural sector",
          "A graduate in agriculture or environmental science who wants to combine domain knowledge with technology",
        ],
        introOutcomes: [
          "Build a crop yield prediction model using weather and historical farm data",
          "Forecast commodity prices to help farmers decide when to sell",
          "Analyze post-harvest loss data and recommend storage and timing decisions",
          "Design a farm management dashboard for commercial agriculture operations",
          "Deliver a complete AI-powered agritech proposal as your capstone project",
        ],
        introStructure: {
          lessonsCount: 10,
          hours: 5,
          sandboxCount: 4,
          finalProject: "AI-powered smart farm solution for a fictional Kenyan cooperative",
        },
        introFirstTask: "what agricultural problem in East Africa would you most want to solve with AI?",
      },
      {
        lessonNumber: 1,
        title: "AI's Role in Modern Agriculture",
        type: "video",
        hook: "Africa loses 30–40% of its food to post-harvest losses every year. AI-powered supply chain optimization alone could recover billions of shillings in value annually. The people who know how to build those systems will be in extraordinary demand.",
        duration_mins: 10,
        isAvailable: true,
        content:
          "The current state of AI in African agriculture: precision farming, predictive analytics, market intelligence, and supply chain optimization. Which problems AI solves well, where it fails, and why East Africa is a particularly high-opportunity market.",
      },
      {
        lessonNumber: 2,
        title: "Crop Yield Prediction with AI",
        type: "sandbox",
        hook: "A smallholder farmer who knows 8 weeks in advance that their maize yield will be 40% below average can make decisions that save their season. Today that intelligence is available at near-zero cost.",
        duration_mins: 20,
        isAvailable: true,
        content:
          "Using historical yield data, weather data, and soil variables to build crop yield prediction models. Covers feature selection, model selection, and how to communicate predictions to farmers who are not data scientists.",
        sandboxTask:
          "Using a provided dataset of 5-year maize yield records from fictional smallholder farms in Nakuru County (with rainfall, temperature, soil pH, and fertilizer application data), build an AI-assisted yield prediction model. Predict yields for the next season under 3 weather scenarios (normal, drought, above-average rain). Submit your model, predictions, and a one-page farmer-friendly summary.",
      },
      {
        lessonNumber: 3,
        title: "Weather and Climate Data Analysis",
        type: "sandbox",
        hook: "Weather is the single largest variable in agricultural outcomes — and it is also one of the most predictable. The gap between a farmer who knows how to read climate data and one who does not is measured in harvest yields.",
        duration_mins: 20,
        isAvailable: true,
        content:
          "Accessing and analyzing weather data APIs (Open-Meteo, NASA POWER), climate trend analysis for agricultural planning, seasonal pattern identification, and building weather-based planting calendars using AI analysis.",
        sandboxTask:
          "Pull 10 years of historical rainfall and temperature data for a fictional farming region using an open weather API. Use AI analysis to: (1) identify the optimal planting windows for maize and beans, (2) detect any long-term trend in rainfall, (3) build a simple 12-month planting calendar. Submit your analysis code, charts, and the final planting calendar.",
      },
      {
        lessonNumber: 4,
        title: "Agricultural Market Price Forecasting",
        type: "sandbox",
        hook: "Maize prices in Nairobi can vary by 300% across a single year. Farmers who sell at the wrong time lose half their income. AI-powered price forecasting changes that.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Time series forecasting for agricultural commodity prices: collecting price data from AMIS and county market reports, building forecasting models, identifying seasonal price patterns, and communicating price signals to farmers and traders.",
        sandboxTask:
          "Using a provided 3-year dataset of weekly maize prices across 6 Kenyan markets, build a price forecasting model that predicts prices for the next 12 weeks. Identify the best market to sell in during the next month. Submit your model, 12-week price forecast chart, and a one-paragraph market recommendation for farmers.",
      },
      {
        lessonNumber: 5,
        title: "Post-Harvest Loss Reduction with AI",
        type: "sandbox",
        hook: "Post-harvest losses cost Kenyan farmers an estimated KSh 100 billion per year. The majority are preventable with better information — which AI can now provide at very low cost.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "AI applications for post-harvest loss reduction: optimal storage condition prediction, grain quality monitoring, spoilage detection using image analysis, and logistics optimization to reduce transit time and damage.",
        sandboxTask:
          "Analyze a fictional dataset of grain storage outcomes from 200 stores in Western Kenya (storage duration, temperature, humidity, loss percentage, grain type). Use AI to: (1) identify which storage conditions predict losses above 10%, (2) build a simple decision tool that tells a farmer whether to sell now or store longer. Submit analysis and the decision tool.",
      },
      {
        lessonNumber: 6,
        title: "Supply Chain Optimization",
        type: "sandbox",
        hook: "The gap between farm gate prices and supermarket shelf prices is largely logistics inefficiency. AI can map those gaps and eliminate the ones that technology can solve.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Agricultural supply chain analysis: mapping supply chain nodes from farm to consumer, using AI to identify bottlenecks and inefficiencies, route optimization for produce collection, demand forecasting for distributors, and building data collection systems for supply chain monitoring.",
        sandboxTask:
          "Design an AI-powered supply chain optimization analysis for a fictional tomato cooperative in Kirinyaga County (50 farmers, 3 collection points, 2 distributors, 8 supermarket customers in Nairobi). Identify the 3 biggest inefficiencies, quantify the cost of each, and propose AI-powered solutions. Submit your analysis and recommendations.",
      },
      {
        lessonNumber: 7,
        title: "Farm Management Dashboards",
        type: "sandbox",
        hook: "A commercial farm without a data dashboard is flying blind. Modern agritech companies are paying premium salaries for developers who can build them.",
        duration_mins: 25,
        isAvailable: false,
        content:
          "Designing and building farm management dashboards: KPIs for farm operations (yield per acre, input costs, revenue per crop, water usage), data collection from field sensors or manual input, visualization for farm managers, and alert systems for anomalies.",
        sandboxTask:
          "Build a farm management dashboard for Sunflower Acres — a fictional 500-acre mixed-use farm in Laikipia. The dashboard must display: current crop status across 4 fields, year-to-date revenue vs. target, input cost breakdown, yield trends vs. last 3 seasons, and a weather widget showing the next 7 days. Submit the working dashboard and code.",
      },
      {
        lessonNumber: 8,
        title: "Pest and Disease Detection with AI",
        type: "sandbox",
        hook: "The Fall Armyworm devastated East Africa's maize crop across 3 seasons before most farmers could identify it. AI can now detect it from a phone photo in under 3 seconds.",
        duration_mins: 20,
        isAvailable: false,
        content:
          "Using AI image classification for pest and disease detection: integrating pre-trained models into mobile-friendly applications, confidence score interpretation, building a simple field diagnostic tool, and the limitations of image-based AI diagnosis.",
        sandboxTask:
          "Build a simple plant disease detection tool using a pre-trained model (via Google's Teachable Machine or a Hugging Face model). The tool must accept a photo, return the top 3 diagnosis possibilities with confidence scores, and recommend the appropriate action for each. Test with 5 plant disease images. Submit the tool and test results.",
      },
      {
        lessonNumber: 9,
        title: "Quiz: Agritech AI Fundamentals",
        type: "quiz",
        hook: "Prove your readiness for the final project — and for real agritech employer conversations.",
        duration_mins: 15,
        isAvailable: false,
        content:
          "Covering crop yield prediction, market analysis, supply chain optimization, and AI tool selection for agricultural contexts.",
        quizQuestions: [
          {
            question:
              "A farmer wants to predict next season's maize yield. Which variables are most important for an AI prediction model?",
            options: [
              "The farmer's age and years of farming experience only",
              "Rainfall, temperature, soil type, previous yield, and input levels",
              "The current market price of maize and inflation rate",
              "The size of neighboring farms and their crop choices",
            ],
            correctAnswer: 1,
          },
          {
            question:
              "An agritech startup wants to reduce post-harvest losses for smallholder maize farmers. What is the highest-impact AI application?",
            options: [
              "A social media app connecting farmers to each other",
              "A storage condition monitoring and optimal sell-timing recommendation system",
              "An AI model that predicts global commodity prices",
              "A drone that takes aerial photos of fields after harvest",
            ],
            correctAnswer: 1,
          },
          {
            question:
              "A farmer asks whether they should sell their beans now or wait 6 weeks. Which AI approach best answers this question?",
            options: [
              "A natural language model trained on farming advice forums",
              "A time-series price forecasting model trained on historical local market prices",
              "A satellite imagery analysis of bean fields across the country",
              "A crop yield prediction model based on soil data",
            ],
            correctAnswer: 1,
          },
          {
            question:
              "An AI disease detection model says a plant has 'leaf blight' with 62% confidence. What should a farmer do?",
            options: [
              "Immediately apply fungicide for leaf blight and treat it as confirmed",
              "Ignore the diagnosis — 62% is too low to act on",
              "Use the diagnosis as a starting point and consult an extension officer before treating",
              "Take 10 more photos until the model reaches 90% confidence",
            ],
            correctAnswer: 2,
          },
        ],
      },
      {
        lessonNumber: 10,
        title: "Final Project: Smart Farm Solution",
        type: "project",
        hook: "Agritech is one of the fastest-growing sectors for AI employment in East Africa. This project is your proof of domain expertise.",
        duration_mins: 60,
        isAvailable: false,
        content:
          "Design a comprehensive AI-powered solution for Ndege Mbili Co-operative Society — a fictional cooperative of 120 smallholder farmers in Meru County growing coffee, macadamia, and vegetables. Your solution must address: (1) a yield prediction system for the upcoming season, (2) a market timing recommendation tool, (3) a post-harvest loss reduction plan, and (4) a basic farm management dashboard design. Submit a 600-word technical proposal with diagrams, tool recommendations, and an implementation roadmap.",
      },
    ],
  },
];

export function getCourseContentBySlug(slug: string): CourseContent | undefined {
  return courseContent.find((c) => c.slug === slug);
}

export function getLessonByNumber(
  slug: string,
  lessonNumber: number
): Lesson | undefined {
  return getCourseContentBySlug(slug)?.lessons.find(
    (l) => l.lessonNumber === lessonNumber
  );
}
