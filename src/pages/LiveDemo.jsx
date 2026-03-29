import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, RotateCcw, Zap, ChefHat, MessageSquare, Brain, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const DEMO_SCENARIO = {
  customer_id: "CUST-7741",
  restaurant_id: "REST-202",
  complaint: "Hi, I just received my order and it's a total mess. The soup container was completely open and spilled all over the bag — everything is soaking wet. The fries are soggy and the burger bun is falling apart. I can't even eat this. This is unacceptable, I want a full refund.",
  analysis: {
    action_code: "SPILL",
    golden_line_hebrew: "לאטום את המכסה של המרחק לפני סגירת השקית",
    reasoning_logic: "Soup container was not properly sealed before delivery, causing liquid to spill and damage other food items.",
    evidence_quote: "The soup container was completely open and spilled all over the bag — everything is soaking wet.",
    confidence_score: 0.97,
    failed_items: "Soup container, Fries, Burger bun",
    is_active: true,
  }
};

const STEPS = ["idle", "complaint", "analyzing", "result", "injecting", "injected"];

export default function LiveDemo() {
  const [step, setStep] = useState("idle");
  const [displayedText, setDisplayedText] = useState("");
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [savedDebtId, setSavedDebtId] = useState(null);
  const intervalRef = useRef(null);

  const reset = () => {
    clearInterval(intervalRef.current);
    setStep("idle");
    setDisplayedText("");
    setAnalyzeProgress(0);
    setSavedDebtId(null);
  };

  const startDemo = async () => {
    setStep("complaint");
    setDisplayedText("");

    // Type out the complaint
    let i = 0;
    const text = DEMO_SCENARIO.complaint;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        // Start analyzing after complaint is done
        setTimeout(() => runAnalysis(), 600);
      }
    }, 22);
  };

  const runAnalysis = async () => {
    setStep("analyzing");
    setAnalyzeProgress(0);

    // Progress animation
    let p = 0;
    const prog = setInterval(() => {
      p += Math.random() * 12;
      if (p >= 100) { p = 100; clearInterval(prog); }
      setAnalyzeProgress(Math.round(p));
    }, 120);

    await new Promise(r => setTimeout(r, 2200));
    setStep("result");
    setTimeout(() => handleInject(), 800);
  };

  const handleInject = async () => {
    setStep("injecting");
    try {
      const record = await base44.entities.OperationalDebts.create({
        customer_id: DEMO_SCENARIO.customer_id,
        restaurant_id: DEMO_SCENARIO.restaurant_id,
        ...DEMO_SCENARIO.analysis,
        injected_count: 1,
        source_ticket_id: `ZD-DEMO-${Date.now()}`,
      });
      setSavedDebtId(record.id);
    } catch (e) {
      // still show injected even if save fails for demo
    }
    await new Promise(r => setTimeout(r, 800));
    setStep("injected");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Zap className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Live Demo</h1>
          </div>
          <p className="text-sm text-slate-500 ml-8">Real-time packaging failure detection & kitchen injection</p>
        </div>
        <div className="flex gap-2">
          {step !== "idle" && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
            </Button>
          )}
          {step === "idle" && (
            <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={startDemo}>
              <Play className="w-4 h-4 mr-2" /> Start Demo
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">

        {/* Step 1 - Customer Complaint */}
        <DemoCard
          icon={<MessageSquare className="w-4 h-4" />}
          label="Customer Complaint"
          active={step === "complaint"}
          done={["analyzing", "result", "injecting", "injected"].includes(step)}
          idle={step === "idle"}
        >
          <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
            <span className="font-mono bg-slate-100 px-2 py-1 rounded">Customer: {DEMO_SCENARIO.customer_id}</span>
            <span className="font-mono bg-slate-100 px-2 py-1 rounded">Restaurant: {DEMO_SCENARIO.restaurant_id}</span>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed min-h-[80px]">
            {step === "idle" ? (
              <span className="text-slate-300 italic">Waiting for incoming complaint...</span>
            ) : (
              <>
                {displayedText}
                {step === "complaint" && <span className="inline-block w-0.5 h-4 bg-slate-600 ml-0.5 animate-pulse" />}
              </>
            )}
          </div>
        </DemoCard>

        {/* Step 2 - AI Analysis */}
        {["analyzing", "result", "injecting", "injected"].includes(step) && (
          <DemoCard
            icon={<Brain className="w-4 h-4" />}
            label="AI Analysis"
            active={step === "analyzing"}
            done={["result", "injecting", "injected"].includes(step)}
          >
            {step === "analyzing" ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Analyzing complaint for packaging failures...</span>
                  <span className="font-mono font-medium">{analyzeProgress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-150"
                    style={{ width: `${analyzeProgress}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["Tokenizing text...", "Classifying failure...", "Generating instruction..."].map((t, i) => (
                    <div key={i} className={`text-xs px-3 py-2 rounded bg-slate-50 border border-slate-200 text-slate-500 ${analyzeProgress > (i + 1) * 30 ? "border-amber-200 text-amber-700 bg-amber-50" : ""}`}>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <ResultField label="Action Code">
                  <code className="text-xs bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded font-mono block">
                    {DEMO_SCENARIO.analysis.action_code}
                  </code>
                </ResultField>
                <ResultField label="Confidence Score">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${DEMO_SCENARIO.analysis.confidence_score * 100}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{(DEMO_SCENARIO.analysis.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                </ResultField>
                <ResultField label="Evidence Quote" className="col-span-2">
                  <div className="text-sm bg-amber-50 border border-amber-200 px-3 py-2 rounded text-slate-700 italic">
                    "{DEMO_SCENARIO.analysis.evidence_quote}"
                  </div>
                </ResultField>
                <ResultField label="Reasoning" className="col-span-2">
                  <div className="text-sm text-slate-600">{DEMO_SCENARIO.analysis.reasoning_logic}</div>
                </ResultField>
                <ResultField label="🍳 Golden Line (Kitchen Instruction)" className="col-span-2">
                  <div className="text-base font-medium bg-amber-500/10 border border-amber-400/30 text-amber-900 px-4 py-3 rounded-lg text-right" dir="rtl">
                    {DEMO_SCENARIO.analysis.golden_line_hebrew}
                  </div>
                </ResultField>
              </div>
            )}
          </DemoCard>
        )}

        {/* Step 3 - Inject to Kitchen */}
        {["result", "injecting", "injected"].includes(step) && (
          <DemoCard
            icon={<ChefHat className="w-4 h-4" />}
            label="Kitchen Injection"
            active={step === "injecting"}
            done={step === "injected"}
          >
            {step === "result" && (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                Sending instruction to kitchen system...
              </div>
            )}
            {step === "injecting" && (
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                Sending instruction to kitchen system...
              </div>
            )}
            {step === "injected" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-semibold text-emerald-800 text-sm">Successfully Injected to Kitchen</div>
                    <div className="text-xs text-emerald-600 mt-0.5">
                      The golden line instruction has been sent to restaurant {DEMO_SCENARIO.restaurant_id}
                    </div>
                  </div>
                  <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-emerald-200">LIVE</Badge>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-medium">Kitchen received:</div>
                  <div className="text-xl font-semibold text-slate-900 text-right" dir="rtl">
                    {DEMO_SCENARIO.analysis.golden_line_hebrew}
                  </div>
                </div>
                {savedDebtId && (
                  <p className="text-xs text-slate-400">Saved to operational debts — ID: <code className="font-mono">{savedDebtId}</code></p>
                )}
              </div>
            )}
          </DemoCard>
        )}

        {/* Idle state */}
        {step === "idle" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
              <Play className="w-6 h-6 text-amber-500" />
            </div>
            <p className="text-slate-500 text-sm">Press <strong>Start Demo</strong> to simulate a live customer complaint being processed by the Golden Line system.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DemoCard({ icon, label, active, done, idle, children }) {
  return (
    <div className={`rounded-xl border p-5 transition-all duration-300 ${
      done ? "border-emerald-200 bg-emerald-50/30" :
      active ? "border-amber-300 bg-amber-50/40 shadow-sm shadow-amber-100" :
      "border-slate-200 bg-white"
    }`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
          done ? "bg-emerald-100 text-emerald-600" :
          active ? "bg-amber-100 text-amber-600" :
          "bg-slate-100 text-slate-500"
        }`}>
          {done ? <CheckCircle2 className="w-4 h-4" /> : icon}
        </div>
        <span className={`text-sm font-semibold ${
          done ? "text-emerald-700" : active ? "text-amber-700" : "text-slate-700"
        }`}>{label}</span>
        {active && <div className="ml-auto flex gap-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{animationDelay: `${i * 0.15}s`}} />)}</div>}
      </div>
      {children}
    </div>
  );
}

function ResultField({ label, children, className = "" }) {
  return (
    <div className={className}>
      <div className="text-xs text-slate-500 font-medium mb-1.5">{label}</div>
      {children}
    </div>
  );
}