/**
 * Tests for Prompt Builder
 * Validates core functionality, variable substitution, and Bedrock formatting
 */

import { describe, it, expect } from 'vitest';
import {
  buildPrompt,
  buildBedrockPrompt,
  validatePromptTemplate,
  estimateTokens,
  optimizePrompt,
  PROMPT_TYPES
} from './promptBuilder.js';
import { spirits } from './spiritDefinitions.js';

describe('Prompt Builder', () => {
  const sampleText = 'The old house stood at the end of the lane.';
  const validSpiritId = 'poe';

  describe('buildPrompt', () => {
    it('should build a valid prompt with text substitution', () => {
      const result = buildPrompt(validSpiritId, PROMPT_TYPES.SUMMARY, sampleText);
      
      expect(result).toHaveProperty('userMessage');
      expect(result).toHaveProperty('systemPrompt');
      expect(result.userMessage).toContain(sampleText);
      expect(result.spiritId).toBe(validSpiritId);
      expect(result.promptType).toBe(PROMPT_TYPES.SUMMARY);
    });

    it('should throw error for invalid spirit ID', () => {
      expect(() => {
        buildPrompt('nonexistent-spirit', PROMPT_TYPES.SUMMARY, sampleText);
      }).toThrow(/Spirit not found/);
    });

    it('should throw error for invalid prompt type', () => {
      expect(() => {
        buildPrompt(validSpiritId, 'invalid-type', sampleText);
      }).toThrow(/Invalid prompt type/);
    });

    it('should throw error for empty text', () => {
      expect(() => {
        buildPrompt(validSpiritId, PROMPT_TYPES.SUMMARY, '');
      }).toThrow(/Text is required/);
    });

    it('should include system prompt with voice characteristics', () => {
      const result = buildPrompt(validSpiritId, PROMPT_TYPES.SUMMARY, sampleText);
      
      expect(result.systemPrompt).toBeTruthy();
      expect(result.systemPrompt).toContain('Edgar Allan Poe');
      expect(result.systemPrompt).toContain('Tone:');
      expect(result.systemPrompt).toContain('Vocabulary:');
    });

    it('should support all prompt types', () => {
      Object.values(PROMPT_TYPES).forEach(type => {
        const result = buildPrompt(validSpiritId, type, sampleText);
        expect(result.userMessage).toBeTruthy();
        expect(result.promptType).toBe(type);
      });
    });

    it('should substitute custom variables', () => {
      const customText = 'Test text with {customVar}';
      const spirit = spirits[0];
      
      // Temporarily modify template for testing
      const originalTemplate = spirit.prompts.summary;
      spirit.prompts.summary = customText;
      
      const result = buildPrompt(spirit.id, PROMPT_TYPES.SUMMARY, sampleText, {
        variables: { customVar: 'REPLACED' }
      });
      
      expect(result.userMessage).toContain('REPLACED');
      
      // Restore original
      spirit.prompts.summary = originalTemplate;
    });
  });

  describe('buildBedrockPrompt', () => {
    it('should format prompt for Bedrock API', () => {
      const result = buildBedrockPrompt(validSpiritId, PROMPT_TYPES.SUMMARY, sampleText);
      
      expect(result).toHaveProperty('messages');
      expect(result).toHaveProperty('system');
      expect(result).toHaveProperty('max_tokens');
      expect(result).toHaveProperty('temperature');
      expect(result.messages).toBeInstanceOf(Array);
      expect(result.messages[0]).toHaveProperty('role', 'user');
      expect(result.messages[0]).toHaveProperty('content');
    });

    it('should use separate system field (not in messages)', () => {
      const result = buildBedrockPrompt(validSpiritId, PROMPT_TYPES.SUMMARY, sampleText);
      
      expect(result.system).toBeTruthy();
      expect(typeof result.system).toBe('string');
      // System should not be in messages array
      expect(result.messages[0].role).toBe('user');
    });

    it('should allow custom parameters', () => {
      const result = buildBedrockPrompt(validSpiritId, PROMPT_TYPES.SUMMARY, sampleText, {
        maxTokens: 2000,
        temperature: 0.5,
        topP: 0.95
      });
      
      expect(result.max_tokens).toBe(2000);
      expect(result.temperature).toBe(0.5);
      expect(result.top_p).toBe(0.95);
    });
  });

  describe('validatePromptTemplate', () => {
    it('should validate template with required placeholder', () => {
      const validTemplate = 'Summarize this text: {text}';
      const result = validatePromptTemplate(validTemplate);
      
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for missing placeholder', () => {
      const invalidTemplate = 'Summarize this text without placeholder';
      const result = validatePromptTemplate(invalidTemplate);
      
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('{text}');
    });

    it('should fail validation for too short template', () => {
      const shortTemplate = '{text}';
      const result = validatePromptTemplate(shortTemplate);
      
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('too short'))).toBe(true);
    });
  });

  describe('estimateTokens', () => {
    it('should estimate token count', () => {
      const text = 'This is a test sentence.';
      const tokens = estimateTokens(text);
      
      expect(tokens).toBeGreaterThan(0);
      expect(typeof tokens).toBe('number');
    });

    it('should return 0 for empty text', () => {
      expect(estimateTokens('')).toBe(0);
      expect(estimateTokens(null)).toBe(0);
    });

    it('should use ~4 characters per token approximation', () => {
      const text = 'a'.repeat(400); // 400 characters
      const tokens = estimateTokens(text);
      
      // Should be approximately 100 tokens (400/4)
      expect(tokens).toBeGreaterThanOrEqual(95);
      expect(tokens).toBeLessThanOrEqual(105);
    });
  });

  describe('optimizePrompt', () => {
    it('should remove excessive whitespace', () => {
      const messyPrompt = 'This  has   multiple    spaces';
      const optimized = optimizePrompt(messyPrompt);
      
      expect(optimized).toBe('This has multiple spaces');
    });

    it('should remove excessive newlines', () => {
      const messyPrompt = 'Line 1\n\n\n\nLine 2';
      const optimized = optimizePrompt(messyPrompt);
      
      expect(optimized).toBe('Line 1\n\nLine 2');
    });

    it('should trim whitespace from lines', () => {
      const messyPrompt = '  Line 1  \n  Line 2  ';
      const optimized = optimizePrompt(messyPrompt);
      
      expect(optimized).toBe('Line 1\nLine 2');
    });

    it('should preserve paragraph breaks', () => {
      const prompt = 'Paragraph 1\n\nParagraph 2';
      const optimized = optimizePrompt(prompt);
      
      expect(optimized).toBe('Paragraph 1\n\nParagraph 2');
    });
  });

  describe('Integration: All spirits have valid templates', () => {
    it('should validate all spirit prompt templates', () => {
      spirits.forEach(spirit => {
        Object.values(PROMPT_TYPES).forEach(type => {
          const template = spirit.prompts[type];
          const validation = validatePromptTemplate(template);
          
          expect(validation.valid).toBe(true);
          expect(validation.errors).toHaveLength(0);
        });
      });
    });

    it('should build prompts for all spirits and types', () => {
      spirits.forEach(spirit => {
        Object.values(PROMPT_TYPES).forEach(type => {
          const result = buildPrompt(spirit.id, type, sampleText);
          
          expect(result.userMessage).toBeTruthy();
          expect(result.userMessage).toContain(sampleText);
          expect(result.systemPrompt).toBeTruthy();
        });
      });
    });
  });
});
