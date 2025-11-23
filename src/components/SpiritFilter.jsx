/**
 * SpiritFilter - Filter spirits by category
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

  // Add 'all' to the beginning of categories
  const allCategories = ['all', ...categories];

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {allCategories.map((category) => {
        const isActive = selectedCategory === category;
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            disabled={disabled}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-all duration-300
              flex items-center gap-2
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }
            `}
            aria-pressed={isActive}
            aria-label={`Filter by ${categoryLabels[category]}`}
          >
            <span className="text-lg">{categoryIcons[category]}</span>
            <span>{categoryLabels[category]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SpiritFilter;
