"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
}

const TRACK_META: Record<string, { label: string; color: string; badge: string; passingScore: number }> = {
  "ai-professional": { label: "AI Professional", color: "#2d8a4e", badge: "AI Professional Badge", passingScore: 80 },
  "ai-developer": { label: "AI Developer", color: "#1a56db", badge: "AI Developer Badge", passingScore: 80 },
  "african-business-tech": { label: "African Business Tech", color: "#7e3af2", badge: "African Business Tech Badge", passingScore: 80 },
  "global-ai-talent": { label: "Global AI Talent", color: "#e3a008", badge: "Global AI Talent Badge", passingScore: 80 },
  "income-track": { label: "Income Track", color: "#0f1f3d", badge: "Income Track Badge", passingScore: 80 },
};

const QUESTIONS: Record<string, Question[]> = {
  "ai-professional": [
    { id: 1, question: "A colleague gives an AI model the instruction: 'Write a report.' The output is generic and unhelpful. What is the most likely cause?", options: ["The AI model is low quality", "The instruction lacks context, task specificity, constraints, and format — the model produced exactly what was asked for", "The colleague needs a paid subscription", "AI cannot write professional reports"], correctAnswer: 1 },
    { id: 2, question: "You need AI to analyse 3 months of M-Pesa transaction data for a client. Which prompt approach produces the most useful output?", options: ["'Analyse this M-Pesa data'", "'You are a financial analyst. I have 90 days of M-Pesa transactions for a Nairobi retail business. Identify the top 3 revenue patterns, flag any anomalies, and recommend 2 specific actions to improve cash flow. Format as a brief executive report.'", "'Summarise the data'", "'What can you tell me about this data?'"], correctAnswer: 1 },
    { id: 3, question: "What is chain-of-thought prompting and when should you use it?", options: ["Linking multiple AI tools together in a pipeline", "Asking the AI to show its reasoning step by step before giving a final answer — use it for complex analytical tasks where the intermediate reasoning improves accuracy", "Writing a series of prompts and using the best output", "A technique for making AI responses shorter"], correctAnswer: 1 },
    { id: 4, question: "An AI workflow saves a Nairobi marketing team 2 hours per day. The team has 5 people at an average salary of KSh 80,000/month. What is the approximate monthly value of the time saved?", options: ["KSh 25,000", "KSh 50,000 — approximately 2 hours out of 8 working hours per person per day × 5 people × KSh 80,000", "KSh 10,000", "KSh 400,000"], correctAnswer: 1 },
    { id: 5, question: "Which of the following is a valid concern about using AI for professional work in Kenya?", options: ["AI cannot understand Kenyan business context at all", "AI may produce confident-sounding but factually incorrect information about local regulations, tax rates, or market conditions — always verify AI output against authoritative sources for compliance matters", "AI is only suitable for technical roles", "AI output is always more accurate than human judgment"], correctAnswer: 1 },
    { id: 6, question: "You use AI to draft a contract clause for a client. The AI produces legally-sounding but possibly incorrect language. What should you do?", options: ["Send it immediately — AI is reliable for legal drafting", "Use it as a starting draft only and have a qualified advocate review it before sending to the client — AI is a drafting assistant, not a legal authority", "Discard it — AI cannot help with legal work", "Ask the AI to verify its own output"], correctAnswer: 1 },
    { id: 7, question: "A few-shot prompt includes 3 examples before asking the question. What is the primary benefit of this technique?", options: ["It makes the prompt longer so the AI works harder", "It shows the AI the exact format, style, and reasoning pattern you want applied to your question — especially useful for tasks with specific output requirements", "It confuses the AI into giving more creative answers", "Few-shot prompting is only for image generation tasks"], correctAnswer: 1 },
    { id: 8, question: "An AI assistant says: 'According to KRA, all businesses must register for VAT if annual turnover exceeds KSh 3 million.' The actual threshold is KSh 5 million. This is an example of:", options: ["A formatting error", "Hallucination — AI generating a confident but factually incorrect claim. This type of error is especially dangerous in financial and legal contexts", "A language model limitation that only affects small models", "An acceptable approximation"], correctAnswer: 1 },
    { id: 9, question: "You want to build a reusable AI workflow for writing weekly team updates at your company. What should the workflow include?", options: ["A single generic prompt that anyone can use", "A structured prompt template with placeholders for: team name, week number, accomplishments this week, blockers, and next week's priorities — so any team member fills in the variables and gets a consistent professional output", "Multiple different AI models for redundancy", "A manual review process that replaces AI output with human writing"], correctAnswer: 1 },
    { id: 10, question: "Which statement about AI ethics in professional use is most accurate?", options: ["AI output is objective and does not reflect bias", "AI systems can reflect and amplify biases present in training data — professionals must critically evaluate AI output for fairness, especially in hiring, lending, or performance evaluation contexts", "AI bias is only a problem in Western countries", "Ethics only applies to AI developers, not AI users"], correctAnswer: 1 },
    { id: 11, question: "A manager asks AI to evaluate 50 job applications and rank candidates. What is the primary risk of this approach?", options: ["It takes too long compared to manual review", "AI may apply biased criteria if the prompt does not explicitly define fair evaluation standards — and the manager may accept AI rankings without scrutinising the criteria applied", "AI cannot read PDFs", "The ranking will be based purely on alphabetical order"], correctAnswer: 1 },
    { id: 12, question: "What does 'prompt injection' mean in the context of AI safety?", options: ["A technique for making prompts more detailed", "Malicious text embedded in user input or documents that attempts to override the AI system's instructions — relevant for any system where untrusted users can provide input to an AI", "Adding examples to improve AI performance", "Combining multiple prompts into a single request"], correctAnswer: 1 },
    { id: 13, question: "You give an AI the same prompt twice and get different outputs. This is because:", options: ["The AI learns from previous responses and changed its behaviour", "AI language models have temperature — a randomness parameter that means outputs vary even for identical inputs. Reducing temperature produces more consistent outputs", "The AI is malfunctioning", "Different servers handled the two requests"], correctAnswer: 1 },
    { id: 14, question: "Which is the most professional way to use AI in a client-facing deliverable?", options: ["Generate the output and submit it directly without review", "Use AI to produce a first draft, apply expert judgment to verify accuracy and relevance, edit for context-specific accuracy, and clearly disclose AI assistance where your client relationship or contract requires it", "Use AI secretly and never mention it to clients", "Avoid AI entirely for any client work"], correctAnswer: 1 },
    { id: 15, question: "A Tundemy graduate applies for an operations role at a Nairobi logistics company. Which AI skill would be most immediately valuable to demonstrate to the employer?", options: ["Being able to explain how neural networks work mathematically", "Showing a specific AI workflow they built — for example, an automated weekly report or M-Pesa data analysis — with documented time savings and business impact", "Knowing the names of the largest AI companies", "Having a ChatGPT Plus subscription"], correctAnswer: 1 },
  ],
  "ai-developer": [
    { id: 1, question: "A Meta Cloud API webhook must respond to the verification GET request within how many seconds?", options: ["30 seconds", "5 seconds — Meta considers the webhook unresponsive if it does not receive a 200 response within 5 seconds of sending the verification challenge", "60 seconds", "There is no time limit — Meta retries indefinitely"], correctAnswer: 1 },
    { id: 2, question: "What HTTP status code must your webhook return immediately when receiving a WhatsApp message, before processing it?", options: ["200 — immediately, before any processing — Meta will retry if it does not receive 200 within 20 seconds", "404", "201", "Processing must complete before responding"], correctAnswer: 0 },
    { id: 3, question: "In the Daraja API STK Push flow, what is the purpose of the `CheckoutRequestID`?", options: ["It identifies the business making the request", "It is the unique identifier for this specific STK Push session — used to query payment status and match the callback confirmation to the original request", "It is the customer's phone number in a different format", "It expires after 30 seconds and should not be stored"], correctAnswer: 1 },
    { id: 4, question: "A Daraja API OAuth token expires in how many seconds by default?", options: ["3600 seconds (1 hour)", "300 seconds (5 minutes)", "86400 seconds (24 hours)", "Tokens do not expire"], correctAnswer: 0 },
    { id: 5, question: "What is the correct format for passing the STK Push password in a Daraja API request?", options: ["Your Daraja consumer secret directly", "Base64 encode the concatenation of: BusinessShortCode + Passkey + Timestamp (format: YYYYMMDDHHmmss)", "MD5 hash of your consumer key", "The plain text passkey from the Daraja portal"], correctAnswer: 1 },
    { id: 6, question: "A WhatsApp Business bot session rule states that a business can only send free-form messages within a 24-hour window. After the window closes, what can the business send?", options: ["Nothing — the conversation is closed permanently", "Only approved message templates — these require Meta pre-approval and are used to re-engage customers after the 24-hour window", "Any message — the rule only applies to the first message", "Only text messages, no media"], correctAnswer: 1 },
    { id: 7, question: "In a production M-Pesa integration, why should you implement idempotency keys for STK Push requests?", options: ["Safaricom requires it in their API documentation", "To prevent duplicate charges if your server crashes after sending the STK Push request but before recording the request — an idempotency key ensures the same payment cannot be triggered twice for the same transaction", "For security encryption purposes", "Idempotency is only needed for C2B transactions, not STK Push"], correctAnswer: 1 },
    { id: 8, question: "A Daraja callback is not arriving after an STK Push. What is the most likely cause when testing locally?", options: ["Safaricom's servers are down", "Your callback URL is localhost — Daraja cannot reach private IP addresses. Use ngrok or a deployed URL for testing callbacks", "The STK Push failed silently", "The customer's phone is off"], correctAnswer: 1 },
    { id: 9, question: "What is the purpose of a WhatsApp message template's `components` field?", options: ["It defines the button layout only", "It contains the variable parameters that replace {{1}}, {{2}} placeholders in the approved template — allowing personalisation of a pre-approved message format", "It specifies the message language", "Components are optional metadata not sent to the recipient"], correctAnswer: 1 },
    { id: 10, question: "In a Node.js webhook handler for WhatsApp, what does `req.body.entry[0].changes[0].value.messages` contain?", options: ["The webhook verification token", "The array of incoming messages from users — each message object contains the sender's phone number, message type, timestamp, and content", "The business phone number ID", "The message delivery status updates"], correctAnswer: 1 },
    { id: 11, question: "A Daraja B2C payment fails with error code `2001`. What does this indicate?", options: ["Invalid phone number format", "Receiver not registered on M-Pesa — the phone number is not linked to an active M-Pesa account", "Insufficient business funds", "The request timed out"], correctAnswer: 1 },
    { id: 12, question: "Why should you use exponential backoff when retrying failed Daraja API calls?", options: ["Faster retries improve success rates", "Immediate repeated retries can trigger Safaricom's rate limiting, causing all subsequent requests to fail. Exponential backoff (2s, 4s, 8s delays) reduces retry pressure while still recovering from transient failures", "Safaricom's API documentation requires it", "It is only needed for C2B queries, not STK Push"], correctAnswer: 1 },
    { id: 13, question: "What Supabase SQL constraint should you add to a `payments` table to prevent duplicate M-Pesa receipts from being recorded?", options: ["PRIMARY KEY on the payment row id", "UNIQUE constraint on the `mpesa_receipt_number` column — prevents a duplicate callback from inserting the same receipt number twice", "CHECK constraint on the amount column", "FOREIGN KEY from payments to users"], correctAnswer: 1 },
    { id: 14, question: "A WhatsApp bot needs to maintain conversation state (user is midway through a booking flow). What is the correct architecture?", options: ["Store state in a JavaScript variable on the server", "Store session state in a server-side Map or Redis keyed by the user's phone number, with a TTL — in-memory variables are lost on server restart, breaking active conversations", "Ask the user to repeat their previous inputs at each message", "State management is not needed — WhatsApp tracks conversation context automatically"], correctAnswer: 1 },
    { id: 15, question: "In production, what is the minimum data you must store when a Daraja STK Push callback arrives confirming a successful payment?", options: ["Just the MpesaReceiptNumber", "MpesaReceiptNumber, Amount, PhoneNumber, TransactionDate, and your internal order/reference ID — all five are needed for reconciliation, dispute resolution, and KRA compliance", "Amount and PhoneNumber only", "The full raw callback JSON — nothing needs to be extracted"], correctAnswer: 1 },
  ],
  "african-business-tech": [
    { id: 1, question: "Which Kenyan data source provides maize market prices across East Africa and is used by agritech companies for price forecasting?", options: ["Kenya Revenue Authority (KRA)", "Eastern Africa Grain Council (EAGC) — maintains price data for maize and other grains across East African markets", "Kenya National Bureau of Statistics (KNBS) — only national aggregate data", "Safaricom M-Pesa transaction averages"], correctAnswer: 1 },
    { id: 2, question: "A farmer in Nakuru has 20 bags of maize post-harvest. The current price is KSh 2,800/bag. An 8-week forecast predicts prices will fall to KSh 2,200 then recover to KSh 4,500. What is the maximum additional income if the farmer stores and sells at peak?", options: ["KSh 34,000 additional income (KSh 4,500 - KSh 2,800 = KSh 1,700 × 20 bags)", "KSh 46,000", "KSh 6,000", "Cannot be calculated without storage costs"], correctAnswer: 0 },
    { id: 3, question: "In a WhatsApp farmer advisory system serving 3,000 farmers, the biggest scalability constraint when using Meta Cloud API is:", options: ["WhatsApp message character limits", "Business-initiated messages require approved templates, and accounts have rate limits — scaling beyond one account requires multiple registered business numbers and potentially enterprise-tier Meta Business API access", "The cost of sending messages — WhatsApp charges per message", "AI response generation speed"], correctAnswer: 1 },
    { id: 4, question: "What moisture level threshold must maize dry below before safe hermetic bag storage?", options: ["18%", "14% — maize above 14% moisture will mold in hermetic storage. Below 13% is ideal for extended storage of 12+ months", "20%", "10% — drying below 10% damages grain quality"], correctAnswer: 1 },
    { id: 5, question: "An AI crop yield prediction model trained on Rift Valley maize data from 2010-2020 is deployed to predict yields for a Western Kenya farm in 2025. What is the main validity concern?", options: ["The model cannot predict yields more than 5 years in advance", "The model was trained on different agroecological zone data — rainfall patterns, soil types, and varieties in Western Kenya differ from Rift Valley. Domain shift may produce unreliable predictions outside the training distribution", "2025 climate data is not yet available for training", "The model requires GPS coordinates to make predictions"], correctAnswer: 1 },
    { id: 6, question: "An NGO wants to deploy an AI advisory SMS service for 10,000 smallholder farmers. 60% have feature phones (SMS only), 40% have WhatsApp-capable smartphones. What is the correct architecture?", options: ["Build only for WhatsApp — feature phone users can borrow smartphones", "Build a dual-channel system: WhatsApp for smartphone users (richer messages, images), SMS for feature phone users (160-character key advisory). Use a single backend that generates both message types from the same AI advisory output", "Build only for SMS — it reaches all farmers", "Wait until feature phone penetration drops — SMS is declining"], correctAnswer: 1 },
    { id: 7, question: "A cooperative manager asks: 'Should we sell our stored maize now at KSh 3,200/bag or wait 6 weeks for the projected KSh 4,800/bag?' The cooperative has 200 bags in storage costing KSh 15,000/month. What is the correct financial analysis?", options: ["Always sell now — price predictions are unreliable", "Calculate: waiting benefit = (KSh 4,800 - KSh 3,200) × 200 bags = KSh 320,000. Storage cost for 6 weeks = KSh 22,500. Net benefit of waiting = KSh 297,500 if the forecast is accurate. Advise waiting if the forecast confidence is high, with the caveat that price predictions carry uncertainty", "Store indefinitely — prices always rise over time", "Sell half now and store half — a split decision reduces forecast risk"], correctAnswer: 1 },
    { id: 8, question: "KALRO (Kenya Agricultural and Livestock Research Organisation) provides which type of data most useful for AI crop recommendation systems?", options: ["Real-time commodity prices across East Africa", "Variety performance data by agroecological zone — including yield potential, disease resistance, and optimal growing conditions for different Kenyan farming regions", "Weather forecasts for the next 30 days", "Farmer registration and subsidy eligibility data"], correctAnswer: 1 },
    { id: 9, question: "An AI post-harvest loss detection model achieves 78% accuracy on classifying aflatoxin risk in stored maize from photos. For deployment to farmer advisory, this means:", options: ["It is ready for deployment — 78% accuracy is high", "22% of at-risk grain will be missed (false negatives) and some safe grain will be flagged (false positives). Deployment should: present the model as a screening tool, recommend confirmatory testing for high-risk classifications, and never present the model as a definitive safety certification", "It should be retrained until it reaches 95% before any deployment", "Accuracy is the wrong metric — use precision only for safety applications"], correctAnswer: 1 },
    { id: 10, question: "Why is Swahili language advisory delivery important for AI agritech systems targeting Kenyan farmers, beyond simple translation?", options: ["English is not spoken in rural Kenya", "Cultural and contextual nuance in agricultural advice is better expressed in the farmer's first language — price ranges, seasonal terms, and cooperative relationships have Swahili terminology that conveys precise meaning English translations can miss", "Swahili advisory is required by Kenyan agricultural law", "It reduces data transmission costs compared to English"], correctAnswer: 1 },
    { id: 11, question: "A French bean export farmer in Meru receives an AI soil test recommendation to apply 200kg/acre of CAN fertiliser. The recommendation comes from a model trained on Central Kenya data. What should the farmer do?", options: ["Apply the full 200kg immediately — AI recommendations are precise", "Treat it as a starting point. Verify with a local agricultural extension officer — soil conditions, existing nutrient levels, and seasonal timing vary by location. Apply a test plot before full-field application", "Ignore AI recommendations entirely for export crops", "Apply half the recommended amount to be safe"], correctAnswer: 1 },
    { id: 12, question: "What is the primary advantage of building agritech AI applications as WhatsApp chatbots rather than dedicated mobile apps for East African smallholder farmers?", options: ["WhatsApp apps are cheaper to develop than native apps", "WhatsApp is already installed on the majority of smartphones in Kenya — zero installation friction, no app store requirement, and no additional data cost for WhatsApp-subscribed users. Adoption barriers for a new app (installation, learning) are eliminated", "WhatsApp has better AI integration than native app APIs", "WhatsApp works offline while apps require internet"], correctAnswer: 1 },
    { id: 13, question: "An agritech startup wants to predict market prices 8 weeks ahead for smallholder maize farmers. Which combination of data inputs would produce the most reliable forecast?", options: ["Current day's price only", "Historical price data (3+ years, weekly granularity) + seasonal planting calendar (harvest timing drives supply) + weather forecasts (affects crop quality and yield) + current stock levels at major assembly markets", "Last month's prices only", "Regional GDP growth rates and inflation data"], correctAnswer: 1 },
    { id: 14, question: "A county government wants to use AI to identify which smallholder farmers are most at risk of food insecurity in the coming season. What is the primary ethical obligation before deploying such a system?", options: ["Obtain approval from the national government", "Define clearly how the risk classification will be used — if farmers flagged as high-risk receive additional support, the system helps them; if the classification is used to deny services or loans, it harms them. Transparent data use policy and farmer consent are required", "Ensure the AI model has 95%+ accuracy before use", "Partner with an international NGO to validate the model"], correctAnswer: 1 },
    { id: 15, question: "The Eastern African Grain Council (EAGC)'s RATIN (Regional Agricultural Trade Intelligence Network) publishes price data. For a price forecasting model, what is the correct way to use this data?", options: ["Download it once and train a static model", "Establish automated weekly ingestion of new RATIN data to retrain or update the model — price forecasting models decay as market conditions change. A model trained 12 months ago on static data will underperform a model updated with current market intelligence", "Use it for visualisation only — AI models cannot use external databases", "RATIN data is proprietary and cannot be used in AI systems"], correctAnswer: 1 },
  ],
  "global-ai-talent": [
    { id: 1, question: "Inter-annotator agreement (IAA) of 72% on an evaluation rubric dimension means:", options: ["72% of AI responses passed the evaluation", "Two evaluators applying the same rubric agreed on the same score 72% of the time — below the 80% minimum threshold that indicates the rubric is well-calibrated. The rubric needs revision", "72% of your evaluation work is billable", "The AI model scores 72% on average across all test items"], correctAnswer: 1 },
    { id: 2, question: "You are doing preference data annotation. Response A is 50 words. Response B is 300 words. The instruction asked 'What is the capital of Kenya?' Which response is preferred?", options: ["Response B — more comprehensive", "Response A — the instruction asked a simple factual question; a concise correct answer is preferred. Choosing B because it is longer introduces length bias that trains AI to be verbose", "They are equal — both likely state 'Nairobi'", "Response B if it contains additional context about Nairobi"], correctAnswer: 1 },
    { id: 3, question: "What does RLHF stand for and what is its role in modern AI development?", options: ["Real Language Human Feedback — a data format for multilingual training", "Reinforcement Learning from Human Feedback — a training technique where human preference data (comparisons between AI responses) trains a reward model that then guides further AI training to produce more helpful, harmless, and honest outputs", "Reliable Language and Hallucination Filtering — a post-processing technique", "Random Learning with Human Fine-tuning — a rapid prototyping method"], correctAnswer: 1 },
    { id: 4, question: "A Swahili-language red-team attack bypasses an AI safety guardrail that blocks the same request in English. Why does this happen and what does it reveal?", options: ["Swahili is not supported by the AI model", "AI safety training data is predominantly English — safety classifiers have seen fewer examples of prohibited content in Swahili and therefore have weaker guardrails in that language. This is a systemic safety gap that requires Swahili-language safety data", "It is a random error that will self-correct", "The AI treats all languages equally — this finding is not replicable"], correctAnswer: 1 },
    { id: 5, question: "What is the primary difference between model evaluation and red-teaming?", options: ["Red-teaming is done by engineers; evaluation is done by contractors", "Model evaluation tests whether the AI performs its intended function correctly across a defined test set. Red-teaming specifically tries to make the AI behave badly — finding safety failures, policy violations, and unexpected harmful outputs", "They are the same activity with different names", "Evaluation measures accuracy; red-teaming measures speed"], correctAnswer: 1 },
    { id: 6, question: "A calibration score of 83% means:", options: ["The evaluator made correct decisions on 83% of all tasks submitted", "The evaluator agreed with gold-standard expert judgments on 83 of 100 calibration examples. Most contracts require 85%+ to continue — 83% indicates a systematic bias that needs to be identified and corrected", "The AI model scored 83% on the evaluation framework", "83% of the evaluator's submitted work was accepted without revision"], correctAnswer: 1 },
    { id: 7, question: "An AI response about M-Pesa Paybill numbers states an incorrect 5-digit format (actual format is 6 digits for most businesses). In your evaluation, this is a failure on which criterion?", options: ["Helpfulness", "Factual accuracy — the response contains a specific incorrect claim about a Kenyan financial product. In evaluation, you must note the exact error and the correct information", "Language clarity", "Response format"], correctAnswer: 1 },
    { id: 8, question: "When building a Python evaluation pipeline using LLM-as-judge, the judge model disagrees with human evaluators 28% of the time on the 'helpfulness' dimension. What should you do?", options: ["Accept 72% agreement — LLMs are inherently less reliable than humans", "Analyse the 28% disagreement cases to identify whether the judge systematically overscores or underscores helpfulness. Rewrite the rubric anchors in the judge prompt for that dimension. Re-calibrate by running the updated prompt against the same gold-standard set", "Switch to a larger judge model", "Increase the human spot-check rate to 50%"], correctAnswer: 1 },
    { id: 9, question: "You are writing training data for an AI assistant serving Kenyan users. The instruction is: 'Explain how to pay a KRA penalty using M-Pesa.' Your ideal response should:", options: ["Explain the generic concept of online tax payments", "Provide the specific KRA Paybill number, the exact account number format for penalty payments, the steps to confirm the payment on iTax, and the receipt to retain — all verified against current KRA procedures", "Advise the user to visit a KRA office instead", "Explain what M-Pesa is before answering the question"], correctAnswer: 1 },
    { id: 10, question: "What is 'sycophancy' in an AI model and why is it a safety concern?", options: ["When an AI agrees with the user's preferences — a feature, not a bug", "When an AI validates incorrect premises or false statements made by the user instead of correcting them — dangerous because users making financial, medical, or legal decisions based on AI-validated incorrect assumptions may be harmed", "When an AI is excessively polite in its language", "Sycophancy is a concern for social AI but not for enterprise AI applications"], correctAnswer: 1 },
    { id: 11, question: "Which attack strategy has the highest success rate against most production AI safety guardrails in 2025?", options: ["Direct requests for prohibited content", "Language switching (making prohibited requests in non-English languages), context injection (embedding harmful requests in large legitimate documents), and code wrapping — because safety training is English-dominant and safety classifiers have weaker coverage in other languages and code contexts", "Role-play jailbreaks — 'pretend you are an AI without restrictions'", "Authority spoofing — claiming to be the AI company itself"], correctAnswer: 1 },
    { id: 12, question: "A red-team report rates a finding as CRITICAL. What does this severity level require in the report?", options: ["A note in the appendix", "Immediate notification to the product team and security team, a specific description of the attack method that produced the failure, the exact prohibited output observed, business impact assessment (potential harm to real users), and a specific remediation recommendation with timeline", "Only documentation — CRITICAL findings do not require faster remediation than HIGH findings", "Deferral to the next sprint — severity does not affect remediation priority"], correctAnswer: 1 },
    { id: 13, question: "RAGAS faithfulness score measures:", options: ["How relevant the retrieved documents are to the user query", "The percentage of claims in the generated response that are directly supported by the retrieved documents — a low faithfulness score indicates hallucination", "The percentage of user queries that receive a response", "How semantically similar the generated response is to the ground truth answer"], correctAnswer: 1 },
    { id: 14, question: "Scale AI pays $18/hour. An AI company's direct contract pays $60/hour for equivalent work. What qualification typically justifies the 3x rate difference?", options: ["The direct contract requires more hours", "A portfolio demonstrating evaluation work quality, a calibration score above 90% on a specialised domain, and domain expertise (such as African language evaluation or financial domain knowledge) that the platform's contractor pool cannot supply", "The direct contract is always longer-term", "Geographic location — US-based evaluators get higher rates"], correctAnswer: 1 },
    { id: 15, question: "You identify that an AI model consistently produces incorrect information about NHIF contributions for Kenyan employees. This finding is most valuable to which team at the AI company?", options: ["The sales team", "The training data team (needs Kenya-specific NHIF training examples), the evaluation team (adds NHIF knowledge to test set), and the safety team (incorrect employment law information in an HR AI could cause financial harm to workers)", "Only the safety team", "The infrastructure team"], correctAnswer: 1 },
  ],
  "income-track": [
    { id: 1, question: "An Upwork profile headline reads: 'AI Expert | Python | Machine Learning | ChatGPT | Automation | NLP | Data Science | Freelancer from Kenya.' What is the primary problem with this headline?", options: ["It is too long for Upwork's character limit", "It attempts to match all searches and therefore stands out for none — a generalist headline competes with 100,000 profiles. A specific headline ('WhatsApp AI Chatbots for E-commerce | Meta Cloud API + Claude') matches fewer searches but wins a much higher percentage of those matches", "It mentions too many programming languages", "Freelancers should not mention their country in the headline"], correctAnswer: 1 },
    { id: 2, question: "A client offers $350 for a project you quoted at $600. You have zero Upwork reviews. What is the most strategically correct response?", options: ["Immediately accept — any review is worth taking at any price", "Evaluate the project's portfolio value. If it produces a strong, demonstrable outcome (a working WhatsApp bot, a deployed automation), accepting at $350 to win your first review may be justified. If the project is too large to absorb at $350 without quality impact, counter-propose with a reduced scope at $350 that you can execute excellently", "Reject — accepting below your quoted rate is unprofessional", "Accept but secretly deliver less quality than your standard work"], correctAnswer: 1 },
    { id: 3, question: "A Western client asks: 'Your rate of $65/hour seems high for a developer outside the US.' What is the correct framing for your response?", options: ["Apologise and lower your rate", "Reframe from rate to ROI: quantify what your work saves or generates for them — 'This project costs $2,600. The WhatsApp automation will save your team 3 hours of daily customer service at [their staff cost]. Payback in approximately X months, then pure savings.' Price becomes an investment, not a cost", "Explain that your cost of living is lower", "Offer to do the first week at $30/hour to prove quality"], correctAnswer: 1 },
    { id: 4, question: "What is scope creep and what is the correct professional response when it occurs on a fixed-price project?", options: ["When a project takes longer than planned — respond by working faster", "When a client requests additional work beyond the original agreed scope — respond by acknowledging the new request positively, explaining it is outside the current scope, providing a specific estimate for the addition, and offering to include it as a paid add-on or schedule it as a phase 2 project", "When the client wants fewer features than originally scoped — reduce the price proportionally", "Scope creep is unavoidable — build extra time into every fixed-price quote"], correctAnswer: 1 },
    { id: 5, question: "Payoneer gives you a US virtual bank account. A US client pays $1,500 into it. You withdraw to your Kenyan bank account. What fees apply approximately?", options: ["Zero — international transfers to Payoneer are always free", "Payoneer charges approximately 2% currency conversion fee from USD to KES plus a small flat withdrawal fee — total typically 2-3% of the payment. This is significantly less than an international wire transfer ($40-65 flat fee regardless of amount)", "50% — Payoneer takes half for currency conversion", "KES 10,000 flat fee per withdrawal"], correctAnswer: 1 },
    { id: 6, question: "A new Western client asks you to start a £3,000 project with 'payment when done.' What should you do?", options: ["Trust professional clients — payment on completion is standard in the West", "Request a milestone structure — minimum 30-40% funded upfront via Upwork escrow or a payment platform before work begins. No professional service provider starts significant work without payment protection, regardless of how trustworthy the client appears", "Do a small deliverable first to test their payment reliability", "Accept if they have a legitimate company website and LinkedIn profile"], correctAnswer: 1 },
    { id: 7, question: "Your cold LinkedIn outreach message to a UK e-commerce brand reads: 'Hello, I am Grace from Nairobi Kenya. I am a skilled AI developer with 5 years experience in chatbot development and I can help your business grow.' What is wrong with this message?", options: ["It mentions Nairobi — Western clients won't hire from Africa", "It opens with your identity and credentials instead of their problem. The client reads about Grace before knowing why this message is relevant to them. A message that opens with their specific situation ('Your customer service WhatsApp volume could be handled automatically — I built a system for a similar brand that now handles 200 daily inquiries automatically') gets a response rate 3-5x higher", "It is too short — include more skills", "Cold outreach to UK clients is not allowed by LinkedIn policy"], correctAnswer: 1 },
    { id: 8, question: "You complete a project for a Western client. They give 5 stars but a very brief review: 'Good developer.' How do you get a more specific review on future projects?", options: ["Ask them to edit the review to be more detailed", "At project close, send a brief summary of what was accomplished and the specific outcome, then ask: 'Would you be able to mention [specific result] in your review? It helps future clients understand what to expect.' Specific outcome-focused requests produce specific reviews", "Accept the review — any 5-star review is valuable", "Offer a discount on future work in exchange for a better review"], correctAnswer: 1 },
    { id: 9, question: "A Western client offers a monthly retainer of £800 for 4 hours of maintenance and updates on a system you built. Your project hourly rate was £50/hour. Should you accept?", options: ["No — retainers should always be based on your hourly rate (£50 × 4 = £200, not £800)", "Yes — £800 for 4 hours represents £200/hour, which is 4x your project rate. Retainers price for access and reliability, not just hours. Clearly define in the retainer agreement exactly what 4 hours covers to prevent scope creep", "No — recurring income ties up capacity for better-paying project work", "Negotiate down to £400 — £800/month for 4 hours seems too high"], correctAnswer: 1 },
    { id: 10, question: "Your freelance income from international clients is KSh 1.8 million in a year. What are your KRA obligations?", options: ["Nothing — international income is not taxable in Kenya", "Report the income in your annual KRA iTax individual tax return as self-employment income. Pay income tax on the amount above the personal relief threshold. At KSh 1.8 million annual income, you are also above the KSh 1.5 million VAT registration threshold — VAT registration is required", "Only pay tax if the income comes through a Kenyan bank account", "Register as a company to reduce the tax burden before reporting"], correctAnswer: 1 },
    { id: 11, question: "A UK client's NDA requires you not to disclose 'confidential information' for 5 years but does not define what counts as confidential. What should you clarify before signing?", options: ["Sign it — NDAs are boilerplate and not legally enforced against small contractors", "Request a clear definition of 'confidential information' — without it, you cannot know what you are prohibited from sharing. Also check whether the NDA excludes information that was already public before you signed, or that you independently developed", "Ask a friend who is a lawyer to translate it into simple language", "Propose a 1-year term instead of 5 years"], correctAnswer: 1 },
    { id: 12, question: "You have 3 retainer clients at £800/month each. A new project client offers £5,000 for a 4-week project. You are at 75% capacity. What is the most strategic response?", options: ["Accept immediately — project income always beats retainer income", "Evaluate: taking the project risks retainer quality if the project overruns. Options: negotiate a 6-week timeline to spread the load; decline and refer to another freelancer (building a referral network); or accept with transparent communication to retainer clients about capacity this month", "Terminate one retainer to take the project", "Accept and bill extra hours to retainer clients to compensate"], correctAnswer: 1 },
    { id: 13, question: "A Western client asks for 3 professional references before hiring you for their first project. You have no previous Western clients. What is the strongest response?", options: ["Provide references from Kenyan colleagues who know your work quality", "Offer your portfolio instead — show the specific project outcomes (WhatsApp bot handling X daily messages, M-Pesa integration processing Y payments/day), and propose a paid mini-project (1-2 hours at your rate) that lets them evaluate your work quality directly. Portfolio proof beats character references for technical work", "Admit you have no references and offer a 50% discount", "Claim to have references and provide fake ones"], correctAnswer: 1 },
    { id: 14, question: "The most important metric to track in your first 30 days on Upwork is:", options: ["Number of proposals sent", "Proposal-to-interview conversion rate — if you send 30 proposals and get 0 interviews, your proposal content or targeting is broken. The rate reveals which part of your acquisition funnel needs fixing, not just how busy you are", "Total earnings", "Profile views"], correctAnswer: 1 },
    { id: 15, question: "A project for a US client will require signing a contract that assigns all IP rights to the client. Before signing, what should you verify?", options: ["Nothing — IP assignment is standard and legally equivalent in Kenya and the US", "That the assignment is limited to work specifically created for this project — any pre-existing tools, templates, or code libraries you bring to the project should be explicitly excluded from the IP assignment in the contract. Without this carve-out, you may sign away tools you use for all your other clients", "That the contract is governed by Kenyan law", "That the client's company is registered in the US"], correctAnswer: 1 },
  ],
};

function getQuestionsForTrack(track: string): Question[] {
  return QUESTIONS[track] ?? [];
}

type AssessmentState = "intro" | "quiz" | "result";

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const track = (params?.track as string) ?? "";
  const meta = TRACK_META[track];
  const questions = getQuestionsForTrack(track);

  const [state, setState] = useState<AssessmentState>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [saving, setSaving] = useState(false);

  const score = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const passed = pct >= (meta?.passingScore ?? 80);

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelected(idx);
  };

  const handleNext = useCallback(() => {
    if (selected === null) return;
    const newAnswers = [...answers];
    newAnswers[current] = selected;
    setAnswers(newAnswers);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        // Final — save and show result
        setSaving(true);
        const finalScore = newAnswers.filter((a, i) => a === questions[i]?.correctAnswer).length;
        const finalPct = Math.round((finalScore / questions.length) * 100);
        const didPass = finalPct >= (meta?.passingScore ?? 80);

        async function save() {
          try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              await supabase.from("assessment_results").upsert({
                user_id: session.user.id,
                track,
                score: finalPct,
                passed: didPass,
                taken_at: new Date().toISOString(),
              }, { onConflict: "user_id,track" });

              if (didPass) {
                await supabase.from("user_badges").upsert({
                  user_id: session.user.id,
                  badge_name: meta?.badge ?? `${meta?.label} Badge`,
                  earned_at: new Date().toISOString(),
                }, { onConflict: "user_id,badge_name" });
              }
            }
          } catch { /* non-blocking */ }
          setSaving(false);
          setState("result");
        }
        save();
      }
    }, 1200);
  }, [selected, answers, current, questions, track, meta]);

  if (!meta || questions.length === 0) {
    return (
      <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }} className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="font-bold" style={{ color: "#0f1f3d" }}>Assessment not found</p>
          <Link href="/" className="text-sm text-green-700 underline mt-2 block">Back to home</Link>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const isCorrect = selected !== null && selected === q?.correctAnswer;

  if (state === "intro") {
    return (
      <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <nav className="bg-white border-b sticky top-0 z-10" style={{ borderColor: "#e5e7eb" }}>
          <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col w-1 h-5 rounded-sm overflow-hidden">
                <div className="flex-1 bg-black" />
                <div className="flex-1 bg-[#bb0000]" />
                <div className="flex-1 bg-[#2d8a4e]" />
              </div>
              <span className="text-base font-bold" style={{ color: "#0f1f3d" }}>Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
            </Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-5 py-12">
          <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: "#e5e7eb" }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: `${meta.color}15`, color: meta.color }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block"
              style={{ backgroundColor: `${meta.color}12`, color: meta.color }}>
              {meta.label}
            </span>
            <h1 className="text-2xl font-extrabold mt-3 mb-2" style={{ color: "#0f1f3d" }}>
              {meta.label} Certification
            </h1>
            <p className="text-sm text-gray-500 mb-8">
              15 questions · Pass 80% or above to earn your {meta.badge}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8 text-center">
              {[
                { label: "Questions", value: "15" },
                { label: "Passing Score", value: "80%" },
                { label: "Time Limit", value: "No limit" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl border p-3" style={{ borderColor: "#f3f4f6" }}>
                  <p className="text-lg font-extrabold" style={{ color: "#0f1f3d" }}>{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            <button onClick={() => setState("quiz")}
              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: meta.color }}>
              Start Assessment →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "result") {
    return (
      <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <nav className="bg-white border-b sticky top-0 z-10" style={{ borderColor: "#e5e7eb" }}>
          <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex flex-col w-1 h-5 rounded-sm overflow-hidden">
                <div className="flex-1 bg-black" />
                <div className="flex-1 bg-[#bb0000]" />
                <div className="flex-1 bg-[#2d8a4e]" />
              </div>
              <span className="text-base font-bold" style={{ color: "#0f1f3d" }}>Tund<span style={{ color: "#2d8a4e" }}>emy</span></span>
            </Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-5 py-12">
          <div className="bg-white rounded-2xl border p-8 text-center" style={{ borderColor: "#e5e7eb" }}>
            <div className="text-5xl mb-4">{passed ? "🏆" : "📚"}</div>
            <h1 className="text-2xl font-extrabold mb-2" style={{ color: "#0f1f3d" }}>
              {passed ? "Assessment Passed!" : "Not Quite Yet"}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {passed
                ? `You scored ${pct}% — your ${meta.badge} has been awarded.`
                : `You scored ${pct}%. You need 80% to pass. Review the course material and try again.`}
            </p>

            {/* Score circle */}
            <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mx-auto mb-6"
              style={{ borderColor: passed ? "#2d8a4e" : "#e5e7eb" }}>
              <div>
                <p className="text-2xl font-extrabold" style={{ color: passed ? "#2d8a4e" : "#6b7280" }}>{pct}%</p>
                <p className="text-xs text-gray-400">{score}/{questions.length}</p>
              </div>
            </div>

            {passed && (
              <div className="rounded-xl border p-4 mb-6" style={{ borderColor: "rgba(45,138,78,0.2)", backgroundColor: "rgba(45,138,78,0.04)" }}>
                <p className="text-xs font-bold mb-1" style={{ color: "#2d8a4e" }}>✓ Badge Awarded</p>
                <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{meta.badge}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard"
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white text-center transition-all hover:opacity-90"
                style={{ backgroundColor: "#2d8a4e" }}>
                Go to Dashboard
              </Link>
              {!passed && (
                <button onClick={() => { setState("intro"); setCurrent(0); setAnswers(new Array(questions.length).fill(null)); setSelected(null); }}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-center border-2 transition-all hover:bg-gray-50"
                  style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz state
  return (
    <div style={{ fontFamily: "Inter, sans-serif", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <nav className="bg-white border-b sticky top-0 z-10" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: meta.color }}>{meta.label} Assessment</span>
          <span className="text-sm font-bold" style={{ color: "#0f1f3d" }}>
            {current + 1} / {questions.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-100">
          <div className="h-full transition-all duration-300" style={{ width: `${((current + (showFeedback ? 1 : 0)) / questions.length) * 100}%`, backgroundColor: meta.color }} />
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-10">
        {saving ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3" style={{ borderColor: meta.color, borderTopColor: "transparent" }} />
            <p className="text-sm text-gray-500">Saving your results…</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border p-6 sm:p-8" style={{ borderColor: "#e5e7eb" }}>
            <p className="text-xs font-bold mb-4" style={{ color: meta.color }}>Question {current + 1}</p>
            <p className="text-base font-bold mb-6 leading-relaxed" style={{ color: "#0f1f3d" }}>{q.question}</p>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                let bg = "transparent";
                let border = "#e5e7eb";
                let color = "#374151";

                if (showFeedback) {
                  if (idx === q.correctAnswer) { bg = "rgba(45,138,78,0.08)"; border = "#2d8a4e"; color = "#166534"; }
                  else if (idx === selected && idx !== q.correctAnswer) { bg = "rgba(187,0,0,0.06)"; border = "#bb0000"; color = "#bb0000"; }
                } else if (idx === selected) {
                  bg = `${meta.color}10`; border = meta.color; color = "#0f1f3d";
                }

                return (
                  <button key={idx} onClick={() => handleSelect(idx)}
                    className="w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm transition-all"
                    style={{ backgroundColor: bg, borderColor: border, color, cursor: showFeedback ? "default" : "pointer" }}>
                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div className="mt-4 p-3 rounded-xl text-xs font-semibold"
                style={{ backgroundColor: isCorrect ? "rgba(45,138,78,0.08)" : "rgba(187,0,0,0.06)", color: isCorrect ? "#166534" : "#991b1b" }}>
                {isCorrect ? "✓ Correct!" : `✗ The correct answer is: ${q.options[q.correctAnswer]}`}
              </div>
            )}

            {!showFeedback && (
              <button onClick={handleNext}
                disabled={selected === null}
                className="w-full mt-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: meta.color }}>
                {current + 1 === questions.length ? "Submit Assessment" : "Next Question →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
