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

type VaultItem = {
  id: string;
  prompt: string;
  result: string;
  created_at: string;
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
  const [expanding, setExpanding] = useState(false);
  const [language, setLanguage] = useState("Hinglish");

  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [result, setResult] = useState<ResultState>(emptyResult);
  const [expanded, setExpanded] = useState<string[]>([]);

  const [generationCount, setGenerationCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [lastGenerationDate, setLastGenerationDate] = useState("");

  const [vaultOpen, setVaultOpen] = useState(false);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
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
        setAuthChecking(false);

        loadProfile(session.user.id);
        loadUsage(session.user.id);
        loadStreak(session.user.id);
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
      .update({ generation_count: nextCount })
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

      setStreakCount(0);
      setLastGenerationDate("");
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

  const saveGeneration = async (
    prompt: string,
    generatedResult: ResultState
  ) => {
    if (!user) return;

    await supabase.from("generations").insert([
      {
        user_id: user.id,
        prompt,
        result: JSON.stringify(generatedResult),
      },
    ]);
  };

  const saveSingleOutput = async (section: keyof ResultState, text: string) => {
    if (!user) return;

    const singleResult: ResultState = {
      hooks: section === "hooks" ? [text] : [],
      titles: section === "titles" ? [text] : [],
      thumbnails: section === "thumbnails" ? [text] : [],
      ctas: section === "ctas" ? [text] : [],
      openings: section === "openings" ? [text] : [],
    };

    await saveGeneration(`Saved ${section}: ${idea || "Viral Mint output"}`, singleResult);
    await loadVault();
  };

  const loadVault = async () => {
    if (!user) return;

    setVaultLoading(true);

    const { data } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setVaultItems(data as VaultItem[]);

    setVaultOpen(true);
    setVaultLoading(false);
  };

  const useVaultItem = (item: VaultItem) => {
    setIdea(item.prompt);

    try {
      setResult(JSON.parse(item.result));
    } catch {
      setResult(emptyResult);
    }

    setExpanded([]);
    setVaultOpen(false);
  };

  const deleteVaultItem = async (id: string) => {
    if (!user) return;

    setVaultItems((prev) => prev.filter((item) => item.id !== id));

    await supabase
      .from("generations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
  };

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 1200);
  };

  const generateHooks = async () => {
    if (!idea.trim()) return;

    if (generationCount >= 10) {
      router.push("/pricing");
      return;
    }

    setLoading(true);
    setExpanded([]);
    setResult(emptyResult);

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

      await saveGeneration(idea, generatedResult);
      await updateUsage();
      await updateStreak();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const pushFurther = async () => {
    if (result.hooks.length === 0 && result.titles.length === 0) return;

    setExpanding(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `
Expand these creator ideas deeper.

Original Idea:
${idea}

Hooks:
${result.hooks.join("\n")}

Titles:
${result.titles.join("\n")}

Create deeper, sharper second-layer creator directions.
          `,
          language,
          creatorProfile: profile,
        }),
      });

      const data = await response.json();

      setExpanded([
        ...(data.hooks || []),
        ...(data.titles || []),
        ...(data.openings || []),
      ]);
    } catch {
      setExpanded([
        "Push stronger emotional contrast.",
        "Make the first line feel more specific and less generic.",
        "Add a creator identity angle that makes the audience feel seen.",
      ]);
    }

    setExpanding(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (authChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center text-black">
        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          Opening Studio...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_14%_8%,rgba(126,242,194,0.30),transparent_26%),radial-gradient(circle_at_88%_12%,rgba(245,199,107,0.26),transparent_24%),radial-gradient(circle_at_50%_96%,rgba(255,107,95,0.12),transparent_30%),linear-gradient(135deg,#fffaf2_0%,#fff7e8_45%,#f7fff9_100%)] pb-32 text-black">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-black/10 bg-white/55 p-5 shadow-[0_20px_60px_rgba(126,242,194,0.10)] backdrop-blur-xl">
          <div>
            <p className="text-lg font-light tracking-[0.35em]">VIRAL MINT</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-black/40">
              emotionally intelligent creator os
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/pricing")}
              className="rounded-full border border-[#f5c76b]/40 bg-[#fff3d6]/80 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#8a641c] shadow-[0_8px_24px_rgba(245,199,107,0.18)] hover:bg-[#f5c76b] hover:text-black"
            >
              ✦ Upgrade
            </button>

            <button
              onClick={() => router.push("/onboarding")}
              className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-xs uppercase tracking-[0.25em] hover:bg-black hover:text-white"
            >
              Edit DNA
            </button>

            <button
              onClick={loadVault}
              className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-xs uppercase tracking-[0.25em] hover:bg-black hover:text-white"
            >
              {vaultLoading ? "Loading..." : "Vault"}
            </button>

            <button
              onClick={signOut}
              className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-xs uppercase tracking-[0.25em] hover:bg-black hover:text-white"
            >
              Logout
            </button>
          </div>
        </header>

        {vaultOpen && (
          <section className="mt-10 rounded-[2rem] border border-black/10 bg-white/65 p-6 shadow-[0_20px_70px_rgba(126,242,194,0.12)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-black/40">
                Saved Vault
              </p>

              <button
                onClick={() => setVaultOpen(false)}
                className="text-xs uppercase tracking-[0.25em] text-black/40 hover:text-black"
              >
                Close
              </button>
            </div>

            {vaultItems.length === 0 ? (
              <p className="text-sm text-black/50">No saved generations yet.</p>
            ) : (
              <div className="space-y-4">
                {vaultItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.5rem] border border-black/10 bg-[#fffaf2]/70 p-5 hover:bg-white"
                  >
                    <button
                      onClick={() => useVaultItem(item)}
                      className="w-full text-left"
                    >
                      <p className="mb-3 text-xs uppercase tracking-[0.25em] text-black/35">
                        {new Date(item.created_at).toLocaleDateString()}
                      </p>

                      <p className="text-sm font-medium text-black/70">
                        {item.prompt}
                      </p>
                    </button>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => deleteVaultItem(item.id)}
                        className="text-[10px] uppercase tracking-[0.25em] text-black/30 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <p className="mb-5 text-xs uppercase tracking-[0.4em] text-black/35">
            creator workspace
          </p>

          <h1 className="max-w-4xl text-4xl font-light leading-tight tracking-tight md:text-7xl">
            What do you want to create today?
          </h1>

          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-black/35">
            Free Usage · {generationCount}/10
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

          <div className="mt-10 w-full max-w-3xl rounded-[2.5rem] border border-black/10 bg-white/55 p-6 shadow-[0_25px_80px_rgba(126,242,194,0.12)] backdrop-blur-xl">
            <LanguageToggle language={language} setLanguage={setLanguage} />

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your content idea..."
              className="min-h-[200px] w-full rounded-[2rem] border border-black/10 bg-white/80 p-6 text-base outline-none"
            />

            <button
              onClick={generateHooks}
              disabled={loading}
              className="mt-6 rounded-full bg-black px-10 py-4 text-sm uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_rgba(126,242,194,0.25)] hover:scale-[1.03] hover:shadow-[0_14px_50px_rgba(126,242,194,0.40)] disabled:opacity-40"
            >
              {loading ? "Generating..." : "Generate"}
            </button>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {[
                "Replay Psychology Engine",
                "Cinematic Story Expansion",
                "Audience Emotion Map",
                "Viral Momentum Analyzer",
              ].map((tool) => (
                <button
                  key={tool}
                  onClick={() => router.push("/pricing")}
                  className="rounded-[1.7rem] border border-black/10 bg-gradient-to-br from-white/80 to-[#fff3d6] p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(245,199,107,0.25)]"
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#c49b43]">
                    PRO LOCKED
                  </p>

                  <h3 className="mt-4 text-lg font-light text-black/70">
                    {tool}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-black/45">
                    Unlock this premium creator system in Pro.
                  </p>
                </button>
              ))}
            </div>
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
                saveSingleOutput={saveSingleOutput}
                section="hooks"
              />

              <OutputBlock
                title="Titles"
                items={result.titles}
                copiedKey={copiedKey}
                copyText={copyText}
                saveSingleOutput={saveSingleOutput}
                section="titles"
              />

              <OutputBlock
                title="Thumbnail Direction"
                items={result.thumbnails}
                copiedKey={copiedKey}
                copyText={copyText}
                saveSingleOutput={saveSingleOutput}
                section="thumbnails"
              />

              <OutputBlock
                title="Opening Sequence"
                items={result.openings}
                copiedKey={copiedKey}
                copyText={copyText}
                saveSingleOutput={saveSingleOutput}
                section="openings"
              />

              <OutputBlock
                title="Emotional CTA"
                items={result.ctas}
                copiedKey={copiedKey}
                copyText={copyText}
                saveSingleOutput={saveSingleOutput}
                section="ctas"
              />

              <div className="flex justify-center">
                <button
                  onClick={pushFurther}
                  disabled={expanding}
                  className="rounded-full border border-black/10 bg-white/70 px-8 py-4 text-xs uppercase tracking-[0.3em] text-black/55 hover:bg-black hover:text-white disabled:opacity-40"
                >
                  {expanding ? "Unfolding..." : "Push Further →"}
                </button>
              </div>

              {expanded.length > 0 && (
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-black/35">
                    Deeper Directions
                  </p>

                  {expanded.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[1.5rem] border border-black/10 bg-white/70 p-5 text-sm leading-7 text-black/70 shadow-[0_12px_40px_rgba(126,242,194,0.08)]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-[2rem] border border-black/10 bg-white/80 p-3 shadow-[0_20px_70px_rgba(126,242,194,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={generateHooks}
            disabled={loading || !idea.trim()}
            className="rounded-full bg-black px-8 py-3 text-xs uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_rgba(126,242,194,0.22)] hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(126,242,194,0.36)] disabled:opacity-40"
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
              : "rounded-full border border-black/10 bg-white/60 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-black/45 hover:bg-black hover:text-white"
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
  saveSingleOutput,
  section,
}: {
  title: string;
  items: string[];
  copiedKey: string;
  copyText: (text: string, key: string) => void;
  saveSingleOutput: (section: keyof ResultState, text: string) => void;
  section: keyof ResultState;
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
              className="rounded-[1.5rem] border border-black/10 bg-white/70 p-5 text-sm leading-7 text-black/70 shadow-[0_12px_40px_rgba(126,242,194,0.08)]"
            >
              <p>{item}</p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => copyText(item, key)}
                  className="text-[10px] uppercase tracking-[0.25em] text-black/35 hover:text-black"
                >
                  {copiedKey === key ? "Copied" : "Copy"}
                </button>

                <button
                  onClick={() => saveSingleOutput(section, item)}
                  className="text-[10px] uppercase tracking-[0.25em] text-black/35 hover:text-black"
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}