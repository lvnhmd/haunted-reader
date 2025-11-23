/**
 * Example usage of AppContext and custom hooks
 * Demonstrates how to use global state management in components
 */

import { AppProvider, useAppState, useSpirits, useInterpretations, useParsedText } from './AppContext';
import useFileUpload from '../hooks/useFileUpload';
import useGenerateInterpretations from '../hooks/useGenerateInterpretations';
import useExport from '../hooks/useExport';

/**
 * Example Component 1: File Upload
 */
function FileUploadExample() {
  const { parsedText } = useParsedText();
  const { uploadFile, parseText, clearText } = useFileUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const result = await uploadFile(file);
      if (result) {
        console.log('File uploaded successfully:', result);
      }
    }
  };

  const handleTextPaste = async (e) => {
    const text = e.target.value;
    if (text.length > 100) { // Only parse if substantial text
      await parseText(text);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-purple-400 mb-4">File Upload</h2>
      
      <input
        type="file"
        accept=".txt,.pdf,.epub"
        onChange={handleFileChange}
        className="mb-4"
      />
      
      <textarea
        placeholder="Or paste text here..."
        onChange={handleTextPaste}
        className="w-full p-4 bg-gray-800 text-white rounded"
        rows={5}
      />

      {parsedText && (
        <div className="mt-4">
          <p className="text-green-400">✓ Text loaded: {parsedText.metadata.wordCount} words</p>
          <button
            onClick={clearText}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          >
            Clear Text
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Example Component 2: Spirit Selection
 */
function SpiritSelectionExample() {
  const { selectedSpirits, selectSpirit, deselectSpirit } = useSpirits();

  const spirits = ['poe', 'dickens', 'austen', 'lovecraft', 'hemingway'];

  const toggleSpirit = (spiritId) => {
    if (selectedSpirits.includes(spiritId)) {
      deselectSpirit(spiritId);
    } else {
      selectSpirit(spiritId);
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-purple-400 mb-4">
        Select Spirits ({selectedSpirits.length}/5)
      </h2>
      
      <div className="flex flex-wrap gap-2">
        {spirits.map(spiritId => (
          <button
            key={spiritId}
            onClick={() => toggleSpirit(spiritId)}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              selectedSpirits.includes(spiritId)
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {spiritId}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Example Component 3: Generate Interpretations
 */
function GenerateInterpretationsExample() {
  const { selectedSpirits } = useSpirits();
  const { interpretations, loadingSpirits } = useInterpretations();
  const { generateSingle, generateMultiple } = useGenerateInterpretations();

  const handleGenerateAll = async () => {
    if (selectedSpirits.length === 0) {
      alert('Please select at least one spirit');
      return;
    }
    await generateMultiple(selectedSpirits);
  };

  const handleGenerateSingle = async (spiritId) => {
    await generateSingle(spiritId);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-purple-400 mb-4">
        Generate Interpretations
      </h2>
      
      <button
        onClick={handleGenerateAll}
        disabled={selectedSpirits.length === 0 || loadingSpirits.length > 0}
        className="px-6 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Generate All ({selectedSpirits.length} spirits)
      </button>

      {loadingSpirits.length > 0 && (
        <div className="mt-4 text-purple-400">
          Generating: {loadingSpirits.join(', ')}...
        </div>
      )}

      {interpretations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white mb-2">
            Generated Interpretations ({interpretations.length})
          </h3>
          {interpretations.map(interp => (
            <div key={interp.spiritId} className="mb-2 p-3 bg-gray-800 rounded">
              <div className="flex justify-between items-center">
                <span className="text-white font-semibold">{interp.spiritId}</span>
                <button
                  onClick={() => handleGenerateSingle(interp.spiritId)}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Regenerate
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {interp.wordCount} words • {new Date(interp.generatedAt).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Example Component 4: Export
 */
function ExportExample() {
  const { interpretations } = useInterpretations();
  const { exportSingle, exportAll, exportAs } = useExport();

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Export</h2>
      
      <div className="space-y-2">
        <button
          onClick={() => exportAll()}
          disabled={interpretations.length === 0}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Export All as ZIP
        </button>

        {interpretations.map(interp => (
          <div key={interp.spiritId} className="flex gap-2">
            <button
              onClick={() => exportSingle(interp, 'txt')}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {interp.spiritId} (TXT)
            </button>
            <button
              onClick={() => exportAs(interp, 'md')}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              {interp.spiritId} (MD)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Example Component 5: Global State Display
 */
function StateDisplayExample() {
  const state = useAppState();

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-xl font-bold text-purple-400 mb-4">Global State</h2>
      
      <pre className="bg-gray-800 p-4 rounded text-xs text-gray-300 overflow-auto max-h-96">
        {JSON.stringify(
          {
            hasParsedText: !!state.parsedText,
            wordCount: state.parsedText?.metadata?.wordCount || 0,
            selectedSpirits: state.selectedSpirits,
            interpretationCount: state.interpretations.size,
            loadingSpirits: state.loadingSpirits,
            isGenerating: state.isGenerating,
            error: state.error,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}

/**
 * Main Example App
 */
function AppContextExampleApp() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-950 p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <h1 className="text-4xl font-bold text-purple-400 text-center mb-8">
            👻 AppContext Example
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileUploadExample />
            <SpiritSelectionExample />
            <GenerateInterpretationsExample />
            <ExportExample />
          </div>

          <StateDisplayExample />
        </div>
      </div>
    </AppProvider>
  );
}

export default AppContextExampleApp;

/**
 * Usage Notes:
 * 
 * 1. Wrap your app with AppProvider:
 *    <AppProvider>
 *      <App />
 *    </AppProvider>
 * 
 * 2. Use hooks in any component:
 *    const { parsedText } = useParsedText();
 *    const { selectedSpirits, selectSpirit } = useSpirits();
 *    const { interpretations } = useInterpretations();
 * 
 * 3. Use custom hooks for complex operations:
 *    const { uploadFile } = useFileUpload();
 *    const { generateMultiple } = useGenerateInterpretations();
 *    const { exportAll } = useExport();
 * 
 * 4. Access full state if needed:
 *    const state = useAppState();
 * 
 * 5. Error handling:
 *    const { error, clearError } = useError();
 *    if (error) {
 *      // Display error message
 *    }
 */
