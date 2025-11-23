# Haunted Reader - Development Guide

## 🎯 Quick Start

This guide helps you navigate the spec-driven development process for The Haunted Reader.

## 📋 Spec Files Overview

### 1. `requirements.md`
Defines **what** we're building:
- 7 core features (AC-1 through AC-7)
- User stories with acceptance criteria
- Non-functional requirements
- Out of scope items

### 2. `design.md`
Defines **how** we're building it:
- 9 core modules with detailed architecture
- Correctness properties (CP-X.X) for each module
- Data flow diagrams
- State management strategy
- Error handling approach
- Performance optimizations

### 3. `tasks.md`
Defines **when** and **in what order**:
- 21 implementation tasks across 6 phases
- Dependencies between tasks
- Acceptance criteria per task
- Clear implementation steps

## 🚀 Development Workflow

### Using Kiro with Specs

1. **Start a task**: 
   ```
   "Let's implement TASK-2: Create Spirit Definitions"
   ```

2. **Kiro will**:
   - Read the task description
   - Check dependencies
   - Review relevant correctness properties
   - Generate implementation following design spec

3. **Verify completion**:
   - Check acceptance criteria
   - Run tests if applicable
   - Mark task as complete

### Vibe Coding vs Spec-Driven

**Vibe Coding** (conversational):
- "Add a spooky loading animation to the spirit gallery"
- "Make the error messages more Halloween-themed"
- "Improve the hover effect on spirit cards"

**Spec-Driven** (structured):
- "Implement TASK-9 from the spec"
- "Ensure CP-6.3 is satisfied for the spirit gallery"
- "Complete Phase 3 of the implementation"

Use both! Specs for core features, vibe coding for polish and refinements.

## 🎭 Working with Spirits

When creating or modifying spirits:

1. Follow the structure in `design.md` Module 1
2. Reference `steering/spirit-personalities.md` for voice guidelines
3. Test with the sample text provided
4. Ensure all 4 prompt types are defined
5. The spirit consistency hook will auto-check on save

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run preview         # Preview production build

# Testing
npm run test            # Run unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report

# Linting
npm run lint            # Check for issues
npm run lint:fix        # Auto-fix issues

# Deployment (AWS)
./deploy.sh             # Build and deploy to S3 + CloudFront
```

See `.kiro/AWS_DEPLOYMENT.md` for detailed AWS setup instructions.

## 📁 File Organization

```
src/
├── components/          # React components
│   ├── TextUploader.jsx
│   ├── SpiritGallery.jsx
│   ├── InterpretationViewer.jsx
│   └── SpectralTimeline.jsx
├── spirits/            # Spirit engine
│   ├── spiritDefinitions.js
│   ├── promptBuilder.js
│   └── voiceProfiles.js
├── services/           # Business logic
│   ├── aiService.js
│   ├── fileParser.js
│   ├── interpretationEngine.js
│   └── exportService.js
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
├── context/            # React Context
└── styles/             # CSS/Tailwind
```

## 🎨 Styling Guidelines

### Color Palette
- **Background**: `#0a0a0f` (deep dark)
- **Primary**: `#8b5cf6` (purple)
- **Secondary**: `#10b981` (green)
- **Accent**: `#f97316` (orange)
- **Text**: `#e5e7eb` (light gray)

### Animations
- Use `transition-all duration-300 ease-in-out` for smooth transitions
- Add `hover:scale-105` for interactive elements
- Loading states: pulsing or floating animations
- Keep animations subtle with `prefers-reduced-motion` support

## 🐛 Debugging Tips

### AI Generation Issues
- Check API key in `.env`
- Verify prompt template has `{text}` placeholder
- Check token limits (max 4000 tokens for input)
- Review API error messages in console

### File Parsing Issues
- Verify file MIME type
- Check file size (max 10MB)
- Test with simple TXT file first
- Check console for parser errors

### State Management Issues
- Use React DevTools to inspect context
- Check if component is wrapped in provider
- Verify actions are dispatching correctly

## 📊 Progress Tracking

Track your progress through the 6 phases:

- [ ] **Phase 1**: Project Setup & Foundation (TASK-1 to TASK-3)
- [ ] **Phase 2**: Core Services (TASK-4 to TASK-7)
- [ ] **Phase 3**: UI Components (TASK-8 to TASK-11)
- [ ] **Phase 4**: Integration & Polish (TASK-12 to TASK-15)
- [ ] **Phase 5**: Testing & Deployment (TASK-16 to TASK-18)
- [ ] **Phase 6**: Hackathon Submission (TASK-19 to TASK-21)

## 🎃 Hackathon Submission Checklist

Before submitting:

- [ ] All acceptance criteria met (check `requirements.md`)
- [ ] .kiro directory committed (NOT in .gitignore)
- [ ] Public GitHub repo with MIT license
- [ ] Application deployed and accessible
- [ ] 3-minute demo video recorded and uploaded
- [ ] README includes Kiro usage documentation
- [ ] Category identified: **Frankenstein**
- [ ] All links tested and working

## 💡 Tips for Success

1. **Follow the spec**: It's designed to guide you through complex implementation
2. **Use agent hooks**: They'll catch issues early
3. **Test incrementally**: Don't wait until the end
4. **Keep it spooky**: Theme consistency matters for judging
5. **Document Kiro usage**: Judges need to see how you used Kiro effectively
6. **Start with core features**: Polish can come later
7. **Time management**: 3-minute demo means focus on impressive features

## 🆘 Getting Help

When asking Kiro for help:

**Good**:
- "Help me implement CP-4.3 for the interpretation engine"
- "The spirit gallery isn't meeting AC-6.2, can you fix it?"
- "Review my implementation of TASK-5 against the acceptance criteria"

**Less helpful**:
- "It's broken"
- "Make it better"
- "Add more features"

Be specific and reference the spec!

## 🎬 Demo Video Script Template

1. **Problem** (30s): "Writers struggle to see their work from different perspectives..."
2. **Solution** (30s): "The Haunted Reader summons literary spirits..."
3. **Demo** (90s): Upload → Select spirits → Generate → Compare → Export
4. **Kiro Usage** (30s): "Built with Kiro using specs, hooks, and steering..."

Keep it tight, keep it spooky! 👻
