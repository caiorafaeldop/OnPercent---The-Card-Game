import React, { useState, useEffect, useRef } from 'react';
import { JournalEntry } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

interface JournalProps {
  entries: JournalEntry[];
  onSave: (entry: JournalEntry, claimReward?: boolean) => void;
}

const Journal: React.FC<JournalProps> = ({ entries, onSave }) => {
  // Dates
  const today = new Date().toLocaleDateString('en-CA');
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calendar View State
  const [viewDate, setViewDate] = useState(new Date());

  // Form State
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(3);
  const [savedToday, setSavedToday] = useState(false);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  // Load entry when selectedDate changes
  useEffect(() => {
    const entry = entries.find(e => e.date === selectedDate);
    if (entry) {
      setContent(entry.content);
      setRating(entry.rating);
      setSavedToday(true);
    } else {
      setContent('');
      setRating(3);
      setSavedToday(false);
    }
  }, [entries, selectedDate]);

  const handleSubmit = () => {
    if (!content.trim()) return;

    let claimReward = false;
    
    // Only allow reward if editing TODAY's entry
    if (selectedDate === today) {
        const rewardKey = `journal_reward_v2_${today}`;
        const alreadyClaimed = localStorage.getItem(rewardKey);

        if (content.length > 10 && !alreadyClaimed) {
            claimReward = true;
            localStorage.setItem(rewardKey, 'true');
            setRewardMessage("+100 FICHAS - TIRO GARANTIDO 🎰");
            setTimeout(() => setRewardMessage(null), 3000);
        }
    }

    const entryId = entries.find(e => e.date === selectedDate)?.id || Date.now().toString();

    onSave({
      id: entryId,
      date: selectedDate, // Save for the selected date
      content,
      rating
    }, claimReward);
    
    setSavedToday(true);
  };

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = new Date(year, month, d).toLocaleDateString('en-CA');
        const isSelected = dateStr === selectedDate;
        const isToday = dateStr === today;
        const hasEntry = entries.some(e => e.date === dateStr);
        
        days.push(
            <button
                key={dateStr}
                onClick={() => {
                    setSelectedDate(dateStr);
                    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`
                    aspect-square rounded-full flex flex-col items-center justify-center text-xs relative
                    ${isSelected 
                        ? 'bg-black text-white dark:bg-white dark:text-black font-bold' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                    ${isToday && !isSelected ? 'border border-black dark:border-white' : ''}
                `}
            >
                {d}
                {hasEntry && (
                    <div className={`w-1 h-1 rounded-full absolute bottom-1 ${isSelected ? 'bg-white dark:bg-black' : 'bg-black dark:bg-white'}`} />
                )}
            </button>
        );
    }

    return days;
  };

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Display Date Header logic
  const displayDateHeader = () => {
      if (selectedDate === today) return "Hoje";
      const [y, m, d] = selectedDate.split('-').map(Number);
      return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  return (
    <div ref={containerRef} className="flex flex-col h-full space-y-4 pb-20 relative overflow-y-auto no-scrollbar">
      <header className="flex justify-between items-end">
        <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mb-1">Diário</h2>
            <p className="text-sm opacity-60">Reflexão diária.</p>
        </div>
        <div className="text-right">
            <div className="text-xs font-bold uppercase opacity-50">Visualizando</div>
            <div className="text-lg font-bold">{displayDateHeader()}</div>
        </div>
      </header>

      {rewardMessage && (
          <div className="absolute top-0 left-0 right-0 z-50 animate-bounce">
              <div className="bg-yellow-400 text-black font-black text-center py-2 px-4 rounded-xl shadow-xl border-4 border-black uppercase tracking-widest text-sm">
                  {rewardMessage}
              </div>
          </div>
      )}

      {/* Editor Area */}
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
           <textarea
             className="flex-1 w-full p-4 min-h-[300px] rounded-xl bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-black dark:focus:border-white focus:outline-none resize-none transition-colors"
             placeholder={selectedDate === today ? "Escreva sobre seu dia..." : `Entrada de ${displayDateHeader()}...`}
             value={content}
             onChange={(e) => setContent(e.target.value)}
           />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl uppercase tracking-widest active:scale-95 transition-transform"
        >
          {savedToday ? 'Atualizar' : 'Salvar'}
        </button>
      </div>

      {/* Calendar Area */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="flex justify-between items-center mb-4">
              <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <span className="font-bold uppercase text-sm">
                  {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <ChevronRightIcon className="w-5 h-5" />
              </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                  <div key={d} className="text-[10px] font-bold opacity-40">{d}</div>
              ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
          </div>
      </div>
    </div>
  );
};

export default Journal;