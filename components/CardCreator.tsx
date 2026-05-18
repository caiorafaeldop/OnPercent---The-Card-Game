import React, { useEffect, useMemo, useState } from 'react';
import { Collectible, CardRarity } from '../types';
import { buildPollinationsUrl, enhanceCardWithGroq, buildLocalCardResult, stableSeed, CardAIInput } from '../services/cardAi';
import { loadGroqKey, saveGroqKey } from '../services/storage';
import HolographicCard from './HolographicCard';
import { PlusIcon, TrashIcon } from './Icons';

interface CardCreatorProps {
  customCards: Collectible[];
  onCreateCard: (card: Collectible, addToInventory: boolean) => void;
  onDeleteCard: (id: string) => void;
}

const rarityOptions: CardRarity[] = ['common', 'rare', 'epic', 'legendary'];

const styleOptions = [
  'urban anime night, neon reflections, cinematic rain',
  'dark fantasy, sacred relics, dramatic rim light',
  'clean cyberpunk, sharp geometry, premium card art',
  'solar discipline, warm contrast, heroic composition',
  'psychological thriller, moody shadows, surreal details'
];

const moodOptions = [
  'focused and dangerous',
  'lonely but powerful',
  'calm, premium and mysterious',
  'explosive and victorious',
  'ritualistic and intense'
];

const defaultDraft: CardAIInput = {
  name: 'Disciplina Solar',
  concept: 'Um guerreiro moderno que troca prazer rapido por foco brutal e rotina impecavel.',
  rarity: 'rare',
  style: styleOptions[0],
  mood: moodOptions[0]
};

const rarityClass: Record<CardRarity, string> = {
  common: 'border-gray-500 text-gray-300',
  rare: 'border-blue-500 text-blue-300',
  epic: 'border-purple-500 text-purple-300',
  legendary: 'border-orange-500 text-orange-300'
};

const downloadTextFile = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const CardCreator: React.FC<CardCreatorProps> = ({ customCards, onCreateCard, onDeleteCard }) => {
  const [draft, setDraft] = useState<CardAIInput>(defaultDraft);
  const [groqKey, setGroqKey] = useState(() => loadGroqKey());
  const [useGroq, setUseGroq] = useState(() => Boolean(loadGroqKey()));
  const [addToInventory, setAddToInventory] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('Pronto para forjar.');
  const [selectedCard, setSelectedCard] = useState<Collectible | null>(customCards[0] || null);

  useEffect(() => {
    if (selectedCard && !customCards.some(card => card.id === selectedCard.id)) {
      setSelectedCard(customCards[0] || null);
    }
  }, [customCards, selectedCard]);

  const latestCards = useMemo(() => {
    return [...customCards].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  }, [customCards]);

  const updateDraft = (patch: Partial<CardAIInput>) => {
    setDraft(prev => ({ ...prev, ...patch }));
  };

  const handleSaveGroqKey = () => {
    saveGroqKey(groqKey);
    setUseGroq(Boolean(groqKey.trim()));
    setStatus(groqKey.trim() ? 'Chave Groq salva neste navegador.' : 'Groq removido. Vou usar o aprimorador local.');
  };

  const handleGenerate = async () => {
    if (!draft.name.trim() || !draft.concept.trim()) {
      setStatus('Preencha nome e conceito antes de gerar.');
      return;
    }

    setIsGenerating(true);
    setStatus(useGroq && groqKey.trim() ? 'Groq refinando prompt...' : 'Aprimorador local montando prompt...');

    let aiResult = buildLocalCardResult(draft);

    if (useGroq && groqKey.trim()) {
      try {
        aiResult = await enhanceCardWithGroq(draft, groqKey);
        setStatus('Groq refinou. Gerando imagem...');
      } catch (error) {
        console.warn('Groq failed, falling back to local enhancer', error);
        aiResult = buildLocalCardResult(draft);
        setStatus('Groq falhou no browser. Usei o aprimorador local e segui.');
      }
    }

    const id = `custom_${Date.now()}`;
    const seed = stableSeed(`${id}|${aiResult.imagePrompt}`);
    const image = buildPollinationsUrl(aiResult.imagePrompt, { width: 768, height: 1152, seed });

    const card: Collectible = {
      id,
      name: aiResult.name || draft.name,
      description: aiResult.description,
      rarity: draft.rarity,
      collection: 'custom',
      icon: '*',
      image,
      stats: aiResult.stats,
      createdAt: new Date().toISOString(),
      prompt: draft.concept,
      imagePrompt: aiResult.imagePrompt,
      aiProvider: aiResult.provider,
      seed
    };

    onCreateCard(card, addToInventory);
    setSelectedCard(card);
    setStatus(`Carta salva no localStorage com imagem ${aiResult.provider === 'groq' ? 'refinada pelo Groq' : 'local'}.`);
    setIsGenerating(false);
  };

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(customCards, null, 2));
    setStatus('JSON das cartas copiado.');
  };

  const handleCopyTs = async () => {
    const moduleText = `import { Collectible } from '../../types';\n\nexport const CUSTOM_CARDS: Collectible[] = ${JSON.stringify(customCards, null, 2)};\n`;
    await navigator.clipboard.writeText(moduleText);
    setStatus('Modulo TypeScript copiado.');
  };

  const handleDownloadJson = () => {
    downloadTextFile('onpercent-custom-cards.json', JSON.stringify(customCards, null, 2));
    setStatus('Arquivo JSON enviado para downloads.');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto no-scrollbar pb-32">
      <header className="pt-4 mb-5">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] opacity-40">Onpercent Forge</p>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Criar Cartas</h1>
      </header>

      <section className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <input
            type="password"
            value={groqKey}
            onChange={event => setGroqKey(event.target.value)}
            placeholder="GROQ_API_KEY opcional"
            className="min-w-0 flex-1 rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-3 text-sm font-bold outline-none border-2 border-transparent focus:border-black dark:focus:border-white"
          />
          <button
            type="button"
            onClick={handleSaveGroqKey}
            className="h-12 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-[10px] font-black uppercase active:scale-95"
          >
            Salvar
          </button>
        </div>

        <label className="flex items-center justify-between rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-3">
          <span className="text-xs font-black uppercase">Usar Groq para prompt</span>
          <input
            type="checkbox"
            checked={useGroq}
            onChange={event => setUseGroq(event.target.checked)}
            className="w-5 h-5 accent-black dark:accent-white"
          />
        </label>
      </section>

      <section className="space-y-3">
        <input
          value={draft.name}
          onChange={event => updateDraft({ name: event.target.value })}
          placeholder="Nome da carta"
          className="w-full rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-4 text-sm font-black outline-none border-2 border-transparent focus:border-black dark:focus:border-white"
        />

        <textarea
          value={draft.concept}
          onChange={event => updateDraft({ concept: event.target.value })}
          placeholder="Conceito da carta"
          className="w-full min-h-28 rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-4 text-sm font-bold outline-none border-2 border-transparent focus:border-black dark:focus:border-white resize-none"
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            value={draft.rarity}
            onChange={event => updateDraft({ rarity: event.target.value as CardRarity })}
            className="rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-4 text-xs font-black uppercase outline-none border-2 border-transparent focus:border-black dark:focus:border-white"
          >
            {rarityOptions.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>

          <select
            value={draft.mood}
            onChange={event => updateDraft({ mood: event.target.value })}
            className="rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-4 text-xs font-black uppercase outline-none border-2 border-transparent focus:border-black dark:focus:border-white"
          >
            {moodOptions.map(mood => (
              <option key={mood} value={mood}>{mood}</option>
            ))}
          </select>
        </div>

        <select
          value={draft.style}
          onChange={event => updateDraft({ style: event.target.value })}
          className="w-full rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-4 text-xs font-black uppercase outline-none border-2 border-transparent focus:border-black dark:focus:border-white"
        >
          {styleOptions.map(style => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>

        <label className="flex items-center justify-between rounded-2xl bg-gray-100 dark:bg-gray-900 px-4 py-3">
          <span className="text-xs font-black uppercase">Adicionar ao inventario</span>
          <input
            type="checkbox"
            checked={addToInventory}
            onChange={event => setAddToInventory(event.target.checked)}
            className="w-5 h-5 accent-black dark:accent-white"
          />
        </label>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest active:scale-95 disabled:opacity-50"
        >
          <PlusIcon className="w-4 h-4" />
          {isGenerating ? 'Gerando...' : 'Forjar Carta'}
        </button>

        <p className="text-[11px] font-bold opacity-50 leading-relaxed">{status}</p>
      </section>

      <section className="mt-8">
        {selectedCard ? (
          <div className="flex flex-col items-center">
            <div className="w-72 h-[27rem] mb-5">
              <HolographicCard
                image={selectedCard.image || ''}
                name={selectedCard.name}
                rarity={selectedCard.rarity}
                stats={selectedCard.stats}
                className="w-full h-full"
              />
            </div>

            <div className={`w-full rounded-2xl border p-4 bg-black text-white ${rarityClass[selectedCard.rarity]}`}>
              <div className="flex justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-lg font-black italic leading-tight">{selectedCard.name}</h2>
                  <p className="text-[10px] font-black uppercase opacity-60">{selectedCard.rarity} / {selectedCard.aiProvider || 'local'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteCard(selectedCard.id)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 active:scale-95"
                  title="Apagar carta"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm opacity-80 italic mb-4">"{selectedCard.description}"</p>
              <textarea
                readOnly
                value={selectedCard.imagePrompt || ''}
                className="w-full h-28 rounded-xl bg-white/10 p-3 text-[10px] font-mono text-white/70 resize-none outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 py-12 text-center opacity-40">
            <p className="text-xs font-black uppercase">Nenhuma carta criada ainda</p>
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase opacity-50">Cartas criadas ({customCards.length})</h2>
          <div className="flex gap-2">
            <button onClick={handleCopyJson} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-[9px] font-black uppercase">JSON</button>
            <button onClick={handleCopyTs} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-[9px] font-black uppercase">TS</button>
            <button onClick={handleDownloadJson} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-[9px] font-black uppercase">Baixar</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {latestCards.map(card => (
            <button
              key={card.id}
              type="button"
              onClick={() => setSelectedCard(card)}
              className={`relative aspect-[2/3] rounded-xl overflow-hidden border-2 bg-gray-900 active:scale-95 ${selectedCard?.id === card.id ? rarityClass[card.rarity] : 'border-transparent'}`}
            >
              {card.image && <img src={card.image} alt={card.name} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-left">
                <p className="text-white text-[10px] font-black leading-tight truncate">{card.name}</p>
                <p className="text-white/50 text-[8px] font-black uppercase">{card.rarity}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-gray-200 dark:border-gray-800 p-5">
        <h2 className="text-xs font-black uppercase mb-4 opacity-50">Perguntas abertas</h2>
        <div className="space-y-3 text-sm font-bold leading-snug">
          <p>1. As cartas criadas entram no gacha automaticamente ou ficam em uma colecao separada?</p>
          <p>2. O cardgame vai ter habilidades/passivas alem de STR, INT e AGI?</p>
          <p>3. A arte final precisa virar arquivo no repo ou pode ficar como URL reproduzivel?</p>
          <p>4. Qual e a direcao fixa: neon noite, disciplina 1%, dark fantasy, ou mistura por colecao?</p>
        </div>
      </section>
    </div>
  );
};

export default CardCreator;
