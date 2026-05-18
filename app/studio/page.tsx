"use client";

import { useState } from "react";

const toolChips = [
  "Hook Generator",
  "Viral Title",
  "Script Engine",
  "Thumbnails",
  "Hashtag Finder",
  "Repurpose Pack",
  "Emotion Map",
];

const toolCards = [
  {
    title: "Hook Generator",
    desc: "Create scroll-stopping hooks instantly.",
    tag: "Popular",
    icon: "⚡",
  },
  {
    title: "Viral Title",
    desc: "AI titles that grab attention.",
    tag: "Popular",
    icon: "T",
  },
  {
    title: "Script Engine",
    desc: "Create engaging scripts that convert.",
    tag: "Popular",
    icon: "▤",
  },
  {
    title: "Thumbnails",
    desc: "High CTR thumbnail ideas that stand out.",
    tag: "New",
    icon: "▧",
  },
  {
    title: "Hashtag Finder",
    desc: "Find trend-ready hashtags that rank.",
    tag: "Popular",
    icon: "#",
  },
  {
    title: "Emotion Map",
    desc: "Trigger emotions that drive engagement.",
    tag: "New",
    icon: "♡",
  },
  {
    title: "Repurpose Pack",
    desc: "Turn one idea into multiple assets.",
    tag: "New",
    icon: "↻",
  },
];

export default function StudioPage() {
  const [idea, setIdea] = useState("");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState("Hinglish");

  const firstName = "Anil";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(245,183,44,0.13),transparent_28%),radial-gradient(circle_at_72%_12%,rgba(255,213,79,0.10),transparent_26%),linear-gradient(135deg,#050505_0%,#090807_52%,#050505_100%)]" />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-yellow-500/10 bg-black/55 px-5 py-7 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-600 text-xl font-black text-black shadow-[0_0_40px_rgba(245,183,44,0.24)]">
                M
              </div>
              <div>
                <p className="text-xl font-black tracking-wide">VIRAL MINT</p>
                <span className="mt-1 inline-flex rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Elite
                </span>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              ["⌂", "Studio", true],
              ["▣", "Vault", false],
              ["↯", "Push Further", false],
              ["▧", "Thumbnails", false],
              ["♕", "Premium Tools", false],
              ["⌘", "DNA", false],
              ["▥", "Growth Map", false],
              ["◴", "Analytics", false],
              ["☷", "Audience", false],
              ["⚙", "Settings", false],
            ].map(([icon, label, active]) => (
              <button
                key={String(label)}
                className={
                  active
                    ? "flex w-full items-center gap-3 rounded-[1.2rem] border border-yellow-400/45 bg-yellow-400/10 px-4 py-3 text-left text-sm font-semibold text-yellow-200 shadow-[0_0_30px_rgba(245,183,44,0.13)]"
                    : "flex w-full items-center gap-3 rounded-[1.2rem] border border-transparent px-4 py-3 text-left text-sm text-white/70 transition-all duration-300 hover:border-yellow-400/20 hover:bg-white/[0.04] hover:text-yellow-100"
                }
              >
                <span className="text-lg text-yellow-300">{icon}</span>
                <span>{label}</span>
                {label === "Thumbnails" && (
                  <span className="ml-auto rounded-full bg-yellow-400/15 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-yellow-300">
                    New
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-[1.5rem] border border-yellow-400/25 bg-yellow-400/[0.06] p-4 shadow-[0_0_40px_rgba(245,183,44,0.08)]">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
              ♕ Elite Plan
            </p>
            <p className="mt-2 text-sm text-emerald-300">Unlimited Access</p>
            <button className="mt-4 flex w-full items-center justify-between rounded-[1rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/85 hover:border-yellow-400/30">
              Manage Plan <span>›</span>
            </button>
          </div>

          <div className="absolute bottom-7 left-5 right-5 space-y-2 text-sm text-white/65">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:text-yellow-200">
              ? Help & Support
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:text-yellow-200">
              ↪ Logout
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-yellow-500/10 bg-black/50 px-5 py-4 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-yellow-300">◌</span>
                <p className="text-sm text-white/80">
                  Welcome back, <span className="font-semibold text-white">{firstName}</span>{" "}
                  <span className="text-yellow-300">♕</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden rounded-[1.2rem] border border-yellow-400/45 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300 shadow-[0_0_35px_rgba(245,183,44,0.18)] md:block">
                  ♕ Elite Active
                </div>

                <button className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:border-yellow-400/30 hover:text-yellow-200">
                  ◐
                </button>

                <div className="relative">
                  <button
                    onClick={() => setLanguageOpen((value) => !value)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/85 transition-all hover:border-yellow-400/30"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-[11px] font-bold">
                      A
                    </span>
                    <span className="hidden md:inline">{firstName}</span>
                    <span className="text-white/40">⌄</span>
                  </button>

                  {languageOpen && (
                    <div className="absolute right-0 top-12 z-40 w-56 rounded-[1.4rem] border border-yellow-400/20 bg-[#080807]/95 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                      <p className="mb-2 border-b border-white/10 pb-3 text-sm text-white/85">
                        🌐 Language / भाषा
                      </p>

                      {["English", "हिन्दी", "Hinglish"].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setLanguage(item);
                            setLanguageOpen(false);
                          }}
                          className={
                            language === item
                              ? "mb-1 flex w-full items-center justify-between rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-sm text-yellow-300"
                              : "mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/[0.05] hover:text-white"
                          }
                        >
                          {item}
                          {language === item && <span>✓</span>}
                        </button>
                      ))}

                      <div className="mt-3 border-t border-white/10 pt-3">
                        <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/[0.05]">
                          ♙ Profile
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/[0.05]">
                          ▤ Billing
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-full border border-yellow-400/50 bg-yellow-400/10 text-3xl font-black text-yellow-300 shadow-[0_0_45px_rgba(245,183,44,0.16)]">
                  AN
                </div>
                <div>
                  <h1 className="text-3xl font-black">
                    {firstName} <span className="text-yellow-300">♕</span>
                  </h1>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
                    Elite Creator
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    Your Creator Workspace is ready.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {["DNA", "Vault", "Settings", "Logout"].map((item) => (
                  <button
                    key={item}
                    className="rounded-[1.3rem] border border-white/10 bg-white/[0.035] px-5 py-4 text-sm text-white/75 transition-all duration-300 hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-200"
                  >
                    <span className="mb-2 block text-xl text-yellow-300">
                      {item === "DNA" ? "⌬" : item === "Vault" ? "▱" : item === "Settings" ? "⚙" : "↪"}
                    </span>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <section className="relative overflow-hidden rounded-[2rem] border border-yellow-400/35 bg-[#090807] p-8 shadow-[0_30px_120px_rgba(245,183,44,0.11)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_58%,rgba(245,183,44,0.42),transparent_25%),linear-gradient(90deg,rgba(0,0,0,0.0)_0%,rgba(245,183,44,0.05)_100%)]" />
              <div className="pointer-events-none absolute -right-12 bottom-[-90px] h-80 w-[520px] rounded-[100%] border-t border-yellow-300/40 bg-yellow-400/10 blur-[1px]" />
              <div className="pointer-events-none absolute right-32 top-10 text-[12rem] font-black leading-none text-yellow-300/15">
                M
              </div>

              <div className="relative z-10 max-w-3xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-300">
                  Premium Creator Engine
                </p>
                <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                  Premium Tools
                  <br />
                  Unlimited Power for{" "}
                  <span className="text-yellow-300">Elite</span> Creators
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
                  Generate hooks, captions, scripts, hashtags, thumbnails,
                  repurpose packs, emotional CTAs, and creator growth systems
                  from one cinematic studio.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(245,183,44,0.24)] transition-all hover:scale-[1.02]">
                    Open Premium Tools ›
                  </button>
                  <button className="rounded-[1rem] border border-yellow-400/25 bg-black/30 px-5 py-3 text-sm text-white/80 hover:border-yellow-400/45 hover:text-yellow-200">
                    How It Works ▷
                  </button>
                </div>
              </div>

              <div className="absolute right-6 top-5 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-yellow-300">
                ♕ Elite Active
              </div>
            </section>

            <section className="mt-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.45em] text-yellow-300">
                Creator Workspace
              </p>
              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                What do you want to create today?
              </h2>

              <div className="mx-auto mt-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-white/55">
                Elite Plan <span className="mx-3 text-yellow-300">•</span>
                Unlimited Access <span className="mx-3 text-yellow-300">•</span>
                Creative Flow <span className="mx-3 text-yellow-300">•</span>
                Day 0
              </div>

              <div className="mx-auto mt-6 flex max-w-5xl items-center gap-3 rounded-[1.5rem] border border-yellow-400/18 bg-white/[0.035] p-3 text-left shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
                <input
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  maxLength={600}
                  placeholder='Type your idea... (e.g. "Viral hook about never giving up")'
                  className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-white/35"
                />
                <span className="hidden text-xs text-white/35 md:inline">
                  {idea.length}/600
                </span>
                <button className="rounded-[1rem] border border-yellow-400/50 bg-black/30 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(245,183,44,0.12)] transition-all hover:scale-[1.02] hover:bg-yellow-400 hover:text-black">
                  Generate ✨
                </button>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {toolChips.map((tool) => (
                  <button
                    key={tool}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-5 py-2 text-sm text-white/75 transition-all hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-200"
                  >
                    <span className="mr-2 text-yellow-300">
                      {tool === "Thumbnails" ? "▧" : tool === "Hashtag Finder" ? "#" : "✦"}
                    </span>
                    {tool}
                    {tool === "Thumbnails" && (
                      <span className="ml-2 rounded-full bg-yellow-400/15 px-2 py-1 text-[9px] uppercase text-yellow-300">
                        New
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-7 rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-300">
                  Elite Creator Tools
                </p>
                <button className="text-sm text-yellow-300 hover:text-yellow-200">
                  View All Tools →
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {toolCards.map((tool) => (
                  <button
                    key={tool.title}
                    className="group rounded-[1.3rem] border border-white/10 bg-white/[0.035] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/35 hover:bg-yellow-400/[0.06] hover:shadow-[0_25px_80px_rgba(245,183,44,0.09)]"
                  >
                    <div className="text-2xl text-yellow-300">{tool.icon}</div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      {tool.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {tool.desc}
                    </p>
                    <span className="mt-5 inline-flex rounded-full bg-yellow-400/12 px-3 py-1 text-xs text-yellow-300">
                      {tool.tag}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
