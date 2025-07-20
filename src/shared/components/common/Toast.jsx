import React, { useEffect } from 'react';
import { Check, AlertCircle, AlertTriangle, X } from 'lucide-react';

/**
 * Enhanced toast notification component
 * @param {object} props - Component props
 * @param {string} props.message - Toast message
 * @param {boolean} props.isVisible - Whether the toast is visible
 * @param {function} props.onClose - Callback to hide the toast
 * @param {string} props.type - Toast type: 'success', 'error', 'warning', 'info'
 * @param {number} props.duration - Auto-hide duration in milliseconds (default: 4000)
 */
const Toast = ({ message, isVisible, onClose, type = 'success', duration = 4000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/30',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-400',
          icon: <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/30',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-400',
          icon: <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/30',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-400',
          icon: <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
        };
      case 'success':
      default:
        return {
          bg: 'bg-green-50 dark:bg-green-900/30',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-400',
          icon: <Check className="h-4 w-4 mr-2 text-green-500" />
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`${styles.bg} border ${styles.border} ${styles.text} rounded-lg shadow-lg p-3 flex items-center justify-between min-w-[300px] max-w-[500px]`}>
        <div className="flex items-center">
          {styles.icon}
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default Toast;