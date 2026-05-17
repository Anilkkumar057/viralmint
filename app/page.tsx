"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const start = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    start();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/onboarding`,
      },
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_14%_8%,rgba(126,242,194,0.30),transparent_26%),radial-gradient(circle_at_88%_12%,rgba(245,199,107,0.26),transparent_24%),radial-gradient(circle_at_50%_96%,rgba(255,107,95,0.12),transparent_30%),linear-gradient(135deg,#fffaf2_0%,#fff7e8_45%,#f7fff9_100%)] text-black">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between rounded-[2rem] border border-black/10 bg-white/55 p-5 shadow-[0_20px_70px_rgba(126,242,194,0.12)] backdrop-blur-xl">
          <div>
            <p className="text-lg font-light tracking-[0.35em]">VIRAL MINT</p>

            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-black/40">
              emotionally intelligent creator OS
            </p>
          </div>

          {user ? (
            <Link
              href="/studio"
              className="rounded-full border border-black/10 bg-white/65 px-6 py-3 text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:bg-black hover:text-white"
            >
              Enter Studio
            </Link>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-full border border-black/10 bg-white/65 px-6 py-3 text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:bg-black hover:text-white"
            >
              Continue with Google
            </button>
          )}
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full border border-black/10 bg-white/60 px-5 py-3 shadow-[0_12px_40px_rgba(126,242,194,0.12)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.45em] text-black/35">
              AI FOR MODERN CREATORS
            </p>
          </div>

          <h1 className="mt-8 max-w-5xl text-5xl font-light leading-[1.05] tracking-tight md:text-8xl">
            Create content that people
            <span className="block italic text-black/50">
              emotionally remember.
            </span>
          </h1>

          <p className="mt-10 max-w-2xl text-base leading-8 text-black/55 md:text-lg">
            Viral Mint helps creators generate emotionally intelligent hooks,
            cinematic openings, viral positioning, replay psychology, and
            creator momentum systems inside a calm premium workspace.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                href="/studio"
                className="rounded-full bg-black px-8 py-4 text-sm tracking-[0.25em] text-white shadow-[0_12px_38px_rgba(126,242,194,0.24)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_16px_50px_rgba(126,242,194,0.38)]"
              >
                ENTER STUDIO
              </Link>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="rounded-full bg-black px-8 py-4 text-sm tracking-[0.25em] text-white shadow-[0_12px_38px_rgba(126,242,194,0.24)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_16px_50px_rgba(126,242,194,0.38)]"
              >
                CONTINUE WITH GOOGLE
              </button>
            )}

            <Link
              href="/pricing"
              className="rounded-full border border-black/10 bg-white/65 px-6 py-4 text-xs uppercase tracking-[0.25em] text-black/45 shadow-[0_12px_40px_rgba(245,199,107,0.12)] transition-all duration-500 hover:bg-black hover:text-white"
            >
              View Plans
            </Link>
          </div>

          <div className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                label: "HOOK ENGINE",
                title: "Emotionally sticky openings",
                text: "Generate hooks engineered for curiosity loops, replay energy, emotional tension, and audience retention.",
              },
              {
                label: "CREATOR DNA",
                title: "Personalized creator intelligence",
                text: "Viral Mint adapts to your platform, audience emotion, creator style, and storytelling energy.",
              },
              {
                label: "VIRAL MOMENTUM",
                title: "AI built for creator growth",
                text: "Build content systems designed for audience pull, emotional resonance, and long-term creator expansion.",
              },
            ].map((card) => (
              <div
                key={card.label}
                className="rounded-[2rem] border border-black/10 bg-white/65 p-8 text-left shadow-[0_20px_70px_rgba(126,242,194,0.10)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_80px_rgba(126,242,194,0.18)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[#c49b43]">
                  {card.label}
                </p>

                <h3 className="mt-5 text-2xl font-light">{card.title}</h3>

                <p className="mt-5 text-sm leading-7 text-black/55">
                  {card.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-24 w-full max-w-4xl rounded-[2.5rem] border border-black/10 bg-white/70 p-10 shadow-[0_25px_85px_rgba(126,242,194,0.14)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#c49b43]">
              VIRAL MINT PRO
            </p>

            <h2 className="mt-5 text-4xl font-light leading-tight md:text-5xl">
              Unlock the creator growth reactor.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-black/55 md:text-base">
              Unlimited generations, creator memory systems, emotional
              positioning layers, cinematic scripting, replay psychology, and
              advanced creator intelligence.
            </p>

            <Link
              href="/pricing"
              className="mt-10 inline-flex rounded-full bg-black px-8 py-4 text-xs uppercase tracking-[0.3em] text-white shadow-[0_12px_38px_rgba(126,242,194,0.22)] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_16px_50px_rgba(126,242,194,0.36)]"
            >
              View Plans
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}