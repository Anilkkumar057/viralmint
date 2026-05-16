"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    setLoading(false);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <button
        onClick={signOut}
        className="rounded-full border border-black/10 px-5 py-3 text-sm tracking-wide text-black/70 transition-all duration-500 hover:bg-black hover:text-white"
      >
        Signed in · Logout
      </button>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      disabled={loading}
      className="rounded-full border border-black/10 px-5 py-3 text-sm tracking-wide text-black/70 transition-all duration-500 hover:bg-black hover:text-white disabled:opacity-40"
    >
      {loading ? "Opening Google..." : "Continue with Google"}
    </button>
  );
}