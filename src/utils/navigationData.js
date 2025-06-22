import { isConversationFile, extractDateFromFile } from './slugUtils.js';

/**
 * Generate navigation context for date-based navigation
 * @param {Array} allContent - Array of all content files from Astro.glob
 * @param {string} currentDate - Current date being viewed
 * @returns {Object} Navigation context with available dates and navigation info
 */
export function generateNavigationContext(allContent, currentDate) {
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
 * @param {Array} allContent - Array of all content files
 * @returns {Array} Sorted array of unique dates
 */
export function extractUniqueDates(allContent) {
  const dates = new Set();

  allContent.forEach((file) => {
    if (isConversationFile(file.file)) {
      const date = extractDateFromFile(file.file);
      if (date && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dates.add(date);
      }
    }
  });

  return Array.from(dates).sort();
}

/**
 * Generate breadcrumb items for navigation
 * @param {string} currentDate - Current date
 * @param {string} conversationSlug - Current conversation slug (optional)
 * @param {string} conversationTitle - Current conversation title (optional)
 * @returns {Array} Breadcrumb items array
 */
export function generateBreadcrumbs(
  currentDate,
  conversationSlug = null,
  conversationTitle = null
) {
  const breadcrumbs = [{ href: '/', label: 'Home', icon: '🏠' }];

  if (currentDate) {
    breadcrumbs.push({
      href: `/${currentDate}/`,
      label: currentDate,
      icon: '📅',
      current: !conversationSlug,
    });
  }

  if (conversationSlug && conversationTitle) {
    breadcrumbs.push({
      label: conversationSlug,
      icon: '🤖',
      current: true,
    });
  }

  return breadcrumbs;
}
