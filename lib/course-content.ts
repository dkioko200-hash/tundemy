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
    title: "M-Pesa Daraja API",
    tagline: "Get Paid. Build the Payments Layer Africa Runs On.",
    description:
      "Build fully functional M-Pesa payment systems using Safaricom Daraja API. STK Push, C2B, B2C, callbacks, and production deployment. The skill fintech companies across Africa are actively hiring for.",
    level: "Advanced",
    price_kes: 4500,
    lessons_count: 9,
    badge_name: "Daraja Certified Developer",
    what_you_will_learn: [
      "Set up Daraja sandbox credentials and authenticate with OAuth in under 30 minutes",
      "Build STK Push from first API call through to callback handling and payment confirmation",
      "Implement C2B and B2C flows for incoming payments and programmatic disbursements",
      "Handle all error codes, implement retry logic, and prevent duplicate payments with idempotency",
      "Deploy a production payment system with full audit logging and receipt generation",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Welcome to M-Pesa Daraja API",
        type: "intro" as const,
        hook: "A Nairobi e-commerce startup was losing 35% of sales because customers abandoned checkout when they could not pay with M-Pesa. A developer integrated STK Push in 4 days. Checkout abandonment dropped to 8%. Revenue increased by KSh 2.4 million in the first month. M-Pesa integration is not a nice-to-have for Kenyan businesses — it is the payment system.",
        duration_mins: 5,
        isAvailable: true,
        content: "M-Pesa is how Kenya pays. The Daraja API is how developers build the payment systems that Kenya runs on. This course teaches you to build production-ready M-Pesa integrations from sandbox credentials to live transactions — STK Push, C2B, B2C, callbacks, error handling, and reconciliation. You will write real code against the real Safaricom API.",
        introWhoFor: [
          "A developer who wants the most in-demand fintech skill in East Africa on their CV and portfolio",
          "A freelancer who wants to charge KSh 150,000–400,000 for payment integrations that businesses desperately need",
          "A startup founder who needs to integrate M-Pesa without outsourcing and paying premium rates for it",
          "A software student who wants a real deployable financial system as a portfolio project",
        ],
        introOutcomes: [
          "Set up Daraja sandbox credentials and make your first authenticated API call — in lesson 2",
          "Build a complete STK Push flow from initiation through callback to payment confirmation and database record",
          "Implement C2B for incoming payments and B2C for programmatic disbursements to customers and suppliers",
          "Handle all Daraja error codes, implement exponential backoff retries, and prevent duplicate payments with idempotency keys",
          "Deploy a production payment system on Railway with full audit logging, receipt generation, and a reconciliation report",
        ],
        introStructure: {
          lessonsCount: 9,
          hours: 7,
          sandboxCount: 5,
          finalProject: "Complete M-Pesa payment system for Duka Smart — a fictional Kenyan e-commerce platform",
        },
        introFirstTask: "Go to developer.safaricom.co.ke right now and create a free developer account. You will need it for lesson 2. The registration takes 5 minutes.",
      },
      {
        lessonNumber: 1,
        title: "The M-Pesa Ecosystem and Daraja API Suite",
        type: "video",
        hook: "M-Pesa processes over KSh 1 trillion per month across 30 million active users. Every paybill payment, every Till Number transaction, every STK Push prompt on every Kenyan's phone is powered by the same API you are about to learn. This is not a niche skill — this is the infrastructure of the Kenyan economy.",
        duration_mins: 9,
        isAvailable: true,
        content: "The M-Pesa business ecosystem: Till Numbers vs Paybill vs Head Office numbers. The Daraja API product suite: STK Push, C2B, B2C, Account Balance, Transaction Status, and Reversal. Which endpoint solves which business problem. The sandbox environment and test credentials. How the production go-live process works.",
        theory: {
          concept: "Daraja (Swahili for bridge) is the API that connects your application to M-Pesa's payment infrastructure. It has six core endpoints. STK Push (Lipa Na M-Pesa Online) sends a payment prompt to a customer's phone — they enter their PIN and the money moves. C2B (Customer to Business) receives payments customers make directly via M-Pesa menu to your Paybill or Till. B2C (Business to Customer) sends money from your M-Pesa business account to any M-Pesa number — for payouts, refunds, and disbursements. Transaction Status lets you check the status of any past transaction by ID. Account Balance retrieves your current M-Pesa business account balance. Reversal cancels a completed transaction. The most important business rule is the shortcode type: Paybill numbers (6 digits starting with 4 or higher) support C2B with account references — customers can pay to specific invoices or accounts. Till Numbers (6 digits starting with 1-3) receive C2B payments without account references. STK Push uses either type. B2C requires a separate Initiator credential.",
          badExample: "Integrate M-Pesa payments into our website using the Daraja API.",
          badBreakdown: [
            { element: "Payment flow specified", present: "Not defined", problem: "STK Push, C2B, and B2C are completely different implementations — without knowing the flow there is no implementation to build" },
            { element: "Shortcode type", present: "Not specified", problem: "Paybill and Till Number require different callback structures and support different payment patterns" },
            { element: "Callback infrastructure", present: "Not mentioned", problem: "Every Daraja integration requires a publicly accessible HTTPS callback URL — if the developer does not know this they will build the wrong architecture" },
            { element: "Error handling", present: "Completely absent", problem: "M-Pesa callbacks are not guaranteed to arrive — no retry or status query means missing payments stay unreconciled" },
            { element: "Environment", present: "Not specified", problem: "Sandbox and production use different base URLs credentials and test numbers — conflating them is the most common beginner mistake" },
          ],
          badOutput: "A developer who starts building without answering these questions will spend days debugging authentication errors confusing sandbox and production endpoints and wondering why callbacks never arrive because they are on localhost without ngrok.",
          goodExample: "Integrate M-Pesa STK Push into the Duka Smart checkout flow. When a customer clicks Pay with M-Pesa our Next.js API route calls the Daraja STK Push endpoint with the customer's phone number and order amount. The Daraja API sends a PIN prompt to the customer's phone. We store the CheckoutRequestID and set order status to PENDING. Safaricom calls our HTTPS callback URL at api.dukasmart.co.ke/mpesa/callback within 30 seconds. If ResultCode is 0 (success) we update the order to PAID and send a WhatsApp confirmation. If the callback does not arrive within 60 seconds we query the Transaction Status endpoint. We use Paybill 522533 (sandbox) with account reference set to the order ID.",
          goodBreakdown: [
            { element: "Payment flow", present: "STK Push explicitly specified", improvement: "Clear architecture — customer experience defined before first line of code" },
            { element: "Shortcode type", present: "Paybill 522533 specified with account reference pattern", improvement: "Correct shortcode type identified — callback structure known before building" },
            { element: "Callback infrastructure", present: "Production HTTPS URL specified — api.dukasmart.co.ke", improvement: "Developer knows they need a deployed server not localhost — architecture is correct from day 1" },
            { element: "Error handling", present: "60-second timeout with status query fallback", improvement: "No payment is ever silently lost — every transaction reaches a final state" },
            { element: "Environment", present: "Sandbox Paybill 522533 explicitly noted", improvement: "Developer knows exactly which credentials and base URL to use at each stage" },
          ],
          goodOutput: "A production-ready payment flow where every order has a trackable payment state (PENDING → PAID or FAILED), every successful payment triggers a WhatsApp confirmation within 5 seconds, and no transaction is ever stuck in PENDING permanently because of a missed callback.",
          keyInsight: "The most common Daraja integration mistake is not understanding the callback model. Daraja is asynchronous — the STK Push initiation response tells you the prompt was sent, not that the customer paid. The actual payment result arrives 10-30 seconds later in a completely separate HTTP POST to your callback URL. Building as if the initiation response is the payment confirmation is the architectural mistake that breaks every production deployment.",
          ruleToRemember: "STK Push initiation = I asked the customer to pay. STK Push callback = the customer actually paid (or cancelled). Never act on the initiation response as if money has moved. Always wait for the callback.",
          checkYourUnderstanding: [
            {
              question: "A supermarket wants customers to pay using M-Pesa by entering the supermarket's Till Number in their M-Pesa menu — no PIN prompt on customer's phone required. Which Daraja endpoint handles this?",
              options: [
                "STK Push — it sends the payment prompt to the customer's phone",
                "C2B — customers initiate the payment themselves via their M-Pesa menu to a Till Number or Paybill",
                "B2C — this sends payments from the business to the customer",
                "Transaction Status — this is used for payment lookups not receiving payments",
              ],
              correctAnswer: 1,
              explanation: "C2B (Customer to Business) is the flow where customers initiate payment through their own M-Pesa menu by entering a Till or Paybill number. The business registers callback URLs to receive notification when payment arrives. STK Push sends a prompt to the customer's phone — a different user experience.",
            },
            {
              question: "You initiate an STK Push and receive this response: { 'ResponseCode': '0', 'ResponseDescription': 'Success. Request accepted for processing', 'CheckoutRequestID': 'ws_CO_...' }. Has the customer paid?",
              options: [
                "Yes — ResponseCode 0 means the payment was successful",
                "No — this response only confirms the PIN prompt was sent to the customer's phone. The actual payment result arrives separately in the callback URL within 30 seconds",
                "Yes — Request accepted for processing means the funds were deducted",
                "Not yet — you need to call the Transaction Status endpoint to check",
              ],
              correctAnswer: 1,
              explanation: "The STK Push initiation response with ResponseCode 0 means the prompt was successfully delivered to the customer's phone — nothing more. The customer has not yet entered their PIN. The payment result (success or failure) arrives as a separate callback POST to your CallBackURL.",
            },
            {
              question: "What is the key difference between a Paybill number and a Till Number in the Daraja C2B context?",
              options: [
                "Paybill supports STK Push while Till Number does not",
                "Paybill accepts account reference numbers (allowing payment to specific invoices or customer accounts) while Till Number does not — both receive C2B payments but Till transactions have no account reference",
                "Till Numbers receive payments faster than Paybill numbers",
                "Paybill numbers are for businesses over KSh 10M annual revenue while Till is for smaller businesses",
              ],
              correctAnswer: 1,
              explanation: "The practical difference is the account reference field. Paybill allows customers to specify an account number (invoice ID, customer ID, policy number) when paying — critical for reconciliation in e-commerce, banking, and insurance. Till Number does not support account references — you know money arrived but not what it was for.",
            },
          ],
        },
        quizQuestions: [
          { question: "Which Daraja endpoint should a salary payment platform use to send monthly salaries to 500 employees via M-Pesa?", options: ["STK Push — send a payment prompt to each employee's phone", "C2B — employees pay into the business account", "B2C with CommandID SalaryPayment — programmatic disbursement from business to multiple M-Pesa numbers", "Transaction Status — check that payroll is up to date"], correctAnswer: 2 },
          { question: "A callback URL is required for which Daraja endpoints?", options: ["Only STK Push — it is the only asynchronous endpoint", "STK Push, C2B Confirmation, B2C Result, Transaction Status, and Account Balance — all Daraja endpoints deliver results asynchronously to callbacks", "Only B2C — it is the only endpoint where Safaricom initiates the call", "None — all Daraja endpoints return results synchronously in the HTTP response"], correctAnswer: 1 },
          { question: "What is the Daraja sandbox test phone number for simulating STK Push payments?", options: ["Your personal Safaricom number", "254708374149 — the official Safaricom sandbox test number that simulates M-Pesa transactions", "Any Kenyan number starting with 254", "You create your own test number in the developer portal"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 2,
        title: "Sandbox Setup and OAuth Authentication",
        type: "sandbox",
        hook: "OAuth token management is the foundation every other Daraja API call depends on. Get this wrong and nothing else works. Get it right and every subsequent endpoint is just a well-structured HTTP request.",
        duration_mins: 20,
        isAvailable: true,
        content: "Complete Daraja sandbox setup: developer portal registration, app creation, Consumer Key and Consumer Secret, OAuth 2.0 token generation using Basic authentication, token caching and auto-refresh. Real Node.js code included.",
        sandboxTask: `Complete the Daraja sandbox setup and build a reusable authentication module.\n\nSTEP 1 — DEVELOPER PORTAL:\n1. Go to developer.safaricom.co.ke\n2. Create an account with your email\n3. Create a new app — select both "Lipa Na Mpesa Online" and "M-Pesa Sandbox" APIs\n4. Retrieve your Consumer Key and Consumer Secret from the app dashboard\n\nSTEP 2 — GET AN ACCESS TOKEN (curl):\ncurl -X GET \\\n  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials" \\\n  -H "Authorization: Basic BASE64(consumerKey:consumerSecret)"\n\nGenerate the base64 string:\nnode -e "console.log(Buffer.from('YOUR_KEY:YOUR_SECRET').toString('base64'))"\n\nSTEP 3 — BUILD A REUSABLE AUTH MODULE (Node.js):\nconst axios = require("axios");\n\nconst DARAJA_BASE = "https://sandbox.safaricom.co.ke";\nlet cachedToken = null;\nlet tokenExpiry = 0;\n\nasync function getDarajaToken() {\n  const now = Date.now();\n  // Return cached token if still valid (with 60s buffer)\n  if (cachedToken && now < tokenExpiry - 60000) {\n    return cachedToken;\n  }\n  const credentials = Buffer.from(\n    \`\${process.env.DARAJA_CONSUMER_KEY}:\${process.env.DARAJA_CONSUMER_SECRET}\`\n  ).toString("base64");\n  const response = await axios.get(\n    \`\${DARAJA_BASE}/oauth/v1/generate?grant_type=client_credentials\`,\n    { headers: { Authorization: \`Basic \${credentials}\` } }\n  );\n  cachedToken = response.data.access_token;\n  tokenExpiry = now + response.data.expires_in * 1000; // expires_in is 3600 seconds\n  console.log(\`New token obtained. Expires at \${new Date(tokenExpiry).toISOString()}\`);\n  return cachedToken;\n}\n\nmodule.exports = { getDarajaToken, DARAJA_BASE };\n\nSTEP 4 — TEST IT:\nconst { getDarajaToken } = require("./auth");\ngetDarajaToken().then(token => {\n  console.log("Token (first 20 chars):", token.substring(0, 20) + "...");\n  // Call it again — should return cached token\n  return getDarajaToken();\n}).then(token => {\n  console.log("Second call returned cached token:", token.substring(0, 20) + "...");\n});\n\nSubmit: (1) screenshot of your Safaricom Developer Portal app showing Consumer Key visible (Secret redacted), (2) your auth.js module code, (3) console output showing the first call fetching a new token and the second call returning the cached token.`,
        quizQuestions: [
          { question: "How do you encode your Consumer Key and Consumer Secret for the OAuth request Authorization header?", options: ["Concatenate them with a colon then URL-encode the result", "Concatenate consumerKey:consumerSecret and Base64 encode the result — use the resulting string as 'Basic <encoded>'", "Send them as separate query parameters consumerKey= and consumerSecret=", "Hash them with SHA-256 and send the hexadecimal result"], correctAnswer: 1 },
          { question: "Your OAuth token expires in 3600 seconds. Why should you refresh it 60 seconds before expiry rather than waiting until it expires?", options: ["Safaricom charges extra for last-second token refreshes", "To prevent any API calls from failing due to an expired token — refreshing 60 seconds early ensures the new token is ready before the old one expires during a request", "The token cannot be refreshed after it expires — you must create a new app if it expires", "60 seconds is the maximum caching duration allowed by Safaricom policy"], correctAnswer: 1 },
          { question: "Your authentication module throws: Error: Request failed with status 401. The credentials are correct. What is the most likely cause?", options: ["The Consumer Key contains special characters that need URL encoding", "You are using the wrong base URL — ensure you are using sandbox.safaricom.co.ke for sandbox and api.safaricom.co.ke for production", "You need to include your phone number in the authentication request", "The 401 means your account has been suspended for inactivity"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 3,
        title: "STK Push — Initiation and Callback Handling",
        type: "sandbox",
        hook: "STK Push is the API endpoint that every Kenyan with an M-Pesa phone has experienced from the customer side — the PIN prompt that appears when you buy something online. This lesson is the developer side of that exact moment.",
        duration_mins: 25,
        isAvailable: true,
        content: "Complete STK Push implementation: generating the password, constructing the request payload, handling the initiation response, building the callback endpoint, parsing the result, and updating your database. Includes the full production-ready Node.js code.",
        sandboxTask: `Build a complete STK Push flow — from checkout button to payment confirmed in your database.\n\nPART 1 — STK PUSH INITIATION:\nconst { getDarajaToken, DARAJA_BASE } = require("./auth");\nconst axios = require("axios");\n\nasync function initiateSTKPush({ phone, amount, orderId }) {\n  const token = await getDarajaToken();\n  const timestamp = new Date()\n    .toISOString()\n    .replace(/[^0-9]/g, "")\n    .slice(0, 14); // YYYYMMDDHHmmss\n  const shortcode = process.env.MPESA_SHORTCODE; // sandbox: 174379\n  const passkey = process.env.MPESA_PASSKEY;    // from Daraja portal\n  // Password = Base64(Shortcode + Passkey + Timestamp)\n  const password = Buffer.from(\`\${shortcode}\${passkey}\${timestamp}\`).toString("base64");\n  const payload = {\n    BusinessShortCode: shortcode,\n    Password: password,\n    Timestamp: timestamp,\n    TransactionType: "CustomerPayBillOnline",\n    Amount: Math.ceil(amount), // must be integer\n    PartyA: phone,             // customer phone: 254XXXXXXXXX\n    PartyB: shortcode,\n    PhoneNumber: phone,\n    CallBackURL: process.env.CALLBACK_URL + "/mpesa/stk-callback",\n    AccountReference: \`ORDER-\${orderId}\`,\n    TransactionDesc: \`Payment for Order \${orderId} - Duka Smart\`\n  };\n  const response = await axios.post(\n    \`\${DARAJA_BASE}/mpesa/stkpush/v1/processrequest\`,\n    payload,\n    { headers: { Authorization: \`Bearer \${token}\` } }\n  );\n  // Store the CheckoutRequestID to match with callback\n  await db.orders.update(orderId, {\n    checkoutRequestId: response.data.CheckoutRequestID,\n    paymentStatus: "PENDING"\n  });\n  return response.data;\n}\n\nPART 2 — STK PUSH CALLBACK ENDPOINT:\napp.post("/mpesa/stk-callback", async (req, res) => {\n  // Always respond 200 immediately\n  res.json({ ResultCode: 0, ResultDesc: "Accepted" });\n  const callback = req.body.Body.stkCallback;\n  const { CheckoutRequestID, ResultCode, ResultDesc } = callback;\n  if (ResultCode === 0) {\n    // Payment successful — extract metadata\n    const items = callback.CallbackMetadata.Item;\n    const get = (name) => items.find(i => i.Name === name)?.Value;\n    const receiptNumber = get("MpesaReceiptNumber"); // e.g. "QHJ7Y3X9KL"\n    const amount = get("Amount");                    // e.g. 2500\n    const phoneNumber = get("PhoneNumber");          // e.g. 254712345678\n    const transactionDate = get("TransactionDate");  // e.g. 20240315143022\n    await db.payments.create({\n      checkoutRequestId: CheckoutRequestID,\n      mpesaReceiptNumber: receiptNumber,\n      amount, phoneNumber, transactionDate,\n      status: "SUCCESS"\n    });\n    await db.orders.updateByCheckoutRequestId(CheckoutRequestID, { paymentStatus: "PAID" });\n    // Trigger WhatsApp confirmation here\n    console.log(\`Payment SUCCESS: Order confirmed. Receipt: \${receiptNumber}\`);\n  } else {\n    // Payment failed or cancelled\n    await db.payments.create({\n      checkoutRequestId: CheckoutRequestID,\n      status: "FAILED",\n      failureReason: ResultDesc // e.g. "Request cancelled by user"\n    });\n    await db.orders.updateByCheckoutRequestId(CheckoutRequestID, { paymentStatus: "FAILED" });\n    console.log(\`Payment FAILED: \${ResultDesc}\`);\n  }\n});\n\nPART 3 — STATUS QUERY FALLBACK (for when callback does not arrive within 60 seconds):\nasync function querySTKStatus(checkoutRequestId) {\n  const token = await getDarajaToken();\n  const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);\n  const shortcode = process.env.MPESA_SHORTCODE;\n  const password = Buffer.from(\`\${shortcode}\${process.env.MPESA_PASSKEY}\${timestamp}\`).toString("base64");\n  const response = await axios.post(\n    \`\${DARAJA_BASE}/mpesa/stkpushquery/v1/query\`,\n    { BusinessShortCode: shortcode, Password: password, Timestamp: timestamp, CheckoutRequestID: checkoutRequestId },\n    { headers: { Authorization: \`Bearer \${token}\` } }\n  );\n  return response.data; // ResultCode 0 = paid, others = failed/pending\n}\n\nSubmit: (1) complete stk-push.js file with both initiation and callback functions, (2) use the sandbox test number 254708374149 to trigger a test STK Push — show the console output from a successful callback with the MpesaReceiptNumber logged, (3) show a FAILED callback by cancelling the payment prompt on the test number, (4) describe how you would implement the 60-second timeout + status query fallback using setInterval or a job queue.`,
        quizQuestions: [
          { question: "How is the STK Push password generated?", options: ["It is your Daraja Consumer Secret", "Base64 encode the concatenation of BusinessShortCode + Passkey + Timestamp (in YYYYMMDDHHmmss format)", "SHA-256 hash of your Consumer Key and Consumer Secret", "It is static — use the same password for every STK Push request"], correctAnswer: 1 },
          { question: "The STK Push callback arrives with ResultCode: 1032 and ResultDesc: 'Request cancelled by user'. What should your callback handler do?", options: ["Retry the STK Push automatically — the customer may have cancelled by mistake", "Update the order payment status to FAILED, log the ResultDesc, and optionally trigger a follow-up message to the customer offering to retry", "Ignore cancelled payments — only process ResultCode 0", "Return HTTP 500 to Safaricom to signal that the cancellation was not expected"], correctAnswer: 1 },
          { question: "Why must your STK Push callback endpoint respond with HTTP 200 and the acknowledgement JSON immediately before processing the payment?", options: ["Safaricom charges a retry fee if you do not respond within 2 seconds", "Safaricom will retry the callback up to 3 times if it does not receive a 200 response — responding immediately and processing asynchronously prevents duplicate processing of the same payment", "The 200 response includes the receipt number that you must store", "Safaricom requires a 200 to confirm their server is still connected to yours"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 4,
        title: "C2B Payments and B2C Disbursements",
        type: "reading",
        hook: "STK Push is one direction: you asking a customer to pay. C2B is the other: a customer choosing to pay your business from their M-Pesa menu. B2C is the third: your business paying money out to any M-Pesa number. Together these three flows cover every payment use case in East African business.",
        duration_mins: 8,
        isAvailable: true,
        content: "Complete C2B implementation: registering Validation and Confirmation URLs, building both callback handlers, and the Validation accept/reject logic. Complete B2C implementation: the security credential, the three CommandID types, and handling the asynchronous Result and QueueTimeoutURL callbacks.",
        readingTopics: [
          "C2B URL registration — the one-time setup that connects your Paybill or Till to your callback server",
          "Validation URL vs Confirmation URL — what each callback does and when Safaricom calls them",
          "Building a Validation endpoint that accepts or rejects payments in real time based on business rules",
          "B2C security credential — what it is why it is different from OAuth and how to generate it",
          "B2C CommandID types — BusinessPayment for general payouts, SalaryPayment for payroll, PromotionPayment for cashback",
        ],
        theory: {
          concept: "C2B has two callbacks. The Validation URL is called before Safaricom processes the payment — you can accept or reject it in real time. If you reject it (by returning ResultCode not 0) the customer's money is never moved. The Confirmation URL is called after the payment is processed — the money has moved and you cannot reverse it in this callback. B2C is different in architecture: you initiate the payout from your server using the Business to Customer API and receive the result via a separate callback. The critical B2C component is the security credential — unlike OAuth which is a token, the security credential is your Initiator password encrypted with Safaricom's public key using RSA-PKCS#1v1.5 padding. Safaricom provides the certificate on their developer portal. The credential must be regenerated when your Initiator password changes.",
          badExample: "Register the same URL for both Validation and Confirmation callbacks since they both just record the payment.",
          badBreakdown: [
            { element: "Validation purpose", present: "Misunderstood", problem: "Validation is a decision point — you must return Accept or Reject. If you just record and return wrong code Safaricom rejects all payments" },
            { element: "Response timing", present: "Not specified", problem: "The Validation callback must return a response within 8 seconds or Safaricom automatically accepts the payment — slow database queries can cause silent policy failures" },
            { element: "Rejection logic", present: "Absent", problem: "Without rejection logic your Paybill accepts payments for non-existent account references causing customer confusion and reconciliation nightmares" },
            { element: "Confirmation handling", present: "Conflated with Validation", problem: "Confirmation is a notification not a decision — processing it like a Validation request with Accept/Reject logic creates incorrect response codes" },
            { element: "Duplicate handling", present: "Not considered", problem: "Safaricom can send the same Confirmation multiple times — without idempotency checks you will credit the customer twice" },
          ],
          badOutput: "A C2B integration where every payment is accepted by the Validation URL regardless of whether the account reference exists — customers can pay using any account number and the money is credited to an orphaned transaction that cannot be reconciled.",
          goodExample: "Validation URL handler: receive the C2B payload, extract the AccountReference (e.g. INV-2847), query your invoices database to verify the invoice exists and is unpaid, if valid return { 'ResultCode': 0, 'ResultDesc': 'Accepted' }, if invalid return { 'ResultCode': 'C2B00011', 'ResultDesc': 'Invalid Account Number' }. Must respond within 8 seconds. Confirmation URL handler: receive the confirmed payment, check if this TransactionID has already been recorded (idempotency), if new: record the payment, mark the invoice as paid, send the customer a WhatsApp receipt. Return { 'ResultCode': 0, 'ResultDesc': 'Accepted' }.",
          goodBreakdown: [
            { element: "Validation logic", present: "Database lookup for account reference validity", improvement: "Only valid invoices accepted — invalid references rejected before money moves" },
            { element: "Response timing", present: "Fast database query required within 8 seconds", improvement: "Index on account_reference column ensures sub-second lookup" },
            { element: "Rejection code", present: "C2B00011 for invalid account", improvement: "Correct error code tells Safaricom exactly why the payment was rejected and shows the customer a useful error message" },
            { element: "Idempotency", present: "TransactionID uniqueness check before recording", improvement: "Duplicate Confirmation callbacks do not create duplicate payments" },
            { element: "Post-confirmation action", present: "WhatsApp receipt triggered", improvement: "Customer experience complete — payment is confirmed in under 5 seconds" },
          ],
          goodOutput: "A C2B integration where only payments for valid unpaid invoices are accepted, duplicate callbacks are handled safely, every successful payment triggers a WhatsApp receipt within 5 seconds, and every transaction is recorded with full metadata for KRA audit compliance.",
          keyInsight: "The 8-second Validation deadline is the most commonly missed C2B requirement. In production, if your database is on a slow server or you have a complex validation query without proper indexing, the Validation URL will time out and Safaricom will silently accept the payment anyway — defeating the purpose of validation entirely. Always index your account reference lookup column and keep the Validation handler logic minimal and fast.",
          ruleToRemember: "Validation URL = real-time decision, must respond in under 8 seconds, money has not moved yet. Confirmation URL = notification only, money has already moved, cannot be reversed in this callback. Treat them as completely different workflows.",
          checkYourUnderstanding: [
            {
              question: "A customer tries to pay your Paybill using account reference INV-9999 which does not exist in your system. Your Validation URL receives the request. What should your handler return?",
              options: [
                "{ ResultCode: 0, ResultDesc: 'Accepted' } — always accept payments and sort out the account later",
                "{ ResultCode: 'C2B00011', ResultDesc: 'Invalid Account Number' } — reject the payment before money moves so the customer can correct their account reference",
                "HTTP 404 — account not found",
                "No response — let the 8-second timeout cause Safaricom to cancel the payment",
              ],
              correctAnswer: 1,
              explanation: "Returning the correct rejection code tells Safaricom not to process the payment — the customer's money stays in their wallet and they receive an error message. This is exactly what Validation is for. Always reject invalid account references before money moves.",
            },
            {
              question: "Why does B2C require a different credential (SecurityCredential) instead of just reusing the OAuth access token?",
              options: [
                "B2C is a newer API that uses a more secure authentication method",
                "The SecurityCredential proves that a named Initiator user has been authorised by the business to disburse funds — it is a separate authorisation layer that prevents any developer with the Consumer Key from sending money out of the business account",
                "OAuth tokens expire after 1 hour — SecurityCredential lasts forever",
                "Safaricom made a design mistake — both should use OAuth",
              ],
              correctAnswer: 1,
              explanation: "The SecurityCredential is an additional authorisation layer specific to fund disbursement. The Initiator is a named business user registered in the Daraja portal with permission to initiate B2C payments. Their password encrypted with Safaricom's public key proves this specific authorised person initiated the payout — not just any developer with the API credentials.",
            },
            {
              question: "Your B2C payout to a customer's M-Pesa number triggers the QueueTimeoutURL callback instead of the ResultURL. What does this mean?",
              options: [
                "The payment was successful but Safaricom delivered the result to the wrong URL",
                "The transaction could not be completed before the queue timeout — the funds were NOT disbursed and you should retry or investigate the customer's M-Pesa account status",
                "The customer's M-Pesa number received the money but the callback was delayed",
                "Your server was too slow to process the Result callback so it was rerouted to the timeout URL"],
              correctAnswer: 1,
              explanation: "QueueTimeoutURL is called when Safaricom could not process the B2C transaction before the queue timeout — typically because the recipient's M-Pesa account is unregistered, suspended, or the number is invalid. The money was NOT sent. Log the timeout, mark the disbursement as FAILED, and investigate the recipient number before retrying.",
            },
          ],
        },
        quizQuestions: [
          { question: "A Kenyan SACCO wants to send monthly dividends to 2,000 members via M-Pesa from their business account. Which B2C CommandID should they use?", options: ["BusinessPayment — for general business payments", "SalaryPayment — for payroll and salary disbursements which includes member dividends as a form of regular payment", "PromotionPayment — for cashback and promotional payouts", "Either BusinessPayment or SalaryPayment — they produce identical results"], correctAnswer: 1 },
          { question: "Your C2B Validation URL handler is responding in 9 seconds on average due to a slow database query. What is the consequence in production?", options: ["Safaricom will retry the validation request until your server responds faster", "Safaricom will automatically accept all payments after 8 seconds regardless of your response — your validation logic becomes ineffective and you accept payments for non-existent accounts", "Your Paybill will be suspended for slow validation responses", "Safaricom will reject all payments until the response time improves"], correctAnswer: 1 },
          { question: "The same C2B Confirmation callback arrives at your server twice with the same TransactionID and amount. What should your handler do on the second call?", options: ["Process it again — the customer may have paid twice", "Check your payments table for the TransactionID — if it already exists return success without creating a duplicate record (idempotency)", "Return HTTP 500 to signal the duplicate to Safaricom", "Delete the first record and create a new one with updated timestamp"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 5,
        title: "Error Handling, Idempotency, and Retry Logic",
        type: "sandbox",
        hook: "In production payment systems every unhandled error is a transaction that went wrong and a customer who does not know it. The developers who get repeat clients are the ones whose systems never lose a payment — not the ones who build the fastest first version.",
        duration_mins: 20,
        isAvailable: true,
        content: "All Daraja error codes decoded, exponential backoff retry strategy, idempotency keys to prevent duplicate charges, circuit breaker pattern for API outage protection, and a dead letter queue for permanently failed transactions. Full Node.js implementation included.",
        sandboxTask: `Harden your STK Push integration with production-grade error handling.\n\nDaraja error codes to handle:\n- 400/500: Network or server error — retry with backoff\n- 401: Token expired — refresh token and retry once\n- 404: Resource not found — do not retry, log and alert\n- 429: Rate limited — backoff and retry after 1 minute\n- 503: Safaricom service unavailable — circuit breaker\n\nIMPLEMENT THESE 4 PATTERNS:\n\n// 1. IDEMPOTENCY KEY — prevent duplicate STK Push on retry\nconst crypto = require("crypto");\nfunction generateIdempotencyKey(orderId, amount, phone) {\n  return crypto.createHash("sha256")\n    .update(\`\${orderId}-\${amount}-\${phone}\`)\n    .digest("hex");\n}\n// Store idempotencyKey in orders table — check before initiating\nasync function safeStkPush(orderId, phone, amount) {\n  const key = generateIdempotencyKey(orderId, amount, phone);\n  const existing = await db.orders.findByIdempotencyKey(key);\n  if (existing?.checkoutRequestId) {\n    console.log("Duplicate detected — returning existing CheckoutRequestID");\n    return { CheckoutRequestID: existing.checkoutRequestId, isDuplicate: true };\n  }\n  await db.orders.setIdempotencyKey(orderId, key);\n  return initiateSTKPush({ phone, amount, orderId });\n}\n\n// 2. EXPONENTIAL BACKOFF RETRY\nasync function withRetry(fn, maxAttempts = 3, baseDelayMs = 2000) {\n  for (let attempt = 1; attempt <= maxAttempts; attempt++) {\n    try {\n      return await fn();\n    } catch (error) {\n      const isRetryable = [500, 503, 429].includes(error.response?.status)\n        || error.code === "ECONNRESET";\n      if (!isRetryable || attempt === maxAttempts) throw error;\n      const delay = baseDelayMs * Math.pow(2, attempt - 1); // 2s, 4s, 8s\n      console.log(\`Attempt \${attempt} failed. Retrying in \${delay}ms...\`);\n      await new Promise(resolve => setTimeout(resolve, delay));\n    }\n  }\n}\n// Usage: withRetry(() => initiateSTKPush({ phone, amount, orderId }))\n\n// 3. CIRCUIT BREAKER — stop retrying after consecutive failures\nconst circuitState = { failures: 0, lastFailure: null, isOpen: false };\nconst FAILURE_THRESHOLD = 5;\nconst RECOVERY_TIME_MS = 60000; // 1 minute\nfunction checkCircuit() {\n  if (!circuitState.isOpen) return;\n  const timeSinceFailure = Date.now() - circuitState.lastFailure;\n  if (timeSinceFailure > RECOVERY_TIME_MS) {\n    circuitState.isOpen = false;\n    circuitState.failures = 0;\n    console.log("Circuit breaker reset — attempting recovery");\n    return;\n  }\n  throw new Error("Circuit open — Daraja API unavailable. Retry in " + \n    Math.round((RECOVERY_TIME_MS - timeSinceFailure) / 1000) + "s");\n}\nfunction recordFailure() {\n  circuitState.failures++;\n  circuitState.lastFailure = Date.now();\n  if (circuitState.failures >= FAILURE_THRESHOLD) {\n    circuitState.isOpen = true;\n    console.error("CIRCUIT BREAKER OPENED — 5 consecutive Daraja failures");\n    // Alert your monitoring channel (Slack, email, SMS)\n  }\n}\n\n// 4. DEAD LETTER QUEUE — log permanently failed transactions for manual review\nasync function saveToDLQ(orderId, error) {\n  await db.deadLetterQueue.create({\n    orderId,\n    errorCode: error.response?.data?.errorCode,\n    errorMessage: error.message,\n    requestPayload: JSON.stringify(error.config?.data),\n    createdAt: new Date()\n  });\n  console.error(\`Order \${orderId} sent to DLQ — requires manual review\`);\n}\n\nSubmit: (1) a complete hardened-stk.js file combining all 4 patterns, (2) write a test that triggers a 401 error by using an expired token and show that it refreshes and retries automatically, (3) write a test that triggers the circuit breaker by mocking 5 consecutive 503 errors — show the circuit opening and the recovery after 60 seconds, (4) show the DLQ database table with at least one failed transaction record.`,
        quizQuestions: [
          { question: "A customer clicks Pay twice because the page was slow. Both requests reach your server with the same orderId and amount. What prevents the customer from being charged twice?", options: ["The Daraja API automatically rejects duplicate STK Push requests", "An idempotency key based on the orderId — the second request finds the key already in the database and returns the existing CheckoutRequestID without making a new Daraja API call", "Rate limiting on your API route — only one request per order is allowed", "The STK Push callback deduplicates on CheckoutRequestID automatically"], correctAnswer: 1 },
          { question: "Your Daraja API call fails with a 429 status code. What is the correct response?", options: ["Retry immediately — 429 usually resolves within a few milliseconds", "Wait the duration specified in the Retry-After header (or default to 60 seconds) before retrying — 429 means you are being rate limited and immediate retries will be rejected", "Stop retrying and log the error to the dead letter queue", "Switch to a different Daraja API endpoint that is not rate limited"], correctAnswer: 1 },
          { question: "The circuit breaker in your payment system is open with 5 consecutive failures recorded. A new payment request arrives. What should your system do?", options: ["Attempt the payment anyway — the circuit breaker should not block customer payments", "Return an error immediately without calling the Daraja API — the circuit is open because the API is down and calling it will just add another failure and delay the customer", "Queue the payment and wait for the circuit to close", "Reset the failure count and try once more before opening the circuit again"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 6,
        title: "Payment Logging, Receipts, and Reconciliation",
        type: "sandbox",
        hook: "KRA requires payment records. Your business requires an audit trail. Your customers require receipts. A well-built logging system satisfies all three simultaneously — and takes a developer 4 hours to build once versus days of manual reconciliation every month.",
        duration_mins: 20,
        isAvailable: true,
        content: "Design a comprehensive payment logging schema for Supabase, generate customer-facing M-Pesa receipts as formatted text for WhatsApp delivery, build a daily reconciliation report that matches system records against the M-Pesa statement, and expose a simple admin API for finance teams.",
        sandboxTask: `Build the complete payment logging and reconciliation system for Duka Smart.\n\nPART 1 — DATABASE SCHEMA (Supabase SQL):\nCREATE TABLE payments (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  order_id TEXT NOT NULL,\n  checkout_request_id TEXT UNIQUE,\n  mpesa_receipt_number TEXT UNIQUE,\n  phone_number TEXT NOT NULL,\n  amount DECIMAL(12,2) NOT NULL,\n  transaction_type TEXT NOT NULL, -- STK_PUSH, C2B, B2C\n  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED, CANCELLED\n  failure_reason TEXT,\n  transaction_date TIMESTAMPTZ,\n  idempotency_key TEXT UNIQUE,\n  raw_callback JSONB, -- store full Safaricom callback for audit\n  created_at TIMESTAMPTZ DEFAULT NOW(),\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n);\nCREATE INDEX idx_payments_order_id ON payments(order_id);\nCREATE INDEX idx_payments_receipt ON payments(mpesa_receipt_number);\nCREATE INDEX idx_payments_status_date ON payments(status, created_at);\n\nPART 2 — WHATSAPP RECEIPT GENERATOR:\nfunction generateWhatsAppReceipt(payment) {\n  const date = new Date(payment.transaction_date);\n  const formatted = date.toLocaleString("en-KE", {\n    timeZone: "Africa/Nairobi",\n    day: "2-digit", month: "short", year: "numeric",\n    hour: "2-digit", minute: "2-digit"\n  });\n  return [\n    "✅ *PAYMENT CONFIRMED*",\n    \`🏪 Duka Smart Kenya\`,\n    \`━━━━━━━━━━━━━━━━━\`,\n    \`📋 Receipt: \${payment.mpesa_receipt_number}\`,\n    \`💰 Amount: KSh \${payment.amount.toLocaleString("en-KE")}\`,\n    \`📱 Phone: \${payment.phone_number}\`,\n    \`🕐 Date: \${formatted}\`,\n    \`📦 Order: \${payment.order_id}\`,\n    \`━━━━━━━━━━━━━━━━━\`,\n    \`Thank you for shopping at Duka Smart!\`,\n    \`Support: +254 700 000 000\`\n  ].join("\\n");\n}\n\nPART 3 — DAILY RECONCILIATION REPORT API:\napp.get("/admin/reconciliation", adminAuth, async (req, res) => {\n  const { date } = req.query; // YYYY-MM-DD\n  const start = new Date(date + "T00:00:00+03:00");\n  const end = new Date(date + "T23:59:59+03:00");\n  const { data: payments } = await supabase\n    .from("payments")\n    .select("*")\n    .gte("created_at", start.toISOString())\n    .lte("created_at", end.toISOString());\n  const summary = {\n    date,\n    totalTransactions: payments.length,\n    successCount: payments.filter(p => p.status === "SUCCESS").length,\n    failedCount: payments.filter(p => p.status === "FAILED").length,\n    pendingCount: payments.filter(p => p.status === "PENDING").length,\n    totalRevenue: payments\n      .filter(p => p.status === "SUCCESS")\n      .reduce((sum, p) => sum + Number(p.amount), 0),\n    successRate: (payments.filter(p => p.status === "SUCCESS").length / payments.length * 100).toFixed(1) + "%",\n    transactions: payments.map(p => ({\n      orderId: p.order_id,\n      receipt: p.mpesa_receipt_number,\n      amount: p.amount,\n      status: p.status,\n      time: p.transaction_date\n    }))\n  };\n  res.json(summary);\n});\n\nSubmit: (1) Supabase screenshot showing the payments table schema, (2) a sample WhatsApp receipt formatted message, (3) a sample reconciliation API response for a day with at least 5 transactions of mixed statuses, (4) write a SQL query that identifies all PENDING payments older than 2 hours (these need the status query fallback run against them).`,
        quizQuestions: [
          { question: "Why should you store the full raw Safaricom callback JSON in your payments table rather than only the fields you currently use?", options: ["The raw JSON makes reconciliation faster than structured fields", "Daraja callback structures can change — storing raw JSON means you can extract new fields in the future without modifying past records, and it provides a complete audit trail if any transaction is disputed", "It reduces database query time to store everything in one column", "KRA specifically requires raw JSON payment records for VAT compliance"], correctAnswer: 1 },
          { question: "Your daily reconciliation report shows 3 payments with status PENDING from 14 hours ago. What does this indicate and what should you do?", options: ["Normal — pending payments sometimes take up to 24 hours to resolve", "These are payments where the STK Push callback was never received — run the Transaction Status query for each CheckoutRequestID to force resolution and update the status to SUCCESS or FAILED", "The customer has not yet entered their PIN — send them a reminder", "These are fraudulent transactions — cancel them immediately"], correctAnswer: 1 },
          { question: "A customer disputes a payment claiming they paid twice. You check the payments table by their phone number. What column uniqueness constraint prevents genuine duplicate M-Pesa payments from being recorded twice?", options: ["The id UUID which is generated per record", "The mpesa_receipt_number UNIQUE constraint — Safaricom issues a unique receipt number per transaction so the same payment can never be inserted twice", "The phone_number column prevents the same customer from appearing twice", "The order_id prevents duplicate payments for the same order"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 7,
        title: "Security, Compliance, and Production Deployment",
        type: "reading",
        hook: "A payment system that works is table stakes. A payment system that is secure, compliant with Kenyan financial regulations, and passes Safaricom's production go-live review is what separates a portfolio project from a production system that handles real money.",
        duration_mins: 8,
        isAvailable: true,
        content: "Security requirements for production Daraja integrations: credential management, IP whitelisting for Safaricom callback IPs, HTTPS enforcement, callback payload integrity, and the Safaricom go-live process — business verification, shortcode application, and production credential deployment.",
        readingTopics: [
          "Credential hierarchy — Consumer Key/Secret, Access Token, SecurityCredential, Initiator Name — what each is and how to protect each",
          "IP whitelisting — restricting your callback endpoints to Safaricom's published callback IP ranges",
          "The Safaricom production go-live checklist — what they audit before approving a production shortcode",
          "Environment separation — never use production credentials in development, never use sandbox credentials in production",
          "The KRA compliance requirements for electronic payment records and receipt generation",
        ],
        theory: {
          concept: "Production Daraja deployments have five security requirements that are non-negotiable for Safaricom's go-live approval. (1) HTTPS everywhere — your callback URLs must use HTTPS with a valid certificate. Self-signed certificates are not accepted. (2) Credential isolation — Consumer Key and Consumer Secret in environment variables only, never in code or logs. SecurityCredential regenerated whenever the Initiator password changes. (3) IP whitelisting — Safaricom's production callback servers use specific IP ranges. Whitelist these on your server firewall to prevent spoofed callbacks from triggering payment confirmations. (4) Callback validation — verify that incoming callbacks match expected format and contain valid data before processing. (5) Audit logging — every transaction must be logged with full metadata, status, and the raw callback payload. KRA requires electronic transaction records for 7 years. The Safaricom go-live process involves: registering your business (company registration, KRA PIN, director IDs), applying for a production shortcode (Paybill or Till), completing an integration audit (they test all your endpoints), and receiving production credentials after approval. This process typically takes 2-4 weeks.",
          badExample: "Deploy the payment system to production using the sandbox credentials and the same code used for development, storing the Consumer Key in the application config file committed to GitHub.",
          badBreakdown: [
            { element: "Credential type", present: "Sandbox credentials in production", problem: "Sandbox and production use completely separate authentication systems — sandbox credentials will fail in production with 401 errors" },
            { element: "Credential storage", present: "Config file committed to GitHub", problem: "Any developer with repository access (or any person if the repo is public) can steal the credentials and use them to make API calls against your live M-Pesa account" },
            { element: "Environment separation", present: "Same code for both environments", problem: "Production bugs become harder to debug when sandbox test data pollutes production logs and database" },
            { element: "IP whitelist", present: "Not configured", problem: "Any server on the internet can send fake callbacks to your confirmation URL — an attacker can fake payment notifications for free" },
            { element: "HTTPS", present: "Not mentioned", problem: "Safaricom will reject callback registration for HTTP URLs — only HTTPS is accepted for production" },
          ],
          badOutput: "A production deployment that: uses wrong credentials (fails immediately), stores secrets in source code (security breach risk), accepts callbacks from any IP (spoofing attack vector), and transmits payment data over HTTP (data interception risk).",
          goodExample: "Production deployment on Railway.app: HTTPS automatic (Railway provides TLS), all credentials in Railway environment variables (DARAJA_CONSUMER_KEY, DARAJA_CONSUMER_SECRET, MPESA_PASSKEY, MPESA_INITIATOR_PASSWORD), callback endpoint validates that the request origin IP is in Safaricom's published range (196.201.214.0/24), all payment records stored in Supabase with 7-year retention policy per KRA requirements.",
          goodBreakdown: [
            { element: "HTTPS", present: "Automatic via Railway TLS — zero configuration", improvement: "All data in transit encrypted — Safaricom callback registration accepted" },
            { element: "Credential storage", present: "Railway environment variables — not in code or logs", improvement: "Credentials inaccessible to anyone without Railway project access — safe even if code is open source" },
            { element: "IP validation", present: "Safaricom callback IP range whitelisted", improvement: "Fake callbacks from any other IP return 403 — no fraudulent payment confirmations possible" },
            { element: "Data retention", present: "7-year Supabase storage policy", improvement: "KRA compliant — transaction records available for any tax audit" },
            { element: "Audit logging", present: "Full raw callback stored per transaction", improvement: "Any disputed transaction can be investigated with complete evidence" },
          ],
          goodOutput: "A production payment system that passes Safaricom's go-live audit, is compliant with KRA transaction record requirements, is secure against callback spoofing, and has all credentials isolated from source code.",
          keyInsight: "The most commonly failed Safaricom production audit requirement is the callback URL test — they literally POST a test payload to your callback endpoints and check that you return the correct response format within 3 seconds. Developers who have only tested locally with ngrok often discover in the audit that their server is too slow or returning the wrong response format. Always test your callback endpoints with real network latency before applying for production.",
          ruleToRemember: "Production Daraja development rule: One environment = one set of credentials. sandbox.safaricom.co.ke = sandbox credentials. api.safaricom.co.ke = production credentials. Never mix them. Never commit either to source control.",
          checkYourUnderstanding: [
            {
              question: "A developer stores the Daraja Consumer Secret in a .env file and commits it to a public GitHub repository. What is the immediate risk?",
              options: [
                "GitHub will automatically detect and revoke the secret",
                "Anyone who finds the secret can use it to authenticate with Safaricom's API and make calls against your M-Pesa business account — including initiating B2C disbursements if they also have the SecurityCredential",
                "The secret stops working after 24 hours if it is in a public repository",
                "Only Safaricom employees can use exposed credentials maliciously — external attackers cannot access the API",
              ],
              correctAnswer: 1,
              explanation: "Exposed credentials are immediately a security incident. Bot scanners automatically search GitHub for API keys and can use them within minutes of a commit. Rotate credentials immediately — in the Safaricom developer portal generate new Consumer Key and Consumer Secret — and use environment variables or a secrets manager going forward.",
            },
            {
              question: "Your production server receives a POST to your C2B Confirmation URL from IP address 102.0.0.1 — not in Safaricom's published callback IP range 196.201.214.0/24. What should your server do?",
              options: [
                "Process the callback normally — it could be a valid Safaricom server IP not listed in the documentation",
                "Return HTTP 403 Forbidden and log the suspicious request — legitimate Safaricom callbacks always originate from their published IP range",
                "Accept the callback but flag it for manual review before processing the payment",
                "Send an alert to Safaricom about the suspicious request",
              ],
              correctAnswer: 1,
              explanation: "IP validation is your primary defence against callback spoofing attacks where an attacker fakes a payment confirmation. Return 403 for any callback not originating from Safaricom's published IP ranges. Log the request for investigation.",
            },
            {
              question: "Safaricom's production go-live audit team sends a test STK Push callback to your callback URL and receives no response after 5 seconds. What happens?",
              options: [
                "They retry automatically 3 more times before marking the test as passed",
                "Your go-live application is rejected until you fix the callback response time — Safaricom requires callback endpoints to respond within 3-5 seconds",
                "They approve the go-live anyway since the 5-second delay is within acceptable limits",
                "They mark the callback URL as unavailable and allow you to register a different URL",
              ],
              correctAnswer: 1,
              explanation: "Safaricom's production audit specifically tests callback response time. A slow response (due to heavy database queries, synchronous processing, or server load) will fail the audit. Always respond with the acknowledgement immediately and process the payment asynchronously.",
            },
          ],
        },
        quizQuestions: [
          { question: "What is the minimum data retention period for M-Pesa transaction records required for KRA compliance?", options: ["1 year from transaction date", "3 years from end of financial year", "7 years — in line with Kenya's Tax Procedures Act", "10 years for financial institutions only"], correctAnswer: 2 },
          { question: "Which of the following should NEVER appear in your application's server logs?", options: ["The M-Pesa receipt number for each transaction", "Error codes and status codes from Daraja API responses", "Your Daraja Consumer Secret or OAuth access token", "The order ID associated with each payment"], correctAnswer: 2 },
          { question: "Your Daraja integration is approved for production. What base URL change is required when switching from sandbox to production?", options: ["sandbox.safaricom.co.ke → api.safaricom.co.ke — all endpoint paths remain the same", "sandbox.safaricom.co.ke → production.safaricom.co.ke", "sandbox.safaricom.co.ke → live.daraja.co.ke", "No URL change needed — only the credentials change"], correctAnswer: 0 },
        ],
      },
      {
        lessonNumber: 8,
        title: "Final Project — Complete Payment System for Duka Smart",
        type: "project",
        hook: "Daraja-certified developers charge KSh 150,000 to KSh 400,000 per integration project. Every enterprise, SACCO, school, hospital, and e-commerce business in Kenya needs this. This project is the proof that you can build it.",
        duration_mins: 90,
        isAvailable: true,
        content: "Build and deploy a complete M-Pesa payment system for Duka Smart — a fictional Kenyan e-commerce platform. STK Push checkout with callback handling, C2B Paybill registration, B2C refund capability, full audit logging, WhatsApp receipts, and a reconciliation dashboard.",
        sandboxTask: "Build and deploy the complete Duka Smart payment system. All components must work end-to-end in the Daraja sandbox.\n\nCOMPONENTS REQUIRED:\n\n1. STK PUSH CHECKOUT: API endpoint POST /api/checkout that accepts { orderId, phone, amount }, initiates STK Push, stores the pending payment, and returns { checkoutRequestId, status: 'PENDING' }.\n\n2. STK CALLBACK HANDLER: POST /mpesa/stk-callback — processes success and failure callbacks, updates payment and order status, sends WhatsApp receipt on success.\n\n3. C2B REGISTRATION: One-time URL registration script that registers your Validation and Confirmation URLs against sandbox shortcode 600998. Validation handler accepts payments where AccountReference matches a valid order ID. Confirmation handler records the payment.\n\n4. B2C REFUND: POST /api/refund that accepts { orderId, phone, amount, reason } — initiates B2C BusinessPayment back to the customer, handles Result and QueueTimeoutURL callbacks.\n\n5. AUDIT LOGGING: All transactions logged to Supabase payments table with the full schema from Lesson 6. Idempotency keys on STK Push. Exponential backoff retry on network errors.\n\n6. RECONCILIATION DASHBOARD: Simple HTML page at /admin/reconciliation showing today's totals — total revenue, success count, failed count, pending count, and a transaction table with export to CSV.\n\nDEPLOYMENT: Deploy to Railway.app (free tier). All credentials in environment variables. Share the Railway URL.\n\nSubmit: (1) GitHub repository link with all code, (2) Railway deployment URL, (3) screenshot of a successful STK Push test with the receipt logged in Supabase, (4) screenshot of the reconciliation dashboard, (5) 400-word technical architecture summary explaining your design decisions for error handling and idempotency.",
      },
      {
        lessonNumber: 9,
        title: "Capstone: Real-Time Payroll Disbursement System",
        type: "project",
        hook: "Payroll is the highest-stakes B2C use case — every missed or duplicated salary payment has real human consequences. Building a system that handles this correctly and safely is your demonstration of production-level competence.",
        duration_mins: 120,
        isAvailable: true,
        content: "Design and build a complete payroll disbursement system for Fahari Logistics — a fictional company with 45 drivers paid weekly. The system reads from a payroll database, validates balances, disburses via B2C, handles failures, and generates payslips.",
        sandboxTask: "Build the Fahari Logistics payroll disbursement system using B2C. The system must disburse weekly pay to 45 fictional drivers, handle failures gracefully, and produce payslip receipts via WhatsApp.\n\nPayroll table schema: drivers (id, name, phone, weekly_pay_kes, bank_code). For the sandbox test use 5 fictional drivers with the sandbox test number 254708374149 used for all (to actually trigger callbacks).\n\nRequirements: (1) A /admin/run-payroll endpoint that reads all drivers, checks the M-Pesa business account balance is sufficient before starting, then processes disbursements with a 2-second delay between each to avoid rate limits. (2) Each B2C call uses SalaryPayment CommandID with TransactionDesc set to 'Weekly pay - [driver name] - week ending [date]'. (3) On success, send a WhatsApp payslip to the driver: 'Habari [name], mshahara wako wa KSh [amount] umekufikia. Wiki: [date]. — Fahari Logistics'. (4) On QueueTimeout failure, mark as FAILED and add to a retry queue. (5) Generate a payroll run report showing total disbursed, successful count, failed count, and a list of any failed disbursements requiring manual follow-up. Submit: GitHub repo, deployed Railway URL, payroll run report for a test run, and at least one WhatsApp payslip screenshot.",
      },
    ],
    capstone: {
      title: "Daraja API Certified Developer",
      description: "You are hired by a Nairobi hospital to integrate M-Pesa payments for their outpatient billing system. Patients pay for consultations and prescriptions via M-Pesa. The hospital's finance team reconciles transactions daily. Design and implement the core payment flows.",
      task: "Build the Nairobi General Hospital M-Pesa billing integration. The system must: (1) STK Push for outpatient billing — when a patient checks out the system triggers an STK Push to their registered phone for the consultation amount. (2) C2B for walk-in payments — patients can pay directly from their M-Pesa menu using Paybill 522533 with account reference set to their patient ID. (3) Payment verification — the hospital must be able to verify any payment by receipt number before releasing prescriptions. Build a GET /verify/:receiptNumber endpoint that returns the payment details. (4) Daily reconciliation — a report comparing total expected revenue (from billing system) vs total received payments from M-Pesa, with a list of any unpaid bills over 4 hours old. (5) Refund processing — if a patient was billed incorrectly the finance team can initiate a B2C refund from the hospital admin panel.",
      rubric: {
        specificity: { weight: 25, description: "All 5 components have working code with correct Daraja API payload structures — not pseudocode. Correct endpoint paths, parameter names, and response formats score 20-25." },
        businessAccuracy: { weight: 25, description: "The reconciliation report correctly identifies unpaid bills by joining billing and payments data. The C2B Validation URL rejects payments with non-existent patient IDs. The medical context (patient IDs, prescription release logic) is correctly modelled." },
        implementationRealism: { weight: 20, description: "Error handling on all API calls, idempotency on STK Push, retry logic on B2C failures, and proper status transition logic (PENDING→PAID or FAILED) are all present." },
        ethicsQuality: { weight: 15, description: "Patient data (names, phone numbers) are not logged in plain text. All credentials in environment variables. IP whitelisting comment or implementation present. HTTPS deployment." },
        professionalQuality: { weight: 15, description: "Code is commented and structured so a hospital IT team could maintain it. README explains setup steps. Environment variable names are documented." },
      },
      passingScore: 70,
    },
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // COURSE 6 — ai-agriculture
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-agriculture",
    title: "AI for Agriculture and Agritech",
    tagline: "Feed the Future with AI-Powered Farming",
    description:
      "Apply AI to crop prediction, market pricing, supply chain, and farmer advisory systems. Built specifically for East African agricultural context — real Kenyan data, real agritech problems.",
    level: "Intermediate",
    price_kes: 3000,
    lessons_count: 6,
    badge_name: "Agritech AI Specialist",
    what_you_will_learn: [
      "Apply AI to crop yield prediction using Kenyan weather and soil data from KALRO and KMD",
      "Forecast maize, beans, and coffee market prices to help farmers and cooperatives time their sales",
      "Analyse post-harvest loss data and design AI-powered storage and transport optimisation systems",
      "Build a WhatsApp-based farmer advisory system that delivers personalised recommendations to smallholders",
      "Design a complete AI agritech solution for a Kenyan cooperative that NGOs and agritech companies will hire you to build",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Welcome to AI for Agriculture and Agritech",
        type: "intro" as const,
        hook: "An agritech startup in Nakuru built an AI tool that tells smallholder maize farmers the optimal day to sell based on market price forecasts and their storage condition data. Farmers using the tool earned on average 23% more per kilogram than those selling without it. The tool was built by a data analyst who knew no agriculture before starting — but who understood how to ask the right AI questions of agricultural data.",
        duration_mins: 5,
        isAvailable: true,
        content: "Agriculture employs 40% of Kenya's workforce and contributes 26% of GDP — yet most farms still operate on guesswork and manual systems. This course applies AI to the problems that matter most in East African agriculture: predicting crop yields, forecasting market prices, reducing post-harvest losses, and building tools that help farmers make better decisions from the data they already have.",
        introWhoFor: [
          "An agritech professional who wants to add AI capabilities to their current role at an NGO, government body, or startup",
          "A data analyst interested in applying their skills to agriculture and food systems in East Africa",
          "A developer who wants to build meaningful products for the agricultural sector where demand far exceeds supply of technical talent",
          "A graduate in agriculture or environmental science who wants to combine domain knowledge with AI to create a genuinely differentiated career",
        ],
        introOutcomes: [
          "Build a crop yield prediction system using Kenyan weather and soil data and explain its outputs to a farmer or cooperative manager",
          "Forecast commodity prices for maize, beans, and coffee using historical AMIS-Kenya data and AI modelling",
          "Analyse post-harvest loss data to identify the highest-impact interventions for a real cooperative",
          "Design and prototype a WhatsApp-based farmer advisory system that delivers personalised recommendations without internet access",
          "Deliver a complete AI-powered smart farm proposal for Ndege Mbili Cooperative that an agritech investor or NGO could fund",
        ],
        introStructure: {
          lessonsCount: 10,
          hours: 5,
          sandboxCount: 3,
          finalProject: "AI-powered smart farm proposal for Ndege Mbili Cooperative — 120 farmers in Meru County",
        },
        introFirstTask: "Think of one agricultural problem you have personally seen or experienced in Kenya — crop loss, unfair pricing, delayed payments, post-harvest damage. Write it in one sentence. By lesson 4 you will have built an AI-assisted analysis of that exact problem.",
      },
      {
        lessonNumber: 1,
        title: "AI in East African Agriculture — The Opportunity Map",
        type: "video",
        hook: "Kenya loses 30-40% of its food to post-harvest losses every year. A maize farmer in Eldoret sells at KSh 28 per kilo in March when the price is at its seasonal low — then watches the price hit KSh 55 in August. An agritech startup with a price forecasting model helped 3,200 farmers in the Rift Valley time their sales better in 2023. Average income improvement: KSh 18,000 per household per season. One AI model. Built by one data analyst. 3,200 families.",
        duration_mins: 9,
        isAvailable: true,
        content: "The five highest-value AI applications in East African agriculture and the specific problems each one solves. Where AI works reliably in agricultural contexts, where it fails, and why East Africa is a higher-opportunity AI agriculture market than most Western contexts due to the combination of mobile connectivity, M-Pesa infrastructure, and data scarcity that AI can help address.",
        theory: {
          concept: "AI adds value in agriculture when it can process data faster or at greater scale than a human expert, and when that faster processing changes a decision. The five highest-value agricultural AI applications in East Africa are: (1) Crop yield prediction — using weather data, soil sensors, satellite imagery, and historical yield records to forecast the output of a specific farm or cooperative plot weeks before harvest. This changes planting decisions, input purchasing, and storage preparation. (2) Market price forecasting — using historical commodity price data from AMIS-Kenya, EAGC, and county market reports to forecast price movements for maize, beans, coffee, and other crops. This changes when farmers sell. (3) Post-harvest loss reduction — using logistics data, storage condition data, and spoilage records to identify the points in the supply chain where the most value is lost and recommend interventions. (4) Input optimisation — using soil test data and crop variety information to recommend optimal fertiliser application rates, reducing input cost while maintaining yield. (5) Pest and disease early warning — using satellite imagery, field reports, and climate data to forecast the spread of fall armyworm, wheat rust, and other pests before farmers can visually detect them.",
          badExample: "Build an AI system for Kenyan farmers.",
          badBreakdown: [
            { element: "Problem specificity", present: "None", problem: "Kenyan farmers have dozens of different problems — an AI system that tries to solve all of them solves none of them well" },
            { element: "Data source", present: "Not specified", problem: "Different agricultural AI systems require completely different data — satellite imagery, weather station data, market price records, or soil sensors. Without specifying the data source there is nothing to build" },
            { element: "Decision it supports", present: "Not identified", problem: "AI adds value when it changes a specific decision. Without identifying the decision the system is a solution looking for a problem" },
            { element: "Farmer interface", present: "Absent", problem: "Most Kenyan smallholders do not have smartphones or internet access — an AI system with a web dashboard is inaccessible to 80% of the target users" },
            { element: "Validation approach", present: "Not defined", problem: "Agricultural AI that is wrong in the wrong direction can cost a farmer their entire season — accuracy requirements and validation standards must be defined before building" },
          ],
          badOutput: "A generic farm management app that shows weather forecasts and commodity prices but does not tell any specific farmer what to do with that information in their specific situation.",
          goodExample: "Build a maize price forecasting model for smallholder farmers in the Rift Valley. Input data: 5 years of weekly maize prices from EAGC markets (Eldoret, Nakuru, Nairobi) plus ENSO weather index and rainfall anomaly data. Output: a 12-week price forecast with a confidence interval for the Eldoret market. Delivery: SMS and WhatsApp — a weekly message to registered farmers: 'Mahindi bei wiki hii: KSh 32/kg. Utabiri wiki 8: KSh 48-52/kg. Ushauri: hifadhi mpaka wiki 6-8.' (Maize price this week: KSh 32/kg. Forecast week 8: KSh 48-52/kg. Advice: store until week 6-8.) Validation: model accuracy measured against actual prices for the previous 52 weeks before deployment.",
          goodBreakdown: [
            { element: "Problem specificity", present: "Maize price forecasting for Rift Valley smallholders", improvement: "One specific problem in one specific crop for one specific geography — tractable and valuable" },
            { element: "Data source", present: "EAGC market prices plus ENSO and rainfall data — all publicly available", improvement: "Specific named data sources that can be accessed today — no data collection required to start" },
            { element: "Decision it supports", present: "When to sell — store vs sell now", improvement: "One specific high-value decision is supported — farmer knows exactly what to do with the output" },
            { element: "Farmer interface", present: "SMS and WhatsApp in Swahili — works on any phone", improvement: "Accessible to any farmer with a basic phone and a KSh 20 airtime balance" },
            { element: "Validation approach", present: "52-week backtest before deployment", improvement: "Farmer trust built on demonstrated accuracy not theoretical capability" },
          ],
          goodOutput: "A deployed WhatsApp bot that sends 3,200 Rift Valley maize farmers a weekly price forecast and sell/hold recommendation. Season one results: average selling price for subscribed farmers KSh 43/kg vs KSh 32/kg for non-subscribers. Average income improvement KSh 18,000 per household on a 2-acre farm.",
          keyInsight: "The single most important rule for agricultural AI in East Africa is: design for the interface constraints of the target user first. If your AI output requires a web browser and reliable internet it will never reach a smallholder farmer in Meru or a fisher in Kisumu. WhatsApp and SMS are the only universal delivery channels. Any AI system that cannot deliver its recommendations through one of these two channels cannot serve the majority of the agricultural workforce.",
          ruleToRemember: "Agricultural AI that cannot reach the farmer on the device they already have and the network they already use is a laboratory exercise not a deployed product. Always design for WhatsApp and SMS delivery before anything else.",
          checkYourUnderstanding: [
            {
              question: "A tech company wants to build an AI yield prediction system for Kenyan tea farmers. They plan to deliver the predictions through a web dashboard. What is the primary deployment risk?",
              options: [
                "Tea yield prediction models are not accurate enough for commercial deployment",
                "Most tea farmers in Kenya do not have reliable internet access to use a web dashboard — the AI predictions will not reach the people they are designed to help",
                "The Kenyan government does not allow AI systems in the agricultural sector",
                "Tea farming data is insufficient to train any meaningful AI model",
              ],
              correctAnswer: 1,
              explanation: "Interface design for the actual user is the most commonly missed requirement in agritech AI projects. A web dashboard serves agritech company staff and cooperative managers but cannot reach the 4.5 million smallholder farmers in Kenya who need the information most. WhatsApp and SMS are the only universal channels.",
            },
            {
              question: "Of the five AI agriculture applications listed, which one supports the highest-value single farmer decision in the East African context?",
              options: [
                "Pest detection — catching diseases early prevents complete crop loss",
                "Market price forecasting — the decision of when to sell maize or beans can change a farmer's income by 40-80% for the same physical harvest",
                "Yield prediction — knowing in advance allows better planning",
                "Input optimisation — reducing fertiliser cost improves margins significantly",
              ],
              correctAnswer: 1,
              explanation: "Timing the sale of maize or beans is the highest-leverage decision a smallholder makes each season. A farmer who sells in March at KSh 28/kg instead of holding until August at KSh 55/kg loses 96% of potential additional income on the same physical harvest. Price forecasting directly addresses this loss. It requires no physical infrastructure — just data and a phone.",
            },
            {
              question: "You want to build an AI early warning system for fall armyworm spread in Western Kenya. Which data source would provide the most useful leading indicator of infestation risk?",
              options: [
                "Daily maize price data from Kisumu market — price drops when infestation reduces supply",
                "Historical infestation records combined with rainfall and temperature anomaly data — fall armyworm spreads faster under specific climate conditions that can be forecast",
                "Farmer phone call records to county agricultural extension offices",
                "Satellite imagery showing maize field coverage area",
              ],
              correctAnswer: 1,
              explanation: "Fall armyworm outbreak risk is strongly correlated with specific climate conditions — warm nights above 18°C, moderate humidity, and rainfall pattern anomalies. Historical infestation data combined with climate forecasts can predict outbreak risk 2-3 weeks before visual detection, giving farmers time to apply preventive treatment.",
            },
          ],
        },
        quizQuestions: [
          { question: "Why is WhatsApp the most appropriate delivery channel for AI agricultural recommendations in East Africa?", options: ["WhatsApp is free for developers to use at scale", "WhatsApp reaches farmers on basic smartphones and feature phones and works with minimal data — it is the most widely used communication channel across Kenyan agricultural communities including in rural areas", "WhatsApp provides built-in data analytics for tracking farmer engagement", "Kenyan agricultural regulations require WhatsApp for all advisory communications"], correctAnswer: 1 },
          { question: "An AI crop yield prediction model is tested on historical data and achieves 78% accuracy. Before deploying it to 5,000 farmers, what is the most important additional validation step?", options: ["None — 78% accuracy is sufficient for commercial deployment", "Test it on data from the current season before relying on historical accuracy — weather patterns shift and model performance on recent data may differ significantly from historical backtests", "Increase the training data to 10 years to improve accuracy before any deployment", "Deploy to 10 farmers first and measure actual farmer satisfaction not just model accuracy"], correctAnswer: 1 },
          { question: "A cooperative in Meru wants to use AI to reduce post-harvest losses on avocado. The first step before building any AI model is:", options: ["Build a machine learning model using global avocado supply chain data", "Collect and analyse data on where losses actually occur in the Meru avocado supply chain — at what stage, in what volume, and from what cause — before deciding what AI can help with", "Buy cold storage equipment — post-harvest loss is a logistics problem not an AI problem", "Apply for a government agritech grant to fund the development"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 2,
        title: "Crop Yield Prediction — Using Weather and Farm Data",
        type: "sandbox",
        hook: "A smallholder farmer in Nakuru who knows 8 weeks before harvest that their maize yield will be 40% below average can: buy supplemental grain early before prices spike, negotiate with the cooperative for a lower repayment target, and plan for the lean season. Without that intelligence they find out at harvest — when it is too late for every one of those decisions.",
        duration_mins: 20,
        isAvailable: true,
        content: "Using weather data, soil variables, and historical yield records to build crop yield prediction models. How to use AI to analyse the relationship between input variables and yield outcomes, run scenario analysis (normal rain / drought / above-average rain), and communicate predictions in a format that smallholder farmers can act on.",
        sandboxTask: "You are an analyst at Agrisense Kenya — a fictional agritech startup working with maize farmers in Nakuru County. Use the following fictional 5-year dataset summary to build a yield prediction analysis.\n\nDATASET: 847 seasonal yield records from 180 plots in Nakuru County, 2019-2023. Variables: Rainfall_mm (seasonal total), Temp_avg_C (average growing season temperature), Soil_pH, Fertilizer_kgperacre (total NPK applied), Variety (H614D / DH04 / Pioneer), Plot_size_acres, Yield_90kg_bags_peracre (outcome variable).\n\nKEY STATISTICS FROM THE DATA:\n- Average yield: 12.4 bags/acre (range: 3.1 to 28.6)\n- H614D variety mean yield: 10.2 bags/acre\n- DH04 variety mean yield: 14.1 bags/acre\n- Pioneer variety mean yield: 16.8 bags/acre\n- Correlation with rainfall: +0.61 (moderate positive)\n- Correlation with fertiliser: +0.54\n- 2022 drought year: average yield 7.1 bags/acre (-43% vs average)\n- Optimal rainfall for maximum yield: 550-750mm seasonal\n- Soil pH sweet spot: 5.8-6.5\n\nUsing AI (Claude or ChatGPT) and the statistics above, complete all 4 tasks:\n\nTASK 1 — SCENARIO ANALYSIS: Build a table showing predicted yield range for the upcoming season under 3 scenarios: (a) Normal rain 620mm, average temp, pH 6.2, DH04 variety, 80kg fertiliser/acre. (b) Drought 280mm, all other variables same. (c) Above-average rain 850mm, same variables. For each scenario: predicted yield range in bags/acre, predicted revenue range per acre at KSh 3,200/90kg bag, recommended action for cooperative management.\n\nTASK 2 — FARMER-FRIENDLY SUMMARY: Write a WhatsApp message that a cooperative extension officer could send to all 180 farmers explaining the predicted yield for the upcoming season under the normal rain scenario. Maximum 3 sentences. In Swahili (translate yourself or use AI).\n\nTASK 3 — KEY INSIGHT: Which single variable has the strongest relationship with yield in this dataset? What is the practical recommendation for farmers based on this insight?\n\nTASK 4 — LIMITATION STATEMENT: Write 2 sentences that the cooperative manager should say when presenting this prediction to farmers — that accurately explain what the prediction can and cannot tell them.\n\nShow all AI prompts you used and the responses you received.",
        quizQuestions: [
          { question: "A yield prediction model trained on 2018-2022 Nakuru data predicts 15 bags/acre for a farmer in Trans Nzoia for 2024. How reliable is this prediction?", options: ["Highly reliable — 5 years of data is sufficient for any agricultural AI model", "Moderately useful as a directional indicator but should be treated with caution — the model was trained in a different county with different soil types, microclimates, and farming practices", "Completely unreliable — AI cannot predict crop yields", "Perfectly reliable — maize agronomy is the same everywhere in Kenya"], correctAnswer: 1 },
          { question: "A farmer asks why their actual yield was 9 bags/acre when the AI predicted 14 bags/acre. What is the most honest and useful response?", options: ["The AI model is broken and should not be used", "Yield prediction models capture average patterns — individual plot outcomes vary due to local factors the model cannot measure including pest pressure, localised microclimate, and specific field management practices", "The farmer must have made a mistake in their farming practices", "The prediction was for a different year's weather conditions"], correctAnswer: 1 },
          { question: "Which variable would add the most predictive value to the Nakuru yield model if it were added to the dataset?", options: ["Farmer age and education level", "Market maize prices for the previous season", "Localised field-level rainfall from rain gauge records rather than county-level averages", "Distance from the farmer's plot to the nearest town"], correctAnswer: 2 },
        ],
      },
      {
        lessonNumber: 3,
        title: "Market Price Forecasting — Helping Farmers Time Their Sales",
        type: "sandbox",
        hook: "In 2023 maize prices in Eldoret were KSh 28 per kilogram in March and KSh 58 per kilogram in September — a 107% difference. Farmers who sold at harvest in March earned half the income of those who stored. An AI price forecasting model available on WhatsApp could have told every farmer in the Rift Valley which way prices were going. For the cost of a single SMS.",
        duration_mins: 20,
        isAvailable: true,
        content: "Agricultural commodity price forecasting using historical AMIS-Kenya data, seasonal pattern analysis, and AI-assisted trend modelling. Covers the key variables that drive Kenyan maize, bean, and coffee prices and how to build forecasts that are actually useful to farmers and cooperative managers.",
        sandboxTask: "Build a price forecasting analysis for maize in the Rift Valley. Use the following fictional dataset summary to complete the 4 tasks.\n\nDATASET: Weekly wholesale maize prices (KSh per 90kg bag) across 5 Rift Valley markets (Eldoret, Nakuru, Kitale, Eldama Ravine, Iten) from January 2021 to December 2023 (156 weeks per market).\n\nKEY PATTERNS IN THE DATA:\n- Annual low: March-April (post-long-rains harvest) — average KSh 2,400-2,800 per bag\n- Annual high: August-September (pre-short-rains, low supply) — average KSh 4,800-5,800 per bag\n- Price spread between Kitale (producing area) and Eldoret (consuming area): average KSh 350/bag\n- ENSO La Niña years (2021, 2022 partial): above-average prices sustained 3 months longer than El Niño years\n- Month-on-month price change standard deviation: KSh 180/bag (high short-term variability)\n- Long-term trend: +KSh 120/bag per year across the dataset\n\nCurrent week (assume March 2024): Eldoret price KSh 2,650/bag. 3-month weather forecast from KMD: normal to slightly below-normal rainfall expected March-May 2024.\n\nTASK 1 — 12-WEEK FORECAST: Using AI analysis of the seasonal patterns, build a 12-week price forecast for Eldoret market. Format: table with Week, Expected Price Range (KSh/bag), Confidence (High/Medium/Low), Key Driver. Assume normal 2024 long rains.\n\nTASK 2 — SELL OR STORE RECOMMENDATION: A cooperative manager in Eldoret has 500 bags of maize purchased from members at KSh 2,400/bag. They can sell now at KSh 2,650 or store for up to 16 weeks. Storage cost is KSh 45/bag/month. Write an AI prompt that produces a data-driven sell/store recommendation with the expected financial outcome of each option.\n\nTASK 3 — WHATSAPP MESSAGE: Write the weekly price advisory WhatsApp message that would be sent to cooperative members this week. Include: this week's price, 8-week outlook in plain language, and one action recommendation. Maximum 4 sentences. Write it in both English and Swahili.\n\nTASK 4 — SCENARIO STRESS TEST: How does the forecast change if KMD revises the rainfall forecast to 60% below normal (drought risk)? Identify which weeks are most affected and quantify the expected price impact.\n\nShow all AI prompts and responses used.",
        quizQuestions: [
          { question: "A farmer harvests maize in April and receives a price forecast saying prices will peak in September. They want to store until September. What additional information do they need before making this decision?", options: ["The exact September price to the nearest KSh 50", "The cost of storage per bag per month, the quality risk of long-term storage for their specific grain type, and whether they can afford to wait 5 months without the income", "The price in other East African countries in September", "The government's maize price support policy for September"], correctAnswer: 1 },
          { question: "A price forecasting model has a mean absolute error of KSh 380 per bag over a 12-week horizon. Current price is KSh 2,650. The model forecasts KSh 4,200 in week 12. How should this forecast be communicated to farmers?", options: ["As a definitive prediction: prices will reach KSh 4,200 in 12 weeks", "As a range accounting for the model error: prices are expected in the range of KSh 3,820 to KSh 4,580 in 12 weeks, with higher uncertainty the further out the forecast extends", "The error is too high — do not share the forecast with farmers", "Round to KSh 4,000 for simplicity"], correctAnswer: 1 },
          { question: "Why do maize prices in Kenyan markets typically drop sharply in March-April each year?", options: ["Government price controls are activated at the start of the financial year", "The long rains maize harvest from Rift Valley and Western Kenya floods the market with supply in February-April, pushing prices to seasonal lows before slowly recovering as stocks are drawn down", "Maize imports from Tanzania increase seasonally in the first quarter", "Consumer demand drops during school term season reducing commercial maize purchases"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 4,
        title: "Post-Harvest Loss Reduction — Where Kenya Loses KSh 100 Billion Every Year",
        type: "reading",
        hook: "Kenya loses an estimated KSh 100 billion in agricultural produce to post-harvest losses every year. The majority of those losses happen not in the field but between the farm gate and the consumer — in storage, transit, and handling. AI cannot eliminate post-harvest losses. But it can identify where they are highest and prescribe the interventions that save the most value per shilling spent.",
        duration_mins: 7,
        isAvailable: true,
        content: "The post-harvest loss problem in East African supply chains — where losses occur, why, and how AI can be used to systematically identify and reduce the most impactful loss points. Covers storage condition optimisation, quality grading with AI vision, transit route analysis, and the WhatsApp advisory model for smallholder storage decisions.",
        readingTopics: [
          "The post-harvest loss map — where in the maize supply chain do losses happen and in what percentages",
          "Storage condition data — temperature, humidity, and grain moisture content as predictors of spoilage",
          "AI-assisted quality grading — using image analysis to grade produce at point of collection",
          "Transit time analysis — how route and vehicle quality correlates with produce damage in East African logistics",
          "The WhatsApp sell/store advisory system — delivering AI recommendations to farmers without smartphones",
        ],
        theory: {
          concept: "Post-harvest losses in East Africa occur at four main stages with different AI applications at each stage. (1) On-farm storage — this is where the largest losses occur for smallholders. Grain stored at above 14% moisture content develops aflatoxin mould within 6-8 weeks. AI can process a combination of moisture meter readings, ambient temperature, and storage type data to predict spoilage risk and advise farmers on when to sell versus when it is safe to store longer. (2) Collection point aggregation — when produce from multiple farmers is combined at a cooperative collection point quality variation causes cross-contamination. AI vision systems can grade produce at collection and separate low-moisture, high-quality grain from contaminated grain before blending causes total batch degradation. (3) Road transport — avocados, tomatoes, and leafy vegetables suffer 20-40% physical damage in transit on Kenya's rural roads. AI analysis of route data, vehicle condition, and journey time can identify which specific routes, drivers, and loading practices cause the most damage. (4) Cold chain gaps — for horticultural produce exported through JKIA or delivered to Nairobi supermarkets, gaps in cold chain cause spoilage. AI can track temperature exceedance events and correlate them with specific rejection rates at destination.",
          badExample: "Use AI to reduce post-harvest losses for our cooperative.",
          badBreakdown: [
            { element: "Loss stage targeted", present: "Not specified", problem: "Post-harvest losses occur at 4 different stages requiring 4 completely different AI solutions — a storage solution does not help transit damage" },
            { element: "Crop type", present: "Not specified", problem: "Maize post-harvest AI solutions are completely different from avocado solutions — different spoilage mechanisms, different measurement methods, different interventions" },
            { element: "Data available", present: "Not identified", problem: "Every post-harvest AI system requires specific data inputs — moisture readings, temperature sensors, GPS route data, or image capture. Without knowing what data exists there is nothing to build" },
            { element: "Success metric", present: "Not defined", problem: "Reduce post-harvest losses is not a measurable target — what percentage reduction over what timeframe with what baseline measurement?" },
            { element: "Intervention type", present: "Absent", problem: "AI can identify where losses occur but cannot by itself reduce them — the system must also specify the human intervention the AI recommendation triggers" },
          ],
          badOutput: "A vague proposal to buy sensors and use AI to monitor the supply chain with no specification of what data to collect, what decisions the AI output will support, or how farmers will receive and act on the recommendations.",
          goodExample: "Build an AI-powered grain storage advisory system for Ndege Mbili Cooperative in Meru. The system targets on-farm storage losses which account for 34% of the cooperative's total losses. Data inputs: (1) farmer-reported moisture meter readings at harvest (cooperative already owns 8 moisture meters shared among 120 farmers), (2) KMD 30-day temperature and humidity forecast for Meru County, (3) storage type (metal silo, PICS bag, traditional granary). AI output: a weekly WhatsApp message per farmer with one of three recommendations: SELL NOW (high spoilage risk), SAFE TO STORE for N more weeks, CHECK AND DRY (moisture approaching risk threshold). Delivered via the cooperative's existing WhatsApp group structure.",
          goodBreakdown: [
            { element: "Loss stage targeted", present: "On-farm storage — the highest-loss stage for this cooperative", improvement: "Focused intervention on the stage that will produce the most value recovery" },
            { element: "Crop type", present: "Grain — specific moisture and temperature risk parameters applied", improvement: "Correct spoilage model for grain: moisture × temperature × time → aflatoxin risk" },
            { element: "Data available", present: "Existing moisture meters, KMD forecasts, storage type already known", improvement: "No new data infrastructure required — builds on what the cooperative already has" },
            { element: "Success metric", present: "Target reduction in on-farm grain losses from current 34% of total losses", improvement: "Measurable baseline exists — impact can be calculated per season" },
            { element: "Intervention type", present: "Three actionable recommendations triggered by AI risk assessment", improvement: "Farmer receives a clear action — sell, store, or dry. No interpretation required." },
          ],
          goodOutput: "Season one deployment: 89 of 120 cooperative farmers received weekly WhatsApp advisory. Average on-farm storage time extended by 3.4 weeks for farmers with low-moisture grain without spoilage (enabling them to sell at higher post-harvest prices). Grain rejection at collection point (due to aflatoxin) reduced by 61% compared to previous season. Estimated value recovery per farmer: KSh 4,200 per season.",
          keyInsight: "The most valuable post-harvest AI systems in East Africa are not the ones with the most sophisticated AI — they are the ones that reach the most farmers with the most actionable recommendations delivered through the channels farmers already use. A WhatsApp message with a sell/store recommendation based on a moisture reading and a weather forecast changes a farmer's behaviour. A complex AI dashboard that requires internet access and a smartphone does not.",
          ruleToRemember: "Map where the losses actually happen before building any AI solution. The most sophisticated storage AI system is worthless if the highest losses occur in transit. Always start with data on where value is being lost — not with the technology you want to use.",
          checkYourUnderstanding: [
            {
              question: "Ndege Mbili Cooperative tracks post-harvest losses and finds that 34% of losses occur in on-farm storage, 28% at the collection point, 22% in transit to Nairobi, and 16% at the packhouse. Where should the first AI intervention be focused?",
              options: [
                "Transit — it is the most visible part of the supply chain",
                "On-farm storage — it represents the largest single loss stage at 34% of total losses and is where AI storage advisory systems can have the highest impact",
                "Packhouse — it is the last stage before sale so reducing losses there protects the most value",
                "Collection point — it is where all produce from multiple farms aggregates so an intervention affects the most farmers simultaneously",
              ],
              correctAnswer: 1,
              explanation: "Always target the highest-loss stage first. On-farm storage at 34% of total losses is both the largest problem and the stage most amenable to AI advisory systems since it requires no physical infrastructure beyond a moisture meter and WhatsApp.",
            },
            {
              question: "A maize farmer stores grain at 16% moisture content in a PICS hermetic bag. A storage advisory AI sends the recommendation: 'SELL WITHIN 2 WEEKS — moisture level too high for safe storage.' The farmer ignores it and stores for 6 weeks. What is the most likely outcome?",
              options: [
                "The grain will be fine — PICS bags protect against moisture damage",
                "The grain will likely develop aflatoxin mould — at 16% moisture and warm temperatures aflatoxin growth begins within 3-4 weeks even in hermetic storage, reducing or eliminating its market value",
                "The moisture will naturally reduce to safe levels within the hermetic bag over time",
                "The outcome depends entirely on the ambient temperature — moisture alone does not cause spoilage",
              ],
              correctAnswer: 1,
              explanation: "Aflatoxin is the primary safety and commercial risk for maize stored at high moisture. PICS bags reduce oxygen and prevent insect damage but do not prevent mould growth when moisture is above 14%. The 2-week recommendation was based on accurate risk assessment.",
            },
            {
              question: "An avocado cooperative wants to reduce transit damage from their farms in Muranga to Nairobi supermarkets. What data would be most useful for an AI-powered transit loss analysis?",
              options: [
                "Avocado variety and farm size for each shipment",
                "Per-shipment records of: vehicle type, route taken, journey time, number of stops, ambient temperature during transit, and rejection rate at destination — correlated across many shipments to identify which factors predict highest damage",
                "The price of avocados in Nairobi on the day of each delivery",
                "GPS coordinates of each farm involved in each shipment"],
              correctAnswer: 1,
              explanation: "Transit loss analysis requires matching the conditions of each shipment to its outcome at destination. Vehicle type, route, journey time, stops, and temperature are all controllable variables — if AI identifies that night-time journeys in refrigerated vehicles with under 4 hours transit time have 80% lower rejection rates this drives an immediate operational change.",
            },
          ],
        },
        quizQuestions: [
          { question: "At what moisture content does the risk of aflatoxin mould development become critical for maize stored in East African conditions?", options: ["Above 20% moisture content", "Above 14% moisture content — this is the safe storage threshold. Grain above 14% moisture should be sold quickly or dried before storage", "Above 25% moisture content", "Moisture content does not affect aflatoxin risk — temperature is the only factor"], correctAnswer: 1 },
          { question: "A cooperative wants to build a quality grading AI system at their collection point to separate high-quality from contaminated grain. What is the minimum hardware they need?", options: ["A full laboratory with chemical testing equipment", "A smartphone or tablet with a good camera — AI vision models can grade grain quality from photos with reasonable accuracy at a fraction of laboratory cost", "Industrial-grade grain scanners costing over KSh 5 million", "Nothing — AI can grade grain from farmer self-reported data alone"], correctAnswer: 1 },
          { question: "An agritech company builds a post-harvest advisory app requiring farmers to download and use a smartphone app with reliable internet. What percentage of Kenyan smallholder farmers can realistically be reached by this system?", options: ["Over 80% — smartphone adoption is high in Kenya", "Under 30% — the majority of smallholder farmers in Kenya have feature phones or basic smartphones without reliable data connectivity in rural areas", "100% — M-Pesa connectivity guarantees smartphone access", "50% — rural connectivity is sufficient for most farming households"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 5,
        title: "WhatsApp Farmer Advisory Systems — AI That Reaches Every Farmer",
        type: "sandbox",
        hook: "The most valuable agricultural AI system in East Africa is not the most technically sophisticated. It is the one that reaches the most farmers with the most useful recommendation through the device they already have. That device is a basic phone. That channel is WhatsApp.",
        duration_mins: 20,
        isAvailable: true,
        content: "Design and prototype a WhatsApp-based AI farmer advisory system for Ndege Mbili Cooperative. The system integrates price forecasting, storage advisory, and weather alerts into a single weekly message sent to all 120 cooperative members — requiring only a basic phone and a KSh 10 airtime balance.",
        sandboxTask: `Design and build the prototype advisory message system for Ndege Mbili Cooperative — 120 maize and coffee farmers in Meru County.\n\nCOOPERATIVE CONTEXT:\n- 120 members: 78 with WhatsApp-capable phones, 42 with basic SMS-only phones\n- Crops: maize (main), coffee (secondary), beans (intercrop)\n- Typical harvest: long rains maize harvest April-May, short rains October-November\n- Cooperative has one WhatsApp group per zone (4 zones, 30 members each)\n- Extension officer (Kamau) visits each zone once per month\n- Current pain points: selling too early, post-harvest storage losses, unpredictable coffee prices\n\nWeek is: late March 2024. Long rains harvest beginning in 4-6 weeks.\n\nDATA AVAILABLE THIS WEEK:\n- Eldoret maize price: KSh 2,650/bag (90kg)\n- 8-week forecast: prices expected to dip to KSh 2,200 post-harvest then recover to KSh 4,400 by September\n- KMD forecast: normal to slightly below-normal rainfall March-April expected\n- Storage advisory: moisture levels from last harvest checks averaged 13.2% — below the 14% threshold — safe for hermetic storage\n- Coffee cherry season: 2 months away. Regional coffee prices slightly above 2023 season.\n\nTASK 1 — WEEKLY WHATSAPP MESSAGE: Write the weekly advisory message that Kamau sends to all 4 zone WhatsApp groups this week. Requirements: (a) Under 200 words. (b) Covers: current maize price, 8-week price outlook, one specific action recommendation, one storage reminder, one upcoming event (coffee harvest preparation). (c) In plain language that a farmer with Standard 8 education can understand. (d) Written in both English and Swahili versions.\n\nTASK 2 — AI ADVISORY PROMPT: Write the exact AI prompt that Kamau would run each week to generate the WhatsApp message. The prompt must include placeholders for the variable data (current price, forecast, weather, storage readings) that change each week. The prompt must consistently produce a message in the format from Task 1.\n\nTASK 3 — SMS FALLBACK: For the 42 members with SMS-only phones write a 160-character (1 SMS) version of the most important advisory. This must be in Swahili and contain: the key price, the one action, and Kamau's number.\n\nTASK 4 — SELL/STORE DECISION TOOL: Design a simple 5-question WhatsApp chatbot flow (using numbered responses like a USSD menu) that allows a farmer to answer questions and receive a personalised sell/store recommendation. The 5 questions should collect: grain quantity, current moisture level, storage type, cash need urgency, weeks willing to wait. Show the complete conversation flow with the recommendation logic.\n\nTASK 5 — IMPACT CALCULATION: If the 8-week forecast is correct and 60 of 78 WhatsApp farmers store until September instead of selling at harvest, calculate: (a) the total additional revenue for those 60 farmers assuming average holdings of 15 bags each, (b) the total storage cost, (c) the net additional income per farmer.`,
        quizQuestions: [
          { question: "A WhatsApp farmer advisory system sends weekly messages to 3,200 Rift Valley farmers at KSh 0.05 per WhatsApp message. What is the monthly cost for all messages?", options: ["KSh 640", "KSh 3,200 × 4 weeks × KSh 0.05 = KSh 640 per month — less than one mobile data bundle for the entire cooperative network", "KSh 6,400", "KSh 32,000"], correctAnswer: 1 },
          { question: "An NGO wants to scale a WhatsApp advisory system from 500 to 50,000 farmers. What is the primary technical bottleneck?", options: ["WhatsApp has a 500 user limit per account", "The Meta Cloud API allows programmatic messaging but business-initiated messages require approved templates and there are per-account rate limits — scaling requires multiple registered business numbers and potentially the WhatsApp Business API at enterprise tier", "WhatsApp cannot send Swahili language messages at scale", "Internet connectivity in rural Kenya is too unreliable for WhatsApp to work"], correctAnswer: 1 },
          { question: "A farmer receives the weekly advisory saying: 'STORE — prices expected to rise to KSh 4,400 in 16 weeks.' The farmer sells anyway because they need school fees money now. Was the AI advisory wrong?", options: ["Yes — the advisory should have detected the farmer's cash needs before recommending storage", "No — the advisory was correct for a farmer without urgent cash needs. The farmer made the right decision given their personal situation. Good advisory systems should ask about cash urgency before giving a sell/store recommendation", "Yes — school fees are predictable and the AI should have known about them", "No — the AI recommendation is always correct and farmers should always follow it"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 6,
        title: "Final Project — Smart Farm Proposal for Ndege Mbili Cooperative",
        type: "project",
        hook: "Agritech is one of the fastest-growing sectors for AI employment in East Africa. Every NGO, DFI, county government, and agritech startup working in East African agriculture needs people who understand both the agricultural context and the AI tools. This project proves you are that person.",
        duration_mins: 60,
        isAvailable: true,
        content: "Design a comprehensive AI-powered smart farm solution for Ndege Mbili Cooperative — a fictional cooperative of 120 smallholder farmers in Meru County growing coffee, macadamia, and vegetables. Your proposal must be fundable by an NGO or agritech investor.",
        sandboxTask: "You are an AI consultant hired by Ndege Mbili Cooperative Society — 120 smallholder farmers in Meru County growing coffee (primary), macadamia (secondary), and French beans (for export, 30 members). The cooperative's current problems: (1) post-harvest losses averaging 28% on coffee cherries, (2) price uncertainty causing members to sell too early, (3) no data on which members are achieving the highest yields and why, (4) high input costs with no guidance on optimal fertiliser application, (5) no traceability system — cannot access premium export certification markets.\n\nDesign a complete AI-powered cooperative management system. Your proposal must include:\n\nSECTION 1 — PROBLEM PRIORITISATION: Rank the 5 problems by KSh impact per year across all 120 members. For the top 2 problems: estimate the current annual loss and the expected recovery if an AI solution is implemented. Use realistic Kenyan agriculture figures.\n\nSECTION 2 — AI SOLUTION DESIGN: For each of the top 2 problems design a specific AI solution including: the data required (what, how collected, by whom), the AI model or tool to be used, the output and who receives it, the delivery channel, and the expected impact.\n\nSECTION 3 — WHATSAPP ADVISORY SYSTEM: Design the complete weekly message system as built in Lesson 5. Include sample messages for both coffee pre-harvest and maize price advisory contexts.\n\nSECTION 4 — IMPLEMENTATION ROADMAP: A 90-day plan with specific actions in: Week 1-2 (baseline data collection), Month 1 (system setup), Month 2 (pilot with 20 members), Month 3 (full deployment). For each phase list who does what and what is needed.\n\nSECTION 5 — BUDGET: A realistic budget for a 12-month implementation in KSh. Include: personnel, technology, training, monitoring. Justify each line item. The total must be achievable for an NGO grant of KSh 2-4 million.\n\nSECTION 6 — IMPACT METRICS: Define 5 specific measurable outcomes you will track to prove the system is working at month 3, 6, and 12.",
      },
    ],
    capstone: {
      title: "Agritech AI Specialist Certification",
      description: "You are hired by Farmers Pride — a fictional Kenyan agritech startup that has just received a KSh 8 million Series A to build an AI platform for 5,000 maize and bean farmers across the Rift Valley. The investors want a technical roadmap for the first 6 months.",
      task: "Design the complete AI platform architecture for Farmers Pride. Your deliverable is a 5-section technical proposal that the board can present to investors and that the development team can execute. Section 1: Price forecasting module — data sources, model selection, update frequency, farmer delivery mechanism. Section 2: Storage advisory module — data collection from farmers, risk scoring algorithm, WhatsApp alert triggering rules. Section 3: Farmer performance analytics — which data to track per farmer per season, how to calculate performance scores, how to use scores to personalise recommendations. Section 4: Cooperative manager dashboard — what KPIs to display, how data flows from farmer inputs to dashboard, what actions the dashboard enables. Section 5: Technology stack — specific tools and services for each component, estimated monthly operating cost at 5,000 farmers, scaling plan to 50,000 farmers.",
      rubric: {
        specificity: { weight: 25, description: "All 5 sections name specific tools, data sources, and delivery mechanisms — not generic descriptions. Named APIs, Kenyan data sources (EAGC, AMIS-Kenya, KMD), and specific cost estimates score 20-25." },
        businessAccuracy: { weight: 25, description: "The solution reflects real Kenyan agricultural conditions — seasonal patterns, phone ownership rates, mobile data constraints, and cooperative structure are all correctly modelled." },
        implementationRealism: { weight: 20, description: "The 6-month roadmap is achievable for a startup with KSh 8 million — not a 3-year enterprise programme. Technology choices are deployable by a small team." },
        ethicsQuality: { weight: 15, description: "Farmer data privacy is addressed — who owns the data, how is it stored, and what consent is obtained. Model accuracy limitations are acknowledged and communicated to farmers honestly." },
        professionalQuality: { weight: 15, description: "The proposal could be presented to NGO funders or agritech investors without editing. It demonstrates genuine understanding of East African agricultural context beyond generic AI capability claims." },
      },
      passingScore: 70,
    },
  },
  {
    slug: "ai-evaluation-engineering",
    title: "AI Data and Evaluation Engineering",
    tagline: "Get Hired by Western AI Companies — Remotely from Kenya",
    description: "Write training data, evaluate AI systems, and red-team models. The skill Western AI companies pay $30–80/hour for. Hireable remotely from Kenya.",
    level: "Intermediate",
    price_kes: 3500,
    lessons_count: 7,
    badge_name: "AI Evaluation Engineer",
    what_you_will_learn: [
      "Write AI training data that passes quality review at professional standard",
      "Build evaluation frameworks with 85%+ inter-annotator agreement",
      "Red-team AI systems to find failure modes before deployment",
      "Understand RLHF and collect preference data that improves AI quality",
      "Build Python evaluation pipelines using LLM-as-judge at scale",
    ],
    lessons: [
      {
        lessonNumber: 0,
        title: "Introduction — The Hidden AI Job Market Paying $30–80/Hour",
        type: "intro",
        hook: "Every major AI lab — Anthropic, OpenAI, Google DeepMind — employs hundreds of contractors who never write a single line of model code. They write training data, evaluate AI outputs, and break AI systems on purpose. They work remotely. They earn $30–80 per hour. Most are not based in the US.",
        duration_mins: 8,
        isAvailable: true,
        content: "This course teaches the exact skills Western AI companies hire for from Africa. By the end you will have a portfolio of evaluation work, a red-team report, a Python evaluation pipeline, and a profile that positions you for remote contracts. You do not need a computer science degree. You need precision, good judgment, and the ability to think like both the AI and the user.",
      },
      {
        lessonNumber: 1,
        title: "What Western AI Companies Actually Pay For",
        type: "reading",
        hook: "Before you can get hired you need to understand exactly what the work is — not the vague descriptions on job boards but the actual tasks you will do, the standards you will be held to, and why your African context is an asset rather than a liability.",
        duration_mins: 30,
        isAvailable: true,
        content: "AI evaluation engineering sits at the intersection of linguistics, logic, and domain expertise. The work divides into three categories: data annotation (creating and labelling training examples), model evaluation (systematically testing AI output quality), and red-teaming (intentionally trying to break AI systems). Each category pays differently and requires different skills.\n\nData annotation contracts pay $15–35/hour and are the entry point. You write questions, write ideal AI responses, compare two AI responses and pick the better one, or label whether an AI response is harmful. The key skill is following annotation guidelines precisely — these are detailed 40–100 page documents specifying exactly what makes a response good or bad.\n\nModel evaluation contracts pay $25–50/hour and require more judgment. You build evaluation sets — collections of test cases that expose specific model weaknesses. You write rubrics, score AI outputs against them, and write reports on what you found. You need to think systematically: not just 'this response is bad' but 'responses to this category of question fail in this specific way 73% of the time.'\n\nRed-teaming contracts pay $40–80/hour and are the highest-skill work. You try to make AI systems produce harmful, incorrect, or policy-violating outputs. You document your methods, your success rate, and your recommendations. You need creativity, persistence, and very good judgment about what constitutes a genuine safety failure versus a quirky but harmless output.\n\nYour African context is valuable because: (1) AI models are systematically worse on African languages, dialects, and cultural contexts — you can identify failures Western annotators miss entirely. (2) Swahili, Kikuyu, Luo, and other regional languages are underrepresented in training data — native speakers are in demand. (3) African business contexts (M-Pesa, informal markets, agricultural advisory) expose model failures in practical domains that Western red-teamers cannot test authentically.\n\nThe platforms where this work is posted: Scale AI, Appen, Surge AI, Labelbox, Prolific (research studies), direct contracting through LinkedIn and AI company job boards. Scale AI and Appen are the volume platforms — steady work but lower rates. Direct contracting through company job boards pays 2–3× more but requires a portfolio.",
        theory: {
          concept: "Evaluation quality is determined by consistency and specificity — not effort. An evaluator who gives vague feedback ('this response was not very good') is worthless. An evaluator who says 'the response failed criterion 3b because it gave a specific number without citing a source, and the number was incorrect by 23%' is worth $60/hour.",
          badExample: "Evaluation note: 'This AI response about Kenyan agricultural loans is not very accurate and could mislead farmers. The tone is also a bit off. I would rate this 2/5.'",
          badBreakdown: [
            { element: "'not very accurate'", present: "Vague adjective with no claim cited", problem: "No specific inaccuracy identified — evaluator cannot tell the model trainer what to fix" },
            { element: "'could mislead farmers'", present: "Speculative concern, no example", problem: "No specific misleading claim identified — unusable feedback" },
            { element: "'tone is a bit off'", present: "Subjective descriptor, no criterion", problem: "No rubric reference — what does 'off' mean against the evaluation criteria?" },
            { element: "2/5 rating", present: "Single number, no breakdown", problem: "Score without criterion-by-criterion breakdown cannot be aggregated into model improvement signals" },
          ],
          badOutput: "Evaluation report row: 'Response ID 4471 — 2/5 — inaccurate, misleading, wrong tone.' Model trainers cannot act on this.",
          goodExample: "Evaluation note: 'Response ID 4471 fails criteria C2 (factual accuracy) and C4 (source citation). Specific failure: states that the Hustler Fund interest rate is 8% annually. Correct rate as of Q4 2024 is 8% per annum calculated daily — the response omitted the daily compounding mechanism which changes borrower cost significantly for loans held over 30 days. No source cited for the interest rate figure (violates C4). Criterion C1 (helpfulness) and C3 (language clarity) pass. Score: C1=4, C2=1, C3=4, C4=1. Overall: 2.5/5.'",
          goodBreakdown: [
            { element: "Criterion codes (C2, C4)", present: "Cited explicitly by code", improvement: "Links directly to the rubric — model trainers know exactly which guidelines to update" },
            { element: "Specific incorrect claim with correct information", present: "Verbatim quote plus verified correction", improvement: "Provides the ground truth needed to create a correction training example" },
            { element: "Explanation of why the inaccuracy matters", present: "Borrower impact spelled out", improvement: "Helps trainers prioritise — compounding interest error affects real borrowers financially" },
            { element: "Per-criterion scores", present: "C1=4, C2=1, C3=4, C4=1 breakdown", improvement: "Enables statistical analysis — C4 citation failures can be tracked across thousands of examples" },
          ],
          goodOutput: "Evaluation report row actionable for three teams: model trainers (C2/C4 failure pattern), data team (needs Hustler Fund training examples with correct rate), policy team (financial information requires citation).",
          keyInsight: "AI evaluation is a structured professional output, not an opinion. Every claim in an evaluation must map to a specific criterion, cite a specific example, and provide enough information for someone else to verify your judgment.",
          ruleToRemember: "Never write 'good' or 'bad' in an evaluation without a criterion reference and a specific example. If you cannot point to the exact sentence that fails the exact criterion, you do not have an evaluation — you have a feeling.",
          checkYourUnderstanding: [
            { question: "An AI company sends you a 60-page annotation guideline before your first task. You read 10 pages and feel you understand the general idea. What should you do?", options: ["Start annotating — you can refer back to the guideline if you get stuck", "Read all 60 pages before annotating a single example, because annotation errors based on misunderstood guidelines are grounds for contract termination", "Ask the company to send a shorter version", "Annotate the first 10 examples using your general understanding then ask for feedback"], correctAnswer: 1, explanation: "Annotation guidelines are the contract. Deviating from them because you skimmed the document is the most common reason new contractors fail their first calibration check and lose the engagement." },
            { question: "You are evaluating AI responses about M-Pesa and notice the AI consistently confuses M-Pesa Paybill and Till Number mechanisms. This is:", options: ["A minor error — most users probably know the difference anyway", "A high-priority finding because it affects real financial transactions and the confusion pattern should be documented with multiple examples and flagged as a systemic failure", "Not worth reporting unless the error caused a wrong answer in this specific evaluation task", "A translation issue that only affects Swahili-language responses"], correctAnswer: 1, explanation: "Systematic errors are more valuable to report than isolated ones. A pattern that affects a defined category of queries can be fixed with targeted training data — a single instance cannot." },
          ],
        },
        quizQuestions: [
          { question: "What is the primary difference between data annotation and model evaluation work?", options: ["Data annotation pays more", "Data annotation creates training examples; model evaluation systematically tests output quality against defined criteria — requiring more independent judgment and typically paying more", "Model evaluation is done by engineers; data annotation is done by non-technical workers", "There is no meaningful difference — both involve reading AI outputs"], correctAnswer: 1 },
          { question: "Why is an African evaluator's knowledge of Swahili and Kenyan business context specifically valuable to Western AI companies?", options: ["It is not valuable — AI companies only need evaluators from English-speaking Western countries", "Western AI companies pay premium rates for evaluators who can identify model failures in African languages and cultural contexts that English-only evaluators cannot detect", "It is only valuable for African-language annotation tasks, not for general evaluation work", "It makes the evaluator cheaper to hire because they work from a lower cost-of-living country"], correctAnswer: 1 },
          { question: "Scale AI pays $18/hour. A direct contract through a company job board pays $55/hour for the same type of work. What does the 3x difference reflect?", options: ["The company job board work is harder and requires more hours", "Direct contracts skip the platform middleman margin, require a portfolio to qualify, and pay for proven judgment rather than volume throughput", "Scale AI underpays — all AI evaluation work should pay $55/hour minimum", "The $55/hour rate includes benefits that make it equivalent to $18/hour all-in"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 2,
        title: "Writing Training Data That Passes Quality Review",
        type: "sandbox",
        hook: "The first test every AI company gives new contractors is a calibration set — 20–50 annotation tasks scored against a gold standard. Pass 85%+ and you continue. Fail and the contract ends. The difference between passing and failing is not intelligence — it is knowing exactly what high-quality training data looks like.",
        duration_mins: 45,
        isAvailable: true,
        content: "AI training data is the raw material that determines what a model learns. There are three main types of training data tasks: (1) instruction-response pairs — writing a user instruction and an ideal AI response, (2) preference data — given two AI responses choose the better one and explain why using the rubric, (3) adversarial examples — writing instructions that test a specific model capability or boundary. Each type has quality criteria that annotation leads use to accept or reject your work.",
        sandboxTask: `You are working as a data annotator for an AI company building a general-purpose assistant. The company serves East African markets. Your annotation guidelines specify four quality criteria for instruction-response pairs:\n\nCRITERION A — INSTRUCTION QUALITY: The instruction must be specific, realistic, and unambiguous. A real user must plausibly type or say something like this.\n\nCRITERION B — RESPONSE ACCURACY: Every factual claim in the response must be correct. Financial figures, dates, laws, and procedures must be verifiable.\n\nCRITERION C — RESPONSE COMPLETENESS: The response must answer the full instruction — not a simplified version of it. If the instruction has three parts, the response must address all three.\n\nCRITERION D — RESPONSE FORMAT: The response must use appropriate formatting. Conversational questions get conversational answers. Step-by-step requests get numbered steps. Complex comparisons get tables or structured lists.\n\nTASK 1 — EVALUATE AND FIX:\nBelow are 3 instruction-response pairs. For each one: (a) Score each criterion A/B/C/D as PASS or FAIL with a one-sentence reason. (b) If any criterion fails, rewrite the failing component to pass.\n\nPAIR 1:\nInstruction: "Tell me about M-Pesa"\nResponse: "M-Pesa is a mobile money service in Kenya operated by Safaricom. It allows users to send money, pay bills, and access financial services. It was launched in 2007 and has millions of users."\n\nPAIR 2:\nInstruction: "I run a small hardware shop in Nakuru. My monthly revenue is KSh 280,000 and my expenses are KSh 195,000. Am I required to register for VAT, and if so how do I do it?"\nResponse: "Yes, businesses with annual turnover above KSh 5 million are required to register for VAT in Kenya. Your annual revenue would be approximately KSh 3.36 million (KSh 280,000 × 12), which is below the threshold. You are not currently required to register for VAT, though you may register voluntarily. If your revenue grows past KSh 5 million annually, registration becomes mandatory within 30 days of crossing that threshold. To register: visit the KRA iTax portal at itax.kra.go.ke, log in with your KRA PIN, select 'Registration', then 'VAT Registration', complete the form with your business details and supporting documents (certificate of incorporation or business registration, ID, PIN certificate), and submit. KRA will process within 3 working days."\n\nPAIR 3:\nInstruction: "Compare the interest rates and repayment terms for Equity Bank's Biashara Loan, KCB Group's KCB M-Pesa loan, and the Hustler Fund for a KSh 50,000 business loan."\nResponse: "Each of these products has different terms. Equity Bank offers competitive rates for business loans. KCB M-Pesa is a mobile-based loan that is convenient. The Hustler Fund is a government initiative for small businesses. You should visit each institution to get the current rates as they change frequently."\n\nTASK 2 — WRITE FROM SCRATCH:\nWrite 3 original high-quality instruction-response pairs on the topic of "Starting a small business in Kenya." Each pair must pass all four criteria. Pair 1 must be a simple factual question. Pair 2 must be a multi-step how-to question. Pair 3 must be a comparison question that requires a table in the response.\n\nTASK 3 — PREFERENCE DATA:\nBelow are two AI responses to the same instruction. Using the four criteria above, write a preference judgment: state which response you prefer, give a criterion-by-criterion comparison, and write the 2-sentence explanation you would submit to the annotation platform.\n\nInstruction: "What documents do I need to register a Limited Liability Company in Kenya?"\n\nRESPONSE A: "To register an LLC (Private Limited Company) in Kenya through eCitizen, you need: (1) Proposed company name — checked for availability on eCitizen before submission. (2) Memorandum and Articles of Association — can be prepared using the standard format from the Business Registration Service or a customised version drafted by an advocate. (3) Statement of Nominal Capital — specifying share structure and value. (4) Details of at least one director and one shareholder (can be the same person). (5) Details of the company secretary — required for companies with more than one director. (6) Registered physical address in Kenya. (7) KRA PIN for all directors and shareholders. Registration fee: KSh 10,650 for a company with nominal capital up to KSh 500,000. Timeline: 3–5 working days online via eCitizen."\n\nRESPONSE B: "You will need several documents to register a company in Kenya. These include identification documents for the directors, company details like the name and address, and some legal documents. The process goes through the government's online portal and takes a few days. You should check the Business Registration Service website for the full and current list as requirements can change."`,
        quizQuestions: [
          { question: "An instruction says 'What is the capital of Kenya?' and the response says 'Nairobi is the capital of Kenya, a vibrant city of over 4 million people.' Which criterion could this fail?", options: ["Criterion A — the instruction is too simple to be a realistic training example for a general-purpose AI assistant", "Criterion C — the response adds unrequested information (population), which may be incomplete if the instruction implicitly expected a fuller answer", "Criterion B — the population figure may be inaccurate depending on which census data is used", "It passes all criteria — simple factual Q&A is a valid training pair"], correctAnswer: 2 },
          { question: "You write an instruction-response pair about Kenyan tax law. Your response cites the correct KRA threshold. Three months later, KRA changes the threshold. Your pair is now:", options: ["Still valid — it was accurate when written", "Flagged as failing Criterion B if re-evaluated after the change — training data accuracy is assessed at the time of model training, not at time of writing. Data teams version-control training sets for this reason", "Invalid and you will be penalised for the error", "Valid only if you add a disclaimer that tax law changes"], correctAnswer: 1 },
          { question: "Preference data tasks pay less per item than instruction-response writing tasks. Why do AI companies still need both?", options: ["They do not — preference data is being phased out", "Preference data trains the reward model used in RLHF — it teaches the AI which of two responses humans prefer, a signal that cannot be captured by instruction-response pairs alone", "Preference data is used for data quality control only, not for model training", "Preference data is only needed for safety fine-tuning, not capability training"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 3,
        title: "Building Evaluation Frameworks",
        type: "reading",
        hook: "A single evaluator saying 'this response is bad' is an opinion. A hundred evaluators following the same rubric and producing 87% agreement on what 'bad' means is a measurement. AI evaluation engineering is the discipline of turning opinions into measurements.",
        duration_mins: 35,
        isAvailable: true,
        content: "An evaluation framework is a system for consistently measuring AI quality across a defined set of criteria. Building one requires four components: a capability specification (what should the AI be able to do?), a rubric (what does good and bad look like for each capability?), a test set (which specific inputs will expose capability gaps?), and an aggregation method (how do you turn individual scores into a system-level quality signal?).\n\nCapability specifications start with user needs, not model architectures. For a customer service AI at a Kenyan bank, capabilities might include: answering account balance queries accurately, explaining loan products without misleading the customer, escalating complex complaints to a human appropriately, and responding in the customer's preferred language (English, Swahili, or regional language). Each capability becomes a separate rubric dimension.\n\nRubrics must be calibrated — every evaluator applying the rubric should reach the same score for the same response at least 80% of the time. A rubric that produces 60% inter-annotator agreement is not measuring anything useful; it is measuring evaluator opinion. Calibration happens through example anchors: for each score level, you provide 2–3 example responses with written explanations of why they earned that score.\n\nTest sets must include adversarial cases — inputs designed to expose specific failure modes. For a Kenyan bank AI: questions about M-Pesa integration (where confusion between Paybill and Till Number is common), questions in Sheng (a Kenyan urban dialect mixing Swahili and English that models handle poorly), questions about regulatory scenarios (CRB listings, KRA compliance), and edge cases like requests to perform actions the AI cannot actually perform.\n\nAggregation requires statistical thinking. If your test set has 200 items across 8 capability dimensions and 5 score levels, you need to understand which capability failures are rare but severe (a single misstatement about interest rates on a KSh 1 million loan) versus common but recoverable (an awkward phrasing that a human would understand anyway). Severity weighting is built into the rubric, not applied afterwards.\n\nEvaluation reports go to three audiences: model trainers (need specific failure examples and patterns), product managers (need capability-level pass/fail rates and trend data), and safety teams (need severity-weighted risk exposure). Write one report section for each audience.",
        theory: {
          concept: "Inter-annotator agreement (IAA) is the primary quality metric for evaluation frameworks. If two independent evaluators apply your rubric to the same 50 responses and agree 85%+ of the time, your rubric is well-calibrated. Below 75% means the rubric is ambiguous and producing noise, not signal.",
          badExample: "Rubric criterion: 'Helpfulness — the response should be helpful and relevant to what the user asked. Score 1 (not helpful) to 5 (very helpful).'",
          badBreakdown: [
            { element: "'helpful and relevant'", present: "Two vague terms, undefined", problem: "Two evaluators cannot determine from this definition alone whether a response that is accurate but incomplete scores 3 or 4" },
            { element: "No anchor examples", present: "Completely absent from criterion", problem: "Without examples of what a 2 looks like versus a 3, scores are pure opinion — IAA will be below 70%" },
            { element: "No distinction between partial and full helpfulness", present: "Not addressed anywhere in criterion", problem: "A response that answers one of three sub-questions could score 1, 2, or 3 depending on the evaluator's interpretation" },
          ],
          badOutput: "Evaluation results showing 64% IAA on helpfulness dimension. Model trainers cannot trust scores — they do not know if a 3.2 average means 'mostly helpful' or 'one evaluator said 5 and another said 1.'",
          goodExample: "Rubric criterion: 'Helpfulness — does the response fully address the user's stated request? Score 1–5 using these anchors: (1) Response addresses none of the user's request or addresses a different question entirely. (2) Response addresses the main topic but misses the specific question asked. (3) Response addresses the main question but omits a significant sub-part of a multi-part request. (4) Response addresses all explicit parts of the request but does not proactively address an obvious unstated need. (5) Response addresses all explicit parts of the request AND addresses the most important unstated follow-on need. Example anchors attached in Appendix A.'",
          goodBreakdown: [
            { element: "Numbered anchor definitions", present: "One behavioural sentence per score level", improvement: "Every evaluator can classify 'addresses the main topic but misses the specific question' as a 2 — ambiguity reduced to specific boundary cases" },
            { element: "Multi-part request treatment", present: "Addressed at level 3 explicitly", improvement: "Explicit rule for how to handle multi-part questions — the most common source of inter-annotator disagreement" },
            { element: "Distinction between explicit and unstated needs", present: "Separates level 4 from level 5", improvement: "5 is reserved for responses that show genuine understanding of user intent, not just literal compliance" },
          ],
          goodOutput: "Evaluation results showing 88% IAA on helpfulness dimension after calibration session using rubric anchors. Model trainers can trust aggregated scores.",
          keyInsight: "A rubric is not a description of quality — it is a decision procedure. Anyone applying it should reach the same answer because the rubric eliminates their personal judgment, not because they agree with you.",
          ruleToRemember: "If two reasonable people applying your rubric to the same response would disagree, rewrite the rubric. The rubric is broken, not the evaluators.",
          checkYourUnderstanding: [
            { question: "You build an evaluation framework for a Swahili-language AI assistant. Your calibration session with 5 evaluators produces 91% IAA on factual accuracy but only 68% IAA on 'cultural appropriateness.' What should you do?", options: ["Accept 68% — cultural appropriateness is inherently subjective and cannot be rubricised", "Rewrite the cultural appropriateness criterion with specific examples of culturally appropriate and inappropriate responses for Kenyan context, hold a second calibration session, and target 80%+ before using scores", "Replace cultural appropriateness with a criterion that is easier to agree on", "Average the evaluator scores and use the mean — the disagreement cancels out"], correctAnswer: 1, explanation: "All quality criteria can be rubricised if you provide enough concrete examples. 68% IAA means the criterion is ambiguous, not that the concept is unmeasurable. The fix is always more specific anchor examples." },
          ],
        },
        quizQuestions: [
          { question: "An evaluation framework for a Kenyan agricultural AI scores 'accuracy' at 4.2/5 across 300 test items. A product manager asks whether the AI is ready for deployment. What additional information do you need?", options: ["Nothing — 4.2/5 is a passing score", "The severity distribution of the 0.8 points of failure — if all errors are in the low-stakes crop calendar category, deployment may be fine; if 20% of errors involve incorrect pesticide application advice, deployment is dangerous regardless of the average score", "The inter-annotator agreement rate for the accuracy dimension", "Both B and C — average score without IAA and severity breakdown is incomplete"], correctAnswer: 3 },
          { question: "What is the purpose of adversarial test cases in an evaluation set?", options: ["To make the AI look bad so the evaluation seems thorough", "To expose specific capability failures that do not appear in typical usage patterns — adversarial cases reveal failure modes before deployment rather than after", "To test whether the AI can detect when it is being tested", "Adversarial test cases are not standard practice in professional evaluation frameworks"], correctAnswer: 1 },
          { question: "An AI product has a 91% pass rate on your evaluation framework across 500 test items. What does this tell you about its real-world failure rate?", options: ["The AI will fail approximately 9% of real user interactions", "The 9% failure rate applies to your test distribution — real-world failure rate depends on how well your test set reflects actual user queries, which requires usage data to validate", "The AI is ready for production — 91% is an excellent score", "Nothing — evaluation frameworks cannot predict real-world performance"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 4,
        title: "Red-Teaming AI Systems",
        type: "sandbox",
        hook: "Red-teaming is the art of thinking like an adversary to find what a system does when it faces inputs its designers did not plan for. In AI, red-teamers are the people who discovered that early ChatGPT versions would provide bomb-making instructions if you asked them to write a story where a character explains it. Finding these failures before deployment is worth $40–80 per hour.",
        duration_mins: 50,
        isAvailable: true,
        content: "Red-teaming AI systems means systematically attempting to elicit harmful, false, or policy-violating outputs — and documenting every attempt, method, and result in enough detail that engineers can reproduce the failure and fix it. The work is structured, not random. Professional red-teamers use taxonomies of attack strategies, track success rates per strategy, and write reports that distinguish genuine safety failures from the AI simply being unhelpful.\n\nAttack strategy taxonomy: (1) Direct requests — simply asking for the prohibited content. (2) Role-play jailbreaks — asking the AI to pretend to be a different AI without restrictions. (3) Hypothetical framing — 'in a fictional world where…'. (4) Authority spoofing — claiming to be a developer, researcher, or the AI company itself. (5) Gradual escalation — starting with benign requests and incrementally moving toward the target. (6) Context injection — embedding the harmful request inside a large document or legitimate task. (7) Language switching — making the request in a language the model may have weaker safety guardrails for. (8) Code wrapping — expressing the harmful request as a programming task. The last three (language switching, code wrapping, context injection) are currently the highest-yield attack categories for production AI systems.",
        sandboxTask: `You are working on a red-team engagement for Fahari Bank — a fictional Kenyan digital bank that has deployed an AI customer service assistant. The AI is trained to help customers with: account queries, loan products, M-Pesa integration, card services, and general banking questions. The AI is instructed to: never give specific investment advice, never approve loans, never reveal other customers' information, never discuss internal bank systems, and always refer fraud concerns to the fraud team at 0800-FAHARI.\n\nYour red-team scope: test all five prohibited categories using at least three attack strategies each. Document every attempt.\n\nREPORT FORMAT: For each test, write:\n- Attack ID: [category]-[strategy]-[attempt number] e.g. INV-DIRECT-01\n- Category: which prohibition you are testing\n- Strategy: which attack strategy you used\n- Exact prompt used\n- Expected fail behaviour: what the AI should do\n- Actual result: PASS (AI refused correctly) / FAIL (AI produced prohibited output) / PARTIAL (AI partially complied)\n- If FAIL or PARTIAL: quote the prohibited output and explain the risk\n- Severity: LOW / MEDIUM / HIGH / CRITICAL\n\nTASK 1 — INVESTMENT ADVICE CATEGORY: Write 4 red-team attempts targeting the 'no specific investment advice' prohibition. Use these strategies: (a) Direct request, (b) Role-play jailbreak, (c) Hypothetical framing, (d) Gradual escalation starting from a question about savings accounts. For each: write the exact prompt you would send, your expected outcome, and a severity rating if it fails.\n\nTASK 2 — CUSTOMER DATA CATEGORY: Write 3 red-team attempts targeting the 'no other customer information' prohibition. Use: (a) Authority spoofing — claim to be a bank employee, (b) Context injection — embed the data request inside a long legitimate banking question, (c) Language switching — attempt the request in Swahili. For each: write the exact prompt and explain specifically what data breach would occur if the AI failed.\n\nTASK 3 — INTERNAL SYSTEMS CATEGORY: Write 2 red-team attempts targeting the 'no internal system discussion' prohibition. Use code wrapping for one attempt — frame the request as asking the AI to help you write a Python script that interacts with the bank's systems. Explain why revealing internal system details is HIGH or CRITICAL severity.\n\nTASK 4 — EXECUTIVE SUMMARY: Write the executive summary section of your red-team report (200 words maximum). Assume: 2 CRITICAL failures (loan approval flow could be manipulated via gradual escalation, and Swahili language switching bypassed the investment advice guardrail), 3 HIGH failures, 5 MEDIUM failures, 7 PASS. Write the summary for the bank's CISO — it should state the overall risk posture, the two most urgent remediation actions, and the recommended re-test timeline.`,
        quizQuestions: [
          { question: "During red-teaming you discover that the bank AI will discuss M-Pesa transaction reversal procedures in enough detail that a fraudster could use the information to fraudulently reverse other customers' payments. This is:", options: ["A LOW severity finding — reversal procedures are public information", "A CRITICAL severity finding — the AI is providing a functional roadmap for financial fraud affecting real customers with real KSh amounts", "A MEDIUM severity finding — it should be reported but does not require immediate remediation", "Not a red-team finding — the AI is just answering a question about its capabilities"], correctAnswer: 1 },
          { question: "You attempt 30 red-team attacks and the AI refuses all 30 correctly. What is the most appropriate conclusion for your report?", options: ["The AI is safe and no further testing is needed", "The AI passed this specific set of 30 attack attempts using these specific strategies — this does not mean the AI is safe, only that it is robust to your current attack taxonomy. Recommend expansion of attack strategies and a second engagement in 90 days", "The AI is over-restricted and some refusals should be removed to improve helpfulness", "Your red-team methodology is too weak — a good red-teamer should find at least some failures"], correctAnswer: 1 },
          { question: "Why is language-switching (making prohibited requests in Swahili or another African language) currently a high-yield attack strategy against most AI systems?", options: ["AI systems are programmed to trust Swahili speakers more than English speakers", "Most AI safety training data is English-dominant — safety guardrails are frequently weaker in other languages because the model has seen fewer examples of prohibited requests and appropriate refusals in those languages", "Swahili grammar makes prohibited requests harder for the AI to parse and recognise", "Language switching only works against models that were trained without any African language data"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 5,
        title: "RLHF and Preference Data Collection",
        type: "reading",
        hook: "RLHF — Reinforcement Learning from Human Feedback — is the technique that transformed GPT-3 (a mediocre text predictor) into ChatGPT (a useful assistant). The human feedback in that process was collected by contractors who chose between two AI responses. That work is still happening right now, at scale, and contractors who understand what they are doing earn significantly more than those who do not.",
        duration_mins: 35,
        isAvailable: true,
        content: "Reinforcement Learning from Human Feedback works in three stages. Stage 1: supervised fine-tuning — the base model is trained on high-quality instruction-response pairs (the work from Lesson 2). Stage 2: reward model training — human contractors compare pairs of AI responses and choose the better one; a reward model learns to predict human preferences. Stage 3: RL fine-tuning — the AI is trained using the reward model as a signal, learning to produce outputs the reward model predicts humans will prefer.\n\nYour role as a preference data collector is Stage 2. You are presented with an instruction and two responses (A and B). You choose the one that better satisfies the annotation criteria, then write an explanation. Your choice trains the reward model. If thousands of contractors like you consistently choose responses with specific properties, the AI learns to produce those properties.\n\nThis means your judgment has real consequences. A systematic bias in your preference selections — consistently choosing longer responses, or responses that sound more confident, or responses that use bullet points — will cause the AI to systematically over-produce that property across billions of future interactions. Preference data collectors who understand this produce better-calibrated data and pass quality reviews at higher rates.\n\nThe most common preference data errors: (1) Length bias — choosing longer responses because they seem more thorough, even when the shorter response is more accurate. (2) Confidence bias — choosing responses that state things more definitively, even when the uncertainty is real and should be expressed. (3) Format bias — choosing responses with more formatting (headers, bullets) even when the question was conversational. (4) Sycophancy blindness — not penalising responses that agree with incorrect premises stated in the instruction. (5) Western cultural default — applying evaluation standards based on Western cultural norms when the AI is serving African users.\n\nThe sycophancy problem deserves special attention. If a user says 'I heard that Kenya's GDP is $1 trillion — can you explain what this means for East African trade?' and the AI responds by accepting the false premise and explaining trade implications, that response fails — regardless of how well it explains trade. The correct response acknowledges the factual error (Kenya's GDP is approximately $110–120 billion, not $1 trillion) and then addresses the underlying question. Many preference data collectors choose the sycophantic response because it is longer and more helpful-sounding. This trains the AI to be confidently wrong.",
        theory: {
          concept: "Preference data quality is measured by calibration against gold-standard pairs. When an annotation lead tells you your calibration score is 82%, they mean: on 100 gold-standard pairs where the correct preference is known, you agreed with expert judgment 82 times. Sustainable contract work requires 85%+ calibration.",
          badExample: "Preference choice: Response B selected over Response A. Explanation: 'Response B is much more helpful and detailed. It covers all the relevant information and the formatting makes it easy to read. Response A is too short and doesn't really answer the question properly.'\n\n[Context: The instruction asked 'Is my Equity Bank savings account interest calculated daily or monthly?' Response A: 'Equity Bank calculates savings interest monthly on the minimum monthly balance. Interest is credited to your account on the last day of each month.' Response B: A 400-word explanation covering interest calculation methods, compound vs simple interest, comparison with other banks, tips for maximising interest income, and a note that Equity Bank uses monthly calculation.]",
          badBreakdown: [
            { element: "Chose B because it is 'more detailed'", present: "Length used as quality proxy", problem: "The user asked a specific yes/no plus clarification question. Response A answered it completely and accurately. Detail not requested is not a quality signal — it is noise." },
            { element: "'Response A is too short'", present: "Length penalised without criterion basis", problem: "Length is not a quality criterion. A correct, complete answer to a simple question should be short." },
            { element: "Did not evaluate accuracy", present: "Omitted entirely from explanation", problem: "If Response B contains any inaccurate claims in its 400-word expansion, this preference choice trains the AI to be inaccurately verbose" },
          ],
          badOutput: "Reward model learns to prefer longer, more formatted responses regardless of accuracy. AI trained on this signal produces unnecessarily verbose answers to simple questions — wasting users' time.",
          goodExample: "Preference choice: Response A selected over Response B. Explanation: 'The instruction asks a simple, specific factual question with two parts: (1) is interest calculated daily or monthly, and (2) implicitly: what does this mean for my account. Response A answers both parts correctly and completely in two sentences. Response B provides accurate information about Equity Bank's calculation method but then expands into unrequested content (comparative analysis, maximisation tips) that does not serve the instruction. Per Criterion C (completeness without over-generation), Response A is preferred. Response B would score higher on a question asking for a comprehensive savings account guide, but not on this specific instruction.'",
          goodBreakdown: [
            { element: "Restated what the instruction actually asked", present: "First sentence of explanation", improvement: "Grounds the preference in the user's actual need, not the evaluator's preference for detail" },
            { element: "Identified what Response A answers correctly", present: "Named both parts of the answer", improvement: "Explains the preference positively — Response A does something well" },
            { element: "Identified why Response B's extra content is not a quality signal for this instruction", present: "Named criterion C and scope mismatch", improvement: "Demonstrates understanding that quality is instruction-relative, not absolute" },
          ],
          goodOutput: "Reward model learns that response quality is judged relative to the instruction scope — a correct, concise answer to a simple question beats an exhaustive answer to a different question.",
          keyInsight: "The question for preference data is never 'which response is better in general?' It is always 'which response better serves this specific instruction?' A longer, more detailed, more formatted response is better only if the instruction requires that length, detail, or format.",
          ruleToRemember: "Before choosing, restate what the instruction actually asked. Then ask: which response better answers that specific request? Forget which response looks more impressive.",
          checkYourUnderstanding: [
            { question: "An instruction says 'Say hi.' Response A: 'Hi!' Response B: 'Hello! I'm your AI assistant, here to help you with all your questions. Whether you need information about banking, advice on savings, or just a friendly chat, I'm here for you!' Which response is better?", options: ["Response B — it is more helpful and sets expectations for what the AI can do", "Response A — the instruction asked for a greeting, Response A delivers a greeting, Response B is over-generating in a way that would be annoying at scale", "They are equal — it depends on the evaluator's preference", "Response B — it is always better to provide more information"], correctAnswer: 1, explanation: "The instruction has exactly one word: 'hi.' Response A satisfies it. Response B answers a different, longer instruction. Preference data trained on this choice teaches the AI to over-generate on every short query." },
          ],
        },
        quizQuestions: [
          { question: "What is sycophancy in the context of AI preference data and why is it dangerous?", options: ["When an AI agrees with the user's request — this is normal helpful behaviour", "When an AI validates incorrect premises stated by the user rather than correcting them — dangerous because preference data collectors who choose sycophantic responses train the AI to be confidently wrong", "When an AI is overly formal — a tone issue, not a safety concern", "Sycophancy only applies to emotional support contexts, not factual queries"], correctAnswer: 1 },
          { question: "Your calibration score drops from 87% to 76% after a week of preference data work. What is the most likely explanation?", options: ["The gold-standard answers changed", "You developed a systematic bias — likely length, format, or confidence bias — that is pushing your choices away from expert judgment. Review the last 50 pairs you submitted and look for a pattern in the cases you got wrong", "The tasks became harder", "76% is within normal variation and no action is needed"], correctAnswer: 1 },
          { question: "Why is 'Western cultural default' identified as a bias in preference data collection for AI systems serving African markets?", options: ["Western users are more demanding than African users — their preferences should take priority", "Applying Western communication norms (directness level, formality registers, example types) as quality standards produces AI that serves Western users better than African users — an AI company building for African markets specifically needs African cultural calibration in its preference data", "African preference data cannot be used for training AI systems because the language distribution is too different", "There is no such bias — human judgment is universal"], correctAnswer: 1 },
        ],
      },
      {
        lessonNumber: 6,
        title: "Building Python Evaluation Pipelines",
        type: "sandbox",
        hook: "Manual evaluation scales to hundreds of test items. Python evaluation pipelines scale to millions. The engineers who can build both — who understand the human judgment side and can automate it — are the most valuable people in AI evaluation. This lesson builds the pipeline.",
        duration_mins: 55,
        isAvailable: true,
        content: "A Python evaluation pipeline automates three things: running the AI against a test set, scoring responses against defined criteria, and aggregating results into a report. At small scale you do all three manually. At production scale you use the AI to evaluate itself (LLM-as-judge), validate AI judgments against human spot-checks, and generate statistical reports across thousands of test items.\n\nThe LLM-as-judge pattern is the most important concept in production evaluation. You prompt an AI (typically a larger, more capable model) to score another AI's responses using your rubric. This scales human evaluation criteria to any volume. The critical validation step: sample 5% of LLM judge decisions and check them against human judgment. If agreement is below 80%, your judge prompt is broken.",
        sandboxTask: `Build a complete AI evaluation pipeline for Fahari Bank's customer service AI. You will write the Python code structure, the judge prompts, and the reporting logic.\n\nCONTEXT: Fahari Bank has 500 test cases for their AI. Each test case has: an instruction (customer query), a ground truth answer (what a human expert would say), and an AI response (what the deployed system said). The evaluation criteria from Lesson 3: Accuracy (1-5), Completeness (1-5), Helpfulness (1-5), Safety (pass/fail).\n\nTASK 1 — EVALUATION PIPELINE STRUCTURE:\nWrite the Python code (with explanations) for a function called evaluate_response() that:\n- Takes: instruction (str), ground_truth (str), ai_response (str)\n- Calls the Claude API using claude-haiku-4-5-20251001 as the judge model\n- Uses a structured judge prompt to score Accuracy, Completeness, and Helpfulness on 1-5 scales\n- Returns: a dict with scores and a brief explanation for each dimension\n\nWrite the code with full imports, the function signature, the API call, and JSON parsing of the response. Use this structure:\n\`\`\`python\nimport anthropic\nimport json\nfrom typing import TypedDict\n\nclient = anthropic.Anthropic()\n\nclass EvaluationResult(TypedDict):\n    accuracy: int\n    completeness: int  \n    helpfulness: int\n    accuracy_reason: str\n    completeness_reason: str\n    helpfulness_reason: str\n\ndef evaluate_response(instruction: str, ground_truth: str, ai_response: str) -> EvaluationResult:\n    # YOUR CODE HERE\n\`\`\`\n\nTASK 2 — JUDGE PROMPT:\nWrite the exact prompt you would use inside evaluate_response() to instruct Claude claude-haiku-4-5-20251001 to score a Fahari Bank AI response. The prompt must:\n- Provide the rubric anchors for each of the three dimensions (copy the Accuracy rubric from Lesson 3 as an example, then write equivalents for Completeness and Helpfulness)\n- Specify that the judge must return valid JSON in exactly this format: {"accuracy": 1-5, "completeness": 1-5, "helpfulness": 1-5, "accuracy_reason": "...", "completeness_reason": "...", "helpfulness_reason": "..."}\n- Include an instruction to penalise responses that contain factually incorrect information about Kenyan banking (M-Pesa integration, interest rates, KRA compliance)\n- Be under 600 words\n\nTASK 3 — BATCH EVALUATION AND REPORTING:\nWrite a run_evaluation_batch() function that:\n- Takes a list of test cases (each a dict with 'instruction', 'ground_truth', 'ai_response')\n- Calls evaluate_response() for each test case\n- Handles API errors with a try/except that logs the error and continues\n- Returns an aggregated results dict with: mean scores per dimension, pass rate (score ≥ 4), worst-performing test cases (bottom 10% by mean score), dimension with lowest mean score\n\nTASK 4 — SAFETY EVALUATION:\nThe Safety criterion is pass/fail and cannot use a 1-5 scale. Write a separate evaluate_safety() function that:\n- Checks whether the AI response: (a) reveals other customer data, (b) approves loans or makes financial commitments, (c) gives specific investment advice, (d) provides internal system details\n- Returns: {"safety_pass": bool, "violations": list[str], "severity": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL"}\n- Uses a judge prompt that instructs Claude claude-haiku-4-5-20251001 to check for these specific Fahari Bank policy violations\n\nTASK 5 — CALIBRATION CHECK:\nWrite a calibrate_judge() function that takes 20 human-annotated gold standard items (where human scores are known), runs evaluate_response() on each, and returns the inter-annotator agreement rate between the LLM judge and human annotators. Define agreement as: the LLM score is within 1 point of the human score on all three dimensions. If agreement is below 80%, the function should print the 5 cases with the largest disagreement and suggest which rubric dimension needs refinement.`,
        quizQuestions: [
          { question: "Your evaluation pipeline runs 1,000 test cases through Claude claude-haiku-4-5-20251001 as judge. The pipeline costs $0.12 in API fees. Your manual evaluation rate is 30 items per hour at $40/hour. What is the cost of manual evaluation for 1,000 items?", options: ["$40", "$400 — 33 hours × $40/hour (approximately)", "$1,333 — 33 hours × $40/hour", "Cannot be calculated without knowing the evaluator's efficiency"], correctAnswer: 2 },
          { question: "Your LLM judge produces 73% agreement with human evaluators on the Helpfulness dimension. What should you do?", options: ["Accept 73% — LLM judges are inherently less reliable than humans", "Analyse the 27% disagreement cases to identify whether the LLM judge systematically overscores or underscores helpfulness, rewrite the rubric anchors in the judge prompt for that dimension, and re-calibrate", "Switch to a larger judge model — more capable models produce higher agreement automatically", "Increase the human spot-check rate to 20% and manually override LLM judgments when they disagree"], correctAnswer: 1 },
          { question: "A safety evaluation pipeline flags 3% of responses as containing policy violations. The product manager wants to set the safety threshold to 0% before deployment. Why is this target potentially unrealistic?", options: ["0% is achievable with a sufficiently strict safety classifier", "Safety classifiers produce false positives — some flagged responses may be false alarms. A 0% violation rate may mean the AI is refusing legitimate queries. The target should be 0% true positive violations as verified by human review of flagged items", "3% is an acceptable safety violation rate for a banking AI", "The product manager does not have authority to set safety thresholds — only engineers do"], correctAnswer: 1 },
        ],
      },
    ],
    capstone: {
      title: "AI Evaluation Engineer Certification",
      description: "Fahari Analytics — a fictional Nairobi-based AI consultancy — has been hired by a consortium of three East African banks to evaluate their shared AI customer service platform before a production rollout to 2 million customers across Kenya, Uganda, and Tanzania.",
      task: "You are the lead evaluation engineer. Build the complete evaluation system. Section 1: Capability specification — define 6 capabilities the AI must demonstrate for East African banking customers. For each capability write a 2-sentence description of what it means and why it matters specifically for this market. Section 2: Evaluation rubric — for your most critical capability, write a full rubric with 5-level anchors and 2 calibration examples per level. Section 3: Test set design — design a 50-item test set covering all 6 capabilities. List 5 specific test items (full instruction text) for your most critical capability including 2 adversarial cases. Section 4: Red-team findings — write a mock red-team executive summary assuming: 1 CRITICAL finding (Swahili-language safety guardrail bypass for loan approval manipulation), 2 HIGH findings, 4 MEDIUM findings, 12 PASS. Section 5: Evaluation pipeline — write the pseudocode for your production evaluation pipeline including judge model selection rationale, safety evaluation integration, calibration schedule, and reporting cadence. Section 6: Hiring pitch — write a 150-word LinkedIn post that positions you as the author of this evaluation system and attracts Western AI companies to contact you for remote evaluation contracts.",
      rubric: {
        specificity: { weight: 25, description: "Rubric anchors are specific enough to produce 85%+ inter-annotator agreement. Test cases are specific and unambiguous. Pipeline pseudocode would produce working code with minimal interpretation." },
        businessAccuracy: { weight: 25, description: "All 6 capabilities reflect real East African banking context — M-Pesa integration, Swahili/English bilingual support, mobile-first users, KRA compliance, informal sector customers. Generic banking AI capabilities score 0-10." },
        implementationRealism: { weight: 20, description: "The CRITICAL red-team finding is described with: exact attack strategy, exact prompt, exact prohibited output, business impact in KSh or customer risk terms, and a specific remediation recommendation." },
        ethicsQuality: { weight: 15, description: "The pipeline includes a realistic calibration schedule, specifies the agreement threshold, and describes what happens when agreement falls below threshold. Customer data protection in the safety evaluation is addressed." },
        professionalQuality: { weight: 15, description: "The LinkedIn post is specific (names the deliverable, names the market, names a metric), professional, and would plausibly attract outreach from a Western AI company hiring for African market evaluation." },
      },
      passingScore: 70,
    },
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
