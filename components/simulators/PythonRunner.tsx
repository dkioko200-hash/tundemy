"use client";

import { useState, useRef, useCallback, useEffect } from "react";

// ── Pyodide types ──────────────────────────────────────────────────────────────

declare global {
  interface Window {
    loadPyodide: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

interface PyodideInterface {
  loadPackage: (pkgs: string | string[]) => Promise<void>;
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
}

// Singleton — one Pyodide instance shared across all PythonRunner mounts
let _pyodide: PyodideInterface | null = null;
let _loadPromise: Promise<PyodideInterface> | null = null;

async function ensurePyodide(
  onStep: (msg: string) => void
): Promise<PyodideInterface> {
  if (_pyodide) return _pyodide;
  if (_loadPromise) return _loadPromise;

  _loadPromise = (async () => {
    onStep("Loading Python runtime (first load ~15s)…");

    await new Promise<void>((resolve, reject) => {
      if (typeof window.loadPyodide === "function") { resolve(); return; }
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load Pyodide from CDN"));
      document.head.appendChild(s);
    });

    onStep("Starting Python interpreter…");
    const py = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
    });

    onStep("Installing pandas + numpy…");
    await py.loadPackage(["pandas", "numpy"]);

    onStep("Ready! ✓");
    _pyodide = py;
    return py;
  })();

  return _loadPromise;
}

// ── Variant definitions ────────────────────────────────────────────────────────

export type PythonRunnerVariant = "data-descriptive";

const KILIMA_CSV = `Date,Supermarket_Name,County,Product_Category,Units_Delivered,Revenue_KES,On_Time_Delivery,Spoilage_Units,Driver_ID
2024-01-02,Naivas Westlands,Nairobi,Vegetables,240,18500,Yes,8,D01
2024-01-02,Carrefour Thika Road,Nairobi,Fruits,180,14200,Yes,5,D02
2024-01-03,QuickMart Rongai,Nairobi,Dairy,150,9800,No,12,D03
2024-01-03,Cleanshelf Nakuru,Nakuru,Dry Goods,300,22100,Yes,0,D04
2024-01-04,Naivas Westlands,Nairobi,Fruits,210,16800,Yes,7,D01
2024-01-04,Tuskys Kiambu,Kiambu,Vegetables,180,12400,No,15,D05
2024-01-05,Carrefour Machakos,Machakos,Dairy,130,8900,Yes,9,D06
2024-01-05,Naivas Nakuru,Nakuru,Dry Goods,260,19500,Yes,0,D04
2024-01-06,QuickMart Karen,Nairobi,Vegetables,220,17200,Yes,6,D02
2024-01-07,Naivas Thika,Kiambu,Fruits,190,13800,No,11,D07
2024-01-08,Carrefour Thika Road,Nairobi,Dairy,160,10400,Yes,10,D02
2024-01-08,Naivas Nakuru,Nakuru,Dry Goods,270,19800,Yes,0,D04
2024-01-09,Cleanshelf Nakuru,Nakuru,Vegetables,200,14800,Yes,5,D08
2024-01-10,Naivas Westlands,Nairobi,Dry Goods,290,21800,Yes,0,D01
2024-01-11,QuickMart Rongai,Nairobi,Fruits,175,13900,No,14,D03
2024-01-12,Carrefour Machakos,Machakos,Vegetables,155,11000,No,12,D06
2024-01-14,Tuskys Kiambu,Kiambu,Dairy,125,7900,Yes,8,D05
2024-01-14,Carrefour Thika Road,Nairobi,Vegetables,255,19600,Yes,7,D02
2024-01-16,Naivas Nakuru,Nakuru,Fruits,175,13200,Yes,4,D04
2024-01-16,Naivas Westlands,Nairobi,Dairy,140,9200,No,11,D03
2024-01-18,QuickMart Karen,Nairobi,Dry Goods,310,23400,Yes,0,D01
2024-01-19,Naivas Thika,Kiambu,Dry Goods,220,16200,Yes,0,D07
2024-01-19,Carrefour Machakos,Machakos,Fruits,140,10200,No,9,D06
2024-01-20,Carrefour Thika Road,Nairobi,Fruits,195,15500,Yes,6,D02
2024-01-21,Cleanshelf Nakuru,Nakuru,Dairy,130,8400,No,7,D08
2024-01-22,Naivas Westlands,Nairobi,Vegetables,235,18100,Yes,8,D01
2024-01-24,Tuskys Kiambu,Kiambu,Vegetables,165,11300,No,13,D05
2024-01-24,QuickMart Rongai,Nairobi,Dairy,155,10100,No,13,D03
2024-01-26,Carrefour Machakos,Machakos,Dry Goods,190,14100,Yes,0,D06
2024-01-26,Naivas Nakuru,Nakuru,Vegetables,210,15500,Yes,6,D04
2024-01-28,Carrefour Thika Road,Nairobi,Dry Goods,280,21200,Yes,0,D02
2024-01-29,Naivas Thika,Kiambu,Fruits,175,12700,No,10,D07
2024-01-30,Naivas Westlands,Nairobi,Fruits,205,16300,Yes,7,D01
2024-01-31,Cleanshelf Nakuru,Nakuru,Dry Goods,275,20400,Yes,0,D08
2024-02-01,QuickMart Karen,Nairobi,Vegetables,250,19100,Yes,5,D02
2024-02-01,Carrefour Thika Road,Nairobi,Dairy,145,9400,No,11,D03
2024-02-02,Carrefour Machakos,Machakos,Dairy,125,8600,Yes,8,D06
2024-02-03,Tuskys Kiambu,Kiambu,Dairy,135,8600,Yes,9,D05
2024-02-05,Naivas Westlands,Nairobi,Fruits,185,14700,Yes,6,D01
2024-02-06,Naivas Nakuru,Nakuru,Fruits,165,12400,Yes,4,D04
2024-02-09,Naivas Thika,Kiambu,Dry Goods,200,14800,Yes,0,D07
2024-02-09,Carrefour Machakos,Machakos,Vegetables,148,10500,No,11,D06
2024-02-10,QuickMart Rongai,Nairobi,Dry Goods,295,22300,Yes,0,D02
2024-02-12,Cleanshelf Nakuru,Nakuru,Vegetables,195,14400,Yes,5,D08
2024-02-15,Tuskys Kiambu,Kiambu,Vegetables,158,10800,No,12,D05
2024-02-15,Carrefour Thika Road,Nairobi,Vegetables,265,20400,Yes,7,D01
2024-02-16,Carrefour Machakos,Machakos,Fruits,135,9800,No,8,D06
2024-02-18,Naivas Nakuru,Nakuru,Dairy,120,7800,No,8,D04
2024-02-20,Naivas Westlands,Nairobi,Dairy,170,11100,No,14,D03
2024-02-22,Naivas Thika,Kiambu,Fruits,168,12200,No,9,D07
2024-02-23,Carrefour Machakos,Machakos,Dry Goods,180,13300,Yes,0,D06
2024-02-24,Cleanshelf Nakuru,Nakuru,Dry Goods,255,18900,Yes,0,D08
2024-02-25,QuickMart Karen,Nairobi,Fruits,190,15100,Yes,5,D02
2024-03-01,Carrefour Thika Road,Nairobi,Vegetables,245,18800,Yes,8,D01
2024-03-01,Tuskys Kiambu,Kiambu,Dairy,142,9000,Yes,8,D05
2024-03-01,Carrefour Machakos,Machakos,Vegetables,160,11400,Yes,10,D06
2024-03-02,Naivas Nakuru,Nakuru,Fruits,170,12700,Yes,4,D04
2024-03-05,Naivas Westlands,Nairobi,Dry Goods,305,23000,Yes,0,D02
2024-03-08,Naivas Thika,Kiambu,Dry Goods,195,14400,Yes,0,D07
2024-03-08,Cleanshelf Nakuru,Nakuru,Vegetables,205,15100,Yes,6,D08
2024-03-14,Naivas Nakuru,Nakuru,Dry Goods,270,20000,Yes,0,D04`;

const STARTER_CODE: Record<PythonRunnerVariant, string> = {
  "data-descriptive": `import pandas as pd
import numpy as np
from io import StringIO

# Kilima Fresh Ltd — Q1 2024 Delivery Sample (60 records)
# This is a representative sample; the full dataset has 3,200 records
CSV_DATA = """${KILIMA_CSV}"""

df = pd.read_csv(StringIO(CSV_DATA))
print(f"Dataset: {len(df)} records, {df.shape[1]} columns")
print("Columns:", df.columns.tolist())
print()

# ── TASK 1: Revenue Breakdown ───────────────────────────────────────────
print("=== TASK 1: Revenue Breakdown ===")
total = df["Revenue_KES"].sum()
print(f"Total Q1 Revenue: KSh {total:,.0f}")

county_rev = df.groupby("County")["Revenue_KES"].sum().sort_values(ascending=False)
print("\\nRevenue by County:")
for county, rev in county_rev.items():
    pct = rev / total * 100
    print(f"  {county}: KSh {rev:,.0f} ({pct:.1f}%)")

cat_avg = df.groupby("Product_Category")["Revenue_KES"].mean().sort_values(ascending=False)
print("\\nAverage Revenue per Delivery by Category:")
for cat, avg in cat_avg.items():
    print(f"  {cat}: KSh {avg:,.0f}")

# ── TASK 2: On-Time Delivery ────────────────────────────────────────────
print("\\n=== TASK 2: On-Time Delivery ===")
overall_ot = (df["On_Time_Delivery"] == "Yes").mean() * 100
print(f"Overall on-time rate: {overall_ot:.1f}%")

county_ot = df.groupby("County")["On_Time_Delivery"].apply(
    lambda x: (x == "Yes").mean() * 100
).sort_values()
print("\\nOn-Time Rate by County:")
for county, rate in county_ot.items():
    print(f"  {county}: {rate:.1f}%")

# ── TASK 3: Spoilage Analysis ───────────────────────────────────────────
print("\\n=== TASK 3: Spoilage Analysis ===")
total_units = df["Units_Delivered"].sum()
total_spoil = df["Spoilage_Units"].sum()
spoil_rate = total_spoil / total_units * 100
print(f"Overall spoilage rate: {spoil_rate:.2f}%")

cat_spoil = df.groupby("Product_Category").apply(
    lambda x: x["Spoilage_Units"].sum() / x["Units_Delivered"].sum() * 100
).sort_values(ascending=False)
print("\\nSpoilage Rate by Category:")
for cat, rate in cat_spoil.items():
    print(f"  {cat}: {rate:.2f}%")

# ── TASK 4: Driver Performance ──────────────────────────────────────────
print("\\n=== TASK 4: Driver Performance ===")
driver_ot = df.groupby("Driver_ID")["On_Time_Delivery"].apply(
    lambda x: (x == "Yes").mean() * 100
).sort_values()
print("On-Time Rate by Driver:")
for driver, rate in driver_ot.items():
    deliveries = df[df["Driver_ID"] == driver].shape[0]
    print(f"  {driver}: {rate:.1f}% ({deliveries} deliveries)")

print("\\n=== DONE — Add your own analysis below! ===")
`,
};

const CONTEXT: Record<PythonRunnerVariant, { title: string; body: string; bullets: string[] }> = {
  "data-descriptive": {
    title: "What you are building: Live descriptive analysis on Kilima Fresh Q1 data",
    body: "The code below runs real pandas on a 60-record sample of Kilima Fresh Ltd.'s Q1 2024 delivery data. Run it, read the output, then extend it to answer additional business questions. The full production dataset has 3,200 records — the patterns you find in this sample represent the same analysis you would do at scale.",
    bullets: [
      "pandas groupby() is the core tool for every count/average/breakdown by category",
      "Always sort your output (.sort_values()) so the highest/lowest are immediately visible",
      "Spoilage rate = Spoilage_Units / Units_Delivered × 100 — a ratio, not an absolute number",
    ],
  },
};

// ── Types ──────────────────────────────────────────────────────────────────────

interface OutputLine {
  type: "stdout" | "stderr" | "info" | "error";
  text: string;
}

interface GradeResult {
  score: number;
  passed: boolean;
  feedback: string;
  rubricScores?: { criterion: string; score: number; max: number; comment: string }[];
  didWell?: string[];
  improvements?: { area: string; missing: string; whyMatters: string; betterExample: string }[];
  specificFixes?: string[];
}

// ── Loading indicator ──────────────────────────────────────────────────────────

function PyodideLoader({ step, onStart }: { step: string; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: "#0f1f3d" }}>
        🐍
      </div>
      <div>
        <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>Python Runner</p>
        <p className="text-xs text-gray-500 mt-1">Powered by Pyodide (Python in your browser)</p>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span className="w-4 h-4 border-2 border-[#2d8a4e] border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs">{step || "Initializing…"}</span>
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 max-w-xs">
        <p className="text-amber-800 text-xs">First load downloads ~15MB of Python packages. This takes 10–30s on a slow connection. Subsequent loads are instant (cached).</p>
      </div>
      <button
        onClick={onStart}
        className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition hover:opacity-90"
        style={{ backgroundColor: "#2d8a4e" }}
      >
        Load Python Environment
      </button>
    </div>
  );
}

// ── Output panel ───────────────────────────────────────────────────────────────

function OutputPanel({ lines, elapsed }: { lines: OutputLine[]; elapsed: number | null }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  if (lines.length === 0) {
    return (
      <div className="flex-1 rounded-xl bg-[#0d1a2e] p-4 flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500 text-xs font-mono">Output appears here when you run the code ▶</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex-1 rounded-xl bg-[#0d1a2e] p-4 overflow-y-auto font-mono text-xs leading-relaxed" style={{ minHeight: "200px", maxHeight: "420px" }}>
      {elapsed !== null && (
        <div className="text-gray-500 text-[10px] mb-2">Executed in {elapsed}ms</div>
      )}
      {lines.map((l, i) => (
        <div key={i} className="whitespace-pre-wrap break-all"
          style={{
            color: l.type === "stdout" ? "#86efac" :
                   l.type === "stderr" || l.type === "error" ? "#fca5a5" :
                   "#9ca3af",
          }}>
          {l.text}
        </div>
      ))}
    </div>
  );
}

// ── Grade result ───────────────────────────────────────────────────────────────

function GradeResultDisplay({ result, onRetry, onNext }: {
  result: GradeResult;
  onRetry?: () => void;
  onNext?: () => void;
}) {
  const passed = result.passed ?? result.score >= 80;
  const color = passed ? "#2d8a4e" : "#bb0000";
  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-5 text-center border-2" style={{ borderColor: color, backgroundColor: `${color}08` }}>
        <div className="text-5xl font-black" style={{ color }}>{result.score}</div>
        <div className="text-gray-400 text-xs mt-1">out of 100</div>
        <div className="mt-2 font-bold text-sm" style={{ color }}>{passed ? "Passed — great work!" : "Score 80+ to continue"}</div>
      </div>
      {result.feedback && <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed">{result.feedback}</p>}
      {result.didWell && result.didWell.length > 0 && (
        <div className="rounded-xl p-4 border border-green-200 bg-green-50 space-y-2">
          <p className="text-xs font-bold text-green-700 uppercase tracking-wide">What you did well</p>
          {result.didWell.map((w, i) => (
            <p key={i} className="text-sm text-green-800 flex items-start gap-2"><span>✓</span><span>{w}</span></p>
          ))}
        </div>
      )}
      {!passed && result.improvements && result.improvements.length > 0 && (
        <div className="space-y-3">
          {result.improvements.map((imp, i) => (
            <div key={i} className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-4">
              <p className="text-xs font-bold text-amber-800 mb-1">{imp.area}</p>
              <p className="text-xs text-amber-700"><span className="font-semibold">Missing: </span>{imp.missing}</p>
              <p className="text-xs text-amber-700 mt-1"><span className="font-semibold">Why it matters: </span>{imp.whyMatters}</p>
              <p className="text-xs text-gray-600 mt-1 italic">{imp.betterExample}</p>
            </div>
          ))}
        </div>
      )}
      {!passed && result.specificFixes && result.specificFixes.length > 0 && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-2">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Specific fixes</p>
          <ol className="space-y-1.5">
            {result.specificFixes.map((fix, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#0f1f3d] text-white flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                <span>{fix}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="flex gap-3">
        {passed && onNext && (
          <button onClick={onNext} className="flex-1 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: "#2d8a4e" }}>
            Next Lesson →
          </button>
        )}
        {!passed && onRetry && (
          <button onClick={onRetry} className="flex-1 py-3 rounded-xl text-sm font-bold border-2 hover:bg-gray-50" style={{ borderColor: "#0f1f3d", color: "#0f1f3d" }}>
            Revise and Resubmit
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function PythonRunnerSandbox({
  variant,
  sandboxTask,
  lessonNumber,
  courseSlug,
  onComplete,
}: {
  variant: PythonRunnerVariant;
  sandboxTask: string;
  lessonNumber: number;
  courseSlug: string;
  onComplete: () => void;
}) {
  const ctx = CONTEXT[variant];
  const defaultCode = STARTER_CODE[variant];

  const [pyStatus, setPyStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [pyStep, setPyStep] = useState("");
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [runCount, setRunCount] = useState(0);

  const [reflection, setReflection] = useState("");
  const [grading, setGrading] = useState(false);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);

  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length;
  const minWords = 60;

  const initPyodide = useCallback(async () => {
    setPyStatus("loading");
    try {
      await ensurePyodide((msg) => setPyStep(msg));
      setPyStatus("ready");
    } catch (err) {
      setPyStatus("error");
      setPyStep(err instanceof Error ? err.message : "Failed to load Python");
    }
  }, []);

  // If Pyodide was loaded by a prior mount, reflect that
  useEffect(() => {
    if (_pyodide) setPyStatus("ready");
  }, []);

  const runCode = useCallback(async () => {
    const py = _pyodide;
    if (!py || running) return;

    setRunning(true);
    setElapsed(null);
    setOutput([{ type: "info", text: `▶ Running… (${new Date().toLocaleTimeString()})` }]);

    const lines: OutputLine[] = [{ type: "info", text: `▶ Running… (${new Date().toLocaleTimeString()})` }];
    const addLine = (type: OutputLine["type"], text: string) => {
      lines.push({ type, text });
      setOutput([...lines]);
    };

    py.setStdout({ batched: (s) => addLine("stdout", s) });
    py.setStderr({ batched: (s) => addLine("stderr", s) });

    const t0 = Date.now();
    try {
      await py.runPythonAsync(code);
      const ms = Date.now() - t0;
      setElapsed(ms);
      addLine("info", `✓ Completed in ${ms}ms`);
      setHasRun(true);
      setRunCount((n) => n + 1);
    } catch (err) {
      const ms = Date.now() - t0;
      setElapsed(ms);
      const msg = err instanceof Error ? err.message : String(err);
      addLine("error", `✕ ${msg}`);
    } finally {
      setRunning(false);
    }
  }, [code, running]);

  const resetCode = () => {
    setCode(defaultCode);
    setOutput([]);
    setElapsed(null);
  };

  const handleGrade = async () => {
    setGrading(true);
    setGradeError(null);
    try {
      // Include the output the student got as part of the submission context
      const outputText = output
        .filter((l) => l.type === "stdout")
        .map((l) => l.text)
        .join("\n")
        .slice(0, 2000); // cap at 2000 chars

      const fullSubmission = `Code Output (what their script produced):\n${outputText}\n\n---\n\nStudent Reflection:\n${reflection}`;

      const res = await fetch("/api/grade-sandbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          lessonNumber,
          sandboxTask,
          submission: fullSubmission,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grading failed");
      setGradeResult(data as GradeResult);
    } catch (err) {
      setGradeError(err instanceof Error ? err.message : "Grading failed. Please try again.");
    } finally {
      setGrading(false);
    }
  };

  const handleRetry = () => {
    setGradeResult(null);
    setReflection("");
    setGradeError(null);
  };

  if (gradeResult) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl p-4 border border-[#2d8a4e]/20 bg-[#2d8a4e]/05">
          <p className="text-xs font-bold text-[#2d8a4e] uppercase tracking-wide mb-1">Python Runner</p>
          <p className="text-xs text-gray-500">Lesson {lessonNumber} — {ctx.title}</p>
        </div>
        <GradeResultDisplay
          result={gradeResult}
          onRetry={gradeResult.passed ? undefined : handleRetry}
          onNext={gradeResult.passed ? onComplete : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Context panel */}
      <div className="rounded-2xl border-2 border-[#2d8a4e]/30 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🐍</span>
          <h3 className="text-sm font-bold" style={{ color: "#0f1f3d" }}>{ctx.title}</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{ctx.body}</p>
        <ul className="space-y-1">
          {ctx.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
              <span className="text-[#2d8a4e] mt-0.5">•</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Python environment gate */}
      {pyStatus === "idle" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <PyodideLoader step={pyStep} onStart={initPyodide} />
        </div>
      )}

      {pyStatus === "loading" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center space-y-3">
          <div className="w-10 h-10 border-3 border-[#2d8a4e] border-t-transparent rounded-full animate-spin mx-auto" style={{ borderWidth: "3px" }} />
          <p className="text-sm font-semibold text-gray-700 font-mono">{pyStep}</p>
          <p className="text-xs text-gray-400">Python is loading in your browser — no server needed</p>
        </div>
      )}

      {pyStatus === "error" && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-5">
          <p className="text-red-700 font-semibold text-sm">❌ Python failed to load</p>
          <p className="text-red-600 text-xs mt-1 font-mono">{pyStep}</p>
          <button onClick={initPyodide} className="mt-3 px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700">
            Retry
          </button>
        </div>
      )}

      {pyStatus === "ready" && (
        <>
          {/* Code editor */}
          <div className="rounded-2xl overflow-hidden border border-[#0f1f3d]/15 shadow-sm">
            {/* Editor header */}
            <div className="bg-[#0f1f3d] px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {["#ff5f57", "#ffbd2e", "#28ca41"].map((c) => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <span className="text-gray-400 text-[11px] font-mono">kilima_fresh_analysis.py</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-green-400 font-mono">🐍 pandas {runCount > 0 ? `· run ${runCount}×` : ""}</span>
                <button
                  onClick={resetCode}
                  className="text-gray-500 hover:text-gray-300 text-[10px] px-2 py-0.5 rounded border border-gray-600 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Code textarea */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full bg-[#0d1a2e] text-blue-100 text-[11.5px] font-mono p-4 resize-none outline-none leading-relaxed"
              style={{ minHeight: "420px", tabSize: 4 }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const start = e.currentTarget.selectionStart;
                  const end = e.currentTarget.selectionEnd;
                  const newCode = code.slice(0, start) + "    " + code.slice(end);
                  setCode(newCode);
                  setTimeout(() => {
                    e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
                  }, 0);
                }
              }}
            />

            {/* Run bar */}
            <div className="bg-[#0f1f3d]/90 px-4 py-2.5 flex items-center justify-between">
              <p className="text-[10px] text-gray-500">Tab = 4 spaces · Ctrl+Enter to run</p>
              <button
                onClick={runCode}
                disabled={running}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#2d8a4e" }}
              >
                {running ? (
                  <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Running…</>
                ) : "▶ Run"}
              </button>
            </div>
          </div>

          {/* Keyboard shortcut handler */}
          <div
            tabIndex={-1}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") runCode();
            }}
            className="outline-none"
          />

          {/* Output panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Output</p>
              {output.length > 0 && (
                <button
                  onClick={() => { setOutput([]); setElapsed(null); }}
                  className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <OutputPanel lines={output} elapsed={elapsed} />
          </div>
        </>
      )}

      {/* Reflection + grading — unlocked after first run */}
      <div className="rounded-2xl border-2 border-[#0f1f3d]/15 bg-white p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-lg">✍️</span>
          <div>
            <p className="text-sm font-bold" style={{ color: "#0f1f3d" }}>
              {hasRun ? "Write your reflection (graded by Claude)" : "Run the code above first, then write your reflection"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {hasRun ? "Reference specific numbers from your output. Exact figures score higher than general descriptions." : "Click ▶ Run to execute the starter code and see the output."}
            </p>
          </div>
        </div>

        <div className="bg-[#0f1f3d] rounded-xl p-4 mb-4">
          <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">Your Task</p>
          <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{sandboxTask}</p>
        </div>

        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="Write your answers here. Quote specific numbers from your output — e.g. 'Nairobi generated KSh X,XXX,XXX (XX% of total), while Machakos generated KSh Y,YYY,YYY'. Exact numbers from your pandas output score higher than estimated figures."
          rows={10}
          disabled={!hasRun}
          className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          style={{ ["--tw-ring-color" as string]: "#2d8a4e" }}
          onFocus={(e) => { if (hasRun) e.currentTarget.style.borderColor = "#2d8a4e"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; }}
        />

        <div className="flex items-center justify-between mt-2 mb-4">
          <p className={`text-xs font-medium ${wordCount >= minWords ? "text-[#2d8a4e]" : "text-gray-400"}`}>
            {wordCount} words {wordCount >= minWords ? "✓" : `(min ${minWords})`}
          </p>
          {hasRun && (
            <p className="text-xs text-gray-400">Code run {runCount}× — output included in grading</p>
          )}
        </div>

        {gradeError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
            <p className="text-red-700 text-sm">{gradeError}</p>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
          <p className="text-amber-800 text-xs">
            Graded by Claude AI on depth, specificity, data accuracy, and business insight. Score 80+ to pass. Max 3 attempts per 24 hours.
          </p>
        </div>

        <button
          onClick={handleGrade}
          disabled={!hasRun || wordCount < minWords || grading}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: "#0f1f3d" }}
        >
          {grading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Grading with Claude AI…</>
          ) : "Submit Reflection for Grading"}
        </button>
      </div>
    </div>
  );
}
