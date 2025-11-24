#!/usr/bin/env node

/**
 * Test Lambda proxy integration
 */

const LAMBDA_URL = 'https://nahwouwfcfbw6b77swlhvkaa4u0ufgos.lambda-url.us-east-1.on.aws/';

console.log('🧪 Testing Lambda Proxy Integration...\n');

try {
  console.log('1️⃣ Testing basic invocation...');
  const response = await fetch(LAMBDA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
      prompt: 'Write a one-sentence spooky greeting.',
      options: {
        maxTokens: 50,
        temperature: 0.7
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('   ✅ Success!\n');
  console.log('📜 Response:');
  console.log('─'.repeat(60));
  console.log(data.text);
  console.log('─'.repeat(60));
  console.log('\n🎉 Lambda proxy is working correctly!\n');
  console.log('✨ Your Haunted Reader app should now work!\n');
  console.log('Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Upload a text file');
  console.log('3. Generate spirit interpretations');

} catch (error) {
  console.error('\n❌ Test FAILED!\n');
  console.error('Error:', error.message);
  console.error('\nFull error:', error);
  process.exit(1);
}
