"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";

type ResultState = {
  hooks: string[];
  titles: string[];
  thumbnails: string[];
  ctas: string[];
  openings: string[];
};

type CreatorProfile = {
  niche?: string;
  platform?: string;
  style?: string;
  goal?: string;
};

const emptyResult: ResultState = {
  hooks: [],
  titles: [],
  thumbnails: [],
  ctas: [],
  openings: [],
};

export default function StudioPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("Hinglish");

  const [profile, setProfile] = useState<CreatorProfile | null>(null);

  const [result, setResult] = useState<ResultState>(emptyResult);

  const [generationCount, setGenerationCount] = useState(0);

  const [streakCount, setStreakCount] = useState(0);
  const [lastGenerationDate, setLastGenerationDate] = useState("");

  const [upgradeNotice, setUpgradeNotice] = useState(false);

  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/");
        return;
      }

      setUser(data.user);
      setAuthChecking(false);

      loadProfile(data.user.id);
      loadUsage(data.user.id);
      loadStreak(data.user.id);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.push("/");
          return;
        }

        setUser(session.user);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!data) {
      router.push("/onboarding");
      return;
    }

    setProfile({
      niche: data.niche || "",
      platform: data.platform || "",
      style: data.style || "",
      goal: data.goal || "",
    });
  };

  const loadUsage = async (userId: string) => {
    const { data } = await supabase
      .from("usage_limits")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!data) {
      await supabase.from("usage_limits").insert([
        {
          user_id: userId,
          generation_count: 0,
        },
      ]);

      setGenerationCount(0);
      return;
    }

    setGenerationCount(data.generation_count || 0);
  };

  const updateUsage = async () => {
    if (!user) return;

    const nextCount = generationCount + 1;

    setGenerationCount(nextCount);

    await supabase
      .from("usage_limits")
      .update({
        generation_count: nextCount,
      })
      .eq("user_id", user.id);
  };

  const loadStreak = async (userId: string) => {
    const { data } = await supabase
      .from("creator_streaks")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!data) {
      await supabase.from("creator_streaks").insert([
        {
          user_id: userId,
          streak_count: 0,
          last_generation_date: "",
        },
      ]);

      return;
    }

    setStreakCount(data.streak_count || 0);
    setLastGenerationDate(data.last_generation_date || "");
  };

  const updateStreak = async () => {
    if (!user) return;

    const today = new Date().toISOString().slice(0, 10);

    if (lastGenerationDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayText = yesterday.toISOString().slice(0, 10);

    const nextStreak =
      lastGenerationDate === yesterdayText ? streakCount + 1 : 1;

    setStreakCount(nextStreak);
    setLastGenerationDate(today);

    await supabase.from("creator_streaks").upsert({
      user_id: user.id,
      streak_count: nextStreak,
      last_generation_date: today,
    });
  };

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);

    setCopiedKey(key);

    setTimeout(() => {
      setCopiedKey("");
    }, 1200);
  };

  const generateHooks = async () => {
    if (!idea.trim()) return;

    if (generationCount >= 10) {
      setUpgradeNotice(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: idea,
          language,
          creatorProfile: profile,
        }),
      });

      const data = await response.json();

      const generatedResult: ResultState = {
        hooks: data.hooks || [],
        titles: data.titles || [],
        thumbnails: data.thumbnails || [],
        ctas: data.ctas || [],
        openings: data.openings || [],
      };

      setResult(generatedResult);

      await updateUsage();
      await updateStreak();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (authChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Opening Studio...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_14%_8%,rgba(126,242,194,0.30),transparent_26%),radial-gradient(circle_at_88%_12%,rgba(245,199,107,0.26),transparent_24%),linear-gradient(135deg,#fffaf2_0%,#fff7e8_45%,#f7fff9_100%)] pb-32 text-black">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-black/10 bg-white/55 p-5 backdrop-blur-xl">
          <div>
            <p className="text-lg font-light tracking-[0.35em]">
              VIRAL MINT
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-black/40">
              emotionally intelligent creator os
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/pricing")}
              className="rounded-full border border-[#f5c76b]/40 bg-[#fff3d6]/80 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#8a641c]"
            >
              ✦ Upgrade
            </button>

            <button
              onClick={() => router.push("/onboarding")}
              className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-xs uppercase tracking-[0.25em]"
            >
              Edit DNA
            </button>

            <button
              onClick={signOut}
              className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-xs uppercase tracking-[0.25em]"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-5 text-xs uppercase tracking-[0.4em] text-black/35">
            creator workspace
          </p>

          <h1 className="max-w-4xl text-4xl font-light leading-tight tracking-tight md:text-7xl">
            What do you want to create today?
          </h1>

          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-black/35">
            Free Trial · {generationCount}/10
          </p>

          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#8a641c]">
            Creative Flow · Day {streakCount}
          </p>

          {profile && (
            <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-black/35">
              {profile.niche} · {profile.platform} · {profile.style} ·{" "}
              {profile.goal}
            </p>
          )}

          {upgradeNotice && (
            <div className="mt-8 w-full max-w-2xl overflow-hidden rounded-[2.3rem] border border-[#f5c76b]/30 bg-[linear-gradient(135deg,rgba(255,250,242,0.96),rgba(255,245,225,0.96))] p-7 text-left shadow-[0_25px_80px_rgba(245,199,107,0.18)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.4em] text-[#8a641c]">
                    CREATOR FLOW
                  </p>

                  <h3 className="mt-4 text-3xl font-light leading-tight text-black/85">
                    Your free creator session is complete.
                  </h3>
                </div>

                <div className="rounded-full border border-[#f5c76b]/30 bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#8a641c]">
                  10 / 10 Used
                </div>
              </div>

              <p className="mt-6 text-sm leading-8 text-black/60">
                Viral Mint has now started adapting to your creator identity,
                audience psychology, platform style, and emotional tone.
              </p>

              <p className="mt-4 text-sm leading-8 text-black/55">
                Premium unlocks a deeper creator workspace designed for
                long-term growth, stronger emotional hooks, cinematic expansion,
                audience retention systems, and unlimited creation flow.
              </p>

              <div className="mt-7 rounded-[1.6rem] border border-[#7ef2c2]/20 bg-[#effff7] p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-[#147a52]">
                  Early Creator Access
                </p>

                <p className="mt-3 text-sm leading-7 text-black/58">
                  Founding creators currently receive access before wider public rollout.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => router.push("/pricing")}
                  className="rounded-full bg-black px-7 py-4 text-xs uppercase tracking-[0.28em] text-white"
                >
                  Continue With Premium
                </button>

                <button
                  onClick={() => setUpgradeNotice(false)}
                  className="rounded-full border border-black/10 bg-white/70 px-7 py-4 text-xs uppercase tracking-[0.25em] text-black/45"
                >
                  Stay in Studio
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 w-full max-w-3xl rounded-[2.5rem] border border-black/10 bg-white/55 p-6 backdrop-blur-xl">
            <LanguageToggle
              language={language}
              setLanguage={setLanguage}
            />

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your content idea..."
              className="min-h-[200px] w-full rounded-[2rem] border border-black/10 bg-white/80 p-6 text-base outline-none"
            />

            <button
              onClick={generateHooks}
              disabled={loading}
              className="mt-6 rounded-full bg-black px-10 py-4 text-sm uppercase tracking-[0.25em] text-white"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {(result.hooks.length > 0 ||
            result.titles.length > 0 ||
            result.thumbnails.length > 0 ||
            result.ctas.length > 0 ||
            result.openings.length > 0) && (
            <div className="mt-16 w-full max-w-4xl space-y-10 text-left">
              <OutputBlock
                title="Hooks"
                items={result.hooks}
                copiedKey={copiedKey}
                copyText={copyText}
                section="hooks"
              />

              <OutputBlock
                title="Titles"
                items={result.titles}
                copiedKey={copiedKey}
                copyText={copyText}
                section="titles"
              />

              <OutputBlock
                title="Thumbnail Direction"
                items={result.thumbnails}
                copiedKey={copiedKey}
                copyText={copyText}
                section="thumb"
              />

              <OutputBlock
                title="Opening Sequence"
                items={result.openings}
                copiedKey={copiedKey}
                copyText={copyText}
                section="open"
              />

              <OutputBlock
                title="Emotional CTA"
                items={result.ctas}
                copiedKey={copiedKey}
                copyText={copyText}
                section="cta"
              />
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-[2rem] border border-black/10 bg-white/80 p-3 backdrop-blur-xl">
        <div className="flex justify-center">
          <button
            onClick={generateHooks}
            disabled={loading || !idea.trim()}
            className="rounded-full bg-black px-8 py-3 text-xs uppercase tracking-[0.25em] text-white"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>
    </main>
  );
}

function LanguageToggle({
  language,
  setLanguage,
}: {
  language: string;
  setLanguage: (value: string) => void;
}) {
  return (
    <div className="mb-5 flex justify-center gap-2">
      {["English", "Hindi", "Hinglish"].map((item) => (
        <button
          key={item}
          onClick={() => setLanguage(item)}
          className={
            language === item
              ? "rounded-full bg-black px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white"
              : "rounded-full border border-black/10 bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-black/45"
          }
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function OutputBlock({
  title,
  items,
  copiedKey,
  copyText,
  section,
}: {
  title: string;
  items: string[];
  copiedKey: string;
  copyText: (text: string, key: string) => void;
  section: string;
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.35em] text-black/35">
        {title}
      </p>

      <div className="space-y-4">
        {items.map((item, index) => {
          const key = `${section}-${index}`;

          return (
            <div
              key={key}
              className="rounded-[1.5rem] border border-black/10 bg-white/70 p-5 text-sm leading-7 text-black/70"
            >
              <p>{item}</p>

              <button
                onClick={() => copyText(item, key)}
                className="mt-4 text-[10px] uppercase tracking-[0.25em] text-black/35"
              >
                {copiedKey === key ? "Copied" : "Copy"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}