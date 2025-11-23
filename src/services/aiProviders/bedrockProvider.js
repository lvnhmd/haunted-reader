/**
 * Amazon Bedrock Provider
 * Handles communication with AWS Bedrock Runtime API
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelWithResponseStreamCommand
} from '@aws-sdk/client-bedrock-runtime';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { getModelConfig } from './bedrockModels.js';

/**
 * Initialize Bedrock client with Cognito credentials
 */
export function createBedrockClient() {
  const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
  const identityPoolId = import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID;

  if (!identityPoolId) {
    throw new Error('VITE_COGNITO_IDENTITY_POOL_ID not configured. Check your .env file.');
  }

  const credentials = fromCognitoIdentityPool({
    clientConfig: { region },
    identityPoolId
  });

  return new BedrockRuntimeClient({
    region,
    credentials
  });
}

/**
 * Format request body for Claude models
 */
function formatClaudeRequest(prompt, systemPrompt, options = {}) {
  const {
    temperature = 0.7,
    topP = 0.9,
    maxTokens = 3000
  } = options;

  return {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    temperature,
    top_p: topP,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ],
    ...(systemPrompt && { system: systemPrompt })
  };
}

/**
 * Format request body for Titan models
 */
function formatTitanRequest(prompt, options = {}) {
  const {
    temperature = 0.7,
    topP = 0.9,
    maxTokens = 3000
  } = options;

  return {
    inputText: prompt,
    textGenerationConfig: {
      temperature,
      topP,
      maxTokenCount: maxTokens
    }
  };
}

/**
 * Format request based on model type
 */
export function formatRequest(modelId, prompt, systemPrompt, options) {
  if (modelId.startsWith('anthropic.claude')) {
    return formatClaudeRequest(prompt, systemPrompt, options);
  } else if (modelId.startsWith('amazon.titan')) {
    return formatTitanRequest(prompt, options);
  }
  throw new Error(`Unsupported model: ${modelId}`);
}

/**
 * Parse response from Claude models
 */
function parseClaudeResponse(response) {
  const data = JSON.parse(new TextDecoder().decode(response.body));
  
  if (data.content && data.content.length > 0) {
    return data.content[0].text;
  }
  
  throw new Error('Invalid response format from Claude model');
}

/**
 * Parse response from Titan models
 */
function parseTitanResponse(response) {
  const data = JSON.parse(new TextDecoder().decode(response.body));
  
  if (data.results && data.results.length > 0) {
    return data.results[0].outputText;
  }
  
  throw new Error('Invalid response format from Titan model');
}

/**
 * Parse response based on model type
 */
export function parseResponse(modelId, response) {
  if (modelId.startsWith('anthropic.claude')) {
    return parseClaudeResponse(response);
  } else if (modelId.startsWith('amazon.titan')) {
    return parseTitanResponse(response);
  }
  throw new Error(`Unsupported model: ${modelId}`);
}

/**
 * Invoke Bedrock model (non-streaming)
 */
export async function invokeModel(client, modelId, prompt, systemPrompt, options = {}) {
  const modelConfig = getModelConfig(modelId);
  const body = formatRequest(modelId, prompt, systemPrompt, options);

  const command = new InvokeModelCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(body)
  });

  const response = await client.send(command);
  return parseResponse(modelId, response);
}

/**
 * Invoke Bedrock model with streaming
 */
export async function* invokeModelStreaming(client, modelId, prompt, systemPrompt, options = {}) {
  const body = formatRequest(modelId, prompt, systemPrompt, options);

  const command = new InvokeModelWithResponseStreamCommand({
    modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(body)
  });

  const response = await client.send(command);

  // Process the stream
  for await (const event of response.body) {
    if (event.chunk) {
      const chunk = JSON.parse(new TextDecoder().decode(event.chunk.bytes));
      
      // Handle Claude streaming format
      if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
        yield chunk.delta.text;
      }
      // Handle Titan streaming format
      else if (chunk.outputText) {
        yield chunk.outputText;
      }
    }
  }
}

/**
 * Validate AWS credentials
 */
export async function validateCredentials(client) {
  try {
    // Try a minimal request to validate credentials
    const testPrompt = 'Hello';
    const body = formatClaudeRequest(testPrompt, null, { maxTokens: 10 });
    
    const command = new InvokeModelCommand({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(body)
    });

    await client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'UnrecognizedClientException' || 
        error.name === 'InvalidSignatureException' ||
        error.name === 'AccessDeniedException') {
      return false;
    }
    // Other errors might be network issues, not credential issues
    throw error;
  }
}
