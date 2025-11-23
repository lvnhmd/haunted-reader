# The Haunted Reader - Implementation Tasks

> 🎃 **Interactive Task List**: Check off tasks as you complete them!

## Progress Overview
- [ ] Phase 1: Project Setup & Foundation (3 tasks + 1 checkpoint) - 3/4 complete ✅
- [ ] Phase 2: Core Services (6 tasks + 1 checkpoint)
- [ ] Phase 3: UI Components (4 tasks + 1 checkpoint)
- [ ] Phase 4: Integration & Polish (4 tasks + 1 checkpoint)
- [ ] Phase 5: Testing & Deployment (3 tasks)
- [ ] Phase 6: Hackathon Submission (3 tasks)

**Note**: Tasks marked with "*" are optional and can be skipped for faster MVP development. Focus on core functionality first!

---

## Phase 1: Project Setup & Foundation

### ⚡ TASK-1: Initialize Project Structure
- [x] **Task Complete**
- **Status**: ✅ Complete
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
- [x] `npm run dev` starts development server
- [x] Tailwind CSS is working
- [x] Folder structure matches design spec
- [x] Environment variables can be loaded
- [x] AWS SDK dependencies installed correctly
- [x] .env.example file created with AWS configuration

---

### 👻 TASK-2: Create Spirit Definitions
- [x] **Task Complete**
- **Status**: ✅ Complete
- **Depends on**: TASK-1  
- **Implements**: CP-1.1, CP-1.2, CP-1.3, CP-1.4

**Description**: Define all 10+ literary spirits with their personalities and prompt templates.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-2: Create Spirit Definitions"`

**Steps**:
- [x] 2.1 Create spirit definitions file and data structure
  - Create `src/spirits/spiritDefinitions.js`
  - Define spirit data structure with all required fields
  - _Requirements: CP-1.1, CP-1.2_

- [x] 2.2 Implement all 10 spirits with personalities
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
  - _Requirements: CP-1.4_

- [x] 2.3 Create prompt templates for each spirit
  - Add templates for summary, rewrite, ending, analysis
  - Ensure all templates include `{text}` placeholder
  - Add voice profiles with tone, vocabulary, structure, focus
  - _Requirements: CP-1.2, CP-1.3_

- [ ]* 2.4 Write unit tests for spirit definitions
  - Test spirit ID uniqueness
  - Test prompt template placeholder presence
  - Test voice profile completeness
  - _Requirements: CP-1.1, CP-1.2, CP-1.3, CP-1.4_

**Acceptance Criteria**:
- [x] All spirits have unique IDs
- [x] All prompt templates include `{text}` placeholder
- [x] Voice characteristics are distinct and consistent
- [x] At least 10 spirits defined

---

### 🔮 TASK-3: Build Prompt Builder Utility
- [x] **Task Complete**
- **Status**: ✅ Complete
- **Depends on**: TASK-2  
- **Implements**: CP-1.2, CP-1.3

**Description**: Create utility to construct AI prompts from spirit templates.

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-3: Build Prompt Builder Utility"`

**Steps**:
- [x] 3.1 Create prompt builder with core functionality
  - Create `src/spirits/promptBuilder.js`
  - Implement `buildPrompt(spiritId, promptType, text, options)` function
  - Handle template variable substitution
  - Implement prompt validation
  - _Requirements: CP-1.2_

- [x] 3.2 Add Bedrock-specific formatting
  - Add system prompt construction (Bedrock format with separate `system` field)
  - Format prompts for Bedrock Claude models (messages array)
  - Optimize for token efficiency
  - _Requirements: CP-1.3_

- [x]* 3.3 Write unit tests for prompt builder
  - Test variable substitution
  - Test invalid spirit ID handling
  - Test Bedrock format compliance
  - Test system prompt generation
  - _Requirements: CP-1.2, CP-1.3_

**Acceptance Criteria**:
- [x] Prompts correctly substitute `{text}` and other variables
- [x] System prompts include spirit voice characteristics
- [x] Invalid spirit IDs throw descriptive errors
- [x] Prompts are optimized for token efficiency
- [x] Prompts formatted correctly for Bedrock Claude API (messages array format)
- [x] System prompts use separate `system` field (not in messages)

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
- [ ] 4.1 Set up Bedrock provider and model configuration
  - Create `src/services/aiService.js`
  - Implement Bedrock provider (`src/services/aiProviders/bedrockProvider.js`)
  - Configure model mappings (`src/services/aiProviders/bedrockModels.js`)
  - Set up AWS credentials (Cognito Identity Pool or environment)
  - _Requirements: CP-3.3, CP-3.6_

- [ ] 4.2 Implement core generation functionality
  - Add retry logic with exponential backoff
  - Implement token estimation
  - Handle Bedrock throttling and errors gracefully
  - _Requirements: CP-3.1, CP-3.2, CP-3.4_

- [ ] 4.3 Add streaming support
  - Add streaming support using `invokeModelWithResponseStream`
  - Ensure chunks emit progressively
  - _Requirements: CP-3.5_

- [ ]* 4.4 Write unit tests for AI service
  - Test retry logic
  - Test token estimation accuracy
  - Test error handling
  - Test credential validation
  - _Requirements: CP-3.1, CP-3.2, CP-3.3, CP-3.4_

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
- [ ] 5.1 Create file parser orchestrator
  - Create `src/services/fileParser.js`
  - Add file validation and error handling
  - Calculate metadata (word count, character count, read time)
  - _Requirements: CP-2.1, CP-2.5_

- [ ] 5.2 Implement format-specific parsers
  - Implement TXT parser (`src/services/parsers/txtParser.js`)
  - Implement PDF parser using pdfjs-dist (`src/services/parsers/pdfParser.js`)
  - Implement EPUB parser (`src/services/parsers/epubParser.js`)
  - _Requirements: CP-2.2, CP-2.4_

- [ ] 5.3 Add structure detection
  - Detect chapters, sections, paragraphs
  - Preserve paragraph breaks
  - _Requirements: CP-2.2, CP-2.3_

- [ ]* 5.4 Write unit tests for file parsers
  - Test each parser with sample files
  - Test structure detection accuracy
  - Test metadata calculation
  - Test error handling for invalid files
  - _Requirements: CP-2.1, CP-2.2, CP-2.3, CP-2.4, CP-2.5_

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
- [ ] 6.1 Create interpretation engine with core methods
  - Create `src/services/interpretationEngine.js`
  - Implement `generateSummary(text, spiritId)` using Bedrock
  - Implement `rewriteText(text, spiritId)` using Bedrock
  - Implement `analyzeText(text, spiritId)` using Bedrock
  - _Requirements: CP-4.1, CP-4.2, CP-4.3_

- [ ] 6.2 Add parallel generation and caching
  - Implement `generateEnding(text, spiritIds[])` with parallel Bedrock calls
  - Add caching layer (`src/services/interpretationCache.js`)
  - Support parallel generation for multiple spirits
  - _Requirements: CP-4.4, CP-4.5_

- [ ] 6.3 Add error handling
  - Handle Bedrock-specific errors (ThrottlingException, ValidationException)
  - Implement retry logic
  - _Requirements: CP-4.1_

- [ ]* 6.4 Write unit tests for interpretation engine
  - Test each generation method
  - Test caching behavior
  - Test parallel generation
  - Test error handling
  - _Requirements: CP-4.1, CP-4.2, CP-4.3, CP-4.4, CP-4.5_

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
- [ ] 7.1 Create export service orchestrator
  - Create `src/services/exportService.js`
  - Include metadata in all exports
  - _Requirements: CP-9.1, CP-9.5_

- [ ] 7.2 Implement format-specific exporters
  - Implement TXT exporter (`src/services/exporters/txtExporter.js`)
  - Implement Markdown exporter (`src/services/exporters/markdownExporter.js`)
  - Implement PDF exporter (`src/services/exporters/pdfExporter.js`)
  - Implement ZIP exporter for multiple interpretations
  - _Requirements: CP-9.2, CP-9.3, CP-9.4_

- [ ]* 7.3 Write unit tests for export service
  - Test each export format
  - Test metadata inclusion
  - Test ZIP multi-file export
  - _Requirements: CP-9.1, CP-9.2, CP-9.3, CP-9.4, CP-9.5_

**Acceptance Criteria**:
- [ ] All selected interpretations included in export
- [ ] PDF maintains readable formatting
- [ ] Markdown uses proper heading hierarchy
- [ ] ZIP contains separate file per interpretation
- [ ] Metadata included in all formats

---

### ✅ CHECKPOINT-1: Core Services Complete
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-2, TASK-3, TASK-4, TASK-5, TASK-6, TASK-7)
- **Depends on**: TASK-2, TASK-3, TASK-4, TASK-5, TASK-6, TASK-7

**Description**: Verify all core services are working before building UI.

**🚀 Start Task**: Ask Kiro: `"Let's verify CHECKPOINT-1"`

**Steps**:
- Ensure all tests pass (if written)
- Verify spirit definitions are complete
- Test AI service can connect to Bedrock
- Test file parser with sample files
- Ask user if any issues need addressing

**Acceptance Criteria**:
- [ ] All implemented tests passing
- [ ] No console errors in development
- [ ] Core services functional

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
- [ ] 11.1 Create emotion analysis logic
  - Create `src/components/EmotionAnalyzer.jsx` for emotion detection
  - Implement emotion scoring algorithm (fear, joy, tension, sadness, mystery)
  - Ensure emotion scores sum to 1.0 per section
  - _Requirements: CP-8.1, CP-8.2_

- [ ] 11.2 Build timeline visualization component
  - Create `src/components/SpectralTimeline.jsx`
  - Render timeline with color-coded sections
  - Add click handler to scroll to section
  - Update timeline when text changes
  - _Requirements: CP-8.3, CP-8.5_

- [ ] 11.3 Ensure accessibility
  - Ensure color contrast for accessibility
  - Add ARIA labels
  - _Requirements: CP-8.4_

- [ ]* 11.4 Write unit tests for emotion analyzer
  - Test emotion scoring algorithm
  - Test section division logic
  - Test score normalization (sum to 1.0)
  - _Requirements: CP-8.1, CP-8.2_

**Acceptance Criteria**:
- [ ] Timeline divides text into 10-20 sections
- [ ] Emotion scores sum to 1.0 per section
- [ ] Clicking scrolls to corresponding text
- [ ] Colors distinguishable for accessibility
- [ ] Timeline updates when text changes

---

### ✅ CHECKPOINT-2: UI Components Complete
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-8, TASK-9, TASK-10, TASK-11)
- **Depends on**: TASK-8, TASK-9, TASK-10, TASK-11

**Description**: Verify all UI components render correctly before integration.

**🚀 Start Task**: Ask Kiro: `"Let's verify CHECKPOINT-2"`

**Steps**:
- Test each component in isolation
- Verify spooky styling is consistent
- Check responsive behavior on mobile
- Ask user if any UI adjustments needed

**Acceptance Criteria**:
- [ ] All components render without errors
- [ ] Styling is consistent and spooky
- [ ] Components are responsive

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

### ✅ CHECKPOINT-3: Application Complete
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-12, TASK-13, TASK-14, TASK-15)
- **Depends on**: TASK-12, TASK-13, TASK-14, TASK-15

**Description**: Final verification before deployment.

**🚀 Start Task**: Ask Kiro: `"Let's verify CHECKPOINT-3"`

**Steps**:
- Test complete user flow: upload → select spirits → generate → export
- Verify all features work together
- Check for console errors
- Test on different browsers (Chrome, Firefox, Safari)
- Ask user for final feedback

**Acceptance Criteria**:
- [ ] All features functional end-to-end
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Ready for deployment

---

## Phase 5: Testing & Deployment

### 🧪 TASK-16: Comprehensive Unit Testing (Optional)
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-3, TASK-4, TASK-5, TASK-6)
- **Depends on**: TASK-3, TASK-4, TASK-5, TASK-6  
- **Implements**: Testing strategy

**Description**: Write comprehensive unit tests for core utilities and services (optional for MVP).

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-16: Write Unit Tests"`

**Steps**:
- [ ]* 16.1 Set up testing framework
  - Set up Vitest testing framework
  - Configure test environment
  - _Requirements: Testing strategy_

- [ ]* 16.2 Write comprehensive unit tests
  - Write additional tests for promptBuilder
  - Write additional tests for fileParser utilities
  - Write additional tests for token estimation
  - Write additional tests for emotion analysis
  - Achieve >80% code coverage for utilities
  - _Requirements: Testing strategy_

**Acceptance Criteria**:
- [ ] All utility functions have tests
- [ ] Tests pass consistently
- [ ] Edge cases covered
- [ ] Code coverage >80% for tested modules

---

### 🔗 TASK-17: Integration Testing (Optional)
- [ ] **Task Complete**
- **Status**: 🔴 Blocked (needs TASK-13)
- **Depends on**: TASK-13  
- **Implements**: Testing strategy

**Description**: Test integrated workflows (optional for MVP).

**🚀 Start Task**: Ask Kiro: `"Let's implement TASK-17: Perform Integration Testing"`

**Steps**:
- [ ]* 17.1 Test core user flows
  - Test file upload → parse → display flow
  - Test spirit selection → interpretation generation
  - Test export functionality for all formats
  - _Requirements: Testing strategy_

- [ ]* 17.2 Test error and edge cases
  - Test error recovery scenarios
  - Test parallel interpretation generation
  - Test performance targets
  - _Requirements: Testing strategy_

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
