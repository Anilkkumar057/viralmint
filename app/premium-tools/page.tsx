"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type UserProfile = {
  plan?: string | null;
  is_premium?: boolean | null;
};

const tools = [
  {
    title: "Hook Generator",
    desc: "Create emotionally addictive hooks instantly.",
    icon: "⚡",
    locked: false,
  },
  {
    title: "Thumbnail Brain",
    desc: "High CTR thumbnail psychology engine.",
    icon: "▧",
    locked: false,
  },
  {
    title: "Script Engine",
    desc: "Cinematic storytelling system.",
    icon: "▤",
    locked: false,
  },
  {
    title: "Emotion CTA",
    desc: "Generate emotional CTAs that convert.",
    icon: "♡",
    locked: true,
  },
  {
    title: "Repurpose Pack",
    desc: "Turn one idea into shorts, reels & posts.",
    icon: "↻",
    locked: true,
  },
  {
    title: "Audience Psychology",
    desc: "Decode why people stay and engage.",
    icon: "◉",
    locked: true,
  },
];

export default function PremiumToolsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const [userName, setUserName] = useState("Creator");

  const cleanPlan = useMemo(() => {
    return (plan || "free").toLowerCase();
  }, [plan]);

  const isPremium = cleanPlan !== "free";

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Creator";

    setUserName(String(name).split(" ")[0]);

    const { data } = await supabase
      .from("user_profiles")
      .select("plan,is_premium")
      .eq("id", user.id)
      .maybeSingle();

    const profile = data as UserProfile | null;

    if (profile?.is_premium && profile?.plan) {
      setPlan(profile.plan);
    } else {
      setPlan("free");
    }

    setLoading(false);
  };

  const openTool = (tool: string, locked: boolean) => {
    if (locked && !isPremium) {
      router.push("/pricing");
      return;
    }

    alert(`${tool} launching soon.`);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="rounded-[2rem] border border-yellow-400/20 bg-yellow-400/10 p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-yellow-300">
            Premium Creator Engine
          </p>

          <h1 className="mt-4 text-3xl font-black">
            Loading Tools...
          </h1>
        </div>
      </main>
    );
  }

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
                Premium Creator Tools
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="rounded-full border border-yellow-400/35 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300 shadow-[0_0_40px_rgba(255,208,74,0.18)]">
              ♕ {cleanPlan === "free" ? "Free Active" : `${cleanPlan} Active`}
            </div>

            <button
              onClick={() => router.push("/studio")}
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200"
            >
              Back to Studio
            </button>

          </div>

        </header>

        <section className="relative mt-8 overflow-hidden rounded-[2.3rem] border border-yellow-400/25 bg-[#090807] p-8 shadow-[0_30px_120px_rgba(255,208,74,0.08)]">

          <div className="absolute right-[-120px] top-[-40px] h-[420px] w-[420px] rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative z-10 max-w-3xl">

            <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-300">
              Elite Creator Engine
            </p>

            <h1 className="mt-5 text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              Welcome back,
              <span className="block text-yellow-300">
                {userName} ♕
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62">
              Premium creator systems for hooks, thumbnails,
              scripts, emotional psychology, audience retention,
              and cinematic content growth.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              <button
                onClick={() => router.push("/studio")}
                className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-7 py-4 text-sm font-black text-black shadow-[0_18px_60px_rgba(255,208,74,0.24)] transition-all hover:scale-[1.02]"
              >
                Open Creator Studio ✨
              </button>

              {!isPremium && (
                <button
                  onClick={() => router.push("/pricing")}
                  className="rounded-[1rem] border border-yellow-400/25 bg-black/30 px-6 py-4 text-sm text-white/75 transition-all hover:border-yellow-400/40 hover:text-yellow-200"
                >
                  Unlock Premium ▷
                </button>
              )}

            </div>
          </div>
        </section>

        <section className="mt-8">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-300">
                Creator Systems
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Premium Modules
              </h2>
            </div>

            <div className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/65">
              {isPremium ? "Unlimited Access" : "Limited Access"}
            </div>

          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {tools.map((tool) => {

              const locked = tool.locked && !isPremium;

              return (
                <button
                  key={tool.title}
                  onClick={() => openTool(tool.title, locked)}
                  className="group relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/35 hover:bg-yellow-400/[0.04] hover:shadow-[0_25px_80px_rgba(255,208,74,0.08)]"
                >

                  <div className="absolute right-4 top-4">

                    <span
                      className={
                        locked
                          ? "rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-red-300"
                          : "rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-yellow-300"
                      }
                    >
                      {locked ? "Locked" : "Ready"}
                    </span>

                  </div>

                  <div className="grid h-16 w-16 place-items-center rounded-2xl border border-yellow-400/20 bg-yellow-400/10 text-3xl text-yellow-300">
                    {tool.icon}
                  </div>

                  <h3 className="mt-6 text-2xl font-black">
                    {tool.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-white/55">
                    {tool.desc}
                  </p>

                  <div className="mt-7 flex items-center justify-between">

                    <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-yellow-300">
                      {isPremium ? "Elite" : "Creator"}
                    </span>

                    <span className="text-sm text-white/50 group-hover:text-yellow-200">
                      Open →
                    </span>

                  </div>

                </button>
              );
            })}

          </div>

        </section>

      </div>

    </main>
  );
}
