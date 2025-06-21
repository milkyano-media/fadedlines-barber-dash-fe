import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Popover = ({ children, content, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 256; // w-64 = 16rem = 256px
      const popoverHeight = 100; // Approximate height
      
      let top = rect.bottom + 8;
      let left = rect.left + rect.width / 2;
      
      // Adjust if it would go off screen
      if (left + popoverWidth / 2 > window.innerWidth) {
        left = window.innerWidth - popoverWidth - 8;
      } else if (left - popoverWidth / 2 < 0) {
        left = 8;
      } else {
        left = left - popoverWidth / 2;
      }
      
      if (top + popoverHeight > window.innerHeight) {
        top = rect.top - popoverHeight - 8;
      }
      
      setPosition({ top, left });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <>
      <span
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer' }}
      >
        {children}
      </span>
      {isOpen && createPortal(
        <div
          ref={popoverRef}
          className={`absolute z-50 w-64 p-3 text-sm bg-popover text-popover-foreground rounded-md shadow-md border border-border ${className}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
        >
          <div className="relative">
            {content}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};