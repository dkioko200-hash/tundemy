export interface AssessmentRubricDimension {
  weight: number;
  description: string;
}

export interface AssessmentTrack {
  id: string;
  label: string;
  color: string;
  badge: string;
  passingScore: number;
  durationMinutes: number;
  minWords: number;
  maxWords: number;
  task: string;
  rubric: {
    relevance: AssessmentRubricDimension;
    technicalAccuracy: AssessmentRubricDimension;
    completeness: AssessmentRubricDimension;
    professionalQuality: AssessmentRubricDimension;
  };
}

export const ASSESSMENT_TRACKS: Record<string, AssessmentTrack> = {
  "track-1-ai-professional": {
    id: "track-1-ai-professional",
    label: "AI Professional",
    color: "#2d8a4e",
    badge: "AI Professional Badge",
    passingScore: 75,
    durationMinutes: 45,
    minWords: 200,
    maxWords: 800,
    task: "You are consulting for a Kenyan SME that sells second-hand electronics. Write a complete prompt system for a WhatsApp customer service bot that handles inquiries, complaints, and upsells. Include the system prompt, 3 example exchanges, and explain your design choices.",
    rubric: {
      relevance: { weight: 25, description: "Directly addresses the second-hand electronics SME WhatsApp bot scenario" },
      technicalAccuracy: { weight: 30, description: "The system prompt and example exchanges are realistic, well-structured, and would function as described" },
      completeness: { weight: 25, description: "Includes a system prompt, 3 example exchanges (inquiry, complaint, upsell), and design rationale" },
      professionalQuality: { weight: 20, description: "Clear, well-organised, professional writing with no major errors" },
    },
  },
  "track-2-ai-developer": {
    id: "track-2-ai-developer",
    label: "AI Developer",
    color: "#1a56db",
    badge: "AI Developer Badge",
    passingScore: 75,
    durationMinutes: 45,
    minWords: 200,
    maxWords: 800,
    task: "Write a Next.js API route that integrates M-Pesa Daraja STK Push to accept a payment. Include error handling, webhook verification, and explain how you would test it in sandbox mode.",
    rubric: {
      relevance: { weight: 25, description: "Directly addresses building a Daraja STK Push API route in Next.js" },
      technicalAccuracy: { weight: 30, description: "Code and explanation correctly reflect the Daraja STK Push flow, auth, and callback handling" },
      completeness: { weight: 25, description: "Covers the API route, error handling, webhook verification, and sandbox testing approach" },
      professionalQuality: { weight: 20, description: "Code is readable and the explanation is clear and well-organised" },
    },
  },
  "track-3-african-business-tech": {
    id: "track-3-african-business-tech",
    label: "African Business Tech",
    color: "#7e3af2",
    badge: "African Business Tech Badge",
    passingScore: 75,
    durationMinutes: 45,
    minWords: 200,
    maxWords: 800,
    task: "A smallholder maize farmer in Nakuru has shared 6 months of yield data. Describe the AI pipeline you would build to give them weekly actionable recommendations. Include data inputs, model choice, output format, and implementation challenges.",
    rubric: {
      relevance: { weight: 25, description: "Directly addresses the Nakuru smallholder maize farmer scenario" },
      technicalAccuracy: { weight: 30, description: "Proposed data inputs, model choice, and pipeline design are realistic and appropriate for the context" },
      completeness: { weight: 25, description: "Covers data inputs, model choice, output format, and implementation challenges" },
      professionalQuality: { weight: 20, description: "Clear, well-organised, professional writing with no major errors" },
    },
  },
  "track-4-global-ai-talent": {
    id: "track-4-global-ai-talent",
    label: "Global AI Talent",
    color: "#e3a008",
    badge: "Global AI Talent Badge",
    passingScore: 75,
    durationMinutes: 45,
    minWords: 200,
    maxWords: 800,
    task: "Design a RAG pipeline for a Kenyan legal aid organisation that needs to answer questions about Kenyan law from uploaded court documents. Include chunking strategy, embedding choice, retrieval approach, and how you would evaluate answer quality.",
    rubric: {
      relevance: { weight: 25, description: "Directly addresses the Kenyan legal aid RAG pipeline scenario" },
      technicalAccuracy: { weight: 30, description: "Chunking strategy, embedding choice, and retrieval approach are technically sound and appropriate" },
      completeness: { weight: 25, description: "Covers chunking, embeddings, retrieval, and answer-quality evaluation" },
      professionalQuality: { weight: 20, description: "Clear, well-organised, professional writing with no major errors" },
    },
  },
  "track-5-freelance-agency": {
    id: "track-5-freelance-agency",
    label: "Income Track",
    color: "#0f1f3d",
    badge: "Income Track Badge",
    passingScore: 75,
    durationMinutes: 45,
    minWords: 200,
    maxWords: 800,
    task: "Write a cold outreach email sequence (3 emails) targeting a US-based e-commerce brand offering AI-powered customer support automation. Include subject lines, personalisation strategy, objection handling, and pricing anchor.",
    rubric: {
      relevance: { weight: 25, description: "Directly addresses cold outreach to a US e-commerce brand for AI customer support automation" },
      technicalAccuracy: { weight: 30, description: "Email sequence structure, personalisation strategy, and pricing anchor reflect sound freelance sales practice" },
      completeness: { weight: 25, description: "Includes 3 emails with subject lines, personalisation, objection handling, and a pricing anchor" },
      professionalQuality: { weight: 20, description: "Clear, persuasive, professional writing with no major errors" },
    },
  },
};

export function getAssessmentTrack(track: string): AssessmentTrack | undefined {
  return ASSESSMENT_TRACKS[track];
}
