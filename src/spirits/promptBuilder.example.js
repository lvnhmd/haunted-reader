/**
 * Example usage of the Prompt Builder
 * Run with: node src/spirits/promptBuilder.example.js
 */

import { buildPrompt, buildBedrockPrompt, PROMPT_TYPES, estimateTokens } from './promptBuilder.js';

// Sample text to interpret
const sampleText = `The old house stood at the end of the lane. Nobody had lived there for years. 
Sarah approached the door, her hand trembling as she reached for the handle.`;

console.log('🎃 Haunted Reader - Prompt Builder Examples\n');
console.log('=' .repeat(60));

// Example 1: Build a basic prompt
console.log('\n📝 Example 1: Basic Prompt for Poe Summary');
console.log('-'.repeat(60));
const poePrompt = buildPrompt('poe', PROMPT_TYPES.SUMMARY, sampleText);
console.log('Spirit:', poePrompt.spiritId);
console.log('Type:', poePrompt.promptType);
console.log('\nSystem Prompt:');
console.log(poePrompt.systemPrompt);
console.log('\nUser Message (truncated):');
console.log(poePrompt.userMessage.substring(0, 200) + '...');

// Example 2: Build Bedrock-formatted prompt
console.log('\n\n🤖 Example 2: Bedrock-Formatted Prompt');
console.log('-'.repeat(60));
const bedrockPrompt = buildBedrockPrompt('lovecraft', PROMPT_TYPES.REWRITE, sampleText, {
  maxTokens: 2000,
  temperature: 0.8
});
console.log('Bedrock Request Structure:');
console.log(JSON.stringify({
  messages: bedrockPrompt.messages.map(m => ({ role: m.role, content: m.content.substring(0, 50) + '...' })),
  system: bedrockPrompt.system.substring(0, 100) + '...',
  max_tokens: bedrockPrompt.max_tokens,
  temperature: bedrockPrompt.temperature
}, null, 2));

// Example 3: Token estimation
console.log('\n\n📊 Example 3: Token Estimation');
console.log('-'.repeat(60));
const hemingwayPrompt = buildPrompt('hemingway', PROMPT_TYPES.ENDING, sampleText);
const tokens = estimateTokens(hemingwayPrompt.userMessage);
console.log(`Estimated tokens for Hemingway ending prompt: ${tokens}`);
console.log(`Character count: ${hemingwayPrompt.userMessage.length}`);
console.log(`Ratio: ~${(hemingwayPrompt.userMessage.length / tokens).toFixed(2)} chars/token`);

// Example 4: Different spirits, same text
console.log('\n\n👻 Example 4: Multiple Spirit Perspectives');
console.log('-'.repeat(60));
const spirits = ['poe', 'austen', 'child', 'villain'];
spirits.forEach(spiritId => {
  const prompt = buildPrompt(spiritId, PROMPT_TYPES.ANALYSIS, sampleText);
  console.log(`\n${spiritId.toUpperCase()}:`);
  console.log(prompt.userMessage.substring(0, 150) + '...');
});

console.log('\n\n' + '='.repeat(60));
console.log('✨ All examples completed successfully!');
