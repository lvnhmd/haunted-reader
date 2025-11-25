# 👻 The Haunted Reader

> Summon literary spirits to analyze, rewrite, and interpret texts from multiple perspectives

## 🎃 Kiroween Hackathon Entry - Frankenstein Category

The Haunted Reader is a multi-perspective text interpretation engine that stitches together literary analysis, writing generation, perspective modeling, and style transformation into one powerful chimera.

## 🔮 What It Does

Upload any text (book chapters, drafts, manuscripts, highlights) and The Haunted Reader will:

- **Summon Literary Spirits**: Rewrite text in the voice of classic authors (Poe, Dickens, Austen, Lovecraft)
- **Multi-Perspective Analysis**: View summaries and interpretations from different viewpoints (villain, child, scholar, demon)
- **Genre Shifting**: Transform stories across genres (horror, romance, sci-fi)
- **Shadow Endings**: Generate alternative endings from various perspectives
- **Spectral Timeline**: Visualize how text evolves under different lenses

## 🧩 The Frankenstein Chimera

This project stitches together:
- Literary analysis engine
- Style transformation AI (Amazon Bedrock)
- Perspective modeling system
- Real-time text editor
- File parsing (PDF/EPUB/TXT)
- AWS cloud infrastructure (S3, CloudFront, Cognito, Bedrock)
- Haunting UI with spooky visualizations

## 🛠 Tech Stack

- Frontend: React + Vite
- AI: Amazon Bedrock (Claude 3 Sonnet/Haiku)
- Authentication: Amazon Cognito Identity Pool
- Hosting: AWS S3 + CloudFront CDN
- File Processing: PDF.js, EPUB parser
- Styling: Tailwind CSS with spooky theme

## 🎭 Available Spirits

- 👻 The Ghost of Agatha Christie (mystery lens)
- 👹 The Demon of Irony (sarcasm lens)
- 💀 The Villain (malicious POV)
- 🎩 Charles Dickens (Victorian lens)
- 🌙 Gothic Poet (dark romanticism)
- 👶 A 5-year-old (innocent lens)
- 🧙 An Old Scholar (academic lens)
- 🐺 The Monster (creature's perspective)
- 📚 Neutral Narrator (objective)
- 🔮 Prophet of Doom (apocalyptic lens)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- AWS Account with Bedrock access
- AWS CLI configured

### Setup

1. **Clone and install dependencies**
```bash
npm install
```

2. **Configure AWS Bedrock**
   - Enable Claude 3 models in Amazon Bedrock console
   - Create Cognito Identity Pool for unauthenticated access
   - Configure IAM role with Bedrock permissions
   - See `.kiro/BEDROCK_SETUP.md` for detailed instructions

3. **Set environment variables**
```bash
cp .env.example .env
# Edit .env with your AWS configuration
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

6. **Deploy to AWS**
```bash
./deploy-to-s3.sh
```

See `.kiro/specs/haunted-reader/AWS-DEPLOYMENT-GUIDE.md` for detailed deployment instructions.

## 🌐 Live Demo

**Deployment Status:** ✅ Deployed to AWS with HTTPS  
**CloudFront URL (HTTPS):** https://d3rxkqr5wtpb9g.cloudfront.net  
**S3 Website URL (HTTP):** http://haunted-reader-kiroween-1764092634.s3-website-us-east-1.amazonaws.com

✅ **Secure HTTPS access via CloudFront CDN**

See `.kiro/specs/haunted-reader/TASK-18-COMPLETION.md` for deployment details.

## 🎬 Demo Video

[Link to 3-minute demo video - Coming soon]

## 📝 How Kiro Was Used

### Spec-Driven Development
Created comprehensive specs (`.kiro/specs/haunted-reader/`) defining:
- **requirements.md**: 7 core features with acceptance criteria
- **design.md**: 9 modules with detailed architecture and 30+ correctness properties
- **tasks.md**: 21 implementation tasks across 6 phases with dependencies

This structured approach ensured consistent implementation across the chimera while maintaining clear progress tracking.

### Agent Hooks
Automated workflows with custom hooks (`.kiro/hooks/`):
- **on-file-save.json**: Auto-validate JS/JSX files for syntax errors on save
- **spirit-consistency-check.json**: Verify spirit definitions maintain consistent voice when modified

These hooks caught issues early and maintained code quality throughout development.

### Steering Documents
Defined project-wide guidelines (`.kiro/steering/`):
- **project-context.md**: Overall architecture, code style, and development principles
- **spirit-personalities.md**: Voice consistency rules for all 10 literary spirits
- **ai-prompts.md**: Prompt engineering best practices for Bedrock integration

Steering ensured Kiro understood the spooky theme, AWS architecture, and spirit personality requirements.

### Vibe Coding
Used natural conversation with Kiro to:
- Rapidly prototype the haunting UI with spooky animations
- Refine the "spirit summoning" experience
- Iterate on AWS Bedrock integration
- Polish error messages with Halloween themes

The combination of structured specs and conversational refinement created the perfect development flow.

## 📜 License

MIT License

## 🎃 Happy Kiroween!
