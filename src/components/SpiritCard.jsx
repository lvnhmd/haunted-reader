import { useState } from 'react';

/**
 * SpiritCard - Individual spirit display card
 * Shows spirit info with hover effects and voice preview
 */
const SpiritCard = ({ spirit, isSelected, onClick, disabled = false }) => {
  const [isHovering, setIsHovering] = useState(false);

  // Category colors for visual distinction
  const categoryColors = {
    author: 'border-purple-500 hover:border-purple-400',
    character: 'border-red-500 hover:border-red-400',
    perspective: 'border-blue-500 hover:border-blue-400',
    abstract: 'border-orange-500 hover:border-orange-400',
  };

  const selectedColors = {
    author: 'bg-purple-900 border-purple-400 shadow-purple-500/50',
    character: 'bg-red-900 border-red-400 shadow-red-500/50',
    perspective: 'bg-blue-900 border-blue-400 shadow-blue-500/50',
    abstract: 'bg-orange-900 border-orange-400 shadow-orange-500/50',
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`
        relative p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${
          isSelected
            ? `${selectedColors[spirit.category]} shadow-lg scale-105`
            : `bg-gray-900 ${categoryColors[spirit.category]}`
        }
        ${!disabled && !isSelected ? 'hover:scale-105 hover:shadow-lg' : ''}
      `}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={`${spirit.name} - ${spirit.description}`}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg shadow-lg animate-pulse">
          ✓
        </div>
      )}

      {/* Spirit icon */}
      <div className="text-6xl mb-3 text-center">{spirit.icon}</div>

      {/* Spirit name */}
      <h3 className="text-xl font-bold text-center mb-2 text-white">
        {spirit.name}
      </h3>

      {/* Category badge */}
      <div className="text-center mb-3">
        <span
          className={`
          inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase
          ${spirit.category === 'author' ? 'bg-purple-700 text-purple-200' : ''}
          ${spirit.category === 'character' ? 'bg-red-700 text-red-200' : ''}
          ${spirit.category === 'perspective' ? 'bg-blue-700 text-blue-200' : ''}
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
        <div className="mt-4 p-4 bg-black/50 rounded-lg border border-gray-700 animate-fadeIn">
          <h4 className="text-xs font-semibold text-gray-300 mb-2 uppercase">
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
