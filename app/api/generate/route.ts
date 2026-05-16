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
- Main Platform: ${
          creatorProfile.main_platform || platform
        }
- Creator Style: ${
          creatorProfile.creator_style || tone
        }
- Audience Emotion: ${
          creatorProfile.emotional_preference ||
          "curious"
        }
`
      : "";

    const memoryText =
      creatorMemories.length > 0
        ? `
Recent Creator Memory:
${creatorMemories
  .map((m: string) => `- ${m}`)
  .join("\n")}
`
        : "";

    const finalPrompt = `
You are Viral Mint.

An emotionally intelligent creator operating system.

Your task:
Transform creator ideas into premium creator assets.

Speak naturally to the creator when useful.

Creator Name:
${creatorName}

Language:
${language}

Platform:
${platform}

Tone:
${tone}

${profileText}

${memoryText}

Creator Input:
${prompt}

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

    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":
            process.env.CLAUDE_API_KEY || "",
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
      }
    );

    if (!response.ok) {
      return NextResponse.json({
        hooks: [
          `${creatorName}, your first line needs stronger tension.`,
        ],
        titles: [
          "This changes how creators hold attention.",
        ],
        thumbnails: [
          "Close-up emotional face with cinematic contrast.",
        ],
        ctas: [
          "Make your audience feel seen before asking them to follow.",
        ],
        openings: [
          "Nobody talks about the emotional reason people stop scrolling.",
        ],
      });
    }

    const data = await response.json();

    const text =
      data?.content?.[0]?.text || "";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        hooks: [
          `${creatorName}, this idea has strong replay potential.`,
        ],
        titles: [
          "Why creators struggle to hold attention.",
        ],
        thumbnails: [
          "Minimal cinematic portrait with emotional contrast.",
        ],
        ctas: [
          "Follow for emotionally intelligent creator growth.",
        ],
        openings: [
          "Most creators think content failure is about algorithms...",
        ],
      };
    }

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      hooks: [
        "Your idea has emotional potential.",
      ],
      titles: [
        "This idea could become highly shareable.",
      ],
      thumbnails: [
        "Dark cinematic thumbnail with emotional contrast.",
      ],
      ctas: [
        "Make your audience feel understood.",
      ],
      openings: [
        "The internet rewards emotion more than information.",
      ],
    });
  }
}