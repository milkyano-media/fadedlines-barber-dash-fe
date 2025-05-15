import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

/**
 * Simple toast notification component
 * @param {object} props - Component props
 * @param {string} props.message - Toast message
 * @param {boolean} props.isVisible - Whether the toast is visible
 * @param {function} props.onClose - Callback to hide the toast
 */
const Toast = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      // Automatically hide the toast after 2 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-400 rounded-lg shadow-lg p-3 flex items-center">
        <Check className="h-4 w-4 mr-2 text-green-500" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;