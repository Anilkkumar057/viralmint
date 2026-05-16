import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = body.prompt || "";
    const language = body.language || "Hinglish";
    const platform = body.platform || "Instagram";
    const tone = body.tone || "Emotional";
    const creatorName = body.creatorName || "Creator";

    const creatorProfile = body.creatorProfile || null;
    const creatorMemories = body.creatorMemories || [];

    const profileText = creatorProfile
      ? `
Creator Identity:
- Name: ${creatorName}
- Niche: ${creatorProfile.niche || "unknown"}
- Main Platform: ${creatorProfile.main_platform || platform}
- Creator Style: ${creatorProfile.creator_style || tone}
- Audience Emotion: ${creatorProfile.emotional_preference || "curious"}
`
      : "";

    const memoryText =
      creatorMemories.length > 0
        ? `
Recent Creator Memory:
${creatorMemories.map((m: string) => `- ${m}`).join("\n")}
`
        : "";

    const finalPrompt = `
You are Viral Mint.

An emotionally intelligent creator operating system.

Your task:
Transform creator ideas into premium creator assets.

Creator Name:
${creatorName}

Selected Language:
${language}

Platform:
${platform}

Tone:
${tone}

${profileText}

${memoryText}

Creator Input:
${prompt}

CRITICAL LANGUAGE CONTROL RULE:
The selected language is the final output language.

If selected language is Hindi:
Convert the creator input meaning into natural Hindi and write ALL output fully in Hindi.
This applies even if the creator typed in English, Hinglish, Hindi, or mixed language.
Do not keep English words unless they are unavoidable platform terms like Instagram, YouTube, AI, CTA.

If selected language is Hinglish:
Convert the creator input meaning into natural Indian Hinglish and write ALL output in Hinglish.
Use a natural mix of Hindi and English, like Indian creators speak online.
This applies even if the creator typed in English, Hindi, or mixed language.

If selected language is English:
Convert the creator input meaning into natural English and write ALL output fully in English.
This applies even if the creator typed in Hindi, Hinglish, or mixed language.

Never follow the input language.
Always follow the selected language.

Return STRICT JSON ONLY.

Format:

{
  "hooks": [],
  "titles": [],
  "thumbnails": [],
  "ctas": [],
  "openings": []
}

Rules:
- hooks = short scroll-stopping hooks
- titles = strong clickable titles
- thumbnails = thumbnail visual concepts
- ctas = emotional CTA lines
- openings = first 15-second script openings
- make everything cinematic
- emotionally intelligent
- modern
- creator-first
- avoid generic AI wording
- use creator name naturally sometimes
`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1200,
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        hooks:
          language === "Hindi"
            ? [`${creatorName}, आपकी पहली लाइन में और ज़्यादा खिंचाव चाहिए।`]
            : language === "English"
            ? [`${creatorName}, your first line needs stronger tension.`]
            : [`${creatorName}, tumhari first line me aur tension chahiye.`],
        titles:
          language === "Hindi"
            ? ["यह बदल देगा कि क्रिएटर्स ध्यान कैसे पकड़ते हैं।"]
            : language === "English"
            ? ["This changes how creators hold attention."]
            : ["Ye badal dega ki creators attention kaise hold karte hain."],
        thumbnails:
          language === "Hindi"
            ? ["सिनेमैटिक कॉन्ट्रास्ट के साथ क्लोज़-अप भावनात्मक चेहरा।"]
            : language === "English"
            ? ["Close-up emotional face with cinematic contrast."]
            : ["Cinematic contrast ke saath close-up emotional face."],
        ctas:
          language === "Hindi"
            ? ["फॉलो मांगने से पहले अपने दर्शकों को महसूस कराओ कि आप उन्हें समझते हो।"]
            : language === "English"
            ? ["Make your audience feel seen before asking them to follow."]
            : ["Follow maangne se pehle audience ko feel karao ki tum unhe samajhte ho."],
        openings:
          language === "Hindi"
            ? ["कोई भी इस भावनात्मक वजह के बारे में बात नहीं करता कि लोग स्क्रॉल करना क्यों रोकते हैं।"]
            : language === "English"
            ? ["Nobody talks about the emotional reason people stop scrolling."]
            : ["Koi bhi is emotional reason ke baare me baat nahi karta ki log scroll karna kyun rok dete hain."],
      });
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text || "";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        hooks:
          language === "Hindi"
            ? [`${creatorName}, इस आइडिया में मजबूत रिप्ले पोटेंशियल है।`]
            : language === "English"
            ? [`${creatorName}, this idea has strong replay potential.`]
            : [`${creatorName}, is idea me strong replay potential hai.`],
        titles:
          language === "Hindi"
            ? ["क्यों क्रिएटर्स ध्यान पकड़ने में संघर्ष करते हैं।"]
            : language === "English"
            ? ["Why creators struggle to hold attention."]
            : ["Creators attention hold karne me kyun struggle karte hain."],
        thumbnails:
          language === "Hindi"
            ? ["भावनात्मक कॉन्ट्रास्ट के साथ मिनिमल सिनेमैटिक पोर्ट्रेट।"]
            : language === "English"
            ? ["Minimal cinematic portrait with emotional contrast."]
            : ["Emotional contrast ke saath minimal cinematic portrait."],
        ctas:
          language === "Hindi"
            ? ["भावनात्मक रूप से समझदार क्रिएटर ग्रोथ के लिए फॉलो करें।"]
            : language === "English"
            ? ["Follow for emotionally intelligent creator growth."]
            : ["Emotionally intelligent creator growth ke liye follow karo."],
        openings:
          language === "Hindi"
            ? ["ज़्यादातर क्रिएटर्स सोचते हैं कि कंटेंट फेल होना एल्गोरिदम की वजह से होता है..."]
            : language === "English"
            ? ["Most creators think content failure is about algorithms..."]
            : ["Most creators sochte hain content failure algorithm ki wajah se hota hai..."],
      };
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      hooks: ["Your idea has emotional potential."],
      titles: ["This idea could become highly shareable."],
      thumbnails: ["Dark cinematic thumbnail with emotional contrast."],
      ctas: ["Make your audience feel understood."],
      openings: ["The internet rewards emotion more than information."],
    });
  }
}