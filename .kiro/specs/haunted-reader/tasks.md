# The Haunted Reader - Implementation Tasks

> 🎃 **Interactive Task List**: Check off tasks as you complete them!

## Progress Overview
- [ ] Phase 1: Project Setup & Foundation (3 tasks)
- [ ] Phase 2: Core Services (4 tasks)
- [ ] Phase 3: UI Components (4 tasks)
- [ ] Phase 4: Integration & Polish (4 tasks)
- [ ] Phase 5: Testing & Deployment (3 tasks)
- [ ] Phase 6: Hackathon Submission (3 tasks)

---

## Phase 1: Project Setup & Foundation

### ⚡ TASK-1: Initialize Project Structure
- [ ] **Task Complete**
- **Status**: 🟡 Ready to start
- **Depends on**: none  
- **Implements**: Project foundation

**Description**: Set up the React + Vite project with all necessary dependencies and folder structure.

**🚀 Start Task**: Ask Kiro: `"Let's start TASK-1: Initialize Project Structure"`

**Steps**:
1. Initialize Vite project with React template
2. Install core dependencies:
   - AWS SDK: `@aws-sdk/client-bedrock-runtime`, `@aws-sdk/credential-providers`, `@aws-sdk/client-cognito-identity`
   - File processing: `pdfjs-dist`, `epub2`, `react-dropzone`
   - UI: `tailwindcss`, `react-markdown`
   - Utilities: `axios`
3. Set up Tailwind CSS configuration
4. Create folder structure (components, services, spirits, hooks, utils, styles)
5. Configure environment variables template (.env.example)
6. Set up .gitignore (exclude .env but include .kiro/)
7. Configure AWS Bedrock access (see `.kiro/BEDROCK_SETUP.md`)

**Acceptance Criteria**:
- [ ] `npm run dev` starts development server
- [ ] Tailwind CSS is working
- [ ] Folder structure matches design spec
- [ ] Environment variables can be loaded
- [ ] AWS SDK dependencies installed correctly
- [ ] .env.example file created with AWS configuration

---

### 👻 TASK-2: Create Spirit Definitions
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-1)
- **Depends on**: TASK-1  
- **Implements**: CP-1.1, CP-1.2, CP-1.3, CP-1.4

**Description**: Define all 10+ literary spirits with their personalities and prompt templates.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-2: Create Spirit Definitions"`

**Steps**:
1. Create `src/spirits/spiritDefinitions.js`
2. Define spirit data structure
3. Implement 10 spirits:
   - Edgar Allan Poe (Gothic horror)
   - Charles Dickens (Victorian social commentary)
   - Jane Austen (Romantic wit)
   - H.P. Lovecraft (Cosmic horror)
   - Ernest Hemingway (Minimalist)
   - The Villain (Malicious POV)
   - A 5-year-old (Innocent lens)
   - An Old Scholar (Academic)
   - The Monster (Creature perspective)
   - Prophet of Doom (Apocalyptic)
4. Create prompt templates for each spirit (summary, rewrite, ending, analysis)
5. Add voice profiles with tone, vocabulary, structure, focus

**Acceptance Criteria**:
- [ ] All spirits have unique IDs
- [ ] All prompt templates include `{text}` placeholder
- [ ] Voice characteristics are distinct and consistent
- [ ] At least 10 spirits defined

---

### 🔮 TASK-3: Build Prompt Builder Utility
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-2)
- **Depends on**: TASK-2  
- **Implements**: CP-1.2, CP-1.3

**Description**: Create utility to construct AI prompts from spirit templates.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-3: Build Prompt Builder Utility"`

**Steps**:
1. Create `src/spirits/promptBuilder.js`
2. Implement `buildPrompt(spiritId, promptType, text, options)` function
3. Handle template variable substitution
4. Add system prompt construction (Bedrock format with separate `system` field)
5. Implement prompt validation
6. Format prompts for Bedrock Claude models (anthropic_version, messages array)

**Acceptance Criteria**:
- [ ] Prompts correctly substitute `{text}` and other variables
- [ ] System prompts include spirit voice characteristics
- [ ] Invalid spirit IDs throw descriptive errors
- [ ] Prompts are optimized for token efficiency
- [ ] Prompts formatted correctly for Bedrock Claude API (messages array format)
- [ ] System prompts use separate `system` field (not in messages)

---

## Phase 2: Core Services

### 🤖 TASK-4: Implement AI Service with Amazon Bedrock
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-1)
- **Depends on**: TASK-1  
- **Implements**: CP-3.1, CP-3.2, CP-3.3, CP-3.4, CP-3.5, CP-3.6

**Description**: Create service to communicate with Amazon Bedrock for AI generation.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-4: Implement AI Service with Amazon Bedrock"`

**Steps**:
1. Install AWS SDK: `npm install @aws-sdk/client-bedrock-runtime @aws-sdk/credential-providers`
2. Create `src/services/aiService.js`
3. Implement Bedrock provider (`src/services/aiProviders/bedrockProvider.js`)
4. Configure model mappings (`src/services/aiProviders/bedrockModels.js`)
5. Set up AWS credentials (Cognito Identity Pool or environment)
6. Add retry logic with exponential backoff
7. Implement token estimation
8. Add streaming support using `invokeModelWithResponseStream`
9. Handle Bedrock throttling and errors gracefully

**Acceptance Criteria**:
- [ ] AWS credentials configured via Cognito or IAM (no hardcoded keys)
- [ ] Failed requests retry up to 3 times
- [ ] Token estimation within 10% accuracy
- [ ] Streaming responses emit chunks progressively
- [ ] Throttling and rate limits handled gracefully
- [ ] Supports Claude 3 Sonnet and Haiku models

---

### 📄 TASK-5: Build File Parser Service
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-1)
- **Depends on**: TASK-1  
- **Implements**: CP-2.1, CP-2.2, CP-2.3, CP-2.4, CP-2.5

**Description**: Create service to parse TXT, PDF, and EPUB files.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-5: Build File Parser Service"`

**Steps**:
1. Create `src/services/fileParser.js`
2. Implement TXT parser (`src/services/parsers/txtParser.js`)
3. Implement PDF parser using pdfjs-dist (`src/services/parsers/pdfParser.js`)
4. Implement EPUB parser (`src/services/parsers/epubParser.js`)
5. Add structure detection (chapters, sections, paragraphs)
6. Calculate metadata (word count, character count, read time)
7. Add file validation and error handling

**Acceptance Criteria**:
- [ ] Handles files up to 10MB
- [ ] Preserves paragraph breaks
- [ ] Detects 80%+ of chapter markers
- [ ] Completes within 10 seconds for max file size
- [ ] Invalid files throw descriptive errors

---

### 🧠 TASK-6: Create Interpretation Engine
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-3, TASK-4)
- **Depends on**: TASK-3, TASK-4  
- **Implements**: CP-4.1, CP-4.2, CP-4.3, CP-4.4, CP-4.5

**Description**: Build engine that combines spirits, text, and AI to generate interpretations.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-6: Create Interpretation Engine"`

**Steps**:
1. Create `src/services/interpretationEngine.js`
2. Implement `generateSummary(text, spiritId)` using Bedrock
3. Implement `rewriteText(text, spiritId)` using Bedrock
4. Implement `generateEnding(text, spiritIds[])` with parallel Bedrock calls
5. Implement `analyzeText(text, spiritId)` using Bedrock
6. Add caching layer (`src/services/interpretationCache.js`) to reduce Bedrock costs
7. Support parallel generation for multiple spirits
8. Handle Bedrock-specific errors (ThrottlingException, ValidationException)

**Acceptance Criteria**:
- [ ] Interpretations complete within 30 seconds for 5000 words
- [ ] Generated content maintains original meaning
- [ ] Spirit voice is consistent throughout
- [ ] Cache prevents duplicate Bedrock API calls (cost optimization)
- [ ] Multiple interpretations can be generated in parallel
- [ ] Bedrock throttling handled gracefully with retry logic
- [ ] Uses appropriate model (Haiku for speed, Sonnet for quality)

---

### 💾 TASK-7: Build Export Service
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-1)
- **Depends on**: TASK-1  
- **Implements**: CP-9.1, CP-9.2, CP-9.3, CP-9.4, CP-9.5

**Description**: Create service to export interpretations in multiple formats.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-7: Build Export Service"`

**Steps**:
1. Create `src/services/exportService.js`
2. Implement TXT exporter (`src/services/exporters/txtExporter.js`)
3. Implement Markdown exporter (`src/services/exporters/markdownExporter.js`)
4. Implement PDF exporter (`src/services/exporters/pdfExporter.js`)
5. Implement ZIP exporter for multiple interpretations
6. Include metadata in all exports

**Acceptance Criteria**:
- [ ] All selected interpretations included in export
- [ ] PDF maintains readable formatting
- [ ] Markdown uses proper heading hierarchy
- [ ] ZIP contains separate file per interpretation
- [ ] Metadata included in all formats

---

## Phase 3: UI Components

### 📤 TASK-8: Create Text Uploader Component
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-5)
- **Depends on**: TASK-5  
- **Implements**: CP-5.1, CP-5.2, CP-5.3, CP-5.4, CP-5.5

**Description**: Build component for file upload and text input.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-8: Create Text Uploader Component"`

**Steps**:
1. Create `src/components/TextUploader.jsx`
2. Create `src/components/FileDropzone.jsx` with drag-and-drop
3. Create `src/components/TextInput.jsx` for direct paste
4. Add file type validation
5. Show upload progress for large files
6. Display parsed text immediately
7. Add spooky styling and animations

**Acceptance Criteria**:
- [ ] Validates file type before parsing
- [ ] Shows progress for files > 1MB
- [ ] Error messages are user-friendly
- [ ] Supports both file upload and direct paste
- [ ] Uploaded text displayed immediately

---

### 🎭 TASK-9: Build Spirit Gallery Component
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-2)
- **Depends on**: TASK-2  
- **Implements**: CP-6.1, CP-6.2, CP-6.3, CP-6.4, CP-6.5

**Description**: Create gallery to display and select spirits.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-9: Build Spirit Gallery Component"`

**Steps**:
1. Create `src/components/SpiritGallery.jsx`
2. Create `src/components/SpiritCard.jsx` for individual spirits
3. Create `src/components/SpiritFilter.jsx` for category filtering
4. Add hover effects with voice preview
5. Implement multi-select (up to 5 spirits)
6. Add spooky animations and transitions
7. Make responsive for mobile

**Acceptance Criteria**:
- [ ] Displays all available spirits
- [ ] Selected spirits visually distinct
- [ ] Hover shows voice preview
- [ ] Filter works in real-time
- [ ] Multi-select allows up to 5 selections

---

### 📖 TASK-10: Create Interpretation Viewer Component
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-6)
- **Depends on**: TASK-6  
- **Implements**: CP-7.1, CP-7.2, CP-7.3, CP-7.4, CP-7.5

**Description**: Build component to display and compare interpretations.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-10: Create Interpretation Viewer Component"`

**Steps**:
1. Create `src/components/InterpretationViewer.jsx`
2. Create `src/components/InterpretationPanel.jsx` for single interpretation
3. Create `src/components/ComparisonView.jsx` for side-by-side view
4. Add view mode toggle (single, comparison, timeline)
5. Show loading states with spirit-specific messages
6. Make panels independently scrollable
7. Add export button integration

**Acceptance Criteria**:
- [ ] Original text always accessible
- [ ] Comparison view supports up to 3 interpretations
- [ ] Loading states show which spirit is generating
- [ ] Interpretations scrollable independently
- [ ] Export includes spirit metadata

---

### 📊 TASK-11: Build Spectral Timeline Component
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-5)
- **Depends on**: TASK-5  
- **Implements**: CP-8.1, CP-8.2, CP-8.3, CP-8.4, CP-8.5

**Description**: Create visualization of text's emotional flow.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-11: Build Spectral Timeline Component"`

**Steps**:
1. Create `src/components/SpectralTimeline.jsx`
2. Create `src/components/EmotionAnalyzer.jsx` for emotion detection
3. Implement emotion scoring algorithm (fear, joy, tension, sadness, mystery)
4. Render timeline with color-coded sections
5. Add click handler to scroll to section
6. Ensure accessibility (color contrast, ARIA labels)
7. Update timeline when text changes

**Acceptance Criteria**:
- [ ] Timeline divides text into 10-20 sections
- [ ] Emotion scores sum to 1.0 per section
- [ ] Clicking scrolls to corresponding text
- [ ] Colors distinguishable for accessibility
- [ ] Timeline updates when text changes

---

## Phase 4: Integration & Polish

### 🔄 TASK-12: Implement Global State Management
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-8, TASK-9, TASK-10)
- **Depends on**: TASK-8, TASK-9, TASK-10  
- **Implements**: Data flow architecture

**Description**: Set up React Context for global state.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-12: Implement Global State Management"`

**Steps**:
1. Create `src/context/AppContext.jsx`
2. Define global state structure
3. Implement actions (SET_PARSED_TEXT, SELECT_SPIRIT, etc.)
4. Create custom hooks (useAppState, useSpirits, useInterpretations)
5. Wrap app with context provider

**Acceptance Criteria**:
- [ ] State accessible from all components
- [ ] Actions update state correctly
- [ ] No prop drilling required
- [ ] State persists across component re-renders

---

### 🎨 TASK-13: Create Main App Layout
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-8, TASK-9, TASK-10, TASK-11, TASK-12)
- **Depends on**: TASK-8, TASK-9, TASK-10, TASK-11, TASK-12  
- **Implements**: Overall UI architecture

**Description**: Build main app layout and navigation.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-13: Create Main App Layout"`

**Steps**:
1. Create `src/App.jsx` with main layout
2. Implement three-panel layout (upload, gallery, viewer)
3. Add responsive breakpoints for mobile
4. Create navigation/tabs for different views
5. Add spooky theme styling (dark mode, purple/green/orange accents)
6. Implement smooth transitions between states

**Acceptance Criteria**:
- [ ] Layout works on desktop and mobile
- [ ] All components integrated smoothly
- [ ] Theme is consistent and spooky
- [ ] Navigation is intuitive
- [ ] Animations are smooth

---

### ⚠️ TASK-14: Add Error Handling & Loading States
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-13)
- **Depends on**: TASK-13  
- **Implements**: Error handling strategy

**Description**: Implement comprehensive error handling and loading states.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-14: Add Error Handling & Loading States"`

**Steps**:
1. Create `src/components/ErrorBoundary.jsx`
2. Create `src/components/Toast.jsx` for notifications
3. Create `src/components/LoadingSpinner.jsx` with spooky animation
4. Add error handling to all async operations
5. Implement spooky error messages
6. Add retry mechanisms for failed operations

**Acceptance Criteria**:
- [ ] All errors caught and displayed appropriately
- [ ] Loading states shown during async operations
- [ ] Error messages are user-friendly and spooky
- [ ] Users can retry failed operations
- [ ] App doesn't crash on errors

---

### ♿ TASK-15: Implement Accessibility Features
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-13)
- **Depends on**: TASK-13  
- **Implements**: Accessibility requirements

**Description**: Ensure WCAG 2.1 AA compliance.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-15: Implement Accessibility Features"`

**Steps**:
1. Add ARIA labels to all interactive elements
2. Ensure keyboard navigation works throughout
3. Test color contrast ratios (≥ 4.5:1)
4. Add focus indicators
5. Implement screen reader announcements
6. Add prefers-reduced-motion support
7. Test with screen reader (VoiceOver on macOS)

**Acceptance Criteria**:
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Screen reader can navigate entire app
- [ ] Animations respect prefers-reduced-motion

---

## Phase 5: Testing & Deployment

### 🧪 TASK-16: Write Unit Tests
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-3, TASK-4, TASK-5, TASK-6)
- **Depends on**: TASK-3, TASK-4, TASK-5, TASK-6  
- **Implements**: Testing strategy

**Description**: Write unit tests for core utilities and services.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-16: Write Unit Tests"`

**Steps**:
1. Set up Vitest testing framework
2. Write tests for promptBuilder
3. Write tests for fileParser utilities
4. Write tests for token estimation
5. Write tests for emotion analysis
6. Achieve >80% code coverage for utilities

**Acceptance Criteria**:
- [ ] All utility functions have tests
- [ ] Tests pass consistently
- [ ] Edge cases covered
- [ ] Code coverage >80% for tested modules

---

### 🔗 TASK-17: Perform Integration Testing
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-13)
- **Depends on**: TASK-13  
- **Implements**: Testing strategy

**Description**: Test integrated workflows.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-17: Perform Integration Testing"`

**Steps**:
1. Test file upload → parse → display flow
2. Test spirit selection → interpretation generation
3. Test export functionality for all formats
4. Test error recovery scenarios
5. Test parallel interpretation generation

**Acceptance Criteria**:
- [ ] All critical user flows work end-to-end
- [ ] Error scenarios handled gracefully
- [ ] Performance meets targets
- [ ] No console errors during normal operation

---

### 🚀 TASK-18: Deploy Application to AWS
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-17)
- **Depends on**: TASK-17  
- **Implements**: Deployment architecture

**Description**: Deploy to AWS S3 + CloudFront for static hosting.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-18: Deploy Application to AWS"`

**Steps**:
1. Create production build (`npm run build`)
2. Create S3 bucket with static website hosting enabled
3. Configure bucket policy for public read access
4. Upload dist/ files to S3
5. Create CloudFront distribution pointing to S3
6. Configure CloudFront error pages (404 → index.html for SPA)
7. Test deployed application via CloudFront URL
8. (Optional) Set up custom domain with Route 53
9. (Optional) Configure SSL certificate with ACM

**Acceptance Criteria**:
- [ ] Application accessible via CloudFront URL
- [ ] All static assets loading correctly
- [ ] SPA routing works (no 404s on refresh)
- [ ] All features work in production
- [ ] Performance meets targets (FCP < 1.5s, TTI < 3s)
- [ ] HTTPS enabled (via CloudFront default or custom cert)

---

## Phase 6: Hackathon Submission

### 🎬 TASK-19: Create Demo Video
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-18)
- **Depends on**: TASK-18  
- **Implements**: Hackathon requirements

**Description**: Record 3-minute demonstration video.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-19: Create Demo Video"`

**Steps**:
1. Write video script covering:
   - Problem statement
   - Solution overview (emphasize AWS architecture)
   - Key features demo (upload, spirits, interpretations)
   - AWS Bedrock integration showcase
   - Kiro usage highlights (specs, hooks, steering)
2. Record screen capture with narration
3. Edit video to 3 minutes max
4. Upload to YouTube/Vimeo
5. Add to README

**Acceptance Criteria**:
- [ ] Video is exactly 3 minutes or less
- [ ] All key features demonstrated
- [ ] AWS Bedrock integration shown
- [ ] Kiro usage clearly explained (specs, hooks, steering)
- [ ] Video is public and accessible
- [ ] Link added to README

---

### 📝 TASK-20: Write Kiro Usage Documentation
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-19)
- **Depends on**: TASK-19  
- **Implements**: Hackathon requirements

**Description**: Document how Kiro was used in development.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-20: Write Kiro Usage Documentation"`

**Steps**:
1. Document spec-driven development approach
2. Explain agent hooks usage (on-file-save, spirit-consistency-check)
3. Describe steering documents impact (project-context, spirit-personalities, ai-prompts)
4. Detail vibe coding sessions for UI polish
5. Explain how Kiro helped with AWS Bedrock integration
6. Add to README with examples
7. Include screenshots of Kiro in action

**Acceptance Criteria**:
- [ ] Clear explanation of each Kiro feature used (specs, hooks, steering, vibe coding)
- [ ] Specific examples provided with code snippets
- [ ] Screenshots/evidence included
- [ ] AWS Bedrock integration process documented
- [ ] Judges can understand Kiro's impact on development speed and quality

---

### ✅ TASK-21: Final Submission Checklist
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-20)
- **Depends on**: TASK-20  
- **Implements**: Hackathon requirements

**Description**: Complete all submission requirements.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-21: Final Submission Checklist"`

**Steps**:
1. Verify .kiro directory is committed (not in .gitignore)
2. Ensure repo is public with MIT license
3. Add demo video link to README
4. Add deployed app link to README
5. Complete Kiro usage write-up
6. Test all links work
7. Submit to hackathon

**Acceptance Criteria**:
- [ ] Public GitHub repo with MIT license
- [ ] .kiro directory committed and visible (specs, hooks, steering)
- [ ] Working deployed application URL (AWS CloudFront)
- [ ] Amazon Bedrock integration functional
- [ ] 3-minute demo video uploaded and linked
- [ ] Kiro usage documentation complete
- [ ] AWS architecture documented
- [ ] Category identified (Frankenstein)
- [ ] All acceptance criteria from requirements.md met
