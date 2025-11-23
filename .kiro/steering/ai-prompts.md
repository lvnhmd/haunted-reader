---
inclusion: fileMatch
fileMatchPattern: "**/spirits/**,**/services/ai**"
---

# AI Prompt Engineering Guidelines for Amazon Bedrock

## Bedrock-Specific Considerations

This project uses **Amazon Bedrock** with Claude 3 models. Key differences from direct API access:
- Use AWS SDK (`@aws-sdk/client-bedrock-runtime`)
- Authenticate via Cognito Identity Pool
- Use `InvokeModelCommand` for standard requests
- Use `InvokeModelWithResponseStreamCommand` for streaming
- Handle Bedrock-specific errors (ThrottlingException, ValidationException)

## Prompt Structure Best Practices

### System Prompts
Always include a system prompt that establishes the spirit's identity:

```javascript
const systemPrompt = `You are ${spirit.name}, ${spirit.description}.
Your writing style is characterized by: ${spirit.voice.tone}.
You focus on: ${spirit.voice.focus}.
Maintain this voice consistently throughout your response.`;
```

**Note**: For Bedrock Claude models, system prompts are passed in the `system` field, not as a message.

### User Prompts
Structure user prompts with clear instructions:

```javascript
const userPrompt = `${instruction}

Text to process:
"""
${text}
"""

Requirements:
- Maintain the original plot and meaning
- Write in the distinctive voice of ${spirit.name}
- Length: approximately ${targetLength} words
- Tone: ${spirit.voice.tone}`;
```

## Token Management

### Estimation
- Average: 1 token ≈ 4 characters
- Be conservative: multiply by 1.25 for safety margin
- Reserve tokens for response (typically 1000-2000)

### Optimization
- Trim unnecessary whitespace
- Remove redundant instructions
- Use concise language in prompts
- Truncate very long texts with "..." indicator

```javascript
function optimizePrompt(text, maxTokens = 3000) {
  const estimatedTokens = Math.ceil(text.length / 4);
  if (estimatedTokens > maxTokens) {
    const maxChars = maxTokens * 4;
    return text.slice(0, maxChars) + '\n\n[Text truncated for length...]';
  }
  return text;
}
```

## Spirit-Specific Prompt Patterns

### For Rewriting (Style Transfer)
```
Rewrite the following text in the distinctive style of [SPIRIT].

Key style elements to incorporate:
- Vocabulary: [spirit-specific words]
- Sentence structure: [spirit-specific structure]
- Tone: [spirit-specific tone]
- Focus: [what this spirit emphasizes]

Preserve the original:
- Plot and events
- Character names and relationships
- Core meaning and message

Original text:
"""
{text}
"""

Rewritten version:
```

### For Summaries (Perspective Analysis)
```
Summarize the following text from the perspective of [SPIRIT].

Your summary should:
- Highlight what [SPIRIT] would find most significant
- Use [SPIRIT]'s characteristic vocabulary and tone
- Be approximately [X] words
- Maintain objectivity about plot while showing [SPIRIT]'s lens

Text to summarize:
"""
{text}
"""

Summary:
```

### For Endings (Creative Generation)
```
The following text is incomplete. Generate an ending as [SPIRIT] would write it.

Context from the text:
"""
{text}
"""

Your ending should:
- Continue naturally from where the text stops
- Resolve or develop the narrative in [SPIRIT]'s style
- Be 200-500 words
- Reflect [SPIRIT]'s worldview and themes

Ending:
```

### For Analysis (Critical Interpretation)
```
Analyze the following text through the lens of [SPIRIT].

Consider:
- What themes would [SPIRIT] identify?
- What would [SPIRIT] praise or criticize?
- How does this text align with [SPIRIT]'s worldview?
- What deeper meaning would [SPIRIT] find?

Text to analyze:
"""
{text}
"""

Analysis:
```

## Error Handling in Prompts

### Content Filtering
If content is flagged, retry with sanitized version:

```javascript
async function generateWithFallback(prompt, spirit) {
  try {
    return await aiService.generate(prompt);
  } catch (error) {
    if (error.type === 'content_filter') {
      // Retry with more explicit safety instructions
      const safePrompt = `${prompt}\n\nNote: Keep content appropriate and avoid graphic descriptions.`;
      return await aiService.generate(safePrompt);
    }
    throw error;
  }
}
```

### Token Limit Exceeded
Automatically truncate and retry:

```javascript
async function generateWithTruncation(text, spirit, promptType) {
  let currentText = text;
  let attempts = 0;
  
  while (attempts < 3) {
    try {
      const prompt = buildPrompt(spirit, promptType, currentText);
      return await aiService.generate(prompt);
    } catch (error) {
      if (error.type === 'token_limit') {
        // Reduce text by 25% and retry
        currentText = currentText.slice(0, Math.floor(currentText.length * 0.75));
        attempts++;
      } else {
        throw error;
      }
    }
  }
  
  throw new Error('Text too long even after truncation');
}
```

## Temperature Settings

Different tasks need different creativity levels:

```javascript
const temperatureSettings = {
  summary: 0.3,      // Low - factual, consistent
  rewrite: 0.7,      // Medium-high - creative but controlled
  ending: 0.8,       // High - creative and varied
  analysis: 0.5      // Medium - balanced interpretation
};
```

## Caching Strategy

Cache prompts to avoid regeneration:

```javascript
function getCacheKey(text, spiritId, promptType) {
  // Use hash for long texts
  const textHash = text.length > 1000 
    ? hashString(text) 
    : text;
  return `${spiritId}:${promptType}:${textHash}`;
}

async function generateWithCache(text, spiritId, promptType) {
  const cacheKey = getCacheKey(text, spiritId, promptType);
  
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  // Generate and cache
  const result = await generate(text, spiritId, promptType);
  cache.set(cacheKey, result, { ttl: 3600 }); // 1 hour
  
  return result;
}
```

## Testing Prompts

Always test prompts with these sample texts:

### Short Text (50 words)
> "The old house stood at the end of the lane. Nobody had lived there for years. Sarah approached the door, her hand trembling as she reached for the handle. Inside, she could hear something moving."

### Medium Text (200 words)
> "The storm had been building all day. Dark clouds rolled across the sky like an invading army, and the wind howled through the trees with increasing fury. Margaret stood at the window of her cottage, watching the chaos unfold. She had lived here for thirty years, through countless storms, but something about this one felt different. The animals had been restless since morning, and the old dog refused to leave her side. When the first drops of rain began to fall, they came with such force that they sounded like pebbles against the glass. Margaret turned from the window and checked the candles, the matches, the emergency supplies she kept in the cupboard. The power would go out soon—it always did in storms like this. But she was prepared. She had learned long ago that preparation was the difference between fear and confidence. As darkness fell and the storm reached its peak, Margaret sat in her chair by the fire, the dog at her feet, and waited. Whatever the night would bring, she would face it as she had faced everything else: with patience, with courage, and with the quiet strength that came from knowing she had survived worse."

### Long Text (500+ words)
Use a full chapter from a public domain book.

## Spooky Error Messages

When AI generation fails, use themed error messages:

```javascript
const spookyErrors = {
  timeout: "The spirits are taking too long to respond... try summoning them again.",
  rate_limit: "Too many spirits summoned at once! Please wait a moment before trying again.",
  invalid_key: "The séance circle is broken. Check your API key configuration.",
  content_filter: "The spirits refuse to speak of such dark matters. Try different text.",
  token_limit: "The text is too long for the spirits to process. Try a shorter passage.",
  network_error: "The connection to the spirit realm has been severed. Check your internet connection."
};
```

## Performance Optimization

### Parallel Generation
Generate multiple interpretations simultaneously:

```javascript
async function generateMultipleInterpretations(text, spiritIds) {
  const promises = spiritIds.map(spiritId => 
    generateInterpretation(text, spiritId)
  );
  
  // Use Promise.allSettled to handle individual failures
  const results = await Promise.allSettled(promises);
  
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);
}
```

### Streaming for Long Responses
Use streaming for better UX:

```javascript
async function generateWithStreaming(prompt, onChunk) {
  let fullResponse = '';
  
  await aiService.generateStreaming(prompt, (chunk) => {
    fullResponse += chunk;
    onChunk(chunk, fullResponse);
  });
  
  return fullResponse;
}
```

## Model Selection (Amazon Bedrock)

Choose appropriate Bedrock models for different tasks:

```javascript
const modelSelection = {
  summary: 'anthropic.claude-3-haiku-20240307-v1:0',      // Fast, cheap ($0.25/1M tokens)
  rewrite: 'anthropic.claude-3-sonnet-20240229-v1:0',     // Best quality ($3/1M tokens)
  ending: 'anthropic.claude-3-sonnet-20240229-v1:0',      // Creative
  analysis: 'anthropic.claude-3-haiku-20240307-v1:0',     // Fast analysis
  quick_preview: 'anthropic.claude-3-haiku-20240307-v1:0' // Fast previews
};
```

**Cost Optimization**:
- Use Haiku for development/testing
- Use Sonnet for final demo and quality-critical features
- Haiku is ~12x cheaper than Sonnet

## Bedrock Error Handling

Handle Bedrock-specific exceptions:

```javascript
function handleBedrockError(error) {
  switch (error.name) {
    case 'ThrottlingException':
      return 'The spirits are overwhelmed! Please wait a moment and try again.';
    case 'ValidationException':
      return 'The text is too long for the spirits to process. Try a shorter passage.';
    case 'AccessDeniedException':
      return 'Unable to reach the spirit realm. Check your AWS configuration.';
    case 'ModelNotReadyException':
      return 'The spirits are awakening... Model not yet available.';
    default:
      return 'The spirits are restless... try again.';
  }
}
```

Remember: The quality of your prompts directly impacts the quality of the spirits' voices!
