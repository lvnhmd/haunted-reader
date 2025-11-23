/**
 * AI Service Usage Examples
 * 
 * These examples demonstrate how to use the AI service in The Haunted Reader.
 * Note: Requires valid AWS credentials configured in .env
 */

import { generate, generateStreaming, estimateTokens, checkCredentials, getErrorMessage } from './aiService.js';

/**
 * Example 1: Basic text generation
 */
export async function example1_basicGeneration() {
  console.log('🎃 Example 1: Basic Generation\n');
  
  try {
    const prompt = 'Write a short, spooky opening line for a ghost story.';
    const result = await generate(prompt);
    
    console.log('Generated text:', result);
  } catch (error) {
    console.error('Error:', getErrorMessage(error));
  }
}

/**
 * Example 2: Generation with system prompt (spirit personality)
 */
export async function example2_withSystemPrompt() {
  console.log('🦇 Example 2: With System Prompt\n');
  
  try {
    const systemPrompt = `You are Edgar Allan Poe, master of Gothic horror. 
Your writing is ornate, melancholic, and obsessed with death and beauty.
Use rich vocabulary and dramatic imagery.`;
    
    const prompt = 'Describe a haunted mansion on a stormy night.';
    
    const result = await generate(prompt, {
      systemPrompt,
      operationType: 'creative',
      temperature: 0.9
    });
    
    console.log('Poe-style description:', result);
  } catch (error) {
    console.error('Error:', getErrorMessage(error));
  }
}

/**
 * Example 3: Streaming generation
 */
export async function example3_streaming() {
  console.log('👻 Example 3: Streaming Generation\n');
  
  try {
    const prompt = 'Tell me a very short ghost story.';
    
    console.log('Streaming response:');
    for await (const chunk of generateStreaming(prompt)) {
      process.stdout.write(chunk); // Print chunks as they arrive
    }
    console.log('\n');
  } catch (error) {
    console.error('Error:', getErrorMessage(error));
  }
}

/**
 * Example 4: Token estimation
 */
export async function example4_tokenEstimation() {
  console.log('💀 Example 4: Token Estimation\n');
  
  const texts = [
    'Hello',
    'The quick brown fox jumps over the lazy dog.',
    'Once upon a midnight dreary, while I pondered, weak and weary, over many a quaint and curious volume of forgotten lore.'
  ];
  
  texts.forEach(text => {
    const tokens = estimateTokens(text);
    console.log(`Text: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
    console.log(`Estimated tokens: ${tokens}\n`);
  });
}

/**
 * Example 5: Error handling
 */
export async function example5_errorHandling() {
  console.log('🕷️ Example 5: Error Handling\n');
  
  try {
    // This will fail if credentials are not configured
    const result = await generate('Test prompt', {
      modelId: 'invalid-model-id' // Intentionally invalid
    });
    console.log('Result:', result);
  } catch (error) {
    console.log('Caught error!');
    console.log('Friendly message:', getErrorMessage(error));
    console.log('Technical details:', error.message);
  }
}

/**
 * Example 6: Credential validation
 */
export async function example6_credentialCheck() {
  console.log('🔮 Example 6: Credential Validation\n');
  
  const isValid = await checkCredentials();
  
  if (isValid) {
    console.log('✅ AWS credentials are valid!');
  } else {
    console.log('❌ AWS credentials are invalid or not configured.');
    console.log('Check your .env file and Cognito Identity Pool setup.');
  }
}

/**
 * Example 7: Different operation types
 */
export async function example7_operationTypes() {
  console.log('🎭 Example 7: Operation Types\n');
  
  const prompt = 'Describe a vampire.';
  
  try {
    // Creative (high temperature)
    console.log('Creative mode:');
    const creative = await generate(prompt, { operationType: 'creative' });
    console.log(creative, '\n');
    
    // Balanced (medium temperature)
    console.log('Balanced mode:');
    const balanced = await generate(prompt, { operationType: 'balanced' });
    console.log(balanced, '\n');
    
    // Precise (low temperature)
    console.log('Precise mode:');
    const precise = await generate(prompt, { operationType: 'precise' });
    console.log(precise, '\n');
  } catch (error) {
    console.error('Error:', getErrorMessage(error));
  }
}

/**
 * Example 8: Using specific models
 */
export async function example8_specificModels() {
  console.log('🌙 Example 8: Specific Models\n');
  
  const prompt = 'Write one sentence about ghosts.';
  
  try {
    // Fast and cheap (Haiku)
    console.log('Using Claude Haiku (fast):');
    const haiku = await generate(prompt, {
      modelId: 'anthropic.claude-3-haiku-20240307-v1:0'
    });
    console.log(haiku, '\n');
    
    // High quality (Sonnet)
    console.log('Using Claude Sonnet (quality):');
    const sonnet = await generate(prompt, {
      modelId: 'anthropic.claude-3-sonnet-20240229-v1:0'
    });
    console.log(sonnet, '\n');
  } catch (error) {
    console.error('Error:', getErrorMessage(error));
  }
}

// Run all examples (uncomment to test)
// Note: This requires valid AWS credentials
/*
async function runAllExamples() {
  await example1_basicGeneration();
  await example2_withSystemPrompt();
  await example3_streaming();
  await example4_tokenEstimation();
  await example5_errorHandling();
  await example6_credentialCheck();
  await example7_operationTypes();
  await example8_specificModels();
}

runAllExamples().catch(console.error);
*/
