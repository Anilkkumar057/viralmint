"use client";

import { useEffect, useMemo, useState } from "react";
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

type ToolCard = {
  title: string;
  desc: string;
  tag: string;
  icon: string;
};

const emptyResult: ResultState = {
  hooks: [],
  titles: [],
  thumbnails: [],
  ctas: [],
  openings: [],
};

const toolChips = [
  "Hook Generator",
  "Viral Title",
  "Script Engine",
  "Thumbnails",
  "Hashtag Finder",
  "Repurpose Pack",
  "Emotion Map",
];

const toolCards: ToolCard[] = [
  {
    title: "Hook Generator",
    desc: "Create scroll-stopping hooks instantly.",
    tag: "Popular",
    icon: "⚡",
  },
  {
    title: "Viral Title",
    desc: "AI titles that grab attention.",
    tag: "Popular",
    icon: "T",
  },
  {
    title: "Script Engine",
    desc: "Create engaging scripts that convert.",
    tag: "Popular",
    icon: "▤",
  },
  {
    title: "Thumbnails",
    desc: "High CTR thumbnail ideas that stand out.",
    tag: "New",
    icon: "▧",
  },
  {
    title: "Hashtag Finder",
    desc: "Find trend-ready hashtags that rank.",
    tag: "Popular",
    icon: "#",
  },
  {
    title: "Emotion Map",
    desc: "Trigger emotions that drive engagement.",
    tag: "New",
    icon: "♡",
  },
  {
    title: "Repurpose Pack",
    desc: "Turn one idea into multiple assets.",
    tag: "New",
    icon: "↻",
  },
];

export default function StudioPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanding, setExpanding] = useState(false);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState("Hinglish");

  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [plan, setPlan] = useState("free");

  const [result, setResult] = useState<ResultState>(emptyResult);
  const [expanded, setExpanded] = useState<string[]>([]);

  const [generationCount, setGenerationCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [lastGenerationDate, setLastGenerationDate] = useState("");

  const [upgradeNotice, setUpgradeNotice] = useState(false);

  const [vaultOpen, setVaultOpen] = useState(false);
  const [vaultLoading, setVaultLoading] = useState(false);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [copiedKey, setCopiedKey] = useState("");

  const cleanPlan = (plan || "free").toLowerCase();
  const isPremiumUser = cleanPlan !== "free";

  const firstName = useMemo(() => {
    const fullName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "Creator";

    return String(fullName).trim().split(" ")[0] || "Creator";
  }, [user]);

  const initials = useMemo(() => {
    return firstName.slice(0, 2).toUpperCase();
  }, [firstName]);

  const usageText =
    cleanPlan === "free"
      ? `Free Trial · ${generationCount}/10`
      : `${cleanPlan.toUpperCase()} Plan · Unlimited`;

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
      loadPlan(data.user.id, data.user.email || "");
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
        loadPlan(session.user.id, session.user.email || "");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Profile load error:", error);
      return;
    }

    if (!data) {
      router.push("/onboarding");
      return;
    }

    setProfile({
      niche: data.niche || "",
      platform: data.platform || data.main_platform || "",
      style: data.style || data.creator_style || "",
      goal: data.goal || data.emotional_preference || "",
    });
  };

  const loadPlan = async (userId: string, email: string) => {
    const normalizedEmail = email.toLowerCase();
    const ownerEmails = ["mystocktradesk@gmail.com"];

    if (ownerEmails.includes(normalizedEmail)) {
      const { error: ownerSyncError } = await supabase.from("user_profiles").upsert(
        {
          id: userId,
          email: normalizedEmail,
          plan: "elite",
          is_premium: true,
          is_admin: true,
          is_locked: false,
        },
        { onConflict: "id" }
      );

      if (ownerSyncError) {
        console.error("Owner plan sync error:", ownerSyncError);
      }

      setPlan("elite");
      return;
    }

    const { data, error } = await supabase
      .from("user_profiles")
      .select("plan, is_premium, is_locked")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Plan load error:", error);
      setPlan("free");
      return;
    }

    if (!data) {
      const { data: createdProfile, error: createError } = await supabase
        .from("user_profiles")
        .insert([
          {
            id: userId,
            email: normalizedEmail,
            plan: "free",
            is_premium: false,
            is_locked: false,
          },
        ])
        .select("plan, is_premium, is_locked")
        .maybeSingle();

      if (createError) {
        console.error("Profile create error:", createError);
        setPlan("free");
        return;
      }

      setPlan(
        createdProfile?.is_premium && createdProfile?.plan
          ? createdProfile.plan
          : "free"
      );
      return;
    }

    if (data.is_locked) {
      setPlan("free");
      return;
    }

    if (data.is_premium && data.plan) {
      setPlan(data.plan);
      return;
    }

    setPlan("free");
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

    await saveGeneration(
      `Saved ${section}: ${idea || "Viral Mint output"}`,
      singleResult
    );

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

    if (cleanPlan === "free" && generationCount >= 10) {
      setUpgradeNotice(true);
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

    if (cleanPlan === "free") {
      setUpgradeNotice(true);
      return;
    }

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
        "Make the first line more specific and less generic.",
        "Add a creator identity angle that makes the audience feel seen.",
      ]);
    }

    setExpanding(false);
  };

  const openPremiumTool = (tool: string) => {
    if (cleanPlan === "free") {
      setUpgradeNotice(true);
      return;
    }

    if (tool === "Premium Tools") {
      router.push("/premium-tools");
      return;
    }

    if (tool === "Vault") {
      loadVault();
      return;
    }

    if (tool === "Thumbnails") {
      setIdea((prev) =>
        prev.trim()
          ? `${prev}\n\nAlso create thumbnail direction.`
          : "Create thumbnail direction for my next viral post."
      );
      return;
    }

    alert(`${tool} unlocked. Full premium tool screen coming next.`);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (authChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/70">
          Opening Studio...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(245,183,44,0.13),transparent_28%),radial-gradient(circle_at_72%_12%,rgba(255,213,79,0.10),transparent_26%),linear-gradient(135deg,#050505_0%,#090807_52%,#050505_100%)]" />

      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-yellow-500/10 bg-black/55 px-5 py-7 backdrop-blur-xl lg:block">
          <div className="mb-10">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-600 text-xl font-black text-black shadow-[0_0_40px_rgba(245,183,44,0.24)]">
                M
              </div>

              <div>
                <p className="text-xl font-black tracking-wide">VIRAL MINT</p>
                <span className="mt-1 inline-flex rounded-full bg-yellow-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black">
                  {cleanPlan === "free" ? "Free" : cleanPlan}
                </span>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { icon: "⌂", label: "Studio", active: true, action: () => null },
              { icon: "▣", label: "Vault", active: false, action: loadVault },
              { icon: "↯", label: "Push Further", active: false, action: pushFurther },
              {
                icon: "▧",
                label: "Thumbnails",
                active: false,
                action: () => openPremiumTool("Thumbnails"),
              },
              {
                icon: "♕",
                label: "Premium Tools",
                active: false,
                action: () => openPremiumTool("Premium Tools"),
              },
              { icon: "⌘", label: "DNA", active: false, action: () => router.push("/onboarding") },
              { icon: "▥", label: "Growth Map", active: false, action: () => openPremiumTool("Growth Map") },
              { icon: "◴", label: "Analytics", active: false, action: () => openPremiumTool("Analytics") },
              { icon: "☷", label: "Audience", active: false, action: () => openPremiumTool("Audience") },
              { icon: "⚙", label: "Settings", active: false, action: () => openPremiumTool("Settings") },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={
                  item.active
                    ? "flex w-full items-center gap-3 rounded-[1.2rem] border border-yellow-400/45 bg-yellow-400/10 px-4 py-3 text-left text-sm font-semibold text-yellow-200 shadow-[0_0_30px_rgba(245,183,44,0.13)]"
                    : "flex w-full items-center gap-3 rounded-[1.2rem] border border-transparent px-4 py-3 text-left text-sm text-white/70 transition-all duration-300 hover:border-yellow-400/20 hover:bg-white/[0.04] hover:text-yellow-100"
                }
              >
                <span className="text-lg text-yellow-300">{item.icon}</span>
                <span>{item.label}</span>
                {item.label === "Thumbnails" && (
                  <span className="ml-auto rounded-full bg-yellow-400/15 px-2 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-yellow-300">
                    New
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-10 rounded-[1.5rem] border border-yellow-400/25 bg-yellow-400/[0.06] p-4 shadow-[0_0_40px_rgba(245,183,44,0.08)]">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-yellow-300">
              ♕ {cleanPlan === "free" ? "Free Plan" : `${cleanPlan} Plan`}
            </p>

            <p className="mt-2 text-sm text-emerald-300">
              {isPremiumUser ? "Unlimited Access" : `${generationCount}/10 Trial Uses`}
            </p>

            <button
              onClick={() => router.push(isPremiumUser ? "/premium-tools" : "/pricing")}
              className="mt-4 flex w-full items-center justify-between rounded-[1rem] border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/85 hover:border-yellow-400/30"
            >
              {isPremiumUser ? "Open Tools" : "Upgrade"} <span>›</span>
            </button>
          </div>

          <div className="absolute bottom-7 left-5 right-5 space-y-2 text-sm text-white/65">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:text-yellow-200">
              ? Help & Support
            </button>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 hover:text-yellow-200"
            >
              ↪ Logout
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-yellow-500/10 bg-black/50 px-5 py-4 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-yellow-300">◌</span>
                <p className="text-sm text-white/80">
                  Welcome back,{" "}
                  <span className="font-semibold text-white">{firstName}</span>{" "}
                  <span className="text-yellow-300">♕</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {cleanPlan === "elite" && (
                  <button
                    onClick={() => router.push("/admin")}
                    className="hidden rounded-[1.2rem] border border-yellow-400/45 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300 shadow-[0_0_35px_rgba(245,183,44,0.18)] md:block"
                  >
                    ♕ Admin
                  </button>
                )}

                <div className="hidden rounded-[1.2rem] border border-yellow-400/45 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300 shadow-[0_0_35px_rgba(245,183,44,0.18)] md:block">
                  ♕ {cleanPlan === "free" ? "Free Active" : `${cleanPlan} Active`}
                </div>

                <button
                  onClick={loadVault}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 hover:border-yellow-400/30 hover:text-yellow-200"
                >
                  ▣
                </button>

                <div className="relative">
                  <button
                    onClick={() => setLanguageOpen((value) => !value)}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white/85 transition-all hover:border-yellow-400/30"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-[11px] font-bold">
                      {initials}
                    </span>

                    <span className="hidden md:inline">{firstName}</span>
                    <span className="text-white/40">⌄</span>
                  </button>

                  {languageOpen && (
                    <div className="absolute right-0 top-12 z-40 w-56 rounded-[1.4rem] border border-yellow-400/20 bg-[#080807]/95 p-3 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                      <p className="mb-2 border-b border-white/10 pb-3 text-sm text-white/85">
                        🌐 Language / भाषा
                      </p>

                      {["English", "हिन्दी", "Hinglish"].map((item) => (
                        <button
                          key={item}
                          onClick={() => {
                            setLanguage(item);
                            setLanguageOpen(false);
                          }}
                          className={
                            language === item
                              ? "mb-1 flex w-full items-center justify-between rounded-xl border border-yellow-400/40 bg-yellow-400/10 px-3 py-2 text-sm text-yellow-300"
                              : "mb-1 flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/[0.05] hover:text-white"
                          }
                        >
                          {item}
                          {language === item && <span>✓</span>}
                        </button>
                      ))}

                      <div className="mt-3 border-t border-white/10 pt-3">
                        <button
                          onClick={() => router.push("/onboarding")}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/[0.05]"
                        >
                          ♙ Profile DNA
                        </button>
                        <button
                          onClick={() => router.push("/pricing")}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/[0.05]"
                        >
                          ▤ Billing
                        </button>
                        <button
                          onClick={signOut}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white/65 hover:bg-white/[0.05]"
                        >
                          ↪ Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-5 py-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-full border border-yellow-400/50 bg-yellow-400/10 text-3xl font-black text-yellow-300 shadow-[0_0_45px_rgba(245,183,44,0.16)]">
                  {initials}
                </div>

                <div>
                  <h1 className="text-3xl font-black">
                    {firstName} <span className="text-yellow-300">♕</span>
                  </h1>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-yellow-300">
                    {cleanPlan === "free" ? "Creator" : `${cleanPlan} Creator`}
                  </p>
                  <p className="mt-1 text-sm text-white/55">
                    Your Creator Workspace is ready.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  { label: "DNA", icon: "⌬", action: () => router.push("/onboarding") },
                  { label: "Vault", icon: "▱", action: loadVault },
                  { label: "Pricing", icon: "♕", action: () => router.push("/pricing") },
                  { label: "Logout", icon: "↪", action: signOut },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="rounded-[1.3rem] border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/75 transition-all duration-300 hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-200"
                  >
                    <span className="mb-1 block text-xl text-yellow-300">
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <section className="relative overflow-hidden rounded-[2rem] border border-yellow-400/35 bg-[#090807] p-8 shadow-[0_30px_120px_rgba(245,183,44,0.11)]">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_58%,rgba(245,183,44,0.34),transparent_25%),linear-gradient(90deg,rgba(0,0,0,0.0)_0%,rgba(245,183,44,0.05)_100%)]" />
              <div className="pointer-events-none absolute -right-12 bottom-[-90px] h-80 w-[520px] rounded-[100%] border-t border-yellow-300/40 bg-yellow-400/10 blur-[1px]" />
              <div className="pointer-events-none absolute right-32 top-10 text-[12rem] font-black leading-none text-yellow-300/15">
                M
              </div>

              <div className="relative z-10 max-w-3xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-300">
                  Premium Creator Engine
                </p>

                <h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">
                  Premium Tools
                  <br />
                  Unlimited Power for{" "}
                  <span className="text-yellow-300">
                    {cleanPlan === "free" ? "Creators" : cleanPlan}
                  </span>{" "}
                  Creators
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
                  Generate hooks, captions, scripts, hashtags, thumbnails,
                  repurpose packs, emotional CTAs, and creator growth systems
                  from one cinematic studio.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      router.push(isPremiumUser ? "/premium-tools" : "/pricing")
                    }
                    className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black shadow-[0_18px_50px_rgba(245,183,44,0.24)] transition-all hover:scale-[1.02]"
                  >
                    {isPremiumUser ? "Open Premium Tools ›" : "Unlock Premium ›"}
                  </button>

                  <button
                    onClick={() => openPremiumTool("How It Works")}
                    className="rounded-[1rem] border border-yellow-400/25 bg-black/30 px-5 py-3 text-sm text-white/80 hover:border-yellow-400/45 hover:text-yellow-200"
                  >
                    How It Works ▷
                  </button>
                </div>
              </div>

              <div className="absolute right-6 top-5 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-yellow-300">
                ♕ {cleanPlan === "free" ? "Free Active" : `${cleanPlan} Active`}
              </div>
            </section>

            {vaultOpen && (
              <section className="mt-7 rounded-[1.8rem] border border-yellow-400/15 bg-white/[0.035] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-300">
                    Saved Vault
                  </p>

                  <button
                    onClick={() => setVaultOpen(false)}
                    className="text-sm text-white/55 hover:text-yellow-200"
                  >
                    Close
                  </button>
                </div>

                {vaultItems.length === 0 ? (
                  <p className="text-sm text-white/45">No saved generations yet.</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {vaultItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[1.3rem] border border-white/10 bg-black/25 p-4"
                      >
                        <button
                          onClick={() => useVaultItem(item)}
                          className="w-full text-left"
                        >
                          <p className="mb-3 text-[10px] uppercase tracking-[0.25em] text-yellow-300/70">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>

                          <p className="line-clamp-3 text-sm text-white/70">
                            {item.prompt}
                          </p>
                        </button>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => deleteVaultItem(item.id)}
                            className="text-[10px] uppercase tracking-[0.25em] text-white/35 hover:text-red-300"
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

            <section className="mt-8 text-center">
              <p className="text-[11px] font-bold uppercase tracking-[0.45em] text-yellow-300">
                Creator Workspace
              </p>

              <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
                What do you want to create today?
              </h2>

              <div className="mx-auto mt-3 inline-flex flex-wrap justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-[11px] uppercase tracking-[0.18em] text-white/55">
                {usageText} <span className="mx-3 text-yellow-300">•</span>
                Creative Flow <span className="mx-3 text-yellow-300">•</span>
                Day {streakCount}
              </div>

              {profile && (
                <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-white/35">
                  {profile.niche} · {profile.platform} · {profile.style} · {profile.goal}
                </p>
              )}

              {upgradeNotice && (
                <div className="mx-auto mt-8 w-full max-w-2xl rounded-[2rem] border border-yellow-400/25 bg-[#090807] p-6 text-left shadow-[0_25px_90px_rgba(245,183,44,0.10)]">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-yellow-300">
                    Creator Flow
                  </p>

                  <h3 className="mt-4 text-3xl font-black leading-tight text-white">
                    Your free creator session is complete.
                  </h3>

                  <p className="mt-5 text-sm leading-8 text-white/60">
                    Premium unlocks unlimited generation, deeper creator systems,
                    cinematic expansion, and advanced audience retention tools.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      onClick={() => router.push("/pricing")}
                      className="rounded-[1rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black hover:scale-[1.02]"
                    >
                      Continue With Premium
                    </button>

                    <button
                      onClick={() => setUpgradeNotice(false)}
                      className="rounded-[1rem] border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/65 hover:border-yellow-400/30 hover:text-yellow-200"
                    >
                      Stay in Studio
                    </button>
                  </div>
                </div>
              )}

              <div className="mx-auto mt-6 flex max-w-5xl items-center gap-3 rounded-[1.5rem] border border-yellow-400/18 bg-white/[0.035] p-3 text-left shadow-[0_25px_80px_rgba(0,0,0,0.35)]">
                <input
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  maxLength={600}
                  placeholder='Type your idea... (e.g. "Viral hook about never giving up")'
                  className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-white/35"
                />

                <span className="hidden text-xs text-white/35 md:inline">
                  {idea.length}/600
                </span>

                <button
                  onClick={generateHooks}
                  disabled={loading || !idea.trim()}
                  className="rounded-[1rem] border border-yellow-400/50 bg-black/30 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(245,183,44,0.12)] transition-all hover:scale-[1.02] hover:bg-yellow-400 hover:text-black disabled:opacity-40"
                >
                  {loading ? "Generating..." : "Generate ✨"}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {toolChips.map((tool) => (
                  <button
                    key={tool}
                    onClick={() => openPremiumTool(tool)}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-5 py-2 text-sm text-white/75 transition-all hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-yellow-200"
                  >
                    <span className="mr-2 text-yellow-300">
                      {tool === "Thumbnails"
                        ? "▧"
                        : tool === "Hashtag Finder"
                          ? "#"
                          : "✦"}
                    </span>
                    {tool}
                    {tool === "Thumbnails" && (
                      <span className="ml-2 rounded-full bg-yellow-400/15 px-2 py-1 text-[9px] uppercase text-yellow-300">
                        New
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-7 rounded-[1.6rem] border border-white/10 bg-white/[0.025] p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-300">
                  Elite Creator Tools
                </p>

                <button
                  onClick={() => router.push("/premium-tools")}
                  className="text-sm text-yellow-300 hover:text-yellow-200"
                >
                  View All Tools →
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {toolCards.map((tool) => (
                  <button
                    key={tool.title}
                    onClick={() => openPremiumTool(tool.title)}
                    className="group rounded-[1.3rem] border border-white/10 bg-white/[0.035] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/35 hover:bg-yellow-400/[0.06] hover:shadow-[0_25px_80px_rgba(245,183,44,0.09)]"
                  >
                    <div className="text-2xl text-yellow-300">{tool.icon}</div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      {tool.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      {tool.desc}
                    </p>
                    <span className="mt-5 inline-flex rounded-full bg-yellow-400/12 px-3 py-1 text-xs text-yellow-300">
                      {isPremiumUser ? tool.tag : "Locked"}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {(result.hooks.length > 0 ||
              result.titles.length > 0 ||
              result.thumbnails.length > 0 ||
              result.ctas.length > 0 ||
              result.openings.length > 0) && (
              <section className="mt-8 rounded-[1.8rem] border border-yellow-400/15 bg-white/[0.025] p-5">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-300">
                      Generated Output
                    </p>
                    <p className="mt-2 text-sm text-white/45">
                      Copy, save, or unfold deeper directions.
                    </p>
                  </div>

                  <button
                    onClick={pushFurther}
                    disabled={expanding}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/65 transition-all hover:border-yellow-400/30 hover:text-yellow-200 disabled:opacity-40"
                  >
                    {expanding ? "Unfolding..." : "Push Further →"}
                  </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
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
                </div>

                {expanded.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-300">
                      Deeper Directions
                    </p>

                    {expanded.map((item, index) => (
                      <div
                        key={`${item}-${index}`}
                        className="rounded-[1.3rem] border border-white/10 bg-black/25 p-5 text-sm leading-7 text-white/70"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        </section>
      </div>
    </main>
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
    <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-5">
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.35em] text-yellow-300">
        {title}
      </p>

      <div className="space-y-4">
        {items.map((item, index) => {
          const key = `${section}-${index}`;

          return (
            <div
              key={key}
              className="rounded-[1.2rem] border border-white/10 bg-white/[0.035] p-4 text-sm leading-7 text-white/72"
            >
              <p>{item}</p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => copyText(item, key)}
                  className="text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-yellow-300"
                >
                  {copiedKey === key ? "Copied" : "Copy"}
                </button>

                <button
                  onClick={() => saveSingleOutput(section, item)}
                  className="text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-yellow-300"
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
