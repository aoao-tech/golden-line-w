import { useState } from "react";
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

      {/* HERO — dark navy */}
      <section className="text-center px-6 py-16 md:py-24" style={{ backgroundColor: "#0d1b2e" }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
            You're losing customers to mistakes <span className="text-blue-400">you already know</span> about
          </h1>
          <p className="text-white/80 text-sm font-medium mb-4">🚀 Join the waitlist and be first in line when Golden Line launches</p>
          <WaitlistForm large />
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <LiveDemo />
        </div>
      </section>

      {/* SINGLE CTA */}
      <section className="px-6 py-20" style={{ backgroundColor: "#0d1b2e" }}>
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Want this for your team?
          </h2>
          <p className="text-white/60 text-sm mb-8">
            Join the waitlist — be first in line when Golden Line launches.
          </p>
          <WaitlistForm large />
        </div>
      </section>



    </div>
  );
}