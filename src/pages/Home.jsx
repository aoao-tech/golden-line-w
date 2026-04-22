import { useState } from "react";
import { Zap, RefreshCw, AlertCircle } from "lucide-react";
import LiveDemo from "./LiveDemo";
import { base44 } from "@/api/base44Client";

function WaitlistForm({ large = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

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

  if (status === "success") {
    return (
      <p className={`font-medium text-white ${large ? "text-base" : "text-sm"}`}>
        You're on the list, we'll be in touch
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg text-sm bg-white text-slate-900 border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-slate-400"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-1.5 whitespace-nowrap"
      >
        {status === "loading" ? "..." : "Join →"}
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* NAV */}
      <nav className="px-6 py-4 flex items-center justify-between bg-white border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-slate-900 font-bold text-xs">GL</span>
          </div>
          <span className="font-semibold text-base">Golden Line</span>
        </div>
        <a
          href="#demo"
          className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          Live Demo
        </a>
      </nav>

      {/* HERO — dark navy */}
      <section className="text-center px-6 py-20 md:py-28" style={{ backgroundColor: "#0d1b2e" }}>
        <div className="max-w-3xl mx-auto">
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Stop Repeat Refunds<br />
            <span className="text-blue-400">Close the Loop Between CS and Operations</span>
          </h1>

          {/* Waitlist form card */}
          <div className="mt-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-lg mx-auto">
            <p className="text-white/80 text-sm font-medium mb-4">
              Join the waitlist, be first in line
            </p>
            <WaitlistForm large />
          </div>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 text-center mb-4">
            The Problem
          </p>
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">
            The data dead-end that costs you every day
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border-l-4 border-orange-400 border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                  Step 1: The Dead End
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Customer gets a refund
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                A damaged delivery triggers a complaint, your CS team issues a refund and closes the ticket in Salesforce, case closed, or so it seems
              </p>
              <p className="text-xs text-slate-400 font-medium">
                💸 Refund issued · Ticket closed · Data buried in CRM
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border-l-4 border-orange-400 border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
                  Step 2: The Repeat
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                The same mistake happens again
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                The customer reorders, the packer has no idea about the previous complaint, they pack it exactly the same way, another damaged delivery, another refund
              </p>
              <p className="text-xs text-slate-400 font-medium">
                📦 Same packer · Same mistake · Same refund
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 text-center mb-4">
            Interactive Demo
          </p>
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-3">
            See it live, end to end
          </h2>
          <p className="text-center text-slate-500 text-sm mb-12">
            From complaint to kitchen instruction in under 10 seconds
          </p>
          <LiveDemo />
        </div>
      </section>

      {/* EARLY ACCESS */}
      <section className="px-6 py-20 bg-slate-50">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-4">
            Early Access
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Join the waitlist
          </h2>
          <p className="text-slate-500 text-sm mb-8">
            Be the first to know when Golden Line is ready for your team
          </p>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t border-slate-100 bg-white">
        <p className="text-sm font-semibold text-slate-900 mb-1">Golden Line</p>
        <p className="text-xs text-slate-400">© 2026</p>
      </footer>

    </div>
  );
}