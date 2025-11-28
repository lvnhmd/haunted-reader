import { useState } from 'react';
import FileDropzone from './FileDropzone-DaisyUI';
import TextInput from './TextInput-DaisyUI';
import { parseFile, parseText } from '../services/fileParser';

/**
 * TextUploader - DaisyUI redesigned component for uploading and parsing text
 * Supports both file upload (TXT, PDF, EPUB) and direct text paste
 */
const TextUploader = ({ onTextParsed, onError }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'paste'
  const [parsedText, setParsedText] = useState(null);

  const handleFileSelect = async (file) => {
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const showProgress = file.size > 1024 * 1024;
      
      if (showProgress) {
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

      const result = await parseFile(file);
      
      if (showProgress) {
        setUploadProgress(100);
      }

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

  const handleTextSubmit = async (text) => {
    setIsProcessing(true);

    try {
      const result = await parseText(text);
      setParsedText(result);
      onTextParsed(result);
    } catch (error) {
      console.error('Text parsing error:', error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleError = (error) => {
    setIsProcessing(false);
    setUploadProgress(0);
    onError(error);
  };

  return (
    <div className="space-y-6">
      {/* Main Upload Card - Everything in one section */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="card-title text-3xl font-underdog justify-center mb-2">
              <span aria-hidden="true">📚</span> Summon Your Text
            </h3>
            <p className="text-base-content/70 text-sm">
              Upload a file or paste text to begin your haunted reading experience
            </p>
          </div>

          {/* Tabs - Proper spacing */}
          <div className="flex justify-center mb-4">
            <div className="tabs tabs-boxed gap-1" role="tablist" aria-label="Upload method">
              <button 
                role="tab"
                aria-selected={activeTab === 'file'}
                aria-controls="upload-content"
                className={`tab ${activeTab === 'file' ? 'tab-active' : ''}`}
                onClick={() => !isProcessing && setActiveTab('file')}
                disabled={isProcessing}
              >
                <span aria-hidden="true">📁</span> <span>Upload File</span>
              </button>
              <button 
                role="tab"
                aria-selected={activeTab === 'paste'}
                aria-controls="upload-content"
                className={`tab ${activeTab === 'paste' ? 'tab-active' : ''}`}
                onClick={() => !isProcessing && setActiveTab('paste')}
                disabled={isProcessing}
              >
                <span aria-hidden="true">📝</span> <span>Paste Text</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && uploadProgress > 0 && (
            <div className="mb-4" role="status" aria-live="polite" aria-label="Upload progress">
              <div className="flex items-center gap-4">
                <span className="loading loading-spinner loading-lg text-primary" aria-hidden="true"></span>
                <div className="flex-1">
                  <progress 
                    className="progress progress-primary w-full" 
                    value={uploadProgress} 
                    max="100"
                    aria-label={`Upload progress: ${uploadProgress}%`}
                  ></progress>
                  <p className="text-sm text-center mt-2">
                    {uploadProgress < 100 ? '👻 Summoning spirits...' : '✨ Almost there...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div id="upload-content" role="tabpanel" aria-label={`${activeTab === 'file' ? 'File upload' : 'Text input'} panel`}>
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

          {/* Help text at bottom */}
          <div className="text-center mt-4">
            <p className="text-xs text-base-content/60">
              <span aria-hidden="true">💀</span> Supports TXT, PDF, and EPUB files up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Parsed Text Preview - DaisyUI Card */}
      {parsedText && !isProcessing && (
        <div className="card bg-success text-success-content shadow-xl" role="region" aria-label="Upload success summary">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h4 className="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Text Summoned Successfully
              </h4>
              <button
                onClick={() => {
                  setParsedText(null);
                  onTextParsed(null);
                }}
                className="btn btn-sm btn-circle btn-ghost"
                aria-label="Clear uploaded text"
              >
                ✕
              </button>
            </div>

            {/* Stats */}
            <div className="stats stats-horizontal shadow bg-success-content text-success mt-4" role="group" aria-label="Text statistics">
              <div className="stat place-items-center">
                <div className="stat-title">Words</div>
                <div className="stat-value text-2xl" aria-label={`${parsedText.metadata.wordCount.toLocaleString()} words`}>
                  {parsedText.metadata.wordCount.toLocaleString()}
                </div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-title">Characters</div>
                <div className="stat-value text-2xl" aria-label={`${parsedText.metadata.characterCount.toLocaleString()} characters`}>
                  {parsedText.metadata.characterCount.toLocaleString()}
                </div>
              </div>
              <div className="stat place-items-center">
                <div className="stat-title">Read Time</div>
                <div className="stat-value text-2xl" aria-label={`${parsedText.metadata.estimatedReadTime} minutes estimated read time`}>
                  {parsedText.metadata.estimatedReadTime} min
                </div>
              </div>
            </div>

            {/* Text Preview */}
            <div className="collapse collapse-arrow bg-success-content text-success mt-4">
              <input type="checkbox" /> 
              <div className="collapse-title font-medium">
                Preview Text
              </div>
              <div className="collapse-content"> 
                <div className="mockup-code">
                  <pre className="text-xs">
                    <code>{parsedText.content.slice(0, 500)}{parsedText.content.length > 500 && '...'}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TextUploader;
