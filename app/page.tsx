"use client";

import { memo, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

type CreatorProfile = {
  id?: string;
  user_id?: string;
  niche: string;
  main_platform: string;
  creator_style: string;
  emotional_preference: string;
};

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

const emptyResult: ResultState = {
  hooks: [],
  titles: [],
  thumbnails: [],
  ctas: [],
  openings: [],
};

const FREE_LIMIT = 10;
const IdeaBox = memo(function IdeaBox({
  ideaRef,
}: {
  ideaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <textarea
      ref={ideaRef}
      placeholder="fitness tips for people who always restart on Monday..."
      className="min-h-36 w-full resize-none rounded-[2rem] border border-black/10 bg-white/60 p-6 text-base outline-none"
    />
  );
});
export default function Home() {
  const [idea, setIdea] = useState("");
  const ideaRef = useRef<HTMLTextAreaElement | null>(null);

  const [result, setResult] = useState<ResultState>(emptyResult);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [momentumTags, setMomentumTags] = useState<string[]>([]);
  const [creatorMemories, setCreatorMemories] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");
  const [showProBanner, setShowProBanner] = useState(false);

  const [generationCount, setGenerationCount] = useState(0);
  const [plan, setPlan] = useState("free");

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [editingIdentity, setEditingIdentity] = useState(false);

  const [vaultOpen, setVaultOpen] = useState(false);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);

  const [onboarding, setOnboarding] = useState<CreatorProfile>({
    niche: "",
    main_platform: "",
    creator_style: "",
    emotional_preference: "",
  });

  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Creator";

  const creatorName = String(fullName).trim().split(" ")[0] || "Creator";

  useEffect(() => {
    const start = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        loadProfile(data.user.id);
        loadMemories(data.user.id);
        loadUsage(data.user.id);
      }
    };

    start();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          loadProfile(currentUser.id);
          loadMemories(currentUser.id);
          loadUsage(currentUser.id);
        } else {
          setProfile(null);
          setVaultOpen(false);
          setVaultItems([]);
          setCreatorMemories([]);
          setEditingIdentity(false);
          setGenerationCount(0);
          setPlan("free");
          setShowProBanner(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (data) {
      setProfile(data);
      setOnboarding({
        niche: data.niche || "",
        main_platform: data.main_platform || "",
        creator_style: data.creator_style || "",
        emotional_preference: data.emotional_preference || "",
      });
    }
  };

  const loadMemories = async (userId: string) => {
    const { data } = await supabase
      .from("creator_memory")
      .select("*")
      .eq("user_id", userId)
      .limit(5);

    if (data) {
      setCreatorMemories(data.map((item: any) => item.creator_style));
    }
  };

  const loadUsage = async (userId: string) => {
    const { data } = await supabase
      .from("usage_limits")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (!data) {
      const { data: inserted } = await supabase
        .from("usage_limits")
        .insert([
          {
            user_id: userId,
            generation_count: 0,
            plan: "free",
          },
        ])
        .select()
        .single();

      if (inserted) {
        setGenerationCount(inserted.generation_count || 0);
        setPlan(inserted.plan || "free");
      }

      return;
    }

    setGenerationCount(data.generation_count || 0);
    setPlan(data.plan || "free");
  };

  const incrementUsage = async () => {
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

  const triggerProBanner = () => {
    setShowProBanner(true);

    setTimeout(() => {
      setShowProBanner(false);
    }, 5000);
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setVaultOpen(false);
    setVaultItems([]);
    setCreatorMemories([]);
    setEditingIdentity(false);
    setGenerationCount(0);
    setPlan("free");
    setShowProBanner(false);
  };

  const saveProfile = async () => {
    if (!user) return;

    const payload = {
      user_id: user.id,
      niche: onboarding.niche,
      main_platform: onboarding.main_platform || "Instagram",
      creator_style: onboarding.creator_style || "Emotional",
      emotional_preference: onboarding.emotional_preference || "Curious",
    };

    if (profile?.id) {
      const { data } = await supabase
        .from("creator_profiles")
        .update(payload)
        .eq("id", profile.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (data) {
        setProfile(data);
        setEditingIdentity(false);
      }

      return;
    }

    const { data } = await supabase
      .from("creator_profiles")
      .insert([payload])
      .select()
      .single();

    if (data) {
      setProfile(data);
      setEditingIdentity(false);
    }
  };

  const saveGeneration = async (prompt: string, generatedResult: ResultState) => {
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

    const currentIdea = ideaRef.current?.value || idea;

    const singleResult: ResultState = {
      hooks: section === "hooks" ? [text] : [],
      titles: section === "titles" ? [text] : [],
      thumbnails: section === "thumbnails" ? [text] : [],
      ctas: section === "ctas" ? [text] : [],
      openings: section === "openings" ? [text] : [],
    };

    await saveGeneration(
      `Saved ${section}: ${currentIdea || "Viral Mint output"}`,
      singleResult
    );

    await loadVault();
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

  const saveMemory = async (memory: string) => {
    if (!user) return;

    await supabase.from("creator_memory").insert([
      {
        user_id: user.id,
        niche: profile?.niche || "",
        platform: profile?.main_platform || "",
        creator_style: memory,
        emotional_preference: profile?.emotional_preference || "",
      },
    ]);

    setCreatorMemories((prev) => [memory, ...prev].slice(0, 5));
  };

  const loadVault = async () => {
    if (!user) return;

    setVaultLoading(true);

    const { data } = await supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) setVaultItems(data as VaultItem[]);

    setVaultOpen(true);
    setVaultLoading(false);
  };

  const useVaultItem = (item: VaultItem) => {
    setIdea(item.prompt);

    if (ideaRef.current) {
      ideaRef.current.value = item.prompt;
    }

    try {
      setResult(JSON.parse(item.result));
    } catch {
      setResult({
        hooks: item.result.split("\n\n"),
        titles: [],
        thumbnails: [],
        ctas: [],
        openings: [],
      });
    }

    setExpanded([]);
    setVaultOpen(false);
  };

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 1200);
  };

  const generateMomentumTags = () => {
    const tags = [
      "Replay Potential ↑",
      "Curiosity Heavy",
      "Emotionally Sticky",
      "Strong Opening",
      "Comment Trigger",
      "Scroll Stopper",
    ];

    setMomentumTags(tags.sort(() => 0.5 - Math.random()).slice(0, 3));
  };

  const generateHooks = async () => {
    const currentIdea = ideaRef.current?.value || "";

    if (!currentIdea.trim()) return;

    setIdea(currentIdea);

    if (user && plan === "free" && generationCount >= FREE_LIMIT) {
      triggerProBanner();
      return;
    }

    setLoading(true);
    setExpanded([]);
    setResult(emptyResult);
    setMomentumTags([]);
    setShowProBanner(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentIdea,
          language: "Hinglish",
          platform: profile?.main_platform || "Instagram",
          tone: profile?.creator_style || "Emotional",
          creatorProfile: profile,
          creatorMemories,
          creatorName,
        }),
      });

      const data = await res.json();

      const structuredResult: ResultState = {
        hooks: data?.hooks || [],
        titles: data?.titles || [],
        thumbnails: data?.thumbnails || [],
        ctas: data?.ctas || [],
        openings: data?.openings || [],
      };

      setResult(structuredResult);
      generateMomentumTags();

      await saveGeneration(currentIdea, structuredResult);
      await saveMemory(`${creatorName} explored idea: ${currentIdea}`);
      await incrementUsage();
    } catch {
      const fallback: ResultState = {
        hooks: ["Your idea has strong emotional potential."],
        titles: ["Why creators struggle to hold attention."],
        thumbnails: ["Minimal cinematic portrait with emotional contrast."],
        ctas: ["Make your audience feel understood."],
        openings: ["Most creators think content failure is about algorithms..."],
      };

      setResult(fallback);
      generateMomentumTags();
      await saveGeneration(currentIdea, fallback);
      await incrementUsage();
    }

    setLoading(false);
  };

  const pushFurther = async () => {
    if (result.hooks.length === 0) return;

    setExpanding(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `
Expand these creator ideas deeper.

Creator Name:
${creatorName}

Hooks:
${result.hooks.join("\n")}

Titles:
${result.titles.join("\n")}
          `,
          language: "Hinglish",
          platform: profile?.main_platform || "Instagram",
          tone: profile?.creator_style || "Emotional",
          creatorProfile: profile,
          creatorMemories,
          creatorName,
        }),
      });

      const data = await res.json();
      setExpanded([...(data?.hooks || []), ...(data?.titles || [])]);
    } catch {
      setExpanded(["Push stronger emotional contrast.", "Increase curiosity tension."]);
    }

    setExpanding(false);
  };

  const startEditIdentity = () => {
    if (!profile) return;

    setOnboarding({
      niche: profile.niche || "",
      main_platform: profile.main_platform || "",
      creator_style: profile.creator_style || "",
      emotional_preference: profile.emotional_preference || "",
    });

    setEditingIdentity(true);
  };

  const IdentityForm = () => (
    <div className="mt-10 space-y-5">
      <input
        value={onboarding.niche}
        onChange={(e) => setOnboarding({ ...onboarding, niche: e.target.value })}
        placeholder="fitness, finance, education..."
        className="w-full rounded-full border border-black/10 bg-white/60 px-6 py-4 text-sm outline-none"
      />

      <select
        value={onboarding.main_platform}
        onChange={(e) =>
          setOnboarding({ ...onboarding, main_platform: e.target.value })
        }
        className="w-full rounded-full border border-black/10 bg-white/60 px-6 py-4 text-sm outline-none"
      >
        <option value="">Main platform</option>
        <option value="Instagram">Instagram</option>
        <option value="YouTube Shorts">YouTube Shorts</option>
        <option value="YouTube">YouTube</option>
        <option value="LinkedIn">LinkedIn</option>
        <option value="X">X / Twitter</option>
      </select>

      <select
        value={onboarding.creator_style}
        onChange={(e) =>
          setOnboarding({ ...onboarding, creator_style: e.target.value })
        }
        className="w-full rounded-full border border-black/10 bg-white/60 px-6 py-4 text-sm outline-none"
      >
        <option value="">Creator style</option>
        <option value="Emotional">Emotional</option>
        <option value="Bold">Bold</option>
        <option value="Educational">Educational</option>
        <option value="Luxury Minimal">Luxury Minimal</option>
        <option value="Cinematic">Cinematic</option>
      </select>

      <select
        value={onboarding.emotional_preference}
        onChange={(e) =>
          setOnboarding({
            ...onboarding,
            emotional_preference: e.target.value,
          })
        }
        className="w-full rounded-full border border-black/10 bg-white/60 px-6 py-4 text-sm outline-none"
      >
        <option value="">Audience should feel...</option>
        <option value="Inspired">Inspired</option>
        <option value="Curious">Curious</option>
        <option value="Obsessed">Obsessed</option>
        <option value="Excited">Excited</option>
        <option value="Understood">Understood</option>
      </select>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={saveProfile}
          className="rounded-full bg-black px-8 py-4 text-sm tracking-wide text-white"
        >
          {profile ? "Update Identity" : "Save Creator Identity"}
        </button>

        {profile && (
          <button
            onClick={() => setEditingIdentity(false)}
            className="rounded-full border border-black/10 px-8 py-4 text-sm tracking-wide text-black/60 transition-all duration-500 hover:bg-black hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  const OutputSection = ({
    title,
    section,
    items,
  }: {
    title: string;
    section: keyof ResultState;
    items: string[];
  }) => {
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
                className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5 text-sm leading-7 text-black/70"
              >
                <p>{item}</p>

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => copyText(item, key)}
                    className="text-[10px] uppercase tracking-[0.25em] text-black/35 hover:text-black"
                  >
                    {copiedKey === key ? "Copied" : "Copy"}
                  </button>

                  {user && (
                    <button
                      onClick={() => saveSingleOutput(section, item)}
                      className="text-[10px] uppercase tracking-[0.25em] text-black/35 hover:text-black"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (user && (!profile || editingIdentity)) {
    return (
      <main className="min-h-screen bg-[#fffaf2] text-black">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-8">
          <header className="flex items-center justify-between">
            <h1 className="text-lg font-light tracking-[0.3em]">VIRAL MINT</h1>

            <button
              onClick={signOut}
              className="rounded-full border border-black/10 px-5 py-3 text-sm tracking-wide transition-all duration-500 hover:bg-black hover:text-white"
            >
              Logout
            </button>
          </header>

          <section className="flex flex-1 flex-col justify-center">
            <p className="mb-5 text-xs uppercase tracking-[0.4em] text-black/40">
              creator identity
            </p>

            <h2 className="max-w-2xl text-4xl font-light leading-tight tracking-tight md:text-6xl">
              {profile
                ? `Tune your creative pulse, ${creatorName}.`
                : `Let Viral Mint understand your creative pulse, ${creatorName}.`}
            </h2>

            <IdentityForm />
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf2] text-black">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-light tracking-[0.3em]">VIRAL MINT</h1>

            {user && (
              <p className="mt-2 text-xs tracking-[0.25em] text-black/35">
                Welcome, {creatorName}
                <span className="ml-2">
                  · {generationCount}/{FREE_LIMIT}
                </span>
              </p>
            )}
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-3 sm:w-auto sm:justify-end">
            {user && (
              <>
                <button
                  onClick={startEditIdentity}
                  className="rounded-full border border-black/10 px-4 py-3 text-xs tracking-wide transition-all duration-500 hover:bg-black hover:text-white sm:px-5 sm:text-sm"
                >
                  Edit Identity
                </button>

                <button
                  onClick={loadVault}
                  className="rounded-full border border-black/10 px-4 py-3 text-xs tracking-wide transition-all duration-500 hover:bg-black hover:text-white sm:px-5 sm:text-sm"
                >
                  {vaultLoading ? "Loading..." : "Vault"}
                </button>
              </>
            )}

            {user ? (
              <button
                onClick={signOut}
                className="rounded-full border border-black/10 px-4 py-3 text-xs tracking-wide transition-all duration-500 hover:bg-black hover:text-white sm:px-5 sm:text-sm"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="rounded-full border border-black/10 px-4 py-3 text-xs tracking-wide transition-all duration-500 hover:bg-black hover:text-white sm:px-5 sm:text-sm"
              >
                Continue with Google
              </button>
            )}
          </div>
        </header>

        {vaultOpen && (
          <section className="mt-10 rounded-[2rem] border border-black/10 bg-white/50 p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-black/40">
                saved vault
              </p>

              <button
                onClick={() => setVaultOpen(false)}
                className="text-xs tracking-[0.25em] text-black/40 hover:text-black"
              >
                CLOSE
              </button>
            </div>

            {vaultItems.length === 0 ? (
              <p className="text-sm text-black/50">No saved generations yet.</p>
            ) : (
              <div className="space-y-4">
                {vaultItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.5rem] border border-black/10 bg-[#fffaf2]/70 p-5 transition-all duration-500 hover:bg-white"
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

        <section className="flex flex-1 flex-col items-center justify-center text-center">
          {showProBanner && (
            <div className="mb-10 w-full max-w-2xl rounded-[2rem] border border-black/10 bg-white/70 p-6 text-left backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.35em] text-black/35">
                Viral Mint Pro
              </p>

              <h3 className="mt-3 text-2xl font-light leading-tight text-black/80">
                Your free creator energy is fully unlocked.
              </h3>

              <p className="mt-4 max-w-xl text-sm leading-7 text-black/55">
                Viral Mint Pro unlocks deeper creator intelligence, unlimited
                generations, emotional strategy layers, replay psychology, and
                cinematic creator expansion systems.
              </p>

              <div className="mt-6 flex flex-col items-start">
                <img
                  src="/upi-qr.png"
                  alt="UPI QR"
                  className="w-52 rounded-[1.5rem] border border-black/10"
                />

                <p className="mt-5 text-xs uppercase tracking-[0.3em] text-black/40">
                  Scan & Pay via UPI
                </p>

                <p className="mt-3 max-w-sm text-sm leading-7 text-black/55">
                  After payment, send screenshot or transaction ID for Pro
                  activation.
                </p>
              </div>
            </div>
          )}

          <p className="mb-5 text-xs uppercase tracking-[0.4em] text-black/40">
            emotionally intelligent creator OS
          </p>

          <h2 className="max-w-3xl text-4xl font-light leading-tight tracking-tight md:text-6xl">
            {user
              ? `What do you want to create today, ${creatorName}?`
              : "What do you want to create today?"}
          </h2>

          {profile && (
            <p className="mt-5 text-xs tracking-[0.25em] text-black/35">
              {profile.main_platform} · {profile.creator_style} ·{" "}
              {profile.emotional_preference}
            </p>
          )}

          {user && plan === "free" && (
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-black/35">
              Free plan · {generationCount}/{FREE_LIMIT} generations
            </p>
          )}

          <div className="mt-10 w-full max-w-2xl">
            <textarea
              <IdeaBox ideaRef={ideaRef} />
            />

            <button
              onClick={generateHooks}
              disabled={loading}
              className="mt-5 rounded-full bg-black px-8 py-4 text-sm tracking-wide text-white disabled:opacity-40"
            >
              {loading ? "Minting..." : "Start"}
            </button>
          </div>

          {result.hooks.length > 0 && (
            <div className="mt-12 w-full max-w-2xl text-left">
              <div className="space-y-10">
                <OutputSection title="Hooks" section="hooks" items={result.hooks} />
                <OutputSection title="Titles" section="titles" items={result.titles} />
                <OutputSection
                  title="Thumbnail Direction"
                  section="thumbnails"
                  items={result.thumbnails}
                />
                <OutputSection
                  title="Opening Sequence"
                  section="openings"
                  items={result.openings}
                />
                <OutputSection
                  title="Emotional CTA"
                  section="ctas"
                  items={result.ctas}
                />
              </div>

              {momentumTags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {momentumTags.map((tag, index) => (
                    <div
                      key={index}
                      className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-black/50"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <button
                  onClick={pushFurther}
                  disabled={expanding}
                  className="rounded-full border border-black/10 px-6 py-3 text-xs tracking-[0.3em] text-black/60 transition-all duration-500 hover:bg-black hover:text-white disabled:opacity-40"
                >
                  {expanding ? "UNFOLDING..." : "PUSH FURTHER →"}
                </button>
              </div>

              {expanded.length > 0 && (
                <div className="mt-10 space-y-4">
                  {expanded.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-[1.5rem] border border-black/10 bg-white/60 p-5 text-sm leading-7 text-black/70"
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
    </main>
  );
}