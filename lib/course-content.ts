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
