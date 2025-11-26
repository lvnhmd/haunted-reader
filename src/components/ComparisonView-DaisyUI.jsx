import { useState } from 'react';
import InterpretationPanel from './InterpretationPanel-DaisyUI';

/**
 * ComparisonView - DaisyUI Version
 * Side-by-side comparison of multiple interpretations
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

  const displayedInterpretations =
    selectedForComparison.length > 0
      ? selectedForComparison
      : displayItems.slice(0, maxComparisons);

  return (
    <div className="space-y-6">
      {/* Selection UI */}
      {hasExtraInterpretations && (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-lg">
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
                    className={`btn ${isSelected ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {interpretation.spiritId}
                  </button>
                );
              })}
            </div>
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
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body items-center text-center py-12">
            <div className="text-6xl mb-4">👻</div>
            <h3 className="card-title">No interpretations to compare</h3>
            <p className="opacity-70">
              Select spirits and generate interpretations to see them here
            </p>
          </div>
        </div>
      )}

      {/* Comparison tips */}
      {displayedInterpretations.length > 1 && (
        <div className="card bg-base-300 shadow-xl">
          <div className="card-body">
            <h4 className="card-title text-sm">💡 Comparison Tips</h4>
            <ul className="text-sm space-y-1 opacity-70">
              <li>• Each panel scrolls independently</li>
              <li>• Compare writing styles and perspectives side-by-side</li>
              <li>• Export individual interpretations or all at once</li>
              <li>• Regenerate any interpretation to get a fresh take</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonView;
