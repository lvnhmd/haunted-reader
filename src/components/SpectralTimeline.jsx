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
      <div className="bg-gray-900 rounded-lg border-2 border-gray-700 p-8 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          No text to analyze
        </h3>
        <p className="text-gray-500">
          Upload text to see its emotional timeline
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg border-2 border-purple-600 p-4">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">
          👻 Spectral Timeline
        </h2>
        <p className="text-gray-400 text-sm">
          Emotional flow across {emotionData.length} sections
        </p>
      </div>

      {/* Timeline visualization */}
      <div className="bg-gray-900 rounded-lg border-2 border-purple-600 p-6">
        {/* Legend */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase">
            Emotion Legend
          </h3>
          <div className="flex flex-wrap gap-4">
            {['fear', 'joy', 'tension', 'sadness', 'mystery'].map((emotion) => (
              <div key={emotion} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded ${getEmotionColor(emotion)}`}
                  aria-label={`${emotion} color`}
                />
                <span className="text-sm text-gray-300 capitalize">
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
                    w-full h-8 rounded transition-all duration-200
                    ${getEmotionColor(dominantEmotion)}
                    ${isHovered || isSelected ? 'scale-105 shadow-lg' : ''}
                    ${isSelected ? 'ring-2 ring-white' : ''}
                    hover:scale-105 hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-white
                  `}
                  aria-label={`Section ${section.index + 1}: ${dominantEmotion}`}
                  title={`Section ${section.index + 1}: Click to view`}
                >
                  <span className={`text-xs font-semibold ${getEmotionTextColor(dominantEmotion)}`}>
                    {section.index + 1}
                  </span>
                </button>

                {/* Hover tooltip */}
                {isHovered && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-10 animate-fadeIn">
                    <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-4 shadow-xl">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-purple-400">
                          Section {section.index + 1}
                        </h4>
                        <span className="text-xs text-gray-500">
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
                                className={`w-3 h-3 rounded ${getEmotionColor(emotion)}`}
                              />
                              <span className="text-xs text-gray-300 capitalize flex-1">
                                {emotion}
                              </span>
                              <span className="text-xs text-gray-400">
                                {Math.round(score * 100)}%
                              </span>
                            </div>
                          ))}
                      </div>

                      {/* Text preview */}
                      <div className="text-xs text-gray-400 italic border-t border-gray-700 pt-2">
                        {section.text.substring(0, 100)}
                        {section.text.length > 100 ? '...' : ''}
                      </div>

                      <div className="text-xs text-purple-400 mt-2">
                        Click to jump to this section
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
          <div className="mt-6 p-4 bg-gray-800 rounded-lg border-2 border-purple-500">
            <h3 className="text-lg font-semibold text-purple-400 mb-3">
              📍 Section {selectedSection + 1} Details
            </h3>
            
            {emotionData[selectedSection] && (
              <>
                <div className="mb-3">
                  <p className="text-sm text-gray-400 mb-2">Emotion Breakdown:</p>
                  <p className="text-sm text-gray-300">
                    {formatEmotionScores(emotionData[selectedSection].emotions)}
                  </p>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-400 mb-2">Text Preview:</p>
                  <p className="text-sm text-gray-300 italic">
                    {emotionData[selectedSection].text.substring(0, 200)}
                    {emotionData[selectedSection].text.length > 200 ? '...' : ''}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedSection(null)}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  ✕ Clear selection
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">
          💡 Timeline Tips
        </h4>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>• Each bar represents a section of your text</li>
          <li>• Colors show the dominant emotion in that section</li>
          <li>• Hover over a bar to see detailed emotion breakdown</li>
          <li>• Click a bar to jump to that section in your text</li>
          <li>• The timeline updates automatically when you change the text</li>
        </ul>
      </div>

      {/* Accessibility note */}
      <div className="text-xs text-gray-600 text-center">
        Colors meet WCAG AA accessibility standards for contrast
      </div>
    </div>
  );
};

export default SpectralTimeline;
