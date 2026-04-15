import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Zap, ShoppingBag, MessageSquare, Brain, CheckCircle2, Database, ShoppingCart, ArrowRight, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEMO = {
  customer: { name: "מירה כהן", id: "CUST-4412", phone: "052-8834421" },
  complaint: "קיבלתי את הסל היום וחצי מהירקות היו מרוקבים - המלפפונים והעלים הירוקים לא ראויים לאכילה. מאוד מאכזב אחרי שאני לקוחה נאמנה כבר שנתיים.",
  analysis: {
    action_code: "נזק_באריזה",
    golden_line: "לבדוק את איכות הירקות הרגישים - מלפפון/עלים ירוקים - לפני סגירת הסל",
    evidence: "המלפפונים והעלים הירוקים לא ראויים לאכילה",
    reasoning: "המוצרים הרגישים (מלפפונים ועלים) לא נבדקו לפני אריזה, הגיעו ללקוח ברמת איכות נמוכה.",
    confidence: 0.94,
  },
  order: {
    id: "ORD-78831",
    items: ["🥒 מלפפונים (500 גר')", "🥬 תרד טרי - עלים ירוקים", "🍅 עגבניות שרי", "🍋 לימונים מהחווה", "🌿 פטרוזיליה טרייה"],
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
    setDisplayedText("");
    let i = 0;
    const text = DEMO.complaint;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        setTimeout(() => runAnalysis(), 700);
      }
    }, 22);
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
        source_ticket_id: "WA-" + DEMO.customer.id,
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
    <div className="min-h-screen bg-[#f8faf6] p-6 md:p-10" dir="rtl">

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">💚</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">סל מהטבע — דפנה אמון</h1>
              <p className="text-xs text-green-600 font-medium">דמו Golden Line • מופעל על mypips.app</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {step !== "idle" && (
            <Button variant="outline" size="sm" onClick={reset} className="gap-1.5 text-slate-600">
              <RotateCcw className="w-3.5 h-3.5" /> אתחול
            </Button>
          )}
          {step === "idle" && (
            <Button className="bg-green-600 hover:bg-green-700 text-white gap-2 shadow-md" onClick={startPhase1}>
              <Play className="w-4 h-4" /> הפעל דמו
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── PHASE 1 ── */}
        <div className="space-y-4">
          <PhaseHeader
            number="1"
            title="זיהוי תלונה ולמידה"
            subtitle="תלונת לקוח ← ניתוח AI ← Golden Line נשמר"
            active={inPhase1}
            done={phase1Done}
          />

          {/* Step 1a — WhatsApp Complaint */}
          <DemoCard
            icon={<MessageSquare className="w-4 h-4" />}
            label="תלונת לקוח — וואטסאפ"
            active={step === "p1_ticket"}
            done={["p1_analyzing", "p1_stored", ...PHASE2].includes(step)}
            idle={step === "idle"}
          >
            <div className="flex items-center gap-2 mb-3 flex-wrap text-xs text-slate-500">
              <span className="font-medium bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded-md">👤 {DEMO.customer.name}</span>
              <span className="font-mono bg-slate-100 px-2 py-1 rounded">{DEMO.customer.id}</span>
              <Badge className="bg-green-50 text-green-700 border-green-200 font-normal text-[10px] gap-1"><Star className="w-2.5 h-2.5" />לקוחה נאמנה 2 שנים</Badge>
            </div>
            {/* WhatsApp bubble */}
            <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-800 leading-relaxed min-h-[80px] relative shadow-sm">
              <div className="absolute top-2 left-2 w-2 h-2 bg-[#dcf8c6]" style={{clipPath: 'polygon(100% 0, 0 0, 100% 100%)'}} />
              {step === "idle" ? (
                <span className="text-slate-400 italic text-xs">ממתין לקבלת הודעת וואטסאפ...</span>
              ) : (
                <>
                  {displayedText}
                  {step === "p1_ticket" && <span className="inline-block w-0.5 h-4 bg-slate-600 ml-0.5 animate-pulse" />}
                </>
              )}
            </div>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
              <span>📱 WhatsApp · הגיע ל-CS</span>
              <span>14/04/2026 · 09:32</span>
            </div>
          </DemoCard>

          {/* Step 1b — AI Analysis */}
          {["p1_analyzing", "p1_stored", ...PHASE2].includes(step) && (
            <DemoCard
              icon={<Brain className="w-4 h-4" />}
              label="ניתוח AI אוטומטי"
              active={step === "p1_analyzing"}
              done={["p1_stored", ...PHASE2].includes(step)}
            >
              {step === "p1_analyzing" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>מזהה בעיית איכות ירקות...</span>
                    <span className="font-mono font-medium">{analyzeProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-150" style={{ width: `${analyzeProgress}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["מנתח תלונה...", "מסווג בעיה...", "מייצר הנחיה..."].map((t, i) => (
                      <div key={i} className={`text-[11px] px-2 py-1.5 rounded border text-center ${analyzeProgress > (i + 1) * 28 ? "border-green-200 text-green-700 bg-green-50" : "border-slate-200 text-slate-400 bg-slate-50"}`}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <ResultField label="קוד פעולה">
                      <code className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded font-mono block">{DEMO.analysis.action_code}</code>
                    </ResultField>
                    <ResultField label="ביטחון AI">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${DEMO.analysis.confidence * 100}%` }} />
                        </div>
                        <span className="text-sm font-bold text-slate-900">{(DEMO.analysis.confidence * 100).toFixed(0)}%</span>
                      </div>
                    </ResultField>
                  </div>
                  <ResultField label="ציטוט ראיה">
                    <div className="text-xs bg-orange-50 border border-orange-200 px-3 py-2 rounded text-slate-700 italic">
                      "{DEMO.analysis.evidence}"
                    </div>
                  </ResultField>
                  <ResultField label="🌿 Golden Line — הנחיית אריזה">
                    <div className="text-sm font-bold bg-green-500/10 border border-green-400/30 text-green-900 px-3 py-3 rounded-xl text-right leading-relaxed">
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
              label='נשמר ב־Golden Line — "מיוחדים"'
              active={false}
              done={true}
            >
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div className="flex-1 text-right">
                  <div className="font-semibold text-green-800 text-sm">חוב תפעולי נוצר בהצלחה</div>
                  <div className="text-xs text-green-600 mt-0.5">{DEMO.customer.name} — מסומנת כ"לקוחה מיוחדת" במערכת</div>
                </div>
              </div>
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 text-right">
                💡 בעבר: הCSM הייתה מוסיפה ידנית לאקסל "מיוחדים". עכשיו זה אוטומטי.
              </div>
              {savedDebtId && (
                <p className="text-[11px] text-slate-400 mt-2 text-left">מזהה רשומה: <code className="font-mono">{savedDebtId.slice(0, 16)}...</code></p>
              )}
            </DemoCard>
          )}
        </div>

        {/* Arrow (desktop) */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 top-1/2 pointer-events-none opacity-0">
          <ArrowRight className="w-6 h-6 text-slate-300 -scale-x-100" />
        </div>

        {/* ── PHASE 2 ── */}
        <div className="space-y-4">
          <PhaseHeader
            number="2"
            title="הגנה על ההזמנה הבאה"
            subtitle="אותה לקוחה מזמינה שוב ← התראה לאריזה ← הגנה אוטומטית"
            active={inPhase2}
            done={phase2Done}
            locked={!phase1Done}
          />

          {/* Trigger Phase 2 */}
          {step === "p1_stored" && (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-green-200 rounded-2xl bg-green-50/50">
              <ShoppingCart className="w-9 h-9 text-green-400 mb-3" />
              <p className="text-sm text-slate-600 mb-1 font-medium">
                {DEMO.customer.name} מגישה הזמנה חדשה
              </p>
              <p className="text-xs text-slate-400 mb-4">דרך mypips.app · אותה חנות</p>
              <Button className="bg-green-600 hover:bg-green-700 text-white gap-2" onClick={startPhase2}>
                <ShoppingCart className="w-4 h-4" /> סמלץ הזמנה חדשה
              </Button>
            </div>
          )}

          {step === "idle" && (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl opacity-40">
              <ShoppingCart className="w-8 h-8 text-slate-300 mb-2" />
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
                <span className="font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">הזמנה: {DEMO.order.id}</span>
                <span className="font-medium bg-green-100 text-green-800 border border-green-300 px-2 py-1 rounded">👤 {DEMO.customer.name}</span>
                <span className="font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded">{DEMO.customer.id}</span>
              </div>
              <div className="space-y-1.5 mb-3">
                {DEMO.order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-right">
                    <span className="flex-1">{item}</span>
                  </div>
                ))}
              </div>
              {step === "p2_order" && (
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                  <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin shrink-0" />
                  בודק מול מסד "מיוחדים" של Golden Line...
                </div>
              )}
              {["p2_triggering", "p2_injected"].includes(step) && (
                <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg font-medium">
                  ⚠️ לקוחה מיוחדת זוהתה! מזריק Golden Line לתחנת האריזה...
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
                <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  <div className="text-right">
                    <div className="font-semibold text-green-800 text-sm">Golden Line הוזרק לתחנת האריזה</div>
                    <div className="text-xs text-green-600 mt-0.5">הזמנה {DEMO.order.id} · לפני תחילת אריזה</div>
                  </div>
                  <Badge className="mr-auto bg-green-100 text-green-700 border-green-200 shrink-0 text-[10px]">LIVE</Badge>
                </div>

                {/* Packing station screen mockup */}
                <div className="bg-slate-900 rounded-2xl p-5 shadow-xl border border-slate-700">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-slate-500 text-xs mr-2">mypips — תחנת אריזה</span>
                  </div>

                  <div className="bg-amber-500/15 border-2 border-amber-400 rounded-xl p-4 mb-3">
                    <div className="text-amber-300 text-[10px] font-bold uppercase tracking-widest mb-2">⚠️ לקוח מיוחד</div>
                    <div className="text-white text-lg font-bold text-right leading-snug">
                      לקוח מיוחד — לבדוק כל פריט לפני סגירת הסל
                    </div>
                  </div>

                  <div className="bg-green-900/40 border border-green-600/40 rounded-lg px-4 py-3">
                    <div className="text-green-300 text-xs font-medium text-right leading-relaxed">
                      🌿 {DEMO.analysis.golden_line}
                    </div>
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  אותה טעות לא תקרה שוב בהזמנה הזו
                </div>
              </div>
            </DemoCard>
          )}
        </div>
      </div>

      {/* Idle state */}
      {step === "idle" && (
        <div className="flex flex-col items-center justify-center py-16 text-center mt-2">
          <div className="w-14 h-14 rounded-2xl bg-green-100 border border-green-200 flex items-center justify-center mb-4">
            <Play className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-slate-500 text-sm max-w-md">
            לחץ על <strong>הפעל דמו</strong> כדי לראות את הזרימה המלאה — מתלונת וואטסאפ ועד הנחיית אריזה בזמן אמת עבור <strong>סל מהטבע</strong>.
          </p>
        </div>
      )}
    </div>
  );
}

function PhaseHeader({ number, title, subtitle, active, done, locked }) {
  return (
    <div className={`flex items-start gap-3 pb-3 border-b ${locked ? "opacity-40" : ""} ${active ? "border-green-300" : done ? "border-green-200" : "border-slate-200"}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
        done ? "bg-green-500 text-white" : active ? "bg-green-500 text-white" : "bg-slate-200 text-slate-500"
      }`}>
        {done ? <CheckCircle2 className="w-4 h-4" /> : number}
      </div>
      <div className="text-right">
        <div className={`font-bold text-sm ${done ? "text-green-700" : active ? "text-green-700" : "text-slate-700"}`}>{title}</div>
        <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

function DemoCard({ icon, label, active, done, idle, children }) {
  return (
    <div className={`rounded-2xl border p-4 transition-all duration-300 ${
      done ? "border-green-200 bg-green-50/30" :
      active ? "border-green-400 bg-green-50/40 shadow-sm shadow-green-100" :
      "border-slate-200 bg-white"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
          done ? "bg-green-100 text-green-600" :
          active ? "bg-green-100 text-green-600" :
          "bg-slate-100 text-slate-500"
        }`}>
          {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : icon}
        </div>
        <span className={`text-xs font-semibold ${done ? "text-green-700" : active ? "text-green-700" : "text-slate-700"}`}>{label}</span>
        {active && (
          <div className="mr-auto flex gap-1">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
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
      <div className="text-[11px] text-slate-400 font-medium mb-1 text-right">{label}</div>
      {children}
    </div>
  );
}