/**
 * File Parser Service - Tests
 */

import { describe, it, expect } from 'vitest';
import { parseText } from './fileParser.js';

describe('File Parser Service', () => {
  describe('parseText', () => {
    it('should parse plain text and calculate metadata', () => {
      const text = 'Hello world. This is a test.';
      const result = parseText(text);
      
      expect(result.content).toBe(text);
      expect(result.metadata.wordCount).toBe(6);
      expect(result.metadata.characterCount).toBe(text.length);
      expect(result.fileType).toBe('txt');
    });
    
    it('should detect paragraphs', () => {
      const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
      const result = parseText(text);
      
      expect(result.structure.paragraphs).toHaveLength(3);
      expect(result.structure.paragraphs[0]).toBe('First paragraph.');
      expect(result.structure.paragraphs[1]).toBe('Second paragraph.');
    });
    
    it('should detect chapter markers', () => {
      const text = 'Chapter 1\n\nSome content here.\n\nChapter 2\n\nMore content.';
      const result = parseText(text);
      
      expect(result.structure.chapters.length).toBeGreaterThanOrEqual(2);
      expect(result.structure.chapters[0].title).toBe('Chapter 1');
    });
    
    it('should throw error for empty text', () => {
      expect(() => parseText('')).toThrow('Text is empty');
    });
    
    it('should throw error for non-string input', () => {
      expect(() => parseText(null)).toThrow('No text provided');
      expect(() => parseText(undefined)).toThrow('No text provided');
    });
    
    it('should calculate estimated read time', () => {
      // 200 words should take 1 minute
      const words = Array(200).fill('word').join(' ');
      const result = parseText(words);
      
      expect(result.metadata.estimatedReadTime).toBe(1);
    });
    
    it('should preserve paragraph breaks', () => {
      const text = 'Line 1\n\nLine 2\n\nLine 3';
      const result = parseText(text);
      
      // Should detect 3 separate paragraphs
      expect(result.structure.paragraphs).toHaveLength(3);
    });
  });
});
