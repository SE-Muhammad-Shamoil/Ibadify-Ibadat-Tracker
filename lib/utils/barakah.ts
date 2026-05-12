/**
 * Barakah Score Logic
 * This is a private metric that affects the UI background tint.
 * It's calculated based on prayer consistency, Quran reading, and Zikr.
 */

export interface BarakahFactors {
  prayersCompleted: number; // 0-5
  sunnahCompleted: number; // 0-10+
  quranPages: number;
  zikrCompleted: boolean;
  nightlyReviewDone: boolean;
}

export function calculateBarakahScore(factors: BarakahFactors): number {
  let score = 0;
  
  // Base prayers: 10 points each
  score += factors.prayersCompleted * 10;
  
  // Sunnah/Nafl: 2 points each
  score += factors.sunnahCompleted * 2;
  
  // Quran: 5 points per page (max 50)
  score += Math.min(factors.quranPages * 5, 50);
  
  // Zikr: 15 points
  if (factors.zikrCompleted) score += 15;
  
  // Nightly Review: 20 points
  if (factors.nightlyReviewDone) score += 20;
  
  return score; // Max around 200
}

/**
 * Maps a score (0-200) to a background color tint.
 * 0 (Low Barakah) -> Cooler, more neutral (#F5F5F5)
 * 200 (High Barakah) -> Warmer, more cream (#FAF8F5 / #FFFBF0)
 */
export function getBarakahTint(score: number): string {
  const normalized = Math.min(score / 200, 1);
  
  // Interpolating between a neutral grey-cream and a warm spiritual cream
  // Neutral: hsl(30, 10%, 97%)
  // Warm: hsl(40, 30%, 97%)
  
  const saturation = 10 + (normalized * 20);
  const hue = 30 + (normalized * 10);
  
  return `hsl(${hue}, ${saturation}%, 97%)`;
}
