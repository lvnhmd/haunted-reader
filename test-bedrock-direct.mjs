#!/usr/bin/env node

/**
 * Direct Bedrock Test - Tests AWS Bedrock connection from Node.js
 * This bypasses the app to test if AWS credentials work
 */

import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { readFileSync } from 'fs';

// Load .env manually
const envFile = readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const REGION = envVars.VITE_AWS_REGION || 'us-east-1';
const IDENTITY_POOL_ID = envVars.VITE_COGNITO_IDENTITY_POOL_ID;

console.log('🧪 Testing Bedrock Connection...\n');
console.log('📋 Configuration:');
console.log(`  Region: ${REGION}`);
console.log(`  Identity Pool: ${IDENTITY_POOL_ID}`);
console.log('');

if (!IDENTITY_POOL_ID) {
  console.error('❌ VITE_COGNITO_IDENTITY_POOL_ID not set in .env');
  process.exit(1);
}

// Create Bedrock client with Cognito credentials
const client = new BedrockRuntimeClient({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID
  })
});

// Test with Claude 3 Haiku
const modelId = "anthropic.claude-3-haiku-20240307-v1:0";

console.log(`🤖 Testing model: ${modelId}\n`);

const testPrompt = "Say 'Boo!' like a friendly ghost in exactly 3 words.";

const command = new InvokeModelCommand({
  modelId,
  contentType: "application/json",
  accept: "application/json",
  body: JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 100,
    temperature: 0.7,
    messages: [
      {
        role: "user",
        content: testPrompt
      }
    ]
  })
});

try {
  console.log('📤 Sending request to Bedrock...');
  const response = await client.send(command);
  
  console.log('✅ Response received!\n');
  
  const result = JSON.parse(new TextDecoder().decode(response.body));
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 SUCCESS! Bedrock is working!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('👻 Ghost says:', result.content[0].text);
  console.log('');
  console.log('📊 Response details:');
  console.log(`  Model: ${result.model}`);
  console.log(`  Stop reason: ${result.stop_reason}`);
  console.log(`  Input tokens: ${result.usage.input_tokens}`);
  console.log(`  Output tokens: ${result.usage.output_tokens}`);
  console.log('');
  console.log('✅ Your AWS setup is working correctly!');
  console.log('');
  console.log('If the app still has issues:');
  console.log('  1. Make sure you restarted the dev server after updating .env');
  console.log('  2. Clear browser cache and reload');
  console.log('  3. Check browser console for errors');
  console.log('  4. Verify the app is loading environment variables');
  console.log('');
  
} catch (error) {
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('❌ ERROR: Bedrock request failed');
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.error('');
  console.error('Error name:', error.name);
  console.error('Error message:', error.message);
  console.error('');
  
  if (error.name === 'AccessDeniedException') {
    console.error('🔒 Access Denied - Possible causes:');
    console.error('  1. IAM role doesn\'t have bedrock:InvokeModel permission');
    console.error('  2. Model not enabled in Bedrock console');
    console.error('  3. Role not attached to Identity Pool');
    console.error('');
    console.error('Fix:');
    console.error('  1. Run: ./setup-cognito.sh');
    console.error('  2. Or check IAM role permissions in AWS Console');
  } else if (error.name === 'ResourceNotFoundException') {
    console.error('🔍 Resource Not Found - Possible causes:');
    console.error('  1. Model ID is incorrect');
    console.error('  2. Model not available in your region');
    console.error('  3. Bedrock not enabled in your account');
    console.error('');
    console.error('Fix:');
    console.error('  1. Enable Bedrock models in AWS Console');
    console.error('  2. Check model availability in your region');
  } else if (error.name === 'ValidationException') {
    console.error('⚠️  Validation Error - Possible causes:');
    console.error('  1. Request format is incorrect');
    console.error('  2. Invalid parameters');
    console.error('');
    console.error('This is likely a code issue, not configuration.');
  } else if (error.message.includes('Identity Pool')) {
    console.error('🆔 Identity Pool Error - Possible causes:');
    console.error('  1. Identity Pool ID is incorrect');
    console.error('  2. Identity Pool doesn\'t exist');
    console.error('  3. Region mismatch');
    console.error('');
    console.error('Fix:');
    console.error('  1. Verify VITE_COGNITO_IDENTITY_POOL_ID in .env');
    console.error('  2. Run: ./setup-cognito.sh');
  } else {
    console.error('🤔 Unknown error - Debug info:');
    console.error(error);
  }
  
  console.error('');
  process.exit(1);
}
