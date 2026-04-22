import { useState } from "react";
import LiveDemo from "./LiveDemo";
import { base44 } from "@/api/base44Client";

function WaitlistForm() {
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
      <p className="text-sm font-medium text-slate-700">
        You're on the list. We'll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2.5 rounded-lg text-sm border border-slate-200 focus:outline-none focus:border-slate-400 bg-white"
        style={{ width: "220px" }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-700 transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "..." : "Join"}
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* NAV */}
      <nav className="px-8 py-5 flex items-center justify-between max-w-5xl mx-auto border-b border-slate-100">
        <span className="font-semibold text-base tracking-tight">Golden Line</span>
        <a
          href="#demo"
          className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Demo
        </a>
      </nav>

      {/* HERO */}
      <section className="text-center px-6 pt-20 pb-24 max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">
          Operations Intelligence
        </p>
        <h1 className="text-5xl sm:text-6xl font-bold leading-[1.08] tracking-tight text-slate-900 mb-6">
          Stop paying for the same mistake twice.
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
          Golden Line connects your CS complaints directly to your operations so the same packaging error never causes a refund twice.
        </p>
        <WaitlistForm />
      </section>

      {/* PROBLEM */}
      <section className="px-6 pb-24 max-w-4xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8 text-center">
          The Problem
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 p-6">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4 text-xs font-bold text-slate-500">
              CRM
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Refund issued. Ticket closed.
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              CS resolves the complaint, issues a refund, and closes the ticket. The insight lives and dies in the CRM.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 p-6">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center mb-4 text-base text-slate-500">
              ↻
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Same packer. Same mistake.
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              The customer reorders. The packer has no idea. They pack it identically. Another damaged delivery, another refund.
            </p>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="bg-slate-50 border-y border-slate-100 px-6 py-20 mb-0">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 text-center">
            Live Demo
          </p>
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-12">
            See it in action.
          </h2>
          <LiveDemo />
        </div>
      </section>

      {/* WAITLIST */}
      <section className="text-center px-6 py-24 max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Get early access.
        </h2>
        <p className="text-base text-slate-500 mb-8 leading-relaxed">
          We're onboarding a small set of food delivery and e-commerce teams. Leave your email and we'll reach out.
        </p>
        <WaitlistForm />
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t border-slate-100">
        <p className="text-sm font-semibold text-slate-900 mb-1">Golden Line</p>
        <p className="text-xs text-slate-400">© 2026</p>
      </footer>

    </div>
  );
}