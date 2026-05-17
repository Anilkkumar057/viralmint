"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const niches = ["Finance", "Gaming", "Anime", "Fitness", "Motivation", "AI", "Business", "Storytelling", "Education"];
const platforms = ["YouTube", "Instagram", "Shorts", "X", "LinkedIn"];
const styles = ["Cinematic", "Funny", "Aggressive", "Emotional", "Luxury", "Educational", "Dark"];
const goals = ["Viral Growth", "Loyal Audience", "Sales", "Community", "Personal Brand"];

export default function OnboardingPage() {
  const router = useRouter();

  const [niche, setNiche] = useState("");
  const [platform, setPlatform] = useState("");
  const [style, setStyle] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/");
    };

    checkUser();
  }, [router]);

  const completeOnboarding = async () => {
    if (!niche || !platform || !style || !goal) {
      alert("Please select all Creator DNA options.");
      return;
    }

    setLoading(true);

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/");
      return;
    }

    const { error } = await supabase.from("creator_profiles").upsert(
      {
        user_id: data.user.id,
        niche,
        platform,
        style,
        goal,
      },
      { onConflict: "user_id" }
    );

    setLoading(false);

    if (error) {
      alert("Creator DNA save failed. Check Supabase creator_profiles table/RLS.");
      return;
    }

    router.push("/studio");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_14%_8%,rgba(126,242,194,0.30),transparent_26%),radial-gradient(circle_at_88%_12%,rgba(245,199,107,0.26),transparent_24%),radial-gradient(circle_at_50%_96%,rgba(255,107,95,0.12),transparent_30%),linear-gradient(135deg,#fffaf2_0%,#fff7e8_45%,#f7fff9_100%)] px-6 py-10 text-black">
      <div className="mx-auto max-w-4xl rounded-[3rem] border border-black/10 bg-white/60 p-8 shadow-[0_25px_85px_rgba(126,242,194,0.14)] backdrop-blur-xl md:p-12">
        <p className="text-xs uppercase tracking-[0.45em] text-black/35">
          CREATOR DNA
        </p>

        <h1 className="mt-6 text-4xl font-light leading-tight md:text-6xl">
          Let Viral Mint understand your creator identity.
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-8 text-black/55 md:text-base">
          Your AI will adapt to your platform, audience psychology, storytelling energy, and creator goals.
        </p>

        <div className="mt-14 space-y-12">
          <QuestionBlock title="Choose your niche" items={niches} selected={niche} setSelected={setNiche} />
          <QuestionBlock title="Main platform" items={platforms} selected={platform} setSelected={setPlatform} />
          <QuestionBlock title="Creator style" items={styles} selected={style} setSelected={setStyle} />
          <QuestionBlock title="Audience goal" items={goals} selected={goal} setSelected={setGoal} />
        </div>

        <button
          onClick={completeOnboarding}
          disabled={loading}
          className="mt-16 rounded-full bg-black px-10 py-5 text-xs uppercase tracking-[0.3em] text-white shadow-[0_12px_38px_rgba(126,242,194,0.24)] hover:scale-[1.03] disabled:opacity-40"
        >
          {loading ? "Saving DNA..." : "Enter Creator Studio"}
        </button>
      </div>
    </main>
  );
}

function QuestionBlock({
  title,
  items,
  selected,
  setSelected,
}: {
  title: string;
  items: string[];
  selected: string;
  setSelected: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-5 text-xs uppercase tracking-[0.35em] text-black/35">
        {title}
      </p>

      <div className="flex flex-wrap gap-3">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => setSelected(item)}
            className={
              selected === item
                ? "rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.25em] text-white shadow-[0_10px_30px_rgba(126,242,194,0.24)]"
                : "rounded-full border border-black/10 bg-white/70 px-6 py-3 text-xs uppercase tracking-[0.25em] text-black/50 hover:bg-black hover:text-white"
            }
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}