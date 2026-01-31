import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';

interface JournalProps {
  entries: JournalEntry[];
  onSave: (entry: JournalEntry, claimReward?: boolean) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, onSave }) => {
  // Use local date instead of UTC to avoid "tomorrow" bug in evenings
  const today = new Date().toLocaleDateString('en-CA'); 
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(3);
  const [savedToday, setSavedToday] = useState(false);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  useEffect(() => {
    const todayEntry = entries.find(e => e.date === today);
    if (todayEntry) {
      setContent(todayEntry.content);
      setRating(todayEntry.rating);
      setSavedToday(true);
    }
  }, [entries, today]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    let claimReward = false;
    const rewardKey = `journal_reward_claimed_${today}`;
    const alreadyClaimed = localStorage.getItem(rewardKey);

    if (content.length > 10 && !alreadyClaimed) {
        claimReward = true;
        localStorage.setItem(rewardKey, 'true');
        setRewardMessage("+100 FICHAS - TIRO GARANTIDO 🎰");
        setTimeout(() => setRewardMessage(null), 3000);
    }

    // @ts-ignore
    onSave({
      id: savedToday ? (entries.find(e => e.date === today)?.id || Date.now().toString()) : Date.now().toString(),
      date: today,
      content,
      rating
    }, claimReward);
    setSavedToday(true);
  };

  return (
    <div className="flex flex-col h-full space-y-6 pb-20 relative">
      <header className="mb-2">
        <h2 className="text-3xl font-bold tracking-tighter uppercase mb-1">Diário</h2>
        <p className="text-sm opacity-60">Reflexão diária sobre disciplina.</p>
      </header>

      {rewardMessage && (
          <div className="absolute top-0 left-0 right-0 z-50 animate-bounce">
              <div className="bg-yellow-400 text-black font-black text-center py-2 px-4 rounded-xl shadow-xl border-4 border-black uppercase tracking-widest text-sm">
                  {rewardMessage}
              </div>
          </div>
      )}

      <div className="flex-1 flex flex-col space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase opacity-70">Nota do dia</label>
          <div className="flex justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-xl">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => setRating(r)}
                className={`
                  w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg transition-all
                  ${rating === r 
                    ? 'bg-black text-white dark:bg-white dark:text-black scale-110 shadow-lg' 
                    : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}
                `}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-2">
           <label className="text-xs font-bold uppercase opacity-70">Anotações</label>
           <textarea
             className="flex-1 w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-black dark:focus:border-white focus:outline-none resize-none transition-colors"
             placeholder="Como foi seu desempenho hoje? O que você pode melhorar amanhã? (Mínimo 10 caracteres para recompensa)"
             value={content}
             onChange={(e) => setContent(e.target.value)}
           />
           <div className="text-right text-[10px] font-bold opacity-40 uppercase">
              {content.length} caracteres
           </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl uppercase tracking-widest active:scale-95 transition-transform"
        >
          {savedToday ? 'Atualizar Diário' : 'Salvar Diário'}
        </button>
      </div>

      {/* Recent Entries Mini-List */}
      {entries.length > 0 && (
        <div className="mt-8">
           <h3 className="text-xs font-bold uppercase mb-4 opacity-50">Histórico Recente</h3>
           <div className="space-y-3">
             {entries.slice(-3).reverse().map(entry => (
               <div key={entry.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                 <div className="flex justify-between mb-2">
                   <span className="text-xs font-bold">{entry.date}</span>
                   <span className="text-xs font-bold bg-black text-white dark:bg-white dark:text-black px-2 rounded-full">{entry.rating}/5</span>
                 </div>
                 <p className="text-sm opacity-80 line-clamp-2">{entry.content}</p>
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Journal;