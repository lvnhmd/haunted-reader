/**
 * Plain Text Exporter
 * Exports interpretations as formatted plain text files
 */

class TxtExporter {
  /**
   * Export data as plain text
   * @param {Object} data - Export data
   * @returns {string} Formatted text content
   */
  export(data) {
    const sections = [];
    
    // Header
    sections.push(this._createHeader(data.metadata));
    
    // Original text section
    sections.push(this._createSection('ORIGINAL TEXT', data.originalText));
    
    // Interpretations
    for (const interpretation of data.interpretations) {
      const title = `INTERPRETATION BY ${interpretation.spiritName.toUpperCase()}`;
      const content = this._formatInterpretation(interpretation);
      sections.push(this._createSection(title, content));
    }
    
    // Footer
    sections.push(this._createFooter(data.metadata));
    
    return sections.join('\n\n');
  }

  /**
   * Create header section
   * @private
   */
  _createHeader(metadata) {
    const lines = [
      '='.repeat(70),
      '👻 THE HAUNTED READER - TEXT EXPORT 👻',
      '='.repeat(70),
      '',
      `Export Date: ${metadata.exportDate.toLocaleString()}`,
      `Spirits Summoned: ${metadata.spiritsUsed.join(', ')}`,
      '='.repeat(70)
    ];
    return lines.join('\n');
  }

  /**
   * Create a content section
   * @private
   */
  _createSection(title, content) {
    const lines = [
      '',
      '-'.repeat(70),
      title,
      '-'.repeat(70),
      '',
      content,
      ''
    ];
    return lines.join('\n');
  }

  /**
   * Format interpretation with metadata
   * @private
   */
  _formatInterpretation(interpretation) {
    const lines = [
      `Generated: ${interpretation.generatedAt.toLocaleString()}`,
      `Word Count: ${interpretation.wordCount}`,
      '',
      interpretation.content
    ];
    return lines.join('\n');
  }

  /**
   * Create footer section
   * @private
   */
  _createFooter(metadata) {
    const lines = [
      '='.repeat(70),
      'End of Haunted Reader Export',
      `Generated on ${metadata.exportDate.toLocaleDateString()}`,
      '='.repeat(70)
    ];
    return lines.join('\n');
  }
}

export const txtExporter = new TxtExporter();
export default txtExporter;
