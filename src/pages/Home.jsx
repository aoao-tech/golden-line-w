import { useState } from "react";
import LiveDemo from "./LiveDemo";
import { base44 } from "@/api/base44Client";

function WaitlistForm({ dark = false }) {
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
      <p className={`text-sm font-medium ${dark ? "text-green-400" : "text-green-600"}`}>
        ✓ You're on the list — we'll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={`flex-1 px-4 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          dark
            ? "bg-white/10 border-white/20 text-white placeholder-white/40"
            : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 whitespace-nowrap"
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
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-slate-900 tracking-tight">Golden Line</span>
          <a href="#demo" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Demo</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6 bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">Operations Intelligence</p>
          <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight mb-6">
            Stop paying<br />for the same<br />mistake twice.
          </h1>
          <p className="text-slate-400 text-lg mb-10 max-w-xl">
            Golden Line connects your CS complaints directly to your operations — so the same packaging error never causes a refund twice.
          </p>
          <WaitlistForm dark />
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">The Problem</p>
          <h2 className="text-3xl font-bold mb-12">Your refund data goes nowhere.</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-xl p-6">
              <div className="text-2xl mb-4">💸</div>
              <h3 className="font-bold text-lg mb-2">Refund issued. Ticket closed.</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                CS resolves the complaint, issues a refund, and closes the ticket. The insight lives and dies in the CRM.
              </p>
            </div>
            <div className="border border-slate-200 rounded-xl p-6">
              <div className="text-2xl mb-4">🔁</div>
              <h3 className="font-bold text-lg mb-2">Same packer. Same mistake.</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                The customer reorders. The packer has no idea. They pack it identically. Another damaged delivery, another refund.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* DEMO */}
      <section id="demo" className="py-24 px-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Live Demo</p>
            <h2 className="text-3xl font-bold">See it in action.</h2>
          </div>
          <LiveDemo />
        </div>
      </section>

      {/* WAITLIST */}
      <section className="py-24 px-6 bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Get early access.</h2>
          <p className="text-slate-400 mb-8">We're onboarding a small set of food delivery and e-commerce teams. Leave your email and we'll reach out.</p>
          <WaitlistForm dark />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 px-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-bold text-sm text-slate-900">Golden Line</span>
          <span className="text-slate-400 text-xs">© 2026</span>
        </div>
      </footer>

    </div>
  );
}