import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, RefreshCw, CheckCircle2, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── HEADER ── */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-white font-bold text-xs">GL</span>
            </div>
            <span className="text-slate-900 font-semibold text-base tracking-tight">Golden Line</span>
          </div>
          <Link
            to="/LiveDemo"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded-lg px-4 py-2 hover:border-slate-300"
          >
            Login
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-6 bg-[#0B1629]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 tracking-wide uppercase">
            <Zap className="w-3 h-3" /> AI-Powered Operations Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
            Stop Repeat Refunds.<br />
            <span className="text-blue-400">Close the Loop</span> Between<br className="hidden sm:block" /> CS and Operations.
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Our AI processes customer complaints into actionable packing instructions, delivered directly to your staff's screen during the next order.
          </p>
          <Link
            to="/LiveDemo"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-700/40 hover:-translate-y-0.5"
          >
            See it in action <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── THE PROBLEM ── */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">The Problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">The data dead-end that costs you every day</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-red-100 p-7 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-400 rounded-l-2xl" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Step 1 — The Dead End</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Customer gets a refund</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A damaged delivery triggers a complaint. Your CS team issues a refund and closes the ticket in Salesforce. Case closed — or so it seems.
              </p>
              <div className="mt-4 bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-xs text-red-600 font-medium">
                💸 Refund issued · Ticket closed · Data buried in CRM
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-orange-100 p-7 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-400 rounded-l-2xl" />
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Step 2 — The Repeat</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">The same mistake happens again</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                The customer reorders. The packer has no idea about the previous complaint. They pack it exactly the same way. Another damaged delivery. Another refund.
              </p>
              <div className="mt-4 bg-orange-50 border border-orange-100 rounded-lg px-4 py-3 text-xs text-orange-600 font-medium">
                📦 Same packer · Same mistake · Same refund
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE SOLUTION ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">The Solution</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              One line of insight.<br />Zero repeat mistakes.
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Golden Line distills every complaint into a single, actionable instruction — printed directly on the packer's next order slip.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              {
                step: "01",
                title: "Complaint comes in",
                desc: "A closed CS ticket is ingested automatically from Zendesk, Salesforce, or your CRM.",
                color: "bg-blue-50 border-blue-100 text-blue-700",
                dot: "bg-blue-500",
              },
              {
                step: "02",
                title: "AI extracts the root cause",
                desc: "Our model identifies the exact packaging failure and generates a precise Hebrew kitchen instruction.",
                color: "bg-indigo-50 border-indigo-100 text-indigo-700",
                dot: "bg-indigo-500",
              },
              {
                step: "03",
                title: "Delivered to the packer",
                desc: "On the next order from that customer and restaurant, the instruction appears on the kitchen screen — before preparation.",
                color: "bg-emerald-50 border-emerald-100 text-emerald-700",
                dot: "bg-emerald-500",
              },
            ].map(({ step, title, desc, color, dot }) => (
              <div key={step} className={`rounded-2xl border p-7 ${color}`}>
                <div className={`w-2 h-2 rounded-full ${dot} mb-5`} />
                <div className="text-3xl font-black opacity-20 mb-2">{step}</div>
                <h3 className="font-bold text-slate-800 text-base mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Sample output */}
          <div className="max-w-xl mx-auto bg-[#0B1629] rounded-2xl p-8 text-center shadow-xl">
            <div className="text-xs text-slate-400 uppercase tracking-widest mb-4 font-medium">📋 What the packer sees</div>
            <div className="text-2xl font-bold text-white leading-relaxed text-right mb-4" dir="rtl">
              לאטום מכסה המרק עם טייפ לפני סגירת השקית
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Injected automatically · Zero manual effort
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-24 px-6 bg-[#0B1629]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Ready to close the loop?</h2>
          <p className="text-slate-400 text-lg mb-10">See the full flow live — from complaint to kitchen instruction in under 10 seconds.</p>
          <Link
            to="/LiveDemo"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-700/40 hover:-translate-y-0.5"
          >
            See it in action <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-6 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
              <span className="text-white font-bold text-[9px]">GL</span>
            </div>
            <span className="text-slate-400 text-xs">Golden Line © 2026</span>
          </div>
          <span className="text-slate-400 text-xs">AI-powered operations intelligence</span>
        </div>
      </footer>

    </div>
  );
}