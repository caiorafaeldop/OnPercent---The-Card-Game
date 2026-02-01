import React, { useState } from 'react';
import { Habit } from '../types';
import { CheckIcon, PlusIcon, TrashIcon } from './Icons';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: string, date: string) => void;
  onAdd: (title: string, difficulty: 'easy' | 'medium' | 'hard') => void;
  onDelete: (id: string) => void;
}

// Helper to get last 7 days including today
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
};

const HabitList: React.FC<HabitListProps> = ({ habits, onToggle, onAdd, onDelete }) => {
  const [newHabit, setNewHabit] = useState('');
  const [activeTab, setActiveTab] = useState<'easy'|'medium'|'hard'>('medium');
  const weekDays = getLast7Days();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      onAdd(newHabit, activeTab);
      setNewHabit('');
    }
  };

  // FIX: Use local time YYYY-MM-DD instead of UTC to prevent timezone shifts
  const formatDateKey = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - (offset * 60 * 1000));
      return localDate.toISOString().split('T')[0];
  };
  
  const formatDisplayDay = (date: Date) => date.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase();

  const getStreakColor = (streak: number) => {
      // Palette: Light -> Dark/Neon (Histórias da Noite Theme)
      // Progression: Indigo -> Purple -> Pink -> Fire
      if (streak === 1) return 'bg-indigo-200 text-indigo-900 shadow-sm scale-90'; 
      if (streak === 2) return 'bg-indigo-400 text-white shadow-md shadow-indigo-400/30 scale-95';
      if (streak === 3) return 'bg-violet-500 text-white shadow-md shadow-violet-500/40 scale-100';
      if (streak === 4) return 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 scale-105';
      if (streak === 5) return 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-600/50 scale-105';
      if (streak === 6) return 'bg-pink-600 text-white shadow-xl shadow-pink-600/50 scale-110 ring-2 ring-pink-400/30';
      if (streak >= 7) return 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] scale-110 animate-pulse border-2 border-white/20';
      
      return 'bg-gray-100 dark:bg-gray-800 text-transparent scale-75 hover:scale-90 opacity-50 hover:opacity-100'; // Default (0)
  };

  const filteredHabits = habits.filter(h => (h.difficulty || 'medium') === activeTab);

  return (
    <div className="flex flex-col h-full space-y-6 pb-20">
      <header className="flex justify-between items-center mb-2 px-1">
        <h2 className="text-3xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500">
            Hábitos
        </h2>
        <span className="text-[10px] font-bold uppercase tracking-widest bg-black/5 dark:bg-white/10 px-3 py-1 rounded-full">
            {habits.length} Ativos
        </span>
      </header>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-2 px-1">
         {weekDays.map((day) => (
           <div key={day.toString()} className="flex flex-col items-center justify-center space-y-1">
             <span className="text-[9px] font-black uppercase text-gray-400">{formatDisplayDay(day)}</span>
           </div>
         ))}
      </div>

      {/* Difficulty Tabs */}
      <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-full mx-1">
        {(['easy', 'medium', 'hard'] as const).map((tab) => {
            const isActive = activeTab === tab;
            let activeColor = '';
            if (tab === 'easy') activeColor = 'bg-green-400 text-black shadow-green-400/30';
            if (tab === 'medium') activeColor = 'bg-yellow-400 text-black shadow-yellow-400/30';
            if (tab === 'hard') activeColor = 'bg-red-500 text-white shadow-red-500/30';

            return (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
                        flex-1 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all
                        ${isActive 
                            ? `${activeColor} shadow-lg scale-100` 
                            : 'text-gray-400 hover:text-black dark:hover:text-white'}
                    `}
                >
                    {tab}
                </button>
            )
        })}
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar px-1">
        {filteredHabits.length === 0 ? (
           <div className="text-center py-20 opacity-40">
             <p className="text-lg font-bold">Nenhum hábito {activeTab}</p>
             <p className="text-xs uppercase tracking-widest mt-2">Crie um novo abaixo</p>
           </div>
        ) : (
          filteredHabits.map((habit) => (
            <div key={habit.id} className="group flex flex-col gap-4 bg-white dark:bg-white/5 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden transition-all hover:shadow-md">
              {/* Difficulaty Indicator Stripe */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  habit.difficulty === 'hard' ? 'bg-red-500' : 
                  habit.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
              }`} />

              <div className="flex justify-between items-center pl-3">
                <span className="font-bold text-lg leading-none tracking-tight">{habit.title}</span>
                <button 
                    onClick={() => onDelete(habit.id)}
                    className="opacity-0 group-hover:opacity-50 hover:!opacity-100 transition-opacity p-2 text-red-500"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 z-10 pl-3">
                  {weekDays.map((day, index) => {
                    const dateKey = formatDateKey(day);
                    const isCompleted = habit.completedDates.includes(dateKey);
                    
                    // Streak Logic
                    let streak = 0;
                    if (isCompleted) {
                        streak = 1;
                        let d = new Date(day);
                        // Check backwards visual consistency
                        for(let i=1; i<7; i++) {
                            const prev = new Date(d);
                            prev.setDate(prev.getDate() - 1);
                            if (habit.completedDates.includes(formatDateKey(prev))) {
                                streak++;
                                d = prev;
                            } else {
                                break;
                            }
                        }
                    }

                    const colorClass = getStreakColor(isCompleted ? streak : 0);

                    return (
                      <button
                        key={dateKey}
                        onClick={() => onToggle(habit.id, dateKey)}
                        className={`
                          aspect-square rounded-full flex items-center justify-center transition-all duration-300 ease-spring
                          ${colorClass}
                        `}
                      >
                        {isCompleted && (
                            streak >= 7 ? <CheckIcon className="w-3 h-3 stroke-[3px]" /> : <CheckIcon className="w-3 h-3 stroke-[3px]" />
                        )}
                      </button>
                    );
                  })}
                </div>
            </div>
          ))
        )}
      </div>

      {/* Add Habit Input */}
      <form onSubmit={handleAdd} className="mt-auto px-1 pt-4 pb-2">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-[2rem] p-1.5 flex flex-col gap-2 shadow-inner border border-white/50 dark:border-black/50"> 
            
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder={`Novo hábito...`}
                    className="w-full pl-6 pr-14 py-4 bg-transparent text-sm font-bold focus:outline-none placeholder-gray-400/70"
                />
                <button
                    type="submit"
                    disabled={!newHabit.trim()}
                    className="absolute right-1.5 p-3 bg-black dark:bg-white text-white dark:text-black rounded-full disabled:opacity-20 disabled:scale-90 transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                    <PlusIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};

export default HabitList;