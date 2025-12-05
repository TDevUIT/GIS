/**
 * Translation mappings and localized strings
 * Provides consistent Vietnamese translations across the application
 */

/**
 * Day of week translation map (English to Vietnamese)
 * Used in: AccidentTimeAnalysis and other date-related analytics
 */
export const DAY_OF_WEEK_VI: Record<string, string> = {
  MONDAY: 'Thứ 2',
  TUESDAY: 'Thứ 3',
  WEDNESDAY: 'Thứ 4',
  THURSDAY: 'Thứ 5',
  FRIDAY: 'Thứ 6',
  SATURDAY: 'Thứ 7',
  SUNDAY: 'Chủ nhật',
};

/**
 * Helper function to translate day of week
 */
export function translateDayOfWeek(day: string): string {
  return DAY_OF_WEEK_VI[day.toUpperCase()] || day;
}
