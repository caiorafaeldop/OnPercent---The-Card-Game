import { Achievement, Habit, JournalEntry, UserState } from '../types';

export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 5000, 10000];

export const calculateLevel = (xp: number): number => {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
    } else {
      break;
    }
  }
  return level;
};

export const XP_REWARDS = {
  HABIT_COMPLETE: 10,
  JOURNAL_ENTRY: 15,
  PERFECT_DAY_BONUS: 50,
};

export const ACHIEVEMENTS_LIST: Achievement[] = [
  {
    id: 'first_step',
    title: 'O Início',
    description: 'Complete seu primeiro hábito.',
    icon: '🚀',
    unlocked: false,
    condition: (_, habits) => habits.some(h => h.completedDates.length > 0)
  },
  {
    id: 'streak_3',
    title: 'Consistência',
    description: 'Mantenha um hábito por 3 dias seguidos.',
    icon: '🔥',
    unlocked: false,
    condition: (_, habits) => {
      // Simple check for 3 consecutive days in any habit
      return habits.some(h => {
        if (h.completedDates.length < 3) return false;
        const sorted = [...h.completedDates].sort();
        let streak = 1;
        for (let i = 1; i < sorted.length; i++) {
          const prev = new Date(sorted[i-1]);
          const curr = new Date(sorted[i]);
          const diffTime = Math.abs(curr.getTime() - prev.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          if (diffDays === 1) streak++;
          else streak = 1;
          if (streak >= 3) return true;
        }
        return false;
      });
    }
  },
  {
    id: 'journal_master',
    title: 'Estoico',
    description: 'Faça 5 registros no diário.',
    icon: '📖',
    unlocked: false,
    condition: (_, __, journal) => journal.length >= 5
  },
  {
    id: 'club_1_percent',
    title: 'Club 1%',
    description: 'Atinja o nível 5.',
    icon: '💎',
    unlocked: false,
    condition: (user) => user.level >= 5
  }
];

export const checkAchievements = (user: UserState, habits: Habit[], journal: JournalEntry[]): string[] => {
  const unlockedIds: string[] = [];
  ACHIEVEMENTS_LIST.forEach(achievement => {
    if (achievement.condition(user, habits, journal)) {
      unlockedIds.push(achievement.id);
    }
  });
  return unlockedIds;
};