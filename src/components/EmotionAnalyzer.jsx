/**
 * EmotionAnalyzer - Analyzes text for emotional content
 * Divides text into sections and scores emotions for each section
 * Implements CP-8.1, CP-8.2
 */

/**
 * Emotion keywords for simple keyword-based analysis
 * In a production app, this could use sentiment analysis APIs or ML models
 */
const EMOTION_KEYWORDS = {
  fear: [
    'afraid', 'fear', 'terror', 'horror', 'dread', 'panic', 'scared', 'frightened',
    'nightmare', 'scream', 'shadow', 'dark', 'death', 'blood', 'ghost', 'monster',
    'danger', 'threat', 'evil', 'sinister', 'ominous', 'foreboding', 'menace'
  ],
  joy: [
    'happy', 'joy', 'delight', 'pleasure', 'laugh', 'smile', 'cheerful', 'merry',
    'glad', 'content', 'bliss', 'elated', 'jubilant', 'ecstatic', 'wonderful',
    'beautiful', 'love', 'hope', 'bright', 'light', 'warm', 'celebrate'
  ],
  tension: [
    'tense', 'anxious', 'nervous', 'worried', 'stress', 'pressure', 'urgent',
    'hurry', 'rush', 'quick', 'fast', 'sudden', 'sharp', 'edge', 'wait', 'watch',
    'careful', 'cautious', 'alert', 'ready', 'prepare', 'anticipate', 'expect'
  ],
  sadness: [
    'sad', 'sorrow', 'grief', 'mourn', 'cry', 'tears', 'weep', 'melancholy',
    'despair', 'misery', 'pain', 'hurt', 'loss', 'lonely', 'alone', 'empty',
    'hollow', 'broken', 'lost', 'regret', 'sorry', 'tragic', 'unfortunate'
  ],
  mystery: [
    'mystery', 'strange', 'odd', 'curious', 'wonder', 'question', 'unknown',
    'secret', 'hidden', 'obscure', 'enigma', 'puzzle', 'riddle', 'cryptic',
    'mysterious', 'unexplained', 'bizarre', 'peculiar', 'unusual', 'weird'
  ]
};

/**
 * Divide text into sections (10-20 sections based on text length)
 * CP-8.1: Timeline must divide text into 10-20 sections
 * 
 * @param {string} text - The text to divide
 * @returns {string[]} Array of text sections
 */
export function divideTextIntoSections(text) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const words = text.trim().split(/\s+/);
  const wordCount = words.length;

  // Determine number of sections based on text length
  // Short texts: 10 sections, Long texts: up to 20 sections
  let numSections;
  if (wordCount < 500) {
    numSections = 10;
  } else if (wordCount < 2000) {
    numSections = 15;
  } else {
    numSections = 20;
  }

  const wordsPerSection = Math.ceil(wordCount / numSections);
  const sections = [];

  for (let i = 0; i < numSections; i++) {
    const start = i * wordsPerSection;
    const end = Math.min(start + wordsPerSection, wordCount);
    const sectionWords = words.slice(start, end);
    
    if (sectionWords.length > 0) {
      sections.push(sectionWords.join(' '));
    }
  }

  return sections;
}

/**
 * Calculate emotion scores for a text section
 * Uses keyword matching to determine emotional content
 * 
 * @param {string} text - The text section to analyze
 * @returns {Object} Emotion scores (fear, joy, tension, sadness, mystery)
 */
function calculateEmotionScores(text) {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  // Count keyword matches for each emotion
  const counts = {
    fear: 0,
    joy: 0,
    tension: 0,
    sadness: 0,
    mystery: 0
  };

  // Count matches for each emotion
  Object.keys(EMOTION_KEYWORDS).forEach(emotion => {
    EMOTION_KEYWORDS[emotion].forEach(keyword => {
      // Count occurrences of keyword in text
      const regex = new RegExp(`\\b${keyword}\\w*\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) {
        counts[emotion] += matches.length;
      }
    });
  });

  // Calculate total count
  const totalCount = Object.values(counts).reduce((sum, count) => sum + count, 0);

  // If no emotion keywords found, return balanced scores
  if (totalCount === 0) {
    return {
      fear: 0.2,
      joy: 0.2,
      tension: 0.2,
      sadness: 0.2,
      mystery: 0.2
    };
  }

  // Normalize scores to sum to 1.0 (CP-8.2)
  const scores = {};
  Object.keys(counts).forEach(emotion => {
    scores[emotion] = counts[emotion] / totalCount;
  });

  return scores;
}

/**
 * Analyze text and return emotion data for each section
 * CP-8.1: Divides text into 10-20 sections
 * CP-8.2: Emotion scores sum to 1.0 per section
 * 
 * @param {string} text - The full text to analyze
 * @returns {Array} Array of section objects with emotion scores
 */
export function analyzeTextEmotions(text) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const sections = divideTextIntoSections(text);
  
  return sections.map((sectionText, index) => {
    const emotions = calculateEmotionScores(sectionText);
    
    // Verify scores sum to 1.0 (within floating point tolerance)
    const sum = Object.values(emotions).reduce((a, b) => a + b, 0);
    const tolerance = 0.0001;
    
    if (Math.abs(sum - 1.0) > tolerance) {
      console.warn(`Section ${index} emotion scores sum to ${sum}, expected 1.0`);
    }

    return {
      index,
      text: sectionText,
      emotions
    };
  });
}

/**
 * Get the dominant emotion for a section
 * @param {Object} emotions - Emotion scores object
 * @returns {string} The emotion with the highest score
 */
export function getDominantEmotion(emotions) {
  let maxEmotion = 'mystery';
  let maxScore = 0;

  Object.entries(emotions).forEach(([emotion, score]) => {
    if (score > maxScore) {
      maxScore = score;
      maxEmotion = emotion;
    }
  });

  return maxEmotion;
}

/**
 * Get color for an emotion (accessible colors)
 * CP-8.4: Colors must be distinguishable for accessibility
 * @param {string} emotion - The emotion name
 * @returns {string} Tailwind color class
 */
export function getEmotionColor(emotion) {
  const colors = {
    fear: 'bg-red-600',      // Red for fear
    joy: 'bg-yellow-500',    // Yellow for joy
    tension: 'bg-orange-600', // Orange for tension
    sadness: 'bg-blue-600',  // Blue for sadness
    mystery: 'bg-purple-600' // Purple for mystery
  };

  return colors[emotion] || 'bg-gray-600';
}

/**
 * Get accessible text color for an emotion background
 * @param {string} emotion - The emotion name
 * @returns {string} Tailwind text color class
 */
export function getEmotionTextColor(emotion) {
  // All our emotion colors are dark enough to use white text
  return 'text-white';
}

/**
 * Format emotion scores for display
 * @param {Object} emotions - Emotion scores object
 * @returns {string} Formatted string like "Fear: 45%, Joy: 20%, ..."
 */
export function formatEmotionScores(emotions) {
  return Object.entries(emotions)
    .map(([emotion, score]) => {
      const percentage = Math.round(score * 100);
      return `${emotion.charAt(0).toUpperCase() + emotion.slice(1)}: ${percentage}%`;
    })
    .join(', ');
}

export default {
  analyzeTextEmotions,
  divideTextIntoSections,
  getDominantEmotion,
  getEmotionColor,
  getEmotionTextColor,
  formatEmotionScores
};
