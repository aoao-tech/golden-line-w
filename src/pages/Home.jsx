import { useState } from "react";
import LiveDemo from "./LiveDemo";
import { base44 } from "@/api/base44Client";

const CREAM = "#f5f0e8";
const BROWN = "#1c1410";
const TERRA = "#c2410c";

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
      <p className="text-sm font-medium" style={{ color: TERRA }}>
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
        className="px-4 py-2.5 rounded-lg text-sm border focus:outline-none"
        style={{
          backgroundColor: CREAM,
          border: `1px solid #c8bfb0`,
          color: BROWN,
          width: "220px",
        }}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-opacity disabled:opacity-60"
        style={{ backgroundColor: TERRA, color: "#fff" }}
      >
        {status === "loading" ? "..." : "Join"}
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: CREAM, color: BROWN }}>

      {/* NAV */}
      <nav className="px-8 py-5 flex items-center justify-between max-w-4xl mx-auto">
        <span className="font-bold text-lg" style={{ color: BROWN }}>Golden Line</span>
        <a
          href="#demo"
          className="px-4 py-2 text-sm font-semibold rounded-lg"
          style={{ backgroundColor: TERRA, color: "#fff" }}
        >
          Demo
        </a>
      </nav>

      {/* HERO */}
      <section className="text-center px-6 pt-12 pb-20 max-w-3xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#7a6a5a" }}>
          Operations Intelligence
        </p>
        <h1
          className="text-5xl sm:text-6xl font-bold leading-[1.08] tracking-tight mb-6"
          style={{ color: BROWN, fontFamily: "Georgia, serif" }}
        >
          Stop paying for the same mistake twice.
        </h1>
        <p className="text-base mb-10" style={{ color: "#5a4a3a", lineHeight: "1.7", maxWidth: "480px", margin: "0 auto 2.5rem" }}>
          Golden Line connects your CS complaints directly to your operations so the same packaging error never causes a refund twice.
        </p>
        <WaitlistForm />
      </section>

      {/* PROBLEM */}
      <section className="px-6 pb-20 max-w-4xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest mb-6 text-center" style={{ color: "#7a6a5a" }}>
          The Problem
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "#ede8df", border: "1px solid #d4c9b8" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-sm font-bold"
              style={{ backgroundColor: "#d4c9b8", color: BROWN }}
            >
              CRM
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: BROWN }}>
              Refund issued. Ticket closed.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#5a4a3a" }}>
              CS resolves the complaint, issues a refund, and closes the ticket. The insight lives and dies in the CRM.
            </p>
          </div>
          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: "#ede8df", border: "1px solid #d4c9b8" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-lg"
              style={{ backgroundColor: "#d4c9b8", color: BROWN }}
            >
              ↻
            </div>
            <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: BROWN }}>
              Same packer. Same mistake.
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: "#5a4a3a" }}>
              The customer reorders. The packer has no idea. They pack it identically. Another damaged delivery, another refund.
            </p>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section
        id="demo"
        className="mx-4 sm:mx-8 rounded-2xl px-6 pt-12 pb-16 mb-16"
        style={{ backgroundColor: "#ede8df" }}
      >
        <div className="text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#7a6a5a" }}>
            Live Demo
          </p>
          <h2
            className="text-4xl sm:text-5xl font-bold mb-3"
            style={{ fontFamily: "Georgia, serif", color: BROWN }}
          >
            See it in action.
          </h2>
        </div>
        <LiveDemo />
      </section>

      {/* WAITLIST */}
      <section className="text-center px-6 py-20 max-w-2xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-4"
          style={{ fontFamily: "Georgia, serif", color: BROWN }}
        >
          Get early access.
        </h2>
        <p className="text-sm mb-8" style={{ color: "#5a4a3a", lineHeight: "1.7" }}>
          We're onboarding a small set of food delivery and e-commerce teams. Leave your email and we'll reach out.
        </p>
        <WaitlistForm />
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 border-t" style={{ borderColor: "#d4c9b8" }}>
        <p className="font-bold text-sm mb-1" style={{ color: BROWN }}>Golden Line</p>
        <p className="text-xs" style={{ color: "#7a6a5a" }}>© 2026</p>
      </footer>

    </div>
  );
}