/**
 * Lambda function to proxy Bedrock requests
 * This bypasses Cognito Identity Pool session policy restrictions
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const client = new BedrockRuntimeClient({ region: 'us-east-1' });

export const handler = async (event) => {
  // Headers (CORS is handled by Function URL config)
  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    // Parse request
    const body = JSON.parse(event.body);
    const { modelId, prompt, systemPrompt, options = {} } = body;

    if (!modelId || !prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'modelId and prompt are required' })
      };
    }

    // Build Bedrock request
    const bedrockRequest = {
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: options.maxTokens || 3000,
      temperature: options.temperature || 0.7,
      top_p: options.topP || 0.9,
      messages: [{ role: 'user', content: prompt }],
      ...(systemPrompt && { system: systemPrompt })
    };

    // Invoke Bedrock
    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(bedrockRequest)
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const text = responseBody.content[0].text;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message || 'Internal server error'
      })
    };
  }
};
