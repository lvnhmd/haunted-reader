/**
 * SpiritFilter - DaisyUI redesigned filter spirits by category
 * Provides real-time filtering with visual feedback
 */
const SpiritFilter = ({ selectedCategory, onCategoryChange, categories, disabled = false }) => {
  const categoryIcons = {
    all: '🌟',
    author: '✍️',
    character: '🎭',
    perspective: '👁️',
    abstract: '🔮',
  };

  const categoryLabels = {
    all: 'All Spirits',
    author: 'Authors',
    character: 'Characters',
    perspective: 'Perspectives',
    abstract: 'Abstract',
  };

  const allCategories = ['all', ...categories];

  return (
    <div className="flex justify-center" role="group" aria-label="Filter spirits by category">
      <div className="flex flex-wrap gap-2 justify-center">
        {allCategories.map((category) => {
          const isActive = selectedCategory === category;
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              disabled={disabled}
              className={`btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
              aria-pressed={isActive}
              aria-label={`Filter by ${categoryLabels[category]}${isActive ? ', currently selected' : ''}`}
            >
              <span className="text-lg" aria-hidden="true">{categoryIcons[category]}</span>
              <span className="hidden sm:inline ml-2">{categoryLabels[category]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SpiritFilter;
