import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * FileDropzone - Drag-and-drop file upload component with spooky styling
 * Accepts TXT, PDF, and EPUB files up to 10MB
 */
const FileDropzone = ({ onFileSelect, onError, disabled = false }) => {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          onError(new Error('👻 This tome is too heavy for mortal hands! (Max 10MB)'));
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          onError(new Error('🦇 The spirits cannot read this format! (Use TXT, PDF, or EPUB)'));
        } else {
          onError(new Error('⚰️ Something went wrong... The spirits are confused.'));
        }
        return;
      }

      // Handle accepted file
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, onError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/epub+zip': ['.epub']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled,
    noClick: false,
    noKeyboard: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-all duration-300 ease-in-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isDragActive && !isDragReject ? 'border-spooky-orange bg-spooky-orange/10 scale-105' : ''}
        ${isDragReject ? 'border-red-500 bg-red-900/20' : ''}
        ${!isDragActive && !disabled ? 'border-ink-lighter hover:border-spooky-orange hover:bg-spooky-orange/5' : ''}
      `}
      role="button"
      aria-label="Upload text file. Drag and drop or click to browse. Accepts TXT, PDF, or EPUB files up to 10MB."
      tabIndex={disabled ? -1 : 0}
    >
      <input {...getInputProps()} aria-label="File upload input" />
      
      {/* Spooky icon */}
      <div className="text-6xl mb-4 animate-pulse" aria-hidden="true">
        {isDragActive ? '👻' : '📖'}
      </div>

      {/* Instructions */}
      <div className="text-lg mb-2">
        {isDragActive ? (
          <p className="text-spooky-orange font-handwritten font-semibold">Release to summon the spirits...</p>
        ) : (
          <p className="text-ink font-book">
            <span className="text-spooky-orange font-handwritten font-semibold">Drop your text</span> or{' '}
            <span className="text-spooky-orange font-handwritten font-semibold">click to browse</span>
          </p>
        )}
      </div>

      {/* Supported formats */}
      <p className="text-sm text-gray-500">
        TXT, PDF, or EPUB • Max 10MB
      </p>

      {/* Decorative elements */}
      {!disabled && (
        <div className="absolute top-2 right-2 text-2xl opacity-50 animate-bounce" aria-hidden="true">
          🕯️
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
