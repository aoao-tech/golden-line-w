import React, { useState, useRef } from "react";
import { Play, RotateCcw, ShoppingBag, MessageSquare, Brain, CheckCircle2, Database, ShoppingCart } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEMO = {
  customer: { name: "מירה כהן", id: "CUST-4412", phone: "052-8834421" },
  complaint: "קיבלתי את ההזמנה היום דרך וולט וממש אכזבה — הקלמנטינות הגיעו רקובות לחלוטין, חלקן עם עובש. ציפיתי לאיכות הרבה יותר גבוהה.",
  analysis: {
    action_code: "fruit_quality",
    golden_line: "לוודא שקלמנטינות ללא פגמים לפני אריזה",
    evidence: "הקלמנטינות הגיעו רקובות לחלוטין, חלקן עם עובש",
    reasoning: "קלמנטינות נארזו ללא בדיקת איכות — חלקן הגיעו רקובות ועם עובש ללקוחה.",
    confidence: 0.96,
  },
  order: {
    id: "ORD-62418",
    items: ["🍊 קלמנטינה \"מיכל\"", "🥑 אבוקדו האס", "🍓 תות שדה מובחר", "🥦 ברוקולי טרי", "🍋 לימון"],
  },
};

const GREEN = "#4a8a3a";
const GREEN_LIGHT = "#edf7e9";
const GREEN_BORDER = "#a8d4a0";
const GREEN_DARK = "#2d5c22";
const YELLOW = "#f5c842";
const YELLOW_LIGHT = "#fffbe6";
const BG = "#f7faf4";

export default function LiveDemoTaamApri() {
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
        restaurant_id: "taam-apri",
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
    <div className="min-h-screen p-5 md:p-8" style={{ backgroundColor: BG, direction: "rtl" }}>

      {/* Header */}
      <div className="mb-6">
        <div className="rounded-2xl overflow-hidden mb-3 flex items-center justify-between px-6 py-4 bg-white shadow-sm" style={{ border: `1.5px solid ${GREEN_BORDER}` }}>
          <div className="flex items-center gap-4">
            <img
              src="https://media.base44.com/images/public/69b423f49e2a082212fdad99/671f8a096_media_19052021154619.png"
              alt="טעם הפרי והירק"
              className="h-16 object-contain"
            />
            <div>
              <div className="text-xs font-medium" style={{ color: GREEN }}>פירות וירקות · משלוח עד הבית</div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium" style={{ color: GREEN }}>דמו Golden Line · taam-apri.co.il</p>

          </div>
        </div>

        <div className="flex items-center justify-between">
          <div />
          {step !== "idle" && (
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm font-medium border rounded-lg px-3 py-2 bg-white hover:bg-slate-50"
              style={{ color: "#555", borderColor: "#ccc" }}
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
            style={{ backgroundColor: GREEN }}
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

          {/* Step 1a — Complaint */}
          <DemoCard icon={<MessageSquare className="w-4 h-4" />} label="תלונת לקוח — Wolt CRM" active={step === "p1_ticket"} done={["p1_analyzing", "p1_stored", ...PHASE2].includes(step)}>
            <div className="flex items-center gap-2 mb-3 flex-wrap text-xs">
              <span className="font-medium px-2 py-1 rounded-lg border" style={{ backgroundColor: GREEN_LIGHT, borderColor: GREEN_BORDER, color: GREEN_DARK }}>👤 {DEMO.customer.name}</span>
              <span className="font-mono px-2 py-1 rounded-lg bg-orange-100 text-orange-700 border border-orange-200">{DEMO.customer.id}</span>
            </div>
            <div className="rounded-xl px-4 py-3 text-sm text-slate-800 leading-relaxed min-h-[80px]" style={{ backgroundColor: "#f9f9f6", border: "1px solid #e0e0d8" }}>
              {step === "idle" ? DEMO.complaint : displayedText}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
              <span>📋 Wolt CRM · הגיע ל-CS</span>
              <span>24/04/2026 · 10:18</span>
            </div>
          </DemoCard>

          {/* Step 1b — AI Analysis */}
          {["p1_analyzing", "p1_stored", ...PHASE2].includes(step) && (
            <DemoCard icon={<Brain className="w-4 h-4" />} label="Agentic AI Analysis" active={step === "p1_analyzing"} done={["p1_stored", ...PHASE2].includes(step)}>
              {step === "p1_analyzing" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>מזהה בעיית איכות פרי...</span>
                    <span className="font-mono font-medium" style={{ color: GREEN }}>{analyzeProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: GREEN_BORDER }}>
                    <div className="h-full rounded-full transition-all duration-150" style={{ width: `${analyzeProgress}%`, backgroundColor: GREEN }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["מנתח תלונה...", "מסווג בעיה...", "מייצר הנחיה..."].map((t, i) => (
                      <div key={i} className="text-[11px] px-2 py-1.5 rounded-lg border text-center" style={{
                        backgroundColor: analyzeProgress > (i + 1) * 28 ? GREEN_LIGHT : "#f9f9f6",
                        borderColor: analyzeProgress > (i + 1) * 28 ? GREEN_BORDER : "#e0e0d8",
                        color: analyzeProgress > (i + 1) * 28 ? GREEN_DARK : "#9ca3af"
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
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: GREEN_BORDER }}>
                          <div className="h-full rounded-full" style={{ width: `${DEMO.analysis.confidence * 100}%`, backgroundColor: GREEN }} />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{(DEMO.analysis.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </ResultField>
                  </div>
                  <ResultField label="ציטוט ראיה">
                    <div className="text-xs px-3 py-2 rounded-lg italic" style={{ backgroundColor: YELLOW_LIGHT, border: `1px solid ${YELLOW}`, color: "#5a4a10" }}>
                      "{DEMO.analysis.evidence}"
                    </div>
                  </ResultField>
                  <ResultField label="🍊 Golden Line — הנחיית אריזה">
                    <div className="text-sm font-bold px-3 py-3 rounded-xl text-right leading-relaxed" style={{ backgroundColor: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`, color: GREEN_DARK }}>
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
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}` }}>
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: GREEN }} />
                <div className="flex-1 text-right">
                  <div className="font-semibold text-sm" style={{ color: GREEN_DARK }}>חוב תפעולי נוצר בהצלחה</div>
                  <div className="text-xs mt-0.5" style={{ color: GREEN }}>{DEMO.customer.name} — מסומנת כ"לקוחה מיוחדת" במערכת</div>
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
            <div className="flex flex-col items-center justify-center py-14 text-center rounded-2xl" style={{ border: `2px dashed ${GREEN_BORDER}`, backgroundColor: "#f5fbf3" }}>
              <ShoppingCart className="w-10 h-10 mb-3" style={{ color: GREEN_BORDER }} />
              <p className="text-sm text-slate-600 mb-1 font-medium">{DEMO.customer.name} מגישה הזמנה חדשה</p>
              <p className="text-xs text-slate-400 mb-5">דרך taam-apri.co.il · אותה חנות</p>
              <button
                onClick={startPhase2}
                className="text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                style={{ backgroundColor: GREEN }}
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
            <DemoCard icon={<ShoppingCart className="w-4 h-4" />} label="הזמנה חדשה נכנסת — taam-apri.co.il" active={step === "p2_order"} done={["p2_triggering", "p2_injected"].includes(step)}>
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                <span className="font-mono px-2 py-1 rounded-lg bg-slate-100 text-slate-600">הזמנה: {DEMO.order.id}</span>
                <span className="font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`, color: GREEN_DARK }}>👤 {DEMO.customer.name}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {DEMO.order.items.map((item, i) => (
                  <div key={i} className="text-sm text-slate-700 px-3 py-2 rounded-lg text-right" style={{ backgroundColor: "#fafaf5", border: "1px solid #e8e8e0" }}>
                    {item}
                  </div>
                ))}
              </div>
              {step === "p2_order" && (
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg" style={{ backgroundColor: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}`, color: GREEN }}>
                  <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin shrink-0" style={{ borderColor: GREEN, borderTopColor: "transparent" }} />
                  בודק מול מסד "מיוחדים" של Golden Line...
                </div>
              )}
              {["p2_triggering", "p2_injected"].includes(step) && (
                <div className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg" style={{ backgroundColor: YELLOW_LIGHT, border: `1px solid ${YELLOW}`, color: "#7a5a10" }}>
                  לקוחה מיוחדת זוהתה! מזריק Golden Line לתחנת האריזה...
                </div>
              )}
            </DemoCard>
          )}

          {/* Step 2b — Packing Station */}
          {step === "p2_injected" && (
            <DemoCard icon={<ShoppingBag className="w-4 h-4" />} label="תחנת האריזה — מסך האורז" active={false} done={true}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: GREEN_LIGHT, border: `1px solid ${GREEN_BORDER}` }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: GREEN }} />
                  <div className="text-right">
                    <div className="font-semibold text-sm" style={{ color: GREEN_DARK }}>Golden Line הוזרק לתחנת האריזה</div>
                    <div className="text-xs mt-0.5" style={{ color: GREEN }}>הזמנה {DEMO.order.id} · לפני תחילת אריזה</div>
                  </div>
                  <span className="mr-auto text-[10px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: GREEN_LIGHT, color: GREEN_DARK, border: `1px solid ${GREEN_BORDER}` }}>LIVE</span>
                </div>

                {/* Packing screen mockup */}
                <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: GREEN_LIGHT, border: `1.5px solid ${GREEN_BORDER}` }}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GREEN }}>טעם הפרי והירק — תחנת אריזה</span>
                  </div>
                  <div className="rounded-xl p-4 mb-3" style={{ backgroundColor: "white", border: `2px solid ${GREEN_BORDER}` }}>
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GREEN }}>⚠️ הנחיית Golden Line לאורז</div>
                    <div className="text-lg font-bold text-right leading-snug" style={{ color: GREEN_DARK }}>
                      {DEMO.analysis.golden_line}
                    </div>
                  </div>
                  <div className="rounded-lg px-4 py-3" style={{ backgroundColor: "#e8f5e9", border: `1px solid ${GREEN_BORDER}` }}>
                    <div className="text-sm font-semibold text-right leading-relaxed" style={{ color: GREEN_DARK }}>
                      ✅ האורז קיבל את ההנחיה כהודעה קופצת כשנכנס למסך אריזה ללקוחה, או בהערות תחת המוצר הרלוונטי בהזמנה
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3" style={{ color: GREEN }} />
                  אותה טעות לא תקרה שוב בהזמנה הזו
                </div>
              </div>
            </DemoCard>
          )}
        </div>
      </div>

      {step === "idle" && (
        <div className="flex flex-col items-center justify-center py-12 text-center mt-4">
          <div className="mb-5">
            <img src="https://media.base44.com/images/public/69b423f49e2a082212fdad99/671f8a096_media_19052021154619.png" alt="טעם הפרי והירק" className="h-16 object-contain" />
          </div>
          <p className="text-slate-600 text-sm max-w-sm leading-relaxed">
            לחץ על <strong>הפעל דמו</strong> כדי לראות את הזרימה המלאה — מתלונת CRM ועד הנחיית אריזה בזמן אמת עבור <strong>טעם הפרי והירק</strong>.
          </p>
        </div>
      )}

      <div className="flex justify-end mt-8 opacity-30">
        <span className="text-3xl">🍊</span>
      </div>
    </div>
  );
}

function PhaseHeader({ number, title, subtitle, active, done, locked }) {
  return (
    <div className={`text-right ${locked ? "opacity-40" : ""}`}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3 mr-auto"
        style={{ backgroundColor: done ? "#4a8a3a" : "#e8a838" }}
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
      border: done ? "1.5px solid #a8d4a0" : active ? "1.5px solid #4a8a3a" : "1.5px solid #e0e0e0",
      boxShadow: active ? "0 2px 12px rgba(74,138,58,0.12)" : "0 1px 4px rgba(0,0,0,0.06)"
    }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{
          backgroundColor: done ? "#edf7e9" : active ? "#edf7e9" : "#f5f5f5",
          color: done ? "#4a8a3a" : active ? "#4a8a3a" : "#6b7280"
        }}>
          {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : icon}
        </div>
        <span className="text-xs font-semibold" style={{ color: done ? "#4a8a3a" : active ? "#4a8a3a" : "#374151" }}>{label}</span>
        {active && (
          <div className="mr-auto flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#4a8a3a", animationDelay: `${i * 0.15}s` }} />
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