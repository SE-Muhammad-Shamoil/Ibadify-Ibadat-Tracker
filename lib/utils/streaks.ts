/**
 * Streak Engine Logic
 * Handles streak increments, grace days, and history.
 */

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string; // YYYY-MM-DD
  streakType: 'fard_only' | 'sunnah_included';
  graceUsedToday: boolean;
  streakHistory: Record<string, boolean>; // date -> completed
}

export function calculateNewStreak(
  currentData: StreakData,
  todayStr: string,
  isTodayPerfect: boolean,
  isGraceEnabled: boolean
): StreakData {
  const newData = { ...currentData };
  
  // If already logged today, don't re-increment currentStreak
  if (newData.lastLogDate === todayStr) {
    newData.streakHistory[todayStr] = isTodayPerfect;
    return newData;
  }

  // Check if yesterday was perfect or today is the first log
  const yesterday = new Date(todayStr);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const wasYesterdayLogged = newData.lastLogDate === yesterdayStr;

  if (isTodayPerfect) {
    if (wasYesterdayLogged) {
      newData.currentStreak += 1;
    } else {
      // Streak broken but restarted today
      newData.currentStreak = 1;
    }
    newData.lastLogDate = todayStr;
  } else if (isGraceEnabled && !newData.graceUsedToday) {
    // Apply grace (don't break streak, but don't increment)
    newData.graceUsedToday = true;
    newData.lastLogDate = todayStr;
  } else {
    // Streak broken
    newData.currentStreak = 0;
    newData.lastLogDate = todayStr;
    newData.graceUsedToday = false;
  }

  if (newData.currentStreak > newData.longestStreak) {
    newData.longestStreak = newData.currentStreak;
  }

  newData.streakHistory[todayStr] = isTodayPerfect;
  
  return newData;
}
