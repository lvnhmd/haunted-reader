import { useState } from 'react';

/**
 * TextInput - Direct text paste component with spooky styling
 * Allows users to paste text directly instead of uploading a file
 */
const TextInput = ({ onTextSubmit, disabled = false }) => {
  const [text, setText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onTextSubmit(text);
      setText(''); // Clear after submission
    }
  };

  const handlePaste = (e) => {
    // Allow default paste behavior, but we could add custom handling here
    setTimeout(() => {
      const pastedText = e.target.value;
      if (pastedText.length > 50000) {
        alert('⚰️ This text is too long! (Max 50,000 characters)');
        setText(pastedText.slice(0, 50000));
      }
    }, 0);
  };

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Textarea */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder="📜 Paste your text here... The spirits are listening..."
            className={`
              w-full h-64 p-4 resize-none font-book
              bg-parchment-50 border-2 text-ink
              placeholder-ink-lighter
              transition-all duration-300
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isFocused ? 'border-spooky-orange ring-2 ring-spooky-orange/50' : 'border-ink-lighter'}
              focus:outline-none
            `}
          />

          {/* Decorative corner element */}
          {isFocused && (
            <div className="absolute top-2 right-2 text-xl animate-pulse">
              👁️
            </div>
          )}
        </div>

        {/* Stats and submit */}
        <div className="flex items-center justify-between">
          {/* Character/word count */}
          <div className="text-sm text-gray-500">
            <span className={charCount > 45000 ? 'text-orange-400' : ''}>
              {charCount.toLocaleString()} characters
            </span>
            {' • '}
            <span>{wordCount.toLocaleString()} words</span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className={`
              px-6 py-2 font-handwritten text-lg
              transition-all duration-300
              ${
                disabled || !text.trim()
                  ? 'bg-parchment-200 text-ink-lighter cursor-not-allowed border-2 border-ink-lighter'
                  : 'bg-spooky-orange text-parchment-50 hover:bg-spooky-orange-dark hover:scale-105 active:scale-95 border-2 border-ink'
              }
            `}
          >
            {disabled ? '⏳ Processing...' : '🔮 Summon Spirits'}
          </button>
        </div>
      </form>

      {/* Help text */}
      <p className="text-xs text-gray-600 text-center">
        💀 Paste any text up to 50,000 characters
      </p>
    </div>
  );
};

export default TextInput;
