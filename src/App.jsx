import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useParsedText, useSpirits, useInterpretations, useError } from './context/AppContext';
import useFileUpload from './hooks/useFileUpload';
import useGenerateInterpretations from './hooks/useGenerateInterpretations';
import useExport from './hooks/useExport';
import useToast from './hooks/useToast';

// Components
import TextUploader from './components/TextUploader-DaisyUI';
import SpiritGallery from './components/SpiritGallery-DaisyUI';
import InterpretationViewer from './components/InterpretationViewer-DaisyUI';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';

/**
 * AppContent - Main application content with DaisyUI design
 */
function AppContent() {
  const [activeView, setActiveView] = useState('upload');
  
  // Global state
  const { parsedText, setParsedText } = useParsedText();
  const { selectedSpirits, setSelectedSpirits } = useSpirits();
  const { interpretations, loadingSpirits } = useInterpretations();
  const { error, clearError } = useError();
  
  // Custom hooks
  const { uploadFile, parseText } = useFileUpload();
  const { generateMultiple, regenerate } = useGenerateInterpretations();
  const { exportSingle, exportAll } = useExport();
  const { toasts, removeToast } = useToast();

  const handleTextParsed = async (result) => {
    if (result) {
      setParsedText(result);
      setActiveView('spirits');
    }
  };

  const handleSpiritSelect = (spirits) => {
    setSelectedSpirits(spirits);
  };

  const handleGenerateInterpretations = async () => {
    if (selectedSpirits.length === 0) return;
    await generateMultiple(selectedSpirits);
    setActiveView('interpretations');
  };

  const showSpirits = parsedText && activeView === 'spirits';
  const showInterpretations = interpretations.length > 0 && activeView === 'interpretations';

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-base-100" data-theme="dracula">
      {/* Compact Header */}
      <div className="navbar bg-base-200 shadow-lg z-50 min-h-[4rem]">
        <div className="flex-1 flex items-center gap-2">
          <a className="btn btn-ghost normal-case text-lg">
            👻 The Haunted Reader
          </a>
          
          {parsedText && (
            <div className="tabs tabs-boxed">
              <a 
                className={`tab tab-sm ${activeView === 'upload' ? 'tab-active' : ''}`}
                onClick={() => setActiveView('upload')}
              >
                📄 Upload
              </a>
              <a 
                className={`tab tab-sm ${activeView === 'spirits' ? 'tab-active' : ''}`}
                onClick={() => setActiveView('spirits')}
              >
                👻 Spirits
              </a>
              {interpretations.length > 0 && (
                <a 
                  className={`tab tab-sm ${activeView === 'interpretations' ? 'tab-active' : ''}`}
                  onClick={() => setActiveView('interpretations')}
                >
                  📖 Interpretations
                </a>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-none">
          <div className="badge badge-ghost">Kiroween 2025</div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error shadow-lg mx-4 mt-4">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">{error.message}</h3>
              {error.details && <div className="text-xs">{error.details}</div>}
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={clearError}>✕</button>
        </div>
      )}

      {/* Main Content - Full Height */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
        {/* Upload View */}
        {activeView === 'upload' && (
          <div className="h-full flex items-center justify-center p-8">
            <div className="w-full max-w-2xl">
              <TextUploader
                onTextParsed={handleTextParsed}
                onError={(err) => console.error(err)}
              />
              
              {parsedText && (
                <div className="card bg-base-200 shadow-xl mt-8">
                  <div className="card-body">
                    <h2 className="card-title text-success">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Text Loaded Successfully
                    </h2>
                    <div className="stats stats-vertical lg:stats-horizontal shadow">
                      <div className="stat">
                        <div className="stat-title">Words</div>
                        <div className="stat-value text-primary">{parsedText.metadata.wordCount.toLocaleString()}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Characters</div>
                        <div className="stat-value text-secondary">{parsedText.metadata.characterCount.toLocaleString()}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Read Time</div>
                        <div className="stat-value text-accent">{parsedText.metadata.estimatedReadTime} min</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Paragraphs</div>
                        <div className="stat-value">{parsedText.structure?.paragraphs?.length || 0}</div>
                      </div>
                    </div>
                    <div className="card-actions justify-end">
                      <button 
                        className="btn btn-primary"
                        onClick={() => setActiveView('spirits')}
                      >
                        Select Spirits →
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Spirits View */}
        {showSpirits && (
          <div className="h-full flex flex-col p-8">
            <div className="flex-1 overflow-auto">
              <SpiritGallery
                onSpiritSelect={handleSpiritSelect}
                selectedSpirits={selectedSpirits}
                multiSelect={true}
                maxSelections={5}
              />
            </div>
            
            {selectedSpirits.length > 0 && (
              <div className="flex-none pt-4 flex justify-center">
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleGenerateInterpretations}
                  disabled={loadingSpirits.length > 0}
                >
                  {loadingSpirits.length > 0 ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Generating... ({loadingSpirits.length}/{selectedSpirits.length})
                    </>
                  ) : (
                    `Generate Interpretations (${selectedSpirits.length} spirits)`
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Interpretations View */}
        {showInterpretations && (
          <div className="h-full p-8">
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

        {/* Empty State - Hero */}
        {!parsedText && activeView === 'upload' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-4xl px-8">
                <h1 className="text-5xl font-bold font-underdog">👻 Welcome</h1>
                <p className="py-6 text-lg">
                  Upload your text and let the spirits interpret it through their unique perspectives
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="card bg-base-200 shadow-xl">
                    <div className="card-body items-center text-center">
                      <div className="text-4xl mb-2">📄</div>
                      <h3 className="card-title text-sm">1. Upload Text</h3>
                      <p className="text-xs">TXT, PDF, or EPUB</p>
                    </div>
                  </div>
                  <div className="card bg-base-200 shadow-xl">
                    <div className="card-body items-center text-center">
                      <div className="text-4xl mb-2">👻</div>
                      <h3 className="card-title text-sm">2. Select Spirits</h3>
                      <p className="text-xs">Up to 5 spirits</p>
                    </div>
                  </div>
                  <div className="card bg-base-200 shadow-xl">
                    <div className="card-body items-center text-center">
                      <div className="text-4xl mb-2">📖</div>
                      <h3 className="card-title text-sm">3. View & Export</h3>
                      <p className="text-xs">Multiple formats</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
        </div>
      </main>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

/**
 * App - Main application wrapper
 */
function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
