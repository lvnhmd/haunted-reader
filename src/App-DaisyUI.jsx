import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useParsedText, useSpirits, useInterpretations, useError } from './context/AppContext';
import useFileUpload from './hooks/useFileUpload';
import useGenerateInterpretations from './hooks/useGenerateInterpretations';
import useExport from './hooks/useExport';
import useToast from './hooks/useToast';

// Components
import TextUploader from './components/TextUploader';
import SpiritGallery from './components/SpiritGallery';
import InterpretationViewer from './components/InterpretationViewer';
import SpectralTimeline from './components/SpectralTimeline';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/Toast';

/**
 * AppContent - Main application content with DaisyUI design
 */
function AppContent() {
  const [activeView, setActiveView] = useState('upload');
  
  // Global state
  const { parsedText, setParsedText, clearParsedText } = useParsedText();
  const { selectedSpirits, setSelectedSpirits } = useSpirits();
  const { interpretations, loadingSpirits } = useInterpretations();
  const { error, clearError } = useError();
  
  // Custom hooks
  const { uploadFile, parseText } = useFileUpload();
  const { generateMultiple, regenerate } = useGenerateInterpretations();
  const { exportSingle, exportAll } = useExport();
  const toast = useToast();

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

  const handleTimelineSectionClick = (sectionIndex) => {
    console.log('Timeline section clicked:', sectionIndex);
  };

  const handleReset = () => {
    clearParsedText(); // This clears everything: text, spirits, interpretations
    setActiveView('upload');
    clearError();
    toast.success('Ready for new text');
  };

  const showSpirits = parsedText && activeView === 'spirits';
  const showInterpretations = interpretations.length > 0 && activeView === 'interpretations';
  const showTimeline = parsedText && activeView === 'timeline';

  return (
    <div className="min-h-screen bg-base-100" data-theme="haunted">
      {/* DaisyUI Navbar */}
      <div className="navbar bg-base-200 shadow-lg sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            {parsedText && (
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setActiveView('upload')}>📄 Upload</a></li>
                <li><a onClick={() => setActiveView('spirits')}>👻 Spirits</a></li>
                {interpretations.length > 0 && (
                  <li><a onClick={() => setActiveView('interpretations')}>📖 Interpretations</a></li>
                )}
                <li><a onClick={() => setActiveView('timeline')}>📊 Timeline</a></li>
              </ul>
            )}
          </div>
          <a className="btn btn-ghost normal-case text-xl font-underdog">
            👻 The Haunted Reader
          </a>
        </div>
        
        {parsedText && (
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">
              <li>
                <a 
                  className={activeView === 'upload' ? 'active' : ''}
                  onClick={() => setActiveView('upload')}
                >
                  📄 Upload
                </a>
              </li>
              <li>
                <a 
                  className={activeView === 'spirits' ? 'active' : ''}
                  onClick={() => setActiveView('spirits')}
                >
                  👻 Spirits
                </a>
              </li>
              {interpretations.length > 0 && (
                <li>
                  <a 
                    className={activeView === 'interpretations' ? 'active' : ''}
                    onClick={() => setActiveView('interpretations')}
                  >
                    📖 Interpretations
                  </a>
                </li>
              )}
              <li>
                <a 
                  className={activeView === 'timeline' ? 'active' : ''}
                  onClick={() => setActiveView('timeline')}
                >
                  📊 Timeline
                </a>
              </li>
            </ul>
          </div>
        )}
        
        <div className="navbar-end gap-2">
          {parsedText && (
            <button 
              className="btn btn-ghost btn-sm gap-2"
              onClick={handleReset}
              title="Start over with new text"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">Home</span>
            </button>
          )}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </label>
            <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
              <div className="card-body">
                <span className="font-bold text-lg">About</span>
                <span className="text-sm">Kiroween Hackathon 2025</span>
                <span className="text-xs">Built with Kiro & AWS Bedrock</span>
              </div>
            </div>
          </div>
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Upload View */}
        {activeView === 'upload' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <TextUploader
              onTextParsed={handleTextParsed}
              onError={(err) => console.error(err)}
            />
            
            {parsedText && (
              <div className="card bg-base-200 shadow-xl">
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
        )}

        {/* Spirits View */}
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

        {/* Timeline View */}
        {showTimeline && (
          <div className="max-w-6xl mx-auto">
            <SpectralTimeline
              text={parsedText.content}
              onSectionClick={handleTimelineSectionClick}
            />
          </div>
        )}

        {/* Empty State - Hero */}
        {!parsedText && activeView === 'upload' && (
          <div className="hero min-h-[60vh]">
            <div className="hero-content text-center">
              <div className="max-w-md">
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <div>
          <p className="font-bold font-underdog">
            👻 The Haunted Reader
          </p>
          <p>Kiroween Hackathon 2025</p>
          <p className="text-sm">Built with React, Vite, Tailwind CSS, DaisyUI, and Amazon Bedrock</p>
        </div>
      </footer>

      <ToastContainer />
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
