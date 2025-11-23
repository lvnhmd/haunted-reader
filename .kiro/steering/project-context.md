# Haunted Reader - Project Context

## Project Overview
The Haunted Reader is a Kiroween hackathon entry in the **Frankenstein category**. It's a chimera that stitches together literary analysis, AI text generation, perspective modeling, and spooky UI design.

## Development Principles

### Code Style
- Use modern JavaScript (ES6+)
- Prefer functional components in React
- Keep components small and focused (< 200 lines)
- Use descriptive variable names that fit the spooky theme
- Comment complex logic, especially AI prompt engineering
- Follow AWS SDK best practices for Bedrock integration

### AI Integration
- Use Amazon Bedrock for text generation (Claude 3 Sonnet/Haiku)
- Authenticate via Cognito Identity Pool (no hardcoded API keys)
- Keep prompts modular and reusable
- Cache spirit personality prompts to reduce Bedrock calls
- Handle Bedrock errors gracefully with spooky error messages
- Use Claude 3 Haiku for fast/cheap operations, Sonnet for quality

### UI/UX Guidelines
- Dark theme with purple, green, and orange accents
- Smooth animations for spirit transitions
- Loading states should be thematic (e.g., "Summoning spirits...")
- Use ghost/spirit iconography consistently
- Ensure text remains readable despite spooky styling

### File Structure
```
haunted-reader/
├── src/
│   ├── components/     # React components
│   ├── spirits/        # Spirit personality definitions
│   ├── services/       # API and file processing
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions
│   └── styles/         # CSS/Tailwind config
├── public/             # Static assets
├── .kiro/              # Kiro configuration
└── tests/              # Test files
```

## Spirit Personality Guidelines

Each spirit should have:
- **Name**: Evocative and thematic
- **Icon**: Emoji or SVG representing the spirit
- **Voice**: Distinct writing style and vocabulary
- **Perspective**: Unique lens for interpretation
- **Prompt Template**: Reusable AI prompt structure

Example spirit definition:
```javascript
{
  id: 'poe',
  name: 'Edgar Allan Poe',
  icon: '🦅',
  description: 'Master of Gothic horror and psychological darkness',
  voice: 'Ornate, melancholic, obsessed with death and beauty',
  promptTemplate: 'Rewrite the following text in the style of Edgar Allan Poe...'
}
```

## Testing Strategy
- Unit tests for text parsing utilities
- Integration tests for AI generation pipeline
- E2E tests for critical user flows (upload → interpret → export)
- Manual testing for UI/UX and spooky aesthetics

## Performance Targets
- First contentful paint: < 1.5s
- Time to interactive: < 3s
- AI generation: < 30s for 5000 words
- File parsing: < 10s for 10MB files

## Kiro Feature Usage

### Specs
Use specs to define and implement each major module:
- Text parser module
- Spirit engine module
- Interpretation generator module
- UI components

### Hooks
Automate workflows:
- On file upload → parse and analyze structure
- On text selection → enable spirit interpretation
- On save → validate and export

### Steering
This document and others guide Kiro's understanding of:
- Project architecture
- Code style preferences
- Spirit personality consistency
- UI/UX principles

## Hackathon Submission Checklist
- [ ] Working application deployed to AWS (S3 + CloudFront)
- [ ] Amazon Bedrock integration working
- [ ] GitHub repo public with MIT license
- [ ] .kiro directory committed (not in .gitignore)
- [ ] 3-minute demo video uploaded
- [ ] README with Kiro usage explanation
- [ ] AWS architecture documented
- [ ] All acceptance criteria met
