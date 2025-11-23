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
              w-full h-64 p-4 rounded-lg resize-none
              bg-gray-900 border-2 text-gray-100
              placeholder-gray-600
              transition-all duration-300
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${isFocused ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-gray-700'}
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
              px-6 py-2 rounded-lg font-semibold
              transition-all duration-300
              ${
                disabled || !text.trim()
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700 hover:scale-105 active:scale-95'
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
