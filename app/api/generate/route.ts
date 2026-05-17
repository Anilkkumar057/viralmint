import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const prompt = body.prompt || "";
    const language = body.language || "Hinglish";
    const creatorProfile = body.creatorProfile || {};

    const niche = creatorProfile.niche || "general creator";
    const platform = creatorProfile.platform || "Instagram";
    const style = creatorProfile.style || "Emotional";
    const goal = creatorProfile.goal || "Viral Growth";

    const finalPrompt = `
You are Viral Mint, an emotionally intelligent creator growth operating system.

Creator DNA:
- Niche: ${niche}
- Main Platform: ${platform}
- Creator Style: ${style}
- Audience Goal: ${goal}

Selected Output Language:
${language}

Creator Input:
${prompt}

LANGUAGE RULE:
The selected language is the final output language.

If selected language is Hindi:
Convert the input meaning into natural Hindi and write ALL output fully in Hindi.
This applies even if the input is English, Hinglish, Hindi, or mixed language.

If selected language is Hinglish:
Convert the input meaning into natural Indian Hinglish and write ALL output in Hinglish.

If selected language is English:
Convert the input meaning into natural English and write ALL output fully in English.

Never follow the input language. Always follow selected language.

PERSONALIZATION RULE:
Use the Creator DNA strongly.
The output must feel made for:
- niche: ${niche}
- platform: ${platform}
- creator style: ${style}
- goal: ${goal}

If platform is YouTube or Shorts:
Make hooks fast, visual, retention-focused.

If platform is Instagram:
Make hooks scroll-stopping, emotional, and reel-friendly.

If platform is LinkedIn:
Make output sharper, authority-based, and professional.

If style is Cinematic:
Use dramatic contrast, scene-like phrasing, mystery, and emotional gravity.

If style is Funny:
Use playful tension, punchy wording, and relatable setups.

If style is Aggressive:
Use bold, punchy, direct lines.

If style is Luxury:
Use minimal, premium, high-status wording.

If goal is Sales:
Create trust + desire + action.

If goal is Loyal Audience:
Create belonging, identity, and emotional depth.

If goal is Viral Growth:
Create curiosity, tension, and replay value.

Return STRICT JSON ONLY in this format:

{
  "hooks": [],
  "titles": [],
  "thumbnails": [],
  "ctas": [],
  "openings": []
}

Generate:
- 5 hooks
- 5 titles
- 3 thumbnail concepts
- 3 emotional CTAs
- 3 opening sequences

Make everything modern, non-generic, creator-first, and emotionally sticky.
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
        max_tokens: 1400,
        messages: [
          {
            role: "user",
            content: finalPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(getFallback(language, niche, platform, style));
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text || "";

    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      return NextResponse.json(getFallback(language, niche, platform, style));
    }
  } catch {
    return NextResponse.json(getFallback("Hinglish", "creator", "Instagram", "Emotional"));
  }
}

function getFallback(
  language: string,
  niche: string,
  platform: string,
  style: string
) {
  if (language === "Hindi") {
    return {
      hooks: [
        `${niche} क्रिएटर्स की सबसे बड़ी गलती यही है।`,
        `अगर आप ${platform} पर बढ़ना चाहते हैं, तो यह समझना जरूरी है।`,
        `लोग कंटेंट नहीं, भावना याद रखते हैं।`,
        `आपका अगला पोस्ट सिर्फ पोस्ट नहीं होना चाहिए।`,
        `${style} स्टाइल में कंटेंट बनाने का असली तरीका यह है।`,
      ],
      titles: [
        `${platform} पर ग्रोथ का नया तरीका`,
        `${niche} कंटेंट को यादगार कैसे बनाएं`,
        `क्यों कुछ क्रिएटर्स जल्दी बढ़ते हैं`,
        `वायरल होने से पहले यह समझें`,
        `कंटेंट जो लोग सेव करना चाहें`,
      ],
      thumbnails: [
        `भावनात्मक चेहरे के साथ साफ सिनेमैटिक कॉन्ट्रास्ट।`,
        `बड़ा बोल्ड टेक्स्ट और मिनिमल बैकग्राउंड।`,
        `${niche} से जुड़ा प्रीमियम विजुअल हुक।`,
      ],
      ctas: [
        `अगर आप बेहतर क्रिएटर बनना चाहते हैं, तो इसे सेव करें।`,
        `ऐसे ही डीप क्रिएटर ग्रोथ के लिए फॉलो करें।`,
        `अपने अगले पोस्ट से पहले इसे याद रखें।`,
      ],
      openings: [
        `ज़्यादातर क्रिएटर्स सोचते हैं कि समस्या एल्गोरिदम है, लेकिन असली वजह कुछ और है।`,
        `अगर आपका कंटेंट देखा जा रहा है पर याद नहीं रखा जा रहा, तो यह आपके लिए है।`,
        `आज मैं आपको वो चीज़ बताने वाला हूं जो अच्छे कंटेंट को यादगार बनाती है।`,
      ],
    };
  }

  if (language === "English") {
    return {
      hooks: [
        `Most ${niche} creators are missing this one thing.`,
        `If you want to grow on ${platform}, understand this first.`,
        `People do not remember content. They remember emotion.`,
        `Your next post should not feel like just another post.`,
        `This is how ${style} creators create stronger attention.`,
      ],
      titles: [
        `The new way to grow on ${platform}`,
        `How to make ${niche} content unforgettable`,
        `Why some creators grow faster`,
        `Understand this before trying to go viral`,
        `Content people actually want to save`,
      ],
      thumbnails: [
        `Emotional close-up with cinematic contrast.`,
        `Bold text with minimal premium background.`,
        `Premium visual hook connected to ${niche}.`,
      ],
      ctas: [
        `Save this before your next post.`,
        `Follow for deeper creator growth.`,
        `Use this before creating your next piece of content.`,
      ],
      openings: [
        `Most creators think the algorithm is the problem, but the real reason is deeper.`,
        `If your content gets views but does not get remembered, this is for you.`,
        `Today, I will show you what makes good content unforgettable.`,
      ],
    };
  }

  return {
    hooks: [
      `Most ${niche} creators ye ek cheez miss kar rahe hain.`,
      `Agar tum ${platform} par grow karna chahte ho, pehle ye samjho.`,
      `Log content yaad nahi rakhte. Log emotion yaad rakhte hain.`,
      `Tumhara next post sirf ek aur post nahi lagna chahiye.`,
      `${style} creator banne ka real content edge ye hai.`,
    ],
    titles: [
      `${platform} growth ka new way`,
      `${niche} content ko unforgettable kaise banaye`,
      `Kyun kuch creators fast grow karte hain`,
      `Viral hone se pehle ye samjho`,
      `Content jo log save karna chahenge`,
    ],
    thumbnails: [
      `Cinematic contrast ke saath emotional close-up.`,
      `Bold text aur premium minimal background.`,
      `${niche} se connected premium visual hook.`,
    ],
    ctas: [
      `Next post banane se pehle isse save karo.`,
      `Deeper creator growth ke liye follow karo.`,
      `Isko apne next content me use karo.`,
    ],
    openings: [
      `Most creators sochte hain problem algorithm hai, par asli reason deeper hai.`,
      `Agar tumhara content views laata hai but yaad nahi rehta, ye tumhare liye hai.`,
      `Aaj main tumhe woh cheez bataunga jo good content ko unforgettable banati hai.`,
    ],
  };
}