import { useState } from 'react';
import InterpretationPanel from './InterpretationPanel-DaisyUI';
import ComparisonView from './ComparisonView-DaisyUI';
import SpectralTimeline from './SpectralTimeline-DaisyUI';

/**
 * InterpretationViewer - DaisyUI redesigned viewer for displaying interpretations
 * Supports single view, comparison view, and original text access
 */
const InterpretationViewer = ({
  originalText,
  interpretations = [],
  onExport,
  onRegenerate,
  onExportAll,
  loadingSpirits = [],
}) => {
  const [viewMode, setViewMode] = useState('comparison');
  const [selectedInterpretationIndex, setSelectedInterpretationIndex] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);

  const hasInterpretations = interpretations.length > 0 || loadingSpirits.length > 0;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="card-title text-3xl font-display">
                <span aria-hidden="true">👻</span> Spirit Interpretations
              </h3>
              <p className="text-base-content/70" role="status" aria-live="polite">
                {interpretations.length > 0
                  ? `${interpretations.length} interpretation${
                      interpretations.length !== 1 ? 's' : ''
                    } generated`
                  : 'No interpretations yet'}
                {loadingSpirits.length > 0 &&
                  ` • ${loadingSpirits.length} generating...`}
              </p>
            </div>

            {/* View Mode Tabs */}
            <div className="flex gap-2 items-center">
              <div className="tabs tabs-boxed gap-2" role="tablist" aria-label="Interpretation view modes">
                <button 
                  role="tab"
                  aria-selected={viewMode === 'original'}
                  aria-controls="interpretation-content"
                  className={`tab gap-2 ${viewMode === 'original' ? 'tab-active' : ''}`}
                  onClick={() => setViewMode('original')}
                >
                  <span aria-hidden="true">📄</span> <span>Original</span>
                </button>
                <button 
                  role="tab"
                  aria-selected={viewMode === 'single'}
                  aria-controls="interpretation-content"
                  aria-disabled={!hasInterpretations}
                  className={`tab gap-2 ${viewMode === 'single' ? 'tab-active' : ''} ${!hasInterpretations ? 'tab-disabled' : ''}`}
                  onClick={() => hasInterpretations && setViewMode('single')}
                  disabled={!hasInterpretations}
                >
                  <span aria-hidden="true">👁️</span> <span>Single</span>
                </button>
                <button 
                  role="tab"
                  aria-selected={viewMode === 'comparison'}
                  aria-controls="interpretation-content"
                  aria-disabled={!hasInterpretations}
                  className={`tab gap-2 ${viewMode === 'comparison' ? 'tab-active' : ''} ${!hasInterpretations ? 'tab-disabled' : ''}`}
                  onClick={() => hasInterpretations && setViewMode('comparison')}
                  disabled={!hasInterpretations}
                >
                  <span aria-hidden="true">🔀</span> <span>Compare</span>
                </button>
                
                {/* Timeline Toggle - inside tabs-boxed for consistent styling */}
                {originalText && (
                  <button
                    onClick={() => setShowTimeline(!showTimeline)}
                    className={`tab gap-2 ${showTimeline ? 'tab-active' : ''}`}
                    aria-label={showTimeline ? 'Hide emotional timeline' : 'Show emotional timeline'}
                    aria-pressed={showTimeline}
                  >
                    <span aria-hidden="true">📈</span> <span>Timeline</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Export All Button */}
          {interpretations.length > 1 && onExportAll && (
            <div className="card-actions justify-end mt-4">
              <button
                onClick={onExportAll}
                className="btn btn-success gap-2"
                aria-label={`Export all ${interpretations.length} interpretations`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export All Interpretations
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area with Timeline Sidebar */}
      <div className="flex gap-4 min-h-[400px]" id="interpretation-content">
        {/* Main Content */}
        <div className="flex-1 min-w-0" role="tabpanel" aria-label={`${viewMode} view`}>
        {/* Original Text View */}
        {viewMode === 'original' && (
          <article className="card bg-base-200 shadow-xl flex flex-col h-full">
            {/* Header */}
            <div className="px-4 py-3 border-b border-base-300">
              <div className="flex items-center gap-3">
                <span className="text-3xl" aria-hidden="true">📄</span>
                <div className="flex-1 min-w-0">
                  <h4 className="card-title text-lg mb-0">Original Text</h4>
                  <p className="text-xs opacity-70">Unmodified source text</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            {originalText && (
              <div className="px-4 py-2 border-b border-base-300 flex flex-wrap gap-2 text-xs">
                <div className="badge badge-ghost badge-xs gap-1">
                  <span>📅</span>
                  {new Date().toLocaleString()}
                </div>
                <div className="badge badge-ghost badge-xs gap-1">
                  <span>📝</span>
                  {originalText.split(/\s+/).length} words
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {originalText ? (
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap leading-relaxed font-book">
                    {originalText}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12" role="status">
                  <div className="text-6xl mb-4" aria-hidden="true">📄</div>
                  <p className="text-base-content/70">No text uploaded yet</p>
                </div>
              )}
            </div>
          </article>
        )}

        {/* Single Interpretation View */}
        {viewMode === 'single' && (
          <div className="space-y-4">
            {/* Interpretation Selector */}
            {interpretations.length > 1 && (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <label className="label">
                    <span className="label-text font-semibold">Select interpretation to view:</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interpretations.map((interpretation, index) => (
                      <button
                        key={interpretation.spiritId}
                        onClick={() => setSelectedInterpretationIndex(index)}
                        className={`btn ${
                          selectedInterpretationIndex === index ? 'btn-primary' : 'btn-outline'
                        }`}
                      >
                        {interpretation.spiritId}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Single Interpretation Panel */}
            {interpretations.length > 0 ? (
              <div className="h-[600px]">
                <InterpretationPanel
                  interpretation={interpretations[selectedInterpretationIndex]}
                  onExport={onExport}
                  onRegenerate={onRegenerate}
                  className="h-full"
                />
              </div>
            ) : loadingSpirits.length > 0 ? (
              <div className="h-[600px]">
                <InterpretationPanel
                  interpretation={{ spiritId: loadingSpirits[0] }}
                  isLoading={true}
                  onExport={onExport}
                  onRegenerate={onRegenerate}
                  className="h-full"
                />
              </div>
            ) : (
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body items-center text-center py-12">
                  <div className="text-6xl mb-4">👻</div>
                  <h3 className="card-title">No interpretations yet</h3>
                  <p className="text-base-content/70">
                    Select spirits and generate interpretations to see them here
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comparison View */}
        {viewMode === 'comparison' && (
          <ComparisonView
            interpretations={interpretations}
            loadingSpirits={loadingSpirits}
            onExport={onExport}
            onRegenerate={onRegenerate}
            maxComparisons={3}
          />
        )}

        {/* Help Alert */}
        {hasInterpretations && (
          <div className="alert mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div className="text-sm">
              <p><strong>💡 Viewing Tips:</strong> Switch between Original, Single, and Compare views • Export individual or all interpretations • Regenerate any interpretation for a fresh take</p>
            </div>
          </div>
        )}
        </div>

        {/* Timeline Sidebar - Right Side */}
        {showTimeline && originalText && (
          <div className="w-80 flex-shrink-0">
            <div className="card bg-base-200 shadow-xl sticky top-4 h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
              <div className="card-body p-4 flex-1 overflow-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title text-lg">📊 Timeline</h3>
                  <button
                    onClick={() => setShowTimeline(false)}
                    className="btn btn-ghost btn-sm btn-circle"
                  >
                    ✕
                  </button>
                </div>
                <SpectralTimeline text={originalText} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterpretationViewer;
