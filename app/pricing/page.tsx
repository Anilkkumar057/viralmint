"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const monthlyPlans = [
  {
    id: "starter",
    name: "Starter",
    oldPrice: "₹999",
    price: "₹299",
    annual: "₹199/mo",
    badge: "Launch",
    glow: false,
    desc: "Perfect for new creators entering the game.",
    features: [
      "50 creator generations",
      "Hook Generator",
      "Basic title engine",
      "Starter vault",
      "Hinglish support",
    ],
  },
  {
    id: "pro",
    name: "Pro Creator",
    oldPrice: "₹2,999",
    price: "₹899",
    annual: "₹599/mo",
    badge: "Most Popular",
    glow: true,
    desc: "Built for creators serious about growth momentum.",
    features: [
      "Unlimited generations",
      "Script Engine",
      "Thumbnail Psychology",
      "Repurpose Packs",
      "Premium Hooks",
      "Vault Access",
    ],
  },
  {
    id: "elite",
    name: "Elite Creator",
    oldPrice: "₹5,999",
    price: "₹1,799",
    annual: "₹1,299/mo",
    badge: "Royal",
    glow: true,
    desc: "The full cinematic creator operating system.",
    features: [
      "Unlimited Everything",
      "Elite AI Engine",
      "Emotional AI",
      "Audience Psychology",
      "Future premium systems",
      "Priority access",
      "Admin compatibility",
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const [annual, setAnnual] = useState(false);
  const [status, setStatus] = useState("");

  const cleanPlan = useMemo(() => {
    return (plan || "free").toLowerCase();
  }, [plan]);

  useEffect(() => {
    loadPlan();
  }, []);

  async function loadPlan() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("user_profiles")
      .select("plan,is_premium")
      .eq("id", user.id)
      .maybeSingle();

    if (data?.is_premium && data?.plan) {
      setPlan(data.plan);
    }

    setLoading(false);
  }

  async function choosePlan(planId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    setStatus("Activating premium access...");

    const { error } = await supabase.from("user_profiles").upsert(
      {
        id: user.id,
        email: user.email || "",
        plan: planId,
        is_premium: true,
        is_locked: false,
        approved_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      setStatus("Upgrade failed.");
      return;
    }

    setPlan(planId);
    setStatus(`${planId.toUpperCase()} unlocked successfully.`);
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
                Creator Evolution
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

        <section className="relative overflow-hidden pt-20 text-center">

          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative z-10">

            <div className="inline-flex items-center gap-3 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-yellow-300">
              🔥 70% OFF First Subscription
            </div>

            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              Unlock your
              <span className="block text-yellow-300">
                creator empire.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-white/62">
              Viral Mint combines cinematic storytelling,
              emotional AI, retention psychology,
              thumbnail systems, creator intelligence,
              and growth engines into one premium platform.
            </p>

            <div className="mt-10 flex items-center justify-center">

              <div className="flex items-center gap-2 rounded-full border border-yellow-400/20 bg-black/40 p-2">

                <button
                  onClick={() => setAnnual(false)}
                  className={
                    !annual
                      ? "rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black"
                      : "rounded-full px-6 py-3 text-sm text-white/60"
                  }
                >
                  Monthly
                </button>

                <button
                  onClick={() => setAnnual(true)}
                  className={
                    annual
                      ? "rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-3 text-sm font-black text-black"
                      : "rounded-full px-6 py-3 text-sm text-white/60"
                  }
                >
                  Annual
                </button>

              </div>

            </div>

            <p className="mt-4 text-sm text-yellow-300">
              Save extra 40% with annual billing ✨
            </p>

            {status && (
              <div className="mx-auto mt-8 max-w-2xl rounded-[1.4rem] border border-yellow-400/20 bg-yellow-400/[0.06] px-5 py-4 text-sm text-white/70">
                {status}
              </div>
            )}

          </div>

        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-3">

          {monthlyPlans.map((planItem) => {

            const active = cleanPlan === planItem.id;

            return (
              <div
                key={planItem.id}
                className={
                  planItem.glow
                    ? "relative overflow-hidden rounded-[2.3rem] border border-yellow-400/45 bg-[#090807] p-8 shadow-[0_0_110px_rgba(255,208,74,0.15)] transition-all duration-300 hover:-translate-y-1"
                    : "relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-[#090807] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400/25"
                }
              >

                <div className="absolute right-[-80px] top-[-40px] h-[220px] w-[220px] rounded-full bg-yellow-400/10 blur-3xl" />

                <div className="relative z-10">

                  <div className="flex items-center justify-between">

                    <p className="text-[11px] uppercase tracking-[0.3em] text-yellow-300">
                      {planItem.name}
                    </p>

                    <span className="rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-yellow-300">
                      {active ? "Active" : planItem.badge}
                    </span>

                  </div>

                  <div className="mt-6">

                    <p className="text-lg text-white/35 line-through">
                      {planItem.oldPrice}
                    </p>

                    <h2 className="mt-1 text-6xl font-black text-yellow-300">
                      {annual ? planItem.annual : planItem.price}
                    </h2>

                    <p className="mt-2 text-sm text-white/45">
                      {annual ? "per month billed annually" : "first month launch pricing"}
                    </p>

                  </div>

                  <p className="mt-6 text-base leading-8 text-white/60">
                    {planItem.desc}
                  </p>

                  <div className="mt-8 space-y-4">

                    {planItem.features.map((feature) => (
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
                    onClick={() => choosePlan(planItem.id)}
                    disabled={loading || active}
                    className={
                      active
                        ? "mt-10 w-full rounded-[1.2rem] border border-yellow-400/25 bg-yellow-400/10 px-6 py-4 text-sm font-black text-yellow-300"
                        : "mt-10 w-full rounded-[1.2rem] bg-gradient-to-r from-yellow-300 to-yellow-500 px-6 py-4 text-sm font-black text-black shadow-[0_22px_70px_rgba(255,208,74,0.18)] transition-all hover:scale-[1.02]"
                    }
                  >
                    {active ? "Current Plan ♕" : `Unlock ${planItem.name}`}
                  </button>

                </div>

              </div>
            );
          })}

        </section>


        <section className="mt-16 grid gap-6 lg:grid-cols-2">

          <div className="rounded-[2.2rem] border border-yellow-400/20 bg-[#090807] p-8 shadow-[0_25px_90px_rgba(255,208,74,0.08)]">

            <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-300">
              Manual UPI Payment
            </p>

            <h3 className="mt-4 text-4xl font-black leading-tight">
              Scan & Unlock
              <span className="block text-yellow-300">
                Premium Access
              </span>
            </h3>

            <p className="mt-5 text-base leading-8 text-white/60">
              Pay using UPI QR and send your payment screenshot to activate
              premium creator access manually.
            </p>

            <div className="mt-8 flex justify-center">

              <div className="rounded-[2rem] border border-yellow-400/25 bg-black/30 p-5">
                <img
                  src="/payment-qr.png"
                  alt="UPI QR"
                  className="h-[260px] w-[260px] rounded-[1.5rem] object-cover"
                />
              </div>

            </div>

            <div className="mt-8 rounded-[1.5rem] border border-yellow-400/15 bg-yellow-400/[0.05] p-5">

              <p className="text-sm font-semibold text-yellow-300">
                Payment Instructions
              </p>

              <div className="mt-4 space-y-3 text-sm leading-7 text-white/65">

                <p>1. Scan the QR code using any UPI app.</p>
                <p>2. Complete payment for your selected plan.</p>
                <p>3. Send screenshot on WhatsApp or Email.</p>
                <p>4. Premium access will be activated manually.</p>

              </div>

            </div>

          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-8">

            <p className="text-[11px] uppercase tracking-[0.38em] text-yellow-300">
              Help & Support
            </p>

            <h3 className="mt-4 text-4xl font-black leading-tight">
              Need help with
              <span className="block text-yellow-300">
                subscriptions?
              </span>
            </h3>

            <p className="mt-5 text-base leading-8 text-white/60">
              Contact us for payment issues, creator access,
              premium activation, or platform support.
            </p>

            <div className="mt-8 space-y-4">

              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-300">
                  WhatsApp Support
                </p>

                <p className="mt-3 text-lg font-semibold">
                  +91 XXXXX XXXXX
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-300">
                  Email Support
                </p>

                <p className="mt-3 text-lg font-semibold">
                  support@viralmint.ai
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-yellow-400/15 bg-yellow-400/[0.05] p-5">
                <p className="text-sm leading-7 text-white/70">
                  Premium activations are usually completed quickly after
                  payment confirmation.
                </p>
              </div>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}
