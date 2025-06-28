/**
 * Content processing utilities for markdown conversations
 */
import type { FrontmatterData, ProcessedContent } from './types';

export function processConversation(markdown: string): ProcessedContent {
  const frontmatter = extractFrontmatter(markdown);
  const content = parseMarkdown(markdown);

  return {
    title: frontmatter.title,
    date: frontmatter.date,
    time: frontmatter.time,
    tags: frontmatter.tags || [],
    preview: extractPreview(content, 150), // 150 chars
    exchangeCount: countExchanges(content),
    hasCode: detectCodeBlocks(content),
    fullContent: content,
  };
}

export function extractFrontmatter(markdown: string): FrontmatterData {
  const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return { title: '', tags: [], description: '' };

  const frontmatter: Record<string, any> = {};
  const lines = frontmatterMatch[1].split('\n');

  lines.forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      const value = valueParts.join(':').trim();
      // Handle arrays (tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        try {
          // Replace single quotes with double quotes for valid JSON
          const jsonValue = value.replace(/'/g, '"');
          frontmatter[key.trim()] = JSON.parse(jsonValue);
        } catch (e) {
          // Fallback: treat as string if JSON parsing fails
          frontmatter[key.trim()] = value.replace(/^["'\[]|["'\]]$/g, '');
        }
      } else {
        // Remove quotes if present
        frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  });

  // Ensure required fields have defaults
  return {
    title: frontmatter.title || '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    description: frontmatter.description || '',
    ...frontmatter,
  } as FrontmatterData;
}

export function parseMarkdown(markdown: string): string {
  // Remove frontmatter
  const content = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  return content.trim();
}

export function extractPreview(
  content: string,
  maxLength: number = 150
): string {
  // Try different patterns for user content
  let userText = '';

  // Pattern 1: ## User followed by content
  const userPattern1 = content.match(
    /## User\s*\n\n(.*?)(?=\n\n## Assistant|\n\n##|\Z)/s
  );
  if (userPattern1) {
    userText = userPattern1[1].trim();
  } else {
    // Pattern 2: User: followed by content
    const userPattern2 = content.match(
      /User:\s*\n?(.*?)(?=\n\nAssistant:|\n\n##|\Z)/s
    );
    if (userPattern2) {
      userText = userPattern2[1].trim();
    } else {
      // Fallback: Get first paragraph after any header
      const fallbackPattern = content.match(/(?:##.*?\n\n|^)(.*?)(?=\n\n|\Z)/s);
      if (fallbackPattern) {
        userText = fallbackPattern[1].trim();
      }
    }
  }

  if (userText) {
    // Remove markdown formatting for preview
    const cleanText = userText
      .replace(/```[\s\S]*?```/g, '[code block]')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
      .replace(/#+\s*/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength).trim() + '...'
      : cleanText;
  }

  // Last resort fallback
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '[code block]')
    .replace(/#+\s*/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  return cleanContent.substring(0, maxLength).trim() + '...';
}

export function countExchanges(content: string): number {
  // Count both "## User" and "User:" patterns
  const userMessages1 = (content.match(/## User/g) || []).length;
  const userMessages2 = (content.match(/^User:/gm) || []).length;
  const assistantMessages1 = (content.match(/## Assistant/g) || []).length;
  const assistantMessages2 = (content.match(/^Assistant:/gm) || []).length;

  const totalUsers = userMessages1 + userMessages2;
  const totalAssistants = assistantMessages1 + assistantMessages2;

  return totalUsers + totalAssistants;
}

export function detectCodeBlocks(content: string): boolean {
  return /```[\s\S]*?```/.test(content);
}
