import { useState, useEffect, useMemo } from 'react';
import {
  analyzeTextEmotions,
  getDominantEmotion,
  getEmotionColor,
  getEmotionTextColor,
  formatEmotionScores
} from './EmotionAnalyzer';

/**
 * SpectralTimeline - Visualizes emotional flow of text
 * Shows color-coded timeline of emotions throughout the text
 * Implements CP-8.1, CP-8.2, CP-8.3, CP-8.4, CP-8.5
 */
const SpectralTimeline = ({ text, onSectionClick }) => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);

  // Analyze text emotions (memoized to avoid recalculation)
  // CP-8.5: Timeline updates when text changes
  const emotionData = useMemo(() => {
    if (!text || text.trim().length === 0) {
      return [];
    }
    return analyzeTextEmotions(text);
  }, [text]);

  // Reset selected section when text changes
  useEffect(() => {
    setSelectedSection(null);
    setHoveredSection(null);
  }, [text]);

  /**
   * Handle section click
   * CP-8.3: Clicking timeline must scroll to corresponding text
   */
  const handleSectionClick = (section) => {
    setSelectedSection(section.index);
    if (onSectionClick) {
      onSectionClick(section.index);
    }
  };

  // Empty state
  if (emotionData.length === 0) {
    return (
      <div className="bg-parchment-50 border-2 border-ink p-8 text-center parchment-texture">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-ink font-handwritten mb-2">
          No text to analyze
        </h3>
        <p className="text-ink-lighter font-book">
          Upload text to see its emotional timeline
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-parchment-50 border-2 border-ink p-4 parchment-texture">
        <h2 className="text-2xl font-bold text-ink font-underdog mb-2">
          👻 Spectral Timeline
        </h2>
        <p className="text-ink-lighter text-sm font-book">
          Emotional flow across {emotionData.length} sections
        </p>
      </div>

      {/* Timeline visualization */}
      <div className="bg-parchment-50 border-2 border-ink p-6 parchment-texture">
        {/* Legend */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-ink-lighter mb-3 uppercase font-book">
            Emotion Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            {['fear', 'joy', 'tension', 'sadness', 'mystery'].map((emotion) => (
              <div key={emotion} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 ${getEmotionColor(emotion)}`}
                  aria-label={`${emotion} color`}
                />
                <span className="text-sm text-ink capitalize font-book">
                  {emotion}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline bars */}
        <div className="space-y-2">
          {emotionData.map((section) => {
            const dominantEmotion = getDominantEmotion(section.emotions);
            const isHovered = hoveredSection === section.index;
            const isSelected = selectedSection === section.index;

            return (
              <div key={section.index} className="relative">
                {/* Section bar */}
                <button
                  onClick={() => handleSectionClick(section)}
                  onMouseEnter={() => setHoveredSection(section.index)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className={`
                    w-full h-8 transition-all duration-200 border-2 border-ink
                    ${getEmotionColor(dominantEmotion)}
                    ${isHovered || isSelected ? 'scale-105 shadow-lg' : ''}
                    ${isSelected ? 'ring-2 ring-ink' : ''}
                    hover:scale-105 hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-ink
                  `}
                  aria-label={`Section ${section.index + 1}: ${dominantEmotion}`}
                  title={`Section ${section.index + 1}: Click to view`}
                >
                  <span className={`text-xs font-semibold font-handwritten ${getEmotionTextColor(dominantEmotion)}`}>
                    {section.index + 1}
                  </span>
                </button>

                {/* Hover tooltip */}
                {isHovered && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-10 animate-fadeIn">
                    <div className="bg-parchment-50 border-2 border-ink p-4 shadow-xl parchment-texture">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-ink font-handwritten">
                          Section {section.index + 1}
                        </h4>
                        <span className="text-xs text-ink-lighter font-book">
                          {section.text.split(/\s+/).length} words
                        </span>
                      </div>
                      
                      {/* Emotion breakdown */}
                      <div className="space-y-1 mb-3">
                        {Object.entries(section.emotions)
                          .sort(([, a], [, b]) => b - a)
                          .map(([emotion, score]) => (
                            <div key={emotion} className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 ${getEmotionColor(emotion)}`}
                              />
                              <span className="text-xs text-ink capitalize flex-1 font-book">
                                {emotion}
                              </span>
                              <span className="text-xs text-ink-lighter font-book">
                                {Math.round(score * 100)}%
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* Text preview */}
                      <div className="text-xs text-ink-lighter italic border-t border-ink-lighter pt-2 font-book">
                        {section.text.substring(0, 100)}
                        {section.text.length > 100 ? '...' : ''}
                      </div>

                      <div className="text-xs text-spooky-orange mt-2 font-handwritten">
                        ✶ Click to jump to this section
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected section details */}
        {selectedSection !== null && (
          <div className="mt-6 p-4 bg-parchment-100 border-2 border-ink parchment-texture">
            <h3 className="text-lg font-semibold text-ink font-handwritten mb-3">
              📍 Section {selectedSection + 1} Details
            </h3>
            
            {emotionData[selectedSection] && (
              <>
                <div className="mb-3">
                  <p className="text-sm text-ink-lighter mb-2 font-book">Emotion Breakdown:</p>
                  <p className="text-sm text-ink font-book">
                    {formatEmotionScores(emotionData[selectedSection].emotions)}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-ink-lighter mb-2 font-book">Text Preview:</p>
                  <p className="text-sm text-ink italic font-book">
                    {emotionData[selectedSection].text.substring(0, 200)}
                    {emotionData[selectedSection].text.length > 200 ? '...' : ''}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSection(null)}
                  className="text-sm text-spooky-orange hover:text-spooky-orange-dark transition-colors font-handwritten"
                >
                  ✕ Clear selection
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="bg-parchment-100 border-2 border-ink-lighter p-4 parchment-texture">
        <h4 className="text-sm font-semibold text-ink font-handwritten mb-2">
          💡 Timeline Tips
        </h4>
        <ul className="text-sm text-ink-lighter space-y-1 font-book">
          <li>• Each bar represents a section of your text</li>
          <li>• Colors show the dominant emotion in that section</li>
          <li>• Hover over a bar to see detailed emotion breakdown</li>
          <li>• Click a bar to jump to that section in your text</li>
          <li>• The timeline updates automatically when you change the text</li>
        </ul>
      </div>

      {/* Accessibility note */}
      <div className="text-xs text-ink-lighter text-center font-book">
        Colors meet WCAG AA accessibility standards for contrast
      </div>
    </div>
  );
};

export default SpectralTimeline;
