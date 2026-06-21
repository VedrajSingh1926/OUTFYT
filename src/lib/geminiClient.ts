import { OutfitGenerateParams, Outfit } from './api';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateContent';

function getApiKey(): string | undefined {
  // Expect API key in environment variable VITE_GEMINI_API_KEY
  return import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
}

/**
 * Generate outfit recommendations using Gemini.
 * Returns an array of outfits, confidence scores and explanations.
 */
export async function generateOutfit(params: OutfitGenerateParams): Promise<{ outfits: Outfit[]; confidence: number }> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key not set in VITE_GEMINI_API_KEY');

  const prompt = `Generate ${params.count ?? 2} outfit combinations for a ${params.occasion ?? 'occasion'} with mood ${params.mood ?? 'neutral'}, style ${params.stylePreference ?? 'default'}. Include reasoning, a confidence score out of 100, and a "whyNot" field explaining why alternative choices weren't made or what might be slightly off. Return as JSON with an array of outfits and an overall confidence score.`;

  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, topK: 40, topP: 0.8, maxOutputTokens: 1024 },
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini request failed: ${err}`);
  }

  const data = await res.json();
  // Simplified parsing: assume Gemini returns text with outfits JSON
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  try {
    const parsed = JSON.parse(text);
    return { outfits: parsed.outfits as Outfit[], confidence: parsed.confidence as number };
  } catch {
    // Fallback: return empty
    return { outfits: [], confidence: 0 };
  }
}

/**
 * Simple chat wrapper for Gemini.
 */
export async function chatWithGemini(messages: { role: string; content: string }[]): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('Gemini API key not set');
  const body = { contents: messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })) };
  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Gemini chat failed');
  const data = await res.json();
}

/**
 * Optional selfie analysis.
 */
export async function analyzeSelfie(imageBase64: string): Promise<string> {
  // Stub implementation
  return "Selfie analyzed successfully.";
}

/**
 * Generate confidence score based on context.
 */
export async function generateConfidenceScore(context: any): Promise<number> {
  // Stub implementation
  return 85;
}
