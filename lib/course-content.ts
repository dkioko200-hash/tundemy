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

export interface CourseCapstone {
  title: string;
  description: string;
  task: string;
  rubric: {
    specificity: { weight: number; description: string };
    businessAccuracy: { weight: number; description: string };
    implementationRealism: { weight: number; description: string };
    ethicsQuality: { weight: number; description: string };
    professionalQuality: { weight: number; description: string };
  };
  passingScore: number;
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
  capstone?: CourseCapstone;
}

export const courseContent: CourseContent[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 1 — ai-foundations
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-foundations",
    title: "AI Foundations",
    tagline: "From Zero to Dangerous in 7 Lessons",
    description:
      "The fastest way to go from zero to productive with AI. Understand how AI works, which tools matter, and how to apply them to real Kenyan business problems — no coding required.",
    level: "Beginner",
    price_kes: 1500,
    lessons_count: 7,
    badge_name: "AI Foundations Certified",
    what_you_will_learn: [
      "Explain how AI works to any employer or colleague in plain language",
      "Identify the highest-value AI opportunities in any Kenyan business",
      "Build AI workflows that save you 2 hours every single working day",
      "Write, research, and analyse at professional standard using AI tools",
      "Design an AI adoption strategy that employers and clients will pay for",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Welcome to AI Foundations",
        type: "intro" as const,
        hook: "In 2023 a Kenyan bank replaced three junior analysts with one person who knew how to use AI. That person now earns more than all three combined. This course is how you become that person.",
        duration_mins: 5,
        isAvailable: true,
        content: "What AI is why it matters in Kenya right now and exactly what you will be able to do by the end of this course.",
        introWhoFor: [
          "A recent graduate who wants to stand out in a competitive job market",
          "A professional who uses computers daily but has never used AI seriously",
          "A business owner who wants to understand what AI could do for their operations",
          "Anyone who wants to future-proof their career in the next 5 years",
        ],
        introOutcomes: [
          "Use AI for any professional task better than someone with 3 years experience who does not use AI",
          "Build AI workflows that save you 2 hours every single working day",
          "Write research and analyse at professional standard using AI tools",
          "Understand exactly what AI can and cannot do so you never make expensive mistakes",
          "Graduate to the Tundemy talent pool with a verified AI credential that employers trust",
        ],
        introStructure: {
          lessonsCount: 7,
          hours: 5,
          sandboxCount: 2,
          finalProject: "AI adoption strategy for a real Kenyan business",
        },
        introFirstTask: "Open ChatGPT or Claude right now. Ask it: what are the 3 biggest opportunities for AI in Kenya in 2025? Screenshot the response. We will revisit this at the end of the course and you will see exactly how your ability to get value from AI has changed.",
      },
      {
        lessonNumber: 1,
        title: "What AI Actually Is",
        type: "video",
        hook: "In 2024 a Nairobi marketing agency replaced 3 content writers with 1 person who knew how to use AI. That person was not a programmer. They were a 24-year-old who spent 2 weeks learning exactly what this lesson teaches.",
        duration_mins: 8,
        isAvailable: true,
        content: "What AI is what it is not and why understanding the difference determines whether you use it well or embarrass yourself professionally.",
        theory: {
          concept: "Artificial intelligence is not a robot not magic and not a replacement for human judgment. It is software that predicts the most statistically likely response to any input trained on billions of examples of human text images and data. When you type a question to Claude or ChatGPT the system does not think. It calculates. It looks at every word you wrote and predicts what word should come next then the next then the next until it has produced a complete response. The reason AI feels intelligent is not because it thinks. It is because it has seen so many examples of human thinking that it has learned to reproduce the patterns of intelligence without possessing intelligence itself.",
          badExample: "Tell me about marketing.",
          badBreakdown: [
            { element: "Role", present: "Not present", problem: "AI has no perspective or expertise to draw from" },
            { element: "Context", present: "Not present", problem: "What business? What problem? What industry? What market?" },
            { element: "Task", present: "Too broad", problem: "Marketing is an entire field not a single task" },
            { element: "Constraints", present: "Not present", problem: "No scope depth audience or length specified" },
            { element: "Format", present: "Not present", problem: "Essay? List? Definition? The AI decides and you get whatever it chooses" },
          ],
          badOutput: "Marketing is the process of promoting products and services to potential customers through various channels including digital media print and in-person events. Effective marketing requires understanding your target audience...",
          goodExample: "I run a small restaurant in Westlands Nairobi. I have KSh 5000 to spend on marketing this week. Give me 3 specific ideas I can execute before Friday each with the exact action to take the estimated cost and what result I should expect.",
          goodBreakdown: [
            { element: "Role", present: "Restaurant owner in Westlands Nairobi", improvement: "AI knows exactly who it is advising and in what local context" },
            { element: "Context", present: "KSh 5000 budget this specific week", improvement: "Real constraints produce real practical recommendations" },
            { element: "Task", present: "3 specific executable ideas only", improvement: "Not a lecture on marketing theory but actual actions" },
            { element: "Constraints", present: "Before Friday specific format required", improvement: "Deadline and format force practical actionable thinking" },
            { element: "Format", present: "Action plus cost plus expected result", improvement: "Output structure specified so it is immediately usable without editing" },
          ],
          goodOutput: "Here are 3 marketing ideas for your Westlands restaurant this week within KSh 5000: 1. WhatsApp Status Campaign (KSh 0) Post a daily special photo at 11am and 5pm every day. Expected result: 15 to 30 percent of your contacts will see it daily generating 3 to 8 new inquiries. 2. Google Business Profile update (KSh 0) Add 5 new food photos today and respond to your last 3 reviews. Expected result: improved visibility in local search within 48 hours. 3. Neighbourhood flyer drop (KSh 2000) Print 200 flyers with a lunch special offer valid this week only. Expected result: 5 to 15 walk-in redemptions.",
          keyInsight: "AI is not a search engine you type questions into. It is a thinking partner that produces output proportional to the quality of your input. The single biggest mistake beginners make is treating AI like Google. Professionals who get extraordinary results treat it like a brilliant colleague who needs a proper briefing before they can help.",
          ruleToRemember: "Clarity in value out. The quality of your AI output is almost entirely determined by the quality of your input. This is the single most important thing to understand about using AI professionally.",
          checkYourUnderstanding: [
            {
              question: "A colleague asked AI to help with their quarterly report and got useless generic advice. What is the most likely cause?",
              options: ["The AI model they used was low quality", "They did not provide enough context constraints or specific task definition", "AI cannot help with professional reports", "They needed a paid subscription to get useful results"],
              correctAnswer: 1,
              explanation: "Generic inputs produce generic outputs every time. The AI gave exactly what it was asked for — nothing specific because nothing specific was provided. The fix is always in the prompt not the model.",
            },
            {
              question: "What is the most accurate description of how Claude and ChatGPT actually work?",
              options: ["They search the internet for the best available answer", "They think through problems logically like a human expert would", "They predict the most likely next word based on patterns learned from billions of examples", "They access a database of pre-written expert answers"],
              correctAnswer: 2,
              explanation: "Language models generate text by predicting the most statistically likely next token based on training data. They do not search think or retrieve — they predict. Understanding this changes how you use them.",
            },
            {
              question: "You are a nurse in a Nairobi clinic. Which prompt will get you the most useful AI response about explaining a medication to a patient?",
              options: ["Tell me about metformin", "Explain metformin to a patient", "I am a nurse in a Nairobi clinic. My patient is a 58-year-old with type 2 diabetes who has never taken metformin before and is worried about side effects. Write a simple explanation I can read to them covering what it does the 2 most common side effects and what to do if they experience them. Keep it under 150 words in plain language.", "What is metformin used for in Kenya"],
              correctAnswer: 2,
              explanation: "The third prompt specifies role patient context specific concerns format and length. Every constraint produces a more targeted and useful output.",
            },
          ],
        },
        quizQuestions: [
          { question: "A friend says AI will replace all workers. What is the most accurate response based on this lesson?", options: ["True AI can already do everything humans can do", "AI replaces tasks not people — those who use AI well gain a massive advantage over those who do not", "False AI is too unreliable to use in professional work", "Only true for low-skill jobs not professional roles"], correctAnswer: 1 },
          { question: "What is the primary reason most people get poor results from AI?", options: ["They are using the wrong AI tool for the task", "They do not have a paid subscription", "Their inputs are vague with no context constraints or specific task definition", "AI does not work well for African business contexts"], correctAnswer: 2 },
          { question: "Which best describes what ChatGPT and Claude actually do when they respond?", options: ["They search the internet and summarise what they find", "They access expert databases to find the correct answer", "They predict the most likely text response based on patterns learned from training data", "They reason through problems step by step like a human expert"], correctAnswer: 2 },
        ],
      },
      {
        lessonNumber: 2,
        title: "How AI Thinks and Why It Gets Things Wrong",
        type: "reading",
        hook: "A lawyer in the US submitted AI-generated court cases to a judge. None of them existed. He nearly lost his licence. The AI did not lie. It did exactly what it was designed to do. This lesson explains why and how to make sure it never happens to you.",
        duration_mins: 6,
        isAvailable: true,
        content: "Tokens hallucination and the verification habit that separates professionals from people who embarrass themselves with AI.",
        readingTopics: [
          "The token prediction system — why AI generates one word at a time",
          "What hallucination is and why it happens by design not by accident",
          "The verification habit that every professional AI user must have",
          "When to trust AI output completely and when to always verify",
          "Why confident tone never means accurate content",
        ],
        theory: {
          concept: "Every word you read from an AI was predicted one token at a time. A token is roughly one word or word fragment. The model looks at everything written before it and asks what is the most statistically likely word to come next. It has no memory between conversations no internet access during generation and critically no ability to detect its own errors. This creates a dangerous situation: AI produces text that sounds authoritative and well-written even when it is completely wrong. This is called hallucination. Not because the AI is confused but because it is doing exactly what it is designed to do — producing the most plausible-sounding text. Plausible and accurate are not the same thing.",
          badExample: "What Kenyan court cases support the argument that an employer must give 30 days notice before termination?",
          badBreakdown: [
            { element: "Verification instruction", present: "Not present", problem: "User assumes AI will only cite cases that actually exist" },
            { element: "Source requirement", present: "Not present", problem: "AI will generate convincing case names and citations that do not exist" },
            { element: "Uncertainty flag", present: "Not present", problem: "AI will not distinguish between what it knows and what it is inventing" },
            { element: "Professional scope", present: "Not stated", problem: "No instruction to limit claims to verifiable principles" },
            { element: "Use context", present: "Not stated", problem: "AI cannot calibrate appropriate caution level without knowing the stakes" },
          ],
          badOutput: "Several cases support this position under Kenyan employment law. In Mwangi v. Nairobi Business Solutions Ltd [2019] eKLR the Employment and Labour Relations Court held that statutory notice requirements are mandatory. Additionally in Omondi v. Kenya Commercial Bank [2021] the court ruled that failure to give adequate notice constitutes wrongful termination...",
          goodExample: "I need to understand the general legal principle around notice periods for termination in Kenya under the Employment Act 2007. Do not cite specific cases — I will verify those independently with a lawyer. Explain the principle only note if there are common exceptions and flag anything you are uncertain about.",
          goodBreakdown: [
            { element: "Scope", present: "Principles only not specific cases", improvement: "Removes the invitation to fabricate citations" },
            { element: "Verification commitment", present: "Explicitly stated", improvement: "User takes responsibility for fact-checking specifics independently" },
            { element: "Uncertainty flag", present: "Explicitly requested", improvement: "AI is instructed to signal when it is less confident" },
            { element: "Legal reference", present: "Specific Act named", improvement: "Grounds response in verifiable legislation" },
            { element: "Professional involvement", present: "Lawyer mentioned", improvement: "AI understands this is background research not final legal advice" },
          ],
          goodOutput: "Under Kenya's Employment Act 2007 the general principle is that notice periods depend on the contract type and duration of employment. For monthly-paid employees the minimum statutory notice is typically 28 days. There are exceptions for summary dismissal in cases of gross misconduct. I should flag that employment law interpretation has evolved through case law that I may not have complete information on — please verify specific applications with an employment lawyer or the Ministry of Labour.",
          keyInsight: "AI hallucination is not a bug — it is the model working exactly as designed. The model is optimised to produce fluent plausible text not verified facts. Use AI for structure drafting brainstorming and speed. Verify anything that will be relied upon professionally.",
          ruleToRemember: "Never publish AI-generated statistics case citations names or specific facts without independent verification. AI drafts. You verify. Always.",
          checkYourUnderstanding: [
            {
              question: "Why does AI produce hallucinations even when given a clear and specific question?",
              options: ["The model has a poor internet connection during generation", "The model predicts statistically likely text rather than retrieving verified facts — when it lacks reliable training data it generates plausible-sounding content", "The user did not phrase the question correctly", "Hallucination only happens with free AI accounts"],
              correctAnswer: 1,
              explanation: "Hallucination is structural — it is how language models work. They generate the most likely next token. When they lack good training data on a topic they generate plausible-sounding but potentially false content. This cannot be fully prevented only managed.",
            },
            {
              question: "You use AI to draft a client proposal and it includes the statistic: Kenya e-commerce market grew by 340% in 2023. What should you do before sending the proposal?",
              options: ["Nothing — AI is trained on accurate data", "Change the number slightly so it does not look AI-generated", "Verify the statistic independently from a reliable source such as KNBS before including it", "Ask AI to confirm the statistic is correct"],
              correctAnswer: 2,
              explanation: "AI-generated statistics must always be verified independently. Asking AI to confirm its own output is not verification — it will confidently reaffirm a figure it invented.",
            },
            {
              question: "What is the safest way to use AI for legal medical or financial research?",
              options: ["Trust AI completely — it is trained on expert professional content", "Never use AI for any professional topics at all", "Use AI to understand concepts and principles then verify specific facts citations and professional advice with qualified experts", "Only use AI for this if you have a paid enterprise subscription"],
              correctAnswer: 2,
              explanation: "AI is highly reliable for explaining concepts and producing first drafts. Specific facts citations and professional judgments must always be verified by qualified professionals.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is AI hallucination?", options: ["When AI refuses to answer a sensitive question", "When AI generates fluent confident text that is factually incorrect", "When AI gives slightly different answers to the same question", "When AI takes too long to generate a response"], correctAnswer: 1 },
          { question: "You ask AI to fact-check a claim and it says the claim is correct. Is this reliable verification?", options: ["Yes AI is trained on accurate information", "No — AI will confidently confirm its own hallucinations because it cannot detect its own errors", "Yes if you are using a paid AI service", "Only if the AI provides a source citation"], correctAnswer: 1 },
          { question: "A doctor wants AI help writing patient education materials about malaria treatment in Kenya. What is the correct approach?", options: ["Do not use AI for medical content at all", "Use AI to draft the materials then have a qualified clinician verify all medical information before distribution", "Trust AI completely since it is trained on medical literature", "Only use AI for formatting and layout not for medical content"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 3,
        title: "Your First Professional AI Workflow",
        type: "sandbox",
        hook: "The people who get the most from AI are not the ones with the best individual prompts. They are the ones with the best systems. A workflow is a system. A system produces consistent results. This lesson is where you build your first one.",
        duration_mins: 10,
        isAvailable: true,
        content: "Build a complete reusable AI workflow using the three-part structure that professional AI practitioners use every single day.",
        sandboxTask: "You work for or run a business in Kenya — use your actual industry or one that interests you most. Build a complete AI workflow for ONE of these tasks: responding professionally to customer complaints, writing a weekly progress report for your manager, or summarising long documents into a one-page brief for busy executives. Your workflow must include all three components with full detail: SYSTEM CONTEXT — who the AI is what organisation it works for what constraints it operates under and what tone it must maintain. USER INPUT TEMPLATE — the exact template someone fills in each time they use this workflow with placeholder fields for variable information. OUTPUT FORMAT — exactly how the response should be structured including all sections headings length limits and format type. After defining the workflow test it with a real example — show the actual input you used and honestly evaluate whether the output was professional enough to use without editing.",
        quizQuestions: [
          { question: "What makes a workflow more valuable than a one-off prompt?", options: ["It uses more advanced AI model features", "It is reusable — the same structure produces consistent quality across different inputs without redesigning from scratch each time", "It always produces longer more detailed responses", "It works without requiring an internet connection"], correctAnswer: 1 },
          { question: "Which component of a workflow is most commonly missing from beginner prompts?", options: ["The task description of what to do", "The system context — who the AI is and what constraints it operates under", "The actual user input content", "The word count or length specification"], correctAnswer: 1 },
          { question: "A colleague gets inconsistent AI outputs — sometimes excellent sometimes generic from the same task. What is the most likely fix?", options: ["Switch to a more expensive premium AI model", "Add a clear output format specification so the AI cannot decide its own structure", "Use shorter simpler prompts", "Only use AI for simple straightforward tasks"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 4,
        title: "AI for Writing and Communication",
        type: "video",
        hook: "A sales manager at a Nairobi distributor was spending 3 hours per day writing emails reports and proposals. After building one AI workflow she now spends 40 minutes on the same work. The extra 2 hours and 20 minutes go to things that actually require her judgment.",
        duration_mins: 8,
        isAvailable: true,
        content: "How to use AI for professional writing tasks — emails reports proposals and content — without losing your voice or your professional accountability.",
        theory: {
          concept: "AI does not replace your communication judgment. It eliminates the friction between your thinking and the finished document. The professional model is this: you own the thinking — the key points the audience the objective the tone. AI owns the typing — the draft the structure the language. You review edit and approve. The output reflects your judgment at a fraction of the time cost. This is not cheating. It is the same as using a calculator instead of doing arithmetic by hand. The intelligence is still yours.",
          badExample: "Write me a professional email.",
          badBreakdown: [
            { element: "Recipient", present: "Not specified", problem: "AI does not know who you are writing to or your relationship with them" },
            { element: "Purpose", present: "Not specified", problem: "What should this email actually achieve?" },
            { element: "Tone", present: "Only implied by the word professional", problem: "Professional ranges from formal legal letter to casual internal Slack message" },
            { element: "Required action", present: "Not specified", problem: "What should the recipient do after reading this?" },
            { element: "Key information", present: "Not provided", problem: "AI will invent plausible but irrelevant filler content" },
          ],
          badOutput: "Dear Sir/Madam I hope this email finds you well. I am writing to bring to your attention a matter of considerable importance that requires your urgent attention at your earliest convenience. Please do not hesitate to contact me should you require any further information.",
          goodExample: "Write an email to James Mwangi our logistics supplier at Safara Ltd. We agreed 15 January delivery but the goods have not arrived and today is 22 January. I need a status update and a new confirmed delivery date. Tone: firm but professional — I want to preserve the relationship but make clear this delay is causing operational problems. End with a deadline for his response of 48 hours. Maximum 150 words.",
          goodBreakdown: [
            { element: "Recipient", present: "Named with role and company", improvement: "AI calibrates the appropriate relationship register for this specific person" },
            { element: "Situation", present: "Specific dates and concrete facts", improvement: "AI has real content to work with rather than invented filler" },
            { element: "Tone", present: "Firm but relationship-preserving specifically", improvement: "Eliminates ambiguity about register — not aggressive not passive" },
            { element: "Required action", present: "Update plus confirmed date within 48 hours", improvement: "Clear call to action built into the email itself" },
            { element: "Length", present: "Maximum 150 words hard limit", improvement: "Prevents padding and respects the recipient's time" },
          ],
          goodOutput: "Dear James I hope you are well. I am following up on our delivery scheduled for 15 January which we have not yet received. This delay is creating operational challenges for our team and I would appreciate an urgent update on the current status along with a confirmed new delivery date. To keep our planning on track could you please respond within 48 hours? I look forward to resolving this quickly and continuing our strong partnership. Best regards",
          keyInsight: "The professional model for AI writing: you think AI types you approve. Every minute you spend specifying context saves five minutes of editing a generic draft. The more specific your briefing the less editing you do afterwards.",
          ruleToRemember: "Always review AI-drafted communications before sending. AI cannot verify your specific facts your relationship history or the organisational context that only you hold.",
          checkYourUnderstanding: [
            {
              question: "A colleague asks you to help them use AI to write a business proposal. They show you the prompt: Write a business proposal. What is the single most important thing to add first?",
              options: ["Specify the font and document formatting", "Add the specific client their problem the proposed solution budget range and timeline", "Tell AI to be more professional and formal", "Specify the exact word count needed"],
              correctAnswer: 1,
              explanation: "Context is everything. Without the specific client problem and solution AI produces a generic template that requires as much work as writing from scratch. Add all the specific details first.",
            },
            {
              question: "What is content repurposing in an AI communication workflow?",
              options: ["Copying content from other websites and rewriting it", "Using AI to transform one source document into multiple formats — a report becomes a WhatsApp summary an email and a formal document", "Reusing old emails with updated dates and names", "Translating English content into Swahili"],
              correctAnswer: 1,
              explanation: "Content repurposing is one of the highest-value AI communication workflows. One meeting notes document produces a WhatsApp update an email to management and a full report — in minutes rather than hours.",
            },
            {
              question: "After AI drafts an important client email what is the non-negotiable step before sending?",
              options: ["Run it through a separate spell-checking tool", "Ask AI to review and improve its own draft", "Review it yourself for accuracy tone and anything only you can verify about this specific situation", "Post it on social media first to test audience response"],
              correctAnswer: 2,
              explanation: "You own the output. AI cannot verify your specific facts your relationship history with this person or whether the tone is right for this specific situation on this specific day.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is the correct professional model for AI-assisted writing?", options: ["Let AI write everything and publish without any review", "You provide the thinking and judgment AI provides the draft you review and approve", "Use AI only for editing and proofreading never for initial drafting", "Alternate between writing manually and using AI for different sections"], correctAnswer: 1 },
          { question: "A proposal AI drafted says the project will take 6 weeks but you told the client 4 weeks. The client complains. Who is professionally responsible?", options: ["The AI company who built the tool", "You — the professional who sent the proposal without verifying the content", "The client for not reading the proposal carefully", "Shared equally between you and the AI provider"], correctAnswer: 1 },
          { question: "What is the fastest way to produce a WhatsApp message an email and a formal report from the same meeting notes?", options: ["Write each one manually in sequence", "Use AI content repurposing — one source input three format instructions in a single prompt", "Hire a communications assistant to handle different formats", "Use three different AI tools one for each format"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 5,
        title: "Research and Analysis with AI",
        type: "reading",
        hook: "A management consultant at a Nairobi firm used to spend 6 hours preparing competitor research for a client pitch. After building one AI research workflow she now does the same quality work in 45 minutes. The client cannot tell the difference. Her profitability certainly can.",
        duration_mins: 7,
        isAvailable: true,
        content: "How to use AI to read summarise compare and extract insight from documents faster and more systematically than any manual process.",
        readingTopics: [
          "The four AI research patterns that save the most professional time",
          "Structured document summarisation — specifying exactly what you need",
          "Comparative analysis across multiple sources simultaneously",
          "The source-grounded analysis technique that reduces hallucination risk",
          "The two verification rules you must never skip regardless of deadline pressure",
        ],
        theory: {
          concept: "AI compresses research and analysis work by 60 to 80 percent when used correctly. The critical phrase is when used correctly. Vague analytical prompts produce generic summaries that take as long to read as the original document. Structured analytical prompts with a specified audience focus and format produce targeted outputs you can use in 5 minutes. The entire difference is in how you specify what you need.",
          badExample: "Summarise this report for me.",
          badBreakdown: [
            { element: "Structure", present: "Not specified", problem: "AI invents its own summary structure which may miss everything that actually matters to you" },
            { element: "Audience", present: "Not specified", problem: "An executive summary and a technical summary are completely different documents requiring different content" },
            { element: "Focus", present: "Not specified", problem: "AI highlights what it calculates as most significant which may not be relevant to your specific decision" },
            { element: "Length", present: "Not specified", problem: "Could be 2 sentences or 2 pages — AI decides" },
            { element: "Action orientation", present: "Missing entirely", problem: "A summary with no recommended action is just reading with an extra step" },
          ],
          badOutput: "This report discusses the performance of the organisation over the past year. Key themes include revenue growth operational challenges and strategic initiatives for the coming period. The report highlights several areas of success as well as opportunities for improvement going forward.",
          goodExample: "Summarise the following report for a CFO who has 90 seconds to read it before a board meeting. Use exactly this structure: (1) Bottom line in one sentence — what happened and is it good or bad, (2) Three key numbers with context — not just the figures but what they mean for the business, (3) The single biggest risk identified in the report, (4) The one decision the board needs to make today. Maximum 200 words. Do not use filler phrases like it is worth noting or it is important to highlight.",
          goodBreakdown: [
            { element: "Audience", present: "CFO with 90 seconds before board meeting", improvement: "Calibrates every word for someone who is time-pressured and senior — no padding allowed" },
            { element: "Structure", present: "4-part explicit numbered format", improvement: "AI follows your structure exactly not the structure it would invent" },
            { element: "Numbers requirement", present: "Three figures with business context", improvement: "Forces AI to find actual data and explain what it means not just quote numbers" },
            { element: "Length", present: "200 words maximum hard limit", improvement: "Hard constraint prevents any padding or hedging language" },
            { element: "Action orientation", present: "One board decision required", improvement: "Forces a conclusion not just a description — the CFO knows what they need to decide" },
          ],
          goodOutput: "Bottom line: Revenue grew 18% year-on-year but operating costs grew 31% — profitable growth is under pressure and margins are compressing. Key numbers: (1) Revenue KSh 2.3B up from KSh 1.95B driven by digital channel now at 44% of sales up from 29%; (2) Staff costs KSh 680M up 31% from headcount growing 340 to 447; (3) Net margin compressed from 18% to 12% — three points below target. Biggest risk: Northern region compliance gap flagged by auditors with potential regulatory action if unresolved before Q2. Board decision needed: Approve the operating cost reduction programme in the CFO memo attached or refer back for revision with specific objections.",
          keyInsight: "The quality of analytical AI output is determined almost entirely by the quality of the analytical question you ask. A better analyst asks better questions. AI just answers faster. Investing 3 minutes in a precise analytical prompt saves 45 minutes of editing a generic response.",
          ruleToRemember: "Always verify key figures dates and names against the original source document. AI can misread numbers even when you paste the source document directly into the prompt.",
          checkYourUnderstanding: [
            {
              question: "You paste a Kenyan company financial report into AI and ask for the revenue growth figure. AI says 34%. The actual figure in the report is 3.4%. What happened?",
              options: ["The AI model has a mathematical calculation error", "AI misread the figure — a form of hallucination that occurs even with provided source material", "You copied the wrong section of the report", "The report used a non-standard number format that AI cannot read"],
              correctAnswer: 1,
              explanation: "AI can misread figures in source documents especially percentages and decimal numbers. This is why verifying key numbers against the original is non-negotiable — especially in financial and legal contexts.",
            },
            {
              question: "What is source-grounded analysis?",
              options: ["Analysis that only cites peer-reviewed academic journal sources", "Instructing AI to base its analysis only on the specific documents you provide rather than general training data", "Analysis conducted by a human researcher rather than AI tools", "Using AI to search the internet to find the best sources for your topic"],
              correctAnswer: 1,
              explanation: "Source-grounded analysis constrains AI to your provided materials — reducing but not eliminating hallucination risk. You still need to verify key claims against the originals.",
            },
            {
              question: "What produces the single biggest improvement in the quality of AI analytical output?",
              options: ["Switching to a more expensive premium AI model", "Explicitly specifying the analytical structure audience focus and output format before providing the content", "Asking the same analytical question multiple times and comparing the answers", "Making the prompt shorter and simpler to avoid confusing the AI"],
              correctAnswer: 1,
              explanation: "Structure audience and format specification is the highest-leverage change you can make to any analytical prompt. This single change typically doubles the usefulness of the output.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is the most important specification to include in a document summarisation prompt?", options: ["The name of the document author", "The specific audience structure focus and maximum word length", "The date the document was originally written", "The file format the document is saved in"], correctAnswer: 1 },
          { question: "Why must you verify AI-extracted figures even when you gave AI the actual source document?", options: ["AI ignores source documents and uses its training data instead", "AI can misread numbers even from provided source material — especially percentages and decimals", "AI always rounds all figures to the nearest whole number", "AI only processes the first page of any document you provide"], correctAnswer: 1 },
          { question: "A junior analyst says AI research takes them longer than doing it manually. What is the most likely cause?", options: ["AI is fundamentally unsuitable for research and analysis tasks", "They are using vague unstructured prompts that produce generic output requiring extensive editing", "They need a faster computer with more processing power", "They should switch to a different AI tool entirely"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 6,
        title: "AI Ethics and Your Professional Responsibility",
        type: "quiz",
        hook: "An AI hiring tool used by a major company rejected 76% of qualified female candidates for technical roles. The company did not programme discrimination. The training data did. Someone built that system. Someone deployed it. Someone is responsible. This lesson is about making sure that someone is never you.",
        duration_mins: 6,
        isAvailable: true,
        content: "Bias accountability privacy and the professional standards every AI practitioner must understand before deploying AI in any professional context.",
        quizQuestions: [
          { question: "Where does AI bias most commonly originate?", options: ["Deliberate programming by developers who want to discriminate", "Historical training data that reflects real-world inequalities and past discrimination", "Random mathematical errors in the model architecture", "Interference from external data sources during the training process"], correctAnswer: 1 },
          { question: "An AI screening tool systematically scores job candidates from certain Kenyan counties lower despite equivalent qualifications and experience. This is best described as:", options: ["A technical malfunction that needs a software update to fix", "AI bias — a discriminatory pattern arising from biased historical hiring data used in training", "Correct behaviour if historical data shows lower success rates from those counties", "User error — the HR team should have excluded county location data from the inputs"], correctAnswer: 1 },
          { question: "A lawyer uses AI to draft a contract clause. The clause contains a legal error that costs the client KSh 2 million in a dispute. Who bears professional responsibility?", options: ["The AI company that built and sold the tool", "The lawyer — they signed off on the document and are professionally responsible for all content in it", "The client for not reviewing the contract independently before signing", "Shared equally between the lawyer and the AI company"], correctAnswer: 1 },
          { question: "What is the specific data privacy risk of pasting client information into a commercial AI tool like ChatGPT?", options: ["The data may be incorrectly encrypted while in transit to the server", "The client will receive an automatic notification that their data was processed", "The data leaves your organisation and is processed by a third party under their own data retention and usage policies", "The AI will automatically refuse to process any personal information"], correctAnswer: 2 },
          { question: "Why does using AI at scale increase the importance of professional oversight rather than reducing it?", options: ["AI tools are expensive so any errors become proportionally more costly", "AI scales output — a flawed AI-powered decision made 10000 times creates systemic harm that individual human error could never produce at that scale", "Professional certification bodies now require additional AI-specific qualifications", "AI tools are fundamentally less reliable than human judgment in all professional contexts"], correctAnswer: 1 },
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
    capstone: {
      title: "AI Adoption Strategy for a Kenyan Business",
      description: "You are an AI consultant hired by a Kenyan business. Your job is to produce a professional AI adoption strategy document that the leadership team can act on immediately.",
      task: "Choose a specific real type of Kenyan business — logistics healthcare retail agriculture banking education or hospitality. Produce a complete AI adoption strategy document with these five sections: (1) Executive Summary — three sentences covering what AI can do for this business the biggest single opportunity and the recommended first step. (2) Current State Assessment — which tasks in this business consume the most time and are most repetitive and therefore most suitable for AI. (3) Three AI Opportunities — for each opportunity provide the specific task the specific AI tool to use the expected time saving per week the implementation difficulty rated easy medium or hard and the estimated monthly value in KSh. (4) Implementation Roadmap — a 90-day plan with specific actions in Week 1 Month 1 and Month 3. (5) Risk and Ethics Assessment — two specific risks of AI adoption for this type of business and how to mitigate each one. The document must be specific enough that the CEO of that business could read it on Monday morning and start implementing.",
      rubric: {
        specificity: { weight: 25, description: "How specific and actionable the recommendations are — generic advice scores 0 to 10 specific named tools with realistic KSh values scores 20 to 25" },
        businessAccuracy: { weight: 25, description: "How accurately the document reflects how that type of business actually operates in Kenya including realistic constraints and opportunities" },
        implementationRealism: { weight: 20, description: "Whether the 90-day roadmap is actually achievable for a Kenyan business of that type given real resource and infrastructure constraints" },
        ethicsQuality: { weight: 15, description: "How thoughtfully the risks are identified and how practical and specific the mitigations are" },
        professionalQuality: { weight: 15, description: "Whether this document could be handed to a real Kenyan CEO without embarrassment — professional language clear structure no filler" },
      },
      passingScore: 70,
    },
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
        title: "Why Most People Use AI Wrong",
        type: "intro" as const,
        hook: "Two people. Same AI tool. Same subscription. One produces work that gets them promoted. The other produces work their manager edits for an hour before it is usable. The difference is not the tool. It is the system.",
        duration_mins: 5,
        isAvailable: true,
        content: "What prompt engineering actually is why it matters and exactly what you will be able to do consistently by the end of this course.",
        introWhoFor: [
          "Anyone who uses AI tools regularly but gets inconsistent results",
          "A professional who wants to produce expert-level AI output for any task",
          "Someone who completed AI Foundations and wants to go deeper",
          "Anyone who wants to be the most effective AI user in any room they walk into",
        ],
        introOutcomes: [
          "Write prompts that produce professional-grade output every single time",
          "Diagnose exactly why any prompt is failing and fix it systematically",
          "Build a personal prompt library that makes you permanently more productive",
          "Use few-shot and chain-of-thought techniques that most users never learn",
          "Get hired specifically for prompt engineering skills that are in high demand",
        ],
        introStructure: {
          lessonsCount: 8,
          hours: 6,
          sandboxCount: 2,
          finalProject: "Complete professional prompt library for a specific job role",
        },
        introFirstTask: "Take the last 3 things you asked an AI to help with. Write them down exactly as you typed them. By lesson 4 you will be able to look back at those prompts and immediately see exactly what was wrong with each one.",
      },
      {
        lessonNumber: 1,
        title: "The Anatomy of a Professional Prompt",
        type: "video",
        hook: "A procurement officer at a Nairobi manufacturing company was spending 3 hours per day processing supplier quotes into comparison reports. One prompt template reduced that to 20 minutes. She did not learn to code. She learned the four components every professional prompt must have.",
        duration_mins: 8,
        isAvailable: true,
        content: "The four-component structure that every effective professional prompt must contain and why missing even one component degrades the output.",
        theory: {
          concept: "Every effective prompt has exactly four components. Role — who the AI is for this task and what expertise it brings. Task — the specific single action you want completed. Context — the background information the AI needs to do this task well. Output format — exactly how the response should be structured. Most beginners include only the task. Professionals include all four. The difference in output quality is not marginal. It is the difference between a response you can use immediately and one you spend 30 minutes editing into something usable.",
          badExample: "Help me write a job description.",
          badBreakdown: [
            { element: "Role", present: "Not defined", problem: "AI defaults to a generic helpful assistant voice rather than an HR professional with domain knowledge" },
            { element: "Task", present: "Vague — write a job description is not a specific task", problem: "For which role? At what level? In which industry? AI must guess all of these" },
            { element: "Context", present: "Completely absent", problem: "AI does not know the company the role the team the required skills or the seniority level" },
            { element: "Output format", present: "Not specified", problem: "AI invents its own structure which may not match your company template at all" },
          ],
          badOutput: "Job Title: [Position Name]. Department: [Department]. Reports to: [Manager Title]. Job Summary: We are looking for a talented and motivated individual to join our dynamic team. The successful candidate will be responsible for various duties and responsibilities...",
          goodExample: "You are a senior HR manager at a Nairobi technology company with 200 employees. Write a job description for a mid-level Data Analyst role. The role sits in the finance team reports to the CFO and requires 3 years experience with Excel SQL and data visualisation tools. The company uses Google Workspace and Tableau. Format: job title then 3-sentence summary then requirements as a bulleted list of maximum 8 items then what we offer as 4 bullet points. Total length under 350 words. Tone: professional but human — not corporate filler language.",
          goodBreakdown: [
            { element: "Role", present: "Senior HR manager at Nairobi tech company", improvement: "AI brings domain-specific knowledge of Kenyan tech hiring norms and appropriate language" },
            { element: "Task", present: "Specific role level team and reporting line", improvement: "Every dimension of the position is specified — no guessing required" },
            { element: "Context", present: "Tools used team size company systems", improvement: "AI can write requirements that match the actual job rather than generic requirements" },
            { element: "Output format", present: "Exact sections word limit and tone specified", improvement: "Output is ready to paste into your ATS without restructuring" },
          ],
          goodOutput: "Data Analyst — Finance Team. We are looking for a detail-oriented Data Analyst to join our Finance team in Nairobi reporting directly to the CFO. You will transform complex financial and operational data into clear insights that drive business decisions across our 200-person technology company. Requirements: 3+ years experience in data analysis, Advanced Excel and SQL skills, Proficiency in Tableau or similar visualisation tools, Experience with Google Workspace, Strong written communication for presenting insights to non-technical stakeholders, Bachelor degree in a quantitative field, Experience in the technology or fintech sector preferred, Kenyan work authorisation required. What we offer: Competitive salary benchmarked to Nairobi tech market, Flexible working arrangements, Medical cover for you and your family, Clear growth path to Senior Analyst within 18 months.",
          keyInsight: "The four components are not a checklist — they are a quality filter. Every time an AI response misses the mark the diagnosis is almost always a missing or weak component. Learn to diagnose which component failed and you can fix any prompt in 60 seconds.",
          ruleToRemember: "Role plus task plus context plus output format. All four every time. Missing any one of them is where the mediocre output comes from.",
          checkYourUnderstanding: [
            {
              question: "A colleague gets AI to write a report but the format is completely wrong — paragraphs when they needed bullet points and a table. Which component was missing?",
              options: [
                "The role — they did not tell AI who it was",
                "The output format — they did not specify the required structure sections and format type",
                "The task — the task description was too vague",
                "The context — AI did not have enough background information",
              ],
              correctAnswer: 1,
              explanation: "Format problems are almost always caused by a missing output format component. When you do not specify structure AI invents its own which will not match your needs.",
            },
            {
              question: "You ask AI to analyse a business proposal and it gives a generic analysis that could apply to any company. Which component is most likely missing or weak?",
              options: [
                "The role — you should have specified what type of analyst the AI should be",
                "The context — AI did not have specific information about the company industry or what the analysis is for",
                "The output format — you should have specified bullet points vs paragraphs",
                "The task — analyse is too vague a verb",
              ],
              correctAnswer: 1,
              explanation: "Generic outputs that could apply to anything are almost always caused by missing context. The AI has no specific information to draw from so it produces the most average possible analysis.",
            },
            {
              question: "What is the fastest way to improve a prompt that is producing mediocre output?",
              options: [
                "Make the prompt longer with more words overall",
                "Identify which of the four components is missing or weakest and strengthen only that one",
                "Switch to a different and more expensive AI model",
                "Break it into multiple shorter prompts",
              ],
              correctAnswer: 1,
              explanation: "Systematic diagnosis is always faster than rewriting from scratch. Identify which component failed — role task context or output format — change only that component and test again.",
            },
          ],
        },
        quizQuestions: [
          {
            question: "What are the four components of a professional prompt?",
            options: [
              "Question answer example and format",
              "Role task context and output format",
              "Subject verb object and length",
              "System user assistant and output",
            ],
            correctAnswer: 1,
          },
          {
            question: "A prompt produces output that sounds like it was written for a different industry entirely. Which component most likely failed?",
            options: [
              "Output format",
              "Task description",
              "Context — AI lacked specific information about your industry and situation",
              "Role — AI was not given a relevant expertise to draw from",
            ],
            correctAnswer: 2,
          },
          {
            question: "You have a prompt that is not working. What is the professional diagnostic approach?",
            options: [
              "Rewrite the entire prompt from scratch",
              "Identify which of the four components is missing or weakest change only that and test again",
              "Ask AI to improve its own response",
              "Make the prompt shorter and more direct",
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        lessonNumber: 2,
        title: "Context and Role — The Two Highest-Leverage Elements",
        type: "reading",
        hook: "The same task briefed two different ways to the same AI model produces outputs so different they look like they came from different tools. The only variable is context and role. This lesson shows you exactly how to use both.",
        duration_mins: 6,
        isAvailable: true,
        content: "How role calibrates vocabulary expertise and perspective and how context eliminates the assumptions that produce generic useless output.",
        readingTopics: [
          "Why role is the highest-leverage component in any prompt",
          "How to write a role that actually changes the output quality",
          "What context does that task description alone cannot",
          "The assumption problem — why AI always fills gaps with the average",
          "How to think about context before you type a single word",
        ],
        theory: {
          concept: "Role and context work together to eliminate the two biggest sources of poor AI output. Role eliminates expertise ambiguity — it tells AI exactly what knowledge base vocabulary and perspective to draw from. Context eliminates situation ambiguity — it tells AI the specific circumstances constraints and objectives that make this task different from the generic version. Without role AI defaults to a generic helpful assistant. Without context AI fills every gap with the most statistically average assumption. Both defaults produce mediocre output.",
          badExample: "Write a financial analysis of this company.",
          badBreakdown: [
            { element: "Role specificity", present: "None — no analyst type or seniority", problem: "Generic analyst voice with no specific expertise calibration" },
            { element: "Analysis purpose", present: "Missing entirely", problem: "Investment analysis credit analysis operational analysis and acquisition analysis are completely different documents" },
            { element: "Audience", present: "Not specified", problem: "Analysis for a board differs from analysis for a bank differs from analysis for an investor" },
            { element: "Company context", present: "Just this company with no details", problem: "AI knows nothing specific about the company industry or market position" },
            { element: "Decision context", present: "Absent", problem: "AI cannot calibrate what matters without knowing what decision this analysis will inform" },
          ],
          badOutput: "Financial Analysis Report. This company demonstrates several key financial characteristics worth noting. Revenue trends show a pattern consistent with the industry average. The balance sheet reflects standard obligations typical of companies at this stage of development...",
          goodExample: "You are a senior credit analyst at Equity Bank Kenya with 10 years experience evaluating SME loan applications. Analyse the following financial statements for a logistics company based in Mombasa that is applying for a KSh 15 million working capital facility. Focus on: liquidity ratios and whether they meet our minimum 1.2 current ratio requirement, cash flow consistency over the 3-year period, and any red flags that would require escalation to the credit committee. Write your analysis in the format used for Equity Bank credit memos: executive recommendation first then supporting analysis then conditions if applicable.",
          goodBreakdown: [
            { element: "Role", present: "Senior credit analyst at Equity Bank Kenya with 10 years SME experience", improvement: "AI draws on Kenyan banking norms Equity Bank standards and SME-specific credit knowledge" },
            { element: "Purpose", present: "KSh 15 million working capital facility application", improvement: "Every aspect of the analysis is calibrated to the specific loan decision" },
            { element: "Specific criteria", present: "1.2 current ratio minimum named explicitly", improvement: "AI knows exactly what passes and what fails — no generic ratios" },
            { element: "Decision context", present: "Credit committee escalation threshold specified", improvement: "AI knows the organisational stakes and structures output accordingly" },
            { element: "Output format", present: "Equity Bank credit memo format specified", improvement: "Output matches the actual document that will be used" },
          ],
          goodOutput: "Credit Recommendation: Conditional Approval subject to additional collateral documentation. The applicant demonstrates adequate liquidity at a current ratio of 1.34 meeting our minimum threshold. Cash flow from operations shows consistent positive generation over 3 years averaging KSh 2.1M annually providing 1.68x coverage of the proposed annual debt service. Red flag requiring committee note: accounts receivable days have increased from 42 to 67 days over the period suggesting potential collection challenges that should be addressed in the loan conditions...",
          keyInsight: "Before writing any prompt ask yourself two questions. First: what specific expert would produce the best response to this task? Make that your role. Second: what does that expert need to know about my specific situation that they could not know by default? Make that your context.",
          ruleToRemember: "Role sets the expertise level. Context sets the situation. Together they eliminate the two biggest sources of generic output. Neither works without the other.",
          checkYourUnderstanding: [
            {
              question: "You ask AI to write a marketing strategy and specify the role as marketing expert. The output is still generic. What is most likely missing?",
              options: [
                "The role needs to be more senior — try chief marketing officer instead",
                "The context — AI does not know your specific product target customer budget or market position",
                "The output format needs to be specified as a bulleted list",
                "You need to ask for a longer more detailed response",
              ],
              correctAnswer: 1,
              explanation: "Role without context still produces generic output. The role tells AI what expertise to draw from but context tells it what specific situation to apply that expertise to.",
            },
            {
              question: "What does AI do when you provide a task but leave out important context?",
              options: [
                "It asks you clarifying questions before responding",
                "It fills every gap with the most statistically average assumption producing generic output",
                "It refuses to respond until you provide more information",
                "It searches the internet for relevant context automatically",
              ],
              correctAnswer: 1,
              explanation: "AI never asks for clarification — it resolves every ambiguity by defaulting to the most probable assumption from training data. This is why missing context produces generic output.",
            },
            {
              question: "Which role instruction will produce the most useful output for a Kenyan startup pitch deck?",
              options: [
                "You are a business expert",
                "You are a startup advisor",
                "You are a venture capital analyst at a Nairobi-based fund that focuses on East African B2B technology startups with ticket sizes between $250k and $1M",
                "You are an experienced professional in the startup industry",
              ],
              correctAnswer: 2,
              explanation: "Specificity in role instructions directly determines output quality. Geographic focus investment stage and ticket size all calibrate the analysis to the exact context you need.",
            },
          ],
        },
        quizQuestions: [
          {
            question: "What is the primary function of the role component in a prompt?",
            options: [
              "To make the AI respond more quickly",
              "To calibrate the expertise vocabulary and perspective the AI draws from",
              "To specify how long the response should be",
              "To tell the AI which language to respond in",
            ],
            correctAnswer: 1,
          },
          {
            question: "You get a generic AI response that could apply to any company in any industry. What should you add to your prompt?",
            options: [
              "A more detailed output format specification",
              "Specific context about your company industry market position and the specific decision this analysis will inform",
              "A more senior role like CEO or director",
              "A request for the AI to be more specific",
            ],
            correctAnswer: 1,
          },
          {
            question: "What does AI do when you leave out important context from your prompt?",
            options: [
              "It asks you a clarifying question",
              "It fills every gap with the most statistically average assumption from its training data",
              "It produces a shorter response to indicate uncertainty",
              "It searches the internet for the missing information",
            ],
            correctAnswer: 1,
          },
        ],
      },
      {
        lessonNumber: 3,
        title: "Output Formatting — Getting Exactly What You Need",
        type: "video",
        hook: "A financial analyst spent 45 minutes reformatting an AI-generated report before it was usable. She had not specified the output format. After adding one format specification to her prompt she never reformatted an AI output again.",
        duration_mins: 8,
        isAvailable: true,
        content: "The five output formats professionals use and exactly how to specify each one so the response is immediately usable without any restructuring.",
        theory: {
          concept: "Output format specification is the most consistently underused component of professional prompts. When you do not specify format AI makes its own structural decisions — which may produce paragraphs when you needed a table or bullets when you needed prose. Specifying format does not constrain the AI's thinking. It channels the AI's output into the shape that is immediately useful to you without editing. There are five formats professionals use regularly and each has a specific use case.",
          badExample: "Analyse the pros and cons of moving our operations from Nairobi to Mombasa.",
          badBreakdown: [
            { element: "Format type", present: "Not specified", problem: "AI will choose prose paragraphs when a structured comparison table would be more useful" },
            { element: "Comparison dimensions", present: "Not specified", problem: "AI decides which dimensions to compare — may miss the ones that matter most to your decision" },
            { element: "Decision orientation", present: "Missing", problem: "Pros and cons list with no recommendation is analysis without a conclusion" },
            { element: "Depth per point", present: "Not specified", problem: "Could be one sentence per point or three paragraphs — AI decides" },
            { element: "Length", present: "No limit", problem: "May produce 2000 words when 400 would serve better" },
          ],
          badOutput: "There are several factors to consider when evaluating a potential relocation from Nairobi to Mombasa. On the positive side the coastal city offers certain advantages in terms of logistics for import-export businesses. However there are also significant considerations around talent availability and infrastructure...",
          goodExample: "Analyse the pros and cons of moving our logistics operations from Nairobi to Mombasa. Format: a comparison table with rows for each factor and columns for Factor, Nairobi advantage, Mombasa advantage, and Verdict. Include exactly these factors: talent pool, logistics costs, office rent, client proximity, port access, infrastructure reliability, staff relocation cost. After the table add a 3-sentence recommendation. Total response under 400 words.",
          goodBreakdown: [
            { element: "Format type", present: "Comparison table with named columns", improvement: "Scannable structured output ready for a presentation or decision memo" },
            { element: "Comparison dimensions", present: "7 specific factors named explicitly", improvement: "AI covers exactly the dimensions relevant to this decision" },
            { element: "Decision orientation", present: "3-sentence recommendation required", improvement: "Analysis leads to a conclusion not just a list of considerations" },
            { element: "Depth", present: "Table format naturally constrains to essential points", improvement: "No padding — each cell contains only what is needed" },
            { element: "Length", present: "Under 400 words total", improvement: "Executive-appropriate length" },
          ],
          goodOutput: "| Factor | Nairobi Advantage | Mombasa Advantage | Verdict | |---|---|---|---| | Talent pool | Larger tech and management talent base | Growing but smaller | Nairobi | | Logistics costs | Higher inland transport | Lower for import-export | Mombasa | | Office rent | Higher CBD rates | 30-40% lower | Mombasa | [table continues...] Recommendation: For a logistics business with significant import-export volume Mombasa offers a compelling cost case particularly on rent and port access. The primary risk is talent availability for technical roles which should be mitigated through a hybrid model — operations in Mombasa with a Nairobi satellite office for senior functions.",
          keyInsight: "The five formats and when to use them: Prose for narrative reports and communications. Bulleted lists for recommendations actions and requirements. Tables for comparisons and structured data. JSON for content that will be processed programmatically. Structured documents with headings for formal reports proposals and briefings.",
          ruleToRemember: "Always specify the output format before you need to reformat the output. If you have ever copy-pasted AI output into a different structure you missed the output format component.",
          checkYourUnderstanding: [
            {
              question: "When is a table the best output format to specify?",
              options: [
                "When you want a formal professional-sounding response",
                "When you need to compare multiple options across consistent dimensions simultaneously",
                "When the response needs to be very long and detailed",
                "When you are asking a factual question with a definitive answer",
              ],
              correctAnswer: 1,
              explanation: "Tables are ideal for comparisons — multiple items evaluated across the same dimensions. They allow instant visual scanning that prose cannot provide.",
            },
            {
              question: "You need AI to generate product descriptions that will be inserted directly into your website database. Which output format should you specify?",
              options: [
                "Prose paragraphs for each product",
                "Bulleted list of key features",
                "JSON with fields matching your database schema",
                "A structured document with headings",
              ],
              correctAnswer: 2,
              explanation: "When output will be consumed programmatically specify JSON with the exact schema your system expects. This eliminates all parsing and reformatting work.",
            },
            {
              question: "What is the most effective way to communicate the format you need when words are not sufficient?",
              options: [
                "Ask AI to format it however it thinks is best",
                "Provide an example of the exact format you want as part of the prompt",
                "Tell AI to be more structured",
                "Use a different AI model that formats better",
              ],
              correctAnswer: 1,
              explanation: "When you cannot describe the format precisely in words provide an example. Showing the model exactly what you mean is more precise than describing it and works the same way as few-shot prompting.",
            },
          ],
        },
        quizQuestions: [
          {
            question: "What is the most common consequence of not specifying output format?",
            options: [
              "AI refuses to respond",
              "AI produces the response in a structure you then have to manually reformat",
              "AI produces a shorter response",
              "AI asks you which format you prefer",
            ],
            correctAnswer: 1,
          },
          {
            question: "Which format is best for a competitive analysis comparing 5 companies across 6 criteria?",
            options: [
              "Flowing prose paragraphs",
              "A numbered list",
              "A comparison table with companies as columns and criteria as rows",
              "A JSON object",
            ],
            correctAnswer: 2,
          },
          {
            question: "You have reformatted AI output 3 times this week. What is the systemic fix?",
            options: [
              "Switch to a different AI model",
              "Add explicit output format specifications to every prompt before generating",
              "Ask AI to fix its own formatting after generating",
              "Use shorter prompts",
            ],
            correctAnswer: 1,
          },
        ],
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
        theory: {
          concept: "Constraints are the professional prompt engineer's most powerful tool. Without constraints, AI defaults to the most statistically average response — medium length, generic format, moderate detail. Adding constraints forces precision. Every constraint you add removes a degree of freedom from the model and pushes output toward exactly what you need.",
          badExample: "Write a report on our Q3 sales performance.",
          badBreakdown: [
            { element: "Length", present: "Not specified", problem: "Could be 200 words or 2000 words" },
            { element: "Format", present: "Not specified", problem: "Paragraphs? Tables? Bullet points?" },
            { element: "Audience", present: "Not specified", problem: "Board level or operational team?" },
            { element: "Sections", present: "Not specified", problem: "What must be covered?" },
            { element: "Tone", present: "Not specified", problem: "Formal report or internal memo?" },
          ],
          badOutput: "Q3 Sales Performance Report. Our sales performance in Q3 showed mixed results across different product categories and regions. The team worked hard to achieve targets despite challenging market conditions...",
          goodExample: "Write a Q3 sales performance report for the board of directors. Format: (1) Executive Summary — 3 sentences maximum, (2) Key Metrics — table with: revenue, units sold, growth vs Q2, growth vs Q3 last year, (3) Top 3 wins with one sentence each, (4) Top 2 risks with one sentence each, (5) Single recommended action. Total length: under 300 words. Tone: direct, data-led, no filler.",
          goodBreakdown: [
            { element: "Length", present: "Under 300 words", improvement: "Hard ceiling prevents padding" },
            { element: "Format", present: "5 explicit sections", improvement: "AI follows your structure exactly" },
            { element: "Audience", present: "Board of directors", improvement: "Calibrates register and density" },
            { element: "Data format", present: "Table specified", improvement: "Metrics in scannable format" },
            { element: "Tone", present: "Direct, data-led", improvement: "Eliminates corporate filler language" },
          ],
          goodOutput: "Executive Summary: Q3 revenue reached KSh 4.2M, up 18% on Q2 and 31% year-on-year, driven by digital channel growth. Unit sales of 1,840 exceeded target by 12%. Operating margin compressed by 2 points due to logistics cost increases. Key Metrics: [table]. Top Wins: (1) Digital channel hit 44% of revenue... Top Risks: (1) Logistics costs rising... Recommended Action: Approve logistics partnership review before Q4 planning.",
          keyInsight: "The specificity of your constraints determines the usefulness of the output. Vague prompts produce average outputs. Constrained prompts produce professional ones.",
          ruleToRemember: "Every unconstrained dimension in your prompt is a dimension where AI makes its own decision. Constrain everything that matters.",
          checkYourUnderstanding: [
            {
              question: "What happens when you do not specify output length in a prompt?",
              options: ["AI produces the shortest possible response", "AI defaults to a medium-length statistically average response", "AI asks you how long you want it", "AI produces the most comprehensive response possible"],
              correctAnswer: 1,
              explanation: "Without length constraints, AI produces whatever length is most statistically average for that type of request — which is rarely what you need.",
            },
            {
              question: "Which constraint has the highest impact on making an AI report useful for executives?",
              options: ["Specifying the font style", "Specifying the audience and required sections", "Asking the AI to be professional", "Telling AI to avoid repetition"],
              correctAnswer: 1,
              explanation: "Audience and structure constraints do the most work — they calibrate register, density, and ensure all required content is present.",
            },
            {
              question: "A prompt produces a 1500-word response when you needed 200 words. What is the fastest fix?",
              options: ["Rewrite the entire prompt", "Add a new prompt asking AI to shorten it", "Add a hard word count constraint to the original prompt", "Use a different AI model"],
              correctAnswer: 2,
              explanation: "Adding an explicit length constraint directly to the prompt prevents the issue rather than fixing it after the fact.",
            },
          ],
        },
        quizQuestions: [
          { question: "What does adding a format constraint to a prompt do?", options: ["Makes the AI slower to respond", "Removes a degree of freedom — forces output into a specific structure", "Increases the chance of hallucination", "Only works with premium AI models"], correctAnswer: 1 },
          { question: "You need a table of competitor prices. Which prompt produces better output?", options: ["List competitor prices", "Create a table of our top 5 competitors with: name, product, price in KSh, and one differentiator. Sort by price ascending.", "Ask the AI what format it prefers", "Give the AI the data with no format instructions"], correctAnswer: 1 },
        ],
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
        theory: {
          concept: "A single prompt can only do so much reliably. Complex tasks — research synthesis, multi-step analysis, document creation — produce inconsistent results when attempted in one shot. Prompt chaining breaks complex tasks into a sequence of focused prompts where the output of each step becomes the input of the next. Each step is simpler, more reliable, and easier to verify.",
          badExample: "Research the Kenyan fintech market, identify the top 5 opportunities, analyse the competitive landscape for each, assess regulatory risks, and write a 10-page investment brief.",
          badBreakdown: [
            { element: "Scope", present: "Enormous", problem: "Too many distinct tasks for one reliable prompt" },
            { element: "Quality control", present: "None", problem: "No way to verify each step before proceeding" },
            { element: "Structure", present: "Implied", problem: "AI decides the structure of a 10-page document" },
            { element: "Research depth", present: "Uncontrolled", problem: "AI will generate plausible-sounding but unverified market data" },
          ],
          badOutput: "Kenyan Fintech Market Investment Brief. The Kenyan fintech market represents one of Africa's most dynamic investment opportunities, with M-Pesa processing over $314 billion annually...",
          goodExample: "STEP 1: List the 5 largest segments of the Kenyan fintech market with one sentence describing each. STEP 2 (use Step 1 output): For each segment, identify the 2 largest existing players and their main product. STEP 3 (use Step 2 output): For each segment, identify one regulatory risk and one market gap. STEP 4 (use Step 3 output): Write an executive summary of the top 2 investment opportunities based on the analysis above.",
          goodBreakdown: [
            { element: "Task size", present: "One focused task per step", improvement: "Each step is reliable and verifiable" },
            { element: "Quality control", present: "Built in", improvement: "You review Step 1 before running Step 2" },
            { element: "Structure", present: "Explicit at each stage", improvement: "Output of each step is predictable" },
            { element: "Traceability", present: "Each step references the previous", improvement: "Conclusions are grounded in earlier verified outputs" },
          ],
          goodOutput: "Step 1 output: Five segments identified — mobile payments, digital lending, insurance tech, investment platforms, B2B payments infrastructure. [Verified, proceed to Step 2...]",
          keyInsight: "Prompt chaining turns AI from a one-shot tool into a systematic analytical process. The quality of each step determines the quality of the final output — which is why verification between steps is essential.",
          ruleToRemember: "For any task with more than three distinct subtasks, break it into a chain. Verify each output before using it as input for the next step.",
          checkYourUnderstanding: [
            {
              question: "What is the main advantage of prompt chaining over a single complex prompt?",
              options: ["It is faster", "Each step is simpler and the output of each step can be verified before proceeding", "It uses fewer AI credits", "It works without an internet connection"],
              correctAnswer: 1,
              explanation: "Chaining allows quality control at each step — you can verify and correct before using the output as input for the next stage.",
            },
            {
              question: "When should you use prompt chaining?",
              options: ["For simple one-step tasks", "For tasks with more than three distinct subtasks or analysis stages", "Only for coding tasks", "When you want to save tokens"],
              correctAnswer: 1,
              explanation: "Chaining is most valuable for complex, multi-stage tasks where a single prompt would produce unreliable or unverifiable results.",
            },
            {
              question: "You are using a chain and Step 2 produces an error. What is the correct response?",
              options: ["Continue to Step 3 and fix it at the end", "Start the entire chain again from Step 1", "Fix Step 2 before proceeding — do not use bad output as input for subsequent steps", "Use a different AI model for Step 2"],
              correctAnswer: 2,
              explanation: "Errors in a chain compound — bad output from Step 2 will corrupt Step 3 and beyond. Fix each step before proceeding.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is prompt chaining?", options: ["Connecting multiple AI tools together", "Breaking a complex task into a sequence of focused prompts where each output feeds the next", "Repeating the same prompt multiple times", "Using chain-of-thought reasoning in a single prompt"], correctAnswer: 1 },
          { question: "What is the most important discipline in prompt chaining?", options: ["Making all prompts the same length", "Verifying each step output before using it as input for the next step", "Using the same AI model for every step", "Writing all steps before running any of them"], correctAnswer: 1 },
        ],
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
        theory: {
          concept: "Few-shot prompting gives the AI examples of the input-output pattern you want before asking it to complete your actual task. Instead of describing the format in words, you demonstrate it. Language models are trained to continue patterns — when you provide examples, you are not just giving instructions, you are showing the model exactly what you mean. One well-chosen example is worth a paragraph of format description.",
          badExample: "Write product descriptions for our items in a professional tone.",
          badBreakdown: [
            { element: "Format demonstration", present: "None", problem: "AI invents its own format" },
            { element: "Length guidance", present: "None", problem: "Could be one sentence or ten" },
            { element: "Tone calibration", present: "Vague", problem: "Professional covers a wide range" },
            { element: "Content elements", present: "Not shown", problem: "AI decides what to include" },
          ],
          badOutput: "Premium Leather Wallet: This high-quality leather wallet is perfect for the modern professional. Crafted from genuine leather, it features multiple card slots and a bill compartment...",
          goodExample: "Write product descriptions in this exact format. Example: INPUT: Blue ceramic coffee mug, 350ml, microwave safe, handmade OUTPUT: For mornings that deserve better. A 350ml ceramic mug, handmade and microwave-safe — built to hold your coffee and your composure. Now write descriptions for: (1) Black leather notebook, A5, 200 pages, elastic closure (2) Bamboo phone stand, adjustable angle, fits all phones",
          goodBreakdown: [
            { element: "Format", present: "Shown by example", improvement: "AI replicates exact structure without description" },
            { element: "Tone", present: "Demonstrated", improvement: "The example shows the voice more precisely than words" },
            { element: "Length", present: "Implied by example", improvement: "AI matches the example length naturally" },
            { element: "Content elements", present: "Shown", improvement: "AI knows to lead with emotion then specs" },
          ],
          goodOutput: "(1) Black leather notebook, A5: For ideas that deserve permanence. A5 in hand-stitched black leather, 200 pages with elastic closure — the notebook for work worth keeping. (2) Bamboo phone stand: Your screen, at the angle you actually want. Adjustable bamboo stand, built for every phone — because your desk should work as hard as you do.",
          keyInsight: "Examples communicate format, tone, and structure more precisely than instructions. When you struggle to describe the output you want in words, show it instead.",
          ruleToRemember: "When you need consistent format across multiple outputs, use 1-3 examples. More than 5 examples rarely improves quality and consumes context unnecessarily.",
          checkYourUnderstanding: [
            {
              question: "What does few-shot prompting demonstrate to the AI?",
              options: ["How fast to respond", "The exact input-output pattern — format, tone, length, and structure — through examples", "Which data sources to use", "How many tokens to generate"],
              correctAnswer: 1,
              explanation: "Few-shot examples show the model what you want more precisely than instructions — the model continues the demonstrated pattern.",
            },
            {
              question: "When is few-shot prompting most valuable?",
              options: ["For simple factual questions", "When you need consistent format across many outputs and format description in words is inadequate", "Only for image generation", "When you want shorter responses"],
              correctAnswer: 1,
              explanation: "Few-shot is most valuable for format-sensitive tasks where you need consistent structure across multiple outputs.",
            },
            {
              question: "How many examples is typically optimal for few-shot prompting?",
              options: ["10-20 for best results", "1-3 well-chosen examples", "As many as possible", "Exactly 5 every time"],
              correctAnswer: 1,
              explanation: "1-3 well-chosen examples is the effective range for most tasks. More examples consume context without proportional quality improvement.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is the core mechanism of few-shot prompting?", options: ["Providing multiple prompts simultaneously", "Giving examples of the input-output pattern so the AI continues it", "Asking the AI to generate multiple versions", "Using a few words instead of many"], correctAnswer: 1 },
          { question: "You need 50 product descriptions in the same style. What is the most efficient approach?", options: ["Write detailed format instructions for each batch", "Provide 2 example descriptions then list all 50 products", "Generate each one with a separate prompt", "Ask AI to invent its own format"], correctAnswer: 1 },
        ],
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
        theory: {
          concept: "Three advanced techniques separate professional prompt engineers from everyday users: Chain-of-Thought reasoning, temperature control awareness, and meta-prompting. Each addresses a specific failure mode in complex AI tasks.",
          badExample: "Is this business idea viable: selling solar phone chargers in rural Kenya?",
          badBreakdown: [
            { element: "Reasoning instruction", present: "None", problem: "AI jumps to conclusion without visible reasoning" },
            { element: "Analysis framework", present: "None", problem: "AI decides what dimensions to consider" },
            { element: "Evidence requirement", present: "None", problem: "AI produces confident assertions without grounding" },
            { element: "Uncertainty handling", present: "None", problem: "AI will not flag what it does not know" },
          ],
          badOutput: "Yes, this is a viable business idea. Rural Kenya has significant demand for phone charging solutions, and solar technology is increasingly affordable. The market opportunity is substantial...",
          goodExample: "Assess the viability of selling solar phone chargers in rural Kenya. Think through this step by step: (1) What is the actual demand signal — what evidence would confirm people need this? (2) What are the three biggest operational challenges for this specific market? (3) Who are the likely competitors and what is their current reach? (4) What would make this fail? (5) Overall verdict with confidence level. Flag any assumption you are making that you cannot verify.",
          goodBreakdown: [
            { element: "Reasoning instruction", present: "Step by step explicit", improvement: "Forces visible reasoning before conclusion" },
            { element: "Framework", present: "5 specific dimensions", improvement: "Covers demand, operations, competition, risk" },
            { element: "Uncertainty handling", present: "Flag assumptions", improvement: "AI signals what it does not know" },
            { element: "Verdict format", present: "With confidence level", improvement: "You know how much to trust the conclusion" },
          ],
          goodOutput: "Step 1 — Demand signal: M-Pesa data shows over 60% of rural Kenyan adults own smartphones but grid access is under 30% in rural areas — this is a real gap. Assumption: charging behaviour data is from 2022 KNBS survey. Step 2 — Operational challenges: (1) last-mile distribution cost in low-density areas, (2) price sensitivity — target customer likely earns under KSh 5,000/month, (3) aftersales service in areas without technical support. Step 3 — Competitors: d.light and M-KOPA have significant rural reach through agent networks...",
          keyInsight: "Chain-of-thought reasoning does not just produce better answers — it produces auditable reasoning you can verify. When AI shows its work, you can catch errors before they reach your conclusion.",
          ruleToRemember: "For any complex analysis or decision, add 'think through this step by step' and specify the reasoning dimensions. The reasoning chain is often more valuable than the conclusion.",
          checkYourUnderstanding: [
            {
              question: "What does chain-of-thought prompting instruct the AI to do?",
              options: ["Generate multiple responses simultaneously", "Reason through a problem step by step before stating a conclusion", "Connect to external knowledge bases", "Use a chain of different AI models"],
              correctAnswer: 1,
              explanation: "Chain-of-thought prompting forces visible step-by-step reasoning before the conclusion — making the analysis auditable and more reliable.",
            },
            {
              question: "Why is it valuable when AI flags its assumptions?",
              options: ["It makes responses longer", "It allows you to identify which parts of the analysis require independent verification", "It proves the AI is being honest", "It reduces hallucination completely"],
              correctAnswer: 1,
              explanation: "When AI flags assumptions, you know exactly which claims need verification — allowing targeted fact-checking rather than reviewing the entire output.",
            },
            {
              question: "What is meta-prompting?",
              options: ["Asking AI to generate prompts for other tasks", "Using multiple AI models at once", "Writing prompts in multiple languages", "Prompting about AI ethics"],
              correctAnswer: 0,
              explanation: "Meta-prompting is asking AI to generate or improve prompts for specific tasks — leveraging AI to build better prompt templates.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is the primary benefit of chain-of-thought prompting for analytical tasks?", options: ["Faster responses", "Visible auditable reasoning that you can verify before accepting the conclusion", "Shorter outputs", "Better grammar"], correctAnswer: 1 },
          { question: "You ask AI to assess a business decision and it gives a confident answer with no reasoning shown. What should you add to the prompt?", options: ["Please be more confident", "Think through this step by step, specify the dimensions to consider, and flag any assumptions", "Use simpler language", "Make it shorter"], correctAnswer: 1 },
        ],
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
        theory: {
          concept: "A prompt library is a structured collection of tested, reusable prompts organised by use case. The difference between a prompt library and a folder of text files is versioning, testing, and organisation. A professional prompt library treats prompts like code — each has a purpose, a version history, performance notes, and is stored where your team can access and improve it.",
          badExample: "I just save good prompts in my notes app when I remember to.",
          badBreakdown: [
            { element: "Organisation", present: "None", problem: "Cannot find prompts when needed" },
            { element: "Versioning", present: "None", problem: "Cannot track what changed and why" },
            { element: "Testing notes", present: "None", problem: "No record of where prompts fail" },
            { element: "Accessibility", present: "Personal only", problem: "Team cannot benefit from individual improvements" },
          ],
          badOutput: "Notes app with: 'good email prompt', 'the AI thing I used for the report', 'try this one for summaries' — no context, no version, no performance record.",
          goodExample: "Prompt Library Entry Template: USE CASE: [One sentence — what problem does this solve?] PROMPT: [Full prompt text including role, task, context, constraints, and format] VERSION: [e.g. v2.1 — 14 May 2025] PERFORMANCE NOTES: [Where it works well / where it fails / what was tried] TESTED WITH: [Claude 3.5 / GPT-4o / etc.] LAST UPDATED: [Date and what changed]",
          goodBreakdown: [
            { element: "Use case", present: "One sentence", improvement: "Findable by problem, not by memory" },
            { element: "Full prompt", present: "Complete text", improvement: "Copy-paste ready, no reconstruction needed" },
            { element: "Version", present: "Numbered with date", improvement: "Track improvements over time" },
            { element: "Performance notes", present: "Where it works and fails", improvement: "Team learns from individual experience" },
          ],
          goodOutput: "USE CASE: Draft a professional follow-up email after a meeting where next steps were agreed. PROMPT: You are a senior professional writing a follow-up email. Recipient: [NAME/ROLE]. Meeting date: [DATE]. Next steps agreed: [LIST]. Tone: warm and direct. Format: (1) Thank you — 1 sentence, (2) Summary of agreed actions — bullet list, (3) Your next action — 1 sentence, (4) Call to action — 1 sentence. Maximum 150 words. VERSION: v1.2 — 20 April 2025. PERFORMANCE NOTES: Works excellently for internal meetings. For client meetings, add 'formal' to tone.",
          keyInsight: "A prompt library compounds in value over time. Every tested prompt is institutional knowledge. Every performance note prevents a colleague from making the same mistake.",
          ruleToRemember: "Every time you develop a prompt that works reliably, add it to the library immediately. The effort of capture is trivial compared to the effort of rediscovering it.",
          checkYourUnderstanding: [
            {
              question: "What distinguishes a prompt library from a folder of saved prompts?",
              options: ["A library uses better software", "A library has versioning, testing notes, and is organised by use case", "A library only contains short prompts", "A library is only for large companies"],
              correctAnswer: 1,
              explanation: "A prompt library treats prompts as managed assets — versioned, documented, and organised by the problem they solve.",
            },
            {
              question: "Why should prompt library entries include performance notes?",
              options: ["To make them look more professional", "To record where prompts work and fail so others avoid the same mistakes", "Because AI requires this format", "To make prompts longer"],
              correctAnswer: 1,
              explanation: "Performance notes convert individual experience into team knowledge — preventing others from rediscovering failures.",
            },
            {
              question: "What is the best trigger for adding a prompt to your library?",
              options: ["After using it 100 times", "Immediately when you find a prompt that works reliably", "Only after testing it on 5 different AI models", "At the end of each month"],
              correctAnswer: 1,
              explanation: "Capture reliable prompts immediately — the effort is trivial and the cost of forgetting a good prompt is high.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is the most important element of a prompt library entry?", options: ["The date it was created", "Clear use case description plus full prompt text plus performance notes", "The name of the person who wrote it", "The number of times it has been used"], correctAnswer: 1 },
          { question: "Your team uses AI but everyone builds their own prompts independently. What would a shared prompt library solve?", options: ["Nothing — individual prompts are always better", "Duplication of effort, inconsistent outputs, and loss of institutional knowledge when people leave", "It would slow everyone down", "Privacy concerns about AI usage"], correctAnswer: 1 },
        ],
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
          "Choose your specific industry or role (e.g. finance, healthcare, education, retail, agriculture, legal, HR). Build 3 complete prompt templates tailored to the most time-consuming repetitive tasks in that industry. For each prompt: (1) State the use case in one sentence, (2) Write the full prompt with role, task, context, constraints, and output format, (3) Write one example input and the expected output quality. Your prompts must be specific enough that someone in your industry could use them tomorrow.",
        quizQuestions: [
          { question: "What makes an industry-specific prompt more effective than a generic one?", options: ["It is longer", "It uses domain vocabulary, realistic constraints, and audience-appropriate output format", "It mentions the industry name", "It is more polite"], correctAnswer: 1 },
          { question: "You work in HR and need to use AI for performance reviews. What is the most important element to include in your prompt?", options: ["The employee salary", "The specific evaluation criteria and rating scale used in your organisation", "The employee age", "The review length"], correctAnswer: 1 },
        ],
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
          "Here are 3 real bad prompts that produce poor outputs. For each one: (1) Diagnose exactly what is wrong using the four-component framework (role, task, context, output format), (2) Rewrite it as a professional prompt, (3) Explain what specific improvement each change makes. Bad Prompt A: 'Help me with my presentation.' Bad Prompt B: 'Analyse this data and tell me what it means.' Bad Prompt C: 'Write something for our website about our new product.'",
        quizQuestions: [
          { question: "When an AI response is off-topic or misses your intent, what is the most likely root cause?", options: ["The AI model is malfunctioning", "The task instruction is ambiguous — the AI resolved ambiguity in the most probable direction", "You need a premium subscription", "AI cannot understand your industry"], correctAnswer: 1 },
          { question: "What is the correct diagnostic process when a prompt produces poor output?", options: ["Rewrite the entire prompt from scratch", "Identify which component failed (role/task/context/format), change only that component, and test again", "Switch to a different AI model", "Make the prompt shorter"], correctAnswer: 1 },
        ],
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
    title: "AI for Data and Decisions",
    tagline: "Turn Raw Numbers into Business Decisions",
    description:
      "Turn raw data into decisions using AI. Analyst-level insights from any dataset — no coding required. Built around real Kenyan business data from M-Pesa, KNBS, and Nairobi businesses.",
    level: "Intermediate",
    price_kes: 2800,
    lessons_count: 7,
    badge_name: "AI Data Analyst",
    what_you_will_learn: [
      "Clean and structure messy real-world datasets using AI in under 30 minutes",
      "Extract specific insights from complex business data with structured prompts",
      "Find patterns and anomalies that manual review would miss entirely",
      "Build automated reporting workflows that run weekly without manual effort",
      "Present data-driven recommendations confidently to any executive audience",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Welcome to AI for Data and Decisions",
        type: "intro" as const,
        hook: "A finance manager at a Nairobi SACCO was spending every Monday morning building the same weekly report from scratch. After two hours in this course she automated it completely. The report now generates itself. She uses Monday mornings to think about what the numbers mean.",
        duration_mins: 5,
        isAvailable: true,
        content: "Every Kenyan business is sitting on data they cannot read. M-Pesa transaction logs, sales records, customer feedback, delivery times — all of it is potential insight trapped in spreadsheets nobody analyses. This course teaches you to use AI to turn that raw data into decisions. No coding degree. No statistics background. Just the right questions and the right prompts.",
        introWhoFor: [
          "An operations or finance manager who receives reports but struggles to extract clear decisions from them",
          "A business analyst who wants to work 5× faster using AI-assisted tools",
          "An entrepreneur who wants to understand their own data without hiring a data scientist",
          "A graduate entering any industry where data literacy gives you a competitive edge",
        ],
        introOutcomes: [
          "Clean any messy Kenyan business dataset — M-Pesa exports, Excel sheets, sales logs — using AI in under 30 minutes",
          "Write structured prompts that extract specific insights from complex data rather than generic summaries",
          "Find patterns, trends, and anomalies that manual spreadsheet review would miss entirely",
          "Build a repeatable automated reporting workflow that produces a weekly business dashboard without manual effort",
          "Present data-driven recommendations in the Pyramid Principle format that senior executives actually respond to",
        ],
        introStructure: {
          lessonsCount: 7,
          hours: 5,
          sandboxCount: 3,
          finalProject: "Full business intelligence report for Savannah Foods — a fictional Kenyan FMCG company",
        },
        introFirstTask: "Think of one business or work situation where you receive data but struggle to turn it into a clear decision. Write it down in one sentence. By lesson 3 you will have the exact prompt structure to crack it open.",
      },
      {
        lessonNumber: 1,
        title: "Thinking in Questions — The Analyst Mindset",
        type: "video",
        hook: "An operations manager at a Nairobi FMCG company was given 6 months of sales data and told to find the insight. She stared at it for an hour and saw nothing useful. Then she asked five specific questions. Within 20 minutes she had found a KSh 2.3 million opportunity hiding in the data. The data had not changed. The questions had.",
        duration_mins: 9,
        isAvailable: true,
        content: "The most important data analysis skill is not a tool or a technique — it is knowing what questions to ask before you open any software. This lesson gives you the question framework that turns any dataset from a wall of numbers into a source of business decisions.",
        theory: {
          concept: "Every Kenyan business generates data constantly. Every M-Pesa transaction is data. Every customer complaint is data. Every delivery time is data. Every sale is data. The difference between a business that uses this data and one that ignores it is not the data — it is the questions being asked of it. Before AI you needed statistical training to find patterns in data. Now you need the right questions and the right prompts. AI does the calculation. You do the thinking. The analyst who asks the best questions gets the most value from AI — not the analyst with the most technical skill.",
          badExample: "Here is 6 months of sales data for my business. Analyze it.",
          badBreakdown: [
            { element: "Questions asked", present: "Zero", problem: "AI has no idea what business decision you are trying to make and will produce a generic summary that tells you nothing actionable" },
            { element: "Timeframe comparison", present: "Not specified", problem: "Compared to what? Last 6 months? Same period last year? A target? Without a benchmark nothing is high or low" },
            { element: "Anomaly threshold", present: "Not defined", problem: "AI cannot identify what counts as a significant problem or opportunity without a threshold" },
            { element: "Output type", present: "Not specified", problem: "Should the output be a summary a ranking a trend line or a list of anomalies? AI will pick one arbitrarily" },
            { element: "Decision context", present: "Absent entirely", problem: "AI does not know what you are going to do with this analysis so it cannot orient the findings toward a decision" },
          ],
          badOutput: "Based on the sales data provided, revenue showed variation across the 6-month period. Some months performed better than others. The data suggests that sales activity is consistent with typical business patterns. There are some periods of higher activity which may indicate seasonal trends worth monitoring going forward.",
          goodExample: "I have 6 months of daily M-Pesa payment data for my Nairobi electronics shop from January to June 2024. Total transactions: 4,200. Analyze this data and answer these 5 specific questions: (1) Which day of the week has the highest average transaction value and by how much compared to the lowest day? (2) Are there any months where total revenue dropped more than 20% from the previous month — if yes what week did the drop start? (3) What percentage of transactions are above KSh 10,000 and what is their combined share of total revenue? (4) Are there any individual days with transaction volumes more than 3× the daily average? List them with dates. (5) What is the trend — is average transaction value increasing decreasing or flat across the 6 months? Present each answer with the specific numbers. Format: one answer per question maximum 3 sentences each.",
          goodBreakdown: [
            { element: "Questions asked", present: "5 specific targeted questions", improvement: "Each question targets a distinct business insight — day performance, drops, high-value segment, anomalies, trend" },
            { element: "Timeframe comparison", present: "Month-over-month threshold set at 20%", improvement: "AI knows exactly what constitutes a significant drop versus normal fluctuation" },
            { element: "Anomaly threshold", present: "3× daily average specified", improvement: "Removes all ambiguity about what counts as unusual" },
            { element: "Output type", present: "One answer per question with numbers", improvement: "Forces specific quantitative findings not vague observations" },
            { element: "Decision context", present: "Kenyan M-Pesa electronics business with real transaction volumes", improvement: "AI calibrates every finding to the specific business reality — KSh values make sense locally" },
          ],
          goodOutput: "(1) Saturdays have the highest average transaction value at KSh 18,400 — 2.7× higher than Mondays at KSh 6,800. (2) March total revenue dropped 24% from February — the drop began in week 2 of March coinciding with school fee season. (3) Transactions above KSh 10,000 represent 8% of all transactions but 51% of total revenue — a critical high-value segment. (4) Three anomaly days: January 27 (4.1× average — likely payday weekend), April 6 (3.4× average — Easter weekend), June 14 (3.2× average — end-of-month salary cycle). (5) Average transaction value is increasing — from KSh 8,900 in January to KSh 11,400 in June, an improvement of 28% suggesting either product mix shift toward higher-value items or customer base maturation.",
          keyInsight: "The five question types every data analyst asks: (1) What is the ranking? Which items or periods are highest and lowest and by how much? (2) What changed? Where did a significant shift happen and when exactly? (3) What is the pattern? Is there a trend cycle or seasonality? (4) What is anomalous? Which data points fall outside the normal range and why? (5) What is the decision? What action does this data support or contradict? Ask all five before you open any data tool.",
          ruleToRemember: "Write your five questions before you touch the data. If you cannot write five specific questions about a dataset you do not yet understand the business problem well enough to analyse anything.",
          checkYourUnderstanding: [
            {
              question: "A colleague sends you a sales spreadsheet and asks you to 'have a look and see if anything stands out.' What is the correct professional response?",
              options: [
                "Open the spreadsheet immediately and start looking for patterns",
                "Ask them to define what decision this analysis will inform and what a significant finding would look like — then write specific questions before opening the file",
                "Tell them the request is too vague and you cannot help",
                "Forward it to a data scientist who has the right tools",
              ],
              correctAnswer: 1,
              explanation: "Without a decision context and specific questions the analysis has no direction. Spend 5 minutes on questions first and save 2 hours of aimless exploration.",
            },
            {
              question: "You are analysing 12 months of customer transaction data for a Nairobi retailer. Which question will produce the most actionable business insight?",
              options: [
                "How many transactions were there in total?",
                "What was the average transaction value?",
                "Which customers have not made a purchase in the last 90 days and what was their average spending before they stopped?",
                "What was the highest single transaction value?",
              ],
              correctAnswer: 2,
              explanation: "The third question targets a specific business problem — customer churn — and links historical behaviour to the current situation. It produces a list of at-risk customers the business can act on. The other questions produce numbers with no decision attached.",
            },
            {
              question: "An AI analysis of your data says: 'Sales performance was mixed with some months performing better than others.' What does this tell you about your original question?",
              options: [
                "The AI model is not capable of deeper analysis",
                "Your data is too noisy for meaningful analysis",
                "Your original question was too vague — AI produced a vague answer that mirrors the vagueness of the input",
                "You need to use a different AI tool designed for business data",
              ],
              correctAnswer: 2,
              explanation: "Vague questions produce vague answers every time. The response 'some months perform better than others' is true of literally every business dataset in history. Rewrite your questions with specific thresholds comparisons and business decisions and the output will transform.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is the single most important step before beginning any data analysis?", options: ["Opening the dataset and exploring it visually", "Writing specific questions that the analysis must answer before touching the data", "Choosing the right data visualisation tool", "Cleaning the data to remove any missing values"], correctAnswer: 1 },
          { question: "An AI analysis returns generic observations with no specific numbers or actionable findings. What is the most likely cause?", options: ["The dataset is too large for the AI to process effectively", "The questions asked were too vague and lacked thresholds comparisons and decision context", "The AI model needs a paid subscription to produce specific analysis", "The data needs to be cleaned before analysis can produce useful results"], correctAnswer: 1 },
          { question: "Which of the five analyst question types will most directly drive a business decision?", options: ["What is the ranking?", "What changed?", "What is the decision — what action does this data support or contradict?", "What is anomalous?"], correctAnswer: 2 },
        ],
      },
      {
        lessonNumber: 2,
        title: "Data Quality and Cleaning with AI",
        type: "reading",
        hook: "A procurement analyst at a Nairobi manufacturing company spent 3 days trying to reconcile supplier invoice data before realising 30% of the records had inconsistent company name formats — Saf Ltd, SAFARICOM, Safaricom Limited, and Safaricom Ltd were all the same supplier. She fixed the entire dataset in 40 minutes using one AI prompt. Then she built a cleaning workflow so it never happened again.",
        duration_mins: 7,
        isAvailable: true,
        content: "Every real-world business dataset has quality problems. Missing values, duplicate records, inconsistent formatting, incorrect data types, and referential errors are not exceptions — they are the norm. Analysts who skip cleaning produce unreliable findings. Analysts who clean manually waste days on work AI can do in minutes.",
        readingTopics: [
          "The 6 most common data quality problems in Kenyan business datasets and how to identify each one",
          "The AI-assisted cleaning workflow — from raw export to analysis-ready dataset",
          "How to write cleaning instructions that AI can execute systematically",
          "The verification step — why you must spot-check AI-cleaned data before using it",
          "Building a cleaning checklist that becomes your standard operating procedure",
        ],
        theory: {
          concept: "Data quality problems destroy analysis accuracy. A dataset with 15% duplicate records will overcount every metric by 15%. A dataset where dates are formatted as both 14/03/2024 and March 14 2024 will fail to calculate any time-based trend correctly. A column where some entries say KSh 5000 and others say 5,000 and others say 5000.00 cannot be summed without errors. These problems are universal in business data — especially in Kenyan SMEs that have grown from manual record-keeping into digital systems. The six quality problems every analyst must identify and fix before analysis: (1) Missing values — fields that are blank or null. (2) Duplicate records — the same transaction or customer appearing more than once. (3) Inconsistent formatting — dates phone numbers currency and categories in multiple formats. (4) Incorrect data types — numbers stored as text so they cannot be summed. (5) Outliers — values so far outside the normal range they are likely data entry errors. (6) Referential errors — foreign keys that do not match any record in the reference table.",
          badExample: "Clean this data for me: [pastes raw M-Pesa transaction export with 500 rows]",
          badBreakdown: [
            { element: "Problem specification", present: "Not provided", problem: "AI does not know which of the 6 quality problem types to look for — it will do a surface-level review and miss structural issues" },
            { element: "Column definitions", present: "Not provided", problem: "Without knowing what each column should contain AI cannot identify what is wrong with a value" },
            { element: "Business rules", present: "Not specified", problem: "AI does not know that transactions below KSh 100 are impossible in your system or that all phone numbers must be 254-format" },
            { element: "Output specification", present: "Not defined", problem: "Should AI fix in place or flag for review? Should it document changes? Should it flag rather than change ambiguous cases?" },
            { element: "Verification instruction", present: "Absent", problem: "Without a spot-check instruction you have no way to validate that AI cleaned correctly" },
          ],
          badOutput: "I have cleaned the data. I removed some duplicate entries and standardized the date format. The dataset should now be ready for analysis.",
          goodExample: "I have an M-Pesa transaction export for my Nairobi retail business with these columns: Date (should be YYYY-MM-DD), Transaction_ID (alphanumeric unique), Amount_KES (should be numeric with no currency symbols or commas), Phone_Number (should be 254XXXXXXXXX format), Category (should be one of: Sale, Refund, Deposit, Withdrawal), Description (free text — leave as is). Please: (1) Identify all rows where Date is not in YYYY-MM-DD format and list the formats found — do not fix yet, list first. (2) Find all duplicate Transaction_IDs — list the duplicates and flag whether the amounts also match or differ. (3) Identify all Amount_KES values that contain non-numeric characters like KSh or commas — list 5 examples and the fix pattern. (4) Find all Phone_Number entries not in 254XXXXXXXXX format — list formats found and the standardisation rule. (5) List all unique values in the Category column — flag any that are not in the approved list. Present findings as a numbered report with counts for each issue type before suggesting any fixes.",
          goodBreakdown: [
            { element: "Column definitions", present: "Full schema with expected format for each column", improvement: "AI knows exactly what correct data looks like and can identify deviations precisely" },
            { element: "Business rules", present: "Approved category list and phone number format specified", improvement: "AI applies your specific business rules not generic data quality assumptions" },
            { element: "Problem specification", present: "All 6 quality problem types addressed across 5 tasks", improvement: "Systematic coverage rather than a surface review" },
            { element: "Output specification", present: "Find and list first — fix second", improvement: "Review before fixing means no irreversible changes happen without your approval" },
            { element: "Verification design", present: "Counts required for each issue type", improvement: "Quantified findings let you spot-check a sample rather than reviewing 500 rows manually" },
          ],
          goodOutput: "(1) Date format issues: 47 rows in DD/MM/YYYY format, 12 rows in Month DD YYYY format. Standardisation rule: convert all to YYYY-MM-DD. (2) Duplicate Transaction_IDs: 8 duplicate pairs found. 6 pairs have identical amounts — likely system double-recording. 2 pairs have different amounts — requires manual review before deletion. (3) Amount_KES non-numeric: 23 entries contain KSh prefix, 156 entries contain comma separators. Fix: remove KSh prefix and all commas then convert to float. (4) Phone_Number formats: 0XXXXXXXXX format found 89 times — fix: replace leading 0 with 254. +254XXXXXXXXX found 34 times — fix: remove + prefix. (5) Category anomalies: 'sale' (lowercase) found 12 times, 'REFUND' (uppercase) found 7 times, 'Transfer' found 3 times — not in approved list. Propose mapping Transfer to either Deposit or Withdrawal based on amount direction.",
          keyInsight: "Clean data incrementally in two phases. Phase 1 — find and document every issue with counts. Phase 2 — fix each issue type with a specific transformation rule and spot-check 10 random rows from each fix. Never let AI fix and move on without a review step — cleaning errors compound into analysis errors and finding them after the fact costs far more time than the review step saves.",
          ruleToRemember: "Document every data quality problem before fixing any of them. The documentation is your audit trail. If an executive asks why a metric changed between last month's report and this month's the answer is in your cleaning log.",
          checkYourUnderstanding: [
            {
              question: "You receive a customer database where the same customer appears 3 times with slightly different name spellings: Wanjiku Kamau, Wanjiku M. Kamau, and W. Kamau. All have different email addresses. What is the correct approach?",
              options: [
                "Delete two of the three records and keep only the first",
                "Flag these as potential duplicates and manually verify using phone number or ID number before merging or deleting any records",
                "Leave all three in the database — different email addresses prove they are different people",
                "Ask AI to automatically merge them based on the name similarity",
              ],
              correctAnswer: 1,
              explanation: "Different email addresses mean they could be the same person with multiple accounts or genuinely different people with similar names. You need a definitive identifier like a national ID or phone number before merging. Never delete records without verification.",
            },
            {
              question: "Your analysis shows average monthly revenue increased by 340% in March. Before reporting this to management what is the non-negotiable check?",
              options: [
                "Create a compelling visualization to present the impressive result",
                "Calculate whether March had any public holidays that might explain increased activity",
                "Verify the March data for quality issues — duplicates incorrect amounts or data from a different source — before attributing the increase to business performance",
                "Ask AI to confirm the calculation is correct",
              ],
              correctAnswer: 2,
              explanation: "A 340% single-month spike is a data quality red flag before it is a business insight. Duplicated records or data from multiple sources accidentally merged are the most common causes of impossible spikes. Always verify anomalous findings against the raw source data.",
            },
            {
              question: "Why should you identify all data quality problems before fixing any of them?",
              options: [
                "To make the process take longer so you appear to be doing thorough work",
                "Because some fixes depend on other fixes — fixing the wrong thing first can obscure or create other problems",
                "Because AI cannot fix problems and identify them at the same time",
                "Because you need manager approval before making any changes to business data",
              ],
              correctAnswer: 1,
              explanation: "Data quality problems interact. Removing duplicates before standardising phone numbers can accidentally delete the only correct-format version of a duplicate pair. Document first then fix in the right sequence — structural issues like type corrections before content issues like deduplication.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is the most dangerous data quality problem because it causes every metric to be systematically overstated?", options: ["Missing values in optional fields", "Duplicate records that get counted as separate transactions", "Inconsistent date formats across rows", "Free text in numeric columns"], correctAnswer: 1 },
          { question: "You ask AI to clean your dataset and it says 'the data has been cleaned.' What is the essential next step before using the data?", options: ["Thank AI and proceed to analysis immediately — it has done the work", "Spot-check a random sample of cleaned rows against the original raw data to verify the transformations were applied correctly", "Ask AI to clean it again to double-check", "Share the cleaned file with your manager for approval"], correctAnswer: 1 },
          { question: "A column called Amount_KES contains values including: 5000, KSh 5,000, 5000.00, and 5,000. What type of data quality problem is this?", options: ["Missing values problem", "Duplicate records problem", "Inconsistent formatting — multiple representations of the same data type in one column", "Outlier problem — some values are too high"], correctAnswer: 2 },
        ],
      },
      {
        lessonNumber: 3,
        title: "Descriptive Analysis — Finding What the Data Says",
        type: "sandbox",
        hook: "Descriptive analysis is the foundation of every business decision made from data. Before you can predict or recommend you must accurately describe. Most people skip this step and jump to conclusions. This is where the most expensive analytical mistakes begin.",
        duration_mins: 15,
        isAvailable: true,
        content: "Descriptive analysis answers: what happened? It uses counts, averages, medians, distributions, and breakdowns to paint an accurate picture of a period of business activity. Master this layer and every subsequent analysis — patterns, predictions, recommendations — becomes far more reliable.",
        sandboxTask: "You are the business analyst for Kilima Fresh Ltd., a fictional Nairobi-based fresh produce distributor supplying 45 supermarkets across 4 counties (Nairobi, Kiambu, Machakos, and Nakuru). You receive a dataset description of their last quarter (90 days, January–March 2024). Dataset contents: 3,200 delivery records with columns: Date, Supermarket_Name, County, Product_Category (Vegetables / Fruits / Dairy / Dry Goods), Units_Delivered, Revenue_KES, On_Time_Delivery (Yes/No), Spoilage_Units, Driver_ID. Using AI with this dataset description, complete the following 5 descriptive analysis tasks: (1) REVENUE BREAKDOWN: What was total Q1 revenue? Break it down by county and by product category. Which county generated the most revenue and which product category had the highest average revenue per delivery? (2) DELIVERY PERFORMANCE: What was the overall on-time delivery rate? How does it vary by county? Which county has the worst on-time rate and by how much compared to the best? (3) SPOILAGE ANALYSIS: What was the overall spoilage rate as a percentage of units delivered? Which product category has the highest spoilage rate? Calculate the KSh value of spoilage assuming average revenue per unit. (4) DRIVER PERFORMANCE: Assuming 8 drivers total, what was the average number of deliveries per driver? If the on-time rate varies significantly by driver identify which metric you would need to calculate driver-level performance and write the question you would ask AI. (5) EXECUTIVE SUMMARY: Write a 5-sentence executive summary of Q1 performance covering total revenue, on-time rate, top performing county, biggest risk, and one recommended action. Use realistic Kenyan FMCG numbers in your answers (a delivery to a Nairobi supermarket typically generates KSh 8,000–25,000 in revenue). Show all your AI prompts and the responses you received for each task.",
        quizQuestions: [
          { question: "What is the purpose of descriptive analysis?", options: ["To predict what will happen next based on historical patterns", "To accurately describe what happened in a given period using counts averages and distributions", "To recommend specific business actions based on data findings", "To identify the root cause of a business problem"], correctAnswer: 1 },
          { question: "A supermarket chain has average monthly revenue of KSh 4.2 million but median monthly revenue of KSh 2.8 million. What does the gap between mean and median tell you?", options: ["There is a calculation error — mean and median should be similar", "A small number of unusually high revenue months are pulling the average up — the typical month is closer to KSh 2.8 million", "The business is growing rapidly which causes the gap", "The data needs to be cleaned before these metrics can be trusted"], correctAnswer: 1 },
          { question: "You find that on-time delivery rate is 78% overall but only 51% in Nakuru County. Which type of analysis should you do next?", options: ["Descriptive analysis — calculate what the average looks like across all counties", "Diagnostic analysis — investigate why Nakuru specifically has such a different rate compared to other counties", "Predictive analysis — forecast what the Nakuru rate will be next quarter", "Prescriptive analysis — tell management what to do about it"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 4,
        title: "Pattern Finding and Anomaly Detection",
        type: "reading",
        hook: "A treasury analyst at a Nairobi bank noticed something odd — M-Pesa reversals in one branch were occurring at exactly 3× the rate of every other branch. Manual review would have taken 6 weeks to find this in 400,000 transactions. An AI prompt found it in 8 minutes. The branch manager had been approving fictitious reversals. The loss to that point was KSh 3.4 million.",
        duration_mins: 7,
        isAvailable: true,
        content: "Pattern finding asks: what is the trend and what breaks the trend? Anomaly detection asks: which data points fall outside the expected range and what do they indicate? Together they transform raw data into early warning systems and opportunity signals — the two things every Kenyan business decision-maker needs most.",
        readingTopics: [
          "The four types of patterns every business analyst must be able to identify: trend, seasonal, cyclical, and irregular",
          "How to write AI prompts that separate normal variation from meaningful patterns",
          "Anomaly detection — defining your expected range and flagging deviations",
          "The Kenyan business calendar — understanding seasonal patterns specific to the East African market",
          "From anomaly to investigation — the questions to ask when something unusual shows up in your data",
        ],
        theory: {
          concept: "Business data contains four types of patterns. Trend is a long-run increase or decrease over time — monthly revenue growing 8% quarter on quarter. Seasonal patterns repeat on a predictable calendar cycle — M-Pesa transaction volumes spike in January as school fees are paid, drop in August during agricultural off-season, peak again in December. Cyclical patterns follow economic cycles — credit demand rising and falling with broader economic conditions. Irregular patterns have no predictable structure — one-off events like COVID lockdowns, a major competitor entering the market, or a supply chain disruption. Anomalies are data points that fall outside the expected range for any of these pattern types. In African business data the most valuable anomalies are: (1) unexplained spikes — sudden volume or revenue increases that have no calendar or promotional explanation, (2) unexplained drops — sudden declines that preceded customer churn or operational failures, (3) category shifts — one product category gaining share from another without a deliberate pricing change, (4) geographic outliers — one region performing dramatically differently from all others in either direction.",
          badExample: "Are there any patterns in this sales data?",
          badBreakdown: [
            { element: "Pattern type", present: "Not specified", problem: "AI must guess whether you want trend seasonal cyclical or anomaly analysis — it will often choose the easiest one rather than the most useful" },
            { element: "Time period", present: "Not defined", problem: "Patterns look completely different over 7 days versus 12 months — without a timeframe AI cannot identify meaningful signals" },
            { element: "Expected baseline", present: "Not provided", problem: "AI cannot identify anomalies without knowing what normal looks like in your specific business context" },
            { element: "Business context", present: "Absent", problem: "Kenyan school fee cycles salary payment dates and agricultural seasons are invisible to AI without being specified" },
            { element: "Significance threshold", present: "Not defined", problem: "Without a threshold every fluctuation looks the same — AI cannot separate noise from signal" },
          ],
          badOutput: "Looking at the sales data I can see some interesting patterns. Sales appear to increase towards the end of the month and there are some variations across different product categories. There may be some seasonal patterns present in the data though more data would be needed to confirm this with certainty.",
          goodExample: "I have 18 months of daily transaction data (January 2023 to June 2024) for a Nairobi hardware supplies business. I want you to identify patterns and anomalies. Here is the business context you need: (1) Month-end effect — most Kenyan SMEs pay invoices at month-end so we expect transaction spikes in the last 3 business days of every month. (2) School fee seasons — January and September are high-cash-demand months for our customers which typically reduces discretionary business spending by 15-25%. (3) Agricultural purchasing peaks — March to May is the long rains season when construction and agricultural customers buy more. Please identify: (a) the overall 18-month revenue trend — is it growing declining or flat and at what monthly rate? (b) whether the month-end spike is consistent and quantify its average size as a % above mid-month daily average, (c) any months where total revenue deviated more than 25% from the expected seasonal pattern — list with dates and deviation amounts, (d) any specific calendar days that appear as anomalous spikes or drops more than 3× the weekly average — list with dates and hypothesised cause where you can infer one.",
          goodBreakdown: [
            { element: "Pattern types", present: "Trend seasonal and anomaly all specified", improvement: "AI performs three distinct analyses rather than one vague overview" },
            { element: "Time period", present: "18 months specified with start and end dates", improvement: "AI analyses meaningful long-term patterns rather than short-term noise" },
            { element: "Business context", present: "Month-end effect school fee seasons agricultural calendar all provided", improvement: "AI can distinguish Kenyan-specific normal patterns from genuine anomalies" },
            { element: "Expected baseline", present: "Mid-month daily average used as baseline for month-end spike calculation", improvement: "Specific comparison base produces a specific measurable finding" },
            { element: "Significance threshold", present: "25% deviation for seasonal anomaly 3× weekly average for daily anomaly", improvement: "Clear thresholds separate signal from noise so every flagged item actually requires investigation" },
          ],
          goodOutput: "(a) Overall trend: revenue growing at approximately 3.2% month-on-month — total 18-month growth of 58% from KSh 1.2M to KSh 1.9M average monthly. (b) Month-end spike: consistent in 16 of 18 months, averaging 47% above mid-month daily average. The two exceptions were April 2023 (no spike — Good Friday fell on the 29th, a business day lost) and November 2023 (38% below expected month-end — possible cash flow crisis in customer base). (c) Seasonal anomalies: March 2023 revenue 31% below expected (unusual — dry March suggests delayed long rains delayed construction projects), September 2023 revenue 22% above expected seasonal low (potential new major customer or market share gain — worth investigating). (d) Daily anomalies: June 3 2024 spike at 4.2× weekly average — end of financial year government procurement. March 14 2023 drop to 12% of daily average — possibly a Monday after a weekend disruption. February 13 2024 spike at 3.8× average — Valentine's Day adjacent weekend for general retail.",
          keyInsight: "The Kenyan business calendar has patterns that standard global analytics tools do not know about. School fee payment months (January, September), salary payment dates (25th-31st of month), agricultural seasons (long rains March-May, short rains October-December), and public holiday clusters all create predictable patterns in East African business data. Build these into every pattern analysis prompt as context and your AI output will be far more accurate than any generic analysis tool.",
          ruleToRemember: "Never report an anomaly without a hypothesis about its cause. A spike or drop without an explanation is not a finding — it is a starting point for investigation. The pattern tells you where to look. The investigation tells you what actually happened.",
          checkYourUnderstanding: [
            {
              question: "A Nairobi supermarket's transaction volume spikes every last week of the month by approximately 40%. A new analyst flags this as an anomaly requiring investigation. What is the correct response?",
              options: [
                "Agree — any spike above 25% of average requires immediate investigation",
                "Explain that this is a predictable pattern driven by salary payment cycles in Kenya — it is seasonal not anomalous and should be built into the expected baseline",
                "Remove the last week of each month from the dataset to normalise the data before analysis",
                "Ask management whether they ran a promotion every month-end to explain the consistent increase",
              ],
              correctAnswer: 1,
              explanation: "Month-end spikes are a well-known Kenyan market pattern driven by salary and PAYE payment cycles. Flagging a predictable calendar pattern as an anomaly wastes investigation time. Build the pattern into your baseline so genuine anomalies stand out from the normal cycle.",
            },
            {
              question: "You identify that one Nairobi branch of a 6-branch pharmacy chain has M-Pesa reversal rates 4× higher than all other branches over 6 months. What is the correct next step?",
              options: [
                "Report the finding as an anomaly in the monthly dashboard and move on to the next analysis task",
                "Immediately escalate to the fraud and compliance team with the specific data — a 4× deviation from all peers over 6 months is a high-confidence fraud signal requiring investigation",
                "Wait until the pattern persists for a full year before escalating — one period could be coincidence",
                "Remove this branch from future analysis since it is skewing the company-wide average",
              ],
              correctAnswer: 1,
              explanation: "A 4× deviation from all peer branches sustained over 6 months is not a data quality issue or coincidence — it is a high-confidence signal that requires immediate investigation. Data analysis exists to surface exactly this kind of finding quickly. Escalate immediately.",
            },
            {
              question: "What is the key difference between a seasonal pattern and an anomaly?",
              options: [
                "Seasonal patterns are always larger in scale than anomalies",
                "Seasonal patterns repeat predictably on a calendar cycle and can be anticipated — anomalies are deviations from the expected pattern that require explanation",
                "Anomalies only occur in financial data — seasonal patterns occur across all data types",
                "Seasonal patterns are caused by external factors while anomalies are caused by internal business decisions",
              ],
              correctAnswer: 1,
              explanation: "The distinction is predictability. A January school fee spending spike is predictable and expected — you build it into your baseline. A January revenue drop in a business that should not be affected by school fees is an anomaly — it deviates from what should be expected and demands a cause.",
            },
          ],
        },
        quizQuestions: [
          { question: "You are analysing 2 years of sales data for a Nakuru agri-input supplier. Revenue spikes every March-May and October-December. What type of pattern is this?", options: ["An anomaly requiring investigation", "A trend — revenue growing over the 2 year period", "A seasonal pattern aligned with Kenyan agricultural planting seasons", "A cyclical pattern following the broader economy"], correctAnswer: 2 },
          { question: "Which context information is most important to include when asking AI to detect anomalies in Kenyan business data?", options: ["The file format and size of the dataset", "Kenyan-specific calendar patterns including salary dates school fee months and agricultural seasons", "The name of the business and its founding date", "The number of employees in the business"], correctAnswer: 1 },
          { question: "You find a 300% revenue spike on a single day in your data. Before reporting it as a major finding what must you do first?", options: ["Immediately include it in the monthly executive report as a breakthrough result", "Check for data quality issues including duplicate records incorrect entries or data from multiple sources accidentally merged", "Calculate the annual revenue impact and present it to the CEO", "Ask AI to confirm the spike is real by recalculating it"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 5,
        title: "Visualisation and Executive Storytelling",
        type: "sandbox",
        hook: "A data analyst at a Kenyan telecoms company spent 2 weeks building a 47-slide PowerPoint of charts and tables for the quarterly board review. The board spent 8 minutes on it before asking the CEO to just tell them what was important. The analyst had produced data. She had not produced a story.",
        duration_mins: 15,
        isAvailable: true,
        content: "The Pyramid Principle — lead with the conclusion, support with evidence — is the single most important communication framework for data analysts. Combine it with correct chart selection and you produce presentations that drive decisions instead of generating questions.",
        sandboxTask: "You are the data analyst for Savannah Foods Ltd., a fictional Kenyan FMCG company with 8 product lines distributed across 4 regions: Nairobi, Coastal, Rift Valley, and Western Kenya. You have the following Q3 2024 summary data to work with: Total revenue: KSh 48.3 million (vs KSh 41.2 million Q3 2023 — +17%). By region: Nairobi KSh 21.4M (+8%), Coastal KSh 14.1M (+31%), Rift Valley KSh 8.9M (+12%), Western KSh 3.9M (-4%). By product line top 3: Maize flour KSh 16.2M, Cooking oil KSh 11.8M, Dairy KSh 9.4M. On-time delivery: 83% overall (target 90%). Customer complaints: 142 total — 67% related to packaging damage. New customers acquired: 38 (vs target 50). Complete these 4 tasks: (1) PYRAMID PRINCIPLE MEMO: Write a one-page executive memo using the Pyramid Principle structure — start with the single most important sentence about Q3 performance, then 3 supporting points each with one number, then one recommended action. Maximum 200 words. No filler phrases like 'it is worth noting'. (2) CHART SELECTION: For each of the following data pairs state the best chart type and explain why in one sentence: (a) Monthly revenue trend over 12 months, (b) Q3 revenue by region as a proportion of total, (c) On-time delivery rate by region compared to the 90% target, (d) Relationship between customer complaints and delivery volume by region. (3) CHART DESCRIPTION: For the regional performance data write a complete description of a comparison bar chart — include the title axis labels data labels and one sentence of annotation that makes the key insight immediately obvious without the reader having to calculate anything. (4) ANOMALY FLAG: Western Kenya is the only region with negative growth at -4%. Write the 3 questions you would ask AI to investigate this anomaly and explain what business decision each question is designed to inform. Show your AI prompts and responses for tasks 1 and 4.",
        quizQuestions: [
          { question: "The Pyramid Principle says you should structure a data presentation by:", options: ["Starting with methodology and data sources then revealing findings at the end", "Leading with the conclusion and key recommendation then supporting it with evidence", "Presenting all data points first and letting the audience draw their own conclusions", "Organizing findings chronologically from oldest to most recent"], correctAnswer: 1 },
          { question: "You need to show how monthly revenue has changed over 24 months. Which chart type is most appropriate?", options: ["Pie chart — shows each month as a proportion of the total", "Line chart — shows change over time as a continuous trend", "Stacked bar chart — shows each month broken down by product category", "Scatter plot — shows the relationship between two variables"], correctAnswer: 1 },
          { question: "An executive looks at your chart and asks 'What does this mean?' What does their question tell you about your visualisation?", options: ["The executive needs more data to understand the context", "The chart failed — the key insight should be immediately obvious without explanation", "You need to add more data points to clarify the picture", "The executive should have read the accompanying report before the meeting"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 6,
        title: "Automated Reporting — Build It Once, Run It Every Week",
        type: "video",
        hook: "The best data analysts in any Kenyan organisation are not the ones who produce the most reports. They are the ones who have stopped producing reports manually. A report that requires a human to build every week is a workflow waiting to be automated.",
        duration_mins: 9,
        isAvailable: true,
        content: "Automated reporting means defining the report structure once, creating the AI prompts that generate the narrative commentary, and building the workflow so the next analyst — or even a non-analyst — can run the same report from fresh data in 15 minutes instead of 3 hours.",
        theory: {
          concept: "Every manual report contains three layers: (1) Data assembly — pulling numbers from systems and putting them in the right cells. (2) Calculation — computing ratios, growth rates, and comparisons. (3) Commentary — writing the narrative explanation of what the numbers mean. AI can systematically replace layer 3 and assist heavily with layers 1 and 2. The automation model is: define the report structure once as a template with labelled data placeholders, write standard AI prompts for each commentary section, and document the workflow so anyone with the right data can run the report. Once built a weekly operations report that took a finance analyst 3 hours to produce every Friday now takes 20 minutes — 15 to assemble the data, 5 to run the AI commentary prompts and review the output.",
          badExample: "Write the commentary for this week's operations report: [pastes a table of numbers]",
          badBreakdown: [
            { element: "Report context", present: "Not provided", problem: "AI does not know what this business does what the targets are or what good performance looks like for this specific organisation" },
            { element: "Comparison baseline", present: "Not specified", problem: "Without knowing whether this week was better or worse than last week or target AI produces generic observations not meaningful comparisons" },
            { element: "Commentary structure", present: "Not defined", problem: "AI will write whatever it decides is appropriate commentary structure which will be inconsistent week to week" },
            { element: "Tone and audience", present: "Not specified", problem: "Operations report commentary for a logistics CEO reads very differently from commentary for a field operations team" },
            { element: "Red flags", present: "Not defined", problem: "AI cannot distinguish a metric that requires urgent management action from one that is performing normally without knowing the thresholds" },
          ],
          badOutput: "This week's operations report shows some interesting results across various metrics. Delivery performance was reasonably good with some areas showing improvement. Customer satisfaction numbers were within an acceptable range. There are some areas that may warrant attention going forward.",
          goodExample: "You are the operations analyst for Fahari Logistics, a Nairobi-based last-mile delivery company operating in 3 cities. Write the weekly operations commentary for the CEO using this exact structure for every section: METRIC NAME | This week: [value] | vs Last week: [value and % change] | vs Target: [value and status RAG: Green Yellow Red] | One-sentence interpretation of what this means for the business. Business context: Green = at or above target. Yellow = within 5% below target. Red = more than 5% below target. Targets: on-time delivery 92%, customer complaints per 100 deliveries maximum 3, driver utilisation minimum 78%, fuel cost per delivery maximum KSh 380. Escalation rule: flag any Red metric with a one-sentence recommended action. This week's data: On-time delivery 89.3%, Complaints per 100 deliveries 4.1, Driver utilisation 81%, Fuel cost per delivery KSh 412. Last week: 91.2%, 2.8, 79%, KSh 398.",
          goodBreakdown: [
            { element: "Report context", present: "Fahari Logistics Nairobi last-mile delivery 3 cities", improvement: "AI commentary uses business-appropriate language and frames every metric in operational terms" },
            { element: "Comparison baseline", present: "Week-on-week comparison AND target comparison both specified", improvement: "Every number is immediately contextualised — is it improving or declining relative to last week and is it above or below standard?" },
            { element: "Commentary structure", present: "Exact 5-element structure per metric specified", improvement: "Output is identical in structure every week regardless of which analyst runs the prompt" },
            { element: "RAG system", present: "Green Yellow Red thresholds defined explicitly with numbers", improvement: "AI applies the same performance standards every week without subjective interpretation" },
            { element: "Escalation rule", present: "Red metric action recommendation required", improvement: "Report automatically flags management actions without the analyst having to add them manually each week" },
          ],
          goodOutput: "ON-TIME DELIVERY | This week: 89.3% | vs Last week: 91.2% (-2.1%) | vs Target 92%: RED (-2.9%) | Delivery performance has declined for the second consecutive week and now falls below the 92% customer SLA threshold — investigate whether route optimisation or traffic pattern changes are the primary driver. CUSTOMER COMPLAINTS | This week: 4.1 per 100 | vs Last week: 2.8 (+46%) | vs Target ≤3.0: RED (+37%) | Complaint rate has spiked significantly above target — cross-reference complaint categories to identify whether the increase is concentrated in specific routes drivers or time windows. DRIVER UTILISATION | This week: 81% | vs Last week: 79% (+2.5%) | vs Target 78%: GREEN (+3.9%) | Utilisation improving and above target — no action required. FUEL COST | This week: KSh 412 | vs Last week: KSh 398 (+3.5%) | vs Target ≤380: RED (+8.4%) | Fuel cost per delivery is running 8% above target and trending upward — review whether route efficiency or vehicle maintenance is the primary driver before next week's fleet review.",
          keyInsight: "The value of automated reporting is not just time saved. It is consistency. A manual report reflects the analyst's judgment about what to emphasise each week. An automated report applies the same standards every week — the same RAG thresholds, the same comparison baseline, the same escalation rules. This consistency means management can trust the report to flag the same things the same way every time. That trust is what makes a report actually used in decisions rather than just filed.",
          ruleToRemember: "Build the prompt once. Test it for 3 consecutive weeks. Document it. Then hand it to anyone in the team. If only you can run it it is not automated — it is just a workflow that depends on you.",
          checkYourUnderstanding: [
            {
              question: "What is the primary benefit of using a structured AI prompt template for weekly report commentary rather than writing the prompt fresh each week?",
              options: [
                "It saves the time of typing the same prompt repeatedly",
                "It ensures consistent standards metrics and thresholds are applied every week so the report is comparable across periods and trustworthy for decision-making",
                "It makes the report longer and more comprehensive each week",
                "It means the report does not need to be reviewed by a senior analyst before distribution",
              ],
              correctAnswer: 1,
              explanation: "Consistency is the primary value. A report that applies different standards different week produces findings that cannot be compared. Automated templates guarantee that the same business rules are applied every time.",
            },
            {
              question: "You have built an automated weekly report for your Mombasa-based shipping company. A new analyst joins the team. What is the minimum they need to run the report independently?",
              options: [
                "A full data science training programme covering all the underlying analytics concepts",
                "The documented report template the AI commentary prompts the data sources and a written procedure explaining how to update the data placeholders",
                "Direct supervision from you for at least 6 months before running it independently",
                "Access to the same AI subscription you use — nothing else is required",
              ],
              correctAnswer: 1,
              explanation: "A properly documented automated report is designed to be run by anyone with access to the data — not just the person who built it. If it requires the original analyst to run it the automation is incomplete.",
            },
            {
              question: "Your weekly report shows on-time delivery has been Red for 3 consecutive weeks. The automated commentary flags it each week. Management has not taken action. What is the correct analyst response?",
              options: [
                "Remove the Red flag from the report since management has already been informed",
                "Escalate beyond the weekly report — prepare a dedicated analysis document that quantifies the customer impact of the sustained underperformance and present it directly to the relevant decision-maker",
                "Change the target threshold so the metric moves from Red to Yellow",
                "Wait until management asks you to investigate — your role is to report not to recommend",
              ],
              correctAnswer: 1,
              explanation: "A sustained Red metric that has not been acted upon requires escalation beyond the regular report cycle. Your role includes surfacing the consequences of inaction in concrete business terms — lost customers, SLA penalty exposure, revenue risk — not just repeating the same flag weekly.",
            },
          ],
        },
        quizQuestions: [
          { question: "What are the three layers of any manual report that AI can help automate?", options: ["Planning writing and reviewing", "Data assembly calculation and commentary", "Research analysis and recommendation", "Collection storage and retrieval"], correctAnswer: 1 },
          { question: "You build an automated weekly sales dashboard for your team. Three weeks later a colleague runs it without you and produces the exact same quality output. What does this tell you?", options: ["Your colleague is technically skilled and could have built it themselves", "The automation is properly built — it is documented and replicable without the original analyst", "The report is too simple and should be made more sophisticated", "You should restrict access to protect the quality of the output"], correctAnswer: 1 },
          { question: "Why is consistency in automated reporting more valuable than flexibility in manual reporting?", options: ["Automation is always faster than manual reporting regardless of complexity", "Consistent reports apply the same standards every period making them comparable and trustworthy for longitudinal decision-making", "Automated reports are cheaper to produce than manual reports", "Consistency means the analyst does not need to review the output before distribution"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 7,
        title: "Final Project: Business Intelligence Report — Savannah Foods",
        type: "project",
        hook: "This project is the proof that you can take raw business data and turn it into a decision that a CEO would act on. Every data analytics job interview ends with a question that is a version of this: given this data what would you recommend?",
        duration_mins: 60,
        isAvailable: true,
        content: "Full business intelligence project for Savannah Foods Ltd. — a fictional Kenyan FMCG company. You will clean, analyse, find patterns, visualise, and deliver an executive recommendation.",
        sandboxTask: "You are the newly hired data analyst at Savannah Foods Ltd., a fictional Kenyan company manufacturing and distributing 8 food product lines (Unga ya Nguvu maize flour, Asali ya Savannah honey, Mafuta Safi cooking oil, Chai ya Jua tea, Sukari Nyeupe sugar, Uji Mix infant cereal, Biscuits wa Savannah, Mchele wa Pwani rice) across 4 regions: Nairobi Metro, Coast Region, Rift Valley, and Western Kenya. The CEO has asked you to produce a Q4 2024 business intelligence report before the January board meeting. Use the following summary data and AI tools to complete all 5 deliverables: DATA: Total Q4 revenue KSh 67.4M (Q3: KSh 48.3M, Q4 2023: KSh 52.1M). By region — Nairobi: KSh 29.2M, Coast: KSh 18.6M, Rift Valley: KSh 12.4M, Western: KSh 7.2M. By product — Maize flour: KSh 22.1M, Cooking oil: KSh 16.8M, Rice: KSh 9.3M, Tea: KSh 7.2M, Sugar: KSh 5.9M, others: KSh 6.1M. On-time delivery: 87% (target 92%). New distributors signed: 14 (target 10). Customer complaints: 186 (Q3: 142). Returns due to quality: 2.3% of units. Top complaint category: delayed delivery 58%, packaging damage 29%, wrong product 13%. DELIVERABLE 1 — DATA QUALITY AUDIT: Identify 4 data quality questions you would ask before trusting this summary data for a board presentation. For each question state what problem it would uncover and what the impact would be if undetected. DELIVERABLE 2 — EXECUTIVE MEMO (Pyramid Principle): Write a one-page board memo. First sentence: the single most important fact about Q4. Three supporting points: each with one specific number and one business implication. One recommended action with a 30-day timeline. Maximum 250 words. DELIVERABLE 3 — ANOMALY INVESTIGATION: Q4 revenue grew 40% vs Q3 — far above the seasonal norm. Write 3 specific AI prompts you would use to investigate whether this is genuine growth or a data quality issue. Explain what each prompt is designed to reveal. DELIVERABLE 4 — PATTERN ANALYSIS: Identify 3 specific business patterns visible in this data with the Kenyan business calendar context and state what action each pattern implies. DELIVERABLE 5 — REPORTING WORKFLOW: Design the prompt template for an automated monthly revenue report commentary using this business as the context. Include: business context, comparison baseline (month-on-month and target), RAG thresholds, escalation rules, and the exact structure for each metric. Show all AI prompts and outputs used for Deliverables 2 and 5.",
      },
    ],
    capstone: {
      title: "AI Data Analyst Certification — Savannah Foods Intelligence Report",
      description: "You are the lead data analyst at Savannah Foods Ltd. The board needs a full year business intelligence review before the annual strategy meeting. Your report will directly influence capital allocation decisions for the following year.",
      task: "Using the Savannah Foods Q4 data from Lesson 7 and the full-year context below produce a complete annual business intelligence report. Full year 2024 context: Total annual revenue KSh 198.4M (2023: KSh 172.1M — +15.3% growth). Best quarter: Q4 at KSh 67.4M. Worst quarter: Q1 at KSh 38.2M. Western Kenya has declined in all 4 quarters. Coastal region grew 31% YoY — fastest growing. On-time delivery averaged 84% across the year against a 92% target. The report must include: (1) Annual Executive Summary — 3-sentence bottom line covering growth performance, biggest opportunity, and the single most critical operational problem to fix. (2) Regional Analysis — which 2 regions to invest in next year and which 1 region requires a strategic review, with data justification for each decision. (3) Operational Risk Assessment — the on-time delivery gap against target represents real revenue risk — quantify the likely customer churn exposure in KSh terms using the complaint data. (4) 2025 Revenue Forecast — using the growth trend project Q1 2025 revenue with a rationale. (5) Top 3 Recommendations — each with a specific action owner timeline and expected KSh impact. The report must be specific enough that the board could vote on Recommendation 1 on the spot.",
      rubric: {
        specificity: { weight: 25, description: "Every recommendation includes specific numbers KSh values timelines and named owners — generic advice scores 0 to 10 specific actionable recommendations with Kenyan business context score 20 to 25" },
        businessAccuracy: { weight: 25, description: "Data analysis correctly reflects the provided numbers no arithmetic errors and regional and product insights accurately derived from the source data" },
        implementationRealism: { weight: 20, description: "Recommendations are achievable for a Kenyan FMCG company — not generic global best practice transplanted without adaptation" },
        ethicsQuality: { weight: 15, description: "Data quality concerns are acknowledged where the data might be incomplete or misleading and recommendations include appropriate caveats" },
        professionalQuality: { weight: 15, description: "The report could be handed to a Kenyan board of directors without editing — professional language no filler phrases correct structure" },
      },
      passingScore: 70,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 4 — whatsapp-ai-integration
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "whatsapp-ai-integration",
    title: "WhatsApp Business AI",
    tagline: "Build Bots That Handle Customers 24/7",
    description:
      "Build production-ready WhatsApp bots using Meta Cloud API and AI. The highest-demand technical skill in East African business right now. Deploy your first bot by lesson 4.",
    level: "Advanced",
    price_kes: 3500,
    lessons_count: 8,
    badge_name: "WhatsApp AI Developer",
    what_you_will_learn: [
      "Set up Meta Cloud API and send your first WhatsApp message via code in lesson 2",
      "Build a complete FAQ bot that handles 10 customer question types without human involvement",
      "Integrate an LLM so your bot understands free-form Swahili and English customer messages",
      "Automate transactional alerts — order confirmations, M-Pesa receipts, delivery updates",
      "Deploy a production bot with webhook, error handling, and fallback-to-human logic",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Welcome to WhatsApp Business AI",
        type: "intro" as const,
        hook: "A Nairobi property agency was paying 3 customer service agents to answer the same 15 questions on WhatsApp every day — opening hours, property prices, viewing slots. A developer built a bot in a weekend. The bot now handles 340 conversations daily. The three agents moved to closing deals. Revenue went up 40% in 90 days.",
        duration_mins: 5,
        isAvailable: true,
        content: "WhatsApp is not a messaging app in Kenya — it is the primary business communication channel for 95% of the market. This course teaches you to build AI-powered bots on Meta Cloud API that handle customer questions, qualify leads, send transactional alerts, and automate entire conversation flows. You will deploy real working code by lesson 4.",
        introWhoFor: [
          "A developer who wants to build high-value products for Kenyan and East African businesses",
          "A freelancer who wants a technical skill that every SME and corporate in Kenya is willing to pay for",
          "A business owner who wants to automate customer service without adding headcount",
          "A software student who wants a portfolio project with real commercial value and immediate deployment",
        ],
        introOutcomes: [
          "Set up a Meta Cloud API account and send your first WhatsApp message via code — by lesson 2",
          "Build a webhook server that receives and parses any incoming WhatsApp message type",
          "Build a complete FAQ bot that handles 10 question types including Swahili and English variations",
          "Integrate Claude or GPT as the AI intelligence layer — free-form messages handled automatically",
          "Deploy a production bot with full error handling, delivery tracking, and fallback-to-human logic",
        ],
        introStructure: {
          lessonsCount: 8,
          hours: 6,
          sandboxCount: 5,
          finalProject: "Production-deployed customer service bot for Savannah Properties — a fictional Kenyan real estate company",
        },
        introFirstTask: "Go to developers.facebook.com and create a free developer account right now. By the time you finish lesson 2 you will have sent your first WhatsApp message via code from that account.",
      },
      {
        lessonNumber: 1,
        title: "WhatsApp Business Platform — What It Is and Why It Matters",
        type: "video",
        hook: "WhatsApp has 3 billion active users. In Kenya its penetration among smartphone owners is over 95%. Every business in the country communicates with customers on WhatsApp. Most of them are doing it manually. That gap is your opportunity.",
        duration_mins: 9,
        isAvailable: true,
        content: "The WhatsApp Business ecosystem has three tiers. The free Business App for individuals. The Business Platform (Cloud API) for automation. And WhatsApp Flows for in-app forms and payments. This lesson covers the architecture, what each tier can do, the pricing model, and what Kenya's biggest businesses are already automating.",
        theory: {
          concept: "The Meta Cloud API (formerly the WhatsApp Business API) gives developers programmatic access to WhatsApp messaging at scale. Unlike the free Business App it can: send and receive messages from code, handle thousands of conversations simultaneously, integrate with databases and payment systems, trigger messages from external events like M-Pesa payments or order placements, and maintain 24/7 availability without a human operator. The architecture has four components: (1) Meta Cloud API — the server Meta runs that handles message routing, delivery, and compliance. (2) Your webhook server — the server you build that receives incoming messages and sends responses. (3) Your business logic — the code that decides how to respond to each message. (4) Message templates — pre-approved message formats for outbound business-initiated conversations. The 24-hour session rule is the most important policy to understand: if a customer messages you first you can reply freely for 24 hours. If you want to message a customer first you must use a pre-approved template. This is how Meta prevents spam.",
          badExample: "Build a WhatsApp bot using the WhatsApp Business App on my phone.",
          badBreakdown: [
            { element: "Automation capability", present: "Zero", problem: "The Business App requires a human to read and respond — it cannot be automated programmatically" },
            { element: "Scale", present: "One conversation at a time", problem: "One phone number can only have one active session — cannot handle concurrent conversations" },
            { element: "Integration", present: "Not possible", problem: "Cannot connect to databases payment systems or trigger messages from external events" },
            { element: "Reliability", present: "Depends on phone uptime", problem: "If the phone loses power or internet the bot stops — not suitable for production" },
            { element: "Analytics", present: "None", problem: "No way to track delivery rates, response times, or conversation outcomes at scale" },
          ],
          badOutput: "A WhatsApp Business App running on a phone that requires someone to check messages manually, cannot handle more than one conversation at once, and goes offline whenever the phone loses connection.",
          goodExample: "Build a WhatsApp bot on Meta Cloud API hosted on Railway.app. The bot runs on a Node.js server with a webhook endpoint that Meta calls every time a customer sends a message. The server processes the message, queries the business database, and sends a response via the Meta API — all within 2 seconds, 24 hours a day, 7 days a week, handling unlimited concurrent conversations.",
          goodBreakdown: [
            { element: "Automation capability", present: "Full programmatic control", improvement: "Every message triggers code — no human needed for any automated response" },
            { element: "Scale", present: "Unlimited concurrent conversations", improvement: "Server handles as many simultaneous conversations as needed — no bottleneck" },
            { element: "Integration", present: "Full API access to any database or system", improvement: "Bot can query M-Pesa status look up order details and update CRM records in real time" },
            { element: "Reliability", present: "Cloud-hosted with uptime monitoring", improvement: "99.9% uptime with automatic restarts and error alerts — bot never goes offline" },
            { element: "Analytics", present: "Full delivery tracking and conversation logging", improvement: "Every message status tracked — sent delivered read failed — with full conversation history" },
          ],
          goodOutput: "A production WhatsApp bot that: receives 340 customer messages daily, responds to 85% without human involvement, escalates the remaining 15% to a human agent with full conversation context, tracks delivery and read receipts for every message, and generates a daily report of top questions, response times, and escalation reasons.",
          keyInsight: "The Meta Cloud API is free for the first 1000 conversations per month. After that it costs approximately $0.0125 per conversation in Kenya (Category: Service). For a business handling 5,000 WhatsApp conversations per month the total API cost is roughly $50 — a fraction of one customer service agent salary. This is the economic argument that closes every client conversation.",
          ruleToRemember: "Never build a WhatsApp automation on the Business App. It is not automatable. The Cloud API is the only path to a real bot — and it is free to start.",
          checkYourUnderstanding: [
            {
              question: "A Nairobi hotel wants to automatically send booking confirmations to guests via WhatsApp when they complete a payment. Which WhatsApp tier must they use?",
              options: [
                "The free WhatsApp Business App — it supports automatic message sending",
                "The Meta Cloud API with a pre-approved message template — business-initiated messages require API access and template approval",
                "Any WhatsApp account — all WhatsApp versions support automated outbound messages",
                "WhatsApp Pay — the payment confirmation is sent automatically by WhatsApp's payment system",
              ],
              correctAnswer: 1,
              explanation: "Automated outbound messages (business to customer without the customer messaging first) require the Meta Cloud API and a pre-approved message template. The free Business App cannot send automated messages.",
            },
            {
              question: "A customer sends your bot a WhatsApp message at 9am. It is now 10pm the same day. Can you still send them a free-form reply without using a template?",
              options: [
                "No — the 24-hour window has closed and you must use a template",
                "Yes — the 24-hour window is still open since less than 24 hours have passed since the customer's message",
                "No — you can only reply within 1 hour of the customer's message",
                "Yes — templates are only required for bulk marketing messages not individual replies",
              ],
              correctAnswer: 1,
              explanation: "The 24-hour session window starts when the customer sends a message and lasts for 24 hours. At 10pm the same day you are 13 hours into the window — you can still send free-form replies. After 24 hours you must use a pre-approved template.",
            },
            {
              question: "What is the correct architecture for a production WhatsApp bot?",
              options: [
                "Meta Cloud API sends messages directly to the customer — no server required on your side",
                "Your server sends messages via the Meta Cloud API and receives incoming messages via a webhook that Meta calls when a customer writes",
                "WhatsApp stores conversation history and your server queries it periodically to check for new messages",
                "You embed a WhatsApp widget in your website and the customer messages your website directly",
              ],
              correctAnswer: 1,
              explanation: "The architecture is bidirectional: you POST to the Meta API to send messages, and Meta POSTs to your webhook URL to deliver incoming messages. Both directions require your server to be running and accessible on the internet.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is the primary advantage of the Meta Cloud API over the free WhatsApp Business App for businesses?", options: ["The Cloud API is cheaper than the Business App", "The Cloud API allows programmatic automation of unlimited concurrent conversations integrated with external systems", "The Cloud API gives you a verified green tick automatically", "The Cloud API allows you to send messages to groups of more than 256 people"], correctAnswer: 1 },
          { question: "A customer messages your WhatsApp bot at 2pm. At what time does the 24-hour free-reply window close?", options: ["2pm the same day", "2pm the following day — 24 hours after the customer's message", "Midnight of the same day", "48 hours after the customer's message"], correctAnswer: 1 },
          { question: "What must you use when you want to send a WhatsApp message to a customer who has NOT messaged you first in the last 24 hours?", options: ["A regular text message — no special format needed", "A pre-approved message template submitted and approved by Meta", "A broadcast list message available in the Business App", "A WhatsApp Pay transaction which automatically generates a message"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 2,
        title: "Meta Cloud API Setup — From Zero to First Message",
        type: "sandbox",
        hook: "Most developers spend a week fighting the Meta setup. We are going to do it in one lesson by following the exact sequence that works — and explaining every error you will hit along the way.",
        duration_mins: 20,
        isAvailable: true,
        content: "Step-by-step Meta Cloud API setup: developer account, Facebook App creation, WhatsApp Business account configuration, test number setup, access token generation, and your first API call. Includes the exact curl command and Node.js code to send your first message.",
        sandboxTask: `Complete the Meta Cloud API setup and send your first WhatsApp message via code. Follow these exact steps:\n\nSTEP 1 — DEVELOPER ACCOUNT: Go to developers.facebook.com → Create Account → choose Business Developer. Use your personal Facebook account or create one.\n\nSTEP 2 — CREATE APP: My Apps → Create App → Business type → give it a name like "Tundemy Bot Demo". Add the WhatsApp product from the product list.\n\nSTEP 3 — CONFIGURE WHATSAPP: In your app, go to WhatsApp → API Setup. You will see a test phone number (provided by Meta) and a recipient field. Add your own WhatsApp number as the test recipient and verify it with the OTP.\n\nSTEP 4 — SEND YOUR FIRST MESSAGE via curl (replace YOUR_TOKEN and YOUR_PHONE_NUMBER):\n\ncurl -X POST https://graph.facebook.com/v19.0/YOUR_PHONE_ID/messages \\\n  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "messaging_product": "whatsapp",\n    "to": "254XXXXXXXXX",\n    "type": "text",\n    "text": { "body": "Habari! This is my first WhatsApp API message. — Tundemy Course" }\n  }'\n\nSTEP 5 — SAME CALL IN NODE.JS:\nconst axios = require("axios");\naxios.post(\n  \`https://graph.facebook.com/v19.0/\${process.env.PHONE_NUMBER_ID}/messages\`,\n  {\n    messaging_product: "whatsapp",\n    to: process.env.RECIPIENT_PHONE,\n    type: "text",\n    text: { body: "Habari! First WhatsApp API message from Node.js." }\n  },\n  { headers: { Authorization: \`Bearer \${process.env.WHATSAPP_TOKEN}\` } }\n);\n\nSubmit: (1) a screenshot of the WhatsApp message received on your phone, (2) the curl command you used with credentials replaced by [REDACTED], (3) any errors you hit and how you resolved them.`,
        quizQuestions: [
          { question: "Where in the Meta developer dashboard do you find your Phone Number ID (required for the API endpoint)?", options: ["In the App Settings under Basic", "In WhatsApp → API Setup — it is listed alongside your test phone number", "In the Business Manager under Phone Numbers", "You generate it yourself when creating the app"], correctAnswer: 1 },
          { question: "You send the curl command and get error code 190: Invalid OAuth access token. What is the most likely cause?", options: ["Your phone number is not verified in the test recipients list", "The access token has expired (temporary tokens from the dashboard last 24 hours) — generate a new one or use a permanent system user token", "The curl command has a syntax error in the JSON body", "You need to upgrade to a paid Meta Business account"], correctAnswer: 1 },
          { question: "Why must you store your WhatsApp API token in an environment variable rather than hardcoding it in your code?", options: ["Environment variables make the code run faster", "Hardcoded credentials in code can be exposed if the code is shared or committed to a public GitHub repository — environment variables keep secrets out of source code", "Meta requires environment variables for API authentication to work", "Hardcoded tokens stop working after 1 hour"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 3,
        title: "Sending All Message Types — Text, Media, Templates, and Interactive",
        type: "sandbox",
        hook: "Most developers only ever send plain text messages. The businesses that pay the most for WhatsApp bots want buttons, lists, images, and document attachments. Learn all of them and you immediately separate yourself from 80% of developers in the market.",
        duration_mins: 20,
        isAvailable: true,
        content: "Complete guide to every message type in the WhatsApp Cloud API: text, image, document, audio, video, location, interactive list messages, interactive reply buttons, and pre-approved message templates. Includes working Node.js code for each type.",
        sandboxTask: `Build a Node.js script called whatsapp-sender.js that sends 5 different message types to a test number. Use this code as your starting structure:\n\nconst axios = require("axios");\nconst PHONE_ID = process.env.PHONE_NUMBER_ID;\nconst TOKEN = process.env.WHATSAPP_TOKEN;\nconst TO = process.env.RECIPIENT_PHONE; // format: 254XXXXXXXXX\n\nconst api = axios.create({\n  baseURL: \`https://graph.facebook.com/v19.0/\${PHONE_ID}\`,\n  headers: { Authorization: \`Bearer \${TOKEN}\`, "Content-Type": "application/json" }\n});\n\n// 1. PLAIN TEXT\nasync function sendText(to, message) {\n  return api.post("/messages", {\n    messaging_product: "whatsapp",\n    to, type: "text",\n    text: { body: message }\n  });\n}\n\n// 2. IMAGE WITH CAPTION\nasync function sendImage(to, imageUrl, caption) {\n  return api.post("/messages", {\n    messaging_product: "whatsapp",\n    to, type: "image",\n    image: { link: imageUrl, caption }\n  });\n}\n\n// 3. INTERACTIVE REPLY BUTTONS (max 3 buttons)\nasync function sendButtons(to, bodyText, buttons) {\n  return api.post("/messages", {\n    messaging_product: "whatsapp",\n    to, type: "interactive",\n    interactive: {\n      type: "button",\n      body: { text: bodyText },\n      action: {\n        buttons: buttons.map((b, i) => ({\n          type: "reply",\n          reply: { id: \`btn_\${i}\`, title: b }\n        }))\n      }\n    }\n  });\n}\n\n// 4. INTERACTIVE LIST MESSAGE (for menus with up to 10 options)\nasync function sendList(to, headerText, bodyText, buttonText, sections) {\n  return api.post("/messages", {\n    messaging_product: "whatsapp",\n    to, type: "interactive",\n    interactive: {\n      type: "list",\n      header: { type: "text", text: headerText },\n      body: { text: bodyText },\n      action: { button: buttonText, sections }\n    }\n  });\n}\n\n// 5. APPROVED TEMPLATE MESSAGE\nasync function sendTemplate(to, templateName, langCode, components) {\n  return api.post("/messages", {\n    messaging_product: "whatsapp",\n    to, type: "template",\n    template: { name: templateName, language: { code: langCode }, components }\n  });\n}\n\n// Run all 5 — build a Savannah Properties bot greeting sequence\nasync function main() {\n  await sendText(TO, "Habari! Welcome to Savannah Properties. How can we help you today?");\n  await sendImage(TO, "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600", "🏡 Featured: 3BR Apartment in Kilimani — KSh 8.5M");\n  await sendButtons(TO, "What would you like to do?", ["View Properties", "Book a Viewing", "Talk to Agent"]);\n  await sendList(TO, "Our Properties", "Select a property to learn more:", "Browse Listings", [\n    { title: "Nairobi", rows: [\n      { id: "prop_1", title: "Kilimani 3BR", description: "KSh 8.5M | 3 bed 2 bath" },\n      { id: "prop_2", title: "Westlands Studio", description: "KSh 3.2M | 1 bed 1 bath" },\n    ]},\n    { title: "Mombasa", rows: [\n      { id: "prop_3", title: "Nyali 4BR", description: "KSh 12M | 4 bed 3 bath ocean view" },\n    ]}\n  ]);\n  // Template — must be pre-approved. Use Meta's default "hello_world" template:\n  await sendTemplate(TO, "hello_world", "en_US", []);\n}\n\nmain().catch(console.error);\n\nSubmit: (1) your completed whatsapp-sender.js with any customisations, (2) screenshots of all 5 message types received on your phone, (3) the JSON response body from the API for the interactive list message (shows message ID and status).`,
        quizQuestions: [
          { question: "A Nairobi restaurant wants customers to choose from a menu of 8 items on WhatsApp. Which interactive message type should you use?", options: ["Reply buttons — can hold up to 8 options as individual buttons", "List message — designed for menus and selections of 4 to 10 items", "Template message — pre-approved menus can include all items", "Plain text — list all items with numbered options and ask customer to reply with a number"], correctAnswer: 1 },
          { question: "You send an image message with a link to a JPG hosted on your server but the customer only receives a broken image. What is the most likely cause?", options: ["WhatsApp does not support JPG format — use PNG instead", "The image URL must be publicly accessible on the internet — if your server is on localhost or behind authentication Meta cannot download it", "The image file size exceeds 5KB", "You need to first upload the image to Meta's media servers using the media upload endpoint"], correctAnswer: 1 },
          { question: "What is the key difference between an interactive reply button message and a list message?", options: ["Buttons are for payments, list messages are for general selections", "Buttons show maximum 3 options directly in the chat bubble, list messages support 4–10 options in a scrollable menu — choose based on number of options", "List messages require template approval, buttons do not", "Buttons can only be used in template messages, not in session messages"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 4,
        title: "Receiving Messages — Webhooks and Bot Logic",
        type: "sandbox",
        hook: "Sending messages is 20% of building a bot. Receiving messages, parsing them, and responding intelligently is the other 80%. This is where the real engineering happens.",
        duration_mins: 25,
        isAvailable: true,
        content: "Build a complete webhook server that receives all WhatsApp message types, verifies requests from Meta, parses the payload structure, and routes messages to the correct handler. Then add AI-powered intent detection using the Claude API so the bot understands free-form Kenyan business messages in Swahili and English.",
        sandboxTask: `Build a complete webhook server for a Savannah Properties WhatsApp bot. Your server must handle all incoming message types and respond intelligently.\n\nPART 1 — WEBHOOK SERVER (Express.js):\n\nconst express = require("express");\nconst crypto = require("crypto");\nconst axios = require("axios");\nconst Anthropic = require("@anthropic-ai/sdk");\nconst app = express();\napp.use(express.json());\n\nconst VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN; // set any string\nconst WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;\nconst PHONE_ID = process.env.PHONE_NUMBER_ID;\nconst claude = new Anthropic();\n\n// WEBHOOK VERIFICATION (Meta calls this once when you register)\napp.get("/webhook", (req, res) => {\n  const mode = req.query["hub.mode"];\n  const token = req.query["hub.verify_token"];\n  const challenge = req.query["hub.challenge"];\n  if (mode === "subscribe" && token === VERIFY_TOKEN) {\n    console.log("Webhook verified");\n    res.status(200).send(challenge);\n  } else {\n    res.sendStatus(403);\n  }\n});\n\n// INCOMING MESSAGES\napp.post("/webhook", async (req, res) => {\n  res.sendStatus(200); // always respond 200 immediately\n  const entry = req.body?.entry?.[0];\n  const changes = entry?.changes?.[0];\n  const value = changes?.value;\n  if (!value?.messages) return; // delivery receipts, not messages\n  const msg = value.messages[0];\n  const from = msg.from; // sender's phone number\n  const msgType = msg.type;\n  let userText = "";\n  if (msgType === "text") userText = msg.text.body;\n  else if (msgType === "interactive") {\n    if (msg.interactive.type === "button_reply") userText = msg.interactive.button_reply.title;\n    else if (msg.interactive.type === "list_reply") userText = msg.interactive.list_reply.title;\n  } else {\n    await sendWhatsApp(from, "Asante! Tunasupport maandishi tu kwa sasa. Tuma swali lako kwa maandishi.");\n    return;\n  }\n  await handleMessage(from, userText);\n});\n\n// AI-POWERED RESPONSE HANDLER\nasync function handleMessage(to, userMessage) {\n  const systemPrompt = \`You are a helpful WhatsApp assistant for Savannah Properties, a Kenyan real estate company. \n  You answer questions about our properties and help customers book viewings.\n  Properties available:\n  - Kilimani 3BR apartment: KSh 8.5M (3 bed, 2 bath, DSQ, parking)\n  - Westlands Studio: KSh 3.2M (1 bed, 1 bath, gym access)\n  - Nyali Mombasa 4BR: KSh 12M (4 bed, 3 bath, ocean view, pool)\n  - Ruiru 4BR townhouse: KSh 6.8M (4 bed, 3 bath, gated community)\n  Opening hours: Mon-Sat 8am-6pm. Phone: +254 700 000 000.\n  Keep responses under 150 words. Be warm and professional. \n  If asked to book a viewing ask for: preferred property, preferred date, their name, and phone number.\n  Respond in the same language the customer uses (English or Swahili).\`;\n  const response = await claude.messages.create({\n    model: "claude-haiku-4-5-20251001",\n    max_tokens: 300,\n    system: systemPrompt,\n    messages: [{ role: "user", content: userMessage }]\n  });\n  const reply = response.content[0].text;\n  await sendWhatsApp(to, reply);\n}\n\nasync function sendWhatsApp(to, text) {\n  await axios.post(\n    \`https://graph.facebook.com/v19.0/\${PHONE_ID}/messages\`,\n    { messaging_product: "whatsapp", to, type: "text", text: { body: text } },\n    { headers: { Authorization: \`Bearer \${WHATSAPP_TOKEN}\` } }\n  );\n}\n\napp.listen(3000, () => console.log("WhatsApp bot server running on port 3000"));\n\nPART 2 — LOCAL TESTING WITH NGROK:\n1. Install ngrok: npm install -g ngrok\n2. Start your server: node server.js\n3. Expose it: ngrok http 3000\n4. Copy the https URL from ngrok (e.g. https://abc123.ngrok.io)\n5. In Meta developer dashboard → WhatsApp → Configuration → Webhook URL: https://abc123.ngrok.io/webhook\n6. Set Verify Token to the same value as your WEBHOOK_VERIFY_TOKEN env var\n7. Subscribe to messages fields\n8. Send yourself a WhatsApp message on the test number and watch it appear in your server logs\n\nSubmit: (1) your complete server.js code, (2) a screenshot of your terminal showing an incoming message being received and logged, (3) a screenshot of the bot's AI-generated reply received on your phone, (4) test the bot with these 3 messages and show each response: "What properties do you have in Nairobi?", "Nataka kubook viewing ya Kilimani apartment", "What are your opening hours?"`,
        quizQuestions: [
          { question: "Why must your webhook endpoint return HTTP 200 immediately when Meta posts an incoming message — before processing it?", options: ["Meta requires the 200 to confirm your server received the message — if you delay responding past 20 seconds Meta will retry the delivery multiple times causing duplicate processing", "The 200 response tells Meta what language to use in the message", "You need to return the bot response in the HTTP 200 body", "Meta only sends one message at a time so timing does not matter"], correctAnswer: 0 },
          { question: "A customer sends your bot a voice note. Your webhook receives a message with type: 'audio'. What is the correct handling if your bot does not support audio?", options: ["Ignore the message entirely — audio messages do not require a response", "Send a friendly text reply explaining audio is not supported and ask them to type their question — never silently ignore customer messages", "Forward the audio to a human agent via email", "Transcribe the audio automatically using the Meta API"], correctAnswer: 1 },
          { question: "You want your WhatsApp bot to remember that customer +254712345678 asked about the Kilimani property 10 minutes ago so you can give contextual follow-up answers. How do you implement this?", options: ["WhatsApp Cloud API stores conversation history automatically — retrieve it from Meta", "Store conversation history in a database or in-memory cache keyed by phone number — include previous messages in the AI system prompt for context", "Use cookies — WhatsApp bots support session cookies like websites", "The AI model remembers automatically without any state management"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 5,
        title: "Building a Complete FAQ Bot for a Kenyan Business",
        type: "sandbox",
        hook: "FAQ automation is the entry point for 80% of WhatsApp bot projects in East Africa. A well-built FAQ bot handles 200 to 400 customer conversations per day with zero human involvement. This is the project that gets you hired.",
        duration_mins: 25,
        isAvailable: true,
        content: "Build a production-quality FAQ bot for Kifaru Insurance — a fictional Kenyan insurance company. The bot handles policy inquiries, claim status checks, premium payment confirmations, and emergency contacts. It uses Claude for natural language understanding and falls back to a human agent for complex cases.",
        sandboxTask: `Build a complete FAQ bot for Kifaru Insurance Kenya. The bot must handle 10 question categories in both English and Swahili with AI-powered understanding.\n\nBUSINESS CONTEXT:\nKifaru Insurance Kenya offers: motor insurance (comprehensive from KSh 25,000/year), health insurance (individual from KSh 18,000/year, family from KSh 45,000/year), home insurance (from KSh 8,000/year). Claims hotline: +254 700 123 456. Office: Upperhill, Nairobi. Hours: Mon-Fri 8am-5pm, Sat 9am-1pm.\n\nYOUR BOT MUST HANDLE THESE 10 CATEGORIES:\n1. Policy pricing inquiries ("How much is motor insurance?")\n2. Claims process ("How do I make a claim?")\n3. Claims status check ("What is the status of my claim?")\n4. Premium payment ("How do I pay my premium?")\n5. Policy documents ("I need my policy certificate")\n6. Emergency/accident ("I have had an accident")\n7. Agent contact ("I want to speak to someone")\n8. Office location and hours\n9. New policy application ("I want to buy insurance")\n10. General greetings in Swahili and English\n\nTECHNICAL REQUIREMENTS:\n- Use Claude claude-haiku-4-5-20251001 for intent detection and response generation\n- System prompt must include all 10 categories with specific answers and KSh pricing\n- Bot must detect when a question is outside its scope and offer to connect to an agent\n- Bot must respond in the same language as the customer (English or Swahili)\n- For emergency messages (accident, urgent claim) bot must immediately provide the claims hotline number\n- Keep all responses under 200 words and conversational — no corporate filler\n- Log every conversation turn to console with timestamp, phone number (masked), intent, and response length\n\nSYSTEM PROMPT TEMPLATE:\nconst KIFARU_SYSTEM_PROMPT = \`You are the WhatsApp assistant for Kifaru Insurance Kenya. Your job is to help customers with insurance questions.\n\nOur products and pricing:\n- Motor insurance: comprehensive from KSh 25,000/year, third party from KSh 7,500/year\n- Health insurance: individual from KSh 18,000/year, family (up to 4) from KSh 45,000/year  \n- Home insurance: from KSh 8,000/year covering fire, theft, and natural disasters\n\nFor claims: guide customer to call +254 700 123 456 or visit Upperhill office\nFor payments: M-Pesa paybill 400200, account number = policy number\nFor emergencies/accidents: IMMEDIATELY provide +254 700 123 456 — treat as priority\nFor agent requests: offer to have agent call them back within 30 minutes during business hours\n\nRules: respond in customer's language, be warm and helpful, keep under 200 words, never invent policy details not listed above.\`;\n\nSubmit: (1) complete server code with the 10-category bot, (2) a conversation log showing at least 8 of the 10 categories being tested with realistic customer messages (mix English and Swahili), (3) show how the bot handles an out-of-scope question like "Can you insure my crops?", (4) show the emergency handling for "Nimepata accident — help!"`,
        quizQuestions: [
          { question: "A customer sends your Kifaru Insurance bot: 'nimepata accident gari langu imeharibiwa' (I had an accident my car is damaged). What should the bot's immediate response include?", options: ["Ask the customer for their policy number before providing any assistance", "Immediately provide the emergency claims hotline number +254 700 123 456 and express urgency — accident messages are always priority responses", "Explain the claims process step by step in detail before providing any phone number", "Forward the message to a human agent and tell the customer to wait"], correctAnswer: 1 },
          { question: "How do you make a WhatsApp bot respond in Swahili when the customer writes in Swahili and in English when the customer writes in English?", options: ["Build two separate bots — one trained in Swahili and one in English", "Include an instruction in the system prompt: respond in the same language as the customer's message — the AI model handles the language detection automatically", "Use a translation API to translate all messages to English first then translate responses back", "Detect the language with a separate API call before sending to the AI model"], correctAnswer: 1 },
          { question: "Your FAQ bot is asked 'Can you insure my maize crop against drought?' — a valid business question but outside its current coverage. What is the best bot response?", options: ["Tell the customer Kifaru does not offer crop insurance and end the conversation", "Apologise and say the bot does not understand the question", "Acknowledge the inquiry honestly, explain current product range briefly, and offer to connect them with an agent who can advise on specialised cover — do not lose the potential customer", "Redirect to the website and end the conversation"], correctAnswer: 2 },
        ],
      },
      {
        lessonNumber: 6,
        title: "Transactional Alerts — M-Pesa, Order Updates, and Automated Notifications",
        type: "reading",
        hook: "Every completed M-Pesa transaction that does not immediately trigger a WhatsApp confirmation is a missed customer experience opportunity. Every order that ships without a WhatsApp update generates a support call. Transactional alerts are the highest-ROI WhatsApp automation for any Kenyan business with transactions.",
        duration_mins: 8,
        isAvailable: true,
        content: "How to build event-driven WhatsApp notifications that trigger automatically from M-Pesa callbacks, order status changes, appointment confirmations, and any other business event. Includes the template approval process, opt-in compliance, and the exact code pattern for triggering messages from backend events.",
        readingTopics: [
          "Event-driven messaging architecture — how your backend triggers WhatsApp messages on business events",
          "Message template creation and approval — the exact format Meta requires for outbound business messages",
          "M-Pesa C2B callback integration — triggering a WhatsApp confirmation on every successful payment",
          "Order lifecycle notifications — placed, confirmed, shipped, delivered, failed",
          "Opt-in compliance — how to get and record customer consent for outbound WhatsApp messaging",
        ],
        theory: {
          concept: "Transactional WhatsApp alerts work on the event-driven model: a business event occurs (payment received, order shipped, appointment confirmed) → your system detects it → your code calls the Meta API with a pre-approved template → the customer receives a WhatsApp notification within 2-3 seconds. The key constraint is the message template: any message you send to a customer who has not messaged you in the last 24 hours must use a pre-approved template. Templates are plain text with numbered variable placeholders like {{1}} and {{2}}. You submit them to Meta for approval which typically takes 2-24 hours. Once approved you can use them programmatically with dynamic values. The M-Pesa integration is the most common transactional use case in Kenya: Safaricom sends a C2B callback to your webhook when a customer pays → your code extracts the transaction details → sends a WhatsApp template message with the payment confirmation. The entire flow takes under 5 seconds from payment to WhatsApp notification.",
          badExample: "Send a WhatsApp message to customers whenever they pay using a regular session message in the message body field.",
          badBreakdown: [
            { element: "Template compliance", present: "Violated", problem: "Session messages (free-form text) can only be sent within 24 hours of the customer messaging you first — payment events often occur outside this window" },
            { element: "Delivery guarantee", present: "Not present", problem: "Non-template outbound messages to customers outside the 24h window will be rejected by Meta with error code 131030" },
            { element: "Opt-in proof", present: "Not recorded", problem: "Meta requires proof that customers have opted in to receive business-initiated messages — sending without opt-in risks account suspension" },
            { element: "Retry logic", present: "Absent", problem: "If the API call fails the customer never gets their payment confirmation — no retry mechanism means lost notifications" },
            { element: "Variable handling", present: "Hardcoded", problem: "Each customer has different transaction amounts, dates, and reference numbers — hardcoding means building a new message per transaction instead of one template that handles all" },
          ],
          badOutput: "Customer pays KSh 2,500. Your system tries to send a free-form WhatsApp message. Meta rejects it with error 131030 because the customer has not messaged you in the last 24 hours and you are not using a template. Customer never receives confirmation. Customer calls your support line to confirm payment.",
          goodExample: "Template name: payment_confirmation. Template body: 'Habari {{1}}, tunakushukuru kwa malipo yako. Tumepokea KSh {{2}} kwa {{3}}. Kumbukumbu namba: {{4}}. Kwa maswali piga: +254 700 000 000.' (Translation: 'Hello {{1}}, thank you for your payment. We received KSh {{2}} for {{3}}. Reference: {{4}}.'). Code: after M-Pesa C2B callback verification, call sendTemplate(customerPhone, 'payment_confirmation', 'sw', [customerName, amount, productDescription, mpesaRef]).",
          goodBreakdown: [
            { element: "Template compliance", present: "Fully compliant approved template with variable placeholders", improvement: "Can be sent to any customer at any time regardless of when they last messaged you" },
            { element: "Delivery guarantee", present: "API response checked with retry on failure", improvement: "If first attempt fails the system retries after 30 seconds — customer always gets their confirmation" },
            { element: "Opt-in proof", present: "Recorded during checkout — customer ticked WhatsApp notification consent", improvement: "Meta audit trail exists — account suspension risk eliminated" },
            { element: "Variables", present: "4 dynamic variables: name, amount, product, reference", improvement: "One template handles every payment confirmation for every customer with correct personalised details" },
            { element: "Swahili language", present: "Template in Swahili matching primary customer language", improvement: "Higher open and engagement rates — customers respond better to their primary language" },
          ],
          goodOutput: "Customer pays KSh 2,500 via M-Pesa. Safaricom sends C2B callback to your server in 3 seconds. Your server verifies the callback HMAC signature, extracts customer name, amount, and M-Pesa reference. Calls Meta API with payment_confirmation template. Customer receives WhatsApp: 'Habari Amina, tunakushukuru kwa malipo yako. Tumepokea KSh 2,500 kwa Health Insurance Premium. Kumbukumbu namba: QHJ7Y3X9KL. Kwa maswali piga: +254 700 000 000.' Delivered in under 5 seconds from payment.",
          keyInsight: "The full M-Pesa to WhatsApp notification flow: (1) Register your C2B URL with Safaricom Daraja API. (2) Customer pays via M-Pesa. (3) Safaricom POSTs transaction details to your C2B URL. (4) Verify the request is genuinely from Safaricom (check IP and credentials). (5) Extract phone number, amount, and M-Pesa code from the payload. (6) Format phone number to 254XXXXXXXXX (Daraja sends as 254712345678 or 0712345678). (7) Call Meta API with your payment template and the transaction variables. (8) Log success or retry on failure.",
          ruleToRemember: "Every outbound business-initiated WhatsApp message to a customer who has not messaged you in the last 24 hours must use an approved template. Never attempt free-form outbound messages. The error code is 131030. The solution is always a template.",
          checkYourUnderstanding: [
            {
              question: "A customer completed an M-Pesa payment at 11am. It is now 2pm the same day and you want to send them an order shipped notification. Must you use a template?",
              options: [
                "No — the 24-hour window is still open so you can send free-form messages",
                "Yes — you must use a template unless the customer sent you a WhatsApp message after the payment, opening a new 24-hour session",
                "No — M-Pesa payment receipts count as customer-initiated contact opening a session",
                "Yes — all transactional messages always require templates regardless of session status",
              ],
              correctAnswer: 1,
              explanation: "The 24-hour session opens when the customer messages you on WhatsApp — not when they pay. Completing an M-Pesa payment does not open a WhatsApp session. Unless the customer sent you a WhatsApp message after 11am you must use a template for all outbound messages.",
            },
            {
              question: "Your M-Pesa C2B callback sends phone numbers in the format 254712345678 but the Meta API requires 254712345678 as well. A junior developer suggests stripping the 254 prefix. What should you advise?",
              options: [
                "Agree — the Meta API only accepts 10-digit numbers without country code",
                "Disagree — Meta requires the full international format with country code but no + prefix. 254712345678 is already correct — no modification needed",
                "Agree partially — remove the 254 and add a + to get +712345678",
                "Disagree — first convert to the 07XXXXXXXX format then add the country code prefix",
              ],
              correctAnswer: 1,
              explanation: "The Meta Cloud API requires phone numbers in international format with country code and no + prefix — exactly the format Daraja already provides: 254712345678. No conversion needed. The bug the developer wants to introduce would break every notification to Kenyan phone numbers.",
            },
            {
              question: "What is the correct way to get customer consent for receiving WhatsApp transactional notifications from your business?",
              options: [
                "Buy a list of Kenyan phone numbers and send them promotional WhatsApp messages — they can opt out if they do not want them",
                "Add a checkbox during registration or checkout: 'Receive order updates and payment confirmations on WhatsApp' — record the consent with a timestamp in your database",
                "Consent is not required — Meta only requires templates for marketing messages not transactional ones",
                "Send the first message using a template and add an opt-out button — consent is implicit if they do not opt out",
              ],
              correctAnswer: 1,
              explanation: "Meta requires documented opt-in before sending business-initiated WhatsApp messages. The consent must be explicit (a checkbox or similar), specific about WhatsApp messaging, and recorded with a timestamp. Implicit consent or purchased lists violate WhatsApp Business Policy and risk account suspension.",
            },
          ],
        },
        quizQuestions: [
          { question: "What error code does Meta return when you try to send a free-form outbound message to a customer outside the 24-hour session window?", options: ["Error 400 — Bad Request", "Error 131030 — Template required for business-initiated messages outside session window", "Error 401 — Unauthorized", "Error 429 — Rate limit exceeded"], correctAnswer: 1 },
          { question: "How do you include a customer's name and payment amount dynamically in a WhatsApp message template?", options: ["Use string concatenation to build different templates for each customer", "Use numbered variable placeholders like {{1}} and {{2}} in the template body and pass the values as components when calling the API", "Submit a new template for each unique message — Meta approves them instantly", "Templates cannot include dynamic content — only static text"], correctAnswer: 1 },
          { question: "Your payment confirmation WhatsApp notification is failing for some customers. The API returns success but the customer reports not receiving the message. What is the most useful diagnostic first step?", options: ["Resend the message immediately", "Check the delivery status webhook — Meta sends sent/delivered/read/failed callbacks to your webhook for every message so you can see exactly where delivery failed", "Ask the customer to check their spam folder", "Assume the customer has blocked your number"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 7,
        title: "Multi-Step Conversation Flows — Booking, Orders, and Lead Qualification",
        type: "sandbox",
        hook: "Single-turn bots answer questions. Multi-turn bots complete entire transactions. A bot that books a viewing, takes a food order, or qualifies a sales lead through a natural WhatsApp conversation generates 10× more value than a bot that just answers FAQs. This is the lesson that separates the developers who get the big projects.",
        duration_mins: 25,
        isAvailable: true,
        content: "Build a multi-step conversation flow for a Nairobi dental clinic appointment booking system. The bot collects service type, preferred date, patient name, and phone number — validates each input — confirms the appointment — and sends a WhatsApp confirmation. Uses a state machine pattern for managing conversation context.",
        sandboxTask: `Build a complete appointment booking bot for Smile Bright Dental Clinic — a fictional Nairobi dental clinic at Westlands. The bot must guide patients through a full booking flow using a state machine pattern.\n\nCLINIC INFO:\n- Services: Cleaning (KSh 2,500), Filling (KSh 4,000), Extraction (KSh 3,500), Whitening (KSh 8,000), Consultation (KSh 1,500)\n- Available slots: Mon-Fri 9am, 11am, 2pm, 4pm. Sat 9am, 11am\n- Address: Westlands, Nairobi. Tel: +254 700 999 000\n\nSTATE MACHINE DESIGN:\nEach patient session has a state tracked in memory (use a Map keyed by phone number). States: START → COLLECT_SERVICE → COLLECT_DATE → COLLECT_NAME → COLLECT_PHONE → CONFIRM → BOOKED\n\nIMPLEMENT THIS EXACT STATE MACHINE:\n\nconst sessions = new Map(); // phone → { state, service, date, name, patientPhone }\n\nasync function handleBookingFlow(from, userMessage) {\n  let session = sessions.get(from) || { state: "START" };\n  \n  if (userMessage.toLowerCase().includes("book") || session.state === "START") {\n    session.state = "COLLECT_SERVICE";\n    sessions.set(from, session);\n    await sendList(from, "Book Appointment", "Which service do you need?", "Select Service", [\n      { title: "Services", rows: [\n        { id: "cleaning", title: "Cleaning", description: "KSh 2,500 | 30 mins" },\n        { id: "filling", title: "Filling", description: "KSh 4,000 | 45 mins" },\n        { id: "extraction", title: "Extraction", description: "KSh 3,500 | 30 mins" },\n        { id: "whitening", title: "Whitening", description: "KSh 8,000 | 60 mins" },\n        { id: "consultation", title: "Consultation", description: "KSh 1,500 | 20 mins" },\n      ]}\n    ]);\n    return;\n  }\n  \n  if (session.state === "COLLECT_SERVICE") {\n    session.service = userMessage;\n    session.state = "COLLECT_DATE";\n    sessions.set(from, session);\n    await sendButtons(from, \n      \`Great! You selected: *\${session.service}*\\n\\nWhich day works for you?\`,\n      ["Mon-Fri", "Saturday", "Call me to confirm"]\n    );\n    return;\n  }\n  \n  if (session.state === "COLLECT_DATE") {\n    session.date = userMessage;\n    session.state = "COLLECT_NAME";\n    sessions.set(from, session);\n    await sendWhatsApp(from, "Please type your full name:");\n    return;\n  }\n  \n  if (session.state === "COLLECT_NAME") {\n    if (userMessage.trim().split(" ").length < 2) {\n      await sendWhatsApp(from, "Please enter your full name (first and last name):");\n      return;\n    }\n    session.name = userMessage;\n    session.state = "COLLECT_PHONE";\n    sessions.set(from, session);\n    await sendWhatsApp(from, "What phone number should we use for the reminder? (or type SAME to use this number)");\n    return;\n  }\n  \n  if (session.state === "COLLECT_PHONE") {\n    session.patientPhone = userMessage === "SAME" ? from : userMessage;\n    session.state = "CONFIRM";\n    sessions.set(from, session);\n    const summary = \`📋 *Booking Summary*\\n\\n\` +\n      \`Service: \${session.service}\\n\` +\n      \`Day: \${session.date}\\n\` +\n      \`Name: \${session.name}\\n\` +\n      \`Phone: \${session.patientPhone}\\n\\n\` +\n      \`Our team will call you to confirm the exact time.\\n\` +\n      \`Type CONFIRM to book or START OVER to change anything.\`;\n    await sendWhatsApp(from, summary);\n    return;\n  }\n  \n  if (session.state === "CONFIRM") {\n    if (userMessage.toUpperCase() === "CONFIRM") {\n      // Save to database here (e.g., Supabase insert)\n      sessions.delete(from); // clear session after booking\n      await sendWhatsApp(from, \n        \`✅ *Booking Confirmed!*\\n\\nThank you \${session.name}!\\n\` +\n        \`Our team will call +\${session.patientPhone} to confirm your exact appointment time.\\n\` +\n        \`📍 Smile Bright Dental, Westlands, Nairobi\\n\` +\n        \`📞 +254 700 999 000\\n\\nSee you soon! 😊\`\n      );\n    } else {\n      sessions.delete(from);\n      await sendWhatsApp(from, "No problem! Type 'book' to start again.");\n    }\n    return;\n  }\n}\n\nSubmit: (1) complete server code with the state machine booking flow integrated, (2) a full conversation trace showing a complete booking from START to CONFIRM including one validation error (entering a single word for the name field), (3) test what happens when two different customers are booking at the same time — show that sessions are independent, (4) describe how you would persist the session state to a database (Redis or Supabase) so the state survives a server restart.`,
        quizQuestions: [
          { question: "Why do you need a state machine for multi-step WhatsApp conversations rather than just checking the message content?", options: ["State machines are faster than content checking", "WhatsApp does not include conversation history in the webhook payload — without storing state you cannot know which step of the flow the customer is on when they send their next message", "State machines are required by Meta's API specification", "Content checking only works for English messages not Swahili"], correctAnswer: 1 },
          { question: "Two customers are using your booking bot simultaneously. Customer A is at the COLLECT_DATE step and Customer B just started. How do you ensure their sessions do not interfere with each other?", options: ["Process one customer at a time using a queue — do not handle concurrent sessions", "Key the session state by phone number — each customer has an independent session object stored under their unique phone number", "Use separate webhook endpoints for each customer", "Limit the bot to one user at a time using a global lock variable"], correctAnswer: 1 },
          { question: "A patient is halfway through the booking flow and does not respond for 2 hours, then sends a new message. How should the bot handle this timeout scenario?", options: ["Continue from where the session left off — the state is still stored and valid", "Check if the session is older than 30 minutes — if so clear it and restart with a friendly message explaining the session expired, offering to start fresh", "Delete all old sessions every hour to keep memory clean", "Ask the patient whether they want to continue or start over every time they send any message"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 8,
        title: "Final Project — Production WhatsApp Bot for Savannah Properties",
        type: "project",
        hook: "WhatsApp bot developers in Kenya who can demonstrate a production-deployed, working bot with conversation logs earn between KSh 150,000 and KSh 400,000 per project. This is that bot.",
        duration_mins: 90,
        isAvailable: true,
        content: "Build, deploy, and document a complete production WhatsApp bot for Savannah Properties — a fictional Kenyan real estate company. The bot handles FAQs, qualifies property viewing leads through a multi-step flow, sends WhatsApp confirmation messages, and escalates to a human agent when needed. Deployed live on Railway or Render.",
        sandboxTask: "Build and deploy a complete production WhatsApp bot for Savannah Properties Kenya. The bot must be live on the internet — not just running locally.\n\nREQUIREMENTS:\n\n1. FAQ HANDLING: Answer questions about 5 properties (Kilimani 3BR KSh 8.5M, Westlands Studio KSh 3.2M, Nyali Mombasa 4BR KSh 12M, Ruiru Townhouse KSh 6.8M, Karen 5BR KSh 22M), opening hours, agent contact, and general real estate questions. Use Claude claude-haiku-4-5-20251001 for intent detection and response generation.\n\n2. LEAD QUALIFICATION FLOW: Multi-step state machine that collects: property of interest, budget range (below KSh 5M / KSh 5M-15M / above KSh 15M), preferred viewing date, full name, phone number. After collecting all 5 items, send a WhatsApp confirmation to the customer and log the lead to a Supabase table (leads: id, phone, property, budget, viewing_date, name, created_at).\n\n3. ERROR HANDLING: All API calls wrapped in try/catch. On Meta API failure, log the error and retry once after 30 seconds. On Claude API failure, fall back to a hardcoded response: 'Asante! Mwakilishi wetu atawasiliana nawe hivi karibuni.'\n\n4. DELIVERY TRACKING: Configure the Meta webhook to receive message status updates (sent/delivered/read/failed). Log all status changes to console with the message ID and timestamp.\n\n5. DEPLOYMENT: Deploy to Railway (free tier). Set all credentials as environment variables (WHATSAPP_TOKEN, PHONE_NUMBER_ID, WEBHOOK_VERIFY_TOKEN, CLAUDE_API_KEY, SUPABASE_URL, SUPABASE_KEY). Register the production Railway URL as your Meta webhook.\n\nSubmit: (1) GitHub repository link with all code (credentials in .env not committed), (2) Railway deployment URL showing the bot is live, (3) conversation log showing a complete lead qualification flow from greeting to confirmation, (4) Supabase screenshot showing at least 2 captured leads in the database, (5) 300-word technical write-up explaining your architecture decisions.",
      },
    ],
    capstone: {
      title: "WhatsApp AI Developer Certification",
      description: "You are a freelance developer. A Nairobi logistics company wants a WhatsApp bot that handles driver dispatch, customer delivery tracking, and complaint escalation. Design and partially build this system.",
      task: "Design and implement the core components of a WhatsApp dispatch and tracking bot for Fahari Logistics Kenya. The company has 45 drivers and handles 200 deliveries per day. Customers track deliveries on WhatsApp. Drivers update status via WhatsApp. Managers receive exception alerts. Build: (1) The complete system architecture diagram describing all components and data flows. (2) The driver status update flow — driver sends 'DELIVERED PKG-2847' → bot validates package ID against database → updates delivery status → sends WhatsApp confirmation to customer. Write the complete code for this flow. (3) The customer tracking flow — customer sends tracking number → bot queries database → sends current status with driver name and estimated time. Write the complete code. (4) The exception alert system — if a delivery has not been updated in 2 hours send a WhatsApp alert to the dispatch manager. Write the cron job code. (5) Deploy at least flows 2 and 3 to a live server and submit the webhook URL.",
      rubric: {
        specificity: { weight: 25, description: "Code is complete and executable — not pseudocode or placeholders. Real API calls with correct payload structure for all 3 flows score 20-25. Pseudocode or incomplete flows score 0-10." },
        businessAccuracy: { weight: 25, description: "The architecture correctly reflects real logistics operations — driver IDs, package IDs, status codes, and customer notification timing all make sense for a real Kenyan last-mile delivery operation." },
        implementationRealism: { weight: 20, description: "The cron job for exception alerts uses a real implementation (node-cron or similar). The database queries are structured correctly for Supabase or a similar real database." },
        ethicsQuality: { weight: 15, description: "Webhook signature verification implemented. API credentials in environment variables. No hardcoded secrets in submitted code. Customer phone numbers masked in logs." },
        professionalQuality: { weight: 15, description: "Code is readable with comments. Error handling present on all external API calls. A junior developer could understand and maintain the codebase without explanation." },
      },
      passingScore: 70,
    },
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
