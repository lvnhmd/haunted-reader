import { useState } from 'react';
import InterpretationPanel from './InterpretationPanel';
import ComparisonView from './ComparisonView';

/**
 * InterpretationViewer - Main viewer component for displaying interpretations
 * Supports single view, comparison view, and original text access
 * Implements CP-7.1, CP-7.2, CP-7.3, CP-7.4, CP-7.5
 */
const InterpretationViewer = ({
  originalText,
  interpretations = [],
  onExport,
  onRegenerate,
  onExportAll,
  loadingSpirits = [],
}) => {
  const [viewMode, setViewMode] = useState('comparison'); // 'single' | 'comparison' | 'original'
  const [selectedInterpretationIndex, setSelectedInterpretationIndex] = useState(0);

  // View mode buttons configuration
  const viewModes = [
    { id: 'original', label: '📄 Original Text', icon: '📄' },
    { id: 'single', label: '👁️ Single View', icon: '👁️' },
    { id: 'comparison', label: '📊 Compare', icon: '📊' },
  ];

  const hasInterpretations = interpretations.length > 0 || loadingSpirits.length > 0;

  return (
    <div className="space-y-6">
      {/* Header with view mode toggle */}
      <div className="bg-parchment-50 border-2 border-ink p-4 parchment-texture">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-ink font-underdog mb-1">
              👻 Spirit Interpretations
            </h2>
            <p className="text-gray-400 text-sm">
              {interpretations.length > 0
                ? `${interpretations.length} interpretation${
                    interpretations.length !== 1 ? 's' : ''
                  } generated`
                : 'No interpretations yet'}
              {loadingSpirits.length > 0 &&
                ` • ${loadingSpirits.length} generating...`}
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex gap-2">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                disabled={
                  mode.id !== 'original' && !hasInterpretations
                }
                className={`px-4 py-2 font-handwritten text-lg transition-all ${
                  viewMode === mode.id
                    ? 'bg-spooky-orange text-parchment-50 border-2 border-ink'
                    : 'bg-parchment-50 text-ink border-2 border-ink-lighter hover:bg-parchment-200'
                } ${
                  mode.id !== 'original' && !hasInterpretations
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                aria-label={mode.label}
              >
                <span className="hidden sm:inline">{mode.label}</span>
                <span className="sm:hidden">{mode.icon}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Export all button */}
        {interpretations.length > 1 && onExportAll && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={onExportAll}
              className="w-full md:w-auto px-6 py-2 bg-green-600 hover:bg-green-700 text-parchment-50 border-2 border-ink transition-colors font-handwritten text-lg"
            >
              💾 Export All Interpretations
            </button>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="min-h-[400px]">
        {/* Original text view */}
        {viewMode === 'original' && (
          <div className="bg-parchment-50 border-2 border-ink p-6 parchment-texture">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-ink font-handwritten">📄 Original Text</h3>
              {originalText && (
                <span className="text-sm text-gray-400">
                  {originalText.split(/\s+/).length} words
                </span>
              )}
            </div>
            <div className="prose prose-invert max-w-none">
              {originalText ? (
                <div className="text-gray-200 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto">
                  {originalText}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📄</div>
                  <p className="text-gray-500">No text uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Single interpretation view */}
        {viewMode === 'single' && (
          <div className="space-y-4">
            {/* Interpretation selector */}
            {interpretations.length > 1 && (
              <div className="bg-parchment-50 border-2 border-ink p-4 parchment-texture">
                <label className="block text-sm font-semibold text-ink font-handwritten mb-2">
                  Select interpretation to view:
                </label>
                <div className="flex flex-wrap gap-2">
                  {interpretations.map((interpretation, index) => (
                    <button
                      key={interpretation.spiritId}
                      onClick={() => setSelectedInterpretationIndex(index)}
                      className={`px-4 py-2 font-handwritten text-lg transition-all ${
                        selectedInterpretationIndex === index
                          ? 'bg-spooky-orange text-parchment-50 border-2 border-ink'
                          : 'bg-parchment-50 text-ink border-2 border-ink-lighter hover:bg-parchment-200'
                      }`}
                    >
                      {interpretation.spiritId}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Single interpretation panel */}
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
              <div className="bg-parchment-50 border-2 border-ink p-12 text-center parchment-texture">
                <div className="text-6xl mb-4">👻</div>
                <h3 className="text-xl font-semibold text-ink font-handwritten mb-2">
                  No interpretations yet
                </h3>
                <p className="text-gray-500">
                  Select spirits and generate interpretations to see them here
                </p>
              </div>
            )}
          </div>
        )}

        {/* Comparison view */}
        {viewMode === 'comparison' && (
          <ComparisonView
            interpretations={interpretations}
            loadingSpirits={loadingSpirits}
            onExport={onExport}
            onRegenerate={onRegenerate}
            maxComparisons={3}
          />
        )}
      </div>

      {/* Help text */}
      {hasInterpretations && (
        <div className="bg-parchment-100 border-2 border-ink-lighter p-4 parchment-texture">
          <h4 className="text-sm font-semibold text-ink font-handwritten mb-2">
            💡 Viewing Tips
          </h4>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>
              • <strong>Original Text:</strong> Always accessible - view your
              uploaded text anytime
            </li>
            <li>
              • <strong>Single View:</strong> Focus on one interpretation at a time
            </li>
            <li>
              • <strong>Compare:</strong> View up to 3 interpretations side-by-side
            </li>
            <li>
              • <strong>Export:</strong> Save individual interpretations or export
              all at once
            </li>
            <li>
              • <strong>Regenerate:</strong> Get a fresh interpretation from any
              spirit
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default InterpretationViewer;
