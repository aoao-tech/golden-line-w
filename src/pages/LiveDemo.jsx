import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Zap, ChefHat, MessageSquare, Brain, CheckCircle2, Database, ShoppingCart, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEMO_SCENARIO = {
  customer_id: "CUST-7741",
  restaurant_id: "REST-202",
  ticket_id: "ZD-48821",
  complaint: "Hi, I just received my order and it's a total mess. The soup container was completely open and spilled all over the bag — everything is soaking wet. The fries are soggy and the burger bun is falling apart. I can't even eat this. This is unacceptable, I want a full refund.",
  analysis: {
    action_code: "SPILL",
    golden_line_hebrew: "לאטום את המכסה של המרק עם מכסה כפול",
    reasoning_logic: "Soup container was not properly sealed before delivery, causing liquid to spill and damage other food items.",
    evidence_quote: "The soup container was completely open and spilled all over the bag — everything is soaking wet.",
    confidence_score: 0.97,
    failed_items: "Soup container, Fries, Burger bun",
    is_active: true,
  },
  new_order: {
    order_id: "ORD-99312",
    items: ["Tomato Soup", "Crispy Fries", "Classic Burger"],
  }
};

// Phase 1 steps: idle → p1_ticket → p1_analyzing → p1_stored
// Phase 2 steps: p2_order → p2_triggering → p2_injected

export default function LiveDemo() {
  const [step, setStep] = useState("idle");
  const [displayedText, setDisplayedText] = useState("");
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [savedDebtId, setSavedDebtId] = useState(null);
  const intervalRef = useRef(null);

  const PHASE1_STEPS = ["p1_ticket", "p1_analyzing", "p1_stored"];
  const PHASE2_STEPS = ["p2_order", "p2_triggering", "p2_injected"];

  const inPhase1 = PHASE1_STEPS.includes(step);
  const inPhase2 = PHASE2_STEPS.includes(step);
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
    const text = DEMO_SCENARIO.complaint;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        setTimeout(() => runAnalysis(), 600);
      }
    }, 20);
  };

  const runAnalysis = async () => {
    setStep("p1_analyzing");
    setAnalyzeProgress(0);
    let p = 0;
    const prog = setInterval(() => {
      p += Math.random() * 12;
      if (p >= 100) { p = 100; clearInterval(prog); }
      setAnalyzeProgress(Math.round(p));
    }, 120);
    await new Promise(r => setTimeout(r, 2200));
    clearInterval(prog);
    setAnalyzeProgress(100);

    // Save to DB
    try {
      const record = await base44.entities.OperationalDebts.create({
        customer_id: DEMO_SCENARIO.customer_id,
        restaurant_id: DEMO_SCENARIO.restaurant_id,
        ...DEMO_SCENARIO.analysis,
        injected_count: 0,
        source_ticket_id: DEMO_SCENARIO.ticket_id,
      });
      setSavedDebtId(record.id);
    } catch (e) { /* show anyway */ }

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
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Zap className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Live Demo</h1>
          </div>
          <p className="text-sm text-slate-500 ml-8">End-to-end Golden Line flow — from complaint to kitchen protection</p>
        </div>
        <div className="flex gap-2">
          {step !== "idle" && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
          )}
          {step === "idle" && (
            <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={startPhase1}>
              <Play className="w-4 h-4 mr-2" /> Start Demo
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── PHASE 1 ── */}
        <div className="space-y-4">
          <PhaseHeader
            number="1"
            title="Ticket Analysis & Learning"
            subtitle="Closed CRM ticket → AI analysis → Golden Line stored"
            active={inPhase1}
            done={phase1Done}
          />

          {/* Step 1a — CRM Ticket */}
          <DemoCard
            icon={<MessageSquare className="w-4 h-4" />}
            label="Closed Support Ticket (Zendesk)"
            active={step === "p1_ticket"}
            done={["p1_analyzing", "p1_stored", ...PHASE2_STEPS].includes(step)}
            idle={step === "idle"}
          >
            <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
              <span className="font-mono bg-slate-100 px-2 py-1 rounded">Ticket: {DEMO_SCENARIO.ticket_id}</span>
              <span className="font-mono bg-slate-100 px-2 py-1 rounded">Customer: {DEMO_SCENARIO.customer_id}</span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-normal text-[10px]">Closed</Badge>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-3 text-sm text-slate-700 leading-relaxed min-h-[80px]">
              {step === "idle" ? (
                <span className="text-slate-300 italic">Fetching closed ticket from CRM...</span>
              ) : (
                <>
                  {displayedText}
                  {step === "p1_ticket" && <span className="inline-block w-0.5 h-4 bg-slate-600 ml-0.5 animate-pulse" />}
                </>
              )}
            </div>
          </DemoCard>

          {/* Step 1b — AI Analysis */}
          {["p1_analyzing", "p1_stored", ...PHASE2_STEPS].includes(step) && (
            <DemoCard
              icon={<Brain className="w-4 h-4" />}
              label="AI Analysis"
              active={step === "p1_analyzing"}
              done={["p1_stored", ...PHASE2_STEPS].includes(step)}
            >
              {step === "p1_analyzing" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Detecting packaging failure pattern...</span>
                    <span className="font-mono font-medium">{analyzeProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-150" style={{ width: `${analyzeProgress}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["Tokenizing...", "Classifying...", "Generating..."].map((t, i) => (
                      <div key={i} className={`text-[11px] px-2 py-1.5 rounded border text-center ${analyzeProgress > (i + 1) * 30 ? "border-amber-200 text-amber-700 bg-amber-50" : "border-slate-200 text-slate-400 bg-slate-50"}`}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <ResultField label="Action Code">
                      <code className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded font-mono block">{DEMO_SCENARIO.analysis.action_code}</code>
                    </ResultField>
                    <ResultField label="Confidence">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${DEMO_SCENARIO.analysis.confidence_score * 100}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{(DEMO_SCENARIO.analysis.confidence_score * 100).toFixed(0)}%</span>
                      </div>
                    </ResultField>
                  </div>
                  <ResultField label="Evidence">
                    <div className="text-xs bg-amber-50 border border-amber-200 px-3 py-2 rounded text-slate-700 italic">"{DEMO_SCENARIO.analysis.evidence_quote}"</div>
                  </ResultField>
                  <ResultField label="🍳 Golden Line">
                    <div className="text-sm font-semibold bg-amber-500/10 border border-amber-400/30 text-amber-900 px-3 py-2.5 rounded-lg text-right" dir="rtl">
                      {DEMO_SCENARIO.analysis.golden_line_hebrew}
                    </div>
                  </ResultField>
                </div>
              )}
            </DemoCard>
          )}

          {/* Step 1c — Stored in DB */}
          {["p1_stored", ...PHASE2_STEPS].includes(step) && (
            <DemoCard
              icon={<Database className="w-4 h-4" />}
              label="Stored in Golden Line Database"
              active={false}
              done={true}
            >
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-emerald-800 text-sm">Operational debt created</div>
                  <div className="text-xs text-emerald-600 mt-0.5">Customer {DEMO_SCENARIO.customer_id} — active debt flagged</div>
                </div>
              </div>
              {savedDebtId && (
                <p className="text-[11px] text-slate-400 mt-2">DB record: <code className="font-mono">{savedDebtId}</code></p>
              )}
            </DemoCard>
          )}
        </div>

        {/* ── DIVIDER ARROW ── */}
        <div className="hidden lg:flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2 mt-16 pointer-events-none">
          <ArrowRight className="w-6 h-6 text-slate-300" />
        </div>

        {/* ── PHASE 2 ── */}
        <div className="space-y-4">
          <PhaseHeader
            number="2"
            title="Next Order Protection"
            subtitle="Same customer reorders → Golden Line injected to kitchen"
            active={inPhase2}
            done={phase2Done}
            locked={!phase1Done}
          />

          {/* Trigger Phase 2 */}
          {step === "p1_stored" && (
            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-200 rounded-xl">
              <ShoppingCart className="w-8 h-8 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500 mb-4">
                Simulate <strong>{DEMO_SCENARIO.customer_id}</strong> placing a new order from <strong>{DEMO_SCENARIO.restaurant_id}</strong>
              </p>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={startPhase2}>
                <ShoppingCart className="w-4 h-4 mr-2" /> Simulate New Order
              </Button>
            </div>
          )}

          {step === "idle" && (
            <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-slate-100 rounded-xl opacity-40">
              <ShoppingCart className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs text-slate-400">Complete Phase 1 to unlock</p>
            </div>
          )}

          {/* Step 2a — New Order Placed */}
          {PHASE2_STEPS.includes(step) && (
            <DemoCard
              icon={<ShoppingCart className="w-4 h-4" />}
              label="New Order Placed"
              active={step === "p2_order"}
              done={["p2_triggering", "p2_injected"].includes(step)}
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap text-xs">
                <span className="font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">Order: {DEMO_SCENARIO.new_order.order_id}</span>
                <span className="font-mono bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded font-semibold">👤 Customer: {DEMO_SCENARIO.customer_id}</span>
                <span className="font-mono bg-amber-100 text-amber-800 border border-amber-300 px-2 py-1 rounded font-semibold">🍽️ Restaurant: {DEMO_SCENARIO.restaurant_id}</span>
              </div>
              <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded mb-3 font-medium">✨ Same customer · Same restaurant · Same dishes — identical to the order that caused the complaint</div>
              <div className="space-y-1.5">
                {DEMO_SCENARIO.new_order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 px-3 py-2 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              {step === "p2_order" && (
                <div className="flex items-center gap-2 mt-3 text-xs text-amber-600">
                  <div className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  Matching against Golden Line database...
                </div>
              )}
              {["p2_triggering", "p2_injected"].includes(step) && (
                <div className="flex items-center gap-2 mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  Active debt found for <strong>{DEMO_SCENARIO.customer_id}</strong> — injecting Golden Line to kitchen
                </div>
              )}
            </DemoCard>
          )}


          {/* Step 2c — Kitchen Receives Instruction */}
          {step === "p2_injected" && (
            <DemoCard
              icon={<ChefHat className="w-4 h-4" />}
              label="Kitchen Instruction Delivered"
              active={false}
              done={true}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-emerald-800 text-sm">Kitchen received the Golden Line</div>
                    <div className="text-xs text-emerald-600 mt-0.5">Restaurant {DEMO_SCENARIO.restaurant_id} — before preparation of order {DEMO_SCENARIO.new_order.order_id}</div>
                  </div>
                  <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200 shrink-0">LIVE</Badge>
                </div>
                <div className="bg-white border border-amber-300 rounded-lg p-4 shadow-sm">
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 font-medium">📋 Chef's screen now shows:</div>
                  <div className="text-xl font-bold text-slate-900 text-right leading-relaxed" dir="rtl">
                    {DEMO_SCENARIO.analysis.golden_line_hebrew}
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Same mistake will not happen again on this order.
                </div>
              </div>
            </DemoCard>
          )}
        </div>
      </div>

      {/* Idle state */}
      {step === "idle" && (
        <div className="flex flex-col items-center justify-center py-16 text-center mt-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
            <Play className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-slate-500 text-sm max-w-md">Press <strong>Start Demo</strong> to simulate the full Golden Line flow — from a closed support ticket all the way to real-time kitchen protection on the next order.</p>
        </div>
      )}
    </div>
  );
}

function PhaseHeader({ number, title, subtitle, active, done, locked }) {
  return (
    <div className={`flex items-start gap-3 pb-3 border-b ${locked ? "opacity-40" : ""} ${active ? "border-amber-200" : done ? "border-emerald-200" : "border-slate-200"}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${
        done ? "bg-emerald-500 text-white" : active ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-500"
      }`}>
        {done ? <CheckCircle2 className="w-4 h-4" /> : number}
      </div>
      <div>
        <div className={`font-semibold text-sm ${done ? "text-emerald-700" : active ? "text-amber-700" : "text-slate-700"}`}>{title}</div>
        <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>
      </div>
    </div>
  );
}

function DemoCard({ icon, label, active, done, idle, children }) {
  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 ${
      done ? "border-emerald-200 bg-emerald-50/30" :
      active ? "border-amber-300 bg-amber-50/40 shadow-sm shadow-amber-100" :
      "border-slate-200 bg-white"
    }`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${
          done ? "bg-emerald-100 text-emerald-600" :
          active ? "bg-amber-100 text-amber-600" :
          "bg-slate-100 text-slate-500"
        }`}>
          {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : icon}
        </div>
        <span className={`text-xs font-semibold ${done ? "text-emerald-700" : active ? "text-amber-700" : "text-slate-700"}`}>{label}</span>
        {active && <div className="ml-auto flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{animationDelay: `${i * 0.15}s`}} />)}</div>}
      </div>
      {children}
    </div>
  );
}

function ResultField({ label, children, className = "" }) {
  return (
    <div className={className}>
      <div className="text-[11px] text-slate-400 font-medium mb-1">{label}</div>
      {children}
    </div>
  );
}