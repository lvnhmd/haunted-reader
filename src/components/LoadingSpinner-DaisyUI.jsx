/**
 * LoadingSpinner - DaisyUI redesigned loading animation
 * Shows while async operations are in progress
 */

const LoadingSpinner = ({ message = 'Summoning spirits...', size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      {/* DaisyUI Loading Spinner */}
      <span className={`loading loading-infinity ${sizeClasses[size]} text-primary`}></span>

      {/* Loading message */}
      {message && (
        <p className={`text-base-content font-handwritten ${textSizeClasses[size]} animate-pulse`}>
          {message}
        </p>
      )}
      
      {/* Screen reader only text */}
      <span className="sr-only">{message || 'Loading'} Please wait.</span>

      {/* Floating dots */}
      <div className="flex gap-2" aria-hidden="true">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-base-100/90 flex items-center justify-center z-50">
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            {spinner}
          </div>
        </div>
      </div>
    );
  }

  return spinner;
};

/**
 * InlineLoader - Smaller inline loading indicator
 */
export const InlineLoader = ({ message }) => {
  return (
    <div className="flex items-center gap-2" role="status" aria-live="polite">
      <span className="loading loading-spinner loading-sm text-primary" aria-hidden="true"></span>
      {message && (
        <span className="text-sm text-base-content/70">{message}</span>
      )}
      <span className="sr-only">{message || 'Loading'}</span>
    </div>
  );
};

/**
 * SkeletonLoader - Placeholder for content loading
 */
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`} role="status" aria-live="polite" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4"
          style={{ width: `${Math.random() * 30 + 70}%` }}
          aria-hidden="true"
        ></div>
      ))}
      <span className="sr-only">Loading content, please wait.</span>
    </div>
  );
};

export default LoadingSpinner;
