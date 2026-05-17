"use client";

export default function PremiumToolsCard({ isPremium, plan = "free" }) {
  const activePlan = String(plan).toUpperCase();

  return (
    <section className="rounded-[2rem] border border-emerald-400/20 bg-gradient-to-br from-[#0f1720] to-[#13261d] p-5 shadow-[0_20px_60px_rgba(126,242,194,0.18)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-300/80">
            Premium Creator Engine
          </p>

          <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
            Real Premium Tools
          </h2>
        </div>

        <div className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-white/70">
          {isPremium ? `${activePlan} ACTIVE` : "FREE PLAN"}
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">
        Generate hooks, captions, scripts, hashtags, repurpose packs,
        emotional CTAs, and creator growth systems from one cinematic studio.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={isPremium ? "/premium-tools" : "/pricing"}
          className="inline-flex rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-black transition-all hover:scale-[1.02] hover:bg-emerald-300"
        >
          {isPremium ? "Open Premium Tools" : "Unlock Premium"}
        </a>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs tracking-[0.2em] text-white/55">
          {isPremium
            ? `${activePlan} UNLOCKED`
            : "PREMIUM LOCKED"}
        </div>
      </div>
    </section>
  );
}
