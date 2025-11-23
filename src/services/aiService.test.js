/**
 * Tests for AI Service
 * Note: These are basic unit tests. Full integration tests require AWS credentials.
 */

import { describe, it, expect } from 'vitest';
import { estimateTokens, getErrorMessage } from './aiService.js';

describe('AI Service - Token Estimation', () => {
  it('should estimate tokens for empty string', () => {
    expect(estimateTokens('')).toBe(0);
    expect(estimateTokens(null)).toBe(0);
  });

  it('should estimate tokens for short text', () => {
    const text = 'Hello world';
    const tokens = estimateTokens(text);
    // "Hello world" is 2 words, ~11 chars
    // Should be around 2-4 tokens
    expect(tokens).toBeGreaterThan(0);
    expect(tokens).toBeLessThan(10);
  });

  it('should estimate tokens for longer text', () => {
    const text = 'The quick brown fox jumps over the lazy dog. '.repeat(10);
    const tokens = estimateTokens(text);
    // Should be roughly proportional to text length
    expect(tokens).toBeGreaterThan(50);
    expect(tokens).toBeLessThan(200);
  });

  it('should be within reasonable accuracy range', () => {
    // Test with known text
    const text = 'This is a test sentence with exactly ten words in it.';
    const tokens = estimateTokens(text);
    // 10 words * 1.3 ≈ 13 tokens
    // 54 chars / 4 ≈ 13.5 tokens
    // Average should be around 13 tokens
    expect(tokens).toBeGreaterThanOrEqual(10);
    expect(tokens).toBeLessThanOrEqual(20);
  });
});

describe('AI Service - Error Messages', () => {
  it('should return spooky error message for AccessDeniedException', () => {
    const error = { name: 'AccessDeniedException' };
    const message = getErrorMessage(error);
    expect(message).toContain('spirits');
    expect(message).toContain('🦇');
  });

  it('should return spooky error message for ThrottlingException', () => {
    const error = { name: 'ThrottlingException' };
    const message = getErrorMessage(error);
    expect(message).toContain('👻');
  });

  it('should return generic spooky message for unknown errors', () => {
    const error = { name: 'UnknownError', message: 'Something went wrong' };
    const message = getErrorMessage(error);
    expect(message).toContain('👁️');
    expect(message).toContain('Something went wrong');
  });
});
