/**
 * Export Service Tests
 * Tests for the export service and format-specific exporters
 */

import { describe, it, expect } from 'vitest';
import { exportService } from './exportService.js';
import { txtExporter } from './exporters/txtExporter.js';
import { markdownExporter } from './exporters/markdownExporter.js';
import { pdfExporter } from './exporters/pdfExporter.js';

// Test data
const testData = {
  originalText: 'This is a test text for export.',
  interpretations: [
    {
      spiritId: 'test-spirit',
      spiritName: 'Test Spirit',
      content: 'This is a test interpretation.',
      generatedAt: new Date('2024-10-31T12:00:00'),
      wordCount: 6
    }
  ],
  metadata: {
    exportDate: new Date('2024-10-31T12:00:00'),
    spiritsUsed: ['Test Spirit']
  }
};

describe('ExportService', () => {
  describe('exportAsText', () => {
    it('should export data as text blob', async () => {
      const blob = await exportService.exportAsText(testData);
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/plain;charset=utf-8');
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should include all interpretations', async () => {
      const blob = await exportService.exportAsText(testData);
      const text = await blob.text();
      
      expect(text).toContain('ORIGINAL TEXT');
      expect(text).toContain('Test Spirit');
      expect(text).toContain('This is a test interpretation');
    });

    it('should include metadata', async () => {
      const blob = await exportService.exportAsText(testData);
      const text = await blob.text();
      
      expect(text).toContain('Export Date');
      expect(text).toContain('Spirits Summoned');
    });
  });

  describe('exportAsMarkdown', () => {
    it('should export data as markdown blob', async () => {
      const blob = await exportService.exportAsMarkdown(testData);
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/markdown;charset=utf-8');
      expect(blob.size).toBeGreaterThan(0);
    });

    it('should use proper heading hierarchy', async () => {
      const blob = await exportService.exportAsMarkdown(testData);
      const text = await blob.text();
      
      expect(text).toContain('# 👻 The Haunted Reader');
      expect(text).toContain('## 📖 Original Text');
      expect(text).toContain('## 🎭 Test Spirit');
    });
  });

  describe('exportAsPDF', () => {
    it('should export data as PDF blob', async () => {
      const blob = await exportService.exportAsPDF(testData);
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');
      expect(blob.size).toBeGreaterThan(0);
    });
  });

  describe('exportAll', () => {
    it('should create ZIP file with multiple files', async () => {
      const blob = await exportService.exportAll(testData, 'txt');
      
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/zip');
      expect(blob.size).toBeGreaterThan(0);
    });
  });
});

describe('TxtExporter', () => {
  it('should format text with headers and sections', () => {
    const result = txtExporter.export(testData);
    
    expect(result).toContain('THE HAUNTED READER');
    expect(result).toContain('ORIGINAL TEXT');
    expect(result).toContain('TEST SPIRIT');
  });
});

describe('MarkdownExporter', () => {
  it('should format markdown with proper structure', () => {
    const result = markdownExporter.export(testData);
    
    expect(result).toContain('# 👻 The Haunted Reader');
    expect(result).toContain('## 📖 Original Text');
    expect(result).toContain('## 🎭 Test Spirit');
  });

  it('should include table of contents', () => {
    const result = markdownExporter.export(testData);
    
    expect(result).toContain('## 📑 Table of Contents');
    expect(result).toContain('[Original Text]');
    expect(result).toContain('[Test Spirit]');
  });
});

describe('PdfExporter', () => {
  it('should generate PDF blob', async () => {
    const blob = await pdfExporter.export(testData);
    
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/pdf');
  });
});
