import { useState } from 'react';

/**
 * SpiritCard - Individual spirit display card
 * Shows spirit info with hover effects and voice preview
 */
const SpiritCard = ({ spirit, isSelected, onClick, disabled = false }) => {
  const [isHovering, setIsHovering] = useState(false);

  // Category colors for visual distinction
  const categoryColors = {
    author: 'border-spooky-orange hover:border-spooky-orange-dark',
    character: 'border-red-600 hover:border-red-700',
    perspective: 'border-blue-600 hover:border-blue-700',
    abstract: 'border-ink hover:border-ink-light',
  };

  const selectedColors = {
    author: 'bg-spooky-orange border-ink shadow-spooky-orange/50',
    character: 'bg-red-600 border-ink shadow-red-600/50',
    perspective: 'bg-blue-600 border-ink shadow-blue-600/50',
    abstract: 'bg-ink-light border-ink shadow-ink/50',
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
      className={`
        relative p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${
          isSelected
            ? `${selectedColors[spirit.category]} shadow-lg scale-105`
            : `bg-parchment-50 ${categoryColors[spirit.category]}`
        }
        ${!disabled && !isSelected ? 'hover:scale-105 hover:shadow-lg' : ''}
      `}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={`${spirit.name}, ${spirit.category} spirit. ${spirit.description}. ${isSelected ? 'Selected' : 'Not selected'}. Press Enter or Space to ${isSelected ? 'deselect' : 'select'}.`}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div 
          className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-lg animate-pulse"
          aria-hidden="true"
        >
          ✓
        </div>
      )}

      {/* Spirit icon */}
      <div className="text-6xl mb-3 text-center" aria-hidden="true">{spirit.icon}</div>

      {/* Spirit name */}
      <h3 className="text-xl font-bold text-center mb-2 text-white">
        {spirit.name}
      </h3>

      {/* Category badge */}
      <div className="text-center mb-3">
        <span
          className={`
          inline-block px-3 py-1 text-xs font-semibold uppercase border-2
          ${spirit.category === 'author' ? 'bg-spooky-orange text-parchment-50 border-ink' : ''}
          ${spirit.category === 'character' ? 'bg-red-600 text-white border-ink' : ''}
          ${spirit.category === 'perspective' ? 'bg-blue-600 text-white border-ink' : ''}
          ${spirit.category === 'abstract' ? 'bg-orange-700 text-orange-200' : ''}
        `}
        >
          {spirit.category}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 text-center mb-4">
        {spirit.description}
      </p>

      {/* Voice preview on hover */}
      {isHovering && !disabled && (
        <div className="mt-4 p-4 bg-parchment-100 border-2 border-ink animate-fadeIn parchment-texture">
          <h4 className="text-xs font-semibold text-ink mb-2 uppercase font-handwritten">
            👻 Voice Preview
          </h4>
          <p className="text-xs text-gray-400 italic">
            <strong>Tone:</strong> {spirit.voice.tone}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            <strong>Focus:</strong> {spirit.voice.focus}
          </p>
        </div>
      )}
    </div>
  );
};

export default SpiritCard;
