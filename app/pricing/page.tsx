"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type CurrentProfile = {
  plan?: string | null;
  is_premium?: boolean | null;
};

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "₹999",
    note: "For new creators building consistency.",
    features: [
      "50 creator generations",
      "Hook Generator",
      "Basic titles",
      "Starter vault",
      "Hinglish support",
    ],
    badge: "Start",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro Creator",
    price: "₹2999",
    note: "For creators serious about growth.",
    features: [
      "Unlimited generations",
      "Premium hooks",
      "Script Engine",
      "Thumbnail Psychology",
      "Vault access",
      "Repurpose packs",
    ],
    badge: "Popular",
    highlighted: true,
  },
  {
    id: "elite",
    name: "Elite Creator",
    price: "₹5999",
    note: "The full creator operating system.",
    features: [
      "Unlimited everything",
      "Elite Creator Engine",
      "Emotional AI",
      "Advanced thumbnails",
      "Creator memory ready",
      "Priority future tools",
      "Admin/manual approval compatible",
    ],
    badge: "Royal",
    highlighted: true,
  },
];

export default function PricingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState("");

  const cleanPlan = useMemo(() => {
    return (currentPlan || "free").toLowerCase();
  }, [currentPlan]);

  useEffect(() => {
    loadCurrentPlan();
  }, []);

  async function loadCurrentPlan() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data } = await supabase
      .from("user_profiles")
      .select("plan,is_premium")
      .eq("id", user.id)
      .maybeSingle();

    const profile = data as CurrentProfile | null;

    if (profile?.is_premium && profile?.plan) {
      setCurrentPlan(profile.plan);
    } else {
      setCurrentPlan("free");
    }

    setLoading(false);
  }

  async function requestPlan(planId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    setStatus("Preparing your upgrade request...");

    /*
      MVP mode:
      This manually marks request intent. Admin can still approve/change plans.
      Razorpay auto-unlock will replace this later.
    */

    const { error } = await supabase.from("user_profiles").upsert(
      {
        id: user.id,
        email: user.email || "",
        plan: planId,
        is_premium: planId !== "free",
        is_locked: false,
        approved_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("Plan update error:", error);
      setStatus("Upgrade request failed. Please try again.");
      return;
    }

    setCurrentPlan(planId);
    setStatus(`${planId.toUpperCase()} access activated for this MVP build.`);
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
              <p className="text-xl font-black tracking-wide">VIRAL MINT</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-300">
                Creator Operating System
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-yellow-400/35 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-yellow-300 shadow-[0_0_40px_rgba(255,208,74,0.18)]">
              ♕ {cleanPlan === "free" ? "Free Active" : `${cleanPlan} Active`}
            </div>

            <button
              onClick={() => router.push(userId ? "/studio" : "/")}
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70 transition-all hover:border-yellow-400/30 hover:text-yellow-200"
            >
              {userId ? "Back to Studio" : "Enter Studio"}
            </button>
          </div>
        </header>

        <section className="relative overflow-hidden pt-20 text-center">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
              ♕ Premium Creator Access
            </div>

            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              Choose your
              <span className="block text-yellow-300">creator evolution.</span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-white/62">
              Viral Mint is not just another hook generator. It is a cinematic
              creator operating system for retention, emotion, storytelling,
              thumbnails, scripts, and creator growth momentum.
            </p>

            {status && (
              <div className="mx-auto mt-8 max-w-2xl rounded-[1.4rem] border border-yellow-400/20 bg-yellow-400/[0.06] px-5 py-4 text-sm text-white/70">
                {status}
              </div>
            )}
          </div>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const active = cleanPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={
                  plan.highlighted
                    ? "relative overflow-hidden rounded-[2.3rem] border border-yellow-400/45 bg-[#090807] p-8 shadow-[0_0_110px_rgba(255,208,74,0.15)] transition-all duration-300 hover:-translate-y-1"
                    : "relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-[#090807] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/25"
                }
              >
                <div className="absolute right-[-80px] top-[-40px] h-[220px] w-[220px] rounded-full bg-yellow-400/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300">
                      {plan.name}
                    </p>

                    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300">
                      {active ? "Active" : plan.badge}
                    </span>
                  </div>

                  <h2 className="mt-5 text-5xl font-black">
                    {plan.price}
                    <span className="text-lg text-white/45">/month</span>
                  </h2>

                  <p className="mt-5 text-base leading-8 text-white/60">
                    {plan.note}
                  </p>

                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3 text-sm text-white/78"
                      >
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-yellow-400/10 text-yellow-300">
                          ✓
                        </span>
                        {feature}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => requestPlan(plan.id)}
                    disabled={loading || active}
                    className={
                      active
                        ? "mt-10 w-full rounded-[1.2rem] border border-yellow-400/25 bg-yellow-400/10 px-6 py-4 text-sm font-black text-yellow-300 disabled:opacity-70"
                        : "mt-10 w-full rounded-[1.2rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-4 text-sm font-black text-black shadow-[0_22px_70px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02] disabled:opacity-60"
                    }
                  >
                    {active ? "Current Plan ♕" : `Choose ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-20 overflow-hidden rounded-[2.3rem] border border-yellow-400/18 bg-[#090807] p-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-300">
                Why creators upgrade
              </p>

              <h3 className="mt-4 text-4xl font-black leading-tight">
                Because viral content is no longer luck.
              </h3>

              <p className="mt-6 max-w-3xl text-base leading-8 text-white/60">
                Viral Mint combines creator psychology, emotional AI,
                storytelling structure, thumbnails, and repurposing systems into
                one premium creator ecosystem.
              </p>
            </div>

            <button
              onClick={() => router.push(userId ? "/studio" : "/")}
              className="inline-flex rounded-[1.2rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-8 py-4 text-sm font-black text-black shadow-[0_22px_70px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02]"
            >
              Start Creating ✨
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
