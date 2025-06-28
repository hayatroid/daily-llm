/**
 * Navigation utilities for date-based navigation
 */
import type { NavigationContext } from './types';
import { isConversationFile, extractDateFromPath } from './filesystem';

/**
 * Generate navigation context for date-based navigation
 */
export function generateNavigationContext(
  allContent: any[],
  currentDate: string
): NavigationContext {
  const availableDates = extractUniqueDates(allContent).sort();
  const currentIndex = availableDates.indexOf(currentDate);

  return {
    availableDates,
    previousDate: currentIndex > 0 ? availableDates[currentIndex - 1] : null,
    nextDate:
      currentIndex < availableDates.length - 1
        ? availableDates[currentIndex + 1]
        : null,
    totalDates: availableDates.length,
    currentPosition: currentIndex + 1,
    isFirstDate: currentIndex === 0,
    isLastDate: currentIndex === availableDates.length - 1,
  };
}

/**
 * Extract unique dates from all content files
 */
export function extractUniqueDates(allContent: any[]): string[] {
  const dates = new Set<string>();

  allContent.forEach((file) => {
    if (isConversationFile(file.file)) {
      const date = extractDateFromPath(file.file);
      if (date && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dates.add(date);
      }
    }
  });

  return Array.from(dates).sort();
}
