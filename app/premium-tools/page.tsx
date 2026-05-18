"use client";

import { useState } from "react";

const premiumTools = [
  {
    title: "Hook Generator",
    desc: "Generate emotionally addictive hooks in seconds.",
    icon: "⚡",
    glow: "from-yellow-300 to-yellow-500",
  },
  {
    title: "Thumbnail Brain",
    desc: "Get high CTR thumbnail concepts instantly.",
    icon: "▧",
    glow: "from-amber-300 to-orange-500",
  },
  {
    title: "Script Engine",
    desc: "Create cinematic scripts with creator psychology.",
    icon: "▤",
    glow: "from-yellow-200 to-yellow-400",
  },
  {
    title: "Hashtag Finder",
    desc: "Find trend-ready hashtags for maximum reach.",
    icon: "#",
    glow: "from-orange-300 to-yellow-500",
  },
  {
    title: "Emotion CTA",
    desc: "Generate emotional CTAs that increase engagement.",
    icon: "♡",
    glow: "from-yellow-200 to-amber-400",
  },
  {
    title: "Repurpose Pack",
    desc: "Turn one idea into reels, shorts, captions & more.",
    icon: "↻",
    glow: "from-yellow-300 to-orange-400",
  },
];

export default function PremiumToolsPage() {
  const [language, setLanguage] = useState("Hinglish");

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,208,74,0.13),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,214,92,0.08),transparent_25%),linear-gradient(180deg,#050505_0%,#090807_55%,#050505_100%)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-6">

        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-yellow-400/15 bg-black/40 px-6 py-5 backdrop-blur-2xl">

          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-yellow-300">
              VIRAL MINT
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Premium Creator Tools
            </h1>

            <p className="mt-2 text-sm text-white/55">
              Elite creator intelligence systems for viral growth.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300 shadow-[0_0_40px_rgba(255,208,74,0.18)]">
              ♕ Elite Active
            </div>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white outline-none"
            >
              <option>English</option>
              <option>हिन्दी</option>
              <option>Hinglish</option>
            </select>

          </div>
        </header>

        <section className="relative mt-8 overflow-hidden rounded-[2.3rem] border border-yellow-400/25 bg-[#090807] p-8 shadow-[0_30px_120px_rgba(255,208,74,0.08)]">

          <div className="absolute right-[-120px] top-[-40px] h-[420px] w-[420px] rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">

            <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-300">
              Elite Creator Engine
            </p>

            <h2 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Build viral content with
              <span className="block text-yellow-300">
                emotional intelligence.
              </span>
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62">
              Hooks, thumbnails, scripts, hashtags, emotional CTAs, creator psychology,
              repurpose systems, and cinematic content tools designed to keep audiences engaged.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <button className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-7 py-4 text-sm font-black text-black shadow-[0_18px_60px_rgba(255,208,74,0.24)] transition-all hover:scale-[1.02]">
                Open Creator Engine ✨
              </button>

              <button className="rounded-[1rem] border border-yellow-400/25 bg-black/30 px-6 py-4 text-sm text-white/75 transition-all hover:border-yellow-400/40 hover:text-yellow-200">
                Watch Demo ▷
              </button>

            </div>
          </div>

          <div className="absolute right-6 top-6 rounded-full border border-yellow-400/35 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300">
            Unlimited Access
          </div>

        </section>

        <section className="mt-8">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-300">
                Premium Modules
              </p>

              <h3 className="mt-2 text-2xl font-black">
                Elite Creator Systems
              </h3>
            </div>

            <button className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200">
              View All →
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {premiumTools.map((tool) => (
              <div
                key={tool.title}
                className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/35 hover:bg-yellow-400/[0.04] hover:shadow-[0_25px_80px_rgba(255,208,74,0.08)]"
              >

                <div className={`inline-flex rounded-2xl bg-gradient-to-r ${tool.glow} p-[1px]`}>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-black text-2xl text-yellow-300">
                    {tool.icon}
                  </div>
                </div>

                <h4 className="mt-5 text-2xl font-black">
                  {tool.title}
                </h4>

                <p className="mt-4 text-sm leading-7 text-white/58">
                  {tool.desc}
                </p>

                <div className="mt-6 flex items-center justify-between">

                  <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-yellow-300">
                    Elite
                  </span>

                  <button className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/75 transition-all hover:border-yellow-400/30 hover:text-yellow-200">
                    Launch →
                  </button>

                </div>

              </div>
            ))}

          </div>

        </section>

      </div>

    </main>
  );
}
