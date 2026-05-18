"use client";

import Link from "next/link";

const plans = [
  {
    name: "Starter",
    price: "₹999",
    desc: "For creators starting their viral journey.",
    features: [
      "50 Generations",
      "Hook Generator",
      "Basic Scripts",
      "Limited Vault",
    ],
    glow: "border-white/10",
    button: "Start Building",
    premium: false,
  },
  {
    name: "Pro Creator",
    price: "₹2999",
    desc: "For creators serious about audience growth.",
    features: [
      "Unlimited Generations",
      "Premium Hooks",
      "Script Engine",
      "Thumbnail Psychology",
      "Vault Access",
      "Audience Retention AI",
    ],
    glow: "border-yellow-400/35 shadow-[0_0_80px_rgba(255,208,74,0.12)]",
    button: "Unlock Pro",
    premium: true,
  },
  {
    name: "Elite Creator",
    price: "₹5999",
    desc: "The full cinematic creator operating system.",
    features: [
      "Unlimited Everything",
      "Elite Creator Engine",
      "Emotional AI",
      "Advanced Thumbnails",
      "Priority AI Access",
      "Repurpose Packs",
      "Creator Memory",
      "Future AI Features",
    ],
    glow: "border-yellow-400/55 shadow-[0_0_120px_rgba(255,208,74,0.22)]",
    button: "Enter Elite",
    premium: true,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,208,74,0.13),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,214,92,0.08),transparent_25%),linear-gradient(180deg,#050505_0%,#090807_55%,#050505_100%)]" />

      <div className="relative mx-auto max-w-7xl px-5 py-8">

        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-yellow-400/12 bg-black/40 px-6 py-5 backdrop-blur-2xl">

          <div className="flex items-center gap-3">

            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-600 text-xl font-black text-black shadow-[0_0_40px_rgba(255,208,74,0.24)]">
              M
            </div>

            <div>
              <p className="text-xl font-black tracking-wide">
                VIRAL MINT
              </p>

              <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-300">
                Creator Operating System
              </p>
            </div>

          </div>

          <Link
            href="/studio"
            className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02]"
          >
            Enter Studio ✨
          </Link>

        </header>

        <section className="relative overflow-hidden pt-20 text-center">

          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative z-10">

            <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
              ♕ Premium Creator Access
            </div>

            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              Choose your
              <span className="block text-yellow-300">
                creator evolution.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-white/62">
              Viral Mint is not just another AI tool.
              It is a cinematic creator operating system designed to
              increase audience retention, emotional engagement,
              and viral momentum.
            </p>

          </div>

        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-3">

          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-[2.3rem] border bg-[#090807] p-8 transition-all duration-300 hover:-translate-y-1 ${plan.glow}`}
            >

              {index === 2 && (
                <div className="absolute right-5 top-5 rounded-full bg-yellow-400 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  Most Powerful
                </div>
              )}

              {plan.premium && (
                <div className="absolute right-[-80px] top-[-40px] h-[220px] w-[220px] rounded-full bg-yellow-400/10 blur-3xl" />
              )}

              <div className="relative z-10">

                <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300">
                  {plan.name}
                </p>

                <h2 className="mt-5 text-5xl font-black">
                  {plan.price}
                  <span className="text-lg text-white/45">
                    /month
                  </span>
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  {plan.desc}
                </p>

                <div className="mt-8 space-y-4">

                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-white/78"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-yellow-400/10 text-yellow-300">
                        ✓
                      </span>

                      {feature}
                    </div>
                  ))}

                </div>

                <button
                  className={
                    plan.premium
                      ? "mt-10 w-full rounded-[1.2rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-4 text-sm font-black text-black shadow-[0_22px_70px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02]"
                      : "mt-10 w-full rounded-[1.2rem] border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-black text-white/75 transition-all hover:border-yellow-400/30 hover:text-yellow-200"
                  }
                >
                  {plan.button}
                </button>

              </div>

            </div>
          ))}

        </section>

        <section className="mt-20 overflow-hidden rounded-[2.3rem] border border-yellow-400/18 bg-[#090807] p-10">

          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

            <div>

              <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-300">
                Why creators upgrade
              </p>

              <h3 className="mt-4 text-4xl font-black leading-tight">
                Because viral content is no longer luck.
              </h3>

              <p className="mt-6 max-w-3xl text-base leading-8 text-white/60">
                Viral Mint combines creator psychology,
                audience retention systems, emotional AI,
                cinematic scripting, and growth intelligence
                into one premium creator ecosystem.
              </p>

            </div>

            <Link
              href="/studio"
              className="inline-flex rounded-[1.2rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-8 py-4 text-sm font-black text-black shadow-[0_22px_70px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02]"
            >
              Start Creating ✨
            </Link>

          </div>

        </section>

      </div>

    </main>
  );
}
