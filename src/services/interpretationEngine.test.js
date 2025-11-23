/**
 * Tests for Interpretation Engine
 * Note: Full integration tests require AWS credentials and will make API calls.
 * These tests focus on validation and structure.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { generateSummary, rewriteText, analyzeText, generateEnding } from './interpretationEngine.js';
import cache from './interpretationCache.js';

describe('Interpretation Engine - Input Validation', () => {
  beforeEach(() => {
    // Clear cache before each test
    cache.clear();
  });

  it('should throw error for empty text in generateSummary', async () => {
    await expect(generateSummary('', 'poe')).rejects.toThrow('Text is required');
  });

  it('should throw error for invalid spirit in generateSummary', async () => {
    await expect(generateSummary('Some text', 'invalid-spirit')).rejects.toThrow('Spirit not found');
  });

  it('should throw error for empty text in rewriteText', async () => {
    await expect(rewriteText('', 'poe')).rejects.toThrow('Text is required');
  });

  it('should throw error for invalid spirit in rewriteText', async () => {
    await expect(rewriteText('Some text', 'invalid-spirit')).rejects.toThrow('Spirit not found');
  });

  it('should throw error for empty text in analyzeText', async () => {
    await expect(analyzeText('', 'poe')).rejects.toThrow('Text is required');
  });

  it('should throw error for invalid spirit in analyzeText', async () => {
    await expect(analyzeText('Some text', 'invalid-spirit')).rejects.toThrow('Spirit not found');
  });

  it('should throw error for empty text in generateEnding', async () => {
    await expect(generateEnding('', ['poe'])).rejects.toThrow('Text is required');
  });

  it('should throw error for empty spiritIds array in generateEnding', async () => {
    await expect(generateEnding('Some text', [])).rejects.toThrow('spiritIds must be a non-empty array');
  });

  it('should throw error for invalid spirit in generateEnding', async () => {
    await expect(generateEnding('Some text', ['invalid-spirit'])).rejects.toThrow('Spirit not found');
  });
});

describe('Interpretation Engine - Cache Integration', () => {
  beforeEach(() => {
    cache.clear();
  });

  it('should use cache when available', () => {
    const text = 'Test text';
    const spiritId = 'poe';
    const mockInterpretation = {
      spiritId,
      spiritName: 'Edgar Allan Poe',
      type: 'summary',
      content: 'Cached content',
      generatedAt: new Date(),
      wordCount: 2,
      originalWordCount: 2
    };

    // Manually set cache
    cache.set(text, spiritId, 'summary', mockInterpretation);

    // Verify cache has the item
    expect(cache.has(text, spiritId, 'summary')).toBe(true);
    
    const cached = cache.get(text, spiritId, 'summary');
    expect(cached).toEqual(mockInterpretation);
  });
});

