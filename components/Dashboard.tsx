import React, { useState } from 'react';
import { Habit } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface DashboardProps {
  habits: Habit[];
  xp: number;
  level: number;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, xp, level }) => {
  const [selectedHabitId, setSelectedHabitId] = useState<string>('all');

  const filteredHabits = selectedHabitId === 'all' 
    ? habits 
    : habits.filter(h => h.id === selectedHabitId);

  // Calculate completion data for the last 30 days
  const getCompletionData = () => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      
      let count = 0;
      let total = 0;

      filteredHabits.forEach(h => {
        total++;
        if (h.completedDates.includes(dateKey)) count++;
      });
      
      // If a specific habit is selected, count is 0 or 1. If all, it's the sum.
      data.push({
        date: dateKey,
        day: d.getDate(),
        count: count,
        total: total
      });
    }
    return data;
  };

  const chartData = getCompletionData();

  // Calendar Heatmap Logic
  const generateCalendarDays = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const days = [];
    // Padding for start
    for (let i = 0; i < startOfMonth.getDay(); i++) {
      days.push(null);
    }
    // Days
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), i);
      const dateKey = d.toISOString().split('T')[0];
      
      let completionRate = 0;
      
      if (filteredHabits.length > 0) {
        const completedCount = filteredHabits.filter(h => h.completedDates.includes(dateKey)).length;
        // If single habit selected, rate is 0 or 1. If all, rate is percentage.
        completionRate = completedCount / filteredHabits.length;
      }
      
      days.push({ day: i, dateKey, completionRate });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();
  const currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col h-full space-y-8 pb-20 overflow-y-auto no-scrollbar">
       <header className="flex flex-col space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter uppercase mb-1">Dashboard</h2>
          <p className="text-sm opacity-60">Sua jornada para o 1%</p>
        </div>
        
        {/* Habit Filter */}
        <select 
          value={selectedHabitId}
          onChange={(e) => setSelectedHabitId(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-100 dark:bg-gray-900 border-r-8 border-transparent focus:outline-none font-bold text-sm"
        >
          <option value="all">Todos os Hábitos</option>
          {habits.map(h => (
            <option key={h.id} value={h.id}>{h.title}</option>
          ))}
        </select>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <span className="text-xs font-bold uppercase tracking-wider opacity-50">Nível Atual</span>
          <div className="text-4xl font-black mt-2">{level}</div>
        </div>
        <div className="p-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black">
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">Total XP</span>
          <div className="text-4xl font-black mt-2 text-transparent bg-clip-text bg-gradient-to-tr from-white to-gray-400 dark:from-black dark:to-gray-600">
            {xp}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
        <h3 className="text-xs font-bold uppercase mb-4 opacity-50">Consistência (30 dias)</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData}>
            <XAxis dataKey="day" hide />
            <Tooltip 
              cursor={{fill: 'transparent'}}
              contentStyle={{ borderRadius: '8px', border: 'none', background: '#000', color: '#fff' }}
            />
            <Bar dataKey="count" fill="currentColor" className="text-black dark:text-white" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Calendar Heatmap */}
      <div>
        <h3 className="text-xs font-bold uppercase mb-4 opacity-50 capitalize">{currentMonthName}</h3>
        <div className="grid grid-cols-7 gap-2 text-center">
           {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
             <span key={d} className="text-xs font-bold opacity-30">{d}</span>
           ))}
           {calendarDays.map((d, i) => (
             <div key={i} className="aspect-square flex items-center justify-center relative">
               {d ? (
                 <div 
                  className="w-full h-full rounded-lg flex items-center justify-center text-xs font-medium transition-all"
                  style={{
                    backgroundColor: d.completionRate > 0 
                      ? `rgba(var(--foreground-rgb), ${0.1 + (d.completionRate * 0.9)})`
                      : 'transparent',
                    color: d.completionRate > 0.5 ? 'var(--bg-color)' : 'inherit',
                    border: d.completionRate === 0 ? '1px solid rgba(128,128,128, 0.1)' : 'none'
                  }}
                 >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center transition-colors
                      ${d.completionRate === 1 ? 'bg-black text-white dark:bg-white dark:text-black' : ''}
                      ${d.completionRate > 0 && d.completionRate < 1 ? 'bg-gray-300 dark:bg-gray-700' : ''}
                      ${d.completionRate === 0 ? 'bg-gray-50 dark:bg-gray-900 text-gray-400' : ''}
                    `}>
                      {d.day}
                    </div>
                 </div>
               ) : <div />}
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;