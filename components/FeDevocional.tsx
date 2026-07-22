import React, { useState } from 'react';
import { Devotional } from '../types';
import { BookIcon, CheckIcon, CircleIcon, PlusIcon, HeartIcon, SparklesIcon, XIcon, QuoteIcon } from './Icons';

interface FeDevocionalProps {
  devotionals?: Devotional[];
  onUpdateDevotional: (devotional: Devotional) => void;
  onAddDevotional: (devotional: Devotional) => void;
}

export const FeDevocional: React.FC<FeDevocionalProps> = ({
  devotionals = [],
  onUpdateDevotional,
  onAddDevotional
}) => {

  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);
  const [activeUser, setActiveUser] = useState<'caio' | 'analaura'>('caio');
  const [noteInput, setNoteInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Devotional Form State
  const [newTheme, setNewTheme] = useState('');
  const [newVerseRef, setNewVerseRef] = useState('');
  const [newVerseText, setNewVerseText] = useState('');
  const [newPrompt, setNewPrompt] = useState('');

  const handleOpenDevotional = (dev: Devotional) => {
    setSelectedDevotional(dev);
    setNoteInput(activeUser === 'caio' ? (dev.caioNote || '') : (dev.analauraNote || ''));
  };

  const handleToggleComplete = (user: 'caio' | 'analaura') => {
    if (!selectedDevotional) return;

    const updated: Devotional = { ...selectedDevotional };

    if (user === 'caio') {
      updated.completedByCaio = !updated.completedByCaio;
      if (updated.completedByCaio && noteInput.trim()) {
        updated.caioNote = noteInput.trim();
      }
    } else {
      updated.completedByAnalaura = !updated.completedByAnalaura;
      if (updated.completedByAnalaura && noteInput.trim()) {
        updated.analauraNote = noteInput.trim();
      }
    }

    onUpdateDevotional(updated);
    setSelectedDevotional(updated);
  };

  const handleSaveNote = () => {
    if (!selectedDevotional || !noteInput.trim()) return;

    const updated: Devotional = { ...selectedDevotional };
    if (activeUser === 'caio') {
      updated.caioNote = noteInput.trim();
    } else {
      updated.analauraNote = noteInput.trim();
    }

    onUpdateDevotional(updated);
    setSelectedDevotional(updated);
  };

  const handleCreateDevotional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheme.trim() || !newVerseRef.trim() || !newVerseText.trim()) return;

    const newDev: Devotional = {
      id: `dev-${Date.now()}`,
      theme: newTheme.trim(),
      verseReference: newVerseRef.trim(),
      verseText: newVerseText.trim(),
      reflectionPrompt: newPrompt.trim() || undefined,
      completedByCaio: false,
      completedByAnalaura: false,
      createdAt: new Date().toISOString()
    };

    onAddDevotional(newDev);

    setNewTheme('');
    setNewVerseRef('');
    setNewVerseText('');
    setNewPrompt('');
    setShowAddModal(false);
  };

  return (
    <div className="h-full overflow-y-auto space-y-6 max-w-4xl mx-auto pb-24 no-scrollbar pr-1">

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-purple-500/20">
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
          <BookIcon className="w-64 h-64 text-purple-200" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold uppercase tracking-wider">
            <SparklesIcon className="w-3.5 h-3.5" />
            Devocional a Dois
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Caminhada de Fé</h1>
          <p className="text-purple-200/90 text-sm md:text-base max-w-xl">
            Abram os temas bíblicos juntos, descubram o Versículo da Vez e deixem uma reflexão marcante da jornada de vocês.
          </p>

          {/* User selector for acting user */}
          <div className="pt-2 flex items-center gap-3">
            <span className="text-xs text-purple-300 font-medium">Você é:</span>
            <div className="flex gap-2 bg-slate-800/80 p-1 rounded-xl border border-purple-500/30">
              <button
                type="button"
                onClick={() => setActiveUser('caio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeUser === 'caio'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-blue-300" />
                Caio
              </button>
              <button
                type="button"
                onClick={() => setActiveUser('analaura')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeUser === 'analaura'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-pink-300" />
                Analaura
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <BookIcon className="w-5 h-5 text-indigo-500" />
          Temas Bíblicos ({devotionals.length})
        </h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all transform hover:scale-105"
        >
          <PlusIcon className="w-4 h-4" />
          Novo Tema Bíblico
        </button>
      </div>

      {/* Grid of Devotional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devotionals.map((dev) => {
          const isBothComplete = dev.completedByCaio && dev.completedByAnalaura;

          return (
            <div
              key={dev.id}
              onClick={() => handleOpenDevotional(dev)}
              className={`group relative cursor-pointer p-5 rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-lg ${
                isBothComplete
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-indigo-500/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/40">
                    {dev.verseReference}
                  </span>
                  {isBothComplete && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                      <SparklesIcon className="w-3 h-3" />
                      Concluído em Casal
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {dev.theme}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic">
                  "{dev.verseText}"
                </p>

                {/* Status Badges */}
                <div className="pt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-800/60 text-xs">
                  <div className="flex items-center gap-3">
                    {/* Caio Status */}
                    <div className="flex items-center gap-1.5">
                      {dev.completedByCaio ? (
                        <CheckIcon className="w-4 h-4 text-blue-500 stroke-[3px]" />
                      ) : (
                        <CircleIcon className="w-4 h-4 text-gray-300 dark:text-slate-700" />
                      )}
                      <span className={`text-[11px] font-semibold ${dev.completedByCaio ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                        Caio
                      </span>
                    </div>

                    {/* Analaura Status */}
                    <div className="flex items-center gap-1.5">
                      {dev.completedByAnalaura ? (
                        <CheckIcon className="w-4 h-4 text-pink-500 stroke-[3px]" />
                      ) : (
                        <CircleIcon className="w-4 h-4 text-gray-300 dark:text-slate-700" />
                      )}
                      <span className={`text-[11px] font-semibold ${dev.completedByAnalaura ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'}`}>
                        Analaura
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-indigo-500 group-hover:underline">
                    Ver Versículo →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Devotional Detail & Verse Modal */}
      {selectedDevotional && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedDevotional(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                <BookIcon className="w-3.5 h-3.5" />
                {selectedDevotional.verseReference}
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {selectedDevotional.theme}
              </h2>
            </div>

            {/* Versículo da Vez Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/60 dark:border-indigo-800/40 space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <QuoteIcon className="w-4 h-4" />
                Versículo da Vez
              </div>
              <blockquote className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 italic leading-relaxed">
                "{selectedDevotional.verseText}"
              </blockquote>
            </div>

            {/* Reflection Prompt */}
            {selectedDevotional.reflectionPrompt && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <span className="font-bold block">Reflexão para o Casal:</span>
                <p>{selectedDevotional.reflectionPrompt}</p>
              </div>
            )}

            {/* Completion Toggles */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 block">
                Marcar Conclusão:
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleToggleComplete('caio')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedDevotional.completedByCaio
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-blue-400'
                  }`}
                >
                  <CheckIcon className="w-4 h-4" />
                  {selectedDevotional.completedByCaio ? 'Caio' : 'Caio'}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleComplete('analaura')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    selectedDevotional.completedByAnalaura
                      ? 'bg-pink-600 text-white border-pink-600 shadow-md'
                      : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-pink-400'
                  }`}
                >
                  <CheckIcon className="w-4 h-4" />
                  {selectedDevotional.completedByAnalaura ? 'Analaura' : 'Analaura'}
                </button>
              </div>
            </div>

            {/* Note / Verse Input */}
            <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                <HeartIcon className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                Mensagem ou Versículo Marcante ({activeUser === 'caio' ? 'Caio' : 'Analaura'}):
              </label>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Deixe uma reflexão, oração ou versículo especial..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSaveNote}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Salvar Mensagem Pessoal
              </button>
            </div>

            {/* Existing Notes History */}
            {(selectedDevotional.caioNote || selectedDevotional.analauraNote) && (
              <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-slate-800 text-xs">
                <span className="font-bold text-gray-700 dark:text-gray-300">Mensagens Registradas:</span>
                {selectedDevotional.caioNote && (
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-200">
                    <span className="font-bold block text-[11px]">🟦 Caio:</span>
                    <p className="italic">"{selectedDevotional.caioNote}"</p>
                  </div>
                )}
                {selectedDevotional.analauraNote && (
                  <div className="p-3 rounded-xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/40 text-pink-900 dark:text-pink-200">
                    <span className="font-bold block text-[11px]">🌸 Analaura:</span>
                    <p className="italic">"{selectedDevotional.analauraNote}"</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Add New Devotional */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <PlusIcon className="w-5 h-5 text-indigo-500" />
              Adicionar Tema Bíblico
            </h3>


            <form onSubmit={handleCreateDevotional} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Tema Geral</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amar o Próximo"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Referência do Versículo</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 1 João 4:11"
                  value={newVerseRef}
                  onChange={(e) => setNewVerseRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Texto do Versículo</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Digite o versículo..."
                  value={newVerseText}
                  onChange={(e) => setNewVerseText(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 dark:text-gray-300 block mb-1">Pergunta / Prompt de Reflexão (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Como podemos praticar isso hoje?"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-800 dark:text-white font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Salvar Tema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
