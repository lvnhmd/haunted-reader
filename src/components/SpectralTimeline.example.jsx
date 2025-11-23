/**
 * Example usage of SpectralTimeline component
 * Demonstrates emotion visualization with sample text
 */

import { useState } from 'react';
import SpectralTimeline from './SpectralTimeline';

// Sample text with varied emotional content
const sampleTexts = {
  horror: `The old house stood at the end of the lane, its windows dark and empty like hollow eyes. 
Nobody had lived there for years, not since the incident. Sarah approached the door, her hand 
trembling as she reached for the handle. A cold wind whispered through the trees, carrying with 
it the scent of decay. She pushed the door open, and it creaked ominously. Inside, shadows 
danced on the walls, and she heard a sound—footsteps, slow and deliberate, coming from upstairs. 
Her heart pounded in her chest. She wanted to run, but something compelled her forward. The 
stairs groaned under her weight. At the top, a door stood ajar, and from within came a faint, 
ghostly light. She reached out, her fingers brushing the cold wood, and pushed it open. What 
she saw inside would haunt her forever—a figure in white, turning slowly to face her, its eyes 
empty voids of darkness.`,

  adventure: `The sun rose over the mountains, painting the sky in brilliant shades of orange and gold. 
Maya stood at the edge of the cliff, her backpack secure, her spirit soaring with excitement. 
Today was the day she'd been waiting for—the start of her grand adventure. She took a deep 
breath of the crisp mountain air and began her descent. The trail wound through ancient forests, 
past crystal-clear streams, and over rocky outcrops. Each step brought new wonders. She discovered 
hidden waterfalls, encountered curious wildlife, and felt more alive than ever before. As the day 
progressed, challenges arose—a steep climb, a narrow ledge, a sudden storm. But Maya pressed on, 
her determination unwavering. By evening, she reached the summit, and the view took her breath 
away. The world stretched out before her, vast and beautiful, full of endless possibilities.`,

  mystery: `The letter arrived on a Tuesday, unmarked and unexpected. Detective Chen turned it over 
in her hands, studying the peculiar wax seal. Inside, a single sentence: "The truth lies where 
the shadows meet." What did it mean? She'd been investigating the disappearance of Professor 
Hartwell for weeks, and this was the first real clue. The professor's office had been empty, 
his research notes cryptic and incomplete. Chen visited the university library, searching for 
answers. In the archives, she found an old map, marked with strange symbols. One location stood 
out—an abandoned observatory on the outskirts of town. That night, she drove there alone. The 
building loomed against the starlit sky, its dome cracked and weathered. Inside, dust covered 
everything. But in the center of the main chamber, she found it—a hidden compartment beneath 
the telescope platform. Inside lay the professor's journal, and the secrets it contained would 
change everything she thought she knew.`
};

function SpectralTimelineExample() {
  const [selectedText, setSelectedText] = useState('horror');
  const [scrollTarget, setScrollTarget] = useState(null);

  const handleSectionClick = (sectionIndex) => {
    console.log('Section clicked:', sectionIndex);
    setScrollTarget(sectionIndex);
    
    // In a real app, this would scroll to the corresponding text section
    // For this example, we'll just show an alert
    alert(`Would scroll to section ${sectionIndex + 1}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-400 mb-4">
            👻 Spectral Timeline Example
          </h1>
          <p className="text-gray-400">
            Visualize the emotional flow of your text
          </p>
        </div>

        {/* Text selector */}
        <div className="bg-gray-900 rounded-lg border-2 border-purple-600 p-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            Select Sample Text
          </h2>
          <div className="flex gap-4">
            {Object.keys(sampleTexts).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedText(key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                  selectedText === key
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <SpectralTimeline
          text={sampleTexts[selectedText]}
          onSectionClick={handleSectionClick}
        />

        {/* Original text display */}
        <div className="bg-gray-900 rounded-lg border-2 border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            📄 Original Text
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {sampleTexts[selectedText]}
            </p>
          </div>
        </div>

        {/* Info panel */}
        <div className="bg-purple-900/20 rounded-lg border border-purple-600 p-6">
          <h3 className="text-lg font-semibold text-purple-400 mb-3">
            📊 How It Works
          </h3>
          <ul className="text-gray-300 space-y-2">
            <li>
              <strong>Text Division:</strong> The text is divided into 10-20 sections
              based on length
            </li>
            <li>
              <strong>Emotion Analysis:</strong> Each section is analyzed for emotional
              keywords (fear, joy, tension, sadness, mystery)
            </li>
            <li>
              <strong>Scoring:</strong> Emotion scores are normalized to sum to 1.0 per
              section
            </li>
            <li>
              <strong>Visualization:</strong> The dominant emotion determines each bar's
              color
            </li>
            <li>
              <strong>Interaction:</strong> Hover for details, click to jump to that
              section
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SpectralTimelineExample;

/**
 * Usage Notes:
 * 
 * Basic usage:
 * <SpectralTimeline
 *   text="Your text here..."
 *   onSectionClick={(index) => console.log('Section', index)}
 * />
 * 
 * Props:
 * - text: string (required) - The text to analyze
 * - onSectionClick: function (optional) - Callback when section is clicked
 *   - Receives sectionIndex (0-based) as parameter
 * 
 * Features:
 * - Automatically divides text into 10-20 sections (CP-8.1)
 * - Emotion scores sum to 1.0 per section (CP-8.2)
 * - Click handler for scrolling to sections (CP-8.3)
 * - Accessible colors meeting WCAG AA standards (CP-8.4)
 * - Updates automatically when text changes (CP-8.5)
 * 
 * Emotions Detected:
 * - Fear (red): Scary, threatening content
 * - Joy (yellow): Happy, positive content
 * - Tension (orange): Anxious, suspenseful content
 * - Sadness (blue): Sorrowful, melancholic content
 * - Mystery (purple): Strange, enigmatic content
 * 
 * Integration Example:
 * 
 * function App() {
 *   const [text, setText] = useState('');
 *   const textRef = useRef(null);
 * 
 *   const scrollToSection = (sectionIndex) => {
 *     // Calculate position based on section index
 *     // Scroll to that position in the text display
 *     if (textRef.current) {
 *       const sections = divideTextIntoSections(text);
 *       // Implement scrolling logic here
 *     }
 *   };
 * 
 *   return (
 *     <>
 *       <SpectralTimeline
 *         text={text}
 *         onSectionClick={scrollToSection}
 *       />
 *       <div ref={textRef}>
 *         {text}
 *       </div>
 *     </>
 *   );
 * }
 */
