/**
 * Prompt Builder - Constructs AI prompts from spirit templates
 * Handles variable substitution and Bedrock-specific formatting
 */

import { getSpiritById } from './spiritDefinitions.js';

/**
 * Valid prompt types that spirits support
 */
export const PROMPT_TYPES = {
  SUMMARY: 'summary',
  REWRITE: 'rewrite',
  ENDING: 'ending',
  ANALYSIS: 'analysis'
};

/**
 * Build a prompt for AI generation from a spirit template
 * 
 * @param {string} spiritId - The unique spirit identifier
 * @param {string} promptType - Type of prompt (summary, rewrite, ending, analysis)
 * @param {string} text - The text to be processed
 * @param {Object} options - Additional options for prompt customization
 * @param {Object} options.variables - Additional variables to substitute in template
 * @param {boolean} options.includeVoiceProfile - Include detailed voice characteristics (default: true)
 * @returns {Object} Prompt object with user message and system prompt
 * @throws {Error} If spirit not found or prompt type invalid
 */
export function buildPrompt(spiritId, promptType, text, options = {}) {
  // Validate spirit exists
  const spirit = getSpiritById(spiritId);
  if (!spirit) {
    throw new Error(`Spirit not found: ${spiritId}. The spirit you seek does not dwell in our realm.`);
  }

  // Validate prompt type
  if (!Object.values(PROMPT_TYPES).includes(promptType)) {
    throw new Error(
      `Invalid prompt type: ${promptType}. Must be one of: ${Object.values(PROMPT_TYPES).join(', ')}`
    );
  }

  // Validate text is provided
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text is required and must be a non-empty string');
  }

  // Get the prompt template
  const template = spirit.prompts[promptType];
  if (!template) {
    throw new Error(`Spirit ${spiritId} does not have a ${promptType} prompt template`);
  }

  // Prepare variables for substitution
  const variables = {
    text: text.trim(),
    ...(options.variables || {})
  };

  // Substitute variables in template
  let prompt = substituteVariables(template, variables);

  // Build system prompt with voice characteristics
  const includeVoice = options.includeVoiceProfile !== false;
  const systemPrompt = includeVoice ? buildSystemPrompt(spirit) : null;

  return {
    userMessage: prompt,
    systemPrompt,
    spiritId,
    promptType
  };
}

/**
 * Substitute variables in a template string
 * Supports {variableName} syntax
 * 
 * @param {string} template - Template string with {variable} placeholders
 * @param {Object} variables - Object with variable values
 * @returns {string} Template with variables substituted
 */
function substituteVariables(template, variables) {
  let result = template;
  
  // Find all {variable} patterns and replace them
  Object.keys(variables).forEach(key => {
    const placeholder = `{${key}}`;
    const value = variables[key];
    
    // Replace all occurrences of this placeholder
    result = result.split(placeholder).join(value);
  });

  return result;
}

/**
 * Build a system prompt that includes spirit voice characteristics
 * This helps the AI maintain consistent voice throughout generation
 * 
 * @param {Object} spirit - The spirit object
 * @returns {string} System prompt describing the spirit's voice
 */
function buildSystemPrompt(spirit) {
  const { voice } = spirit;
  
  const systemPrompt = `You are channeling the spirit of ${spirit.name}.

Voice Characteristics:
- Tone: ${voice.tone}
- Vocabulary: Use words and phrases like: ${voice.vocabulary.slice(0, 5).join(', ')}
- Structure: ${voice.structure}
- Focus: ${voice.focus}

Maintain this voice consistently throughout your response. Embody this spirit's unique perspective and style.`;

  return systemPrompt;
}

/**
 * Format a prompt for Amazon Bedrock Claude API
 * Bedrock uses a specific message format with separate system field
 * 
 * @param {string} spiritId - The unique spirit identifier
 * @param {string} promptType - Type of prompt
 * @param {string} text - The text to be processed
 * @param {Object} options - Additional options
 * @returns {Object} Bedrock-formatted request body
 */
export function buildBedrockPrompt(spiritId, promptType, text, options = {}) {
  const prompt = buildPrompt(spiritId, promptType, text, options);
  
  // Bedrock Claude format:
  // - system: separate field for system prompt
  // - messages: array of message objects with role and content
  const bedrockRequest = {
    messages: [
      {
        role: 'user',
        content: prompt.userMessage
      }
    ],
    // Include system prompt if available
    ...(prompt.systemPrompt && { system: prompt.systemPrompt }),
    // Default parameters (can be overridden by options)
    max_tokens: options.maxTokens || 4096,
    temperature: options.temperature !== undefined ? options.temperature : 0.7,
    top_p: options.topP || 0.9
  };

  return bedrockRequest;
}

/**
 * Validate that a prompt template meets requirements
 * Checks for required placeholders and structure
 * 
 * @param {string} template - The prompt template to validate
 * @param {Array<string>} requiredPlaceholders - Placeholders that must be present
 * @returns {Object} Validation result
 */
export function validatePromptTemplate(template, requiredPlaceholders = ['{text}']) {
  const errors = [];
  
  if (!template || typeof template !== 'string') {
    errors.push('Template must be a non-empty string');
    return { valid: false, errors };
  }

  // Check for required placeholders
  requiredPlaceholders.forEach(placeholder => {
    if (!template.includes(placeholder)) {
      errors.push(`Template missing required placeholder: ${placeholder}`);
    }
  });

  // Check template isn't too short (likely incomplete)
  if (template.trim().length < 20) {
    errors.push('Template seems too short to be meaningful');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Estimate token count for a prompt
 * Uses rough approximation: ~4 characters per token for English text
 * 
 * @param {string} text - The text to estimate
 * @returns {number} Estimated token count
 */
export function estimateTokens(text) {
  if (!text || typeof text !== 'string') {
    return 0;
  }
  
  // Rough approximation: 1 token ≈ 4 characters for English
  // This is conservative; actual tokenization may vary
  return Math.ceil(text.length / 4);
}

/**
 * Optimize prompt for token efficiency
 * Removes excessive whitespace while preserving structure
 * 
 * @param {string} prompt - The prompt to optimize
 * @returns {string} Optimized prompt
 */
export function optimizePrompt(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    return prompt;
  }

  return prompt
    // Remove multiple consecutive spaces
    .replace(/ +/g, ' ')
    // Remove spaces at start/end of lines
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Remove multiple consecutive newlines (keep max 2 for paragraph breaks)
    .replace(/\n{3,}/g, '\n\n')
    // Trim overall
    .trim();
}

export default {
  buildPrompt,
  buildBedrockPrompt,
  validatePromptTemplate,
  estimateTokens,
  optimizePrompt,
  PROMPT_TYPES
};
