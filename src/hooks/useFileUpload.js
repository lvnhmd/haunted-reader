import { useCallback } from 'react';
import { useParsedText, useError } from '../context/AppContext';
import { parseFile, parseText as parseTextService } from '../services/fileParser';

/**
 * useFileUpload - Hook for handling file uploads and text parsing
 * Manages file validation, parsing, and error handling
 */
export function useFileUpload() {
  const { setParsedText, clearParsedText } = useParsedText();
  const { setError, clearError } = useError();

  /**
   * Upload and parse a file
   */
  const uploadFile = useCallback(
    async (file) => {
      clearError();

      // Validate file
      if (!file) {
        setError({
          message: 'No file selected',
          type: 'validation',
          details: 'Please select a file to upload',
        });
        return null;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        setError({
          message: 'File too large',
          type: 'validation',
          details: `File size must be less than 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        });
        return null;
      }

      // Validate file type
      const validTypes = ['.txt', '.pdf', '.epub'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validTypes.includes(fileExtension)) {
        setError({
          message: 'Invalid file type',
          type: 'validation',
          details: `Please upload a TXT, PDF, or EPUB file. You uploaded: ${fileExtension}`,
        });
        return null;
      }

      try {
        // Parse the file
        const parsedText = await parseFile(file);
        
        // Validate parsed content
        if (!parsedText || !parsedText.content || parsedText.content.trim().length === 0) {
          setError({
            message: 'Empty file',
            type: 'parsing',
            details: 'The file appears to be empty or could not be read',
          });
          return null;
        }

        // Store parsed text in state
        setParsedText(parsedText);
        
        return parsedText;
      } catch (error) {
        console.error('Error parsing file:', error);
        
        setError({
          message: 'Failed to parse file',
          type: 'parsing',
          details: error.message || 'An unknown error occurred while parsing the file',
        });
        
        return null;
      }
    },
    [setParsedText, setError, clearError]
  );

  /**
   * Parse text directly (from paste)
   */
  const parseText = useCallback(
    async (text) => {
      clearError();

      if (!text || text.trim().length === 0) {
        setError({
          message: 'Empty text',
          type: 'validation',
          details: 'Please enter some text to analyze',
        });
        return null;
      }

      try {
        const parsedText = await parseTextService(text);
        setParsedText(parsedText);
        return parsedText;
      } catch (error) {
        console.error('Error parsing text:', error);
        
        setError({
          message: 'Failed to parse text',
          type: 'parsing',
          details: error.message || 'An unknown error occurred while parsing the text',
        });
        
        return null;
      }
    },
    [setParsedText, setError, clearError]
  );

  /**
   * Clear uploaded text
   */
  const clearText = useCallback(() => {
    clearParsedText();
    clearError();
  }, [clearParsedText, clearError]);

  return {
    uploadFile,
    parseText,
    clearText,
  };
}

export default useFileUpload;
