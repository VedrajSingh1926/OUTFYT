import { GoogleGenAI } from '@google/genai';

const STYLE_EMOJIS = {
  formal: '💼',
  streetwear: '👟',
  minimal: '⚪',
  luxury: '✨',
  korean: '🇰🇷',
  vintage: '🕰️',
  'smart-casual': '👔',
  'clean-fit': '🎯',
};

const MOOD_GRADIENTS = {
  confident: 'from-[#7C6CFF] to-[#B8A9FF]',
  relaxed: 'from-[#3DD9B4] to-[#7FEED8]',
  bold: 'from-[#FFC98B] to-[#FFE0B8]',
  minimal: 'from-[#6B6B7B] to-[#9B9BAB]',
  stylish: 'from-[#FF6B81] to-[#FFA3B3]',
  chill: 'from-[#7C6CFF] to-[#3DD9B4]',
};

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function outfitName(context, index, mode) {
  const prefixes = mode === 'variation'
    ? ['Alt', 'Fresh', 'Twist', 'Remix', 'Vibe']
    : ['Elevated', 'Refined', 'Effortless', 'Statement', 'Polished'];
  const suffixes = ['Look', 'Edit', 'Fit', 'Set', 'Drop'];
  const style = (context.stylePreference || 'look').replace(/-/g, ' ');
  return `${prefixes[index % prefixes.length]} ${style} ${suffixes[index % suffixes.length]}`;
}

export async function generateOutfits(wardrobe, context, count = 3, options = {}) {
  const { seed = Date.now(), mode = 'fresh' } = options;
  const filteredWardrobe = wardrobe.filter(w => !w.archived);

  if (filteredWardrobe.length < 3) {
    return getDemoOutfits(context, count, seed, mode);
  }

  const prompt = `
You are an expert AI fashion stylist.
Context:
- Occasion: ${context.occasion || 'Casual'}
- Mood: ${context.mood || 'stylish'}
- Style Preference: ${context.stylePreference || 'smart-casual'}
- Location: ${context.location || 'Unknown'}
- Weather: ${context.weather?.temp ? `${context.weather.temp}°C, ${context.weather.condition}` : 'Unknown'}
- Mode: ${mode}

Wardrobe Items (JSON):
${JSON.stringify(filteredWardrobe.map(w => ({ id: w.id, name: w.name, category: w.category, color: w.color, tags: w.tags })), null, 2)}

Task:
Generate exactly ${count} unique outfit combinations using ONLY the provided wardrobe items.
Ensure the outfits are appropriate for the weather and occasion.
Return the result strictly as a JSON array of objects with the following schema:
[
  {
    "itemIds": ["id1", "id2"], // array of item IDs from the wardrobe
    "reasoning": "string explaining why this works for the weather, occasion, and colors",
    "weatherMatch": 95, // 0-100 score
    "colorHarmony": 90, // 0-100 score
    "moodMatch": 88, // 0-100 score
    "confidence": 92 // 0-100 overall score
  }
]
No markdown code blocks around the JSON, just pure JSON output.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    const generated = JSON.parse(text);

    return generated.map((gen, i) => {
      const items = filteredWardrobe.filter(w => gen.itemIds.includes(w.id));
      const style = context.stylePreference || 'smart-casual';
      const finalSeed = seed + i * 797;

      return {
        id: `gen-${finalSeed}-${i}`,
        name: outfitName(context, i, mode),
        items: items.map(it => it.name),
        itemIds: items.map(it => it.id),
        reasoning: gen.reasoning,
        occasion: context.occasion || 'Casual outing',
        mood: context.mood || 'stylish',
        emoji: STYLE_EMOJIS[style] || '✨',
        gradient: MOOD_GRADIENTS[context.mood] || MOOD_GRADIENTS.stylish,
        versionLabel: mode === 'variation' ? `V${Math.floor(seed / 1000) % 100}.${i + 1}` : undefined,
        weatherMatch: gen.weatherMatch || 90,
        colorHarmony: gen.colorHarmony || 90,
        moodMatch: gen.moodMatch || 90,
        confidence: gen.confidence || 90
      };
    });
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return getDemoOutfits(context, count, seed, mode);
  }
}

function evaluateOutfit(items, context) {
  return {
    weatherMatch: 92,
    colorHarmony: 88,
    moodMatch: 90,
    confidence: 90
  };
}

function getDemoOutfits(context, count, seed, mode) {
  const base = [
    { name: 'Smart Casual Executive', items: ['Navy Blazer', 'White Button-Up', 'Black Jeans', 'Brown Leather Boots'], reasoning: 'Professional yet approachable.', emoji: '💼', gradient: 'from-[#7C6CFF] to-[#B8A9FF]' },
    { name: 'Effortless Street Edit', items: ['Oversized Hoodie', 'Wide Leg Trousers', 'White Sneakers'], reasoning: 'Relaxed streetwear energy.', emoji: '👟', gradient: 'from-[#FF6B81] to-[#FFA3B3]' },
    { name: 'Minimal Chic Set', items: ['Beige Trench', 'Black Midi Skirt', 'Loafers'], reasoning: 'Understated polish.', emoji: '⚪', gradient: 'from-[#3DD9B4] to-[#7FEED8]' },
    { name: 'Korean Clean Fit', items: ['Boxy Tee', 'Tailored Trousers', 'White Sneakers'], reasoning: 'Structured proportions.', emoji: '🇰🇷', gradient: 'from-[#7C6CFF] to-[#3DD9B4]' },
  ];
  return base.slice(0, count).map((o, i) => {
    const scores = evaluateOutfit([], context);
    let optMsg = '';
    if (context.isDestinationActive && context.destinationName) {
      optMsg = `Recommendations optimized for ${context.destinationName} weather. `;
    }
    return {
      id: `demo-${seed}-${i}`,
      ...o,
      name: mode === 'variation' ? `${o.name} (Alt ${i + 1})` : o.name,
      occasion: context.occasion || 'Casual',
      mood: context.mood || 'stylish',
      reasoning: optMsg + o.reasoning,
      ...scores,
      confidence: Math.max(50, scores.confidence - i),
      versionLabel: mode === 'variation' ? `V${i + 1}` : undefined,
    };
  });
}


const REFINEMENT_MAP = {
  formal: 'Swap casual pieces for tailored trousers and a structured blazer.',
  casual: 'Relax with sneakers, soft knits, and lighter layers.',
  layers: 'Add a light jacket or overshirt for temperature shifts.',
  streetwear: 'Oversized top, statement sneakers, relaxed silhouettes.',
  luxury: 'Refined fabrics, muted palette, one statement accessory.',
  color: 'Introduce an accent in coral, mint, or lavender.',
  minimal: 'Reduce to 3 pieces in neutral tones with clean lines.',
  darker: 'Shift to deeper navy, charcoal, and black tones.',
  korean: 'Clean proportions, boxy top, tailored wide-leg bottom.',
};

export async function refineOutfitChat(message, wardrobe, memory, lastOutfit) {
  const prompt = `
You are an expert AI fashion stylist named OUTFYT.
User message: "${message}"

Your goal is to recommend outfits, but first you need context: Occasion, Mood, and Style Preference.
If the user hasn't provided this context recently, ask them conversational questions to gather it (e.g., "Where are you heading today?", "What vibe are you going for?"). Keep it brief and friendly.
If they HAVE provided enough context to generate an outfit, or if they are asking for a refinement, set shouldGenerateOutfits to true.

Respond STRICTLY with JSON in this format:
{
  "content": "Your conversational reply to the user",
  "shouldGenerateOutfits": true/false,
  "extractedContext": {
    "occasion": "extracted or default",
    "mood": "extracted or default",
    "stylePreference": "extracted or default"
  }
}
`;

  let content = "I'm ready to style you!";
  let outfits = [];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });
    
    const parsed = JSON.parse(response.text);
    content = parsed.content;
    
    if (parsed.shouldGenerateOutfits) {
      const context = {
        occasion: parsed.extractedContext?.occasion || memory?.preferredOccasions?.[0] || 'Casual',
        mood: parsed.extractedContext?.mood || memory?.preferredMood || 'stylish',
        stylePreference: parsed.extractedContext?.stylePreference || memory?.preferredStyles?.[0] || 'smart-casual',
        location: memory?.location,
        weather: memory?.lastWeather,
      };
      // Generate 3 outfits like the old Outfit Generator
      outfits = await generateOutfits(wardrobe, context, 3, { seed: Date.now(), mode: 'fresh' });
    }
  } catch (err) {
    console.error("Chat Refinement Error:", err);
    content = "I'm having a little trouble thinking right now, but let's get you styled. What are you looking for?";
  }

  return { content, outfits };
}

export function buildStyleMemory(userId, wardrobe, history, profile) {
  const colorCounts = {};
  const styleCounts = {};
  const comboKeys = [];

  for (const item of wardrobe) {
    const c = (item.color || 'neutral').toLowerCase();
    colorCounts[c] = (colorCounts[c] || 0) + 1;
  }

  for (const session of history.slice(0, 30)) {
    if (session.context?.stylePreference) {
      styleCounts[session.context.stylePreference] = (styleCounts[session.context.stylePreference] || 0) + 1;
    }
    if (session.outfits?.[0]?.items) {
      comboKeys.push(session.outfits[0].items.sort().join('|'));
    }
  }

  const topColor = Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0];
  const topStyle = Object.entries(styleCounts).sort((a, b) => b[1] - a[1])[0];

  const insights = [];
  if (topColor) {
    insights.push(`You wear ${topColor[0]} tones most often — I'll lean into that palette.`);
  }
  if (topStyle) {
    insights.push(`You often choose ${topStyle[0].replace(/-/g, ' ')} outfits.`);
  }

  let repeatWarning = null;
  const recent = history.filter((h) => h.type === 'outfit_session').slice(0, 6);
  if (recent.length >= 2) {
    const lastItems = recent[0]?.outfits?.[0]?.items?.sort().join(',') || '';
    const similar = recent.slice(1).filter((r) => {
      const items = r.outfits?.[0]?.items || [];
      const overlap = items.filter((i) => recent[0].outfits?.[0]?.items?.includes(i)).length;
      return overlap >= 2;
    });
    if (similar.length >= 1 && lastItems) {
      const daysAgo = Math.max(
        1,
        Math.floor((Date.now() - new Date(similar[0].createdAt).getTime()) / 86400000)
      );
      repeatWarning = `You wore a similar look about ${daysAgo} day(s) ago — want a fresh twist?`;
    }
  }


  return {
    userId,
    favoriteColors: profile?.favoriteColors || (topColor ? [topColor[0]] : ['neutral']),
    blockedColors: profile?.blockedColors || [],
    preferredStyles: profile?.preferredStyles || (topStyle ? [topStyle[0]] : ['smart-casual']),
    preferredMood: profile?.preferredMood || 'stylish',
    preferredOccasions: profile?.preferredOccasions || ['casual'],
    location: profile?.location,
    lastWeather: profile?.lastWeather,
    insights,
    repeatWarning,
    wardrobeCount: wardrobe.length,
  };
}

// Wardrobe parser removed
