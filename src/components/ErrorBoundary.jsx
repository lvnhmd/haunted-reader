/**
 * ErrorBoundary - Catches React errors and displays spooky error messages
 * Prevents the entire app from crashing when errors occur
 */

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('👻 Error caught by boundary:', error, errorInfo);
    this.state = {
      hasError: true,
      error,
      errorInfo
    };
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-parchment-100 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-parchment-50 border-4 border-ink p-8 parchment-texture">
            {/* Spooky error icon */}
            <div className="text-center mb-6">
              <div className="text-8xl mb-4">💀</div>
              <h1 className="text-3xl font-bold text-ink font-underdog mb-2">
                The Spirits Have Fled!
              </h1>
              <p className="text-lg text-ink-lighter font-book">
                Something went terribly wrong in the spirit realm...
              </p>
            </div>

            {/* Error details */}
            <div className="bg-parchment-100 border-2 border-ink-lighter p-4 mb-6">
              <h2 className="text-lg font-semibold text-ink font-handwritten mb-2">
                🕷️ What Happened:
              </h2>
              <p className="text-sm text-ink font-book mb-2">
                {this.state.error?.message || 'An unknown error occurred'}
              </p>
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="text-sm text-ink-lighter cursor-pointer font-book">
                    Technical Details (for developers)
                  </summary>
                  <pre className="text-xs text-ink-lighter mt-2 overflow-auto font-mono">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 px-6 py-3 bg-spooky-orange text-parchment-50 border-2 border-ink font-handwritten text-lg hover:bg-spooky-orange-dark transition-colors"
              >
                🔮 Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-6 py-3 bg-parchment-50 text-ink border-2 border-ink font-handwritten text-lg hover:bg-parchment-200 transition-colors"
              >
                🏠 Start Over
              </button>
            </div>

            {/* Help text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-ink-lighter font-book">
                If this keeps happening, try refreshing the page or clearing your browser cache.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
