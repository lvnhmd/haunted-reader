import { useCallback } from 'react';
import { useInterpretations, useParsedText, useError } from '../context/AppContext';
import { interpretationEngine } from '../services/interpretationEngine';

/**
 * useGenerateInterpretations - Hook for generating spirit interpretations
 * Handles the full flow: loading states, API calls, error handling
 */
export function useGenerateInterpretations() {
  const { parsedText } = useParsedText();
  const {
    addInterpretation,
    addLoadingSpirit,
    removeLoadingSpirit,
  } = useInterpretations();
  const { setError } = useError();

  /**
   * Generate interpretation for a single spirit
   */
  const generateSingle = useCallback(
    async (spiritId) => {
      if (!parsedText || !parsedText.content) {
        setError({
          message: 'No text to interpret',
          type: 'validation',
          details: 'Please upload text before generating interpretations',
        });
        return null;
      }

      try {
        addLoadingSpirit(spiritId);

        const interpretation = await interpretationEngine.generateSummary(
          parsedText.content,
          spiritId
        );

        addInterpretation(interpretation);
        removeLoadingSpirit(spiritId);

        return interpretation;
      } catch (error) {
        console.error(`Error generating interpretation for ${spiritId}:`, error);
        
        setError({
          message: `Failed to generate interpretation for ${spiritId}`,
          type: 'generation',
          details: error.message,
        });

        removeLoadingSpirit(spiritId);
        return null;
      }
    },
    [parsedText, addInterpretation, addLoadingSpirit, removeLoadingSpirit, setError]
  );

  /**
   * Generate interpretations for multiple spirits in parallel
   */
  const generateMultiple = useCallback(
    async (spiritIds) => {
      if (!parsedText || !parsedText.content) {
        setError({
          message: 'No text to interpret',
          type: 'validation',
          details: 'Please upload text before generating interpretations',
        });
        return [];
      }

      // Add all spirits to loading state
      spiritIds.forEach(spiritId => addLoadingSpirit(spiritId));

      try {
        // Generate all interpretations in parallel
        const results = await Promise.allSettled(
          spiritIds.map(spiritId =>
            interpretationEngine.generateSummary(parsedText.content, spiritId)
          )
        );

        // Process results
        const interpretations = [];
        results.forEach((result, index) => {
          const spiritId = spiritIds[index];
          
          if (result.status === 'fulfilled') {
            addInterpretation(result.value);
            interpretations.push(result.value);
          } else {
            console.error(`Failed to generate for ${spiritId}:`, result.reason);
            setError({
              message: `Failed to generate interpretation for ${spiritId}`,
              type: 'generation',
              details: result.reason.message,
            });
          }
          
          removeLoadingSpirit(spiritId);
        });

        return interpretations;
      } catch (error) {
        console.error('Error generating multiple interpretations:', error);
        
        // Remove all from loading state
        spiritIds.forEach(spiritId => removeLoadingSpirit(spiritId));
        
        setError({
          message: 'Failed to generate interpretations',
          type: 'generation',
          details: error.message,
        });

        return [];
      }
    },
    [parsedText, addInterpretation, addLoadingSpirit, removeLoadingSpirit, setError]
  );

  /**
   * Regenerate an existing interpretation
   */
  const regenerate = useCallback(
    async (spiritId) => {
      return generateSingle(spiritId);
    },
    [generateSingle]
  );

  return {
    generateSingle,
    generateMultiple,
    regenerate,
  };
}

export default useGenerateInterpretations;
