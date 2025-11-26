import { useState, useMemo, useEffect } from 'react';
import SpiritCard from './SpiritCard-DaisyUI';
import SpiritFilter from './SpiritFilter-DaisyUI';
import { spirits, getCategories } from '../spirits/spiritDefinitions';
import { announceToScreenReader } from '../utils/accessibility';

/**
 * SpiritGallery - DaisyUI redesigned gallery for displaying and selecting spirits
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

  const filteredSpirits = useMemo(() => {
    if (selectedCategory === 'all') {
      return spirits;
    }
    return spirits.filter((spirit) => spirit.category === selectedCategory);
  }, [selectedCategory]);

  const handleSpiritClick = (spiritId) => {
    if (disabled) return;

    const isCurrentlySelected = selectedSpirits.includes(spiritId);
    const spirit = spirits.find((s) => s.id === spiritId);

    if (isCurrentlySelected) {
      onSpiritSelect(selectedSpirits.filter((id) => id !== spiritId));
      announceToScreenReader(`${spirit?.name || spiritId} deselected. ${selectedSpirits.length - 1} spirits selected.`);
    } else {
      if (multiSelect) {
        if (selectedSpirits.length >= maxSelections) {
          console.warn(`Maximum ${maxSelections} spirits can be selected`);
          announceToScreenReader(`Maximum ${maxSelections} spirits already selected. Please deselect a spirit first.`, 'assertive');
          return;
        }
        onSpiritSelect([...selectedSpirits, spiritId]);
        announceToScreenReader(`${spirit?.name || spiritId} selected. ${selectedSpirits.length + 1} of ${maxSelections} spirits selected.`);
      } else {
        onSpiritSelect([spiritId]);
        announceToScreenReader(`${spirit?.name || spiritId} selected.`);
      }
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const count = category === 'all' ? spirits.length : spirits.filter(s => s.category === category).length;
    announceToScreenReader(`Showing ${count} ${category === 'all' ? '' : category} spirits.`);
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title text-3xl font-underdog justify-center">
            👻 Choose Your Spirits
          </h2>
          <p className="text-base-content/70">
            {multiSelect
              ? `Select up to ${maxSelections} spirits to interpret your text`
              : 'Select a spirit to interpret your text'}
          </p>
          
          {/* Selection Progress */}
          {multiSelect && selectedSpirits.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-center gap-4">
                <progress 
                  className="progress progress-primary w-64" 
                  value={selectedSpirits.length} 
                  max={maxSelections}
                ></progress>
                <div className="badge badge-primary badge-lg">
                  {selectedSpirits.length} / {maxSelections}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <SpiritFilter
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        disabled={disabled}
      />

      {/* Spirit Grid */}
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

      {/* No Results */}
      {filteredSpirits.length === 0 && (
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>👻 No spirits found in this category</span>
        </div>
      )}

      {/* Selected Spirits Summary */}
      {selectedSpirits.length > 0 && (
        <div className="card bg-primary text-primary-content shadow-xl">
          <div className="card-body">
            <h3 className="card-title">
              ✨ Selected Spirits ({selectedSpirits.length})
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedSpirits.map((spiritId) => {
                const spirit = spirits.find((s) => s.id === spiritId);
                if (!spirit) return null;

                return (
                  <div
                    key={spiritId}
                    className="badge badge-lg gap-2 bg-primary-content text-primary"
                  >
                    <span className="text-xl">{spirit.icon}</span>
                    <span className="font-semibold">{spirit.name}</span>
                    <button
                      onClick={() => handleSpiritClick(spiritId)}
                      disabled={disabled}
                      className="btn btn-xs btn-circle btn-ghost"
                      aria-label={`Remove ${spirit.name} from selection`}
                    >
                      <span aria-hidden="true">✕</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritGallery;
