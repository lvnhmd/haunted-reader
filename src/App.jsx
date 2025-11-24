import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useParsedText, useSpirits, useInterpretations, useError } from './context/AppContext';
import useFileUpload from './hooks/useFileUpload';
import useGenerateInterpretations from './hooks/useGenerateInterpretations';
import useExport from './hooks/useExport';

// Components
import TextUploader from './components/TextUploader';
import SpiritGallery from './components/SpiritGallery';
import InterpretationViewer from './components/InterpretationViewer';
import SpectralTimeline from './components/SpectralTimeline';

/**
 * AppContent - Main application content (inside AppProvider)
 */
function AppContent() {
  const [activeView, setActiveView] = useState('upload'); // 'upload' | 'spirits' | 'interpretations' | 'timeline'
  
  // Global state
  const { parsedText, setParsedText } = useParsedText();
  const { selectedSpirits, setSelectedSpirits } = useSpirits();
  const { interpretations, loadingSpirits } = useInterpretations();
  const { error, clearError } = useError();
  
  // Custom hooks
  const { uploadFile, parseText } = useFileUpload();
  const { generateMultiple, regenerate } = useGenerateInterpretations();
  const { exportSingle, exportAll } = useExport();

  /**
   * Handle text upload from TextUploader
   * TextUploader already parses the text, we just need to store it in global state
   */
  const handleTextParsed = async (result) => {
    if (result) {
      // Store in global state
      setParsedText(result);
      // Move to spirit selection view
      setActiveView('spirits');
    }
  };

  /**
   * Handle spirit selection
   */
  const handleSpiritSelect = (spirits) => {
    setSelectedSpirits(spirits);
  };

  /**
   * Generate interpretations for selected spirits
   */
  const handleGenerateInterpretations = async () => {
    if (selectedSpirits.length === 0) {
      return;
    }
    
    await generateMultiple(selectedSpirits);
    setActiveView('interpretations');
  };

  /**
   * Handle section click from timeline
   */
  const handleTimelineSectionClick = (sectionIndex) => {
    // In a full implementation, this would scroll to the section
    console.log('Timeline section clicked:', sectionIndex);
  };

  // Determine which view to show
  const showSpirits = parsedText && activeView === 'spirits';
  const showInterpretations = interpretations.length > 0 && activeView === 'interpretations';
  const showTimeline = parsedText && activeView === 'timeline';

  return (
    <div className="min-h-screen bg-parchment-100">
      {/* Header */}
      <header className="bg-parchment-50 border-b-4 border-ink sticky top-0 z-50 parchment-texture">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-ink text-handwritten mb-1">
                👻 The Haunted Reader
              </h1>
              <p className="text-ink-lighter text-sm font-book">
                Summon the spirits to interpret your text...
              </p>
            </div>
            
            {/* Navigation tabs */}
            {parsedText && (
              <nav className="flex gap-2">
                <button
                  onClick={() => setActiveView('upload')}
                  className={`px-4 py-2 font-handwritten text-lg transition-all ${
                    activeView === 'upload'
                      ? 'bg-spooky-orange text-parchment-50 border-2 border-ink'
                      : 'bg-parchment-50 text-ink border-2 border-ink-lighter hover:bg-spooky-orange-light hover:text-parchment-50'
                  }`}
                >
                  📄 Upload
                </button>
                <button
                  onClick={() => setActiveView('spirits')}
                  className={`px-4 py-2 font-handwritten text-lg transition-all ${
                    activeView === 'spirits'
                      ? 'bg-spooky-orange text-parchment-50 border-2 border-ink'
                      : 'bg-parchment-50 text-ink border-2 border-ink-lighter hover:bg-spooky-orange-light hover:text-parchment-50'
                  }`}
                >
                  👻 Spirits
                </button>
                {interpretations.length > 0 && (
                  <button
                    onClick={() => setActiveView('interpretations')}
                    className={`px-4 py-2 font-handwritten text-lg transition-all ${
                      activeView === 'interpretations'
                        ? 'bg-spooky-orange text-parchment-50 border-2 border-ink'
                        : 'bg-parchment-50 text-ink border-2 border-ink-lighter hover:bg-spooky-orange-light hover:text-parchment-50'
                    }`}
                  >
                    📖 Interpretations
                  </button>
                )}
                <button
                  onClick={() => setActiveView('timeline')}
                  className={`px-4 py-2 font-handwritten text-lg transition-all ${
                    activeView === 'timeline'
                      ? 'bg-spooky-orange text-parchment-50 border-2 border-ink'
                      : 'bg-parchment-50 text-ink border-2 border-ink-lighter hover:bg-spooky-orange-light hover:text-parchment-50'
                  }`}
                >
                  📊 Timeline
                </button>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Error display */}
      {error && (
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto p-4 bg-red-900/20 border-2 border-red-500 rounded-lg flex items-start justify-between">
            <div>
              <p className="text-red-400 font-semibold">{error.message}</p>
              {error.details && (
                <p className="text-red-300 text-sm mt-1">{error.details}</p>
              )}
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-300 ml-4"
              aria-label="Close error"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Upload view */}
        {activeView === 'upload' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <TextUploader
              onTextParsed={handleTextParsed}
              onError={(err) => console.error(err)}
            />
            
            {parsedText && (
              <div className="bg-gray-900 rounded-lg border-2 border-green-600 p-6">
                <h3 className="text-xl font-semibold text-green-400 mb-3">
                  ✓ Text Loaded Successfully
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {parsedText.metadata.wordCount}
                    </p>
                    <p className="text-sm text-gray-400">Words</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {parsedText.metadata.characterCount}
                    </p>
                    <p className="text-sm text-gray-400">Characters</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {parsedText.metadata.estimatedReadTime}
                    </p>
                    <p className="text-sm text-gray-400">Min Read</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {parsedText.structure?.paragraphs?.length || 0}
                    </p>
                    <p className="text-sm text-gray-400">Paragraphs</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveView('spirits')}
                  className="mt-6 w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Select Spirits →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Spirits view */}
        {showSpirits && (
          <div className="max-w-7xl mx-auto space-y-8">
            <SpiritGallery
              onSpiritSelect={handleSpiritSelect}
              selectedSpirits={selectedSpirits}
              multiSelect={true}
              maxSelections={5}
            />
            
            {selectedSpirits.length > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={handleGenerateInterpretations}
                  disabled={loadingSpirits.length > 0}
                  className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingSpirits.length > 0
                    ? `Generating... (${loadingSpirits.length}/${selectedSpirits.length})`
                    : `Generate Interpretations (${selectedSpirits.length} spirits)`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interpretations view */}
        {showInterpretations && (
          <div className="max-w-7xl mx-auto">
            <InterpretationViewer
              originalText={parsedText?.content || ''}
              interpretations={interpretations}
              loadingSpirits={loadingSpirits}
              onExport={exportSingle}
              onRegenerate={regenerate}
              onExportAll={exportAll}
            />
          </div>
        )}

        {/* Timeline view */}
        {showTimeline && (
          <div className="max-w-6xl mx-auto">
            <SpectralTimeline
              text={parsedText.content}
              onSectionClick={handleTimelineSectionClick}
            />
          </div>
        )}

        {/* Empty state */}
        {!parsedText && activeView === 'upload' && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="text-8xl mb-6">👻</div>
            <h2 className="text-3xl font-bold text-purple-400 mb-4">
              Welcome to The Haunted Reader
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Upload your text and let the spirits interpret it through their unique perspectives
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-gray-900 p-6 rounded-lg border-2 border-purple-600">
                <div className="text-4xl mb-3">📄</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  1. Upload Text
                </h3>
                <p className="text-sm text-gray-400">
                  Upload a TXT, PDF, or EPUB file, or paste your text directly
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border-2 border-purple-600">
                <div className="text-4xl mb-3">👻</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  2. Select Spirits
                </h3>
                <p className="text-sm text-gray-400">
                  Choose up to 5 literary spirits to interpret your text
                </p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg border-2 border-purple-600">
                <div className="text-4xl mb-3">📖</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  3. View & Export
                </h3>
                <p className="text-sm text-gray-400">
                  Compare interpretations and export in multiple formats
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t-2 border-purple-600 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>👻 The Haunted Reader • Kiroween Hackathon 2025</p>
          <p className="mt-2">Built with React, Vite, Tailwind CSS, and Amazon Bedrock</p>
        </div>
      </footer>
    </div>
  );
}

/**
 * App - Main application wrapper with AppProvider
 */
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
