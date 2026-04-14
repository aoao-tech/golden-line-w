import { useState } from "react";
import LiveDemo from "./LiveDemo";
import { ArrowRight, AlertCircle, RefreshCw, CheckCircle2, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

function WaitlistSection({ inline = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await base44.entities.WaitlistEntry.create({ email });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (inline) return (
    <div className="text-center">
      <p className="text-amber-900 font-semibold text-sm mb-3">Join the waitlist, be first in line.</p>
      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 bg-white/30 border border-white/50 text-amber-900 px-5 py-3 rounded-xl text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> You're on the list!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input type="email" required placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/60 border border-white/80 text-slate-900 placeholder-amber-800/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:bg-white transition-colors" />
          <button type="submit" disabled={status === "loading"}
            className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-semibold text-sm px-5 py-3 rounded-xl transition-all whitespace-nowrap">
            {status === "loading" ? "Joining..." : <>Join <ArrowRight className="w-3.5 h-3.5" /></>}
          </button>
        </form>
      )}
      {status === "error" && <p className="text-red-700 text-xs mt-2">Something went wrong. Please try again.</p>}
    </div>
  );

  return (
    <section className="py-24 px-6 bg-[#0B1629]">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Early Access</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">Join the waitlist</h2>
        <p className="text-slate-400 text-base mb-8">Be the first to know when Golden Line is ready for your team.</p>
        {status === "success" ? (
          <div className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-xl">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="font-medium">You're on the list! We'll be in touch.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all duration-200 whitespace-nowrap"
            >
              {status === "loading" ? "Joining..." : <>Get Early Access <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-red-400 text-xs mt-3">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  );
}

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
          <a
            href="#demo"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors border border-slate-200 rounded-lg px-4 py-2 hover:border-slate-300"
          >
            Live Demo
          </a>
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
          <a
              href="#demo"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-900/40 hover:shadow-blue-700/40 hover:-translate-y-0.5"
          >
            See it in action <ArrowRight className="w-4 h-4" />
          </a>

          {/* Inline waitlist */}
          <div className="mt-10 max-w-md mx-auto bg-amber-400/90 rounded-2xl px-6 py-6 shadow-xl shadow-amber-500/20">
            <WaitlistSection inline />
          </div>
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


      {/* ── DEMO ── */}
      <section id="demo" className="bg-white border-t border-slate-200 pt-16 pb-8 px-4">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Interactive Demo</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">See it live — end to end</h2>
          <p className="text-slate-500 mt-3 text-base">From complaint to kitchen instruction in under 10 seconds.</p>
        </div>
        <LiveDemo />
      </section>

      {/* ── WAITLIST ── */}
      <WaitlistSection />

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