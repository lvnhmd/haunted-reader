# The Haunted Reader - Design Specification

## Architecture Overview

The Haunted Reader follows a modular architecture with clear separation between:
- **Frontend Layer**: React components for UI
- **Service Layer**: Business logic and external integrations
- **Spirit Engine**: Personality definitions and prompt management
- **Processing Layer**: File parsing and text analysis

```
┌─────────────────────────────────────────────────────────┐
│                     React UI Layer                       │
│  (TextUploader, SpiritGallery, InterpretationViewer)   │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Service Layer                           │
│  (AIService, FileParser, InterpretationEngine)          │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Spirit Engine                           │
│  (Spirit Definitions, Prompt Templates, Voice Profiles) │
└──────────────────────────────────────────────────────────┘
```

## Core Modules

### Module 1: Spirit Engine

**Purpose**: Define and manage literary spirit personalities

**Components**:
- `spirits/spiritDefinitions.js` - Master list of all spirits
- `spirits/promptBuilder.js` - Constructs AI prompts from spirit templates
- `spirits/voiceProfiles.js` - Detailed voice characteristics

**Spirit Data Structure**:
```javascript
{
  id: string,              // Unique identifier
  name: string,            // Display name
  icon: string,            // Emoji or icon path
  category: string,        // 'author' | 'character' | 'perspective' | 'abstract'
  description: string,     // Short description
  voice: {
    tone: string,          // Overall tone
    vocabulary: string[],  // Key words/phrases
    structure: string,     // Sentence structure style
    focus: string          // What this spirit emphasizes
  },
  prompts: {
    summary: string,       // Template for summaries
    rewrite: string,       // Template for rewrites
    ending: string,        // Template for endings
    analysis: string       // Template for analysis
  }
}
```

**Correctness Properties**:
- **CP-1.1**: Each spirit must have a unique ID
- **CP-1.2**: All prompt templates must include `{text}` placeholder
- **CP-1.3**: Spirit voice characteristics must be consistent across all prompts
- **CP-1.4**: At least 10 spirits must be defined at launch

---

### Module 2: File Parser Service

**Purpose**: Extract text from various file formats

**Components**:
- `services/fileParser.js` - Main parser orchestrator
- `services/parsers/txtParser.js` - Plain text parser
- `services/parsers/pdfParser.js` - PDF extraction
- `services/parsers/epubParser.js` - EPUB extraction

**API**:
```javascript
class FileParser {
  async parseFile(file: File): Promise<ParsedText>
  async parseText(text: string): Promise<ParsedText>
  detectStructure(text: string): TextStructure
}

interface ParsedText {
  content: string,
  structure: TextStructure,
  metadata: {
    wordCount: number,
    characterCount: number,
    estimatedReadTime: number
  }
}

interface TextStructure {
  chapters: Chapter[],
  sections: Section[],
  paragraphs: string[]
}
```

**Correctness Properties**:
- **CP-2.1**: Parser must handle files up to 10MB
- **CP-2.2**: Text extraction must preserve paragraph breaks
- **CP-2.3**: Chapter detection must identify at least 80% of clear chapter markers
- **CP-2.4**: Parser must complete within 10 seconds for max file size
- **CP-2.5**: Invalid files must throw descriptive errors

---

### Module 3: AI Integration Service

**Purpose**: Manage communication with AI providers via Amazon Bedrock

**Components**:
- `services/aiService.js` - Main AI service
- `services/aiProviders/bedrockProvider.js` - Amazon Bedrock integration
- `services/aiProviders/bedrockModels.js` - Model configurations (Claude, Titan, etc.)

**Architecture Choice: Amazon Bedrock**
- Fully managed AWS service for foundation models
- Access to Claude 3, Amazon Titan, and other models
- No separate API keys needed (uses AWS IAM)
- Better security with temporary credentials
- Pay-per-use pricing
- Keeps everything in AWS ecosystem

**Implementation Options**:

**Option A: Client-Side with Cognito (Simpler for Hackathon)**
- Use Amazon Cognito Identity Pool for temporary AWS credentials
- Client calls Bedrock directly from browser
- No backend needed
- Good for demo/hackathon

**Option B: API Gateway + Lambda (Production-Ready)**
- Lambda function proxies Bedrock requests
- API Gateway exposes REST endpoint
- Credentials stay server-side
- Better security and rate limiting

**API**:
```javascript
class AIService {
  async generate(prompt: string, options: GenerationOptions): Promise<string>
  async generateStreaming(prompt: string, onChunk: Function): Promise<void>
  estimateTokens(text: string): number
  validateCredentials(): Promise<boolean>
}

interface GenerationOptions {
  maxTokens: number,
  temperature: number,
  model: string,  // 'anthropic.claude-3-sonnet-20240229-v1:0', 'amazon.titan-text-express-v1'
  systemPrompt?: string
}
```

**Available Bedrock Models**:
- `anthropic.claude-3-sonnet-20240229-v1:0` - Best for creative writing
- `anthropic.claude-3-haiku-20240307-v1:0` - Fast, cost-effective
- `amazon.titan-text-express-v1` - AWS native, good for summaries
- `meta.llama2-70b-chat-v1` - Open source alternative

**Correctness Properties**:
- **CP-3.1**: Service must handle API rate limits gracefully
- **CP-3.2**: Failed requests must retry up to 3 times with exponential backoff
- **CP-3.3**: AWS credentials must use IAM roles or temporary credentials (no hardcoded keys)
- **CP-3.4**: Token estimation must be within 10% of actual usage
- **CP-3.5**: Streaming responses must emit chunks progressively (using invoke-with-response-stream)
- **CP-3.6**: Service must handle Bedrock throttling exceptions

---

### Module 4: Interpretation Engine

**Purpose**: Combine spirits, text, and AI to generate interpretations

**Components**:
- `services/interpretationEngine.js` - Main engine
- `services/interpretationCache.js` - Cache for generated content

**API**:
```javascript
class InterpretationEngine {
  async generateSummary(text: string, spiritId: string): Promise<Interpretation>
  async rewriteText(text: string, spiritId: string): Promise<string>
  async generateEnding(text: string, spiritIds: string[]): Promise<Ending[]>
  async analyzeText(text: string, spiritId: string): Promise<Analysis>
}

interface Interpretation {
  spiritId: string,
  content: string,
  generatedAt: Date,
  wordCount: number
}
```

**Correctness Properties**:
- **CP-4.1**: Interpretations must complete within 30 seconds for 5000 words
- **CP-4.2**: Generated content must maintain original plot/meaning
- **CP-4.3**: Spirit voice must be consistent throughout interpretation
- **CP-4.4**: Cache must prevent duplicate API calls for same text+spirit combo
- **CP-4.5**: Multiple interpretations can be generated in parallel

---

### Module 5: Text Upload Component

**Purpose**: Handle file uploads and text input

**Components**:
- `components/TextUploader.jsx` - Main upload component
- `components/FileDropzone.jsx` - Drag-and-drop zone
- `components/TextInput.jsx` - Direct text paste area

**Props & State**:
```javascript
// TextUploader props
{
  onTextParsed: (parsedText: ParsedText) => void,
  onError: (error: Error) => void,
  maxFileSize: number
}

// Internal state
{
  isUploading: boolean,
  uploadProgress: number,
  error: string | null
}
```

**Correctness Properties**:
- **CP-5.1**: Component must validate file type before parsing
- **CP-5.2**: Upload progress must be displayed for files > 1MB
- **CP-5.3**: Error messages must be user-friendly and actionable
- **CP-5.4**: Component must support both file upload and direct paste
- **CP-5.5**: Uploaded text must be immediately displayed

---

### Module 6: Spirit Gallery Component

**Purpose**: Display and allow selection of literary spirits

**Components**:
- `components/SpiritGallery.jsx` - Main gallery
- `components/SpiritCard.jsx` - Individual spirit card
- `components/SpiritFilter.jsx` - Filter by category

**Props & State**:
```javascript
// SpiritGallery props
{
  onSpiritSelect: (spiritId: string) => void,
  selectedSpirits: string[],
  multiSelect: boolean
}

// SpiritCard props
{
  spirit: Spirit,
  isSelected: boolean,
  onClick: () => void
}
```

**Correctness Properties**:
- **CP-6.1**: Gallery must display all available spirits
- **CP-6.2**: Selected spirits must be visually distinct
- **CP-6.3**: Hover effects must preview spirit's voice
- **CP-6.4**: Filter must work in real-time without lag
- **CP-6.5**: Multi-select must allow up to 5 simultaneous selections

---

### Module 7: Interpretation Viewer Component

**Purpose**: Display generated interpretations with comparison view

**Components**:
- `components/InterpretationViewer.jsx` - Main viewer
- `components/InterpretationPanel.jsx` - Single interpretation display
- `components/ComparisonView.jsx` - Side-by-side comparison

**Props & State**:
```javascript
// InterpretationViewer props
{
  originalText: string,
  interpretations: Interpretation[],
  onExport: (interpretation: Interpretation) => void,
  onRegenerate: (spiritId: string) => void
}

// Internal state
{
  viewMode: 'single' | 'comparison' | 'timeline',
  activeInterpretation: string | null,
  isGenerating: boolean
}
```

**Correctness Properties**:
- **CP-7.1**: Original text must always be accessible
- **CP-7.2**: Comparison view must support up to 3 interpretations side-by-side
- **CP-7.3**: Loading states must show which spirit is generating
- **CP-7.4**: Interpretations must be scrollable independently
- **CP-7.5**: Export must include spirit metadata

---

### Module 8: Spectral Timeline Component

**Purpose**: Visualize emotional flow of text

**Components**:
- `components/SpectralTimeline.jsx` - Main timeline
- `components/EmotionAnalyzer.jsx` - Emotion detection logic

**Props & State**:
```javascript
// SpectralTimeline props
{
  text: string,
  onSectionClick: (sectionIndex: number) => void
}

// Emotion data structure
{
  sections: Array<{
    index: number,
    text: string,
    emotions: {
      fear: number,      // 0-1
      joy: number,
      tension: number,
      sadness: number,
      mystery: number
    }
  }>
}
```

**Correctness Properties**:
- **CP-8.1**: Timeline must divide text into 10-20 sections
- **CP-8.2**: Emotion scores must sum to 1.0 per section
- **CP-8.3**: Clicking timeline must scroll to corresponding text
- **CP-8.4**: Colors must be distinguishable for accessibility
- **CP-8.5**: Timeline must update when text changes

---

### Module 9: Export Service

**Purpose**: Export interpretations in various formats

**Components**:
- `services/exportService.js` - Main export orchestrator
- `services/exporters/txtExporter.js` - Plain text export
- `services/exporters/pdfExporter.js` - PDF generation
- `services/exporters/markdownExporter.js` - Markdown export

**API**:
```javascript
class ExportService {
  async exportAsText(data: ExportData): Promise<Blob>
  async exportAsPDF(data: ExportData): Promise<Blob>
  async exportAsMarkdown(data: ExportData): Promise<Blob>
  async exportAll(data: ExportData): Promise<Blob> // ZIP file
}

interface ExportData {
  originalText: string,
  interpretations: Interpretation[],
  metadata: {
    exportDate: Date,
    spiritsUsed: string[]
  }
}
```

**Correctness Properties**:
- **CP-9.1**: Exports must include all selected interpretations
- **CP-9.2**: PDF must maintain readable formatting
- **CP-9.3**: Markdown must use proper heading hierarchy
- **CP-9.4**: ZIP export must include separate file per interpretation
- **CP-9.5**: Metadata must be included in all export formats

---

## Data Flow

### Primary User Flow: Upload → Select → Interpret → Export

```
1. User uploads file
   ↓
2. FileParser extracts text and structure
   ↓
3. ParsedText displayed in TextUploader
   ↓
4. User selects spirit(s) from SpiritGallery
   ↓
5. InterpretationEngine generates interpretation
   ├─ Retrieves spirit definition
   ├─ Builds prompt using PromptBuilder
   ├─ Calls AIService
   └─ Returns Interpretation
   ↓
6. InterpretationViewer displays result
   ↓
7. User exports via ExportService
```

### Secondary Flow: Spectral Timeline

```
1. ParsedText available
   ↓
2. EmotionAnalyzer processes text sections
   ↓
3. SpectralTimeline renders visualization
   ↓
4. User clicks timeline section
   ↓
5. View scrolls to corresponding text
```

---

## State Management

**Global State** (React Context):
```javascript
{
  parsedText: ParsedText | null,
  selectedSpirits: string[],
  interpretations: Map<string, Interpretation>,
  isGenerating: boolean,
  error: string | null
}
```

**Actions**:
- `SET_PARSED_TEXT`
- `SELECT_SPIRIT`
- `DESELECT_SPIRIT`
- `ADD_INTERPRETATION`
- `REMOVE_INTERPRETATION`
- `SET_GENERATING`
- `SET_ERROR`

---

## Error Handling Strategy

### Error Categories:
1. **File Upload Errors**: Invalid format, size exceeded, parsing failed
2. **AI Service Errors**: API key invalid, rate limit, timeout, network error
3. **Generation Errors**: Token limit exceeded, inappropriate content detected
4. **Export Errors**: Format not supported, file system error

### Error Display:
- Toast notifications for transient errors
- Inline error messages for form validation
- Modal dialogs for critical errors requiring user action
- Spooky error messages (e.g., "The spirits are restless... try again")

---

## Performance Optimizations

### Caching Strategy:
- Cache spirit definitions in memory
- Cache generated interpretations by hash(text + spiritId)
- Cache parsed file structures
- Implement LRU cache with 50MB limit

### Lazy Loading:
- Code-split spirit definitions
- Lazy load PDF/EPUB parsers
- Defer timeline rendering until tab is active

### Parallel Processing:
- Generate multiple interpretations concurrently
- Parse file structure while displaying text
- Pre-fetch spirit prompts on gallery hover

---

## Security Considerations

### Input Validation:
- Sanitize uploaded file content
- Validate file MIME types
- Limit text length to prevent DoS
- Escape user input in exports

### API Security:
- Store API keys in environment variables only
- Never expose keys in client-side code
- Implement rate limiting on client side
- Validate API responses before processing

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance:
- Color contrast ratio ≥ 4.5:1 for text
- Keyboard navigation for all interactive elements
- ARIA labels for spirit cards and buttons
- Screen reader announcements for generation status
- Focus indicators visible on all focusable elements

### Spooky Theme Accessibility:
- Ensure dark theme doesn't reduce readability
- Provide high-contrast mode option
- Animations can be disabled via prefers-reduced-motion
- Icon-only buttons must have text alternatives

---

## Testing Strategy

### Unit Tests:
- Spirit prompt generation
- Text parsing utilities
- Token estimation
- Emotion analysis algorithm

### Integration Tests:
- File upload → parse → display flow
- Spirit selection → interpretation generation
- Export functionality for all formats

### E2E Tests:
- Complete user journey: upload → interpret → export
- Multi-spirit comparison view
- Error recovery scenarios

### Manual Testing:
- UI/UX polish and animations
- Spooky theme consistency
- Cross-browser compatibility
- Mobile responsiveness

---

## Deployment Architecture

### Frontend Hosting: AWS S3 + CloudFront
- **S3 Bucket**: Static website hosting for built files
- **CloudFront**: CDN distribution for global performance
- **Route 53** (optional): Custom domain configuration
- **Certificate Manager** (optional): HTTPS/SSL certificate

### AWS Architecture:
```
User Request
    ↓
CloudFront (CDN)
    ↓
S3 Bucket (Static Files)
```

### S3 Configuration:
- Enable static website hosting
- Set index.html as index document
- Configure bucket policy for public read access
- Enable versioning for rollback capability

### CloudFront Configuration:
- Origin: S3 bucket website endpoint
- Default root object: index.html
- Error pages: redirect 404 to index.html (for SPA routing)
- Compress objects automatically
- Cache behavior: cache static assets, no-cache for index.html

### Build Configuration:
```javascript
// vite.config.js
{
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'spirit-engine': ['./src/spirits'],
          'parsers': ['./src/services/parsers'],
          'vendor': ['react', 'react-dom']
        }
      }
    }
  }
}
```

### Environment Variables:
```
# AWS Bedrock Configuration
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxx-xxxx-xxxx

# Optional: API Gateway endpoint if using Lambda proxy
VITE_API_ENDPOINT=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod

# Application Settings
VITE_MAX_FILE_SIZE=10485760
VITE_MAX_TEXT_LENGTH=50000
```

**Note**: Using Amazon Bedrock with Cognito provides temporary AWS credentials, eliminating the need for hardcoded API keys. See `.kiro/BEDROCK_SETUP.md` for configuration details.

---

## Future Enhancements (Post-Hackathon)

- User accounts and saved interpretations
- Custom spirit creation
- Collaborative interpretation sessions
- Integration with writing tools (Google Docs, Scrivener)
- Voice narration of interpretations
- More file formats (DOCX, RTF)
- Advanced emotion analysis with ML models
- Spirit personality fine-tuning
