---
inclusion: fileMatch
fileMatchPattern: "**/spirits/**"
---

# Spirit Personality Guidelines

When working with spirit definitions, maintain these principles:

## Voice Consistency Rules

Each spirit must have a **distinct and recognizable voice** that remains consistent across all prompt types (summary, rewrite, ending, analysis).

### Edgar Allan Poe
- **Tone**: Melancholic, ornate, obsessed with death and beauty
- **Vocabulary**: "melancholy", "sepulchral", "pallid", "phantasm", "dreary"
- **Structure**: Long, flowing sentences with multiple clauses
- **Focus**: Psychological horror, decay, the macabre

### Charles Dickens
- **Tone**: Social commentary, vivid character descriptions, moral lessons
- **Vocabulary**: "wretched", "benevolent", "industrious", "circumstance"
- **Structure**: Detailed descriptions, parenthetical asides
- **Focus**: Class struggles, redemption, social injustice

### Jane Austen
- **Tone**: Witty, ironic, socially observant
- **Vocabulary**: "sensibility", "propriety", "consequence", "amiable"
- **Structure**: Elegant, balanced sentences with subtle irony
- **Focus**: Social dynamics, romance, character judgment

### H.P. Lovecraft
- **Tone**: Cosmic dread, scientific detachment masking terror
- **Vocabulary**: "eldritch", "cyclopean", "non-Euclidean", "blasphemous", "ineffable"
- **Structure**: Dense, academic prose building to revelation
- **Focus**: Cosmic horror, forbidden knowledge, insignificance of humanity

### Ernest Hemingway
- **Tone**: Sparse, direct, understated emotion
- **Vocabulary**: Simple, concrete words; minimal adjectives
- **Structure**: Short, declarative sentences
- **Focus**: Action, subtext, "iceberg theory"

### The Villain
- **Tone**: Malicious, self-serving, morally inverted
- **Vocabulary**: "foolish", "weak", "deserved", "inevitable"
- **Structure**: Justifications, twisted logic
- **Focus**: Antagonist's perspective, moral relativism

### A 5-Year-Old
- **Tone**: Innocent, curious, simple
- **Vocabulary**: Basic words, "and then", "really really", "scary"
- **Structure**: Simple sentences, stream of consciousness
- **Focus**: Emotional reactions, surface-level understanding

### An Old Scholar
- **Tone**: Academic, analytical, historically informed
- **Vocabulary**: "furthermore", "historically", "one observes", "paradigm"
- **Structure**: Complex, citation-like references
- **Focus**: Historical context, literary analysis, themes

### The Monster
- **Tone**: Outsider perspective, misunderstood, raw emotion
- **Vocabulary**: Physical sensations, isolation, longing
- **Structure**: Fragmented when emotional, eloquent when reflective
- **Focus**: Alienation, humanity from outside, primal needs

### Prophet of Doom
- **Tone**: Apocalyptic, ominous, inevitable
- **Vocabulary**: "foretold", "reckoning", "ashes", "judgment"
- **Structure**: Biblical cadence, pronouncements
- **Focus**: Consequences, warnings, dark futures

## Prompt Template Requirements

Every spirit must have these four prompt types:

1. **Summary Prompt**: "Summarize this text from [spirit]'s perspective..."
2. **Rewrite Prompt**: "Rewrite this text in the style of [spirit]..."
3. **Ending Prompt**: "Generate an ending for this text as [spirit] would..."
4. **Analysis Prompt**: "Analyze this text through [spirit]'s lens..."

All prompts MUST include the `{text}` placeholder for substitution.

## Testing Spirit Consistency

When creating or modifying a spirit, test with this sample text:

> "The old house stood at the end of the lane. Nobody had lived there for years. Sarah approached the door, her hand trembling as she reached for the handle."

Each spirit should produce a distinctly different interpretation that's immediately recognizable as their voice.

## Anti-Patterns to Avoid

❌ **Generic voice**: "The text describes a house and a character named Sarah..."
❌ **Inconsistent tone**: Poe being cheerful, Hemingway being verbose
❌ **Missing personality**: Neutral summaries that could be any spirit
❌ **Anachronistic language**: Austen using modern slang
❌ **Breaking character**: The Villain showing empathy without justification

## Spooky Naming Conventions

Use evocative names for spirit-related variables and functions:
- `summonSpirit()` instead of `getSpirit()`
- `possessText()` instead of `transformText()`
- `spectralVoice` instead of `voiceProfile`
- `hauntedPrompt` instead of `generatedPrompt`
