/**
 * Example usage of InterpretationViewer component
 * This demonstrates how to use the viewer with sample data
 */

import InterpretationViewer from './InterpretationViewer';

// Sample interpretation data
const sampleInterpretations = [
  {
    spiritId: 'poe',
    content: `Upon the midnight dreary, as I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—
The tale before me spoke of shadows deep and mysteries untold,
Of souls that wandered through the darkness, seeking light forevermore.
In melancholic prose, the narrative unfolded like a funeral shroud,
Each word a whisper from beyond the grave, each sentence dark and proud.`,
    generatedAt: new Date('2025-11-23T19:00:00'),
    wordCount: 67,
  },
  {
    spiritId: 'hemingway',
    content: `The story was good. It was true. The man walked. He thought about things. 
The sun was hot. He kept walking. It was hard but he did it. That was all.`,
    generatedAt: new Date('2025-11-23T19:05:00'),
    wordCount: 32,
  },
  {
    spiritId: 'lovecraft',
    content: `What eldritch horrors lurked within the cyclopean narrative before me! 
The text spoke of things man was not meant to know, of non-Euclidean geometries 
that defied comprehension, of ancient evils that slumbered in the depths of time. 
The very words seemed to writhe upon the page, as if possessed by some blasphemous 
intelligence from beyond the stars. To read further would be to court madness itself, 
yet I found myself unable to turn away from the ineffable truths that lay within.`,
    generatedAt: new Date('2025-11-23T19:10:00'),
    wordCount: 89,
  },
];

const sampleOriginalText = `Once upon a time, in a small village nestled between rolling hills, 
there lived a young woman named Elena. She spent her days tending to her garden and her 
nights reading by candlelight. One evening, as the moon rose full and bright, she heard 
a strange sound coming from the forest beyond her cottage. Curiosity overcame caution, 
and she ventured into the darkness to investigate.`;

// Example component usage
function InterpretationViewerExample() {
  const handleExport = (interpretation) => {
    console.log('Exporting interpretation:', interpretation.spiritId);
    // In real app, this would call ExportService
  };

  const handleRegenerate = (spiritId) => {
    console.log('Regenerating interpretation for:', spiritId);
    // In real app, this would call InterpretationEngine
  };

  const handleExportAll = () => {
    console.log('Exporting all interpretations');
    // In real app, this would call ExportService with all interpretations
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-400 mb-8 text-center">
          👻 Interpretation Viewer Example
        </h1>

        <InterpretationViewer
          originalText={sampleOriginalText}
          interpretations={sampleInterpretations}
          onExport={handleExport}
          onRegenerate={handleRegenerate}
          onExportAll={handleExportAll}
          loadingSpirits={['austen']} // Simulating one spirit still loading
        />
      </div>
    </div>
  );
}

export default InterpretationViewerExample;

/**
 * Usage Notes:
 * 
 * 1. Basic usage with interpretations:
 *    <InterpretationViewer
 *      originalText="Your text here"
 *      interpretations={interpretationsArray}
 *      onExport={handleExport}
 *      onRegenerate={handleRegenerate}
 *    />
 * 
 * 2. With loading states:
 *    <InterpretationViewer
 *      originalText="Your text here"
 *      interpretations={completedInterpretations}
 *      loadingSpirits={['poe', 'dickens']}
 *      onExport={handleExport}
 *      onRegenerate={handleRegenerate}
 *    />
 * 
 * 3. With export all functionality:
 *    <InterpretationViewer
 *      originalText="Your text here"
 *      interpretations={interpretationsArray}
 *      onExport={handleExport}
 *      onRegenerate={handleRegenerate}
 *      onExportAll={handleExportAll}
 *    />
 * 
 * Props:
 * - originalText: string - The original uploaded text
 * - interpretations: Array<Interpretation> - Array of generated interpretations
 * - onExport: (interpretation) => void - Callback for exporting single interpretation
 * - onRegenerate: (spiritId) => void - Callback for regenerating interpretation
 * - onExportAll: () => void - Optional callback for exporting all interpretations
 * - loadingSpirits: Array<string> - Optional array of spirit IDs currently generating
 * 
 * Interpretation Object Structure:
 * {
 *   spiritId: string,      // ID of the spirit (must match spiritDefinitions)
 *   content: string,       // The generated interpretation text
 *   generatedAt: Date,     // Timestamp of generation
 *   wordCount: number      // Word count of the interpretation
 * }
 */
