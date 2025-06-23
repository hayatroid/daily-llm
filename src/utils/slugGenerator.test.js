import {
  generateSlug,
  generateUniqueSlug,
  processHeadingSlugs,
} from './slugGenerator.js';

/**
 * Simple test runner for slug generation
 * Tests are designed to work in browser environment without external dependencies
 */

// Test cases for generateSlug function
const testCases = [
  // Basic cases
  { input: 'Hello World', expected: 'hello-world' },
  { input: 'React Hooks', expected: 'react-hooks' },

  // Japanese text
  { input: 'APIの設計', expected: 'apiの設計' },
  { input: 'Docker コンテナ', expected: 'docker-コンテナ' },

  // Special characters
  { input: 'React Hooks (useState)', expected: 'react-hooks-usestate' },
  { input: '🎯 Goals & Objectives!', expected: 'goals-objectives' },
  { input: 'CSS: Variables & Design', expected: 'css-variables-design' },

  // Markdown syntax
  { input: '## Heading 2', expected: 'heading-2' },
  { input: '### Sub Heading', expected: 'sub-heading' },

  // Edge cases
  { input: '', expected: 'heading' },
  { input: '   ', expected: 'heading' },
  { input: '###', expected: 'heading' },
  { input: '!@#$%^&*()', expected: 'heading' },

  // Length limits
  {
    input:
      'This is a very long heading that should be truncated to maintain reasonable URL length and usability',
    expected: 'this-is-a-very-long-heading-that-should-be-tru',
  },

  // Multiple spaces and hyphens
  { input: 'Multiple   Spaces', expected: 'multiple-spaces' },
  {
    input: 'Leading-and-trailing-hyphens---',
    expected: 'leading-and-trailing-hyphens',
  },
];

/**
 * Run tests for generateSlug function
 */
function testGenerateSlug() {
  console.log('🧪 Testing generateSlug function...');
  let passed = 0;
  let failed = 0;

  testCases.forEach(({ input, expected }, index) => {
    const result = generateSlug(input);
    const success = result === expected;

    if (success) {
      passed++;
      console.log(`✅ Test ${index + 1}: "${input}" → "${result}"`);
    } else {
      failed++;
      console.error(`❌ Test ${index + 1}: "${input}"`);
      console.error(`   Expected: "${expected}"`);
      console.error(`   Got:      "${result}"`);
    }
  });

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

/**
 * Test generateUniqueSlug function
 */
function testGenerateUniqueSlug() {
  console.log('\n🧪 Testing generateUniqueSlug function...');

  const existingSlugs = new Set(['hello-world', 'hello-world-1', 'test']);

  const tests = [
    { baseSlug: 'new-slug', expected: 'new-slug' },
    { baseSlug: 'hello-world', expected: 'hello-world-2' },
    { baseSlug: 'test', expected: 'test-1' },
  ];

  let passed = 0;
  let failed = 0;

  tests.forEach(({ baseSlug, expected }, index) => {
    const result = generateUniqueSlug(baseSlug, existingSlugs);
    const success = result === expected;

    if (success) {
      passed++;
      console.log(`✅ Unique test ${index + 1}: "${baseSlug}" → "${result}"`);
    } else {
      failed++;
      console.error(`❌ Unique test ${index + 1}: "${baseSlug}"`);
      console.error(`   Expected: "${expected}"`);
      console.error(`   Got:      "${result}"`);
    }
  });

  console.log(`📊 Unique slug results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

/**
 * Run all tests
 */
export function runTests() {
  console.log('🚀 Starting slug generator tests...\n');

  const slugTests = testGenerateSlug();
  const uniqueTests = testGenerateUniqueSlug();

  const allPassed = slugTests && uniqueTests;

  console.log(
    `\n${allPassed ? '🎉' : '💥'} All tests ${allPassed ? 'PASSED' : 'FAILED'}!`
  );

  return allPassed;
}

// Auto-run tests if this file is executed directly
if (
  typeof window !== 'undefined' &&
  window.location.search.includes('test=slug')
) {
  runTests();
}
