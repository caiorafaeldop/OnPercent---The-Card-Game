import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DccCompletionsState, DccCompletion } from '../types';

interface DccTabProps {
  completions: DccCompletionsState;
  onToggleItem: (id: number, side: 'left' | 'right') => void;
}

const DCC_TEMAS = [
  "Gratidão diária",
  "Plena confiança",
  "Propósito eterno",
  "Amor paciente",
  "Comunicação sábia",
  "Forte amizade",
  "Fidelidade constante",
  "Oração conjunta",
  "Santa paciência",
  "Escuta ativa",
  "Novos começos",
  "Vida santa",
  "Simples alegria",
  "Honra mútua",
  "Deus no centro",
  "Perdão sincero",
  "Decisões sábias",
  "Futuro juntos",
  "Generosidade sincera",
  "Lar pacífico",
  "Respeito mútuo",
  "União firme",
  "Transparência total",
  "Proteção espiritual",
  "Viva esperança",
  "Amor verdadeiro",
  "Total entrega",
  "Crescimento conjunto",
  "Coração puro",
  "Boas palavras",
  "Apoio constante",
  "Pleno contentamento",
  "Tempo perfeito",
  "Confiança diária",
  "Santo companheirismo",
  "Verdadeira humildade",
  "Lar abençoado",
  "Fé conjunta",
  "Eterna aliança",
  "Santo altar",
  "Fidelidade divina"
];

const DccTab: React.FC<DccTabProps> = ({ completions, onToggleItem }) => {
  const completedCount = useMemo(() => {
    return Object.values(completions).filter(
      (item) => (item as DccCompletion).checkedLeft && (item as DccCompletion).checkedRight
    ).length;
  }, [completions]);

  const progressPercentage = useMemo(() => {
    return Math.round((completedCount / DCC_TEMAS.length) * 100);
  }, [completedCount]);

  return (
    <div className="flex flex-col h-full space-y-6 pb-20">
      <header className="flex flex-col space-y-3 px-1">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 dark:from-pink-400 dark:to-purple-500">
            DCC
          </h2>
          <span className="text-[10px] font-black uppercase tracking-widest bg-pink-500/10 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400 px-3 py-1 rounded-full border border-pink-500/20">
            {completedCount} / {DCC_TEMAS.length} Dias
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-3.5 p-0.5 overflow-hidden border border-gray-200/50 dark:border-zinc-700/30">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.5)]"
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-black uppercase text-gray-400 dark:text-zinc-500 tracking-wider">
          <span>Caminho ao Altar</span>
          <span>{progressPercentage}% Concluído</span>
        </div>
      </header>

      {/* Column Headers */}
      <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 items-center">
        <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider flex items-center gap-1">
          🤵 Noivo
        </span>
        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-wider text-center">
          Devocional Diário
        </span>
        <span className="text-[10px] font-black uppercase text-pink-500 tracking-wider flex items-center gap-1">
          Noiva 👰
        </span>
      </div>

      {/* Devotionals Scroll List */}
      <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar px-1">
        {DCC_TEMAS.map((tema, index) => {
          const id = index + 1;
          const status = completions[id] || { checkedLeft: false, checkedRight: false };
          const isCompleted = status.checkedLeft && status.checkedRight;
          const isPartiallyCompleted = !isCompleted && (status.checkedLeft || status.checkedRight);

          return (
            <motion.div
              key={id}
              layout
              className={`
                relative grid grid-cols-[auto_1fr_auto] gap-4 items-center rounded-2xl p-4 transition-all duration-300 border
                ${isCompleted
                  ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white border-transparent shadow-[0_4px_20px_rgba(244,63,94,0.3)] dark:shadow-[0_4px_25px_rgba(244,63,94,0.45)] scale-[1.01]'
                  : isPartiallyCompleted
                    ? 'bg-pink-50/30 dark:bg-pink-950/5 border-2 border-dashed border-pink-400/40 dark:border-pink-500/30'
                    : 'bg-white dark:bg-zinc-900/60 border-gray-100 dark:border-zinc-800'
                }
              `}
              whileHover={{ scale: isCompleted ? 1.02 : 1.01 }}
            >
              {/* Completed overlay shine effect */}
              {isCompleted && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none rounded-2xl overflow-hidden" />
              )}

              {/* Noivo Checkbox */}
              <button
                type="button"
                onClick={() => onToggleItem(id, 'left')}
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all active:scale-90 select-none
                  ${status.checkedLeft
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/20'
                    : isCompleted
                      ? 'border-white/40 bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                      : 'border-gray-200 dark:border-zinc-800 bg-transparent text-gray-300 dark:text-zinc-700 hover:border-blue-400/50'
                  }
                `}
              >
                <span className={`text-base ${status.checkedLeft ? 'filter-none scale-110' : 'opacity-30 dark:opacity-20 filter grayscale'}`}>🤵</span>
              </button>

              {/* Theme Text */}
              <div className="flex flex-col text-center justify-center min-w-0">
                <span className={`text-[10px] font-black uppercase tracking-wider
                  ${isCompleted ? 'text-white/70' : 'text-gray-400 dark:text-zinc-500'}
                `}>
                  Dia {String(id).padStart(2, '0')}
                </span>
                <h4 className={`font-bold text-sm tracking-tight truncate px-1
                  ${isCompleted ? 'text-white font-black' : 'text-black dark:text-white'}
                `}>
                  {tema}
                </h4>
              </div>

              {/* Noiva Checkbox */}
              <button
                type="button"
                onClick={() => onToggleItem(id, 'right')}
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all active:scale-90 select-none
                  ${status.checkedRight
                    ? 'bg-gradient-to-br from-pink-500 to-rose-600 border-transparent text-white shadow-md shadow-pink-500/20'
                    : isCompleted
                      ? 'border-white/40 bg-white/10 text-white/50 hover:bg-white/20 hover:text-white'
                      : 'border-gray-200 dark:border-zinc-800 bg-transparent text-gray-300 dark:text-zinc-700 hover:border-pink-400/50'
                  }
                `}
              >
                <span className={`text-base ${status.checkedRight ? 'filter-none scale-110' : 'opacity-30 dark:opacity-20 filter grayscale'}`}>👰</span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default DccTab;
