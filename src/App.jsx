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
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-content focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Compact Header */}
      <header className="navbar bg-base-200 shadow-lg z-50 min-h-[4rem]" role="banner">
        <div className="flex-1 flex items-center gap-2">
          <h1 className="btn btn-ghost normal-case text-lg m-0 gap-2">
            <span aria-hidden="true">👻</span> <span>The Haunted Reader</span>
          </h1>
          
          {parsedText && (
            <nav className="tabs tabs-boxed gap-2" role="navigation" aria-label="Main navigation">
              <button 
                className={`tab tab-sm gap-2 ${activeView === 'upload' ? 'tab-active' : ''}`}
                onClick={() => setActiveView('upload')}
                aria-label="Upload text"
                aria-current={activeView === 'upload' ? 'page' : undefined}
              >
                <span aria-hidden="true">📄</span> <span>Upload</span>
              </button>
              <button 
                className={`tab tab-sm gap-2 ${activeView === 'spirits' ? 'tab-active' : ''}`}
                onClick={() => setActiveView('spirits')}
                aria-label="Select spirits"
                aria-current={activeView === 'spirits' ? 'page' : undefined}
              >
                <span aria-hidden="true">👻</span> <span>Spirits</span>
              </button>
              {interpretations.length > 0 && (
                <button 
                  className={`tab tab-sm gap-2 ${activeView === 'interpretations' ? 'tab-active' : ''}`}
                  onClick={() => setActiveView('interpretations')}
                  aria-label="View interpretations"
                  aria-current={activeView === 'interpretations' ? 'page' : undefined}
                >
                  <span aria-hidden="true">📖</span> <span>Interpretations</span>
                </button>
              )}
            </nav>
          )}
        </div>
        
        <div className="flex-none">
          <div className="badge badge-ghost" role="text" aria-label="Kiroween 2025 hackathon entry">Kiroween 2025</div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error shadow-lg mx-4 mt-4" role="alert" aria-live="assertive">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h2 className="font-bold text-base">{error.message}</h2>
              {error.details && <div className="text-xs">{error.details}</div>}
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={clearError} aria-label="Dismiss error">✕</button>
        </div>
      )}

      {/* Main Content - Full Height */}
      <main id="main-content" className="flex-1 overflow-auto" role="main">
        <div className="h-full">
        {/* Upload View */}
        {activeView === 'upload' && !parsedText && (
          <div className="h-full flex items-center p-8 gap-8">
            {/* Left: Welcome Section */}
            <section className="flex-1 flex items-center justify-center" aria-labelledby="welcome-heading">
              <div className="text-center max-w-xl">
                <h2 id="welcome-heading" className="text-5xl font-bold font-underdog mb-4"><span aria-hidden="true">👻</span> Welcome</h2>
                <p className="text-lg mb-8">
                  Upload your text and let the spirits interpret it through their unique perspectives
                </p>
                <div className="grid grid-cols-1 gap-4" role="list" aria-label="How it works">
                  <div className="card bg-base-200 shadow-xl" role="listitem">
                    <div className="card-body items-center text-center py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl" aria-hidden="true">📄</div>
                        <div className="text-left">
                          <h3 className="font-semibold">1. Upload Text</h3>
                          <p className="text-xs opacity-70">TXT, PDF, or EPUB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-200 shadow-xl" role="listitem">
                    <div className="card-body items-center text-center py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl" aria-hidden="true">👻</div>
                        <div className="text-left">
                          <h3 className="font-semibold">2. Select Spirits</h3>
                          <p className="text-xs opacity-70">Up to 5 spirits</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card bg-base-200 shadow-xl" role="listitem">
                    <div className="card-body items-center text-center py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl" aria-hidden="true">📖</div>
                        <div className="text-left">
                          <h3 className="font-semibold">3. View & Export</h3>
                          <p className="text-xs opacity-70">Multiple formats</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Right: Upload Section */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-2xl">
                <TextUploader
                  onTextParsed={handleTextParsed}
                  onError={(err) => console.error(err)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload View - After Text Parsed */}
        {activeView === 'upload' && parsedText && (
          <div className="h-full flex items-center justify-center p-8">
            <div className="w-full max-w-2xl">
              {parsedText && (
                <div className="card bg-base-200 shadow-xl mt-8" role="region" aria-label="Text upload summary">
                  <div className="card-body">
                    <h2 className="card-title text-success">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Text Loaded Successfully
                    </h2>
                    <div className="stats stats-vertical lg:stats-horizontal shadow" role="group" aria-label="Text statistics">
                      <div className="stat">
                        <div className="stat-title">Words</div>
                        <div className="stat-value text-primary" aria-label={`${parsedText.metadata.wordCount.toLocaleString()} words`}>{parsedText.metadata.wordCount.toLocaleString()}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Characters</div>
                        <div className="stat-value text-secondary" aria-label={`${parsedText.metadata.characterCount.toLocaleString()} characters`}>{parsedText.metadata.characterCount.toLocaleString()}</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Read Time</div>
                        <div className="stat-value text-accent" aria-label={`${parsedText.metadata.estimatedReadTime} minutes estimated read time`}>{parsedText.metadata.estimatedReadTime} min</div>
                      </div>
                      <div className="stat">
                        <div className="stat-title">Paragraphs</div>
                        <div className="stat-value" aria-label={`${parsedText.structure?.paragraphs?.length || 0} paragraphs`}>{parsedText.structure?.paragraphs?.length || 0}</div>
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
          <section className="h-full flex flex-col p-8" aria-labelledby="spirits-heading">
            <h2 id="spirits-heading" className="sr-only">Select Spirits for Interpretation</h2>
            <div className="flex-1 overflow-auto">
              <SpiritGallery
                onSpiritSelect={handleSpiritSelect}
                selectedSpirits={selectedSpirits}
                multiSelect={true}
                maxSelections={5}
              />
            </div>
            
            {selectedSpirits.length > 0 && (
              <div className="flex-none pt-4 flex justify-center" role="region" aria-live="polite">
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleGenerateInterpretations}
                  disabled={loadingSpirits.length > 0}
                  aria-label={loadingSpirits.length > 0 
                    ? `Generating interpretations, ${loadingSpirits.length} of ${selectedSpirits.length} in progress` 
                    : `Generate interpretations for ${selectedSpirits.length} selected spirits`}
                >
                  {loadingSpirits.length > 0 ? (
                    <>
                      <span className="loading loading-spinner" aria-hidden="true"></span>
                      Generating... ({loadingSpirits.length}/{selectedSpirits.length})
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">🔮</span> Generate Interpretations ({selectedSpirits.length} spirits)
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Interpretations View */}
        {showInterpretations && (
          <section className="h-full p-8" aria-labelledby="interpretations-heading">
            <h2 id="interpretations-heading" className="sr-only">Spirit Interpretations</h2>
            <InterpretationViewer
              originalText={parsedText?.content || ''}
              interpretations={interpretations}
              loadingSpirits={loadingSpirits}
              onExport={exportSingle}
              onRegenerate={regenerate}
              onExportAll={exportAll}
            />
          </section>
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
