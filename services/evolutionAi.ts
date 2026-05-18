import {
  EvolutionBoss,
  EvolutionQuest,
  EvolutionState,
  PersonalAttribute,
  PersonalBuild,
  QuestType,
} from '../types';
import { BUILD_CONFIGS } from './evolution';
import { getConfiguredGroqKey, stableSeed } from './cardAi';

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export interface EvolutionOracleInput {
  build: PersonalBuild;
  objective: string;
  enemy: string;
  state: EvolutionState;
}

export interface EvolutionOracleResult {
  campaignName: string;
  oracleNote: string;
  quests: EvolutionQuest[];
  boss: EvolutionBoss;
}

const ATTRIBUTES: PersonalAttribute[] = ['focus', 'energy', 'discipline', 'courage', 'health', 'social'];
const QUEST_TYPES: QuestType[] = ['daily', 'weekly', 'epic'];

const normalizeAttribute = (value: unknown, fallback: PersonalAttribute): PersonalAttribute => {
  return ATTRIBUTES.includes(value as PersonalAttribute) ? (value as PersonalAttribute) : fallback;
};

const normalizeQuestType = (value: unknown, index: number): QuestType => {
  return QUEST_TYPES.includes(value as QuestType) ? (value as QuestType) : QUEST_TYPES[Math.min(index, QUEST_TYPES.length - 1)];
};

const makeQuest = (raw: any, index: number, fallbackAttribute: PersonalAttribute): EvolutionQuest => {
  const type = normalizeQuestType(raw?.type, index);
  const xpByType = type === 'daily' ? 35 : type === 'weekly' ? 75 : 140;
  const damageByType = type === 'daily' ? 18 : type === 'weekly' ? 32 : 60;

  return {
    id: `quest_${Date.now()}_${index}_${stableSeed(String(raw?.title || index))}`,
    title: String(raw?.title || ['Ritual Diario', 'Golpe da Semana', 'Ato Epico'][index] || 'Missao').slice(0, 54),
    description: String(raw?.description || 'Execute uma acao concreta que prove sua nova identidade.').slice(0, 180),
    type,
    attribute: normalizeAttribute(raw?.attribute, fallbackAttribute),
    xpReward: Math.max(10, Math.min(180, Number(raw?.xpReward || xpByType))),
    creditReward: Math.max(0, Math.min(250, Number(raw?.creditReward || Math.round(xpByType * 1.2)))),
    bossDamage: Math.max(5, Math.min(100, Number(raw?.bossDamage || damageByType))),
    cardConcept: String(raw?.cardConcept || raw?.description || 'Uma carta simbolizando uma vitoria real contra o velho eu.').slice(0, 240),
    createdAt: new Date().toISOString(),
  };
};

const makeBoss = (raw: any, enemy: string, fallbackAttribute: PersonalAttribute): EvolutionBoss => {
  const maxHp = Math.max(80, Math.min(240, Number(raw?.maxHp || 140)));
  return {
    id: `boss_${Date.now()}_${stableSeed(enemy)}`,
    name: String(raw?.name || `O ${enemy || 'Sabotador Interno'}`).slice(0, 46),
    vice: String(raw?.vice || enemy || 'procrastinacao').slice(0, 64),
    description: String(raw?.description || 'A forma viva do padrao que tenta roubar sua semana.').slice(0, 190),
    hp: maxHp,
    maxHp,
    weakness: normalizeAttribute(raw?.weakness, fallbackAttribute),
    imagePrompt: String(raw?.imagePrompt || `dark symbolic boss creature representing ${enemy}, no text, premium card art`).slice(0, 260),
  };
};

export const buildFallbackJourney = (input: EvolutionOracleInput): EvolutionOracleResult => {
  const build = BUILD_CONFIGS[input.build];
  const enemy = input.enemy.trim() || 'procrastinacao';
  const objective = input.objective.trim() || 'vencer a semana com consistencia';

  return {
    campaignName: `Operacao ${build.title}`,
    oracleNote: `Seu inimigo agora e ${enemy}. Nao lute no abstrato: transforme ${objective} em tres provas reais.`,
    quests: [
      makeQuest({
        title: 'Primeiro Corte',
        description: `Faça uma acao de 25 minutos hoje diretamente ligada a: ${objective}.`,
        type: 'daily',
        attribute: build.primary,
        cardConcept: `A first strike against ${enemy}, a disciplined ${build.title} starting the day with controlled force.`,
      }, 0, build.primary),
      makeQuest({
        title: 'Contrato da Semana',
        description: `Escolha 3 blocos na semana e proteja eles como compromisso inegociavel.`,
        type: 'weekly',
        attribute: build.secondary,
        cardConcept: `A weekly pact sealed by a ${build.title}, calendar fragments becoming armor against ${enemy}.`,
      }, 1, build.secondary),
      makeQuest({
        title: 'Prova do Novo Eu',
        description: `Entregue uma evidencia visivel de progresso antes de domingo: treino, texto, venda, estudo ou conversa dificil.`,
        type: 'epic',
        attribute: build.primary,
        cardConcept: `A victorious transformation card, the old self defeated, ${build.title} standing above broken chains.`,
      }, 2, build.primary),
    ],
    boss: makeBoss({
      name: `Avatar da ${enemy}`,
      vice: enemy,
      description: `Ele cresce quando voce negocia consigo mesmo. Perde vida quando uma acao concreta e concluida.`,
      maxHp: 140,
      weakness: build.primary,
    }, enemy, build.primary),
  };
};

export const generateEvolutionJourney = async (input: EvolutionOracleInput): Promise<EvolutionOracleResult> => {
  const apiKey = getConfiguredGroqKey();
  if (!apiKey.trim()) return buildFallbackJourney(input);

  const fallback = buildFallbackJourney(input);
  const build = BUILD_CONFIGS[input.build];

  const systemPrompt = `You are an elite personal-development game designer and narrative director.
Return only valid JSON, no markdown.
The app is a local-first self-mastery RPG called Onpercent.
Write in Brazilian Portuguese without accents if possible.
Make missions concrete, measurable, emotionally charged, and achievable without external tools.

JSON shape:
{
  "campaignName": "2-4 words",
  "oracleNote": "one sharp paragraph, max 45 words",
  "boss": {
    "name": "symbolic boss name",
    "vice": "bad habit or enemy",
    "description": "max 30 words",
    "maxHp": 80-220,
    "weakness": "focus|energy|discipline|courage|health|social",
    "imagePrompt": "English boss card art prompt, no text"
  },
  "quests": [
    {
      "title": "short mission name",
      "description": "measurable action",
      "type": "daily|weekly|epic",
      "attribute": "focus|energy|discipline|courage|health|social",
      "xpReward": number,
      "creditReward": number,
      "bossDamage": number,
      "cardConcept": "English concept for reward card"
    }
  ]
}
Return exactly 3 quests: one daily, one weekly, one epic.`;

  const userPrompt = `Build: ${build.title}
Build style: ${build.style}
Primary attribute: ${build.primary}
Secondary attribute: ${build.secondary}
Objective: ${input.objective || 'improve my life this week'}
Enemy/bad habit: ${input.enemy || 'procrastination'}
Current perks: ${input.state.perks.join(', ') || 'none'}
Shield charges: ${input.state.shieldCharges}`;

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 1800,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return fallback;

    const parsed = JSON.parse(content);
    const quests = Array.isArray(parsed.quests) ? parsed.quests.slice(0, 3) : [];
    return {
      campaignName: String(parsed.campaignName || fallback.campaignName).slice(0, 44),
      oracleNote: String(parsed.oracleNote || fallback.oracleNote).slice(0, 260),
      quests: [0, 1, 2].map(index => makeQuest(quests[index], index, index === 1 ? build.secondary : build.primary)),
      boss: makeBoss(parsed.boss, input.enemy, build.primary),
    };
  } catch (error) {
    console.warn('Evolution oracle failed, using fallback journey', error);
    return fallback;
  }
};
