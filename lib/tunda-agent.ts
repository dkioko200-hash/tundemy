/**
 * Tunda Autonomous Agent
 *
 * Pipeline (runs every 2 hours via Vercel cron):
 *   1. Ticket sweep   — pull open/escalated tickets, run autofix on each
 *   2. Health checks  — hit key API routes, flag 5xx / timeouts
 *   3. Pattern analysis — Claude scans ticket patterns for recurring code bugs
 *   4. Code fix       — if HIGH confidence bug found + GITHUB_TOKEN set,
 *                        read file → Claude writes fix → commit via GitHub API
 *   5. Email report   — summary to admin via Resend
 *
 * Required env vars (add to Vercel):
 *   TUNDA_AUTOFIX_MODE=live          (default: shadow — set to live to write fixes)
 *   GITHUB_TOKEN                     (PAT with repo write scope)
 *   TUNDA_AGENT_SECRET               (used to authorize manual/webhook triggers)
 *   CRON_SECRET                      (used by Vercel cron Authorization header)
 */

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { runAutoFix, type Ticket } from "./tunda-autofix";

const GITHUB_OWNER = "dkioko200-hash";
const GITHUB_REPO = "tundemy";
const GITHUB_BRANCH = "master";
const ADMIN_EMAIL = process.env.SUPPORT_ADMIN_EMAIL ?? "d.kioko200@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tundemy.com";

// ── GitHub API helpers ────────────────────────────────────────────────────────

interface GithubFile {
  content: string; // base64
  sha: string;
  name: string;
  path: string;
}

async function githubGetFile(path: string, token: string): Promise<GithubFile> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" } }
  );
  if (!res.ok) throw new Error(`GitHub GET ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

async function githubCommitFile(
  path: string,
  newContent: string,
  sha: string,
  commitMessage: string,
  token: string
): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(newContent, "utf-8").toString("base64"),
        sha,
        branch: GITHUB_BRANCH,
      }),
    }
  );
  if (!res.ok) throw new Error(`GitHub PUT ${path}: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return (data.commit?.sha as string) ?? "";
}

// ── Claude helpers ────────────────────────────────────────────────────────────

async function askClaude(system: string, user: string, maxTokens = 2000): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data?.content?.[0]?.text as string) ?? "";
}

// ── Ticket pattern analysis ───────────────────────────────────────────────────

export interface TicketPattern {
  hasBug: boolean;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  bugDescription: string;
  suspectedFile: string | null; // repo-relative, e.g. "app/api/grade-sandbox/route.ts"
  suggestedFix: string | null;
  affectedUserCount: number;
}

async function analyzeTicketPatterns(tickets: Ticket[]): Promise<TicketPattern> {
  const ticketText = tickets
    .slice(0, 20)
    .map((t) => `[${t.id}] ${t.issue_summary ?? "(no summary)"}`)
    .join("\n");

  const raw = await askClaude(
    `You are Tunda, the autonomous engineering agent for Tundemy — a Next.js 16 TypeScript + Supabase + Pesapal platform.

Your job: analyze support tickets for recurring code bugs that can be fixed surgically.

Key source files (repo-relative paths):
- app/api/grade-sandbox/route.ts
- app/api/grade-capstone/route.ts
- app/api/pesapal/ipn/route.ts
- app/api/pesapal/initiate/route.ts
- lib/enrollment.ts
- lib/tunda-autofix.ts
- app/api/support/chat/route.ts

Respond ONLY with valid JSON — no markdown, no explanation:
{
  "hasBug": boolean,
  "confidence": "HIGH" | "MEDIUM" | "LOW",
  "bugDescription": "one-line description or empty string",
  "suspectedFile": "repo-relative path or null",
  "suggestedFix": "concise description of the fix or null",
  "affectedUserCount": number
}

Rules:
- Only set hasBug=true if multiple tickets report the same reproducible error
- Only set confidence=HIGH if the bug is clearly identifiable and the fix is safe
- suspectedFile must be one of the listed files or null
- Never suggest changes to auth or payment logic unless absolutely certain`,
    `Support tickets:\n${ticketText}`
  );

  try {
    const match = raw.match(/\{[\s\S]+?\}/);
    if (match) return JSON.parse(match[0]) as TicketPattern;
  } catch {}

  return {
    hasBug: false,
    confidence: "LOW",
    bugDescription: "",
    suspectedFile: null,
    suggestedFix: null,
    affectedUserCount: 0,
  };
}

// ── Code fix ──────────────────────────────────────────────────────────────────

export interface CodeFixResult {
  attempted: boolean;
  success: boolean;
  filePath?: string;
  commitSha?: string;
  detail: string;
}

async function attemptCodeFix(pattern: TicketPattern, githubToken: string): Promise<CodeFixResult> {
  if (!pattern.hasBug || pattern.confidence !== "HIGH" || !pattern.suspectedFile) {
    return {
      attempted: false,
      success: false,
      detail: `Skipped — confidence: ${pattern.confidence}, hasBug: ${pattern.hasBug}, file: ${pattern.suspectedFile ?? "none"}`,
    };
  }

  // Read the file from GitHub
  let fileData: GithubFile;
  try {
    fileData = await githubGetFile(pattern.suspectedFile, githubToken);
  } catch (err) {
    return { attempted: true, success: false, detail: `GitHub read failed: ${err instanceof Error ? err.message : String(err)}` };
  }

  const currentContent = Buffer.from(fileData.content, "base64").toString("utf-8");

  // Ask Claude to write the fix
  const fixedContent = await askClaude(
    `You are an expert Next.js 16 TypeScript engineer making a surgical production fix.

Rules:
- Return ONLY the complete fixed file — raw TypeScript, no markdown fences
- Change the absolute minimum to fix the bug
- Never change auth, payment processing, or data-deletion logic unless that IS the bug
- Preserve all existing imports, exports, and types
- The fix must be backwards-compatible`,
    `Bug: ${pattern.bugDescription}\nFix approach: ${pattern.suggestedFix ?? "apply minimal fix"}\n\nFile: ${pattern.suspectedFile}\n\`\`\`typescript\n${currentContent}\n\`\`\``,
    4000
  );

  if (!fixedContent.trim() || fixedContent.trim() === currentContent.trim()) {
    return { attempted: true, success: false, detail: "Claude returned identical content — no change committed" };
  }

  // Commit via GitHub API
  try {
    const commitSha = await githubCommitFile(
      pattern.suspectedFile,
      fixedContent,
      fileData.sha,
      `fix: [tunda-agent] ${pattern.bugDescription.slice(0, 70)}`,
      githubToken
    );
    return {
      attempted: true,
      success: true,
      filePath: pattern.suspectedFile,
      commitSha,
      detail: `Committed to ${pattern.suspectedFile} — Vercel will auto-deploy`,
    };
  } catch (err) {
    return {
      attempted: true,
      success: false,
      detail: `Commit failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

// ── Platform health checks ────────────────────────────────────────────────────

export interface HealthResult {
  name: string;
  ok: boolean;
  status?: number;
  latencyMs?: number;
  error?: string;
}

const HEALTH_ENDPOINTS: { name: string; path: string; method: string; body?: object }[] = [
  { name: "Homepage", path: "/", method: "GET" },
  {
    name: "Support chat API",
    path: "/api/support/chat",
    method: "POST",
    body: { message: "ping", conversationHistory: [] },
  },
];

async function runHealthChecks(): Promise<HealthResult[]> {
  const results: HealthResult[] = [];

  for (const ep of HEALTH_ENDPOINTS) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${APP_URL}${ep.path}`, {
        method: ep.method,
        headers: { "Content-Type": "application/json", "x-tunda-health": "1" },
        body: ep.method === "POST" && ep.body ? JSON.stringify(ep.body) : undefined,
        signal: AbortSignal.timeout(10_000),
      });
      results.push({ name: ep.name, ok: res.status < 500, status: res.status, latencyMs: Date.now() - t0 });
    } catch (err) {
      results.push({ name: ep.name, ok: false, latencyMs: Date.now() - t0, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return results;
}

// ── Email report ──────────────────────────────────────────────────────────────

async function sendAgentReport(report: AgentReport): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const fixed = report.ticketResults.filter((r) => r === "fixed" || r === "would_fix").length;
  const escalated = report.ticketResults.filter((r) => r === "escalated" || r === "failed").length;
  const failedHealth = report.health.filter((h) => !h.ok);
  const nairobi = new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "medium", timeStyle: "short" });

  const rows = (label: string, items: string[]) =>
    items.length ? `<tr><td style="padding:6px 12px;color:#6b7280">${label}</td><td style="padding:6px 12px">${items.join(", ")}</td></tr>` : "";

  const html = `
<div style="font-family:Inter,Arial,sans-serif;max-width:620px;padding:28px;color:#111827">
  <h2 style="color:#0f1f3d;margin-top:0">🤖 Tunda Agent Report</h2>
  <p style="color:#6b7280;margin-top:0">${nairobi} · Tundemy Autonomous Agent</p>

  <h3 style="color:#0f1f3d">Support Tickets</h3>
  <table style="border-collapse:collapse;width:100%;font-size:14px">
    ${rows("Processed", [`${report.ticketsProcessed}`])}
    ${rows("Auto-fixed", [`${fixed}`])}
    ${rows("Escalated / failed", [`${escalated}`])}
  </table>

  <h3 style="color:#0f1f3d">Platform Health</h3>
  ${report.health.map((h) => `<p style="margin:4px 0">${h.ok ? "✅" : "❌"} <strong>${h.name}</strong>${h.status ? ` — ${h.status}` : ""}${h.latencyMs !== undefined ? ` (${h.latencyMs}ms)` : ""}${h.error ? ` — ${h.error}` : ""}</p>`).join("")}

  ${
    report.pattern?.hasBug
      ? `
  <h3 style="color:#0f1f3d">Bug Pattern Detected</h3>
  <p><strong>Confidence:</strong> ${report.pattern.confidence}</p>
  <p><strong>Description:</strong> ${report.pattern.bugDescription}</p>
  <p><strong>Suspected file:</strong> ${report.pattern.suspectedFile ?? "unknown"}</p>
  <p><strong>Suggested fix:</strong> ${report.pattern.suggestedFix ?? "—"}</p>`
      : ""
  }

  ${
    report.codeFix
      ? `
  <h3 style="color:#0f1f3d">Code Fix</h3>
  <p>Attempted: ${report.codeFix.attempted ? "Yes" : "No"}</p>
  <p>Result: ${report.codeFix.success ? "✅ Committed and deploying" : "❌ Not committed"}</p>
  <p>Detail: ${report.codeFix.detail}</p>
  ${report.codeFix.commitSha ? `<p><a href="https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/commit/${report.codeFix.commitSha}" style="color:#2d8a4e">View commit → ${report.codeFix.commitSha.slice(0, 7)}</a></p>` : ""}`
      : ""
  }

  ${failedHealth.length > 0 ? `<p style="background:#fef2f2;padding:12px;border-radius:6px;color:#dc2626">⚠️ ${failedHealth.length} health check(s) failed — may need manual review at <a href="${APP_URL}" style="color:#dc2626">tundemy.com</a></p>` : ""}

  <p style="font-size:12px;color:#9ca3af;margin-top:24px">Tunda Autonomous Agent · <a href="${APP_URL}" style="color:#9ca3af">tundemy.com</a></p>
</div>`;

  try {
    await new Resend(resendKey).emails.send({
      from: "Tunda Agent <notifications@tundemy.com>",
      to: ADMIN_EMAIL,
      subject: `Tunda: ${fixed} fixed · ${failedHealth.length} health issues · ${nairobi}`,
      html,
    });
  } catch (err) {
    console.error("[tunda-agent] email report failed:", err);
  }
}

// ── Main agent run ────────────────────────────────────────────────────────────

export interface AgentReport {
  ticketsProcessed: number;
  ticketResults: string[];
  health: HealthResult[];
  pattern?: TicketPattern;
  codeFix?: CodeFixResult;
  durationMs: number;
}

export async function runTundaAgent(): Promise<AgentReport> {
  const t0 = Date.now();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const report: AgentReport = {
    ticketsProcessed: 0,
    ticketResults: [],
    health: [],
    durationMs: 0,
  };

  // ── Step 1: Ticket sweep ────────────────────────────────────────────────────
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select("id, user_id, user_email, conversation, issue_summary, status")
    .in("status", ["open", "escalated"])
    .order("created_at", { ascending: true })
    .limit(50);

  report.ticketsProcessed = (tickets ?? []).length;

  for (const ticket of (tickets ?? []) as Ticket[]) {
    try {
      const result = await runAutoFix(ticket);
      report.ticketResults.push(result.outcome);
    } catch (err) {
      console.error(`[tunda-agent] autofix failed for ticket ${ticket.id}:`, err);
      report.ticketResults.push("failed");
    }
  }

  // ── Step 2: Health checks ───────────────────────────────────────────────────
  try {
    report.health = await runHealthChecks();
  } catch (err) {
    console.error("[tunda-agent] health checks failed:", err);
  }

  // ── Step 3: Pattern analysis ────────────────────────────────────────────────
  const openTickets = (tickets ?? []).filter((t) =>
    ["open", "escalated"].includes((t as Ticket).status)
  ) as Ticket[];

  if (openTickets.length >= 2) {
    try {
      report.pattern = await analyzeTicketPatterns(openTickets);
    } catch (err) {
      console.error("[tunda-agent] pattern analysis failed:", err);
    }
  }

  // ── Step 4: Code fix (HIGH confidence + GITHUB_TOKEN required) ─────────────
  const githubToken = process.env.GITHUB_TOKEN;
  if (githubToken && report.pattern) {
    try {
      report.codeFix = await attemptCodeFix(report.pattern, githubToken);
      if (report.codeFix.success) {
        console.log("[tunda-agent] code fix committed:", report.codeFix.commitSha);
      }
    } catch (err) {
      report.codeFix = {
        attempted: true,
        success: false,
        detail: `Agent error: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  // ── Step 5: Email report ────────────────────────────────────────────────────
  report.durationMs = Date.now() - t0;
  try {
    await sendAgentReport(report);
  } catch (err) {
    console.error("[tunda-agent] report email failed:", err);
  }

  return report;
}
