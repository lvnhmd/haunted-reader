import { useState } from 'react';
import { getSpiritById } from '../spirits/spiritDefinitions';

/**
 * InterpretationPanel - Display a single interpretation with spirit info
 * Shows the generated content with metadata and export options
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

  // Loading state with spirit-specific message
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
      <div className={`bg-parchment-50 border-2 border-ink p-6 parchment-texture ${className}`}>
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <div className="text-6xl animate-bounce">{spirit?.icon || '👻'}</div>
          <div className="text-xl text-spooky-orange font-handwritten font-semibold animate-pulse">
            {message}
          </div>
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-spooky-orange animate-pulse"></div>
            <div className="w-3 h-3 bg-spooky-orange animate-pulse delay-75"></div>
            <div className="w-3 h-3 bg-spooky-orange animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!spirit) {
    return (
      <div className={`bg-parchment-50 border-2 border-red-600 p-6 parchment-texture ${className}`}>
        <p className="text-red-600 font-book">Error: Spirit not found</p>
      </div>
    );
  }

  // Category colors
  const categoryColors = {
    author: 'border-spooky-orange',
    character: 'border-red-600',
    perspective: 'border-blue-600',
    abstract: 'border-ink',
  };

  const categoryBgColors = {
    author: 'bg-spooky-orange/10',
    character: 'bg-red-600/10',
    perspective: 'bg-blue-600/10',
    abstract: 'bg-ink/10',
  };

  return (
    <div
      className={`bg-parchment-50 border-2 ${
        categoryColors[spirit.category]
      } ${className} flex flex-col h-full parchment-texture`}
    >
      {/* Header */}
      <div
        className={`p-4 ${
          categoryBgColors[spirit.category]
        } border-b-2 ${categoryColors[spirit.category]} flex items-center justify-between`}
      >
        <div className="flex items-center space-x-3">
          <span className="text-4xl">{spirit.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-ink font-handwritten">{spirit.name}</h3>
            <p className="text-sm text-ink-lighter font-book">{spirit.description}</p>
          </div>
        </div>

        {/* Expand/Collapse button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-ink-lighter hover:text-ink transition-colors p-2"
          aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          {/* Metadata */}
          <div className="p-4 border-b border-ink-lighter flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-ink-lighter">📅</span>
              <span className="text-ink font-book">
                {new Date(interpretation.generatedAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-ink-lighter">📝</span>
              <span className="text-ink font-book">
                {interpretation.wordCount || 0} words
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-ink-lighter">🎭</span>
              <span className="text-ink capitalize font-book">{spirit.category}</span>
            </div>
          </div>

          {/* Interpretation content - scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose max-w-none">
              <div className="text-ink whitespace-pre-wrap leading-relaxed font-book">
                {interpretation.content}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t border-gray-700 flex gap-3">
            <button
              onClick={() => onExport(interpretation)}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-parchment-50 border-2 border-ink transition-colors font-handwritten text-lg"
              aria-label="Export interpretation"
            >
              💾 Export
            </button>
            <button
              onClick={() => onRegenerate(interpretation.spiritId)}
              className="flex-1 px-4 py-2 bg-spooky-orange hover:bg-spooky-orange-dark text-parchment-50 border-2 border-ink transition-colors font-handwritten text-lg"
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
