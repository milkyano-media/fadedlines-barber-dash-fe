import React, { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

/**
 * Reusable pagination component that handles page navigation logic
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current active page
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.siblingsCount - Number of sibling pages to show (default: 1)
 * @param {number} props.boundaryCount - Number of boundary pages to show (default: 1)
 * @param {Function} props.onPageChange - Callback for page change (page: number) => void
 * @param {string} props.className - Optional additional CSS class
 * @param {Object} props.meta - Optional metadata object for displaying items information
 * @param {number} props.meta.totalElements - Total number of items
 * @param {number} props.meta.size - Number of items per page
 * 
 * The component automatically handles:
 * - Previous/next buttons that are disabled when appropriate
 * - Displaying page numbers with appropriate ellipses for large page counts
 * - Showing "Showing X to Y of Z" text if meta is provided
 * - Direct page navigation with a "Go to" input field
 */
const PaginationComponent = ({
  currentPage = 1,
  totalPages = 1,
  siblingsCount = 1,
  boundaryCount = 1,
  onPageChange,
  className = '',
  meta
}) => {
  // Ensure currentPage is within valid range
  const page = Math.max(1, Math.min(currentPage, totalPages));
  
  // Jump to page input handling
  const [jumpToPage, setJumpToPage] = useState('');
  const [jumpInputError, setJumpInputError] = useState(false);

  // Handle jump to specific page
  const handleJumpToPage = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage, 10);
    
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setJumpInputError(false);
      onPageChange(pageNum);
      setJumpToPage('');
    } else {
      setJumpInputError(true);
    }
  };

  // Handle jump input change
  const handleJumpInputChange = (e) => {
    setJumpToPage(e.target.value);
    if (jumpInputError) setJumpInputError(false);
  };

  // Generate page numbers to display
  const range = (start, end) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(
    Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
    totalPages
  );

  const siblingsStart = Math.max(
    Math.min(
      page - siblingsCount,
      totalPages - boundaryCount - siblingsCount * 2 - 1
    ),
    boundaryCount + 2
  );

  const siblingsEnd = Math.min(
    Math.max(
      page + siblingsCount,
      boundaryCount + siblingsCount * 2 + 2
    ),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
  );

  // Determine when to show ellipses
  const showStartEllipsis = siblingsStart > boundaryCount + 2;
  const showEndEllipsis = siblingsEnd < totalPages - boundaryCount - 1;

  const itemsList = [
    ...startPages,
    ...(showStartEllipsis ? ['start-ellipsis'] : siblingsStart > boundaryCount + 1 ? [boundaryCount + 1] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(showEndEllipsis ? ['end-ellipsis'] : siblingsEnd < totalPages - boundaryCount ? [totalPages - boundaryCount] : []),
    ...endPages
  ];

  // Items per page info for meta display
  const calculateItemsRange = () => {
    if (!meta) return null;

    const startItem = (page - 1) * meta.size + 1;
    const endItem = Math.min(page * meta.size, meta.totalElements);
    const totalItems = meta.totalElements;

    return { startItem, endItem, totalItems };
  };

  const itemsRange = calculateItemsRange();

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {itemsRange && (
        <div className="text-sm text-muted-foreground hidden sm:block">
          Showing <span className="font-medium">{itemsRange.startItem}</span> to{" "}
          <span className="font-medium">{itemsRange.endItem}</span> of{" "}
          <span className="font-medium">{itemsRange.totalItems}</span> results
        </div>
      )}

      <div className="overflow-x-auto max-w-full">
        <Pagination className="mx-auto sm:mx-0 w-max">
          <PaginationContent className="items-center">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
              />
            </PaginationItem>

            {itemsList.map((item, index) => {
              if (item === 'start-ellipsis' || item === 'end-ellipsis') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={item}>
                  <PaginationLink
                    isActive={item === page}
                    onClick={() => onPageChange(item)}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              />
            </PaginationItem>

            {/* Jump to page input - hidden on mobile */}
            <PaginationItem className="hidden sm:block">
              <form onSubmit={handleJumpToPage} className="flex items-center">
                <input
                  type="text"
                  value={jumpToPage}
                  onChange={handleJumpInputChange}
                  placeholder="Go"
                  className={`w-12 h-8 px-2 text-sm border rounded ${jumpInputError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-transparent`}
                  aria-label="Go to page"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="h-8 px-1.5 ml-0.5"
                >
                  Go
                </Button>
              </form>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PaginationComponent;
