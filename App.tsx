import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HabitList from './components/HabitList';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import Profile from './components/Profile';
import DailyBonus from './components/DailyBonus';
import { Habit, JournalEntry, UserState, Tab } from './types';
import * as Storage from './services/storage';
import * as Gamification from './services/gamification';
import { GACHA_COST } from './services/gacha';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('habits');
  // Lazy initialization to retrieve the theme from localStorage immediately
  const [isDark, setIsDark] = useState<boolean>(() => Storage.loadTheme());
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [user, setUser] = useState<UserState>({ xp: 0, level: 1, name: 'User', credits: 0, inventory: [], mealHistory: {} });
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showRestoreInput, setShowRestoreInput] = useState(false);
  const [restoreJson, setRestoreJson] = useState('');

  // Initialization
  useEffect(() => {
    setHabits(Storage.loadHabits());
    setJournal(Storage.loadJournal());
    const loadedUser = Storage.loadUser();

    // Check for daily reset of meals
    const today = new Date().toDateString();
    if (loadedUser.lastMealDate !== today) {
        loadedUser.mealsToday = 0;
        loadedUser.lastMealDate = today;
        Storage.saveUser(loadedUser); // Save reset state
    }

    setUser(loadedUser);
    
    // Check initial achievements
    const initialHabits = Storage.loadHabits();
    const initialJournal = Storage.loadJournal();
    const unlocked = Gamification.checkAchievements(loadedUser, initialHabits, initialJournal);
    setUnlockedAchievements(unlocked);
  }, []);

  // Theme Handling
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    Storage.saveTheme(isDark);
  }, [isDark]);

  // Gamification & Persistence Loop
  useEffect(() => {
    Storage.saveHabits(habits);
    Storage.saveJournal(journal);
    Storage.saveUser(user);

    const unlocked = Gamification.checkAchievements(user, habits, journal);
    if (unlocked.length > unlockedAchievements.length) {
      // New achievement unlocked!
      setUnlockedAchievements(unlocked);
      console.log("Achievement Unlocked!");
    }
  }, [habits, journal, user, unlockedAchievements]);

  const addHabit = (title: string, difficulty: 'easy' | 'medium' | 'hard') => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
      difficulty,
      createdAt: new Date().toISOString(),
      completedDates: []
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const toggleHabit = (habitId: string, date: string) => {
    setHabits(prevHabits => {
      const updated = prevHabits.map(h => {
        if (h.id !== habitId) return h;
        
        const isCompleted = h.completedDates.includes(date);
        let newCompletedDates;
        
        const difficultyKey = `HABIT_${(h.difficulty || 'medium').toUpperCase()}` as keyof typeof Gamification.XP_REWARDS;
        const xpReward = Gamification.XP_REWARDS[difficultyKey] || 35; // Default to Medium (35)
        const creditReward = Gamification.CREDITS_REWARDS[(h.difficulty || 'medium').toUpperCase() as keyof typeof Gamification.CREDITS_REWARDS] || 40; // Default to Medium (40)

        if (isCompleted) {
          // Remove date (Undo)
          newCompletedDates = h.completedDates.filter(d => d !== date);
          setUser(prev => ({
            ...prev,
            xp: Math.max(0, prev.xp - xpReward),
            credits: Math.max(0, prev.credits - creditReward), // Now removing specific amount
            level: Gamification.calculateLevel(Math.max(0, prev.xp - xpReward))
          }));
        } else {
          // Add date (Complete)
          newCompletedDates = [...h.completedDates, date];
          setUser(prev => ({
            ...prev,
            xp: prev.xp + xpReward,
            credits: prev.credits + creditReward,
            level: Gamification.calculateLevel(prev.xp + xpReward)
          }));
        }
        return { ...h, completedDates: newCompletedDates };
      });
      return updated;
    });
  };

  const saveJournalEntry = (entry: JournalEntry, claimReward?: boolean) => {
    const today = new Date().toLocaleDateString('en-CA');
    const isToday = entry.date === today;

    const exists = journal.find(e => e.id === entry.id);
    if (!exists) {
        let earnedCredits = 0;
        let earnedXp = 0;

        // Only award base XP if it's a new entry for TODAY
        if (isToday) {
            earnedXp = Gamification.XP_REWARDS.JOURNAL_ENTRY;
            if (claimReward) earnedCredits = 100;
        }

        setUser(prev => ({
            ...prev,
            xp: prev.xp + earnedXp,
            credits: prev.credits + earnedCredits, 
            level: Gamification.calculateLevel(prev.xp + earnedXp)
        }));
        setJournal([...journal, entry]);
    } else {
        // Update existing entry
        if (isToday && claimReward) {
            setUser(prev => ({
                ...prev,
                credits: prev.credits + 100
            }));
        }
        setJournal(journal.map(e => e.id === entry.id ? entry : e));
    }
  };

  const handleAddCredits = (amount: number) => {
    setUser(prev => ({ ...prev, credits: prev.credits + amount }));
  };

  const handlePullGacha = (newItemId: string) => {
    setUser(prev => ({
      ...prev,
      credits: prev.credits - GACHA_COST,
      inventory: prev.inventory.includes(newItemId) ? prev.inventory : [...prev.inventory, newItemId]
    }));
  };

  const handleRecordMeal = () => {
      const today = new Date().toDateString();
      const todayISO = new Date().toLocaleDateString('en-CA');

      if ((user.mealsToday || 0) < 5) {
          setUser(prev => ({
              ...prev,
              credits: prev.credits + 20,
              mealsToday: (prev.mealsToday || 0) + 1,
              lastMealDate: today,
              mealHistory: {
                  ...(prev.mealHistory || {}),
                  [todayISO]: ((prev.mealsToday || 0) + 1)
              }
          }));
          // Play sounds
          import('./services/audio').then(({ soundService }) => {
              soundService.playClick();
              if ((user.mealsToday || 0) + 1 === 5) {
                  soundService.playSuccess();
              }
          });
      }
  };

  const handleUpdateMeal = (date: string, count: number) => {
      // date is YYYY-MM-DD
      const todayISO = new Date().toLocaleDateString('en-CA');
      const isToday = date === todayISO;

      setUser(prev => {
          const diff = count - (prev.mealHistory?.[date] || 0);
          
          let newCredits = prev.credits;
          let newMealsToday = prev.mealsToday;

          if (isToday) {
             newCredits = prev.credits + (diff * 20);
             newMealsToday = count;
          }

          return {
              ...prev,
              credits: Math.max(0, newCredits),
              mealsToday: isToday ? count : newMealsToday,
              mealHistory: {
                  ...(prev.mealHistory || {}),
                  [date]: count
              }
          };
      });
  };

  // --- Settings Handlers ---
  const handleBackup = () => {
      const data = Storage.exportData();
      navigator.clipboard.writeText(data).then(() => {
          alert("Backup copiado para a área de transferência!");
      });
  };

  const handleResetApp = () => {
      const data = Storage.exportData();
      navigator.clipboard.writeText(data).then(() => {
          localStorage.clear();
          window.location.reload();
      });
  };

  const handleRestore = () => {
      if (!restoreJson.trim()) return;
      const success = Storage.importData(restoreJson);
      if (success) {
          alert("Progresso restaurado com sucesso!");
          window.location.reload();
      } else {
          alert("Erro ao ler os dados. Verifique o JSON.");
      }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'habits':
        return <HabitList habits={habits} onAdd={addHabit} onToggle={toggleHabit} onDelete={deleteHabit} />;
      case 'dashboard':
        return (
          <Dashboard 
            user={user}
            habits={habits} 
            onToggle={toggleHabit} 
            onRecordMeal={handleRecordMeal}
            onUpdateMeal={handleUpdateMeal}
          />
        );
      case 'journal':
        return <Journal entries={journal} onSave={saveJournalEntry} />;
      case 'profile':
        return (
          <Profile 
            user={user} 
            unlockedAchievements={unlockedAchievements} 
            onAddCredits={handleAddCredits}
            onPullGacha={handlePullGacha}
          />
        );
      default:
        return <HabitList habits={habits} onAdd={addHabit} onToggle={toggleHabit} onDelete={deleteHabit} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      isDark={isDark}
      toggleTheme={() => setIsDark(!isDark)}
      onOpenSettings={() => setShowSettings(true)}
    >
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        <DailyBonus onAddCredits={handleAddCredits} />
        <div className="flex-1 min-h-0 overflow-hidden relative">
            {renderContent()}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowSettings(false)}>
              <div className="bg-white dark:bg-gray-900 w-full max-w-xs rounded-3xl p-6 shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
                  <h3 className="text-xl font-black uppercase text-center mb-6">Configurações</h3>
                  
                  <div className="space-y-3">
                      <button onClick={handleBackup} className="w-full py-4 rounded-xl bg-gray-100 dark:bg-gray-800 font-bold uppercase text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                          Forçar Backup Manual
                      </button>
                      
                      <button onClick={() => setShowRestoreInput(true)} className="w-full py-4 rounded-xl border-2 border-blue-500/20 text-blue-500 font-bold uppercase text-xs hover:bg-blue-500 hover:text-white transition-colors">
                          Restaurar Progresso
                      </button>

                      <button onClick={() => setShowResetConfirm(true)} className="w-full py-4 rounded-xl border-2 border-red-500/20 text-red-500 font-bold uppercase text-xs hover:bg-red-500 hover:text-white transition-colors">
                          Resetar App
                      </button>
                  </div>

                  <button onClick={() => setShowSettings(false)} className="mt-6 w-full py-2 text-xs font-bold text-gray-400 uppercase">
                      Fechar
                  </button>
              </div>
          </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl max-w-xs w-full text-center space-y-6 shadow-2xl border border-red-500/30">
                  <div>
                    <h3 className="text-xl font-black uppercase text-red-500 mb-2">Perigo!</h3>
                    <p className="text-sm opacity-70">Você tem certeza que deseja RESETAR tudo?</p>
                    <p className="text-xs mt-2 text-gray-400 font-bold">(Seus dados serão copiados antes de apagar)</p>
                  </div>
                  <div className="flex gap-2 font-bold justify-center">
                      <button onClick={() => setShowResetConfirm(false)} className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200">Cancelar</button>
                      <button onClick={handleResetApp} className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30">SIM</button>
                  </div>
              </div>
          </div>
      )}

      {/* Restore Progress Modal */}
      {showRestoreInput && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl border border-blue-500/30">
                  <h3 className="text-lg font-black uppercase text-blue-500 text-center">Restaurar Backup</h3>
                  <textarea 
                    value={restoreJson}
                    onChange={e => setRestoreJson(e.target.value)}
                    placeholder="Cole o JSON aqui..."
                    className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-xl p-3 text-xs font-mono focus:outline-none border-2 border-transparent focus:border-blue-500 resize-none"
                  />
                  <div className="flex gap-2 font-bold justify-center">
                      <button onClick={() => setShowRestoreInput(false)} className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs uppercase">Cancelar</button>
                      <button onClick={handleRestore} className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30 text-xs uppercase">Restaurar</button>
                  </div>
              </div>
          </div>
      )}

    </Layout>
  );
};

export default App;