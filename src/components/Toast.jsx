/**
 * Toast - Notification component for user feedback
 * Shows spooky messages for success, error, info, and warning states
 */

import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  const typeStyles = {
    success: {
      bg: 'bg-green-600',
      border: 'border-green-700',
      icon: '✅'
    },
    error: {
      bg: 'bg-red-600',
      border: 'border-red-700',
      icon: '💀'
    },
    warning: {
      bg: 'bg-spooky-orange',
      border: 'border-spooky-orange-dark',
      icon: '⚠️'
    },
    info: {
      bg: 'bg-ink-light',
      border: 'border-ink',
      icon: '👻'
    }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        ${style.bg} ${style.border}
        border-2 p-4 min-w-[300px] max-w-md
        parchment-texture
        transition-all duration-300
        ${isExiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{style.icon}</span>
        <div className="flex-1">
          <p className="text-parchment-50 font-book text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="text-parchment-50 hover:text-parchment-100 transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

/**
 * ToastContainer - Manages multiple toast notifications
 */
export const ToastContainer = ({ toasts = [], removeToast = () => {} }) => {
  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
