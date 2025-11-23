/**
 * Export Service - Orchestrates exporting interpretations in multiple formats
 * 
 * Supports:
 * - Plain text (.txt)
 * - Markdown (.md)
 * - PDF (.pdf)
 * - ZIP archive (multiple interpretations)
 * 
 * All exports include metadata (spirit names, export date, etc.)
 */

import { txtExporter } from './exporters/txtExporter.js';
import { markdownExporter } from './exporters/markdownExporter.js';
import { pdfExporter } from './exporters/pdfExporter.js';
import JSZip from 'jszip';

/**
 * Export data structure
 * @typedef {Object} ExportData
 * @property {string} originalText - The original text being interpreted
 * @property {Array<Interpretation>} interpretations - Array of interpretations to export
 * @property {Object} metadata - Export metadata
 * @property {Date} metadata.exportDate - When the export was created
 * @property {string[]} metadata.spiritsUsed - Names of spirits used for interpretations
 */

/**
 * Interpretation structure
 * @typedef {Object} Interpretation
 * @property {string} spiritId - ID of the spirit
 * @property {string} spiritName - Display name of the spirit
 * @property {string} content - The interpreted content
 * @property {Date} generatedAt - When the interpretation was generated
 * @property {number} wordCount - Word count of the interpretation
 */

class ExportService {
  /**
   * Export interpretations as plain text
   * @param {ExportData} data - Export data
   * @returns {Promise<Blob>} Text file blob
   */
  async exportAsText(data) {
    try {
      const content = txtExporter.export(data);
      return new Blob([content], { type: 'text/plain;charset=utf-8' });
    } catch (error) {
      throw new Error(`Failed to export as text: ${error.message}`);
    }
  }

  /**
   * Export interpretations as Markdown
   * @param {ExportData} data - Export data
   * @returns {Promise<Blob>} Markdown file blob
   */
  async exportAsMarkdown(data) {
    try {
      const content = markdownExporter.export(data);
      return new Blob([content], { type: 'text/markdown;charset=utf-8' });
    } catch (error) {
      throw new Error(`Failed to export as Markdown: ${error.message}`);
    }
  }

  /**
   * Export interpretations as PDF
   * @param {ExportData} data - Export data
   * @returns {Promise<Blob>} PDF file blob
   */
  async exportAsPDF(data) {
    try {
      const blob = await pdfExporter.export(data);
      return blob;
    } catch (error) {
      throw new Error(`Failed to export as PDF: ${error.message}`);
    }
  }

  /**
   * Export all interpretations as a ZIP file
   * Each interpretation gets its own file
   * @param {ExportData} data - Export data
   * @param {string} format - Format for individual files ('txt', 'md', or 'pdf')
   * @returns {Promise<Blob>} ZIP file blob
   */
  async exportAll(data, format = 'txt') {
    try {
      const zip = new JSZip();
      
      // Add original text
      zip.file('original.txt', data.originalText);
      
      // Add metadata file
      const metadataContent = this._formatMetadata(data.metadata);
      zip.file('metadata.txt', metadataContent);
      
      // Add each interpretation as a separate file
      for (const interpretation of data.interpretations) {
        const filename = this._sanitizeFilename(interpretation.spiritName);
        const singleInterpretationData = {
          originalText: data.originalText,
          interpretations: [interpretation],
          metadata: data.metadata
        };
        
        let fileContent;
        let extension;
        
        switch (format) {
          case 'md':
            fileContent = markdownExporter.export(singleInterpretationData);
            extension = 'md';
            break;
          case 'pdf':
            const pdfBlob = await pdfExporter.export(singleInterpretationData);
            zip.file(`${filename}.pdf`, pdfBlob);
            continue; // Skip the text-based file addition below
          case 'txt':
          default:
            fileContent = txtExporter.export(singleInterpretationData);
            extension = 'txt';
        }
        
        zip.file(`${filename}.${extension}`, fileContent);
      }
      
      // Generate ZIP blob
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      return zipBlob;
    } catch (error) {
      throw new Error(`Failed to create ZIP export: ${error.message}`);
    }
  }

  /**
   * Format metadata as readable text
   * @private
   */
  _formatMetadata(metadata) {
    const lines = [
      '='.repeat(50),
      'HAUNTED READER - EXPORT METADATA',
      '='.repeat(50),
      '',
      `Export Date: ${metadata.exportDate.toLocaleString()}`,
      `Spirits Used: ${metadata.spiritsUsed.join(', ')}`,
      '',
      '='.repeat(50)
    ];
    return lines.join('\n');
  }

  /**
   * Sanitize filename to remove invalid characters
   * @private
   */
  _sanitizeFilename(name) {
    return name
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_+/g, '_')
      .toLowerCase();
  }

  /**
   * Trigger browser download of a blob
   * @param {Blob} blob - File blob to download
   * @param {string} filename - Suggested filename
   */
  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Export singleton instance
export const exportService = new ExportService();
export default exportService;
