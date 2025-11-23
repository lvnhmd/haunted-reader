/**
 * Example usage of the Interpretation Engine
 * Demonstrates how to generate interpretations from literary spirits
 */

import {
  generateSummary,
  rewriteText,
  analyzeText,
  generateEnding
} from './interpretationEngine.js';

// Example text to interpret
const sampleText = `
It was a dark and stormy night. The old mansion stood alone on the hill,
its windows like hollow eyes staring into the tempest. Inside, a lone candle
flickered in the study, casting dancing shadows on the walls.
`;

/**
 * Example 1: Generate a summary from Poe's perspective
 */
async function exampleSummary() {
  console.log('=== Example 1: Generate Summary ===\n');
  
  try {
    const summary = await generateSummary(sampleText, 'poe');
    
    console.log(`Spirit: ${summary.spiritName}`);
    console.log(`Type: ${summary.type}`);
    console.log(`Generated at: ${summary.generatedAt}`);
    console.log(`Word count: ${summary.wordCount} (original: ${summary.originalWordCount})`);
    console.log(`\nContent:\n${summary.content}`);
  } catch (error) {
    console.error('Error generating summary:', error.message);
  }
}

/**
 * Example 2: Rewrite text in Hemingway's minimalist style
 */
async function exampleRewrite() {
  console.log('\n=== Example 2: Rewrite Text ===\n');
  
  try {
    const rewrite = await rewriteText(sampleText, 'hemingway');
    
    console.log(`Spirit: ${rewrite.spiritName}`);
    console.log(`Type: ${rewrite.type}`);
    console.log(`\nContent:\n${rewrite.content}`);
  } catch (error) {
    console.error('Error rewriting text:', error.message);
  }
}

/**
 * Example 3: Analyze text from The Villain's perspective
 */
async function exampleAnalysis() {
  console.log('\n=== Example 3: Analyze Text ===\n');
  
  try {
    const analysis = await analyzeText(sampleText, 'villain');
    
    console.log(`Spirit: ${analysis.spiritName}`);
    console.log(`Type: ${analysis.type}`);
    console.log(`\nContent:\n${analysis.content}`);
  } catch (error) {
    console.error('Error analyzing text:', error.message);
  }
}

/**
 * Example 4: Generate multiple endings in parallel
 */
async function exampleParallelEndings() {
  console.log('\n=== Example 4: Generate Multiple Endings (Parallel) ===\n');
  
  const incompleteText = `
  The detective approached the locked door. Behind it, he could hear
  muffled voices and the sound of something heavy being dragged across
  the floor. His hand reached for the doorknob...
  `;
  
  try {
    // Generate endings from 3 different spirits in parallel
    const endings = await generateEnding(
      incompleteText,
      ['poe', 'lovecraft', 'child']
    );
    
    console.log(`Generated ${endings.length} endings:\n`);
    
    endings.forEach((ending, index) => {
      console.log(`\n--- Ending ${index + 1}: ${ending.spiritName} ---`);
      if (ending.error) {
        console.log(`Error: ${ending.error}`);
      } else {
        console.log(ending.content);
      }
    });
  } catch (error) {
    console.error('Error generating endings:', error.message);
  }
}

/**
 * Example 5: Using cache to avoid duplicate API calls
 */
async function exampleCaching() {
  console.log('\n=== Example 5: Caching ===\n');
  
  try {
    console.log('First call (will hit API):');
    const start1 = Date.now();
    const summary1 = await generateSummary(sampleText, 'poe');
    const time1 = Date.now() - start1;
    console.log(`Time: ${time1}ms`);
    console.log(`Content length: ${summary1.content.length} chars`);
    
    console.log('\nSecond call (will use cache):');
    const start2 = Date.now();
    const summary2 = await generateSummary(sampleText, 'poe');
    const time2 = Date.now() - start2;
    console.log(`Time: ${time2}ms`);
    console.log(`Content length: ${summary2.content.length} chars`);
    console.log(`Same content: ${summary1.content === summary2.content}`);
    
    console.log(`\nCache speedup: ${(time1 / time2).toFixed(1)}x faster`);
  } catch (error) {
    console.error('Error demonstrating cache:', error.message);
  }
}

/**
 * Example 6: Custom options
 */
async function exampleCustomOptions() {
  console.log('\n=== Example 6: Custom Options ===\n');
  
  try {
    // Generate with custom temperature for more creative output
    const creative = await generateSummary(sampleText, 'lovecraft', {
      temperature: 0.9,
      maxTokens: 500
    });
    
    console.log(`Spirit: ${creative.spiritName}`);
    console.log(`Options: temperature=0.9, maxTokens=500`);
    console.log(`\nContent:\n${creative.content}`);
  } catch (error) {
    console.error('Error with custom options:', error.message);
  }
}

// Run examples
async function runExamples() {
  console.log('🎃 Haunted Reader - Interpretation Engine Examples 🎃\n');
  console.log('Note: These examples require AWS credentials to be configured.\n');
  
  // Uncomment the examples you want to run:
  
  // await exampleSummary();
  // await exampleRewrite();
  // await exampleAnalysis();
  // await exampleParallelEndings();
  // await exampleCaching();
  // await exampleCustomOptions();
  
  console.log('\n✨ Examples complete! ✨');
}

// Export for use in other files
export {
  exampleSummary,
  exampleRewrite,
  exampleAnalysis,
  exampleParallelEndings,
  exampleCaching,
  exampleCustomOptions
};

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples();
}
