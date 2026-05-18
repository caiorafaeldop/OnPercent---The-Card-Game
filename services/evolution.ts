import {
  AttributeProgress,
  EvolutionState,
  PersonalAttribute,
  PersonalBuild,
} from '../types';

export const ATTRIBUTE_LABELS: Record<PersonalAttribute, string> = {
  focus: 'Foco',
  energy: 'Energia',
  discipline: 'Disciplina',
  courage: 'Coragem',
  health: 'Saude',
  social: 'Social',
};

export const ATTRIBUTE_COLORS: Record<PersonalAttribute, string> = {
  focus: 'bg-blue-500',
  energy: 'bg-yellow-400',
  discipline: 'bg-purple-500',
  courage: 'bg-red-500',
  health: 'bg-emerald-500',
  social: 'bg-pink-500',
};

export const BUILD_CONFIGS: Record<
  PersonalBuild,
  {
    title: string;
    subtitle: string;
    primary: PersonalAttribute;
    secondary: PersonalAttribute;
    style: string;
    perks: string[];
  }
> = {
  monge: {
    title: 'Monge',
    subtitle: 'Silencio, foco e autocontrole.',
    primary: 'discipline',
    secondary: 'focus',
    style: 'minimal sacred discipline, moonlit temple, clean anime card art',
    perks: ['Respiracao de Aco', 'Jejum de Dopamina', 'Mente Imovel', 'Voto de Constancia'],
  },
  atleta: {
    title: 'Atleta',
    subtitle: 'Corpo forte, energia alta.',
    primary: 'health',
    secondary: 'energy',
    style: 'kinetic sports anime, sweat, sunrise, heroic trading card art',
    perks: ['Motor Interno', 'Recuperacao Rapida', 'Ritual de Treino', 'Corpo Blindado'],
  },
  fundador: {
    title: 'Fundador',
    subtitle: 'Execucao, coragem e dinheiro.',
    primary: 'courage',
    secondary: 'focus',
    style: 'premium startup noir, city lights, strategic founder trading card art',
    perks: ['Decisao Fria', 'Oferta Irresistivel', 'Execucao Brutal', 'Visao de Mercado'],
  },
  artista: {
    title: 'Artista',
    subtitle: 'Criacao, sensibilidade e fluxo.',
    primary: 'focus',
    secondary: 'social',
    style: 'surreal creative studio, ink, neon, expressive anime card art',
    perks: ['Fluxo Aberto', 'Olhar Simbolico', 'Voz Propria', 'Ritual Criativo'],
  },
  estrategista: {
    title: 'Estrategista',
    subtitle: 'Plano, leitura e paciencia.',
    primary: 'focus',
    secondary: 'discipline',
    style: 'chessboard war room, tactical holograms, elegant trading card art',
    perks: ['Plano Mestre', 'Leitura de Campo', 'Ataque em Silencio', 'Calculo Longo'],
  },
};

const ATTRIBUTES: PersonalAttribute[] = ['focus', 'energy', 'discipline', 'courage', 'health', 'social'];

export const calculateAttributeLevel = (xp: number): number => {
  return Math.max(1, Math.floor(xp / 100) + 1);
};

export const xpIntoCurrentLevel = (xp: number): number => xp % 100;

export const createDefaultAttributes = (): Record<PersonalAttribute, AttributeProgress> => {
  return ATTRIBUTES.reduce((acc, attr) => {
    acc[attr] = { xp: 0, level: 1 };
    return acc;
  }, {} as Record<PersonalAttribute, AttributeProgress>);
};

export const createDefaultEvolutionState = (): EvolutionState => ({
  build: null,
  attributes: createDefaultAttributes(),
  quests: [],
  boss: null,
  perks: [],
  shieldCharges: 1,
  lastPerkLevel: 6,
});

export const normalizeEvolutionState = (partial?: Partial<EvolutionState> | null): EvolutionState => {
  const base = createDefaultEvolutionState();
  if (!partial) return base;

  const attributes = createDefaultAttributes();
  ATTRIBUTES.forEach(attr => {
    const current = partial.attributes?.[attr];
    const xp = Math.max(0, Number(current?.xp || 0));
    attributes[attr] = {
      xp,
      level: calculateAttributeLevel(xp),
    };
  });

  return {
    ...base,
    ...partial,
    attributes,
    quests: Array.isArray(partial.quests) ? partial.quests : [],
    perks: Array.isArray(partial.perks) ? partial.perks : [],
    shieldCharges: Number.isFinite(partial.shieldCharges) ? Number(partial.shieldCharges) : base.shieldCharges,
    lastPerkLevel: Number.isFinite(partial.lastPerkLevel) ? Number(partial.lastPerkLevel) : base.lastPerkLevel,
  };
};

export const addAttributeXp = (
  attributes: Record<PersonalAttribute, AttributeProgress>,
  attribute: PersonalAttribute,
  xpReward: number
): Record<PersonalAttribute, AttributeProgress> => {
  const nextXp = Math.max(0, (attributes[attribute]?.xp || 0) + xpReward);
  return {
    ...attributes,
    [attribute]: {
      xp: nextXp,
      level: calculateAttributeLevel(nextXp),
    },
  };
};

export const getTotalAttributeLevel = (state: EvolutionState): number => {
  return ATTRIBUTES.reduce((sum, attr) => sum + (state.attributes[attr]?.level || 1), 0);
};

export const getPerkChoices = (state: EvolutionState): string[] => {
  if (!state.build) return [];
  const totalLevel = getTotalAttributeLevel(state);
  if (totalLevel < state.lastPerkLevel + 2) return [];

  const owned = new Set(state.perks);
  return BUILD_CONFIGS[state.build].perks.filter(perk => !owned.has(perk)).slice(0, 3);
};
