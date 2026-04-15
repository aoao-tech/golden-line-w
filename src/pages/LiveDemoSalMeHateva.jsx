import React, { useState, useRef } from "react";
import { Play, RotateCcw, ShoppingBag, MessageSquare, Brain, CheckCircle2, Database, ShoppingCart } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEMO = {
  customer: { name: "מירה כהן", id: "CUST-4412", phone: "052-8834421" },
  complaint: "קיבלתי את הסל היום וממש אכזבה - התמרים הגיעו יבשים לחלוטין ולא לחים בכלל, והקלמנטינות היו רקובות.",
  analysis: {
    action_code: "איכות_פרי",
    golden_line: "לוודא שהתמרים לחים ורכים וקלמנטינות ללא פגמים לפני הכנסה לסל",
    evidence: "התמרים הגיעו יבשים לחלוטין ולא לחים בכלל, והקלמנטינות היו רקובות",
    reasoning: "פירות רגישים (תמרים וקלמנטינות) נארזו ללא בדיקת איכות — התמרים לא היו לחים והקלמנטינות הגיעו רקובות.",
    confidence: 0.96,
  },
  order: {
    id: "ORD-78831",
    items: ["🌴 תמר מג'הול לח | ליבינגוד", "🍊 קלמנטינות (1 ק\"ג)", "🍅 עגבניות שרי", "🍋 לימונים מהחווה", "🌿 פטרוזיליה טרייה"],
  },
};

export default function LiveDemoSalMeHateva() {
  const [step, setStep] = useState("idle");
  const [displayedText, setDisplayedText] = useState("");
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
    setStep("idle");
    setDisplayedText("");
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
        restaurant_id: "sal-mehateva",
        action_code: DEMO.analysis.action_code,
        golden_line_hebrew: DEMO.analysis.golden_line,
        reasoning_logic: DEMO.analysis.reasoning,
        evidence_quote: DEMO.analysis.evidence,
        confidence_score: DEMO.analysis.confidence,
        is_active: true,
        injected_count: 0,
        source_ticket_id: "CRM-" + DEMO.customer.id,
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
    <div className="min-h-screen p-5 md:p-8" style={{ backgroundColor: "#e8f5e2", direction: "rtl" }}>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: "#2d6a2d" }}>
            💚
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">סל מהטבע - דפנה אמון</h1>
            <p className="text-xs font-medium" style={{ color: "#4a8c4a" }}>דמו Golden Line • מופעל על mypips.app</p>
          </div>
        </div>
        {step !== "idle" && (
          <button
            onClick={reset}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg px-3 py-2 bg-white hover:bg-slate-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> אתחול
          </button>
        )}
      </div>

      {/* Start button - centered when idle */}
      {step === "idle" && (
        <div className="flex justify-center mb-8">
          <button
            onClick={startPhase1}
            className="text-white font-bold text-base px-10 py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#2d6a2d" }}
          >
            הפעל דמו
          </button>
        </div>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── PHASE 1 ── */}
        <div className="space-y-4">
          <PhaseHeader number="1" title="זיהוי תלונה ולמידה" subtitle="תלונת לקוח ← ניתוח AI ← Golden Line נשמר" active={inPhase1} done={phase1Done} />

          {/* Step 1a — CRM Complaint */}
          <DemoCard
            icon={<MessageSquare className="w-4 h-4" />}
            label="תלונת לקוח — CRM"
            active={step === "p1_ticket"}
            done={["p1_analyzing", "p1_stored", ...PHASE2].includes(step)}
          >
            <div className="flex items-center gap-2 mb-3 flex-wrap text-xs">
              <span className="font-medium px-2 py-1 rounded-lg border" style={{ backgroundColor: "#f0faf0", borderColor: "#a3d9a3", color: "#1a5c1a" }}>👤 {DEMO.customer.name}</span>
              <span className="font-mono px-2 py-1 rounded-lg bg-orange-100 text-orange-700 border border-orange-200">{DEMO.customer.id}</span>
            </div>
            <div className="rounded-xl px-4 py-3 text-sm text-slate-800 leading-relaxed min-h-[80px]" style={{ backgroundColor: "#f5f5f5", border: "1px solid #e0e0e0" }}>
              {step === "idle" ? (
                DEMO.complaint
              ) : (
                displayedText
              )}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
              <span>📋 CRM · הגיע ל-CS</span>
              <span>14/04/2026 · 09:32</span>
            </div>
          </DemoCard>

          {/* Step 1b — AI Analysis */}
          {["p1_analyzing", "p1_stored", ...PHASE2].includes(step) && (
            <DemoCard
              icon={<Brain className="w-4 h-4" />}
              label="Agentic AI Analysis"
              active={step === "p1_analyzing"}
              done={["p1_stored", ...PHASE2].includes(step)}
            >
              {step === "p1_analyzing" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>מזהה בעיית איכות פירות...</span>
                    <span className="font-mono font-medium">{analyzeProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#d4edd4" }}>
                    <div className="h-full rounded-full transition-all duration-150" style={{ width: `${analyzeProgress}%`, backgroundColor: "#2d6a2d" }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["מנתח תלונה...", "מסווג בעיה...", "מייצר הנחיה..."].map((t, i) => (
                      <div key={i} className="text-[11px] px-2 py-1.5 rounded-lg border text-center" style={{
                        backgroundColor: analyzeProgress > (i + 1) * 28 ? "#f0faf0" : "#f9f9f9",
                        borderColor: analyzeProgress > (i + 1) * 28 ? "#a3d9a3" : "#e0e0e0",
                        color: analyzeProgress > (i + 1) * 28 ? "#2d6a2d" : "#9ca3af"
                      }}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <ResultField label="קוד פעולה">
                      <code className="text-xs px-2 py-1 rounded font-mono block" style={{ backgroundColor: "#fff3f0", color: "#c0392b", border: "1px solid #fca5a5" }}>{DEMO.analysis.action_code}</code>
                    </ResultField>
                    <ResultField label="ביטחון AI">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#d4edd4" }}>
                          <div className="h-full rounded-full" style={{ width: `${DEMO.analysis.confidence * 100}%`, backgroundColor: "#2d6a2d" }} />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{(DEMO.analysis.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </ResultField>
                  </div>
                  <ResultField label="ציטוט ראיה">
                    <div className="text-xs px-3 py-2 rounded-lg italic" style={{ backgroundColor: "#fff8f0", border: "1px solid #fcd9aa", color: "#5a3a1a" }}>
                      "{DEMO.analysis.evidence}"
                    </div>
                  </ResultField>
                  <ResultField label="🌿 Golden Line — הנחיית אריזה">
                    <div className="text-sm font-bold px-3 py-3 rounded-xl text-right leading-relaxed" style={{ backgroundColor: "#f0faf0", border: "1px solid #a3d9a3", color: "#1a5c1a" }}>
                      {DEMO.analysis.golden_line}
                    </div>
                  </ResultField>
                </div>
              )}
            </DemoCard>
          )}

          {/* Step 1c — Stored */}
          {["p1_stored", ...PHASE2].includes(step) && (
            <DemoCard
              icon={<Database className="w-4 h-4" />}
              label='נשמר ב־Golden Line'
              active={false}
              done={true}
            >
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#f0faf0", border: "1px solid #a3d9a3" }}>
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "#2d6a2d" }} />
                <div className="flex-1 text-right">
                  <div className="font-semibold text-sm" style={{ color: "#1a5c1a" }}>חוב תפעולי נוצר בהצלחה</div>
                  <div className="text-xs mt-0.5" style={{ color: "#4a8c4a" }}>{DEMO.customer.name} — מסומנת כ"לקוחה מיוחדת" במערכת</div>
                </div>
              </div>

              {savedDebtId && (
                <p className="text-[11px] text-slate-400 mt-2 text-right">נשמר ב-Database מספר מזהה: <code className="font-mono">{savedDebtId}</code></p>
              )}
            </DemoCard>
          )}
        </div>

        {/* ── PHASE 2 ── */}
        <div className="space-y-4">
          <PhaseHeader number="2" title="הגנה על ההזמנה הבאה" subtitle="אותה לקוחה מזמינה שוב ← התראה לאריזה ← הגנה אוטומטית" active={inPhase2} done={phase2Done} locked={!phase1Done} />

          {/* Trigger Phase 2 */}
          {step === "p1_stored" && (
            <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl" style={{ border: "2px dashed #a3d9a3", backgroundColor: "#f5fbf5" }}>
              <ShoppingCart className="w-10 h-10 mb-3" style={{ color: "#a3d9a3" }} />
              <p className="text-sm text-slate-600 mb-1 font-medium">{DEMO.customer.name} מגישה הזמנה חדשה</p>
              <p className="text-xs text-slate-400 mb-5">דרך mypips.app · אותה חנות</p>
              <button
                onClick={startPhase2}
                className="text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#2d6a2d" }}
              >
                סמלץ הזמנה חדשה
              </button>
            </div>
          )}

          {step === "idle" && (
            <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl opacity-40" style={{ border: "2px dashed #c8e6c8" }}>
              <ShoppingCart className="w-9 h-9 mb-2 text-slate-300" />
              <p className="text-xs text-slate-400">השלם שלב 1 כדי להמשיך</p>
            </div>
          )}

          {/* Step 2a — New Order */}
          {PHASE2.includes(step) && (
            <DemoCard
              icon={<ShoppingCart className="w-4 h-4" />}
              label="הזמנה חדשה נכנסת — mypips.app"
              active={step === "p2_order"}
              done={["p2_triggering", "p2_injected"].includes(step)}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <span className="font-mono px-2 py-1 rounded-lg bg-slate-100 text-slate-600">הזמנה: {DEMO.order.id}</span>
                <span className="font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: "#f0faf0", border: "1px solid #a3d9a3", color: "#1a5c1a" }}>👤 {DEMO.customer.name}</span>
                <span className="font-mono px-2 py-1 rounded-lg bg-slate-100 text-slate-500">{DEMO.customer.id}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {DEMO.order.items.map((item, i) => (
                  <div key={i} className="text-sm text-slate-700 px-3 py-2 rounded-lg text-right" style={{ backgroundColor: "#fafafa", border: "1px solid #e8e8e8" }}>
                    {item}
                  </div>
                ))}
              </div>
              {step === "p2_order" && (
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: "#f0faf0", border: "1px solid #a3d9a3", color: "#2d6a2d" }}>
                  <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin shrink-0" style={{ borderColor: "#2d6a2d", borderTopColor: "transparent" }} />
                  בודק מול מסד "מיוחדים" של Golden Line...
                </div>
              )}
              {["p2_triggering", "p2_injected"].includes(step) && (
                <div className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg" style={{ backgroundColor: "#fffbf0", border: "1px solid #fcd9aa", color: "#7a5a1a" }}>
                  לקוחה מיוחדת זוהתה! מזריק Golden Line לתחנת האריזה...
                </div>
              )}
            </DemoCard>
          )}

          {/* Step 2b — Packing Station */}
          {step === "p2_injected" && (
            <DemoCard
              icon={<ShoppingBag className="w-4 h-4" />}
              label="תחנת האריזה — מסך הארז"
              active={false}
              done={true}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#f0faf0", border: "1px solid #a3d9a3" }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: "#2d6a2d" }} />
                  <div className="text-right">
                    <div className="font-semibold text-sm" style={{ color: "#1a5c1a" }}>Golden Line הוזרק לתחנת האריזה</div>
                    <div className="text-xs mt-0.5" style={{ color: "#4a8c4a" }}>הזמנה {DEMO.order.id} · לפני תחילת אריזה</div>
                  </div>
                  <span className="mr-auto text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "#d4edd4", color: "#1a5c1a" }}>LIVE</span>
                </div>

                {/* Packing screen mockup */}
                <div className="rounded-2xl p-5 shadow-xl" style={{ backgroundColor: "#1a1a2e", border: "1px solid #333" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-xs mr-2" style={{ color: "#666" }}>mypips — תחנת אריזה</span>
                  </div>
                  <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "rgba(217,119,6,0.15)", border: "2px solid #d97706" }}>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "#fbbf24" }}>הנחיית Golden Line לארז</div>
                    <div className="text-white text-lg font-bold text-right leading-snug">
                      {DEMO.analysis.golden_line}
                    </div>
                  </div>
                  <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "rgba(45,106,45,0.3)", border: "1px solid rgba(74,140,74,0.5)" }}>
                    <div className="text-sm font-semibold text-right leading-relaxed" style={{ color: "#86efac" }}>
                      ✅ הארז קיבל את ההנחיה כהודעה קופצת כשנכנס לארוז ללקוחה, או בהערות תחת המוצר הרלוונטי בהזמנה
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" style={{ color: "#2d6a2d" }} />
                  אותה טעות לא תקרה שוב בהזמנה הזו
                </div>
              </div>
            </DemoCard>
          )}
        </div>
      </div>

      {/* Idle state bottom */}
      {step === "idle" && (
        <div className="flex flex-col items-center justify-center py-12 text-center mt-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative" style={{ backgroundColor: "white", border: "2px solid #a3d9a3" }}>
            <Play className="w-6 h-6" style={{ color: "#2d6a2d" }} />
            <span className="absolute -top-2 -right-2 text-lg">🌿</span>
            <span className="absolute -bottom-2 -left-2 text-lg">🌿</span>
          </div>
          <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
            לחץ על <strong>הפעל דמו</strong> כדי לראות את הזרימה המלאה — מתלונת CRM ועד הנחיית אריזה בזמן אמת עבור <strong>סל מהטבע</strong>.
          </p>
        </div>
      )}

      {/* Decorative leaf footer */}
      <div className="flex justify-end mt-8 opacity-30">
        <span className="text-3xl">🌿</span>
      </div>
    </div>
  );
}

function PhaseHeader({ number, title, subtitle, active, done, locked }) {
  return (
    <div className={`text-right ${locked ? "opacity-40" : ""}`}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mr-auto"
        style={{ backgroundColor: done ? "#2d6a2d" : "#e8a838" }}
      >
        {done ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function DemoCard({ icon, label, active, done, children }) {
  return (
    <div className="rounded-2xl p-4 transition-all duration-300 bg-white" style={{
      border: done ? "1.5px solid #a3d9a3" : active ? "1.5px solid #2d6a2d" : "1.5px solid #e0e0e0",
      boxShadow: active ? "0 2px 12px rgba(45,106,45,0.12)" : "0 1px 4px rgba(0,0,0,0.06)"
    }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{
          backgroundColor: done ? "#f0faf0" : active ? "#f0faf0" : "#f5f5f5",
          color: done ? "#2d6a2d" : active ? "#2d6a2d" : "#6b7280"
        }}>
          {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : icon}
        </div>
        <span className="text-xs font-semibold" style={{ color: done ? "#2d6a2d" : active ? "#2d6a2d" : "#374151" }}>{label}</span>
        {active && (
          <div className="mr-auto flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#2d6a2d", animationDelay: `${i * 0.15}s` }} />
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
      <div className="text-[11px] font-medium mb-1 text-right text-slate-400">{label}</div>
      {children}
    </div>
  );
}