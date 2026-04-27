import React, { useState, useRef } from "react";
import { Play, RotateCcw, ShoppingBag, MessageSquare, Brain, CheckCircle2, Database, ShoppingCart } from "lucide-react";
import { base44 } from "@/api/base44Client";

const POP_GREEN = "#2e7d32";
const POP_GREEN_LIGHT = "#f1f8f1";
const POP_GREEN_BORDER = "#a5d6a7";
const POP_GREEN_DARK = "#1b5e20";

const DEMO = {
  customer: { name: "מירה כהן", id: "CUST-5521", phone: "054-3312887" },
  complaint: "קיבלתי את הסל היום וממש אכזבה - התמרים הגיעו יבשים לחלוטין ולא לחים בכלל, והקלמנטינות היו רקובות.",
  analysis: {
    action_code: "DATE_CITRUS_QUALITY_CHECK",
    golden_line: "לוודא שהתמרים לחים ורכים וקלמנטינות ללא פגמים",
    evidence: "התמרים הגיעו יבשים לחלוטין ולא לחים בכלל, והקלמנטינות היו רקובות",
    reasoning: "פירות רגישים (תמרים וקלמנטינות) נארזו ללא בדיקת איכות — התמרים לא היו לחים והקלמנטינות הגיעו רקובות.",
    confidence: 0.96,
  },
  order: {
    id: "ORD-55219",
    items: ["🌴 תמר מג'הול לח (1 ק\"ג)", "🍊 קלמנטינה אור (2 ק\"ג) - מוגדרת כמנדרינה", "🥒 מלפפון פרסי", "🥬 חסה רומית", "🌿 עירית טרייה"],
  },
};

export default function LiveDemoPopIsrael() {
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
        restaurant_id: "pop-israel",
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
    <div className="min-h-screen p-5 md:p-8" style={{ backgroundColor: "#eaf4ea", direction: "rtl" }}>

      {/* Header */}
      <div className="mb-6">
        <div className="relative rounded-2xl overflow-hidden mb-3" style={{ height: "130px" }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/plantonic-eco.appspot.com/o/stores%2F5KjyOvDmn6OpCMOMlT9I%2Fimages%2Fstore%2F22bc87d8ed3218.jpeg?alt=media&token=46a45a1b-409a-445e-8947-a9a2abf5f016"
            alt="פופ ישראל"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to left, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)" }} />
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/plantonic-eco.appspot.com/o/stores%2F5KjyOvDmn6OpCMOMlT9I%2Fimages%2Fstore%2F1fa9ee72050ee6.jpeg?alt=media&token=d6079e8e-2181-43db-ab9c-53c751bf5b49"
              alt="פופ לוגו"
              className="w-9 h-9 rounded-full object-cover border-2 border-white"
            />
            <p className="text-xs font-medium" style={{ color: "#000000" }}>דמו Golden Line · מופעל על mypips.app</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div />
          {step !== "idle" && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg px-3 py-2 bg-white hover:bg-slate-50"
            >
              <RotateCcw className="w-3.5 h-3.5" /> אתחול
            </button>
          )}
        </div>
      </div>

      {/* Start button */}
      {step === "idle" && (
        <div className="flex justify-center mb-8">
          <button
            onClick={startPhase1}
            className="text-white font-bold text-base px-10 py-3 rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
            style={{ backgroundColor: POP_GREEN }}
          >
            <Play className="w-4 h-4" /> הפעל דמו
          </button>
        </div>
      )}

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── PHASE 1 ── */}
        <div className="space-y-4">
          <PhaseHeader number="1" title="זיהוי תלונה ולמידה" subtitle="תלונת לקוח ← ניתוח AI ← Golden Line נשמר" active={inPhase1} done={phase1Done} />

          <DemoCard icon={<MessageSquare className="w-4 h-4" />} label="תלונת לקוח — CRM" active={step === "p1_ticket"} done={["p1_analyzing", "p1_stored", ...PHASE2].includes(step)}>
            <div className="flex items-center gap-2 mb-3 flex-wrap text-xs">
              <span className="font-medium px-2 py-1 rounded-lg border" style={{ backgroundColor: POP_GREEN_LIGHT, borderColor: POP_GREEN_BORDER, color: POP_GREEN_DARK }}>👤 {DEMO.customer.name}</span>
              <span className="font-mono px-2 py-1 rounded-lg bg-orange-100 text-orange-700 border border-orange-200">{DEMO.customer.id}</span>
            </div>
            <div className="rounded-xl px-4 py-3 text-sm text-slate-800 leading-relaxed min-h-[80px]" style={{ backgroundColor: "#f5f5f5", border: "1px solid #e0e0e0" }}>
              {step === "idle" ? DEMO.complaint : displayedText}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
              <span>📋 CRM · הגיע ל-CS</span>
              <span>27/04/2026 · 11:14</span>
            </div>
          </DemoCard>

          {["p1_analyzing", "p1_stored", ...PHASE2].includes(step) && (
            <DemoCard icon={<Brain className="w-4 h-4" />} label="Agentic AI Analysis" active={step === "p1_analyzing"} done={["p1_stored", ...PHASE2].includes(step)}>
              {step === "p1_analyzing" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>מזהה בעיית טריות ירקות...</span>
                    <span className="font-mono font-medium" style={{ color: POP_GREEN }}>{analyzeProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#c8e6c9" }}>
                    <div className="h-full rounded-full transition-all duration-150" style={{ width: `${analyzeProgress}%`, backgroundColor: POP_GREEN }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["מנתח תלונה...", "מסווג בעיה...", "מייצר הנחיה..."].map((t, i) => (
                      <div key={i} className="text-[11px] px-2 py-1.5 rounded-lg border text-center" style={{
                        backgroundColor: analyzeProgress > (i + 1) * 28 ? POP_GREEN_LIGHT : "#f9f9f9",
                        borderColor: analyzeProgress > (i + 1) * 28 ? POP_GREEN_BORDER : "#e0e0e0",
                        color: analyzeProgress > (i + 1) * 28 ? POP_GREEN_DARK : "#9ca3af"
                      }}>{t}</div>
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
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#c8e6c9" }}>
                          <div className="h-full rounded-full" style={{ width: `${DEMO.analysis.confidence * 100}%`, backgroundColor: POP_GREEN }} />
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
                  <ResultField label="🍅 Golden Line — הנחיית אריזה">
                    <div className="text-sm font-bold px-3 py-3 rounded-xl text-right leading-relaxed" style={{ backgroundColor: POP_GREEN_LIGHT, border: `1px solid ${POP_GREEN_BORDER}`, color: POP_GREEN_DARK }}>
                      {DEMO.analysis.golden_line}
                    </div>
                  </ResultField>
                </div>
              )}
            </DemoCard>
          )}

          {["p1_stored", ...PHASE2].includes(step) && (
            <DemoCard icon={<Database className="w-4 h-4" />} label="נשמר ב־Golden Line" active={false} done={true}>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: POP_GREEN_LIGHT, border: `1px solid ${POP_GREEN_BORDER}` }}>
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: POP_GREEN }} />
                <div className="flex-1 text-right">
                  <div className="font-semibold text-sm" style={{ color: POP_GREEN_DARK }}>חוב תפעולי נוצר בהצלחה</div>
                  <div className="text-xs mt-0.5" style={{ color: POP_GREEN }}>{DEMO.customer.name} — מסומנת כ"לקוחה מיוחדת" במערכת</div>
                </div>
              </div>
              {savedDebtId && (
                <p className="text-[11px] text-slate-400 mt-2 text-right">נשמר ב-Database: <code className="font-mono">{savedDebtId}</code></p>
              )}
            </DemoCard>
          )}
        </div>

        {/* ── PHASE 2 ── */}
        <div className="space-y-4">
          <PhaseHeader number="2" title="הגנה על ההזמנה הבאה" subtitle="אותה לקוחה מזמינה שוב ← התראה לאריזה ← הגנה אוטומטית" active={inPhase2} done={phase2Done} locked={!phase1Done} />

          {step === "p1_stored" && (
            <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl" style={{ border: `2px dashed ${POP_GREEN_BORDER}`, backgroundColor: "#f5fbf5" }}>
              <ShoppingCart className="w-10 h-10 mb-3" style={{ color: POP_GREEN_BORDER }} />
              <p className="text-sm text-slate-600 mb-1 font-medium">{DEMO.customer.name} מגישה הזמנה חדשה</p>
              <p className="text-xs text-slate-400 mb-5">דרך mypips.app/popisrael · אותה חנות</p>
              <button
                onClick={startPhase2}
                className="text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: POP_GREEN }}
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

          {PHASE2.includes(step) && (
            <DemoCard icon={<ShoppingCart className="w-4 h-4" />} label="הזמנה חדשה נכנסת — mypips.app/popisrael" active={step === "p2_order"} done={["p2_triggering", "p2_injected"].includes(step)}>
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <span className="font-mono px-2 py-1 rounded-lg bg-slate-100 text-slate-600">הזמנה: {DEMO.order.id}</span>
                <span className="font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: POP_GREEN_LIGHT, border: `1px solid ${POP_GREEN_BORDER}`, color: POP_GREEN_DARK }}>👤 {DEMO.customer.name}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {DEMO.order.items.map((item, i) => (
                  <div key={i} className="text-sm text-slate-700 px-3 py-2 rounded-lg text-right" style={{ backgroundColor: "#fafafa", border: "1px solid #e8e8e8" }}>
                    {item}
                  </div>
                ))}
              </div>
              {step === "p2_order" && (
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: POP_GREEN_LIGHT, border: `1px solid ${POP_GREEN_BORDER}`, color: POP_GREEN }}>
                  <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin shrink-0" style={{ borderColor: POP_GREEN, borderTopColor: "transparent" }} />
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

          {step === "p2_injected" && (
            <DemoCard icon={<ShoppingBag className="w-4 h-4" />} label="תחנת האריזה — מסך הארז" active={false} done={true}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: POP_GREEN_LIGHT, border: `1px solid ${POP_GREEN_BORDER}` }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: POP_GREEN }} />
                  <div className="text-right">
                    <div className="font-semibold text-sm" style={{ color: POP_GREEN_DARK }}>Golden Line הוזרק לתחנת האריזה</div>
                    <div className="text-xs mt-0.5" style={{ color: POP_GREEN }}>הזמנה {DEMO.order.id} · לפני תחילת אריזה</div>
                  </div>
                  <span className="mr-auto text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: "#c8e6c9", color: POP_GREEN_DARK }}>LIVE</span>
                </div>

                <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "#f0faf0", border: `1.5px solid ${POP_GREEN_BORDER}` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-medium" style={{ color: POP_GREEN }}>mypips — תחנת אריזה · פופ ישראל</span>
                  </div>
                  <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "white", border: `2px solid ${POP_GREEN_BORDER}` }}>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: POP_GREEN }}>⚠️ הנחיית Golden Line לאורז</div>
                    <div className="text-lg font-bold text-right leading-snug" style={{ color: POP_GREEN_DARK }}>
                      {DEMO.analysis.golden_line}
                    </div>
                  </div>
                  <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "#e8f5e9", border: `1px solid ${POP_GREEN_BORDER}` }}>
                    <div className="text-sm font-semibold text-right leading-relaxed" style={{ color: POP_GREEN_DARK }}>
                      ✅ האורז קיבל את ההנחיה כהודעה קופצת כשנכנס למסך אריזה ללקוח או בהערות תחת המוצר הרלוונטי בהזמנה
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" style={{ color: POP_GREEN }} />
                  אותה טעות לא תקרה שוב בהזמנה הזו
                </div>
              </div>
            </DemoCard>
          )}
        </div>
      </div>

      {step === "idle" && (
        <div className="flex flex-col items-center justify-center py-12 text-center mt-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 relative" style={{ backgroundColor: "white", border: `2px solid ${POP_GREEN_BORDER}` }}>
            <Play className="w-6 h-6" style={{ color: POP_GREEN }} />
            <span className="absolute -top-2 -right-2 text-lg">🥬</span>
            <span className="absolute -bottom-2 -left-2 text-lg">🍅</span>
          </div>
          <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
            לחץ על <strong>הפעל דמו</strong> כדי לראות את הזרימה המלאה — מתלונת CRM ועד הנחיית אריזה בזמן אמת עבור <strong>פופ ישראל</strong>.
          </p>
        </div>
      )}

      <div className="flex justify-end mt-8 opacity-30">
        <span className="text-3xl">🥬</span>
      </div>
    </div>
  );
}

function PhaseHeader({ number, title, subtitle, active, done, locked }) {
  return (
    <div className={`text-right ${locked ? "opacity-40" : ""}`}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mr-auto"
        style={{ backgroundColor: done ? POP_GREEN : "#e8a838" }}
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
      border: done ? `1.5px solid ${POP_GREEN_BORDER}` : active ? `1.5px solid ${POP_GREEN}` : "1.5px solid #e0e0e0",
      boxShadow: active ? `0 2px 12px rgba(46,125,50,0.12)` : "0 1px 4px rgba(0,0,0,0.06)"
    }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{
          backgroundColor: done ? POP_GREEN_LIGHT : active ? POP_GREEN_LIGHT : "#f5f5f5",
          color: done ? POP_GREEN : active ? POP_GREEN : "#6b7280"
        }}>
          {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : icon}
        </div>
        <span className="text-xs font-semibold" style={{ color: done ? POP_GREEN : active ? POP_GREEN : "#374151" }}>{label}</span>
        {active && (
          <div className="mr-auto flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: POP_GREEN, animationDelay: `${i * 0.15}s` }} />
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