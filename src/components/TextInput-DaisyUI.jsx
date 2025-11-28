import { useState } from 'react';

/**
 * TextInput - DaisyUI Version
 * Direct text paste component
 */
const TextInput = ({ onTextSubmit, disabled = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onTextSubmit(text);
      setText('');
    }
  };

  const handlePaste = (e) => {
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
    <div className="space-y-4 min-h-[400px] flex flex-col">
      <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
        {/* Textarea */}
        <div className="form-control flex-1">
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={handlePaste}
            disabled={disabled}
            placeholder="💀 Paste any text up to 50,000 characters"
            className="textarea textarea-bordered textarea-lg flex-1 resize-none"
            aria-label="Paste your text here for spirit interpretation"
          />
        </div>

        {/* Stats and submit */}
        <div className="flex items-center justify-between">
          {/* Character/word count */}
          <div className="text-sm opacity-70" aria-live="polite">
            <span className={charCount > 45000 ? 'text-warning' : ''}>
              {charCount.toLocaleString()} characters
            </span>
            {' • '}
            <span>{wordCount.toLocaleString()} words</span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="btn btn-warning gap-2"
            aria-label={disabled ? 'Processing text' : text.trim() ? 'Submit text for interpretation' : 'Enter text to submit'}
          >
            <span aria-hidden="true">{disabled ? '⏳' : '🔮'}</span> <span>{disabled ? 'Processing...' : 'Summon Spirits'}</span>
          </button>
        </div>
      </form>

    </div>
  );
};

export default TextInput;
