import { useState } from 'react';
import InterpretationPanel from './InterpretationPanel';

/**
 * ComparisonView - Side-by-side comparison of multiple interpretations
 * Supports up to 3 interpretations with independent scrolling
 */
const ComparisonView = ({
  interpretations = [],
  onExport,
  onRegenerate,
  loadingSpirits = [],
  maxComparisons = 3,
}) => {
  const [selectedForComparison, setSelectedForComparison] = useState([]);

  // Combine actual interpretations with loading states
  const displayItems = [
    ...interpretations.slice(0, maxComparisons),
    ...loadingSpirits.slice(0, maxComparisons - interpretations.length).map((spiritId) => ({
      spiritId,
      isLoading: true,
    })),
  ];

  // If we have more interpretations than max, allow selection
  const hasExtraInterpretations = interpretations.length > maxComparisons;

  const handleSelectForComparison = (interpretation) => {
    const isSelected = selectedForComparison.some(
      (i) => i.spiritId === interpretation.spiritId
    );

    if (isSelected) {
      setSelectedForComparison(
        selectedForComparison.filter((i) => i.spiritId !== interpretation.spiritId)
      );
    } else {
      if (selectedForComparison.length < maxComparisons) {
        setSelectedForComparison([...selectedForComparison, interpretation]);
      }
    }
  };

  // Use selected interpretations if any, otherwise use first N
  const displayedInterpretations =
    selectedForComparison.length > 0
      ? selectedForComparison
      : displayItems.slice(0, maxComparisons);

  return (
    <div className="space-y-6">
      {/* Selection UI if there are extra interpretations */}
      {hasExtraInterpretations && (
        <div className="bg-gray-900 rounded-lg border-2 border-purple-600 p-4">
          <h3 className="text-lg font-semibold text-purple-400 mb-3">
            📊 Select up to {maxComparisons} interpretations to compare
          </h3>
          <div className="flex flex-wrap gap-2">
            {interpretations.map((interpretation) => {
              const isSelected = selectedForComparison.some(
                (i) => i.spiritId === interpretation.spiritId
              );
              return (
                <button
                  key={interpretation.spiritId}
                  onClick={() => handleSelectForComparison(interpretation)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {interpretation.spiritId}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Comparison grid */}
      <div
        className={`grid gap-6 ${
          displayedInterpretations.length === 1
            ? 'grid-cols-1'
            : displayedInterpretations.length === 2
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'
        }`}
      >
        {displayedInterpretations.map((item, index) => (
          <div key={item.spiritId || index} className="h-[600px]">
            <InterpretationPanel
              interpretation={item.isLoading ? null : item}
              isLoading={item.isLoading}
              onExport={onExport}
              onRegenerate={onRegenerate}
              className="h-full"
            />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {displayedInterpretations.length === 0 && (
        <div className="bg-gray-900 rounded-lg border-2 border-gray-700 p-12 text-center">
          <div className="text-6xl mb-4">👻</div>
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No interpretations to compare
          </h3>
          <p className="text-gray-500">
            Select spirits and generate interpretations to see them here
          </p>
        </div>
      )}

      {/* Comparison tips */}
      {displayedInterpretations.length > 1 && (
        <div className="bg-parchment-100 border-2 border-ink-lighter p-4 parchment-texture">
          <h4 className="text-sm font-semibold text-ink font-handwritten mb-2">
            💡 Comparison Tips
          </h4>
          <ul className="text-sm text-ink-lighter space-y-1 font-book">
            <li>• Each panel scrolls independently</li>
            <li>• Compare writing styles and perspectives side-by-side</li>
            <li>• Export individual interpretations or all at once</li>
            <li>• Regenerate any interpretation to get a fresh take</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
