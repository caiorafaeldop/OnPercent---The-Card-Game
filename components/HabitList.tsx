import React, { useState } from 'react';
import { Habit } from '../types';
import { CheckIcon, PlusIcon, TrashIcon } from './Icons';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: string, date: string) => void;
  onAdd: (title: string) => void;
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
  const weekDays = getLast7Days();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      onAdd(newHabit);
      setNewHabit('');
    }
  };

  const formatDateKey = (date: Date) => date.toISOString().split('T')[0];
  const formatDisplayDay = (date: Date) => date.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase();
  const formatDisplayDate = (date: Date) => date.getDate();

  return (
    <div className="flex flex-col h-full space-y-6 pb-20">
      <header className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold tracking-tighter uppercase">Hábitos</h2>
        <span className="text-sm font-medium opacity-50">{habits.length} Ativos</span>
      </header>

      {/* Week Header */}
      <div className="grid grid-cols-[1fr_repeat(7,minmax(0,1fr))] gap-2 mb-2 px-1">
         <div className="invisible">Label</div>
         {weekDays.map((day) => (
           <div key={day.toString()} className="flex flex-col items-center justify-center text-xs opacity-60">
             <span className="font-bold">{formatDisplayDay(day)}</span>
             <span>{formatDisplayDate(day)}</span>
           </div>
         ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
        {habits.length === 0 ? (
           <div className="text-center py-20 opacity-40">
             <p className="text-lg">Nenhum hábito ainda.</p>
             <p className="text-sm">Comece hoje sua jornada para o 1%.</p>
           </div>
        ) : (
          habits.map((habit) => (
            <div key={habit.id} className="group animate-fade-in">
              <div className="grid grid-cols-[1fr_repeat(7,minmax(0,1fr))] gap-2 items-center mb-1">
                <div className="truncate font-medium text-lg pr-2 relative">
                    {habit.title}
                    <button 
                      onClick={() => onDelete(habit.id)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-red-500 transition-opacity"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
                {weekDays.map((day) => {
                  const dateKey = formatDateKey(day);
                  const isCompleted = habit.completedDates.includes(dateKey);
                  return (
                    <button
                      key={dateKey}
                      onClick={() => onToggle(habit.id, dateKey)}
                      className={`
                        aspect-square rounded-full flex items-center justify-center transition-all duration-300
                        ${isCompleted 
                          ? 'bg-black text-white dark:bg-white dark:text-black scale-100 shadow-sm' 
                          : 'bg-gray-200 dark:bg-gray-800 text-transparent scale-90 hover:scale-95'}
                      `}
                    >
                      <CheckIcon className="w-3 h-3" />
                    </button>
                  );
                })}
              </div>
              <div className="h-px w-full bg-gray-100 dark:bg-gray-800 mt-3" />
            </div>
          ))
        )}
      </div>

      {/* Add Habit Input */}
      <form onSubmit={handleAdd} className="mt-auto pt-4 sticky bottom-0 bg-white dark:bg-black pb-4 z-10 border-t border-gray-100 dark:border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Novo hábito (ex: Ler 10 páginas)"
            className="w-full pl-4 pr-12 py-4 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-transparent focus:border-black dark:focus:border-white focus:outline-none transition-all placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!newHabit.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg disabled:opacity-50 transition-transform active:scale-95"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitList;