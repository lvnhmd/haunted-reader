import { useState, useMemo } from 'react';
import SpiritCard from './SpiritCard';
import SpiritFilter from './SpiritFilter';
import { spirits, getCategories } from '../spirits/spiritDefinitions';

/**
 * SpiritGallery - Main gallery component for displaying and selecting spirits
 * Supports multi-select (up to 5 spirits) with category filtering
 */
const SpiritGallery = ({
  onSpiritSelect,
  selectedSpirits = [],
  multiSelect = true,
  maxSelections = 5,
  disabled = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = getCategories();

  // Filter spirits by selected category
  const filteredSpirits = useMemo(() => {
    if (selectedCategory === 'all') {
      return spirits;
    }
    return spirits.filter((spirit) => spirit.category === selectedCategory);
  }, [selectedCategory]);

  /**
   * Handle spirit selection/deselection
   */
  const handleSpiritClick = (spiritId) => {
    if (disabled) return;

    const isCurrentlySelected = selectedSpirits.includes(spiritId);

    if (isCurrentlySelected) {
      // Deselect spirit
      onSpiritSelect(selectedSpirits.filter((id) => id !== spiritId));
    } else {
      // Select spirit
      if (multiSelect) {
        // Check if we've reached max selections
        if (selectedSpirits.length >= maxSelections) {
          // Show warning (could be replaced with toast notification)
          console.warn(`Maximum ${maxSelections} spirits can be selected`);
          return;
        }
        onSpiritSelect([...selectedSpirits, spiritId]);
      } else {
        // Single select mode
        onSpiritSelect([spiritId]);
      }
    }
  };

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-400 mb-2">
          👻 Choose Your Spirits
        </h2>
        <p className="text-gray-400">
          {multiSelect
            ? `Select up to ${maxSelections} spirits to interpret your text`
            : 'Select a spirit to interpret your text'}
        </p>
        
        {/* Selection counter */}
        {multiSelect && selectedSpirits.length > 0 && (
          <div className="mt-3">
            <span
              className={`
                inline-block px-4 py-2 rounded-full font-semibold
                ${
                  selectedSpirits.length >= maxSelections
                    ? 'bg-orange-600 text-white'
                    : 'bg-purple-600 text-white'
                }
              `}
            >
              {selectedSpirits.length} / {maxSelections} spirits selected
            </span>
          </div>
        )}
      </div>

      {/* Category filter */}
      <SpiritFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        disabled={disabled}
      />

      {/* Spirit grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSpirits.map((spirit) => (
          <SpiritCard
            key={spirit.id}
            spirit={spirit}
            isSelected={selectedSpirits.includes(spirit.id)}
            onClick={() => handleSpiritClick(spirit.id)}
            disabled={disabled}
          />
        ))}
      </div>

      {/* No results message */}
      {filteredSpirits.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            👻 No spirits found in this category
          </p>
        </div>
      )}

      {/* Selected spirits summary */}
      {selectedSpirits.length > 0 && (
        <div className="mt-8 p-6 bg-gray-900 rounded-lg border-2 border-purple-600">
          <h3 className="text-xl font-semibold text-purple-400 mb-4">
            ✨ Selected Spirits
          </h3>
          <div className="flex flex-wrap gap-3">
            {selectedSpirits.map((spiritId) => {
              const spirit = spirits.find((s) => s.id === spiritId);
              if (!spirit) return null;

              return (
                <div
                  key={spiritId}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-800 rounded-full"
                >
                  <span className="text-2xl">{spirit.icon}</span>
                  <span className="text-white font-semibold">{spirit.name}</span>
                  <button
                    onClick={() => handleSpiritClick(spiritId)}
                    disabled={disabled}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                    aria-label={`Remove ${spirit.name}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritGallery;
