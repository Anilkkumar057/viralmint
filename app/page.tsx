"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const features = [
  "Hook Generator",
  "Thumbnail Psychology",
  "Script Engine",
  "Emotion CTAs",
  "Repurpose Packs",
  "Audience Retention",
];

export default function HomePage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(false);

  const continueWithGoogle = async () => {
    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/studio`
            : undefined,
      },
    });

    if (error) {
      console.error("Google sign-in error:", error);
      setAuthLoading(false);
      alert("Google sign-in failed. Please check Supabase OAuth settings.");
    }
  };

  const openStudio = async () => {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      router.push("/studio");
      return;
    }

    await continueWithGoogle();
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,208,74,0.13),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(255,214,92,0.08),transparent_25%),linear-gradient(180deg,#050505_0%,#090807_55%,#050505_100%)]" />

      <div className="relative">
        <header className="sticky top-0 z-50 border-b border-yellow-400/10 bg-black/45 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
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

            <div className="hidden items-center gap-3 md:flex">
              <button className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200">
                Features
              </button>

              <button
                onClick={() => router.push("/pricing")}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200"
              >
                Pricing
              </button>

              <button
                onClick={() => router.push("/premium-tools")}
                className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200"
              >
                Premium Tools
              </button>

              <button
                onClick={openStudio}
                disabled={authLoading}
                className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02] disabled:opacity-60"
              >
                {authLoading ? "Opening..." : "Enter Studio ✨"}
              </button>
            </div>
          </div>
        </header>

        <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-24">
          <div className="absolute right-[-180px] top-[-80px] h-[520px] w-[520px] rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
                ♕ Elite Creator Intelligence
              </div>

              <h1 className="mt-8 text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
                Build viral content with
                <span className="block text-yellow-300">
                  cinematic AI psychology.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-9 text-white/62">
                Viral Mint is the emotionally intelligent creator operating
                system for hooks, scripts, thumbnails, emotional storytelling,
                audience retention, and creator growth momentum.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={openStudio}
                  disabled={authLoading}
                  className="rounded-[1.2rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-8 py-4 text-sm font-black text-black shadow-[0_22px_70px_rgba(255,208,74,0.24)] transition-all hover:scale-[1.03] disabled:opacity-60"
                >
                  {authLoading ? "Opening Creator OS..." : "Continue with Google →"}
                </button>

                <button
                  onClick={() => router.push("/pricing")}
                  className="rounded-[1.2rem] border border-yellow-400/20 bg-black/30 px-7 py-4 text-sm text-white/75 transition-all hover:border-yellow-400/40 hover:text-yellow-200"
                >
                  See Plans ▷
                </button>
              </div>

              <p className="mt-4 text-sm text-white/42">
                Google sign-in stays here. No /login or /signup route needed.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                {features.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70"
                  >
                    ✦ {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-yellow-300/10 to-transparent blur-2xl" />

              <div className="relative overflow-hidden rounded-[2.5rem] border border-yellow-400/25 bg-[#090807] p-7 shadow-[0_30px_120px_rgba(255,208,74,0.08)]">
                <div className="absolute right-[-90px] top-[-60px] h-[260px] w-[260px] rounded-full bg-yellow-400/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-300">
                        Creator Workspace
                      </p>

                      <h2 className="mt-2 text-2xl font-black">
                        Premium Creator Engine
                      </h2>
                    </div>

                    <div className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">
                      Elite Active
                    </div>
                  </div>

                  <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-5">
                    <textarea
                      placeholder='Type your idea... "Hook for creators struggling with consistency"'
                      className="min-h-[160px] w-full resize-none bg-transparent text-base text-white outline-none placeholder:text-white/35"
                    />

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button
                        onClick={openStudio}
                        disabled={authLoading}
                        className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02] disabled:opacity-60"
                      >
                        Generate Hooks ✨
                      </button>

                      <button className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/65 transition-all hover:border-yellow-400/30 hover:text-yellow-200">
                        Thumbnails
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-sm text-yellow-300">Emotional AI</p>

                      <h3 className="mt-3 text-xl font-black">
                        Creator Psychology
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-white/55">
                        AI adapts to your creator style, audience emotion, and
                        storytelling energy.
                      </p>
                    </div>

                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5">
                      <p className="text-sm text-yellow-300">Viral Momentum</p>

                      <h3 className="mt-3 text-xl font-black">
                        Retention Engine
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-white/55">
                        Generate high-retention hooks and scripts designed for
                        modern creator platforms.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
