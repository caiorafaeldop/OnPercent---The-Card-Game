import { CardRarity, CardStats } from '../types';

export interface CardAIInput {
  name: string;
  concept: string;
  rarity: CardRarity;
  style: string;
  mood: string;
}

export interface CardAIResult {
  name: string;
  description: string;
  imagePrompt: string;
  stats: CardStats;
  provider: 'groq' | 'local';
}

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export const getConfiguredGroqKey = (): string => {
  return (
    process.env.GROQ_API_KEY ||
    process.env.groq ||
    process.env.VITE_GROQ_API_KEY ||
    process.env.VITE_GROQ ||
    ''
  );
};

export const stableSeed = (key: string): number => {
  let h = 2166136261;
  for (let i = 0; i < key.length; i += 1) {
    h ^= key.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h % 1_000_000;
};

export const buildPollinationsUrl = (
  prompt: string,
  opts: { width?: number; height?: number; seed?: number; model?: string } = {}
): string => {
  const width = opts.width || 768;
  const height = opts.height || 1152;
  const seed = opts.seed ?? Math.floor(Math.random() * 1_000_000);
  const model = opts.model || 'flux';
  const clean = prompt.replace(/\s+/g, ' ').trim().slice(0, 950);

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(clean)}?width=${width}&height=${height}&model=${model}&nologo=true&enhance=true&seed=${seed}`;
};

const clampStat = (value: unknown): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(0, Math.min(10, Math.round(parsed)));
};

const normalizeStats = (stats: Partial<CardStats> | undefined, fallback: CardStats): CardStats => ({
  str: clampStat(stats?.str ?? fallback.str),
  int: clampStat(stats?.int ?? fallback.int),
  agi: clampStat(stats?.agi ?? fallback.agi)
});

export const inferStats = (input: CardAIInput): CardStats => {
  const ranges: Record<CardRarity, [number, number]> = {
    common: [0, 4],
    rare: [3, 6],
    epic: [5, 8],
    legendary: [7, 10]
  };

  const [min, max] = ranges[input.rarity];
  const spread = max - min + 1;
  const seed = stableSeed(`${input.name}|${input.concept}|${input.style}`);

  return {
    str: min + (seed % spread),
    int: min + (Math.floor(seed / 7) % spread),
    agi: min + (Math.floor(seed / 17) % spread)
  };
};

export const buildLocalImagePrompt = (input: CardAIInput): string => {
  return [
    'vertical trading card artwork, 2:3 composition, no text, no letters, no watermark',
    `subject: ${input.name}`,
    `concept: ${input.concept}`,
    `style: ${input.style}`,
    `mood: ${input.mood}`,
    `${input.rarity} rarity visual treatment`,
    'sharp central silhouette, cinematic lighting, collectible card game quality, detailed background, dramatic contrast, polished illustration'
  ].join(', ');
};

export const buildLocalCardResult = (input: CardAIInput): CardAIResult => {
  const stats = inferStats(input);
  const cleanConcept = input.concept.trim().replace(/\s+/g, ' ');
  const shortConcept = cleanConcept.length > 135 ? `${cleanConcept.slice(0, 132)}...` : cleanConcept;

  return {
    name: input.name.trim(),
    description: shortConcept || 'Uma carta criada na forja local do Onpercent.',
    imagePrompt: buildLocalImagePrompt(input),
    stats,
    provider: 'local'
  };
};

export const enhanceCardWithGroq = async (
  input: CardAIInput,
  apiKey: string
): Promise<CardAIResult> => {
  if (!apiKey.trim()) return buildLocalCardResult(input);

  const fallback = buildLocalCardResult(input);
  const systemPrompt = `You are a senior art director and trading-card game designer.
Return only valid JSON. No markdown.
The card is for a collectible habit/self-mastery game called Onpercent.
Write pt-BR card copy without accents if possible. The image_prompt must be in English.

JSON shape:
{
  "name": "short card name",
  "description": "pt-BR flavor text, 12-24 words",
  "image_prompt": "English image brief, 45-85 words, no text, no letters, no watermark, vertical 2:3 trading card art",
  "stats": { "str": 0-10, "int": 0-10, "agi": 0-10 }
}`;

  const userPrompt = `Card name: ${input.name}
Concept: ${input.concept}
Rarity: ${input.rarity}
Style: ${input.style}
Mood: ${input.mood}

Make it feel premium, specific, and usable as a real card in a cardgame.`;

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.85,
      max_tokens: 1200,
      response_format: { type: 'json_object' }
    })
  });

  if (!response.ok) {
    throw new Error(`Groq retornou HTTP ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Groq nao retornou conteudo.');

  const parsed = JSON.parse(content);
  return {
    name: String(parsed.name || fallback.name).trim().slice(0, 48),
    description: String(parsed.description || fallback.description).trim().slice(0, 220),
    imagePrompt: String(parsed.image_prompt || fallback.imagePrompt).trim(),
    stats: normalizeStats(parsed.stats, fallback.stats),
    provider: 'groq'
  };
};
