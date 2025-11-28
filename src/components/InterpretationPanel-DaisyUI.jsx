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
      {/* Header - Compact */}
      <div className="px-4 py-3 border-b border-base-300">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{spirit.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="card-title text-lg mb-0">{spirit.name}</h3>
            <p className="text-xs opacity-70">{spirit.description}</p>
          </div>
          <div className={`badge ${categoryBadges[spirit.category]} badge-sm`}>
            {spirit.category}
          </div>
        </div>
      </div>

      {/* Metadata - Compact */}
      <div className="px-4 py-2 border-b border-base-300 flex flex-wrap gap-2 text-xs">
        <div className="badge badge-ghost badge-xs gap-1">
          <span>📅</span>
          {new Date(interpretation.generatedAt).toLocaleString()}
        </div>
        <div className="badge badge-ghost badge-xs gap-1">
          <span>📝</span>
          {interpretation.wordCount || 0} words
        </div>
      </div>

      {/* Interpretation content - scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed font-book">
            {interpretation.content}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card-actions p-3 border-t border-base-300 gap-2">
        <button
          onClick={() => onExport(interpretation)}
          className="btn btn-success btn-sm flex-1 gap-1"
          aria-label="Export interpretation"
        >
          <span>💾</span> <span>Export</span>
        </button>
        <button
          onClick={() => onRegenerate(interpretation.spiritId)}
          className="btn btn-warning btn-sm flex-1 gap-1"
          aria-label="Regenerate interpretation"
        >
          <span>🔄</span> <span>Regenerate</span>
        </button>
      </div>
    </div>
  );
};

export default InterpretationPanel;
