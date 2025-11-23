/**
 * PDF Exporter
 * Exports interpretations as formatted PDF files with readable formatting
 */

import { jsPDF } from 'jspdf';

class PdfExporter {
  constructor() {
    // PDF configuration
    this.config = {
      pageWidth: 210, // A4 width in mm
      pageHeight: 297, // A4 height in mm
      margin: 20,
      lineHeight: 7,
      fontSize: {
        title: 20,
        heading: 16,
        subheading: 12,
        body: 10,
        small: 8
      },
      colors: {
        primary: [75, 0, 130], // Indigo (spooky purple)
        secondary: [139, 0, 139], // Dark magenta
        text: [0, 0, 0], // Black
        gray: [128, 128, 128] // Gray
      }
    };
  }

  /**
   * Export data as PDF
   * @param {Object} data - Export data
   * @returns {Promise<Blob>} PDF blob
   */
  async export(data) {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      let yPosition = this.config.margin;

      // Title page
      yPosition = this._addTitlePage(doc, data.metadata, yPosition);

      // Original text
      doc.addPage();
      yPosition = this.config.margin;
      yPosition = this._addSection(doc, 'Original Text', data.originalText, yPosition);

      // Interpretations
      for (const interpretation of data.interpretations) {
        doc.addPage();
        yPosition = this.config.margin;
        yPosition = this._addInterpretationSection(doc, interpretation, yPosition);
      }

      // Convert to blob
      const pdfBlob = doc.output('blob');
      return pdfBlob;
    } catch (error) {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  /**
   * Add title page
   * @private
   */
  _addTitlePage(doc, metadata, yPosition) {
    const centerX = this.config.pageWidth / 2;

    // Title
    doc.setFontSize(this.config.fontSize.title);
    doc.setTextColor(...this.config.colors.primary);
    doc.text('👻 The Haunted Reader', centerX, yPosition, { align: 'center' });
    yPosition += 15;

    // Subtitle
    doc.setFontSize(this.config.fontSize.heading);
    doc.setTextColor(...this.config.colors.secondary);
    doc.text('Text Interpretation Export', centerX, yPosition, { align: 'center' });
    yPosition += 20;

    // Metadata
    doc.setFontSize(this.config.fontSize.body);
    doc.setTextColor(...this.config.colors.text);
    
    const metadataLines = [
      `Export Date: ${metadata.exportDate.toLocaleString()}`,
      `Spirits Summoned: ${metadata.spiritsUsed.join(', ')}`,
      `Total Interpretations: ${metadata.spiritsUsed.length}`
    ];

    for (const line of metadataLines) {
      doc.text(line, centerX, yPosition, { align: 'center' });
      yPosition += this.config.lineHeight;
    }

    return yPosition;
  }

  /**
   * Add a content section
   * @private
   */
  _addSection(doc, title, content, yPosition) {
    // Section title
    doc.setFontSize(this.config.fontSize.heading);
    doc.setTextColor(...this.config.colors.primary);
    doc.text(title, this.config.margin, yPosition);
    yPosition += 10;

    // Content
    doc.setFontSize(this.config.fontSize.body);
    doc.setTextColor(...this.config.colors.text);
    yPosition = this._addWrappedText(doc, content, yPosition);

    return yPosition;
  }

  /**
   * Add interpretation section
   * @private
   */
  _addInterpretationSection(doc, interpretation, yPosition) {
    // Spirit name
    doc.setFontSize(this.config.fontSize.heading);
    doc.setTextColor(...this.config.colors.primary);
    doc.text(`🎭 ${interpretation.spiritName}`, this.config.margin, yPosition);
    yPosition += 10;

    // Metadata
    doc.setFontSize(this.config.fontSize.small);
    doc.setTextColor(...this.config.colors.gray);
    doc.text(`Generated: ${interpretation.generatedAt.toLocaleString()}`, this.config.margin, yPosition);
    yPosition += 5;
    doc.text(`Word Count: ${interpretation.wordCount}`, this.config.margin, yPosition);
    yPosition += 10;

    // Content
    doc.setFontSize(this.config.fontSize.body);
    doc.setTextColor(...this.config.colors.text);
    yPosition = this._addWrappedText(doc, interpretation.content, yPosition);

    return yPosition;
  }

  /**
   * Add text with word wrapping and page breaks
   * @private
   */
  _addWrappedText(doc, text, yPosition) {
    const maxWidth = this.config.pageWidth - (2 * this.config.margin);
    const paragraphs = text.split(/\n\n+/);

    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) continue;

      // Split text into lines that fit the page width
      const lines = doc.splitTextToSize(paragraph, maxWidth);

      for (const line of lines) {
        // Check if we need a new page
        if (yPosition > this.config.pageHeight - this.config.margin) {
          doc.addPage();
          yPosition = this.config.margin;
        }

        doc.text(line, this.config.margin, yPosition);
        yPosition += this.config.lineHeight;
      }

      // Add paragraph spacing
      yPosition += this.config.lineHeight / 2;
    }

    return yPosition;
  }
}

export const pdfExporter = new PdfExporter();
export default pdfExporter;
