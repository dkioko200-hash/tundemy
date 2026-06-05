# Tundemy Autonomous Build Agent

## Project
Tundemy — AI skills platform for Africa
Stack: Next.js 16, TypeScript, Tailwind, Supabase, Pesapal
Repo: https://github.com/dkioko200-hash/tundemy.git

## Rules
- Never ask for confirmation — decide and proceed
- After every task: npx tsc --noEmit, fix all errors, then git add -A && git commit -m "feat: [task]" && git push
- Never break existing functionality — read files before editing
- Never commit .env.local
- All examples must use Kenyan/African business context
- All sandbox tasks must work inside the platform — never send users outside

## Build queue — work through in order

### BLOCK 1 — Course content
- [DONE] ai-data-analysis: write all 7 lessons full theory quizzes sandboxes Kenyan data context
- [DONE] whatsapp-ai-integration: write all 8 lessons with real Meta Cloud API code examples
- [DONE] mpesa-daraja-api: write all 9 lessons with real Daraja API code
- [DONE] ai-agriculture: write all 6 lessons with Kenyan agricultural context
- [DONE] ai-evaluation-engineering: write all 7 lessons red-teaming RLHF evaluation
- [DONE] rag-ai-engineering: write all 7 lessons vector databases RAG pipelines
- [DONE] freelancing-with-ai: write all 6 lessons Upwork proposals pricing
- [DONE] selling-to-western-clients: write all 6 lessons Western client positioning

### BLOCK 2 — Talent pool and assessments
- [DONE] Build app/talent/page.tsx public talent pool with filters
- [DONE] Build app/talent/[userId]/page.tsx individual candidate profile
- [DONE] Build app/assessment/[track]/page.tsx certification assessment with 15 questions per track
- [DONE] Build employer dashboard at app/employer/dashboard/page.tsx
- [DONE] Build contact request system between employers and candidates
- [DONE] Build certificate PDF generation on course completion

### BLOCK 3 — Platform fixes
- [DONE] Fix homepage to show all 10 courses with correct slugs and track badges
- [DONE] Fix enrollment flow end to end — payment to course access to dashboard
- [DONE] Fix mobile responsiveness on all pages
- [DONE] Build 404 and error pages

## How to work
1. Read this file
2. Find first unchecked item
3. Read relevant existing files first
4. Build it completely
5. npx tsc --noEmit — fix all errors
6. git add -A && git commit -m "feat: [task]" && git push
7. Mark task [DONE] in this file
8. Move to next task immediately
