#!/usr/bin/env node

/**
 * Test Bedrock access using Cognito Identity Pool credentials
 * This simulates exactly what your browser app does
 */

import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const REGION = 'us-east-1';
const IDENTITY_POOL_ID = 'us-east-1:6a57560d-d7c2-4741-b16e-77be96a1efdc';
const MODEL_ID = 'anthropic.claude-3-haiku-20240307-v1:0';

console.log('🧪 Testing Bedrock access with Cognito credentials...\n');

try {
  // Step 1: Create credentials from Cognito Identity Pool (unauthenticated)
  console.log('1️⃣ Creating Cognito credentials...');
  const credentials = fromCognitoIdentityPool({
    clientConfig: { region: REGION },
    identityPoolId: IDENTITY_POOL_ID
  });
  
  console.log('   ✅ Credentials provider created\n');

  // Step 2: Create Bedrock client
  console.log('2️⃣ Creating Bedrock Runtime client...');
  const client = new BedrockRuntimeClient({
    region: REGION,
    credentials
  });
  console.log('   ✅ Client created\n');

  // Step 3: Prepare test request
  console.log('3️⃣ Preparing test request...');
  const prompt = 'Say "Hello from the spirit realm!" in a spooky way.';
  const body = {
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 100,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  };
  
  console.log(`   Model: ${MODEL_ID}`);
  console.log(`   Prompt: ${prompt}\n`);

  // Step 4: Invoke model
  console.log('4️⃣ Invoking Bedrock model...');
  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(body)
  });

  const response = await client.send(command);
  
  // Step 5: Parse response
  console.log('5️⃣ Parsing response...');
  const responseBody = JSON.parse(new TextDecoder().decode(response.body));
  const text = responseBody.content[0].text;
  
  console.log('   ✅ Success!\n');
  console.log('📜 Response from Claude:');
  console.log('─'.repeat(60));
  console.log(text);
  console.log('─'.repeat(60));
  console.log('\n🎉 Test PASSED! Your Cognito + Bedrock setup is working!\n');

} catch (error) {
  console.error('\n❌ Test FAILED!\n');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  
  if (error.$metadata) {
    console.error('HTTP Status:', error.$metadata.httpStatusCode);
    console.error('Request ID:', error.$metadata.requestId);
  }
  
  console.error('\nFull error:', error);
  
  console.log('\n🔍 Diagnosis:');
  if (error.name === 'AccessDeniedException') {
    console.log('   The IAM role lacks permission to invoke Bedrock models.');
    console.log('   Check the role policy attached to your Cognito Identity Pool.');
  } else if (error.name === 'ResourceNotFoundException') {
    console.log('   The model ID may be incorrect or not available in your region.');
  } else if (error.name === 'ValidationException') {
    console.log('   The request format is invalid.');
  } else {
    console.log('   Unknown error. Check AWS credentials and permissions.');
  }
  
  process.exit(1);
}
