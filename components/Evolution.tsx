import React, { useMemo, useState } from 'react';
import {
  Collectible,
  EvolutionQuest,
  EvolutionState,
  PersonalAttribute,
  PersonalBuild,
} from '../types';
import {
  ATTRIBUTE_COLORS,
  ATTRIBUTE_LABELS,
  BUILD_CONFIGS,
  addAttributeXp,
  getPerkChoices,
  getTotalAttributeLevel,
  normalizeEvolutionState,
  xpIntoCurrentLevel,
} from '../services/evolution';
import { generateEvolutionJourney } from '../services/evolutionAi';
import {
  CardAIInput,
  buildLocalCardResult,
  buildPollinationsUrl,
  enhanceCardWithGroq,
  getConfiguredGroqKey,
  stableSeed,
} from '../services/cardAi';
import HolographicCard from './HolographicCard';

interface EvolutionProps {
  evolution: EvolutionState;
  onChange: (state: EvolutionState) => void;
  onAddCredits: (amount: number) => void;
  onCreateCard: (card: Collectible, addToInventory: boolean) => void;
}

const buildIds = Object.keys(BUILD_CONFIGS) as PersonalBuild[];
const attributeIds = Object.keys(ATTRIBUTE_LABELS) as PersonalAttribute[];

const questTypeLabel = {
  daily: 'Diaria',
  weekly: 'Semanal',
  epic: 'Epica',
};

const questRarity = {
  daily: 'common',
  weekly: 'rare',
  epic: 'epic',
} as const;

const buildCardInput = (
  quest: EvolutionQuest,
  state: EvolutionState
): CardAIInput => {
  const build = state.build ? BUILD_CONFIGS[state.build] : BUILD_CONFIGS.monge;
  return {
    name: quest.title,
    concept: `${quest.cardConcept}. This reward card represents a real completed self-development mission: ${quest.description}`,
    rarity: questRarity[quest.type],
    style: build.style,
    mood: quest.type === 'epic' ? 'victorious and transformative' : 'focused and premium',
  };
};

const Evolution: React.FC<EvolutionProps> = ({ evolution, onChange, onAddCredits, onCreateCard }) => {
  const state = normalizeEvolutionState(evolution);
  const [objective, setObjective] = useState('dominar minha semana com foco e consistencia');
  const [enemy, setEnemy] = useState('procrastinacao');
  const [status, setStatus] = useState('Escolha uma build e invoque sua jornada.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [mintingQuestId, setMintingQuestId] = useState<string | null>(null);
  const [lastCard, setLastCard] = useState<Collectible | null>(null);

  const totalLevel = getTotalAttributeLevel(state);
  const perkChoices = useMemo(() => getPerkChoices(state), [state]);
  const activeQuests = state.quests.filter(quest => !quest.completedAt);
  const completedQuests = state.quests.filter(quest => quest.completedAt);
  const bossProgress = state.boss ? Math.max(0, Math.round((state.boss.hp / state.boss.maxHp) * 100)) : 0;

  const updateState = (next: EvolutionState) => {
    onChange(normalizeEvolutionState(next));
  };

  const handleSelectBuild = (build: PersonalBuild) => {
    updateState({
      ...state,
      build,
      oracleNote: `Build ${BUILD_CONFIGS[build].title} ativada. Agora suas missoes vao puxar esse arquétipo.`,
    });
    setStatus(`Build ${BUILD_CONFIGS[build].title} ativada.`);
  };

  const handleGenerateJourney = async () => {
    if (!state.build) {
      setStatus('Escolha uma build antes de gerar a jornada.');
      return;
    }

    setIsGenerating(true);
    setStatus(getConfiguredGroqKey() ? 'Oraculo IA desenhando sua campanha...' : 'Oraculo local montando sua campanha...');

    const result = await generateEvolutionJourney({
      build: state.build,
      objective,
      enemy,
      state,
    });

    updateState({
      ...state,
      campaignName: result.campaignName,
      oracleNote: result.oracleNote,
      quests: result.quests,
      boss: result.boss,
      lastOracleAt: new Date().toISOString(),
    });
    setStatus('Jornada criada. Agora prove no mundo real.');
    setIsGenerating(false);
  };

  const mintQuestCard = async (quest: EvolutionQuest, nextState: EvolutionState) => {
    setMintingQuestId(quest.id);
    setStatus('Forjando carta da missao...');

    const input = buildCardInput(quest, nextState);
    let aiResult = buildLocalCardResult(input);

    try {
      const key = getConfiguredGroqKey();
      if (key) aiResult = await enhanceCardWithGroq(input, key);
    } catch (error) {
      console.warn('Reward card AI failed, using local card', error);
      aiResult = buildLocalCardResult(input);
    }

    const id = `evo_${Date.now()}_${stableSeed(quest.id)}`;
    const seed = stableSeed(`${id}|${aiResult.imagePrompt}`);
    const card: Collectible = {
      id,
      name: aiResult.name,
      description: aiResult.description,
      rarity: input.rarity,
      collection: 'custom',
      icon: '*',
      image: buildPollinationsUrl(aiResult.imagePrompt, { width: 768, height: 1152, seed }),
      stats: aiResult.stats,
      createdAt: new Date().toISOString(),
      prompt: quest.description,
      imagePrompt: aiResult.imagePrompt,
      aiProvider: aiResult.provider,
      seed,
    };

    onCreateCard(card, true);
    setLastCard(card);
    setMintingQuestId(null);
    setStatus(`Carta "${card.name}" adicionada ao inventario.`);
  };

  const handleCompleteQuest = async (quest: EvolutionQuest) => {
    if (quest.completedAt || mintingQuestId) return;

    const now = new Date().toISOString();
    const nextAttributes = addAttributeXp(state.attributes, quest.attribute, quest.xpReward);
    const nextBoss = state.boss
      ? {
          ...state.boss,
          hp: Math.max(0, state.boss.hp - quest.bossDamage),
          defeatedAt: state.boss.hp - quest.bossDamage <= 0 ? now : state.boss.defeatedAt,
        }
      : null;

    const bossDefeatedNow = Boolean(state.boss && nextBoss && state.boss.hp > 0 && nextBoss.hp === 0);
    const nextState = normalizeEvolutionState({
      ...state,
      attributes: nextAttributes,
      boss: nextBoss,
      shieldCharges: bossDefeatedNow ? state.shieldCharges + 1 : state.shieldCharges,
      quests: state.quests.map(item => item.id === quest.id ? { ...item, completedAt: now } : item),
      oracleNote: bossDefeatedNow
        ? `Boss derrotado. Voce ganhou um escudo de sequencia.`
        : state.oracleNote,
    });

    updateState(nextState);
    onAddCredits(quest.creditReward);
    await mintQuestCard(quest, nextState);
  };

  const handleChoosePerk = (perk: string) => {
    updateState({
      ...state,
      perks: [...state.perks, perk],
      lastPerkLevel: totalLevel,
    });
    setStatus(`Perk desbloqueado: ${perk}.`);
  };

  const renderAttribute = (attr: PersonalAttribute) => {
    const progress = state.attributes[attr];
    const pct = xpIntoCurrentLevel(progress.xp);
    return (
      <div key={attr} className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase opacity-60">{ATTRIBUTE_LABELS[attr]}</span>
          <span className="text-xs font-black">Nv {progress.level}</span>
        </div>
        <div className="h-2 rounded-full bg-white dark:bg-black overflow-hidden">
          <div className={`h-full ${ATTRIBUTE_COLORS[attr]}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-32">
      <header className="pt-4 mb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] opacity-40">RPG de identidade</p>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Evolucao</h1>
      </header>

      <section className="grid grid-cols-2 gap-3 mb-6">
        {buildIds.map(build => {
          const config = BUILD_CONFIGS[build];
          const selected = state.build === build;
          return (
            <button
              key={build}
              type="button"
              onClick={() => handleSelectBuild(build)}
              className={`text-left rounded-2xl p-4 border-2 transition-all active:scale-95 ${
                selected
                  ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                  : 'border-gray-100 bg-gray-50 dark:border-gray-900 dark:bg-gray-950'
              }`}
            >
              <p className="text-sm font-black uppercase">{config.title}</p>
              <p className="text-[11px] font-bold opacity-60 leading-snug mt-1">{config.subtitle}</p>
            </button>
          );
        })}
      </section>

      <section className="mb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[10px] font-black uppercase opacity-40">Nivel total</p>
            <p className="text-3xl font-black">{totalLevel}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase opacity-40">Escudos</p>
            <p className="text-xl font-black">{state.shieldCharges}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {attributeIds.map(renderAttribute)}
        </div>
      </section>

      {perkChoices.length > 0 && (
        <section className="mb-6 rounded-2xl border-2 border-purple-500/40 bg-purple-500/10 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-3">Level up: escolha um perk</p>
          <div className="space-y-2">
            {perkChoices.map(perk => (
              <button
                key={perk}
                type="button"
                onClick={() => handleChoosePerk(perk)}
                className="w-full rounded-xl bg-black text-white dark:bg-white dark:text-black py-3 text-xs font-black uppercase"
              >
                {perk}
              </button>
            ))}
          </div>
        </section>
      )}

      {state.perks.length > 0 && (
        <section className="mb-6">
          <p className="text-[10px] font-black uppercase opacity-40 mb-2">Perks ativos</p>
          <div className="flex flex-wrap gap-2">
            {state.perks.map(perk => (
              <span key={perk} className="rounded-full bg-gray-100 dark:bg-gray-900 px-3 py-1 text-[10px] font-black uppercase">
                {perk}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3 mb-6">
        <input
          value={objective}
          onChange={event => setObjective(event.target.value)}
          placeholder="Objetivo da semana"
          className="w-full rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-4 text-sm font-black outline-none border-2 border-transparent focus:border-black dark:focus:border-white"
        />
        <input
          value={enemy}
          onChange={event => setEnemy(event.target.value)}
          placeholder="Inimigo atual"
          className="w-full rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-4 text-sm font-black outline-none border-2 border-transparent focus:border-black dark:focus:border-white"
        />
        <button
          type="button"
          onClick={handleGenerateJourney}
          disabled={isGenerating || !state.build}
          className="w-full h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-black uppercase tracking-widest active:scale-95 disabled:opacity-40"
        >
          {isGenerating ? 'Invocando...' : 'Gerar Jornada IA'}
        </button>
        <p className="text-[11px] font-bold opacity-50 leading-relaxed">{status}</p>
      </section>

      {state.campaignName && (
        <section className="rounded-2xl bg-gray-100 dark:bg-gray-900 p-5 mb-6">
          <p className="text-[10px] font-black uppercase opacity-40 mb-1">Campanha ativa</p>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">{state.campaignName}</h2>
          {state.oracleNote && <p className="text-sm font-bold opacity-70 leading-relaxed mt-3">{state.oracleNote}</p>}
        </section>
      )}

      {state.boss && (
        <section className="rounded-2xl bg-black text-white p-5 mb-6 overflow-hidden relative">
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-red-500 via-purple-700 to-black" />
          <div className="relative">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-300 mb-1">Boss fight</p>
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black italic leading-none">{state.boss.name}</h2>
                <p className="text-xs font-bold text-white/60 mt-2">{state.boss.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-black uppercase text-white/40">HP</p>
                <p className="text-xl font-black">{state.boss.hp}/{state.boss.maxHp}</p>
              </div>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden mt-5">
              <div className="h-full bg-red-500 transition-all" style={{ width: `${bossProgress}%` }} />
            </div>
            <p className="text-[10px] font-black uppercase text-white/40 mt-3">
              Fraqueza: {ATTRIBUTE_LABELS[state.boss.weakness]}
            </p>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase opacity-50">Missoes ativas</h2>
          <span className="text-[10px] font-black uppercase opacity-40">{activeQuests.length}/{state.quests.length}</span>
        </div>

        {activeQuests.map(quest => (
          <div key={quest.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase opacity-40">{questTypeLabel[quest.type]} / {ATTRIBUTE_LABELS[quest.attribute]}</p>
                <h3 className="text-lg font-black italic leading-tight mt-1">{quest.title}</h3>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-black">+{quest.xpReward} XP</p>
                <p className="text-[10px] font-bold opacity-50">-{quest.bossDamage} HP</p>
              </div>
            </div>
            <p className="text-sm font-bold opacity-70 leading-relaxed mt-3">{quest.description}</p>
            <button
              type="button"
              onClick={() => handleCompleteQuest(quest)}
              disabled={Boolean(mintingQuestId)}
              className="w-full rounded-xl bg-black text-white dark:bg-white dark:text-black py-3 mt-4 text-xs font-black uppercase tracking-widest active:scale-95 disabled:opacity-40"
            >
              {mintingQuestId === quest.id ? 'Forjando carta...' : 'Concluir e forjar carta'}
            </button>
          </div>
        ))}

        {activeQuests.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 py-10 text-center">
            <p className="text-xs font-black uppercase opacity-40">Gere uma jornada para receber missoes.</p>
          </div>
        )}
      </section>

      {lastCard && (
        <section className="mt-8 flex flex-col items-center">
          <p className="text-[10px] font-black uppercase opacity-40 mb-3">Ultima carta de evolucao</p>
          <div className="w-64 h-96">
            <HolographicCard
              image={lastCard.image || ''}
              name={lastCard.name}
              rarity={lastCard.rarity}
              stats={lastCard.stats}
              className="w-full h-full"
            />
          </div>
        </section>
      )}

      {completedQuests.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-black uppercase opacity-50 mb-3">Historico recente</h2>
          <div className="space-y-2">
            {completedQuests.slice(0, 5).map(quest => (
              <div key={quest.id} className="rounded-xl bg-gray-100 dark:bg-gray-900 px-4 py-3 flex justify-between gap-3">
                <span className="text-xs font-black truncate">{quest.title}</span>
                <span className="text-[10px] font-black uppercase opacity-40">feito</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Evolution;
