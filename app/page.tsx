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
        redirectTo: `${window.location.origin}/studio`,
      },
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf2] text-black">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-lg font-light tracking-[0.35em]">VIRAL MINT</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-black/40">
              emotionally intelligent creator OS
            </p>
          </div>

          {user ? (
            <Link
              href="/studio"
              className="rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:bg-black hover:text-white"
            >
              Enter Studio
            </Link>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="rounded-full border border-black/10 px-6 py-3 text-xs uppercase tracking-[0.3em] transition-all duration-500 hover:bg-black hover:text-white"
            >
              Continue with Google
            </button>
          )}
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-20 text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-black/35">
            AI FOR MODERN CREATORS
          </p>

          <h1 className="max-w-5xl text-5xl font-light leading-[1.05] tracking-tight md:text-8xl">
            Create content that people
            <span className="block italic text-black/50">
              emotionally remember.
            </span>
          </h1>

          <p className="mt-10 max-w-2xl text-base leading-8 text-black/55 md:text-lg">
            Viral Mint helps creators generate emotionally intelligent hooks,
            cinematic openings, viral positioning, replay psychology, and
            creator momentum systems.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link
                href="/studio"
                className="rounded-full bg-black px-8 py-4 text-sm tracking-[0.25em] text-white transition-all duration-500 hover:scale-[1.03]"
              >
                ENTER STUDIO
              </Link>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="rounded-full bg-black px-8 py-4 text-sm tracking-[0.25em] text-white transition-all duration-500 hover:scale-[1.03]"
              >
                CONTINUE WITH GOOGLE
              </button>
            )}

            <Link
              href="/pricing"
              className="rounded-full border border-black/10 bg-white/60 px-6 py-4 text-xs uppercase tracking-[0.25em] text-black/45 transition-all duration-500 hover:bg-black hover:text-white"
            >
              View Plans
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}