"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

const plans = [
  {
    name: "Creator",
    oldMonthly: 999,
    monthly: 299,
    annualMonthly: 199,
    features: [
      "Unlimited hooks",
      "Creator identity memory",
      "Vault access",
      "Emotional CTA generation",
      "Basic creator momentum tags",
    ],
  },
  {
    name: "Pro Creator",
    oldMonthly: 2999,
    monthly: 999,
    annualMonthly: 699,
    popular: true,
    features: [
      "Unlimited generations",
      "Cinematic script systems",
      "Replay psychology engine",
      "Advanced creator memory",
      "Priority AI responses",
      "Viral momentum analysis",
    ],
  },
  {
    name: "Elite",
    oldMonthly: 5999,
    monthly: 2999,
    annualMonthly: 1999,
    features: [
      "Full creator operating system",
      "Advanced AI unfolding",
      "Platform-specific growth systems",
      "Premium creator intelligence",
      "Priority future features",
      "Early access expansions",
    ],
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const paymentRef = useRef<HTMLElement | null>(null);
  const activePlan = plans.find((plan) => plan.name === selectedPlan);

  const getPrice = (plan: (typeof plans)[number]) =>
    billing === "monthly" ? plan.monthly : plan.annualMonthly;

  const getBillingTotal = (plan: (typeof plans)[number]) =>
    billing === "monthly" ? plan.monthly : plan.annualMonthly * 12;

  const getSaving = (plan: (typeof plans)[number]) =>
    billing === "annual" ? (plan.monthly - plan.annualMonthly) * 12 : 0;

  const submitPaymentQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlan) return;

    setSubmitting(true);

    const { error } = await supabase.from("payment_queries").insert([
      {
        email,
        transaction_id: transactionId,
        plan: `${activePlan.name} (${billing})`,
        query,
      },
    ]);

    setSubmitting(false);

    if (error) {
      alert("Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
    setEmail("");
    setTransactionId("");
    setQuery("");

    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <main className="min-h-screen bg-[#fffaf2] px-6 py-10 text-black">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-light tracking-[0.35em]">VIRAL MINT</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.35em] text-black/40">
              creator growth subscriptions
            </p>
          </div>

          <Link
            href="/studio"
            className="rounded-full border border-black/10 bg-white/60 px-6 py-3 text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:bg-black hover:text-white"
          >
            Back to Studio
          </Link>
        </header>

        <section className="mt-20 text-center">
          <p className="text-xs uppercase tracking-[0.45em] text-black/35">
            CHOOSE YOUR CREATOR PATH
          </p>

          <h1 className="mt-6 text-5xl font-light leading-tight tracking-tight md:text-7xl">
            Upgrade your creator engine.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-black/55">
            Early creator pricing is live. Pick monthly flexibility or annual
            savings with calm premium creator momentum.
          </p>

          <div className="mx-auto mt-10 flex w-fit rounded-full border border-black/10 bg-white/75 p-1 shadow-[0_20px_60px_rgba(126,242,194,0.12)] backdrop-blur-xl">
            <button
              onClick={() => setBilling("monthly")}
              className={
                billing === "monthly"
                  ? "rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.25em] text-white shadow-[0_8px_24px_rgba(126,242,194,0.22)] transition-all duration-500"
                  : "rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] text-black/45 transition-all duration-500"
              }
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling("annual")}
              className={
                billing === "annual"
                  ? "rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.25em] text-white shadow-[0_8px_24px_rgba(126,242,194,0.22)] transition-all duration-500"
                  : "rounded-full px-6 py-3 text-xs uppercase tracking-[0.25em] text-black/45 transition-all duration-500"
              }
            >
              Annual Save 33%
            </button>
          </div>
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = getPrice(plan);
            const total = getBillingTotal(plan);
            const saving = getSaving(plan);

            return (
              <div
                key={plan.name}
                className={
                  plan.popular
                    ? "relative rounded-[2.5rem] border border-black bg-black p-10 text-white shadow-[0_28px_90px_rgba(0,0,0,0.22)] transition-all duration-500 hover:-translate-y-1"
                    : "rounded-[2.5rem] border border-black/10 bg-white/65 p-10 shadow-[0_20px_60px_rgba(126,242,194,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_75px_rgba(126,242,194,0.16)]"
                }
              >
                {plan.popular && (
                  <div className="absolute right-6 top-6 rounded-full bg-[#7ef2c2] px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-black shadow-[0_8px_25px_rgba(126,242,194,0.28)]">
                    MOST POPULAR
                  </div>
                )}

                <p
                  className={
                    plan.popular
                      ? "text-xs uppercase tracking-[0.35em] text-white/60"
                      : "text-xs uppercase tracking-[0.35em] text-black/35"
                  }
                >
                  {plan.name}
                </p>

                <div className="mt-6 flex items-end gap-3">
                  <p
                    className={
                      plan.popular
                        ? "text-xl text-white/35 line-through"
                        : "text-xl text-black/30 line-through"
                    }
                  >
                    ₹{plan.oldMonthly}
                  </p>

                  <h2 className="text-5xl font-light">₹{price}</h2>
                </div>

                <p
                  className={
                    plan.popular
                      ? "mt-2 text-xs uppercase tracking-[0.25em] text-white/50"
                      : "mt-2 text-xs uppercase tracking-[0.25em] text-black/35"
                  }
                >
                  {billing === "monthly"
                    ? "per month"
                    : `per month · billed ₹${total}/year`}
                </p>

                {billing === "annual" && (
                  <div
                    className={
                      plan.popular
                        ? "mt-5 rounded-full border border-[#7ef2c2]/30 bg-[#7ef2c2]/10 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#7ef2c2]"
                        : "mt-5 rounded-full border border-[#f5c76b]/35 bg-[#fff3d6] px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-[#8a641c]"
                    }
                  >
                    Save ₹{saving}/year
                  </div>
                )}

                <div
                  className={
                    plan.popular
                      ? "mt-10 space-y-5 text-sm leading-7 text-white/75"
                      : "mt-10 space-y-5 text-sm leading-7 text-black/60"
                  }
                >
                  {plan.features.map((feature) => (
                    <p key={feature}>• {feature}</p>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedPlan(plan.name);

                    setTimeout(() => {
                      paymentRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }, 100);
                  }}
                  className={
                    plan.popular
                      ? "mt-12 w-full rounded-full bg-white px-6 py-4 text-xs uppercase tracking-[0.3em] text-black shadow-[0_12px_35px_rgba(126,242,194,0.2)] transition-all duration-500 hover:scale-[1.02] hover:bg-[#7ef2c2]"
                      : "mt-12 w-full rounded-full border border-black/10 bg-white/60 px-6 py-4 text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:bg-black hover:text-white hover:shadow-[0_12px_35px_rgba(126,242,194,0.22)]"
                  }
                >
                  {billing === "monthly"
                    ? "Pay Monthly"
                    : "Start Annual Plan"}
                </button>
              </div>
            );
          })}
        </section>

        {activePlan && (
          <section
            ref={paymentRef}
            className="mx-auto mt-24 max-w-5xl rounded-[3rem] border border-black/10 bg-white/75 p-8 shadow-[0_25px_80px_rgba(126,242,194,0.14)] backdrop-blur-xl md:p-12"
          >
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-black/35">
                  Payment Selected
                </p>

                <h2 className="mt-5 text-4xl font-light leading-tight">
                  {activePlan.name} · ₹{getBillingTotal(activePlan)}
                </h2>

                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-black/40">
                  {billing === "monthly"
                    ? "Monthly payment"
                    : `Annual plan · ₹${getPrice(activePlan)}/mo effective`}
                </p>

                <p className="mt-5 text-sm leading-8 text-black/55">
                  Scan the QR to pay. After payment, submit your email,
                  transaction ID, and any query below for activation.
                </p>

                <img
                  src="/upi-qr.png"
                  alt="UPI QR"
                  className="mt-8 w-60 rounded-[2rem] border border-black/10 shadow-[0_18px_55px_rgba(245,199,107,0.18)]"
                />

                <p className="mt-5 text-xs uppercase tracking-[0.3em] text-black/40">
                  Scan & Pay via UPI
                </p>
              </div>

              <form
                className="rounded-[2rem] border border-black/10 bg-[#fffaf2]/75 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.06)]"
                onSubmit={submitPaymentQuery}
              >
                <p className="text-xs uppercase tracking-[0.35em] text-black/35">
                  Activation Query
                </p>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="mt-6 w-full rounded-full border border-black/10 bg-white/70 px-5 py-4 text-sm outline-none"
                />

                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Transaction ID / UTR"
                  className="mt-4 w-full rounded-full border border-black/10 bg-white/70 px-5 py-4 text-sm outline-none"
                />

                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Any query or note..."
                  className="mt-4 min-h-32 w-full resize-none rounded-[1.5rem] border border-black/10 bg-white/70 p-5 text-sm outline-none"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full rounded-full bg-black px-6 py-4 text-xs uppercase tracking-[0.3em] text-white shadow-[0_10px_30px_rgba(126,242,194,0.18)] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(126,242,194,0.32)] disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Query"}
                </button>

                {success && (
                  <div className="mt-5 rounded-[1.5rem] border border-[#7ef2c2]/40 bg-[#dffdf1] p-4 text-sm text-[#0f5132] shadow-[0_10px_30px_rgba(126,242,194,0.18)]">
                    Payment query submitted successfully. Activation will be
                    processed after verification.
                  </div>
                )}
              </form>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}