# Export Service - Format Exporters

This directory contains format-specific exporters for The Haunted Reader.

## Available Exporters

### 📄 TXT Exporter (`txtExporter.js`)
Exports interpretations as plain text files with formatted sections.

**Features:**
- Clear section headers with ASCII art borders
- Metadata included (export date, spirits used)
- Readable formatting with proper spacing
- Spooky themed headers

**Output Format:**
```
======================================================================
👻 THE HAUNTED READER - TEXT EXPORT 👻
======================================================================

Export Date: 10/31/2024, 11:30:00 PM
Spirits Summoned: Edgar Allan Poe, Ernest Hemingway
======================================================================

----------------------------------------------------------------------
ORIGINAL TEXT
----------------------------------------------------------------------

[Original text content here]

----------------------------------------------------------------------
INTERPRETATION BY EDGAR ALLAN POE
----------------------------------------------------------------------

Generated: 10/31/2024, 11:30:00 PM
Word Count: 150

[Interpretation content here]
```

### 📝 Markdown Exporter (`markdownExporter.js`)
Exports interpretations as Markdown files with proper heading hierarchy.

**Features:**
- Proper heading hierarchy (H1 → H2 → H3)
- Table of contents with anchor links
- Metadata section with export information
- Spirit-specific sections with emoji icons
- Preserves paragraph structure

**Output Format:**
```markdown
# 👻 The Haunted Reader - Export

## 📋 Export Information

**Export Date:** 10/31/2024, 11:30:00 PM  
**Spirits Summoned:** Edgar Allan Poe, Ernest Hemingway  
**Total Interpretations:** 2

## 📑 Table of Contents

1. [Original Text](#-original-text)
2. [Edgar Allan Poe](#edgar-allan-poe)
3. [Ernest Hemingway](#ernest-hemingway)

## 📖 Original Text

[Original text content here]

## 🎭 Edgar Allan Poe

### Interpretation Details

**Generated:** 10/31/2024, 11:30:00 PM  
**Word Count:** 150  
**Spirit ID:** `poe`

### Content

[Interpretation content here]
```

### 📕 PDF Exporter (`pdfExporter.js`)
Exports interpretations as formatted PDF files using jsPDF.

**Features:**
- Professional PDF layout with A4 format
- Spooky color scheme (purple/indigo headers)
- Automatic page breaks
- Word wrapping for long text
- Metadata on title page
- Separate pages for each interpretation
- Readable formatting with proper spacing

**Configuration:**
- Page size: A4 (210mm × 297mm)
- Margins: 20mm
- Font sizes: Title (20pt), Heading (16pt), Body (10pt)
- Colors: Indigo primary, dark magenta secondary
- Line height: 7mm

## Usage

### Basic Export

```javascript
import { exportService } from './exportService.js';

const data = {
  originalText: 'Your original text here...',
  interpretations: [
    {
      spiritId: 'poe',
      spiritName: 'Edgar Allan Poe',
      content: 'Interpreted text...',
      generatedAt: new Date(),
      wordCount: 150
    }
  ],
  metadata: {
    exportDate: new Date(),
    spiritsUsed: ['Edgar Allan Poe']
  }
};

// Export as text
const txtBlob = await exportService.exportAsText(data);
exportService.downloadBlob(txtBlob, 'export.txt');

// Export as Markdown
const mdBlob = await exportService.exportAsMarkdown(data);
exportService.downloadBlob(mdBlob, 'export.md');

// Export as PDF
const pdfBlob = await exportService.exportAsPDF(data);
exportService.downloadBlob(pdfBlob, 'export.pdf');
```

### ZIP Export

```javascript
// Export all interpretations as separate files in a ZIP
const zipBlob = await exportService.exportAll(data, 'txt');
exportService.downloadBlob(zipBlob, 'all-interpretations.zip');

// ZIP with Markdown files
const mdZipBlob = await exportService.exportAll(data, 'md');
exportService.downloadBlob(mdZipBlob, 'all-interpretations-md.zip');

// ZIP with PDF files
const pdfZipBlob = await exportService.exportAll(data, 'pdf');
exportService.downloadBlob(pdfZipBlob, 'all-interpretations-pdf.zip');
```

## Correctness Properties

The export service implements the following correctness properties from the design spec:

- **CP-9.1**: Exports include all selected interpretations ✅
- **CP-9.2**: PDF maintains readable formatting ✅
- **CP-9.3**: Markdown uses proper heading hierarchy ✅
- **CP-9.4**: ZIP export includes separate file per interpretation ✅
- **CP-9.5**: Metadata included in all export formats ✅

## Error Handling

All exporters throw descriptive errors that can be caught and displayed to users:

```javascript
try {
  const blob = await exportService.exportAsPDF(data);
  exportService.downloadBlob(blob, 'export.pdf');
} catch (error) {
  console.error('Export failed:', error.message);
  // Show spooky error message to user
  alert(`The spirits are restless... ${error.message}`);
}
```

## Dependencies

- **jsPDF**: PDF generation
- **JSZip**: ZIP file creation

## Testing

Run tests with:
```bash
npm test -- src/services/exportService.test.js
```

## Future Enhancements

- DOCX export support
- Custom PDF themes
- Image embedding in PDFs
- Batch export with progress tracking
- Export templates
