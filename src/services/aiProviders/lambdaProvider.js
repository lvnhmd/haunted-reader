/**
 * Lambda Proxy Provider
 * Uses Lambda function to proxy Bedrock requests
 * This bypasses Cognito Identity Pool session policy restrictions
 */

/**
 * Invoke model via Lambda proxy
 */
export async function invokeModel(modelId, prompt, systemPrompt, options = {}) {
  const endpoint = import.meta.env.VITE_API_ENDPOINT;

  if (!endpoint) {
    throw new Error('VITE_API_ENDPOINT not configured. Check your .env file.');
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      modelId,
      prompt,
      systemPrompt,
      options
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.text;
}

/**
 * Validate Lambda endpoint is accessible
 */
export async function validateCredentials() {
  try {
    const endpoint = import.meta.env.VITE_API_ENDPOINT;
    if (!endpoint) return false;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        prompt: 'test',
        options: { maxTokens: 10 }
      })
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}

export default {
  invokeModel,
  validateCredentials
};
