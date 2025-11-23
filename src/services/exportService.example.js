/**
 * Export Service Usage Examples
 * 
 * This file demonstrates how to use the export service to export
 * interpretations in various formats.
 */

import { exportService } from './exportService.js';

// Example interpretation data
const exampleData = {
  originalText: `It was a dark and stormy night. The wind howled through the trees, 
and the rain beat against the windows. Inside the old mansion, a single candle 
flickered in the darkness.

The figure moved silently through the halls, their footsteps muffled by the 
thick carpet. They knew what they were looking for, and they wouldn't stop 
until they found it.`,

  interpretations: [
    {
      spiritId: 'poe',
      spiritName: 'Edgar Allan Poe',
      content: `Upon a night most dreary and tempestuous, when the very heavens 
seemed to weep with melancholic fury, the winds did shriek through the skeletal 
branches of ancient oaks, whilst torrential rains assailed the gothic casements 
with relentless vigor. Within the decrepit manor, a solitary taper cast its 
feeble luminescence against the encroaching shadows of eternal night.

Through the sepulchral corridors glided a phantasmal presence, their passage 
rendered soundless by the luxuriant carpeting that had witnessed countless 
secrets. With grim determination, this specter pursued their mysterious quarry, 
driven by an obsession that would brook no impediment.`,
      generatedAt: new Date('2024-10-31T23:30:00'),
      wordCount: 95
    },
    {
      spiritId: 'hemingway',
      spiritName: 'Ernest Hemingway',
      content: `It was night. It was dark. The storm came.

The wind blew. The rain fell. A candle burned in the house.

Someone walked through the halls. They walked quietly. They were looking 
for something. They would find it.`,
      generatedAt: new Date('2024-10-31T23:31:00'),
      wordCount: 42
    }
  ],

  metadata: {
    exportDate: new Date(),
    spiritsUsed: ['Edgar Allan Poe', 'Ernest Hemingway']
  }
};

// Example 1: Export as plain text
async function exportAsTextExample() {
  console.log('📄 Exporting as plain text...');
  
  const blob = await exportService.exportAsText(exampleData);
  exportService.downloadBlob(blob, 'haunted-reader-export.txt');
  
  console.log('✅ Text export complete!');
}

// Example 2: Export as Markdown
async function exportAsMarkdownExample() {
  console.log('📝 Exporting as Markdown...');
  
  const blob = await exportService.exportAsMarkdown(exampleData);
  exportService.downloadBlob(blob, 'haunted-reader-export.md');
  
  console.log('✅ Markdown export complete!');
}

// Example 3: Export as PDF
async function exportAsPDFExample() {
  console.log('📕 Exporting as PDF...');
  
  const blob = await exportService.exportAsPDF(exampleData);
  exportService.downloadBlob(blob, 'haunted-reader-export.pdf');
  
  console.log('✅ PDF export complete!');
}

// Example 4: Export all as ZIP (text format)
async function exportAllAsZipExample() {
  console.log('📦 Exporting all as ZIP...');
  
  const blob = await exportService.exportAll(exampleData, 'txt');
  exportService.downloadBlob(blob, 'haunted-reader-export.zip');
  
  console.log('✅ ZIP export complete!');
}

// Example 5: Export all as ZIP (Markdown format)
async function exportAllAsMarkdownZipExample() {
  console.log('📦 Exporting all as Markdown ZIP...');
  
  const blob = await exportService.exportAll(exampleData, 'md');
  exportService.downloadBlob(blob, 'haunted-reader-export-md.zip');
  
  console.log('✅ Markdown ZIP export complete!');
}

// Example 6: Error handling
async function exportWithErrorHandlingExample() {
  try {
    console.log('🔄 Attempting export with error handling...');
    
    const blob = await exportService.exportAsText(exampleData);
    exportService.downloadBlob(blob, 'safe-export.txt');
    
    console.log('✅ Export successful!');
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    // Show user-friendly error message
    alert(`The spirits are restless... Export failed: ${error.message}`);
  }
}

// Example 7: Export single interpretation
async function exportSingleInterpretationExample() {
  console.log('📄 Exporting single interpretation...');
  
  const singleData = {
    originalText: exampleData.originalText,
    interpretations: [exampleData.interpretations[0]], // Just Poe
    metadata: {
      exportDate: new Date(),
      spiritsUsed: ['Edgar Allan Poe']
    }
  };
  
  const blob = await exportService.exportAsMarkdown(singleData);
  exportService.downloadBlob(blob, 'poe-interpretation.md');
  
  console.log('✅ Single interpretation export complete!');
}

// Export examples for use in other files
export {
  exportAsTextExample,
  exportAsMarkdownExample,
  exportAsPDFExample,
  exportAllAsZipExample,
  exportAllAsMarkdownZipExample,
  exportWithErrorHandlingExample,
  exportSingleInterpretationExample,
  exampleData
};
