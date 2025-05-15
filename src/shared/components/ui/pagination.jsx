import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/twUtils';
import { Button } from './button';

// Main Pagination container
const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("flex justify-center", className)}
    {...props}
  />
);

// List of pagination items
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));

// Individual pagination item
const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));

// Pagination link for numbers and navigation
const PaginationLink = ({
  className,
  isActive,
  children,
  disabled,
  ...props
}) => (
  <Button
    aria-current={isActive ? "page" : undefined}
    variant={isActive ? "outline" : "ghost"}
    size="sm"
    disabled={disabled}
    className={cn(
      "h-9 w-9",
      {
        "pointer-events-none": disabled,
        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-primary": isActive
      },
      className
    )}
    {...props}
  >
    {children}
  </Button>
);

// Previous page button
const PaginationPrevious = ({
  className,
  disabled,
  ...props
}) => (
  <Button
    aria-label="Go to previous page"
    variant="outline"
    size="sm"
    disabled={disabled}
    className={cn("gap-1 px-2", {
      "pointer-events-none opacity-50": disabled
    }, className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only md:not-sr-only md:inline-flex">Previous</span>
  </Button>
);

// Next page button
const PaginationNext = ({
  className,
  disabled,
  ...props
}) => (
  <Button
    aria-label="Go to next page"
    variant="outline"
    size="sm"
    disabled={disabled}
    className={cn("gap-1 px-2", {
      "pointer-events-none opacity-50": disabled
    }, className)}
    {...props}
  >
    <span className="sr-only md:not-sr-only md:inline-flex">Next</span>
    <ChevronRight className="h-4 w-4" />
  </Button>
);

// Ellipsis for skipped page numbers
const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <div
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </div>
);

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
