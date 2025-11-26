import { useState, useEffect, useMemo } from 'react';
import {
  analyzeTextEmotions,
  getDominantEmotion,
  getEmotionColor,
  getEmotionTextColor,
  formatEmotionScores
} from './EmotionAnalyzer';
import { announceToScreenReader } from '../utils/accessibility';

/**
 * SpectralTimeline - DaisyUI Version
 * Visualizes emotional flow of text with DaisyUI components
 */
const SpectralTimeline = ({ text, onSectionClick }) => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  const emotionData = useMemo(() => {
    if (!text || text.trim().length === 0) {
      return [];
    }
    return analyzeTextEmotions(text);
  }, [text]);

  useEffect(() => {
    setSelectedSection(null);
    setHoveredSection(null);
  }, [text]);

  const handleSectionClick = (section) => {
    setSelectedSection(section.index);
    const dominantEmotion = getDominantEmotion(section.emotions);
    announceToScreenReader(`Section ${section.index + 1} selected. Dominant emotion: ${dominantEmotion}.`);
    if (onSectionClick) {
      onSectionClick(section.index);
    }
  };

  // Empty state
  if (emotionData.length === 0) {
    return (
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body items-center text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="card-title">No text to analyze</h3>
          <p>Upload text to see its emotional timeline</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Legend */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="card-title text-2xl mb-2">
                👻 Spectral Timeline
              </h2>
              <p className="text-sm opacity-70">
                Emotional flow across {emotionData.length} sections • Hover for details, click to select
              </p>
            </div>
          </div>
          
          {/* Legend - Compact */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Emotion color legend">
            {['fear', 'joy', 'tension', 'sadness', 'mystery'].map((emotion) => (
              <div key={emotion} className="badge badge-outline gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${getEmotionColor(emotion)}`}
                  role="img"
                  aria-label={`${emotion} color indicator`}
                />
                <span className="capitalize text-xs">{emotion}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-4">
          <h3 className="text-sm font-semibold opacity-70 mb-3 uppercase">Timeline</h3>

          {/* Timeline bars */}
          <div className="space-y-2" role="group" aria-label="Emotional timeline sections">
            {emotionData.map((section) => {
              const dominantEmotion = getDominantEmotion(section.emotions);
              const isHovered = hoveredSection === section.index;
              const isSelected = selectedSection === section.index;

              return (
                <div key={section.index} className="relative">
                  <button
                    onClick={() => handleSectionClick(section)}
                    onMouseEnter={() => setHoveredSection(section.index)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onFocus={() => setHoveredSection(section.index)}
                    onBlur={() => setHoveredSection(null)}
                    className={`
                      w-full h-8 rounded border border-base-content/10
                      flex items-center justify-start px-2
                      ${getEmotionColor(dominantEmotion)}
                      ${isHovered ? 'scale-[1.02] shadow-md brightness-110' : ''}
                      ${isSelected ? 'ring-2 ring-primary scale-[1.02]' : ''}
                      transition-all duration-150 cursor-pointer
                      hover:scale-[1.02] hover:shadow-md hover:brightness-110
                      focus:outline-none focus:ring-2 focus:ring-primary
                    `}
                    aria-label={`Section ${section.index + 1} of ${emotionData.length}. Dominant emotion: ${dominantEmotion}`}
                    aria-pressed={isSelected}
                  >
                    <span className="text-xs font-semibold opacity-80">
                      {section.index + 1}
                    </span>
                  </button>

                  {/* Hover tooltip */}
                  {isHovered && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-10 animate-fadeIn">
                      <div className="card bg-base-100 shadow-2xl">
                        <div className="card-body p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">Section {section.index + 1}</h4>
                            <span className="badge badge-ghost badge-sm">
                              {section.text.split(/\s+/).length} words
                            </span>
                          </div>
                          
                          {/* Emotion breakdown */}
                          <div className="space-y-1 mb-3">
                            {Object.entries(section.emotions)
                              .sort(([, a], [, b]) => b - a)
                              .map(([emotion, score]) => (
                                <div key={emotion} className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded ${getEmotionColor(emotion)}`} />
                                  <span className="text-xs capitalize flex-1">{emotion}</span>
                                  <span className="text-xs opacity-70">{Math.round(score * 100)}%</span>
                                </div>
                              ))}
                          </div>

                          {/* Text preview */}
                          <div className="text-xs opacity-70 italic border-t pt-2">
                            {section.text.substring(0, 100)}
                            {section.text.length > 100 ? '...' : ''}
                          </div>

                          <div className="text-xs text-warning mt-2">
                            ✶ Click to jump to this section
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Selected section details */}
      {selectedSection !== null && emotionData[selectedSection] && (
        <div className="card bg-primary/10 border-2 border-primary shadow-xl">
          <div className="card-body">
            <div className="flex items-start justify-between mb-4">
              <h3 className="card-title text-lg">
                📍 Section {selectedSection + 1} Details
              </h3>
              <button
                onClick={() => setSelectedSection(null)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold opacity-70 mb-2">Emotion Breakdown:</p>
                <p className="text-sm">{formatEmotionScores(emotionData[selectedSection].emotions)}</p>
              </div>

              <div>
                <p className="text-sm font-semibold opacity-70 mb-2">Text Preview:</p>
                <p className="text-sm italic opacity-90">
                  {emotionData[selectedSection].text.substring(0, 200)}
                  {emotionData[selectedSection].text.length > 200 ? '...' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Card */}
      <div className="card bg-base-300 shadow-xl">
        <div className="card-body">
          <h4 className="card-title text-sm">💡 Timeline Tips</h4>
          <ul className="text-sm space-y-1 opacity-70">
            <li>• Each bar represents a section of your text</li>
            <li>• Colors show the dominant emotion in that section</li>
            <li>• Hover over a bar to see detailed emotion breakdown</li>
            <li>• Click a bar to jump to that section in your text</li>
            <li>• The timeline updates automatically when you change the text</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpectralTimeline;
