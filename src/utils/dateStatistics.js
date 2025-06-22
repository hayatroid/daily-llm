import { processConversation } from './contentProcessor.js';
import { isConversationFile } from './slugUtils.js';

/**
 * Calculate comprehensive statistics for a specific date
 * @param {string} date - The date to calculate stats for (e.g., "2024-01-01")
 * @param {Array} allContent - Array of all content files from Astro.glob
 * @returns {Object} Statistics object with conversations, exchanges, topics, and code counts
 */
export function calculateDateStatistics(date, allContent) {
  // Filter conversations for this specific date (exclude summaries)
  const dateConversations = allContent.filter(
    (file) => file.file.includes(`/${date}/`) && isConversationFile(file.file)
  );

  let totalExchanges = 0;
  let topicTags = new Set();
  let hasCodeCount = 0;

  dateConversations.forEach((conv) => {
    if (conv.rawContent) {
      const processed = processConversation(conv.rawContent());
      totalExchanges += processed.exchangeCount;
      if (processed.hasCode) hasCodeCount++;

      // Collect tags
      if (conv.frontmatter.tags) {
        conv.frontmatter.tags.forEach((tag) => topicTags.add(tag));
      }
    }
  });

  return {
    conversations: dateConversations.length,
    totalExchanges,
    topicTags: Array.from(topicTags),
    topicCount: topicTags.size,
    hasCodeCount,
    codePercent:
      dateConversations.length > 0
        ? Math.round((hasCodeCount / dateConversations.length) * 100)
        : 0,
  };
}

/**
 * Calculate statistics for all conversations across all dates
 * @param {Array} allContent - Array of all content files from Astro.glob
 * @returns {Object} Global statistics object
 */
export function calculateGlobalStatistics(allContent) {
  const allConversations = allContent.filter((file) =>
    isConversationFile(file.file)
  );

  let totalExchanges = 0;
  let allTopicTags = new Set();
  let hasCodeCount = 0;
  let allDates = new Set();

  allConversations.forEach((conv) => {
    // Extract date from file path
    const pathParts = conv.file.split('/');
    const date = pathParts[pathParts.length - 2];
    if (date) allDates.add(date);

    if (conv.rawContent) {
      const processed = processConversation(conv.rawContent());
      totalExchanges += processed.exchangeCount;
      if (processed.hasCode) hasCodeCount++;

      // Collect tags
      if (conv.frontmatter.tags) {
        conv.frontmatter.tags.forEach((tag) => allTopicTags.add(tag));
      }
    }
  });

  return {
    totalConversations: allConversations.length,
    totalExchanges,
    totalDates: allDates.size,
    totalTopics: allTopicTags.size,
    hasCodeCount,
    codePercent:
      allConversations.length > 0
        ? Math.round((hasCodeCount / allConversations.length) * 100)
        : 0,
    avgConversationsPerDay:
      allDates.size > 0
        ? Math.round(allConversations.length / allDates.size)
        : 0,
    avgExchangesPerConversation:
      allConversations.length > 0
        ? Math.round(totalExchanges / allConversations.length)
        : 0,
  };
}
