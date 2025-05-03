import React from 'react';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`bg-destructive/10 text-destructive p-4 rounded-md ${className}`}>
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-destructive hover:text-destructive/90"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
