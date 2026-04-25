import React, { useState, useRef } from "react";
import { Play, RotateCcw, MessageSquare, Brain, CheckCircle2, Database, ShoppingCart, Utensils } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEMO = {
  customer: { name: "אורי לוי", id: "CUST-8821", phone: "053-7741882" },
  ticket_id: "ZD-91233",
  complaint: "הזמנתי אדממה וקיבלתי אותו קר לחלוטין. אני דורש החזר כספי מיידי!",
  analysis: {
    action_code: "EDAMAME_COLD_PACKING",
    golden_line: "לארוז אדממה בשקית מבודדת חום, בנפרד מהמנות הקרות",
    evidence: "הזמנתי אדממה וקיבלתי אותו קר לחלוטין. אני דורש החזר כספי מיידי!",
    reasoning: "האדממה נארזה בסמיכות למנות קרות (סשימי/רולים) ואיבדה את חומה עד להגעה ללקוח.",
    confidence: 0.94,
  },
  order: {
    id: "ORD-44821",
    items: ["🫛 אדממה", "🍣 Tuna Roll (8 pcs)", "🍱 Bento Box", "🐟 Salmon Sashimi"],
  },
};

// Tabit brand colors
const TABIT_TEAL = "#3ec6c6";
const TABIT_DARK = "#1a1a2e";
const TABIT_TEAL_LIGHT = "rgba(62,198,198,0.12)";
const TABIT_TEAL_BORDER = "rgba(62,198,198,0.4)";

export default function LiveDemoTabit() {
  const [step, setStep] = useState("p1_ticket");
  const [displayedText, setDisplayedText] = useState(DEMO.complaint);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [savedDebtId, setSavedDebtId] = useState(null);
  const intervalRef = useRef(null);

  const PHASE1 = ["p1_ticket", "p1_analyzing", "p1_stored"];
  const PHASE2 = ["p2_order", "p2_triggering", "p2_injected"];

  const inPhase1 = PHASE1.includes(step);
  const inPhase2 = PHASE2.includes(step);
  const phase1Done = step === "p1_stored" || inPhase2;
  const phase2Done = step === "p2_injected";

  const reset = () => {
    clearInterval(intervalRef.current);
    setStep("p1_ticket");
    setDisplayedText(DEMO.complaint);
    setAnalyzeProgress(0);
    setSavedDebtId(null);
  };

  const startPhase1 = () => {
    setStep("p1_ticket");
    setDisplayedText(DEMO.complaint);
    setTimeout(() => runAnalysis(), 800);
  };

  const runAnalysis = async () => {
    setStep("p1_analyzing");
    setAnalyzeProgress(0);
    let p = 0;
    const prog = setInterval(() => {
      p += Math.random() * 11;
      if (p >= 100) { p = 100; clearInterval(prog); }
      setAnalyzeProgress(Math.round(p));
    }, 110);
    await new Promise(r => setTimeout(r, 2400));
    clearInterval(prog);
    setAnalyzeProgress(100);
    try {
      const record = await base44.entities.OperationalDebts.create({
        customer_id: DEMO.customer.id,
        restaurant_id: "zozobra-tabit",
        action_code: DEMO.analysis.action_code,
        golden_line_hebrew: DEMO.analysis.golden_line,
        reasoning_logic: DEMO.analysis.reasoning,
        evidence_quote: DEMO.analysis.evidence,
        confidence_score: DEMO.analysis.confidence,
        is_active: true,
        injected_count: 0,
        source_ticket_id: DEMO.ticket_id,
      });
      setSavedDebtId(record.id);
    } catch { /* show anyway */ }
    setStep("p1_stored");
  };

  const startPhase2 = async () => {
    setStep("p2_order");
    await new Promise(r => setTimeout(r, 1200));
    setStep("p2_triggering");
    await new Promise(r => setTimeout(r, 1600));
    setStep("p2_injected");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: TABIT_DARK, direction: "rtl" }}>

      {/* Header — ZOZOBRA branding */}
      <div className="relative overflow-hidden" style={{ minHeight: "180px" }}>
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=80"
          alt="ZOZOBRA"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,26,46,0.55) 0%, rgba(26,26,46,0.92) 100%)" }} />

        <div className="relative z-10 flex items-end justify-between px-8 py-6" style={{ minHeight: "180px" }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-5xl font-black tracking-widest uppercase" style={{ color: TABIT_TEAL, fontStyle: "italic", letterSpacing: "0.12em" }}>
                KYOTO
              </div>
              <div className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.2)" }}>
                powered by Tabit
              </div>
            </div>
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>מסעדת יפנית · תל אביב</p>
          </div>

          <div className="text-left flex flex-col items-end gap-2">
            <div className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: TABIT_TEAL_LIGHT, border: `1px solid ${TABIT_TEAL_BORDER}`, color: TABIT_TEAL }}>
              Golden Line Demo · מופעל על Tabit
            </div>
            {step !== "idle" && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <RotateCcw className="w-3.5 h-3.5" /> אתחול
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 max-w-5xl mx-auto">

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ── PHASE 1 ── */}
            <div className="space-y-4">
              <PhaseHeader number="1" title="זיהוי תלונה ולמידה" subtitle="תלונת Tabit ← ניתוח AI ← Golden Line נשמר" active={inPhase1} done={phase1Done} />

              {/* Step 1a — Ticket */}
              <DemoCard icon={<MessageSquare className="w-4 h-4" />} label="תלונת לקוח — CRM של המסעדה" active={step === "p1_ticket"} done={["p1_analyzing", "p1_stored", ...PHASE2].includes(step)}>
                <div className="flex items-center gap-2 mb-3 flex-wrap text-xs">
                  <span className="font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: TABIT_TEAL_LIGHT, border: `1px solid ${TABIT_TEAL_BORDER}`, color: TABIT_TEAL }}>👤 {DEMO.customer.name}</span>
                  <span className="font-mono px-2 py-1 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>{DEMO.ticket_id}</span>
                </div>
                <div className="rounded-xl px-4 py-3 text-sm leading-relaxed min-h-[80px]" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)" }}>
                  {displayedText}
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <span>📋 CRM של המסעדה</span>
                  <span>24/04/2026 · 13:47</span>
                </div>
                {step === "p1_ticket" && (
                  <button
                    onClick={runAnalysis}
                    className="w-full mt-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    style={{ backgroundColor: TABIT_TEAL, color: TABIT_DARK }}
                  >
                    <Brain className="w-4 h-4" /> הפעל ניתוח AI
                  </button>
                )}
              </DemoCard>

              {/* Step 1b — AI Analysis */}
              {["p1_analyzing", "p1_stored", ...PHASE2].includes(step) && (
                <DemoCard icon={<Brain className="w-4 h-4" />} label="Agentic AI Analysis" active={step === "p1_analyzing"} done={["p1_stored", ...PHASE2].includes(step)}>
                  {step === "p1_analyzing" ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                        <span>מזהה בעיית איכות אריזה...</span>
                        <span className="font-mono font-medium" style={{ color: TABIT_TEAL }}>{analyzeProgress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full transition-all duration-150" style={{ width: `${analyzeProgress}%`, backgroundColor: TABIT_TEAL }} />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {["מנתח תלונה...", "מסווג בעיה...", "מייצר הנחיה..."].map((t, i) => (
                          <div key={i} className="text-[11px] px-2 py-1.5 rounded-lg border text-center" style={{
                            backgroundColor: analyzeProgress > (i + 1) * 28 ? TABIT_TEAL_LIGHT : "rgba(255,255,255,0.04)",
                            borderColor: analyzeProgress > (i + 1) * 28 ? TABIT_TEAL_BORDER : "rgba(255,255,255,0.08)",
                            color: analyzeProgress > (i + 1) * 28 ? TABIT_TEAL : "rgba(255,255,255,0.3)"
                          }}>{t}</div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <ResultField label="קוד פעולה">
                          <code className="text-xs px-2 py-1 rounded font-mono block" style={{ backgroundColor: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>{DEMO.analysis.action_code}</code>
                        </ResultField>
                        <ResultField label="ביטחון AI">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                              <div className="h-full rounded-full" style={{ width: `${DEMO.analysis.confidence * 100}%`, backgroundColor: TABIT_TEAL }} />
                            </div>
                            <span className="text-sm font-bold text-white">{(DEMO.analysis.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </ResultField>
                      </div>
                      <ResultField label="ציטוט ראיה">
                        <div className="text-xs px-3 py-2 rounded-lg italic" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
                          "{DEMO.analysis.evidence}"
                        </div>
                      </ResultField>
                      <ResultField label="🍱 Golden Line — הנחיית אריזה">
                        <div className="text-sm font-bold px-3 py-3 rounded-xl text-right leading-relaxed" style={{ backgroundColor: TABIT_TEAL_LIGHT, border: `1.5px solid ${TABIT_TEAL_BORDER}`, color: TABIT_TEAL }}>
                          {DEMO.analysis.golden_line}
                        </div>
                      </ResultField>
                    </div>
                  )}
                </DemoCard>
              )}

              {/* Step 1c — Stored */}
              {["p1_stored", ...PHASE2].includes(step) && (
                <DemoCard icon={<Database className="w-4 h-4" />} label="נשמר ב־Golden Line" active={false} done={true}>
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                    <div className="text-right">
                      <div className="font-semibold text-sm text-emerald-400">חוב תפעולי נוצר בהצלחה</div>
                      <div className="text-xs mt-0.5 text-emerald-600">{DEMO.customer.name} — מסומן כ"לקוח מיוחד" במערכת</div>
                    </div>
                  </div>
                  {savedDebtId && (
                    <p className="text-[11px] mt-2 text-right" style={{ color: "rgba(255,255,255,0.25)" }}>DB record: <code className="font-mono">{savedDebtId}</code></p>
                  )}
                </DemoCard>
              )}
            </div>

            {/* ── PHASE 2 ── */}
            <div className="space-y-4">
              <PhaseHeader number="2" title="הגנה על ההזמנה הבאה" subtitle="אותו לקוח מזמין שוב דרך Tabit ← Golden Line מוזרק לארז" active={inPhase2} done={phase2Done} locked={!phase1Done} />

              {step === "p1_stored" && (
                <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl" style={{ border: `2px dashed ${TABIT_TEAL_BORDER}`, backgroundColor: "rgba(62,198,198,0.04)" }}>
                  <ShoppingCart className="w-10 h-10 mb-3" style={{ color: TABIT_TEAL_BORDER }} />
                  <p className="text-sm mb-1 font-medium text-white">{DEMO.customer.name} מבצע הזמנה חדשה</p>
                  <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>דרך Tabit · KYOTO · אותן מנות</p>
                  <button
                    onClick={startPhase2}
                    className="text-sm font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: TABIT_TEAL, color: TABIT_DARK }}
                  >
                    סמלץ הזמנה חדשה
                  </button>
                </div>
              )}

              {/* Step 2a — New Order */}
              {PHASE2.includes(step) && (
                <DemoCard icon={<ShoppingCart className="w-4 h-4" />} label="הזמנה חדשה — Tabit Order" active={step === "p2_order"} done={["p2_triggering", "p2_injected"].includes(step)}>
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                    <span className="font-mono px-2 py-1 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>הזמנה: {DEMO.order.id}</span>
                    <span className="font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: TABIT_TEAL_LIGHT, border: `1px solid ${TABIT_TEAL_BORDER}`, color: TABIT_TEAL }}>👤 {DEMO.customer.name}</span>
                  </div>
                  <div className="space-y-1.5 mb-3">
                    {DEMO.order.items.map((item, i) => (
                      <div key={i} className="text-sm px-3 py-2 rounded-lg text-right" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.8)" }}>
                        {item}
                      </div>
                    ))}
                  </div>
                  {step === "p2_order" && (
                    <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: TABIT_TEAL_LIGHT, border: `1px solid ${TABIT_TEAL_BORDER}`, color: TABIT_TEAL }}>
                      <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin shrink-0" style={{ borderColor: TABIT_TEAL, borderTopColor: "transparent" }} />
                      בודק מול מסד Golden Line...
                    </div>
                  )}
                  {["p2_triggering", "p2_injected"].includes(step) && (
                    <div className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.3)", color: "#fbbf24" }}>
                      התאמה נמצאה — מכניס Golden Line לתחנת האריזה
                    </div>
                  )}
                </DemoCard>
              )}

              {/* Step 2b — Packing screen */}
              {step === "p2_injected" && (
                <DemoCard icon={<Utensils className="w-4 h-4" />} label="תחנת הארז — מסך Tabit" active={false} done={true}>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)" }}>
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                      <div className="text-right">
                        <div className="font-semibold text-sm text-emerald-400">Golden Line הוזרק ל-Tabit</div>
                        <div className="text-xs mt-0.5 text-emerald-600">הזמנה {DEMO.order.id} · לפני תחילת אריזה</div>
                      </div>
                      <span className="mr-auto text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: TABIT_TEAL_LIGHT, color: TABIT_TEAL, border: `1px solid ${TABIT_TEAL_BORDER}` }}>LIVE</span>
                    </div>

                    {/* Tabit-style screen mockup */}
                    <div className="rounded-2xl p-5 shadow-2xl" style={{ backgroundColor: "#0d0d1a", border: `1.5px solid ${TABIT_TEAL_BORDER}` }}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="text-xs font-black tracking-widest uppercase italic" style={{ color: TABIT_TEAL }}>KYOTO</div>
                          <span className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.35)" }}>via Tabit</span>
                        </div>
                        <span className="text-[10px] ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>תחנת אריזה</span>
                      </div>
                      <div className="border-b mb-3" style={{ borderColor: "rgba(255,255,255,0.06)" }} />
                      <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "rgba(234,179,8,0.1)", border: "2px solid rgba(234,179,8,0.5)" }}>
                        <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#fbbf24" }}>⚠️ הנחיית Golden Line לארז</div>
                        <div className="text-white text-base font-bold text-right leading-snug">
                          {DEMO.analysis.golden_line}
                        </div>
                      </div>
                      <div className="rounded-lg px-4 py-3" style={{ backgroundColor: TABIT_TEAL_LIGHT, border: `1px solid ${TABIT_TEAL_BORDER}` }}>
                        <div className="text-sm font-semibold text-right leading-relaxed" style={{ color: TABIT_TEAL }}>
                          ✅ ההנחיה תופיע כהערה למנה אדממה במסך האורז ב-Tabit לפני שהמנה תצא
                        </div>
                      </div>
                    </div>
                  </div>
                </DemoCard>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}

function PhaseHeader({ number, title, subtitle, active, done, locked }) {
  return (
    <div className={`text-right ${locked ? "opacity-40" : ""}`}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-3 mr-auto"
        style={{
          backgroundColor: done ? "#22c55e" : active ? TABIT_TEAL : "rgba(255,255,255,0.1)",
          color: done || active ? "#0d1b2e" : "rgba(255,255,255,0.4)"
        }}
      >
        {done ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <h2 className="text-xl font-bold text-white mb-1">{title}</h2>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{subtitle}</p>
    </div>
  );
}

function DemoCard({ icon, label, active, done, children }) {
  const TABIT_TEAL = "#3ec6c6";
  const TABIT_TEAL_LIGHT = "rgba(62,198,198,0.12)";
  const TABIT_TEAL_BORDER = "rgba(62,198,198,0.4)";
  return (
    <div className="rounded-2xl p-4 transition-all duration-300" style={{
      backgroundColor: "rgba(255,255,255,0.03)",
      border: done ? "1.5px solid rgba(34,197,94,0.35)" : active ? `1.5px solid ${TABIT_TEAL}` : "1.5px solid rgba(255,255,255,0.08)",
      boxShadow: active ? `0 0 20px rgba(62,198,198,0.1)` : "none"
    }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{
          backgroundColor: done ? "rgba(34,197,94,0.15)" : active ? TABIT_TEAL_LIGHT : "rgba(255,255,255,0.06)",
          color: done ? "#22c55e" : active ? TABIT_TEAL : "rgba(255,255,255,0.35)"
        }}>
          {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : icon}
        </div>
        <span className="text-xs font-semibold" style={{ color: done ? "#22c55e" : active ? TABIT_TEAL : "rgba(255,255,255,0.5)" }}>{label}</span>
        {active && (
          <div className="mr-auto flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: TABIT_TEAL, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function ResultField({ label, children }) {
  return (
    <div>
      <div className="text-[11px] font-medium mb-1 text-right" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</div>
      {children}
    </div>
  );
}