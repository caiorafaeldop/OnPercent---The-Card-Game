import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HabitList from './components/HabitList';
import Dashboard from './components/Dashboard';
import Journal from './components/Journal';
import Profile from './components/Profile';
import { Habit, JournalEntry, UserState, Tab } from './types';
import * as Storage from './services/storage';
import * as Gamification from './services/gamification';
import { GACHA_COST } from './services/gacha';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('habits');
  const [isDark, setIsDark] = useState<boolean>(false);
  
  const [habits, setHabits] = useState<Habit[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [user, setUser] = useState<UserState>({ xp: 0, level: 1, name: 'User', credits: 0, inventory: [] });
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);

  // Initialization
  useEffect(() => {
    setHabits(Storage.loadHabits());
    setJournal(Storage.loadJournal());
    setUser(Storage.loadUser());
    setIsDark(Storage.loadTheme());
    
    // Check initial achievements
    const initialHabits = Storage.loadHabits();
    const initialJournal = Storage.loadJournal();
    const initialUser = Storage.loadUser();
    const unlocked = Gamification.checkAchievements(initialUser, initialHabits, initialJournal);
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

  const addHabit = (title: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      title,
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
        
        if (isCompleted) {
          // Remove date (Undo) -> Remove Credit if possible? 
          // For simplicity, we don't punish credits on undo to avoid negative feeling, 
          // or we can remove 100 credits. Let's keep it positive only for now, or strict.
          // Let's go strict: Remove 100 credits if they have them.
          newCompletedDates = h.completedDates.filter(d => d !== date);
          setUser(prev => ({
            ...prev,
            xp: Math.max(0, prev.xp - Gamification.XP_REWARDS.HABIT_COMPLETE),
            credits: Math.max(0, prev.credits - GACHA_COST), 
            level: Gamification.calculateLevel(Math.max(0, prev.xp - Gamification.XP_REWARDS.HABIT_COMPLETE))
          }));
        } else {
          // Add date (Complete) -> Add 100 Credits (1 Pull)
          newCompletedDates = [...h.completedDates, date];
          setUser(prev => ({
            ...prev,
            xp: prev.xp + Gamification.XP_REWARDS.HABIT_COMPLETE,
            credits: prev.credits + GACHA_COST,
            level: Gamification.calculateLevel(prev.xp + Gamification.XP_REWARDS.HABIT_COMPLETE)
          }));
        }
        return { ...h, completedDates: newCompletedDates };
      });
      return updated;
    });
  };

  const saveJournalEntry = (entry: JournalEntry) => {
    const exists = journal.find(e => e.id === entry.id);
    if (!exists) {
        setUser(prev => ({
            ...prev,
            xp: prev.xp + Gamification.XP_REWARDS.JOURNAL_ENTRY,
            credits: prev.credits + 50, // Bonus credits for journaling
            level: Gamification.calculateLevel(prev.xp + Gamification.XP_REWARDS.JOURNAL_ENTRY)
        }));
        setJournal([...journal, entry]);
    } else {
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

  const renderContent = () => {
    switch (activeTab) {
      case 'habits':
        return <HabitList habits={habits} onAdd={addHabit} onToggle={toggleHabit} onDelete={deleteHabit} />;
      case 'dashboard':
        return <Dashboard habits={habits} xp={user.xp} level={user.level} />;
      case 'journal':
        return <Journal entries={journal} onSave={saveJournalEntry} />;
      case 'profile':
        return <Profile 
          user={user} 
          unlockedAchievements={unlockedAchievements} 
          onAddCredits={handleAddCredits}
          onPullGacha={handlePullGacha}
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
      {renderContent()}
    </Layout>
  );
};

export default App;