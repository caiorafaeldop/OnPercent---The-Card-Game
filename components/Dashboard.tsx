import React, { useState } from 'react';
import { Habit } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { COLLECTIBLES } from '../services/gacha';
import { soundService } from '../services/audio';

import { calculateCurrentStreak, calculateBestStreak } from '../services/gamification';

interface DashboardProps {
  habits: Habit[];
  xp: number;
  level: number;
  inventory: string[];
}

import { ChevronLeftIcon, ChevronRightIcon } from './Icons';

// ... (imports)

interface DashboardProps {
  habits: Habit[];
  xp: number;
  level: number;
  inventory: string[];
  onToggle: (habitId: string, date: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, xp, level, inventory, onToggle }) => {
  const [selectedHabitId, setSelectedHabitId] = useState<string>('all');
  const [viewCardId, setViewCardId] = useState<string | null>(null);
  
  // Calendar View State
  const [viewDate, setViewDate] = useState(new Date());

  const filteredHabits = selectedHabitId === 'all' 
    ? habits 
    : habits.filter(h => h.id === selectedHabitId);

  // ... (Streak stats code remains same, omitted for brevity in replacement if not touched, but since it's a replace block, I must be careful. 
  // Actually, I should use multi_replace or ensure I cover the whole file correctly if I'm replacing large chunks. 
  // Let's stick to replacing the specific parts or the whole component logic if easier. 
  // Given the complexity of mixing state and render, I will replace the component body logic.)

  // Calculate Streak Stats - KEEPING AS IS
  const currentStreak = selectedHabitId !== 'all' 
     ? calculateCurrentStreak(filteredHabits[0]?.completedDates || []) 
     : habits.reduce((max, h) => Math.max(max, calculateCurrentStreak(h.completedDates)), 0);

  const bestStreak = selectedHabitId !== 'all' 
     ? calculateBestStreak(filteredHabits[0]?.completedDates || [])
     : habits.reduce((max, h) => Math.max(max, calculateBestStreak(h.completedDates)), 0);

  // --- Calendar Logic ---
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); 
  const currentMonthName = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const handlePrevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

  const getDayStatus = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check if ANY filtered habit was completed on this day
    const completedCount = filteredHabits.filter(h => h.completedDates.includes(dateStr)).length;
    
    if (completedCount === 0) return 'empty';
    if (selectedHabitId !== 'all') return 'completed'; // Single habit view
    
    // Heatmap logic for 'All' view
    if (completedCount === filteredHabits.length && filteredHabits.length > 0) return 'perfect';
    if (completedCount > filteredHabits.length / 2) return 'good';
    return 'some';
  };
  
  // ... (Gacha Stats Logic remains same)
  // ... (Rarity Stats Logic remains same)
  const getRarityStats = () => {
    // ... (logic from original file)
    const stats: Record<string, number> = { common: 0, rare: 0, epic: 0, legendary: 0 };
    inventory.forEach(id => {
       const item = COLLECTIBLES.find(c => c.id === id);
       if (item && item.rarity) {
          if (stats[item.rarity] !== undefined) stats[item.rarity]++;
       }
    });
    return [
      { name: 'Comum', value: stats.common, color: '#9CA3AF' },
      { name: 'Raro', value: stats.rare, color: '#60A5FA' },
      { name: 'Épico', value: stats.epic, color: '#A78BFA' },
      { name: 'Lendário', value: stats.legendary, color: '#FBBF24' }
    ].filter(i => i.value > 0);
  };
  const rarityData = getRarityStats();
  const totalItems = inventory.length;

  return (
    <div className="flex flex-col h-full space-y-8 pb-20 overflow-y-auto no-scrollbar">
       {/* ... (Header Stats - keeping same) */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl flex flex-col justify-center items-center shadow-sm">
             <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Nível</span>
             <span className="text-4xl font-black">{level}</span>
             <div className="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                <div className="bg-black dark:bg-white h-full" style={{ width: `${(xp % 100)}%` }}></div>
             </div>
          </div>
          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-2xl flex flex-col justify-center items-center shadow-sm">
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">Sequência</span>
              <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-orange-500">{currentStreak}</span>
                  <span className="text-xs font-bold text-gray-400">dias</span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 uppercase">Recorde: {bestStreak}</span>
          </div>
      </div>

      {/* Habits Calendar */}
      <div>
        <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-black uppercase tracking-tighter">Atividade</h3>
             <div className="relative">
                 <select 
                    value={selectedHabitId}
                    onChange={(e) => {
                        setSelectedHabitId(e.target.value);
                        soundService.playClick();
                    }}
                    className="p-2 pr-8 rounded-lg bg-gray-100 dark:bg-gray-900 border-none text-xs font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500"
                 >
                    <option value="all">Todos os Projetos</option>
                    {habits.map(h => (
                        <option key={h.id} value={h.id}>{h.title}</option>
                    ))}
                 </select>
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[10px]">▼</div>
             </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
           <div className="flex justify-between items-center mb-6">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <ChevronLeftIcon className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full uppercase text-[10px] tracking-wide">
                    {currentMonthName}
                </span>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
           </div>
           
           <div className="grid grid-cols-7 gap-2 mb-2 text-center">
              {['D','S','T','Q','Q','S','S'].map((d, i) => (
                  <span key={i} className="text-[10px] font-bold opacity-30">{d}</span>
              ))}
           </div>

           <div className="grid grid-cols-7 gap-2">
              {Array(firstDayOfMonth).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} />
              ))}
              
              {Array(daysInMonth).fill(null).map((_, i) => {
                  const day = i + 1;
                  const status = getDayStatus(day);
                  const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();
                  
                  let bgClass = 'bg-gray-50 dark:bg-gray-800 text-gray-300';
                  let ringClass = '';
                  let cursorClass = selectedHabitId !== 'all' ? 'cursor-pointer hover:opacity-80' : 'cursor-default';
                  
                  if (status === 'completed') bgClass = 'bg-green-500 shadow-lg shadow-green-500/30 text-white scale-110';
                  if (status === 'perfect') bgClass = 'bg-green-500 shadow-lg shadow-green-500/30 text-white scale-110';
                  if (status === 'good') bgClass = 'bg-green-400/60 text-white';
                  if (status === 'some') bgClass = 'bg-green-200/50 dark:bg-green-900/40 text-green-900 dark:text-green-100';

                  if (isToday) ringClass = 'ring-2 ring-black dark:ring-white ring-offset-2 dark:ring-offset-black';

                  return (
                      <div 
                        key={day} 
                        onClick={() => {
                            if (selectedHabitId !== 'all') {
                                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                onToggle(selectedHabitId, dateStr);
                            }
                        }}
                        className={`
                            aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all
                            ${bgClass} ${ringClass} ${cursorClass}
                        `}
                      >
                          {day}
                      </div>
                  )
              })}
           </div>
           
           <div className="mt-4 flex gap-4 justify-center text-[10px] opacity-50 uppercase font-bold tracking-widest">
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-gray-200 dark:bg-gray-800"></div> Nada</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-green-200/50"></div> Pouco</div>
               <div className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-green-500"></div> Tudo</div>
           </div>
        </div>
      </div>

      {/* Gacha Stats & Rarity Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase mb-4 opacity-50">Coleção</h3>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-black">{totalItems}</span>
                    <span className="text-sm font-bold opacity-50 mb-1">Cartas</span>
                </div>
              </div>
              <div className="mt-4">
                  {rarityData.map(d => (
                      <div key={d.name} className="flex justify-between items-center text-xs font-bold py-1 border-b border-gray-100 dark:border-gray-800 last:border-0 opacity-80">
                          <span className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}} />
                              {d.name}
                          </span>
                          <span>{d.value}</span>
                      </div>
                  ))}
              </div>
          </div>
          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center relative min-h-[160px]">
                {rarityData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                            <Pie
                                data={rarityData}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {rarityData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#000', color: '#fff', fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-xs opacity-40 text-center">Nenhuma carta coletada.</div>
                )}
          </div>
      </div>

      {/* Collection Grid Preview (Dashboard) */}
      <div>
         <h3 className="text-xs font-bold uppercase mb-4 opacity-50">Sua Coleção</h3>
         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
             {inventory.map(id => {
                 const item = COLLECTIBLES.find(c => c.id === id);
                 if (!item) return null;

                 const isLegendary = item.rarity === 'legendary';
                 const isEpic = item.rarity === 'epic';
                 const isRare = item.rarity === 'rare';
                 
                 let borderColor = 'border-gray-500';
                 if (isLegendary) borderColor = 'border-orange-500';
                 else if (isEpic) borderColor = 'border-purple-500';
                 else if (isRare) borderColor = 'border-blue-500';

                 return (
                     <div 
                        key={id} 
                        onClick={() => {
                            setViewCardId(id);
                            soundService.playClick();
                        }}
                        onMouseEnter={() => soundService.playHover()}
                        className={`aspect-[2/3] rounded-lg border-2 ${borderColor} overflow-hidden relative group cursor-pointer transform hover:scale-105 transition-all shadow-lg hover:shadow-xl`}
                     >
                         <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
                             <span className="text-[10px] font-bold leading-none mb-1">{item.name}</span>
                             <span className="text-[8px] uppercase opacity-70">{item.rarity}</span>
                             <span className="mt-2 text-[8px] uppercase border px-2 py-1 rounded bg-white text-black font-bold">Ver</span>
                         </div>
                     </div>
                 )
             })}
             {inventory.length === 0 && <div className="col-span-full text-center text-xs opacity-40 py-4">Ainda sem cartas. Vá ao Perfil tentar a sorte!</div>}
         </div>
      </div>
      
      {/* Card Modal */}
      {viewCardId && (() => {
        const card = COLLECTIBLES.find(c => c.id === viewCardId);
        if (!card) return null;
        
        const isLegendary = card.rarity === 'legendary';
        const isEpic = card.rarity === 'epic';
        const isRare = card.rarity === 'rare';
        
        let borderColor = 'border-gray-500';
        let glowColor = 'bg-gray-500/20';
        
        if (isLegendary) { borderColor = 'border-orange-500'; glowColor = 'bg-orange-500/20'; }
        else if (isEpic) { borderColor = 'border-purple-500'; glowColor = 'bg-purple-500/20'; }
        else if (isRare) { borderColor = 'border-blue-500'; glowColor = 'bg-blue-500/20'; }

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setViewCardId(null)}>
             <div className="relative max-w-sm w-full bg-gray-900 rounded-3xl border-4 border-gray-800 p-6 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Glow */}
                <div className={`absolute inset-0 ${glowColor} animate-pulse blur-xl`}></div>

                <div className="relative z-10 flex flex-col items-center text-white">
                   <div className={`w-64 h-80 rounded-xl border-4 ${borderColor} shadow-2xl overflow-hidden mb-6 relative`}>
                      <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 w-full bg-black/60 text-center py-1 text-[10px] font-bold uppercase">{card.rarity}</div>
                   </div>

                   <h2 className="text-3xl font-black italic tracking-tighter mb-2 text-center">{card.name}</h2>
                   <p className="text-sm opacity-70 text-center leading-relaxed mb-6 italic">"{card.description}"</p>

                   <div className="flex gap-4 w-full justify-center">
                      <div className="bg-black/50 p-2 rounded flex flex-col items-center min-w-[60px]">
                         <span className="text-red-400 font-bold text-xs">STR</span>
                         <span className="text-xl font-mono">{card.stats.str}</span>
                      </div>
                      <div className="bg-black/50 p-2 rounded flex flex-col items-center min-w-[60px]">
                         <span className="text-blue-400 font-bold text-xs">INT</span>
                         <span className="text-xl font-mono">{card.stats.int}</span>
                      </div>
                      <div className="bg-black/50 p-2 rounded flex flex-col items-center min-w-[60px]">
                         <span className="text-green-400 font-bold text-xs">AGI</span>
                         <span className="text-xl font-mono">{card.stats.agi}</span>
                      </div>
                   </div>
                   
                   <button 
                        onClick={() => {
                            setViewCardId(null);
                            soundService.playClick();
                        }} 
                        className="mt-8 text-xs uppercase font-bold text-gray-400 hover:text-white hover:scale-110 transition-transform"
                        onMouseEnter={() => soundService.playHover()}
                    >
                        Fechar
                    </button>
                </div>
             </div>
          </div>
        );
      })()}
    </div>
  );
};

export default Dashboard;