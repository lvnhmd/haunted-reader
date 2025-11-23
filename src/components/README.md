# Haunted Reader - UI Components

This directory contains all React components for the Haunted Reader application.

## 📤 Text Upload Components (TASK-8) ✅

### TextUploader
Main orchestrator component for text upload functionality.

**Props:**
- `onTextParsed: (parsedText) => void` - Callback when text is successfully parsed
- `onError: (error) => void` - Callback when an error occurs

**Features:**
- Tab-based interface (File Upload / Paste Text)
- Progress bar for large files (> 1MB)
- Parsed text preview with metadata
- Error handling with spooky messages

**Usage:**
```jsx
import TextUploader from './components/TextUploader';

<TextUploader
  onTextParsed={(result) => console.log('Parsed:', result)}
  onError={(err) => console.error('Error:', err)}
/>
```

---

### FileDropzone
Drag-and-drop file upload component.

**Props:**
- `onFileSelect: (file) => void` - Callback when file is selected
- `onError: (error) => void` - Callback for validation errors
- `disabled: boolean` - Disable the dropzone

**Features:**
- Drag-and-drop support
- File type validation (TXT, PDF, EPUB)
- 10MB size limit
- Visual feedback for drag states
- Spooky animations

---

### TextInput
Direct text paste component.

**Props:**
- `onTextSubmit: (text) => void` - Callback when text is submitted
- `disabled: boolean` - Disable the input

**Features:**
- Large textarea for pasting
- Character/word count display
- 50,000 character limit
- Focus effects
- Spooky styling

---

## 🎭 Spirit Gallery Components (TASK-9) 🔴 TODO

Coming soon...

---

## 📖 Interpretation Viewer Components (TASK-10) 🔴 TODO

Coming soon...

---

## 📊 Spectral Timeline Components (TASK-11) 🔴 TODO

Coming soon...

---

## 🎨 Styling Guidelines

All components follow the Haunted Reader spooky theme:
- **Colors**: Purple (#9333ea), Green, Orange accents on dark background
- **Emojis**: 👻 📖 🕯️ 👁️ 🔮 ⚰️ 💀
- **Animations**: Smooth transitions, pulse effects, hover states
- **Typography**: Clear, readable text with thematic flair

## 🧪 Testing

Components can be tested individually or integrated into the main App.

```bash
# Run all tests
npm test

# Start dev server to test UI
npm run dev
```
