import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * FileDropzone - DaisyUI Version
 * Drag-and-drop file upload component
 */
const FileDropzone = ({ onFileSelect, onError, disabled = false }) => {
  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
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

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, onError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
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
        card bg-base-200 shadow-xl cursor-pointer min-h-[400px] flex items-center justify-center
        border-2 border-dashed transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${isDragActive && !isDragReject ? 'border-warning bg-warning/10 scale-105' : 'border-base-300'}
        ${isDragReject ? 'border-error bg-error/10' : ''}
        ${!isDragActive && !disabled ? 'hover:border-warning hover:bg-warning/5' : ''}
      `}
      role="button"
      aria-label="Upload text file. Drag and drop or click to browse."
      tabIndex={disabled ? -1 : 0}
    >
      <input {...getInputProps()} aria-label="File upload input" />
      
      <div className="card-body items-center text-center">
        {/* Icon */}
        <div className="text-6xl mb-4 animate-pulse" aria-hidden="true">
          {isDragActive ? '👻' : '📖'}
        </div>

        {/* Instructions */}
        <div className="text-lg mb-2">
          {isDragActive ? (
            <p className="text-warning font-handwritten font-semibold">
              Release to summon the spirits...
            </p>
          ) : (
            <p>
              <span className="text-warning font-handwritten font-semibold">Drop your text</span> or{' '}
              <span className="text-warning font-handwritten font-semibold">click to browse</span>
            </p>
          )}
        </div>

        {/* Supported formats */}
        <div className="badge badge-ghost">
          TXT, PDF, or EPUB • Max 10MB
        </div>
      </div>
    </div>
  );
};

export default FileDropzone;
