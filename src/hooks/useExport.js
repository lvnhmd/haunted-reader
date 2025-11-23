import { useCallback } from 'react';
import { useInterpretations, useParsedText, useError } from '../context/AppContext';
import { exportService } from '../services/exportService';

/**
 * useExport - Hook for exporting interpretations
 * Handles export in multiple formats with error handling
 */
export function useExport() {
  const { interpretations } = useInterpretations();
  const { parsedText } = useParsedText();
  const { setError } = useError();

  /**
   * Export a single interpretation
   */
  const exportSingle = useCallback(
    async (interpretation, format = 'txt') => {
      if (!interpretation) {
        setError({
          message: 'No interpretation to export',
          type: 'validation',
          details: 'Please select an interpretation to export',
        });
        return;
      }

      try {
        const exportData = {
          originalText: parsedText?.content || '',
          interpretations: [interpretation],
          metadata: {
            exportDate: new Date(),
            spiritsUsed: [interpretation.spiritId],
          },
        };

        let blob;
        let filename;

        switch (format) {
          case 'txt':
            blob = await exportService.exportAsText(exportData);
            filename = `interpretation-${interpretation.spiritId}-${Date.now()}.txt`;
            break;
          case 'md':
          case 'markdown':
            blob = await exportService.exportAsMarkdown(exportData);
            filename = `interpretation-${interpretation.spiritId}-${Date.now()}.md`;
            break;
          case 'pdf':
            blob = await exportService.exportAsPDF(exportData);
            filename = `interpretation-${interpretation.spiritId}-${Date.now()}.pdf`;
            break;
          default:
            throw new Error(`Unsupported format: ${format}`);
        }

        // Trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return true;
      } catch (error) {
        console.error('Error exporting interpretation:', error);
        
        setError({
          message: 'Failed to export interpretation',
          type: 'export',
          details: error.message,
        });
        
        return false;
      }
    },
    [parsedText, setError]
  );

  /**
   * Export all interpretations as a ZIP file
   */
  const exportAll = useCallback(
    async () => {
      if (interpretations.length === 0) {
        setError({
          message: 'No interpretations to export',
          type: 'validation',
          details: 'Please generate some interpretations first',
        });
        return;
      }

      try {
        const exportData = {
          originalText: parsedText?.content || '',
          interpretations,
          metadata: {
            exportDate: new Date(),
            spiritsUsed: interpretations.map(i => i.spiritId),
          },
        };

        const blob = await exportService.exportAll(exportData);
        const filename = `haunted-reader-interpretations-${Date.now()}.zip`;

        // Trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        return true;
      } catch (error) {
        console.error('Error exporting all interpretations:', error);
        
        setError({
          message: 'Failed to export interpretations',
          type: 'export',
          details: error.message,
        });
        
        return false;
      }
    },
    [interpretations, parsedText, setError]
  );

  /**
   * Export in a specific format
   */
  const exportAs = useCallback(
    async (interpretation, format) => {
      return exportSingle(interpretation, format);
    },
    [exportSingle]
  );

  return {
    exportSingle,
    exportAll,
    exportAs,
  };
}

export default useExport;
