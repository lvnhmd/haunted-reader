/**
 * Interpretation Engine - Combines spirits, text, and AI to generate interpretations
 * Core engine for The Haunted Reader that brings literary spirits to life
 */

import { buildPrompt, PROMPT_TYPES } from '../spirits/promptBuilder.js';
import { generate, estimateTokens, getErrorMessage } from './aiService.js';
import { getSpiritById } from '../spirits/spiritDefinitions.js';
import cache from './interpretationCache.js';

/**
 * Generate a summary of text from a spirit's perspective
 * 
 * @param {string} text - The text to summarize
 * @param {string} spiritId - The spirit to channel
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Interpretation object
 */
export async function generateSummary(text, spiritId, options = {}) {
  // Validate inputs
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text is required and must be a non-empty string');
  }
  
  const spirit = getSpiritById(spiritId);
  if (!spirit) {
    throw new Error(`Spirit not found: ${spiritId}`);
  }

  // Check cache first (CP-4.4)
  const useCache = options.useCache !== false;
  if (useCache) {
    const cached = cache.get(text, spiritId, 'summary');
    if (cached) {
      return cached;
    }
  }

  try {
    // Build the prompt
    const prompt = buildPrompt(spiritId, PROMPT_TYPES.SUMMARY, text);
    
    // Determine operation type based on text length
    // Use Haiku for speed on shorter texts, Sonnet for quality on longer texts
    const tokenCount = estimateTokens(text);
    const operationType = tokenCount > 2000 ? 'quality' : 'fast';
    
    // Generate the summary
    const generatedText = await generate(prompt.userMessage, {
      systemPrompt: prompt.systemPrompt,
      operationType,
      ...options
    });

    // Return interpretation object
    const interpretation = {
      spiritId,
      spiritName: spirit.name,
      type: 'summary',
      content: generatedText,
      generatedAt: new Date(),
      wordCount: generatedText.split(/\s+/).length,
      originalWordCount: text.split(/\s+/).length
    };

    // Cache the result
    if (useCache) {
      cache.set(text, spiritId, 'summary', interpretation);
    }

    return interpretation;
  } catch (error) {
    throw new Error(`Failed to generate summary: ${getErrorMessage(error)}`);
  }
}

/**
 * Rewrite text in a spirit's distinctive style
 * 
 * @param {string} text - The text to rewrite
 * @param {string} spiritId - The spirit to channel
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Interpretation object
 */
export async function rewriteText(text, spiritId, options = {}) {
  // Validate inputs
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text is required and must be a non-empty string');
  }
  
  const spirit = getSpiritById(spiritId);
  if (!spirit) {
    throw new Error(`Spirit not found: ${spiritId}`);
  }

  // Check cache first (CP-4.4)
  const useCache = options.useCache !== false;
  if (useCache) {
    const cached = cache.get(text, spiritId, 'rewrite');
    if (cached) {
      return cached;
    }
  }

  try {
    // Build the prompt
    const prompt = buildPrompt(spiritId, PROMPT_TYPES.REWRITE, text);
    
    // Use quality model for rewrites (they need to maintain meaning)
    const generatedText = await generate(prompt.userMessage, {
      systemPrompt: prompt.systemPrompt,
      operationType: 'quality',
      ...options
    });

    // Return interpretation object
    const interpretation = {
      spiritId,
      spiritName: spirit.name,
      type: 'rewrite',
      content: generatedText,
      generatedAt: new Date(),
      wordCount: generatedText.split(/\s+/).length,
      originalWordCount: text.split(/\s+/).length
    };

    // Cache the result
    if (useCache) {
      cache.set(text, spiritId, 'rewrite', interpretation);
    }

    return interpretation;
  } catch (error) {
    throw new Error(`Failed to rewrite text: ${getErrorMessage(error)}`);
  }
}

/**
 * Analyze text from a spirit's perspective
 * 
 * @param {string} text - The text to analyze
 * @param {string} spiritId - The spirit to channel
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Interpretation object
 */
export async function analyzeText(text, spiritId, options = {}) {
  // Validate inputs
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text is required and must be a non-empty string');
  }
  
  const spirit = getSpiritById(spiritId);
  if (!spirit) {
    throw new Error(`Spirit not found: ${spiritId}`);
  }

  // Check cache first (CP-4.4)
  const useCache = options.useCache !== false;
  if (useCache) {
    const cached = cache.get(text, spiritId, 'analysis');
    if (cached) {
      return cached;
    }
  }

  try {
    // Build the prompt
    const prompt = buildPrompt(spiritId, PROMPT_TYPES.ANALYSIS, text);
    
    // Use balanced model for analysis
    const generatedText = await generate(prompt.userMessage, {
      systemPrompt: prompt.systemPrompt,
      operationType: 'balanced',
      ...options
    });

    // Return interpretation object
    const interpretation = {
      spiritId,
      spiritName: spirit.name,
      type: 'analysis',
      content: generatedText,
      generatedAt: new Date(),
      wordCount: generatedText.split(/\s+/).length,
      originalWordCount: text.split(/\s+/).length
    };

    // Cache the result
    if (useCache) {
      cache.set(text, spiritId, 'analysis', interpretation);
    }

    return interpretation;
  } catch (error) {
    throw new Error(`Failed to analyze text: ${getErrorMessage(error)}`);
  }
}

/**
 * Generate alternative endings from multiple spirits in parallel (CP-4.5)
 * 
 * @param {string} text - The incomplete text
 * @param {Array<string>} spiritIds - Array of spirit IDs to generate endings
 * @param {Object} options - Generation options
 * @returns {Promise<Array<Object>>} Array of ending interpretations
 */
export async function generateEnding(text, spiritIds, options = {}) {
  // Validate inputs
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text is required and must be a non-empty string');
  }
  
  if (!Array.isArray(spiritIds) || spiritIds.length === 0) {
    throw new Error('spiritIds must be a non-empty array');
  }

  // Validate all spirits exist
  for (const spiritId of spiritIds) {
    const spirit = getSpiritById(spiritId);
    if (!spirit) {
      throw new Error(`Spirit not found: ${spiritId}`);
    }
  }

  // Generate endings in parallel (CP-4.5)
  const endingPromises = spiritIds.map(async (spiritId) => {
    const spirit = getSpiritById(spiritId);
    
    // Check cache first
    const useCache = options.useCache !== false;
    if (useCache) {
      const cached = cache.get(text, spiritId, 'ending');
      if (cached) {
        return cached;
      }
    }

    try {
      // Build the prompt
      const prompt = buildPrompt(spiritId, PROMPT_TYPES.ENDING, text);
      
      // Use quality model for endings (creative work)
      const generatedText = await generate(prompt.userMessage, {
        systemPrompt: prompt.systemPrompt,
        operationType: 'quality',
        ...options
      });

      // Create interpretation object
      const interpretation = {
        spiritId,
        spiritName: spirit.name,
        type: 'ending',
        content: generatedText,
        generatedAt: new Date(),
        wordCount: generatedText.split(/\s+/).length,
        originalWordCount: text.split(/\s+/).length
      };

      // Cache the result
      if (useCache) {
        cache.set(text, spiritId, 'ending', interpretation);
      }

      return interpretation;
    } catch (error) {
      // Return error object instead of throwing, so other endings can still succeed
      return {
        spiritId,
        spiritName: spirit.name,
        type: 'ending',
        error: getErrorMessage(error),
        generatedAt: new Date()
      };
    }
  });

  // Wait for all endings to complete
  const endings = await Promise.all(endingPromises);
  
  return endings;
}

export default {
  generateSummary,
  rewriteText,
  analyzeText,
  generateEnding
};
