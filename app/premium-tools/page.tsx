"use client";

type Props = {
  isPremium: boolean;
};

export default function PremiumToolsCard({ isPremium }: Props) {
  return (
    <section className="rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-6 shadow-2xl">
      <p className="text-sm font-bold text-emerald-300">
        Premium Creator Engine
      </p>

      <h2 className="mt-2 text-3xl font-black text-white">
        Real Premium Tools
      </h2>

      <p className="mt-3 text-white/60">
        Generate hooks, captions, scripts, hashtags, repurpose packs, and content
        scores from one clean studio.
      </p>

      <a
        href={isPremium ? "/premium-tools" : "/pricing"}
        className="mt-5 inline-flex rounded-2xl bg-emerald-400 px-5 py-3 font-black text-black hover:bg-emerald-300"
      >
        {isPremium ? "Open Premium Tools" : "Unlock Premium"}
      </a>
    </section>
  );
}