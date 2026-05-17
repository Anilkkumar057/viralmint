"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function StudioPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("Hinglish");

  const [hooks, setHooks] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [ctas, setCtas] = useState<string[]>([]);
  const [openings, setOpenings] = useState<string[]>([]);

  const [generationCount, setGenerationCount] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push("/");
        return;
      }

      setUser(data.user);
      await loadUsage(data.user.id);
      setAuthChecking(false);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          router.push("/");
          return;
        }

        setUser(session.user);
        await loadUsage(session.user.id);
        setAuthChecking(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

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

  const generateHooks = async () => {
    if (!idea.trim()) return;

    if (generationCount >= 10) {
      router.push("/pricing");
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
        }),
      });

      const data = await response.json();

      setHooks(data.hooks || []);
      setTitles(data.titles || []);
      setThumbnails(data.thumbnails || []);
      setCtas(data.ctas || []);
      setOpenings(data.openings || []);

      await updateUsage();
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
      <main className="flex min-h-screen items-center justify-center bg-[#fffaf2]">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          Opening Studio...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf2] pb-32 text-black">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-lg font-light tracking-[0.35em]">
              VIRAL MINT
            </p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-black/40">
              emotionally intelligent creator OS
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/pricing")}
              className="rounded-full border border-black/10 px-5 py-3 text-xs uppercase tracking-[0.25em] transition-all duration-500 hover:bg-black hover:text-white"
            >
              Pricing
            </button>

            <button
              onClick={signOut}
              className="rounded-full border border-black/10 px-5 py-3 text-xs uppercase tracking-[0.25em] transition-all duration-500 hover:bg-black hover:text-white"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <p className="mb-5 text-xs uppercase tracking-[0.4em] text-black/35">
            creator workspace
          </p>

          <h1 className="max-w-4xl text-4xl font-light leading-tight tracking-tight md:text-6xl">
            What do you want to create today?
          </h1>

          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-black/35">
            Free Usage · {generationCount}/10
          </p>

          <div className="mt-10 w-full max-w-2xl">
            <div className="mb-4 flex justify-center gap-2">
              {["English", "Hindi", "Hinglish"].map((item) => (
                <button
                  key={item}
                  onClick={() => setLanguage(item)}
                  className={
                    language === item
                      ? "rounded-full bg-black px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(126,242,194,0.22)]"
                      : "rounded-full border border-black/10 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-black/45 transition-all duration-500 hover:bg-black hover:text-white"
                  }
                >
                  {item}
                </button>
              ))}
            </div>

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your content idea..."
              className="min-h-[180px] w-full rounded-[2rem] border border-black/10 bg-white/70 p-6 text-base outline-none backdrop-blur-xl"
            />

            <button
              onClick={generateHooks}
              disabled={loading}
              className="mt-5 rounded-full bg-black px-8 py-4 text-sm uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_rgba(126,242,194,0.18)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(126,242,194,0.32)] disabled:opacity-40"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
              {[
                "Replay Psychology Engine",
                "Cinematic Story Expansion",
                "Audience Emotion Map",
                "Viral Momentum Analyzer",
              ].map((tool) => (
                <button
                  key={tool}
                  onClick={() => router.push("/pricing")}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-black/10 bg-gradient-to-br from-white/70 to-[#fff7ea] p-5 text-left transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:shadow-[0_15px_45px_rgba(245,199,107,0.22)]"
                >
                  <div className="absolute inset-0 backdrop-blur-[2px]" />

                  <div className="relative">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#c49b43]">
                      PRO LOCKED
                    </p>

                    <h3 className="mt-3 text-lg font-light text-black/70">
                      {tool}
                    </h3>

                    <p className="mt-3 text-xs leading-6 text-black/45">
                      Unlock this premium creator system in Pro.
                    </p>

                    <p className="mt-5 text-xs uppercase tracking-[0.25em] text-black/40 group-hover:text-black">
                      Unlock →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {(hooks.length > 0 ||
            titles.length > 0 ||
            thumbnails.length > 0 ||
            ctas.length > 0 ||
            openings.length > 0) && (
            <div className="mt-14 w-full max-w-3xl space-y-10 text-left">
              {hooks.length > 0 && <OutputBlock title="Hooks" items={hooks} />}
              {titles.length > 0 && <OutputBlock title="Titles" items={titles} />}
              {thumbnails.length > 0 && (
                <OutputBlock title="Thumbnail Direction" items={thumbnails} />
              )}
              {openings.length > 0 && (
                <OutputBlock title="Opening Sequence" items={openings} />
              )}
              {ctas.length > 0 && (
                <OutputBlock title="Emotional CTA" items={ctas} />
              )}
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl -translate-x-1/2 rounded-[2rem] border border-black/10 bg-white/80 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex justify-center gap-2">
            {["English", "Hindi", "Hinglish"].map((item) => (
              <button
                key={item}
                onClick={() => setLanguage(item)}
                className={
                  language === item
                    ? "rounded-full bg-black px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-white shadow-[0_8px_24px_rgba(126,242,194,0.22)]"
                    : "rounded-full border border-black/10 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-black/45 transition-all duration-500 hover:bg-black hover:text-white"
                }
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={generateHooks}
            disabled={loading || !idea.trim()}
            className="rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_rgba(126,242,194,0.18)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(126,242,194,0.32)] disabled:opacity-40"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          <button
            onClick={() => router.push("/pricing")}
            className="rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.25em] text-black/55 transition-all duration-500 hover:bg-black hover:text-white"
          >
            Upgrade
          </button>
        </div>
      </div>
    </main>
  );
}

function OutputBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="mb-4 text-xs uppercase tracking-[0.35em] text-black/35">
        {title}
      </p>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5 text-sm leading-7 text-black/70"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}