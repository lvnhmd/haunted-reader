# AI Service Documentation

## Overview

The AI Service provides integration with Amazon Bedrock for text generation in The Haunted Reader. It handles model selection, retry logic, token estimation, and error handling.

## Setup

### 1. Configure AWS Credentials

Create a `.env` file in the project root (copy from `.env.example`):

```bash
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:your-pool-id-here
```

### 2. Set up Cognito Identity Pool

See `.kiro/BEDROCK_SETUP.md` for detailed instructions on:
- Creating a Cognito Identity Pool
- Configuring IAM roles with Bedrock permissions
- Testing your setup

## Usage

### Basic Text Generation

```javascript
import { generate } from './services/aiService.js';

// Generate text with default settings
const result = await generate('Write a spooky story about a haunted house');

// Generate with custom options
const result = await generate(
  'Rewrite this text in the style of Edgar Allan Poe',
  {
    systemPrompt: 'You are Edgar Allan Poe, master of Gothic horror.',
    operationType: 'creative',
    temperature: 0.9
  }
);
```

### Streaming Generation

```javascript
import { generateStreaming } from './services/aiService.js';

// Stream text chunks as they're generated
for await (const chunk of generateStreaming('Tell me a ghost story')) {
  console.log(chunk); // Process each chunk
}
```

### Token Estimation

```javascript
import { estimateTokens } from './services/aiService.js';

const text = 'Your text here...';
const tokenCount = estimateTokens(text);
console.log(`Estimated tokens: ${tokenCount}`);
```

### Error Handling

```javascript
import { generate, getErrorMessage } from './services/aiService.js';

try {
  const result = await generate('Your prompt');
} catch (error) {
  const friendlyMessage = getErrorMessage(error);
  console.error(friendlyMessage); // Spooky, user-friendly error
}
```

## API Reference

### `generate(prompt, options)`

Generate text using AI model.

**Parameters:**
- `prompt` (string): The text prompt to send to the model
- `options` (object, optional):
  - `systemPrompt` (string): System prompt to set context
  - `modelId` (string): Specific model ID (defaults to recommended model)
  - `operationType` (string): 'creative', 'balanced', or 'precise'
  - `temperature` (number): 0-1, controls randomness
  - `topP` (number): 0-1, controls diversity
  - `maxTokens` (number): Maximum tokens to generate

**Returns:** Promise<string> - Generated text

### `generateStreaming(prompt, options)`

Generate text with streaming response.

**Parameters:** Same as `generate()`

**Returns:** AsyncGenerator<string> - Yields text chunks

### `estimateTokens(text)`

Estimate token count for text (within 10% accuracy).

**Parameters:**
- `text` (string): Text to estimate

**Returns:** number - Estimated token count

### `checkCredentials()`

Validate AWS credentials are configured correctly.

**Returns:** Promise<boolean> - True if credentials are valid

### `getErrorMessage(error)`

Get user-friendly, spooky error message.

**Parameters:**
- `error` (Error): The error object

**Returns:** string - Friendly error message

## Available Models

### Claude 3 Haiku (Fast & Cheap)
- **ID:** `anthropic.claude-3-haiku-20240307-v1:0`
- **Use for:** Quick summaries, fast interpretations
- **Cost:** $0.25 per 1M input tokens

### Claude 3 Sonnet (Balanced)
- **ID:** `anthropic.claude-3-sonnet-20240229-v1:0`
- **Use for:** High-quality rewrites, detailed analysis
- **Cost:** $3 per 1M input tokens

### Amazon Titan Express (AWS Native)
- **ID:** `amazon.titan-text-express-v1`
- **Use for:** Basic operations
- **Cost:** $0.20 per 1M input tokens

## Operation Types

The service provides three preset operation types:

- **creative**: High temperature (0.9), best for creative writing
- **balanced**: Medium temperature (0.7), good for most tasks
- **precise**: Low temperature (0.3), best for factual content

## Error Handling

The service automatically:
- Retries failed requests up to 3 times with exponential backoff
- Handles Bedrock throttling exceptions
- Provides spooky, user-friendly error messages
- Validates credentials before making requests

## Retry Logic

Retryable errors:
- `ThrottlingException`
- `ServiceUnavailableException`
- `TooManyRequestsException`
- `InternalServerException`
- `ModelTimeoutException`
- HTTP 429 (Too Many Requests)
- HTTP 5xx (Server Errors)

Backoff schedule: 1s, 2s, 4s

## Testing

Run tests:
```bash
npm test src/services/aiService.test.js
```

Note: Full integration tests require valid AWS credentials.

## Troubleshooting

### "The spirits deny you access"
- Check your Cognito Identity Pool ID in `.env`
- Verify IAM role has `bedrock:InvokeModel` permission
- Ensure Bedrock is enabled in your AWS region

### "Too many spirits summoned at once"
- You're hitting rate limits
- The service will automatically retry with backoff
- Consider using Haiku model for faster operations

### Token estimation seems off
- Estimation is within 10% accuracy for English prose
- Code and special characters may have different token ratios
- Use actual token counts from API responses for billing

## Architecture

```
aiService.js (Main API)
    ↓
bedrockProvider.js (AWS Integration)
    ↓
bedrockModels.js (Model Configs)
```

## Best Practices

1. **Use appropriate models**: Haiku for speed, Sonnet for quality
2. **Cache results**: Don't regenerate the same content
3. **Handle errors gracefully**: Always use try-catch
4. **Estimate tokens first**: Avoid exceeding limits
5. **Use streaming for long content**: Better UX
6. **Set reasonable maxTokens**: Prevent runaway costs

## Security

- ✅ Uses Cognito temporary credentials (no hardcoded keys)
- ✅ Credentials never exposed in client code
- ✅ Environment variables for configuration
- ✅ IAM role-based access control

## Future Enhancements

- Response caching layer
- Token usage tracking
- Cost estimation
- Model performance metrics
- A/B testing different models


---

# File Parser Service Documentation

## Overview

The File Parser Service extracts text from uploaded files (TXT, PDF, EPUB) and analyzes their structure. It's the entry point for getting text into The Haunted Reader.

## Features

- 📄 Parse TXT, PDF, and EPUB files
- 📊 Calculate metadata (word count, read time)
- 📖 Detect chapters and sections
- 🔍 Preserve paragraph structure
- ⚡ Fast parsing (<10s for 10MB files)
- 🎃 Spooky error messages

## Usage

### Parse an Uploaded File

```javascript
import { parseFile } from './services/fileParser.js';

// In a file upload handler
const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  
  try {
    const result = await parseFile(file);
    
    console.log('Content:', result.content);
    console.log('Word count:', result.metadata.wordCount);
    console.log('Chapters:', result.structure.chapters.length);
    console.log('Read time:', result.metadata.estimatedReadTime, 'minutes');
  } catch (error) {
    console.error(error.message); // Spooky error message
  }
};
```

### Parse Pasted Text

```javascript
import { parseText } from './services/fileParser.js';

const result = parseText('Your text here...');

console.log('Paragraphs:', result.structure.paragraphs.length);
console.log('Word count:', result.metadata.wordCount);
```

## API Reference

### `parseFile(file)`

Parse an uploaded file and extract text with structure.

**Parameters:**
- `file` (File): The file to parse (TXT, PDF, or EPUB)

**Returns:** Promise<ParsedText>

**Throws:**
- File size exceeds 10MB
- Unsupported file type
- Parsing errors

### `parseText(text)`

Parse text directly without file upload.

**Parameters:**
- `text` (string): The text to parse

**Returns:** ParsedText

**Throws:**
- Text is empty
- Invalid input type

## ParsedText Object

Both methods return a ParsedText object:

```javascript
{
  content: string,           // Full text content
  structure: {
    chapters: [              // Detected chapters
      {
        title: 'Chapter 1',
        lineIndex: 0,
        charIndex: 0
      }
    ],
    sections: [],            // Detected sections
    paragraphs: [            // Individual paragraphs
      'First paragraph...',
      'Second paragraph...'
    ]
  },
  metadata: {
    wordCount: 1234,
    characterCount: 5678,
    estimatedReadTime: 7     // minutes (200 words/min)
  },
  fileName: 'story.txt',
  fileType: 'txt' | 'pdf' | 'epub'
}
```

## Supported File Types

### Plain Text (.txt)
- Direct text extraction
- Fastest parsing
- Preserves all formatting

### PDF (.pdf)
- Multi-page extraction using pdfjs-dist
- Works with text-based PDFs
- Note: Scanned PDFs (images) require OCR

### EPUB (.epub)
- Chapter/section extraction using epubjs
- Handles HTML content
- Preserves reading order

## Structure Detection

### Chapter Detection

Automatically detects common chapter patterns:
- "Chapter 1", "Chapter I", "Ch. 1"
- "Part 1", "Section 1"
- Roman numerals: "I.", "II.", "III."
- Numeric patterns: "1.", "2.", "3."

**Accuracy:** 80%+ for standard formats

### Paragraph Detection

Paragraphs are separated by:
- Empty lines (double line breaks)
- Preserved from original formatting

## File Validation

The service validates:
- **File size:** Maximum 10MB
- **File type:** TXT, PDF, or EPUB only
- **Content:** Non-empty files

## Error Messages

Spooky, user-friendly errors:
- "The spirits couldn't read this file: [reason]"
- "File size exceeds maximum of 10MB"
- "Unsupported file type. Please upload a TXT, PDF, or EPUB file."
- "Text is empty"

## Performance

- **CP-2.1:** Handles files up to 10MB ✅
- **CP-2.2:** Preserves paragraph breaks ✅
- **CP-2.3:** Detects 80%+ of chapter markers ✅
- **CP-2.4:** Completes within 10 seconds ✅
- **CP-2.5:** Descriptive error messages ✅

## Examples

See `fileParser.example.js` for complete examples:

```javascript
import { exampleParseFile, exampleParseText } from './services/fileParser.example.js';

// Parse a file
await exampleParseFile(file);

// Parse text
exampleParseText();
```

## Testing

Run tests:
```bash
npm test src/services/fileParser.test.js
```

All 7 tests passing ✅

## React Integration

```javascript
import { parseFile } from './services/fileParser.js';

function FileUploader() {
  const [parsedText, setParsedText] = useState(null);
  const [error, setError] = useState(null);
  
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    
    try {
      const result = await parseFile(file);
      setParsedText(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      setParsedText(null);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept=".txt,.pdf,.epub"
        onChange={handleUpload}
      />
      {error && <p className="error">{error}</p>}
      {parsedText && (
        <div>
          <p>Words: {parsedText.metadata.wordCount}</p>
          <p>Read time: {parsedText.metadata.estimatedReadTime} min</p>
          <p>Chapters: {parsedText.structure.chapters.length}</p>
        </div>
      )}
    </div>
  );
}
```

## Known Limitations

1. **PDF Parsing:** 
   - Only works with text-based PDFs
   - Scanned PDFs (images) require OCR
   - Complex layouts may have extraction issues

2. **EPUB Parsing:**
   - Some complex EPUB formats may have issues
   - Embedded media is ignored
   - DRM-protected files not supported

3. **Chapter Detection:**
   - Works for common patterns
   - May miss unconventional chapter markers
   - Custom formats may need manual adjustment

## Best Practices

1. **Validate before parsing:** Check file type and size client-side
2. **Show progress:** Display loading state during parsing
3. **Handle errors gracefully:** Show user-friendly messages
4. **Cache results:** Don't re-parse the same file
5. **Limit file size:** 10MB is the maximum

## Troubleshooting

### PDF not parsing correctly
- Ensure it's a text-based PDF (not scanned)
- Try converting to TXT first
- Check PDF isn't corrupted

### EPUB chapters missing
- Some EPUBs have non-standard structure
- Try opening in an EPUB reader to verify
- Check if file is DRM-protected

### Chapter detection not working
- Verify chapter markers follow common patterns
- Check if markers are in ALL CAPS
- May need custom detection logic

## Architecture

```
fileParser.js (Orchestrator)
    ↓
├── parsers/txtParser.js (Plain text)
├── parsers/pdfParser.js (PDF via pdfjs-dist)
└── parsers/epubParser.js (EPUB via epubjs)
```

## Future Enhancements

- DOCX support
- RTF support
- OCR for scanned PDFs
- Custom chapter pattern configuration
- Progress callbacks for large files
- Streaming parsing for huge files

---

# Interpretation Engine Documentation

## Overview

The Interpretation Engine combines literary spirits with AI to generate text interpretations. It's the core feature of The Haunted Reader that brings spirits to life.

## Features

- ✨ Generate summaries from spirit perspectives
- 🎭 Rewrite text in different literary styles
- 🔍 Analyze text through various lenses
- 📖 Generate alternative endings from multiple spirits in parallel
- 💾 Automatic caching to prevent duplicate API calls
- ⚡ Smart model selection based on text length

## Usage

### Generate a Summary

```javascript
import { generateSummary } from './services/interpretationEngine.js';

const summary = await generateSummary(
  'Your text here...',
  'poe' // Spirit ID
);

console.log(summary.content);
console.log(`Generated by: ${summary.spiritName}`);
```

### Rewrite Text

```javascript
import { rewriteText } from './services/interpretationEngine.js';

const rewrite = await rewriteText(
  'Your text here...',
  'hemingway' // Minimalist style
);

console.log(rewrite.content);
```

### Analyze Text

```javascript
import { analyzeText } from './services/interpretationEngine.js';

const analysis = await analyzeText(
  'Your text here...',
  'scholar' // Academic perspective
);

console.log(analysis.content);
```

### Generate Multiple Endings (Parallel)

```javascript
import { generateEnding } from './services/interpretationEngine.js';

// Generate endings from 3 spirits in parallel
const endings = await generateEnding(
  'Incomplete story...',
  ['poe', 'lovecraft', 'villain']
);

endings.forEach(ending => {
  console.log(`${ending.spiritName}: ${ending.content}`);
});
```

## API Reference

### `generateSummary(text, spiritId, options)`

Generate a summary from a spirit's perspective.

**Parameters:**
- `text` (string): The text to summarize
- `spiritId` (string): Spirit ID (e.g., 'poe', 'hemingway')
- `options` (object, optional):
  - `useCache` (boolean): Use cache (default: true)
  - `temperature` (number): AI temperature
  - `maxTokens` (number): Max tokens to generate
  - Other AI service options

**Returns:** Promise<Interpretation>

### `rewriteText(text, spiritId, options)`

Rewrite text in a spirit's distinctive style.

**Parameters:** Same as `generateSummary()`

**Returns:** Promise<Interpretation>

### `analyzeText(text, spiritId, options)`

Analyze text from a spirit's perspective.

**Parameters:** Same as `generateSummary()`

**Returns:** Promise<Interpretation>

### `generateEnding(text, spiritIds, options)`

Generate alternative endings from multiple spirits in parallel.

**Parameters:**
- `text` (string): The incomplete text
- `spiritIds` (Array<string>): Array of spirit IDs
- `options` (object, optional): Same as other methods

**Returns:** Promise<Array<Interpretation>>

## Interpretation Object

All methods return an Interpretation object:

```javascript
{
  spiritId: 'poe',
  spiritName: 'Edgar Allan Poe',
  type: 'summary', // or 'rewrite', 'analysis', 'ending'
  content: 'Generated text...',
  generatedAt: Date,
  wordCount: 150,
  originalWordCount: 200
}
```

## Caching

The engine automatically caches results to optimize costs:

- **Cache key:** hash(text + spiritId + type)
- **Eviction:** LRU with 50MB limit
- **Disable:** `{ useCache: false }`

```javascript
// First call hits API
const summary1 = await generateSummary(text, 'poe');

// Second call uses cache (instant, free)
const summary2 = await generateSummary(text, 'poe');
```

## Model Selection

The engine automatically selects the best model:

- **Short texts (<2000 tokens):** Claude 3 Haiku (fast)
- **Long texts (>2000 tokens):** Claude 3 Sonnet (quality)
- **Rewrites:** Always Sonnet (maintains meaning)
- **Analysis:** Balanced model

## Performance

- **CP-4.1:** Completes within 30 seconds for 5000 words ✅
- **CP-4.2:** Maintains original plot/meaning ✅
- **CP-4.3:** Consistent spirit voice ✅
- **CP-4.4:** Cache prevents duplicate API calls ✅
- **CP-4.5:** Parallel generation supported ✅

## Available Spirits

- **poe** - Edgar Allan Poe (Gothic horror)
- **dickens** - Charles Dickens (Victorian social commentary)
- **austen** - Jane Austen (Romantic wit)
- **lovecraft** - H.P. Lovecraft (Cosmic horror)
- **hemingway** - Ernest Hemingway (Minimalist)
- **villain** - The Villain (Malicious POV)
- **child** - A 5-year-old (Innocent lens)
- **scholar** - The Old Scholar (Academic)
- **monster** - The Monster (Creature perspective)
- **prophet** - Prophet of Doom (Apocalyptic)

## Error Handling

```javascript
import { generateSummary } from './services/interpretationEngine.js';

try {
  const summary = await generateSummary(text, 'poe');
} catch (error) {
  console.error(error.message); // User-friendly spooky error
}
```

Common errors:
- `Text is required and must be a non-empty string`
- `Spirit not found: invalid-spirit`
- `Failed to generate summary: [Bedrock error]`

## Examples

See `interpretationEngine.example.js` for complete examples:

```bash
node src/services/interpretationEngine.example.js
```

## Testing

Run tests:
```bash
npm test src/services/interpretationEngine.test.js
```

## Cache Management

```javascript
import cache from './services/interpretationCache.js';

// Get statistics
const stats = cache.getStats();
console.log(`Cache: ${stats.entries} entries, ${stats.utilizationPercent}% full`);

// Clear cache
cache.clear();
```

## Best Practices

1. **Use caching:** Don't disable unless necessary
2. **Parallel generation:** Use `generateEnding()` for multiple spirits
3. **Choose right spirit:** Match spirit to desired output style
4. **Handle errors:** Always use try-catch
5. **Monitor performance:** Check if interpretations complete in <30s

## Architecture

```
interpretationEngine.js
    ↓
promptBuilder.js (Build prompts)
    ↓
aiService.js (Generate with Bedrock)
    ↓
interpretationCache.js (Cache results)
```

## Troubleshooting

### Interpretations taking too long
- Check text length (should be <5000 words)
- Verify AWS region latency
- Consider using Haiku model for speed

### Cache not working
- Verify cache is enabled: `{ useCache: true }`
- Check cache stats: `cache.getStats()`
- Clear cache if corrupted: `cache.clear()`

### Spirit voice inconsistent
- Ensure system prompt is included
- Try higher temperature for more creativity
- Check spirit definition in `spiritDefinitions.js`

## Future Enhancements

- Streaming interpretations
- Custom spirit creation
- Interpretation comparison tools
- Performance metrics
- Cost tracking per spirit
