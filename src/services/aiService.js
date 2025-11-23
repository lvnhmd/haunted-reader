/**
 * AI Service for The Haunted Reader
 * Manages AI text generation with retry logic, token estimation, and error handling
 */

import {
  createBedrockClient,
  invokeModel,
  invokeModelStreaming,
  validateCredentials
} from './aiProviders/bedrockProvider.js';
import { getRecommendedModel, MODEL_PARAMETERS } from './aiProviders/bedrockModels.js';

// Singleton client instance
let bedrockClient = null;

/**
 * Get or create Bedrock client
 */
function getClient() {
  if (!bedrockClient) {
    bedrockClient = createBedrockClient();
  }
  return bedrockClient;
}

/**
 * Estimate token count for text
 * Uses approximation: 1 token ≈ 4 characters for English text
 * This should be within 10% accuracy for most cases
 */
export function estimateTokens(text) {
  if (!text) return 0;
  
  // More accurate estimation considering:
  // - Average word length
  // - Punctuation and spaces
  // - Special characters
  const charCount = text.length;
  const wordCount = text.split(/\s+/).length;
  
  // Claude tokenizer averages:
  // - ~4 chars per token for prose
  // - ~1.3 tokens per word
  const charBasedEstimate = charCount / 4;
  const wordBasedEstimate = wordCount * 1.3;
  
  // Use average of both methods for better accuracy
  return Math.round((charBasedEstimate + wordBasedEstimate) / 2);
}

/**
 * Sleep utility for retry backoff
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
function isRetryableError(error) {
  const retryableErrors = [
    'ThrottlingException',
    'ServiceUnavailableException',
    'TooManyRequestsException',
    'InternalServerException',
    'ModelTimeoutException'
  ];
  
  return retryableErrors.includes(error.name) || 
         error.message?.includes('throttl') ||
         error.message?.includes('timeout') ||
         error.$metadata?.httpStatusCode === 429 ||
         error.$metadata?.httpStatusCode >= 500;
}

/**
 * Execute function with exponential backoff retry
 */
async function withRetry(fn, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if error is not retryable
      if (!isRetryableError(error)) {
        throw error;
      }
      
      // Don't sleep on last attempt
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const backoffMs = Math.pow(2, attempt) * 1000;
        console.warn(`Attempt ${attempt + 1} failed, retrying in ${backoffMs}ms...`, error.message);
        await sleep(backoffMs);
      }
    }
  }
  
  // All retries exhausted
  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

/**
 * Generate text using AI model
 */
export async function generate(prompt, options = {}) {
  const {
    systemPrompt = null,
    modelId = null,
    operationType = 'balanced',
    temperature,
    topP,
    maxTokens
  } = options;

  // Select model
  const selectedModel = modelId || getRecommendedModel(operationType);
  
  // Get parameters
  const params = MODEL_PARAMETERS[operationType] || MODEL_PARAMETERS.balanced;
  const generationOptions = {
    temperature: temperature ?? params.temperature,
    topP: topP ?? params.topP,
    maxTokens: maxTokens ?? params.maxTokens
  };

  // Generate with retry logic
  const client = getClient();
  
  return await withRetry(async () => {
    return await invokeModel(
      client,
      selectedModel,
      prompt,
      systemPrompt,
      generationOptions
    );
  });
}

/**
 * Generate text with streaming
 */
export async function* generateStreaming(prompt, options = {}) {
  const {
    systemPrompt = null,
    modelId = null,
    operationType = 'balanced',
    temperature,
    topP,
    maxTokens
  } = options;

  // Select model
  const selectedModel = modelId || getRecommendedModel(operationType);
  
  // Get parameters
  const params = MODEL_PARAMETERS[operationType] || MODEL_PARAMETERS.balanced;
  const generationOptions = {
    temperature: temperature ?? params.temperature,
    topP: topP ?? params.topP,
    maxTokens: maxTokens ?? params.maxTokens
  };

  const client = getClient();
  
  // Streaming with retry - retry the entire stream on failure
  yield* await withRetry(async () => {
    return invokeModelStreaming(
      client,
      selectedModel,
      prompt,
      systemPrompt,
      generationOptions
    );
  });
}

/**
 * Validate AWS credentials are configured correctly
 */
export async function checkCredentials() {
  try {
    const client = getClient();
    return await validateCredentials(client);
  } catch (error) {
    console.error('Credential validation error:', error);
    return false;
  }
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error) {
  // Spooky error messages for The Haunted Reader
  const errorMessages = {
    'AccessDeniedException': '🦇 The spirits deny you access... Check your AWS credentials.',
    'ThrottlingException': '👻 Too many spirits summoned at once! Please wait a moment...',
    'ValidationException': '🎃 The ritual was performed incorrectly. Check your input.',
    'ModelTimeoutException': '💀 The spirits took too long to respond. Try again.',
    'ServiceUnavailableException': '🕷️ The spirit realm is temporarily unavailable...',
    'ResourceNotFoundException': '🕸️ The requested spirit could not be found in the ether.'
  };

  const errorName = error.name || 'UnknownError';
  
  if (errorMessages[errorName]) {
    return errorMessages[errorName];
  }
  
  // Generic spooky error
  return `👁️ A mysterious error occurred: ${error.message || 'Unknown darkness'}`;
}

/**
 * Export for testing and advanced usage
 */
export const AIService = {
  generate,
  generateStreaming,
  estimateTokens,
  checkCredentials,
  getErrorMessage
};

export default AIService;
