import { useState } from 'react';
import FileDropzone from './FileDropzone';
import TextInput from './TextInput';
import { parseFile, parseText } from '../services/fileParser';

/**
 * TextUploader - Main component for uploading and parsing text
 * Supports both file upload (TXT, PDF, EPUB) and direct text paste
 */
const TextUploader = ({ onTextParsed, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'paste'
  const [parsedText, setParsedText] = useState(null);

  /**
   * Handle file selection from dropzone
   */
  const handleFileSelect = async (file) => {
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Show progress for large files (> 1MB)
      const showProgress = file.size > 1024 * 1024;
      
      if (showProgress) {
        // Simulate progress (real progress would require chunked reading)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);
      }

      // Parse the file
      const result = await parseFile(file);
      
      if (showProgress) {
        setUploadProgress(100);
      }

      // Store parsed text locally and notify parent
      setParsedText(result);
      onTextParsed(result);

    } catch (error) {
      console.error('File parsing error:', error);
      onError(error);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  /**
   * Handle direct text paste
   */
  const handleTextSubmit = async (text) => {
    setIsProcessing(true);

    try {
      // Parse the text
      const result = await parseText(text);

      // Store parsed text locally and notify parent
      setParsedText(result);
      onTextParsed(result);

    } catch (error) {
      console.error('Text parsing error:', error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Handle errors from child components
   */
  const handleError = (error) => {
    setIsProcessing(false);
    setUploadProgress(0);
    onError(error);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-ink font-underdog mb-2">
          📚 Summon Your Text
        </h2>
        <p className="text-gray-400">
          Upload a file or paste text to begin your haunted reading experience
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setActiveTab('file')}
          disabled={isProcessing}
          className={`
            px-6 py-2 font-handwritten text-lg transition-all duration-300
            ${
              activeTab === 'file'
                ? 'bg-spooky-orange text-parchment-50 border-2 border-ink'
                : 'bg-parchment-50 text-ink border-2 border-ink-lighter hover:bg-parchment-200'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          📁 Upload File
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          disabled={isProcessing}
          className={`
            px-6 py-2 font-handwritten text-lg transition-all duration-300
            ${
              activeTab === 'paste'
                ? 'bg-spooky-orange text-parchment-50 border-2 border-ink'
                : 'bg-parchment-50 text-ink border-2 border-ink-lighter hover:bg-parchment-200'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          📝 Paste Text
        </button>
      </div>

      {/* Upload progress bar (for large files) */}
      {isProcessing && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="w-full bg-parchment-200 border-2 border-ink h-3 overflow-hidden">
            <div
              className="bg-spooky-orange h-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-center text-sm text-spooky-orange font-handwritten">
            {uploadProgress < 100 ? '👻 Summoning spirits...' : '✨ Almost there...'}
          </p>
        </div>
      )}

      {/* Content area */}
      <div className="min-h-[300px]">
        {activeTab === 'file' ? (
          <FileDropzone
            onFileSelect={handleFileSelect}
            onError={handleError}
            disabled={isProcessing}
          />
        ) : (
          <TextInput
            onTextSubmit={handleTextSubmit}
            disabled={isProcessing}
          />
        )}
      </div>

      {/* Parsed text preview */}
      {parsedText && !isProcessing && (
        <div className="mt-6 p-6 bg-gray-900 rounded-lg border-2 border-green-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-green-400">
              ✅ Text Summoned Successfully
            </h3>
            <button
              onClick={() => {
                setParsedText(null);
                onTextParsed(null);
              }}
              className="text-gray-400 hover:text-red-400 transition-colors"
              title="Clear text"
            >
              ❌
            </button>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500">Words</div>
              <div className="text-white font-semibold">
                {parsedText.metadata.wordCount.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Characters</div>
              <div className="text-white font-semibold">
                {parsedText.metadata.characterCount.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">Read Time</div>
              <div className="text-white font-semibold">
                {parsedText.metadata.estimatedReadTime} min
              </div>
            </div>
          </div>

          {/* Text preview */}
          <div className="bg-gray-800 p-4 rounded max-h-48 overflow-y-auto">
            <p className="text-gray-300 text-sm whitespace-pre-wrap">
              {parsedText.content.slice(0, 500)}
              {parsedText.content.length > 500 && '...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextUploader;
