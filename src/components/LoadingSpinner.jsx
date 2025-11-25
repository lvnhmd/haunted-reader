/**
 * LoadingSpinner - Spooky loading animation
 * Shows while async operations are in progress
 */

const LoadingSpinner = ({ message = 'Summoning spirits...', size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      {/* Spinning ghost animation */}
      <div className={`${sizeClasses[size]} relative`} aria-hidden="true">
        <div className="absolute inset-0 animate-spin">
          <div className="text-6xl">👻</div>
        </div>
      </div>

      {/* Loading message */}
      {message && (
        <p className={`text-ink font-handwritten ${textSizeClasses[size]} animate-pulse`}>
          {message}
        </p>
      )}
      
      {/* Screen reader only text */}
      <span className="sr-only">{message || 'Loading'} Please wait.</span>

      {/* Floating dots */}
      <div className="flex gap-2" aria-hidden="true">
        <div className="w-2 h-2 bg-spooky-orange animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-spooky-orange animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-spooky-orange animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-parchment-100/90 flex items-center justify-center z-50">
        <div className="bg-parchment-50 border-4 border-ink p-8 parchment-texture">
          {spinner}
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
      <div className="animate-spin text-2xl" aria-hidden="true">👻</div>
      {message && (
        <span className="text-sm text-ink-lighter font-book">{message}</span>
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
          className="h-4 bg-parchment-200 animate-pulse"
          style={{ width: `${Math.random() * 30 + 70}%` }}
          aria-hidden="true"
        ></div>
      ))}
      <span className="sr-only">Loading content, please wait.</span>
    </div>
  );
};

export default LoadingSpinner;
