import { useState } from 'react';

/**
 * SpiritCard - DaisyUI redesigned spirit display card
 * Shows spirit info with hover effects and voice preview
 */
const SpiritCard = ({ spirit, isSelected, onClick, disabled = false }) => {
  const [isHovering, setIsHovering] = useState(false);

  // Category badge colors
  const categoryBadges = {
    author: 'badge-primary',
    character: 'badge-secondary',
    perspective: 'badge-accent',
    abstract: 'badge-warning',
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onFocus={() => setIsHovering(true)}
      onBlur={() => setIsHovering(false)}
      className={`
        card bg-base-200 shadow-xl cursor-pointer transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl'}
        ${isSelected ? 'ring-4 ring-primary scale-105' : ''}
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
      {/* Selection Indicator Badge */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="badge badge-success badge-lg gap-2 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      <div className="card-body items-center text-center">
        {/* Spirit Icon */}
        <div className="text-6xl mb-2" aria-hidden="true">
          {spirit.icon}
        </div>

        {/* Spirit Name */}
        <h3 className="card-title text-lg font-handwritten">
          {spirit.name}
        </h3>

        {/* Category Badge */}
        <div className={`badge ${categoryBadges[spirit.category]} badge-sm`}>
          {spirit.category}
        </div>

        {/* Description */}
        <p className="text-sm opacity-70 mt-2">
          {spirit.description}
        </p>

        {/* Voice Preview on Hover - Collapse */}
        {isHovering && !disabled && (
          <div className="collapse collapse-open bg-base-300 mt-4 w-full">
            <div className="collapse-title text-xs font-bold">
              👻 Voice Preview
            </div>
            <div className="collapse-content text-xs"> 
              <div className="space-y-1">
                <p><strong>Tone:</strong> {spirit.voice.tone}</p>
                <p><strong>Focus:</strong> {spirit.voice.focus}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Indicator */}
        {!isSelected && !disabled && (
          <div className="card-actions mt-2">
            <div className="badge badge-outline badge-sm">Click to select</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpiritCard;
