/**
 * Amazon Bedrock Model Configurations
 * Defines available models and their parameters for The Haunted Reader
 */

export const BEDROCK_MODELS = {
  // Claude 3 Haiku - Fast and cost-effective for quick interpretations
  CLAUDE_HAIKU: {
    id: 'anthropic.claude-3-haiku-20240307-v1:0',
    name: 'Claude 3 Haiku',
    maxTokens: 4096,
    contextWindow: 200000,
    costPer1kTokens: { input: 0.00025, output: 0.00125 },
    useCase: 'Fast summaries and quick interpretations'
  },

  // Claude 3 Sonnet - Balanced quality and speed for main interpretations
  CLAUDE_SONNET: {
    id: 'anthropic.claude-3-sonnet-20240229-v1:0',
    name: 'Claude 3 Sonnet',
    maxTokens: 4096,
    contextWindow: 200000,
    costPer1kTokens: { input: 0.003, output: 0.015 },
    useCase: 'High-quality rewrites and detailed analysis'
  },

  // Amazon Titan - AWS native model for basic operations
  TITAN_EXPRESS: {
    id: 'amazon.titan-text-express-v1',
    name: 'Amazon Titan Text Express',
    maxTokens: 8192,
    contextWindow: 8000,
    costPer1kTokens: { input: 0.0002, output: 0.0006 },
    useCase: 'Basic text operations and summaries'
  }
};

// Default model selection based on operation type
export const DEFAULT_MODELS = {
  summary: BEDROCK_MODELS.CLAUDE_HAIKU.id,
  rewrite: BEDROCK_MODELS.CLAUDE_SONNET.id,
  ending: BEDROCK_MODELS.CLAUDE_SONNET.id,
  analysis: BEDROCK_MODELS.CLAUDE_HAIKU.id
};

// Model parameters for different generation types
export const MODEL_PARAMETERS = {
  creative: {
    temperature: 0.9,
    topP: 0.95,
    maxTokens: 4096
  },
  balanced: {
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 3000
  },
  precise: {
    temperature: 0.3,
    topP: 0.8,
    maxTokens: 2000
  }
};

/**
 * Get model configuration by ID
 */
export function getModelConfig(modelId) {
  const model = Object.values(BEDROCK_MODELS).find(m => m.id === modelId);
  if (!model) {
    throw new Error(`Unknown model ID: ${modelId}`);
  }
  return model;
}

/**
 * Get recommended model for operation type
 */
export function getRecommendedModel(operationType) {
  return DEFAULT_MODELS[operationType] || BEDROCK_MODELS.CLAUDE_HAIKU.id;
}
