import { useState } from 'react';
import { getSpiritById } from '../spirits/spiritDefinitions';

/**
 * InterpretationPanel - DaisyUI Version
 * Display a single interpretation with spirit info
 */
const InterpretationPanel = ({
  interpretation,
  onExport,
  onRegenerate,
  isLoading = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const spirit = getSpiritById(interpretation?.spiritId);

  if (!interpretation && !isLoading) {
    return null;
  }

  // Loading state
  if (isLoading) {
    const loadingMessages = {
      poe: 'Summoning the darkness...',
      dickens: 'Penning Victorian prose...',
      austen: 'Crafting witty observations...',
      lovecraft: 'Channeling eldritch horrors...',
      hemingway: 'Writing cleanly and truly...',
      villain: 'Plotting delicious chaos...',
      child: 'Thinking really hard...',
      scholar: 'Consulting ancient tomes...',
      monster: 'Awakening from slumber...',
      prophet: 'Foreseeing the doom...',
    };

    const message = spirit
      ? loadingMessages[spirit.id] || 'Summoning spirits...'
      : 'Generating interpretation...';

    return (
      <div className={`card bg-base-200 shadow-xl ${className}`}>
        <div className="card-body items-center justify-center py-12">
          <div className="text-6xl animate-bounce">{spirit?.icon || '👻'}</div>
          <div className="text-xl text-warning font-handwritten font-semibold animate-pulse">
            {message}
          </div>
          <div className="flex gap-2">
            <span className="loading loading-dots loading-md text-warning"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!spirit) {
    return (
      <div className={`alert alert-error ${className}`}>
        <span>Error: Spirit not found</span>
      </div>
    );
  }

  // Category colors
  const categoryBadges = {
    author: 'badge-primary',
    character: 'badge-secondary',
    perspective: 'badge-accent',
    abstract: 'badge-warning',
  };

  return (
    <div className={`card bg-base-200 shadow-xl ${className} flex flex-col h-full`}>
      {/* Header */}
      <div className="card-body p-4 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{spirit.icon}</span>
            <div>
              <h3 className="card-title text-xl">{spirit.name}</h3>
              <p className="text-sm opacity-70">{spirit.description}</p>
            </div>
          </div>

          {/* Expand/Collapse button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="btn btn-ghost btn-sm btn-circle"
            aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          {/* Metadata */}
          <div className="px-4 py-3 border-b border-base-300 flex flex-wrap gap-4 text-sm">
            <div className="badge badge-ghost gap-2">
              <span>📅</span>
              {new Date(interpretation.generatedAt).toLocaleString()}
            </div>
            <div className="badge badge-ghost gap-2">
              <span>📝</span>
              {interpretation.wordCount || 0} words
            </div>
            <div className={`badge ${categoryBadges[spirit.category]} gap-2`}>
              <span>🎭</span>
              {spirit.category}
            </div>
          </div>

          {/* Interpretation content - scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">
                {interpretation.content}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-actions p-4 border-t border-base-300">
            <button
              onClick={() => onExport(interpretation)}
              className="btn btn-success flex-1 gap-2"
              aria-label="Export interpretation"
            >
              💾 Export
            </button>
            <button
              onClick={() => onRegenerate(interpretation.spiritId)}
              className="btn btn-warning flex-1 gap-2"
              aria-label="Regenerate interpretation"
            >
              🔄 Regenerate
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InterpretationPanel;
