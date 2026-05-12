/**
 * Returns today's date string in YYYY-MM-DD format for a given timezone.
 */
export function getTodayStringInTimezone(timezone: string): string {
  const now = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now); // en-CA gives YYYY-MM-DD
}

/**
 * Returns current date/time in the user's timezone as a Date object.
 */
export function getNowInTimezone(timezone: string): Date {
  const now = new Date();
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  return tzDate;
}
