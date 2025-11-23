# Spirit Engine

The Spirit Engine is the core of The Haunted Reader, managing literary spirit personalities and AI prompt generation.

## Components

### 1. Spirit Definitions (`spiritDefinitions.js`)
Defines all literary spirits with their unique voices, personalities, and prompt templates.

**Features:**
- 10 distinct spirits (Poe, Dickens, Austen, Lovecraft, Hemingway, The Villain, A 5-Year-Old, The Old Scholar, The Monster, Prophet of Doom)
- Each spirit has unique voice characteristics (tone, vocabulary, structure, focus)
- Four prompt types per spirit: summary, rewrite, ending, analysis
- Helper functions: `getSpiritById()`, `getSpiritsByCategory()`, `validateSpirits()`

### 2. Prompt Builder (`promptBuilder.js`)
Constructs AI prompts from spirit templates with variable substitution and Bedrock formatting.

**Key Functions:**

#### `buildPrompt(spiritId, promptType, text, options)`
Builds a prompt with system and user messages.

```javascript
const prompt = buildPrompt('poe', 'summary', 'Your text here');
// Returns: { userMessage, systemPrompt, spiritId, promptType }
```

#### `buildBedrockPrompt(spiritId, promptType, text, options)`
Formats prompts specifically for Amazon Bedrock Claude API.

```javascript
const bedrockRequest = buildBedrockPrompt('lovecraft', 'rewrite', 'Your text here', {
  maxTokens: 2000,
  temperature: 0.8
});
// Returns Bedrock-compatible request with messages array and system field
```

#### `validatePromptTemplate(template, requiredPlaceholders)`
Validates that prompt templates meet requirements.

#### `estimateTokens(text)`
Estimates token count using ~4 characters per token approximation.

#### `optimizePrompt(prompt)`
Removes excessive whitespace while preserving structure.

## Usage Examples

### Basic Prompt Generation
```javascript
import { buildPrompt, PROMPT_TYPES } from './promptBuilder.js';

const text = 'The old house stood at the end of the lane.';
const prompt = buildPrompt('poe', PROMPT_TYPES.SUMMARY, text);

console.log(prompt.systemPrompt); // Voice characteristics
console.log(prompt.userMessage);  // Prompt with text substituted
```

### Bedrock API Integration
```javascript
import { buildBedrockPrompt } from './promptBuilder.js';

const bedrockRequest = buildBedrockPrompt('hemingway', 'ending', text, {
  maxTokens: 1500,
  temperature: 0.7
});

// Use with AWS Bedrock SDK
// await bedrockClient.invokeModel({ body: JSON.stringify(bedrockRequest) });
```

### Token Estimation
```javascript
import { estimateTokens } from './promptBuilder.js';

const prompt = buildPrompt('austen', 'analysis', longText);
const tokens = estimateTokens(prompt.userMessage);
console.log(`Estimated cost: ${tokens} tokens`);
```

## Prompt Types

- **summary**: Summarize text from spirit's perspective
- **rewrite**: Rewrite text in spirit's style
- **ending**: Generate an ending for incomplete text
- **analysis**: Analyze text through spirit's lens

## Correctness Properties

The Spirit Engine implements these correctness properties:

- **CP-1.1**: Each spirit has a unique ID (validated by `validateSpirits()`)
- **CP-1.2**: All prompt templates include `{text}` placeholder (validated by tests)
- **CP-1.3**: Spirit voice characteristics are consistent across all prompts
- **CP-1.4**: At least 10 spirits are defined

## Testing

Run tests with:
```bash
npm test
```

Run example demonstrations:
```bash
node src/spirits/promptBuilder.example.js
```

## Architecture

```
Spirit Engine
├── spiritDefinitions.js    # Spirit data and voice profiles
├── promptBuilder.js         # Prompt construction and formatting
├── promptBuilder.test.js    # Unit tests (22 tests)
├── promptBuilder.example.js # Usage examples
└── README.md               # This file
```

## Next Steps

The Spirit Engine is now ready for integration with:
- AI Service (TASK-4) - Will use `buildBedrockPrompt()` to call Bedrock
- Interpretation Engine (TASK-6) - Will orchestrate spirit selection and generation
- Spirit Gallery UI (TASK-9) - Will display spirits from `spiritDefinitions.js`
