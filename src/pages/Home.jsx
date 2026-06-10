import { useState } from "react";
import LiveDemo from "./LiveDemo";
import { base44 } from "@/api/base44Client";
import {
  MessageSquare,
  Database,
  ChefHat,
  ArrowRight,
  AlertTriangle,
  Repeat,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const NAVY = "#0d1b2e";

function WaitlistForm({ light = false }) {
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
      <p className={`font-medium ${light ? "text-slate-900" : "text-white"}`}>
        You're on the list — we'll be in touch.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 min-w-0 px-4 py-3 rounded-lg text-sm bg-white text-slate-900 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-3 text-sm font-semibold rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Join the waitlist"}
        </button>
      </form>
      {status === "error" && (
        <p className={`text-xs mt-2 ${light ? "text-red-600" : "text-red-300"}`}>
          Something went wrong — please try again.
        </p>
      )}
    </div>
  );
}

function SectionHeading({ kicker, title, subtitle }) {
  return (
    <div className="text-center max-w-2xl mx-auto mb-12">
      {kicker && (
        <div className="text-xs font-semibold tracking-widest uppercase text-amber-600 mb-3">
          {kicker}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-4 leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export default function Home() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* NAV */}
      <header
        className="sticky top-0 z-50 border-b border-white/10"
        style={{ backgroundColor: "rgba(13,27,46,0.92)", backdropFilter: "blur(8px)" }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-500 flex items-center justify-center font-black text-slate-900 text-sm">
              G
            </div>
            <span className="text-white font-semibold tracking-tight">Golden Line</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <button onClick={() => scrollTo("how")} className="hover:text-white transition-colors">
              How it works
            </button>
            <button onClick={() => scrollTo("demo")} className="hover:text-white transition-colors">
              Live demo
            </button>
            <button onClick={() => scrollTo("fit")} className="hover:text-white transition-colors">
              Who it's for
            </button>
          </nav>
          <button
            onClick={() => scrollTo("cta")}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors"
          >
            Join waitlist
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 pt-20 pb-24 text-center" style={{ backgroundColor: NAVY }}>
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium text-amber-300 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-1.5 mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            For restaurants and suppliers that run their own delivery
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            You're losing customers to mistakes{" "}
            <span className="text-amber-400">you already know about</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Golden Line turns complaint history into a one-line packing instruction — shown to
            whoever packs that customer's next order, before it goes out the door.
          </p>
          <WaitlistForm />
          <button
            onClick={() => scrollTo("demo")}
            className="mt-6 text-sm text-white/60 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            Or watch it happen in the live demo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="px-6 py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            kicker="The silent leak"
            title="86% of customers leave after two bad experiences"
            subtitle="The complaint is sitting in your CRM. The packer never sees it. The same mistake ships twice — and the second refund is the one that loses the customer."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-5 h-5" />,
                title: "A complaint comes in",
                text: "Customer service handles the refund, closes the ticket, and the lesson dies in the CRM.",
              },
              {
                icon: <Repeat className="w-5 h-5" />,
                title: "The customer orders again",
                text: "Whoever packs the order has zero context. Nothing connects the last complaint to this order.",
              },
              {
                icon: <AlertTriangle className="w-5 h-5" />,
                title: "The same mistake repeats",
                text: "Another refund — and this time the customer quietly stops ordering. You never find out why.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="px-6 py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            kicker="How it works"
            title="One line, at the exact right moment"
            subtitle="Not a dashboard. Not a weekly report. A single instruction on the order ticket, at packing time, only when it matters."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                icon: <MessageSquare className="w-5 h-5" />,
                title: "Complaint analyzed",
                text: "AI reads the closed ticket, identifies what actually went wrong, and writes a fix the packer can act on.",
              },
              {
                step: "2",
                icon: <Database className="w-5 h-5" />,
                title: "Debt stored",
                text: "The fix is saved as an operational debt against that customer — waiting for their next order.",
              },
              {
                step: "3",
                icon: <ChefHat className="w-5 h-5" />,
                title: "Line injected",
                text: "When the same customer reorders, the Golden Line appears on the ticket before anything is packed.",
              },
            ].map((item, i) => (
              <div key={i} className="relative rounded-xl border border-amber-200 bg-amber-50/40 p-6">
                <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-900 text-xs font-bold">
                  Step {item.step}
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4 mt-2">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-400 mt-8">
            Alerts fire only for things the packer can fix — missing items, wrong items, bad sealing.
            Never noise about late couriers or cold food.
          </p>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="px-6 py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            kicker="Live demo"
            title="Watch a complaint become a packing instruction"
            subtitle="Run the full loop yourself — from closed support ticket to the line on the packer's screen."
          />
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <LiveDemo />
          </div>
        </div>
      </section>

      {/* FIT */}
      <section id="fit" className="px-6 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            kicker="Who it's for"
            title="Built for teams that own their delivery"
            subtitle="Golden Line works when one business controls both the order flow and the complaint data."
          />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6">
              <h3 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> A great fit
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>Restaurants with their own site and own couriers</li>
                <li>Supermarkets and groceries with in-house delivery</li>
                <li>Fresh produce and packaging houses shipping direct</li>
                <li>Anyone whose CS team already keeps a "watch list" by hand</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-slate-400" /> Not a fit (yet)
              </h3>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>Restaurants that only sell through Wolt / Uber Eats</li>
                <li>Ghost kitchens living entirely on external apps</li>
                <li>Businesses where orders and complaints live in systems owned by different companies</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="cta" className="px-6 py-24" style={{ backgroundColor: NAVY }}>
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop paying twice for the same mistake
          </h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            Join the waitlist and be first in line when Golden Line launches. Early pilot partners
            get hands-on setup, free.
          </p>
          <WaitlistForm />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-8 bg-slate-950 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-5 h-5 rounded bg-amber-500 flex items-center justify-center font-black text-slate-900 text-[10px]">
            G
          </div>
          <span className="text-white/80 text-sm font-medium">Golden Line</span>
        </div>
        <p className="text-white/40 text-xs">
          Prevention, not compensation. © {new Date().getFullYear()} Golden Line.
        </p>
      </footer>
    </div>
  );
}
