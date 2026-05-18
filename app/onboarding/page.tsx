"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const niches = [
  "Finance",
  "Gaming",
  "Anime",
  "Fitness",
  "Motivation",
  "AI",
  "Business",
  "Storytelling",
  "Education",
];

const platforms = ["YouTube", "Instagram", "Shorts", "X", "LinkedIn"];

const styles = [
  "Cinematic",
  "Funny",
  "Aggressive",
  "Emotional",
  "Luxury",
  "Educational",
  "Dark",
];

const goals = [
  "Viral Growth",
  "Loyal Audience",
  "Sales",
  "Community",
  "Personal Brand",
];

export default function OnboardingPage() {
  const router = useRouter();

  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [style, setStyle] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const completedSteps = useMemo(() => {
    return [niche, platform, style, goal].filter(Boolean).length;
  }, [niche, platform, style, goal]);

  const progress = Math.round((completedSteps / 4) * 100);

  useEffect(() => {
    const checkUserAndLoadExistingDNA = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/");
        return;
      }

      const { data: existingProfile, error } = await supabase
        .from("creator_profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (error) {
        console.error("Creator DNA load error:", error);
        return;
      }

      if (existingProfile) {
        setNiche(existingProfile.niche || "");
        setPlatform(existingProfile.platform || existingProfile.main_platform || "");
        setStyle(existingProfile.style || existingProfile.creator_style || "");
        setGoal(existingProfile.goal || existingProfile.emotional_preference || "");
      }
    };

    checkUserAndLoadExistingDNA();
  }, [router]);

  const completeOnboarding = async () => {
    if (!niche || !platform || !style || !goal) {
      alert("Please select all Creator DNA options.");
      return;
    }

    setLoading(true);

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setLoading(false);
      router.push("/");
      return;
    }

    const { error } = await supabase.from("creator_profiles").upsert(
      {
        user_id: data.user.id,
        niche,
        platform,
        main_platform: platform,
        style,
        creator_style: style,
        goal,
        emotional_preference: goal,
      },
      { onConflict: "user_id" }
    );

    setLoading(false);

    if (error) {
      console.error("Creator DNA save error:", error);
      alert("Creator DNA save failed. Check Supabase creator_profiles table/RLS.");
      return;
    }

    router.push("/studio");
  };

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
              <p className="text-xl font-black tracking-wide">VIRAL MINT</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-300">
                Creator DNA Setup
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-yellow-400/35 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300 shadow-[0_0_40px_rgba(255,208,74,0.18)]">
              {completedSteps}/4 Complete
            </div>

            <button
              onClick={() => router.push("/studio")}
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200"
            >
              Skip to Studio
            </button>
          </div>
        </header>

        <section className="grid gap-8 pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <aside className="relative overflow-hidden rounded-[2.4rem] border border-yellow-400/22 bg-[#090807] p-8 shadow-[0_30px_120px_rgba(255,208,74,0.08)]">
            <div className="absolute right-[-120px] top-[-80px] h-[360px] w-[360px] rounded-full bg-yellow-400/10 blur-3xl" />

            <div className="relative z-10">
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-yellow-300">
                Train Your AI
              </p>

              <h1 className="mt-6 text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
                Build your
                <span className="block text-yellow-300">Creator DNA.</span>
              </h1>

              <p className="mt-6 text-base leading-8 text-white/62">
                Viral Mint adapts to your niche, platform, content style, and
                audience goal so every output feels made for you.
              </p>

              <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/55">AI Adaptation</span>
                  <span className="font-black text-yellow-300">{progress}%</span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-4 text-sm leading-7 text-white/50">
                  The more precise your DNA, the sharper your hooks, captions,
                  scripts, and thumbnails become.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Niche", niche],
                  ["Platform", platform],
                  ["Style", style],
                  ["Goal", goal],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-yellow-300">
                      {value || "Not set"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="rounded-[2.4rem] border border-white/10 bg-white/[0.025] p-6 shadow-[0_25px_100px_rgba(0,0,0,0.35)] md:p-8">
            <div className="space-y-8">
              <QuestionBlock
                step="01"
                title="Choose your niche"
                subtitle="What world does your content belong to?"
                items={niches}
                selected={niche}
                setSelected={setNiche}
              />

              <QuestionBlock
                step="02"
                title="Main platform"
                subtitle="Where do you want Viral Mint to optimize first?"
                items={platforms}
                selected={platform}
                setSelected={setPlatform}
              />

              <QuestionBlock
                step="03"
                title="Creator style"
                subtitle="What should your content feel like?"
                items={styles}
                selected={style}
                setSelected={setStyle}
              />

              <QuestionBlock
                step="04"
                title="Audience goal"
                subtitle="What result should your content create?"
                items={goals}
                selected={goal}
                setSelected={setGoal}
              />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[1.7rem] border border-yellow-400/15 bg-[#090807] p-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Creator DNA is your platform memory.
                </p>
                <p className="mt-1 text-sm text-white/45">
                  Finish setup to enter your cinematic creator workspace.
                </p>
              </div>

              <button
                onClick={completeOnboarding}
                disabled={loading}
                className="rounded-[1.2rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-7 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02] disabled:opacity-40"
              >
                {loading ? "Saving DNA..." : "Enter Creator Studio ✨"}
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function QuestionBlock({
  step,
  title,
  subtitle,
  items,
  selected,
  setSelected,
}: {
  step: string;
  title: string;
  subtitle: string;
  items: string[];
  selected: string;
  setSelected: (value: string) => void;
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-300">
            Step {step}
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">{title}</h2>

          <p className="mt-2 text-sm text-white/45">{subtitle}</p>
        </div>

        {selected && (
          <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300">
            Selected
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => setSelected(item)}
            className={
              selected === item
                ? "rounded-[1rem] border border-yellow-400/45 bg-yellow-400/12 px-5 py-3 text-sm font-semibold text-yellow-200 shadow-[0_0_35px_rgba(255,208,74,0.12)] transition-all"
                : "rounded-[1rem] border border-white/10 bg-white/[0.035] px-5 py-3 text-sm text-white/65 transition-all hover:border-yellow-400/30 hover:bg-yellow-400/[0.06] hover:text-yellow-200"
            }
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
