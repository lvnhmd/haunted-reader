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
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Textarea */}
        <div className="form-control">
          <label htmlFor="text-input" className="label">
            <span className="label-text">Paste your text here for spirit interpretation</span>
          </label>
          <textarea
            id="text-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onPaste={handlePaste}
            disabled={disabled}
            placeholder="Paste your text here... The spirits are listening..."
            className="textarea textarea-bordered textarea-lg h-64 resize-none"
            aria-describedby="text-input-help"
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
            <span aria-hidden="true">{disabled ? '⏳' : '🔮'}</span>
            {disabled ? 'Processing...' : 'Summon Spirits'}
          </button>
        </div>
      </form>

      {/* Help text */}
      <p id="text-input-help" className="text-xs opacity-70 text-center">
        <span aria-hidden="true">💀</span> Paste any text up to 50,000 characters
      </p>
    </div>
  );
};

export default TextInput;
