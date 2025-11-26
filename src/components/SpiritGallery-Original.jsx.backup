import { useState, useMemo, useEffect } from 'react';
import SpiritCard from './SpiritCard';
import SpiritFilter from './SpiritFilter';
import { spirits, getCategories } from '../spirits/spiritDefinitions';
import { announceToScreenReader } from '../utils/accessibility';

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
    const spirit = spirits.find((s) => s.id === spiritId);

    if (isCurrentlySelected) {
      // Deselect spirit
      onSpiritSelect(selectedSpirits.filter((id) => id !== spiritId));
      announceToScreenReader(`${spirit?.name || spiritId} deselected. ${selectedSpirits.length - 1} spirits selected.`);
    } else {
      // Select spirit
      if (multiSelect) {
        // Check if we've reached max selections
        if (selectedSpirits.length >= maxSelections) {
          // Show warning (could be replaced with toast notification)
          console.warn(`Maximum ${maxSelections} spirits can be selected`);
          announceToScreenReader(`Maximum ${maxSelections} spirits already selected. Please deselect a spirit first.`, 'assertive');
          return;
        }
        onSpiritSelect([...selectedSpirits, spiritId]);
        announceToScreenReader(`${spirit?.name || spiritId} selected. ${selectedSpirits.length + 1} of ${maxSelections} spirits selected.`);
      } else {
        // Single select mode
        onSpiritSelect([spiritId]);
        announceToScreenReader(`${spirit?.name || spiritId} selected.`);
      }
    }
  };

  /**
   * Handle category filter change
   */
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const count = category === 'all' ? spirits.length : spirits.filter(s => s.category === category).length;
    announceToScreenReader(`Showing ${count} ${category === 'all' ? '' : category} spirits.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-ink font-underdog mb-2">
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
                    ? 'bg-spooky-orange text-parchment-50'
                    : 'bg-spooky-orange text-parchment-50'
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
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="group"
        aria-label="Available spirits"
      >
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
        <div className="text-center py-12" role="status" aria-live="polite">
          <p className="text-gray-500 text-lg">
            <span aria-hidden="true">👻</span> No spirits found in this category
          </p>
        </div>
      )}

      {/* Selected spirits summary */}
      {selectedSpirits.length > 0 && (
        <div className="mt-8 p-6 bg-parchment-50 border-2 border-ink parchment-texture">
          <h3 className="text-xl font-semibold text-ink font-handwritten mb-4">
            ✨ Selected Spirits
          </h3>
          <div className="flex flex-wrap gap-3">
            {selectedSpirits.map((spiritId) => {
              const spirit = spirits.find((s) => s.id === spiritId);
              if (!spirit) return null;

              return (
                <div
                  key={spiritId}
                  className="flex items-center gap-2 px-4 py-2 bg-spooky-orange border-2 border-ink"
                >
                  <span className="text-2xl">{spirit.icon}</span>
                  <span className="text-white font-semibold">{spirit.name}</span>
                  <button
                    onClick={() => handleSpiritClick(spiritId)}
                    disabled={disabled}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                    aria-label={`Remove ${spirit.name} from selection`}
                  >
                    <span aria-hidden="true">✕</span>
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
