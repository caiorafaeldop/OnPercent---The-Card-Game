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
  const [user, setUser] = useState<UserState>({ xp: 0, level: 1, name: 'User', credits: 0, inventory: [] });
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

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
    // Theme is already loaded via lazy initialization, so we don't need to set it here
    
    // Check initial achievements
    const initialHabits = Storage.loadHabits();
    const initialJournal = Storage.loadJournal();
    // Use the potentially reset user data
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
        // If updating TODAY's entry triggers a reward (e.g. was short, now long enough and not claimed today)
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
      if ((user.mealsToday || 0) < 5) {
          setUser(prev => ({
              ...prev,
              credits: prev.credits + 20,
              mealsToday: (prev.mealsToday || 0) + 1,
              lastMealDate: today
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

  const renderContent = () => {
    switch (activeTab) {
      case 'habits':
        return <HabitList habits={habits} onAdd={addHabit} onToggle={toggleHabit} onDelete={deleteHabit} />;
      case 'dashboard':
        return <Dashboard habits={habits} xp={user.xp} level={user.level} inventory={user.inventory} onToggle={toggleHabit} />;
      case 'journal':
        return <Journal entries={journal} onSave={saveJournalEntry} />;
      case 'profile':
        return <Profile 
          user={user} 
          unlockedAchievements={unlockedAchievements} 
          onAddCredits={handleAddCredits}
          onPullGacha={handlePullGacha}
          onRecordMeal={handleRecordMeal}
        />;
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
    >
      <div className="w-full max-w-md mx-auto h-full flex flex-col">
        <DailyBonus onAddCredits={handleAddCredits} />
        <div className="flex-1 min-h-0 overflow-hidden relative">
            {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default App;