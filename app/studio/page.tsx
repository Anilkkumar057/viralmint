"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";
import IdeaBox from "@/components/IdeaBox";

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
      setAuthChecking(false);
    };

    checkUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          router.push("/");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const generateHooks = async () => {
    if (!idea.trim()) return;

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

      setGenerationCount((prev) => prev + 1);
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
    <main className="min-h-screen bg-[#fffaf2] text-black">
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
            <div className="mt-10 mb-5 flex flex-wrap justify-center gap-3">
  {["English", "Hindi", "Hinglish"].map((item) => (
    <button
      key={item}
      onClick={() => setLanguage(item)}
      className={
        language === item
          ? "rounded-full bg-black px-5 py-3 text-xs uppercase tracking-[0.25em] text-white"
          : "rounded-full border border-black/10 px-5 py-3 text-xs uppercase tracking-[0.25em] text-black/45 transition-all duration-500 hover:bg-black hover:text-white"
      }
    >
      {item}
    </button>
  ))}
</div>
          </p>

          <h1 className="max-w-4xl text-4xl font-light leading-tight tracking-tight md:text-6xl">
            What do you want to create today?
          </h1>

          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-black/35">
            Free Usage · {generationCount}/10
          </p>

          <div className="mt-10 w-full max-w-2xl">
            <div className="mb-5 flex flex-wrap justify-center gap-3">
              {["English", "Hindi", "Hinglish"].map((item) => (
                <button
                  key={item}
                  onClick={() => setLanguage(item)}
                  className={
                    language === item
                      ? "rounded-full bg-black px-5 py-3 text-xs uppercase tracking-[0.25em] text-white"
                      : "rounded-full border border-black/10 px-5 py-3 text-xs uppercase tracking-[0.25em] text-black/45 transition-all duration-500 hover:bg-black hover:text-white"
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
              className="mt-5 rounded-full bg-black px-8 py-4 text-sm uppercase tracking-[0.25em] text-white transition-all duration-500 hover:scale-[1.03] disabled:opacity-40"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {(hooks.length > 0 ||
            titles.length > 0 ||
            thumbnails.length > 0 ||
            ctas.length > 0 ||
            openings.length > 0) && (
            <div className="mt-14 w-full max-w-3xl space-y-10 text-left">
              {hooks.length > 0 && (
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.35em] text-black/35">
                    Hooks
                  </p>

                  <div className="space-y-4">
                    {hooks.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5 text-sm leading-7 text-black/70"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {titles.length > 0 && (
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.35em] text-black/35">
                    Titles
                  </p>

                  <div className="space-y-4">
                    {titles.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5 text-sm leading-7 text-black/70"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {thumbnails.length > 0 && (
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.35em] text-black/35">
                    Thumbnail Direction
                  </p>

                  <div className="space-y-4">
                    {thumbnails.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5 text-sm leading-7 text-black/70"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {openings.length > 0 && (
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.35em] text-black/35">
                    Opening Sequence
                  </p>

                  <div className="space-y-4">
                    {openings.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5 text-sm leading-7 text-black/70"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ctas.length > 0 && (
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.35em] text-black/35">
                    Emotional CTA
                  </p>

                  <div className="space-y-4">
                    {ctas.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5 text-sm leading-7 text-black/70"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}