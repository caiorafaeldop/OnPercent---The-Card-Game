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
  HABIT_EASY: 10,
  HABIT_MEDIUM: 35,
  HABIT_HARD: 80,
  JOURNAL_ENTRY: 15,
  PERFECT_DAY_BONUS: 50,
};

export const CREDITS_REWARDS = {
  EASY: 20,
  MEDIUM: 40,
  HARD: 60,
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

// ... existing code ...
export const checkAchievements = (user: UserState, habits: Habit[], journal: JournalEntry[]): string[] => {
  const unlockedIds: string[] = [];
  ACHIEVEMENTS_LIST.forEach(achievement => {
    if (achievement.condition(user, habits, journal)) {
      unlockedIds.push(achievement.id);
    }
  });
  return unlockedIds;
};

export const calculateCurrentStreak = (completedDates: string[]): number => {
    if (!completedDates || completedDates.length === 0) return 0;
    
    // Sort dates descending (newest first)
    const sorted = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Get today and yesterday strings (YYYY-MM-DD)
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let streak = 0;
    let checkDate = new Date();
    
    // Check if streak is active (completed today or yesterday)
    // If last completion was older than yesterday, streak is broken (0) unless we want to be lenient
    // For "Current Streak", usually if you missed yesterday, it's 0.
    // However, if you completed today, it counts.
    
    const hasToday = sorted.includes(todayStr);
    const hasYesterday = sorted.includes(yesterdayStr);
    
    if (!hasToday && !hasYesterday) return 0;

    // Start checking from today backwards
    // We construct the "expected" date each iteration
    let currentCheck = new Date(); // Start today
    
    // If user hasn't done today yet, but did yesterday, streak is alive but count starts from yesterday?
    // Actually simpler: iterate sorted dates and check continuity.
    
    // Let's use the robust method:
    // 1. Normalize all dates to YYYY-MM-DD
    // 2. Filter unique
    // 3. Sort DESC
    
    const uniqueDates = Array.from(new Set(completedDates)).sort().reverse(); // Newest first
    if (uniqueDates.length === 0) return 0;

    const lastCompletion = new Date(uniqueDates[0]);
    const diffToToday = Math.floor((today.getTime() - lastCompletion.getTime()) / (1000 * 3600 * 24));
    
    // If gap is > 1 day (e.g. today is Fri, last was Wed. diff=2), streak broken.
    // Assuming today hasn't ended, if last was yesterday (diff=1), streak alive.
    // If last was today (diff=0), streak alive.
    if (diffToToday > 1) return 0; 
    
    streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const d1 = new Date(uniqueDates[i]);
        const d2 = new Date(uniqueDates[i+1]);
        const diff = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 3600 * 24));
        
        if (diff === 1) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
};

export const calculateBestStreak = (completedDates: string[]): number => {
    if (!completedDates || completedDates.length === 0) return 0;
    const sorted = Array.from(new Set(completedDates)).sort(); // Oldest first
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < sorted.length; i++) {
        const d1 = new Date(sorted[i-1]);
        const d2 = new Date(sorted[i]);
        const diff = Math.floor((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
        
        if (diff === 1) {
            currentStreak++;
        } else {
            currentStreak = 1;
        }
        if (currentStreak > maxStreak) maxStreak = currentStreak;
    }
    return maxStreak;
};