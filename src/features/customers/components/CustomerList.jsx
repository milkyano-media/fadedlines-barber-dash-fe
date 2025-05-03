import React from 'react';
import { Link } from 'react-router';
import { Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';

const CustomerList = ({ customers, currentPage, totalPages, onPageChange, isLoading }) => {
  if (!customers || customers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No customers found matching your search criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-10 px-4 text-left align-middle font-medium">Rank</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-10 px-4 text-left align-middle font-medium">Contact</th>
              <th className="h-10 px-4 text-right align-middle font-medium">Visit Count</th>
              <th className="h-10 px-4 text-right align-middle font-medium">Total Spend</th>
              <th className="h-10 px-4 text-right align-middle font-medium">Influence Score</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {customers.map((customer, index) => (
              <tr 
                key={customer.id} 
                className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
              >
                <td className="p-4 align-middle font-medium">#{(currentPage - 1) * 10 + index + 1}</td>
              <td className="p-4 align-middle">
                <div className="flex flex-col">
                  <span className="font-medium">{customer.name}</span>
                  <span className="text-xs text-muted-foreground">
                    Last visit: {dayjs(customer.lastVisit).format('MMM DD, YYYY')}
                  </span>
                </div>
              </td>
              <td className="p-4 align-middle">
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </td>
              <td className="p-4 align-middle text-right">
                <span className="font-bold">{customer.visitCount}</span>
              </td>
              <td className="p-4 align-middle text-right">
                <span className="font-medium">${customer.totalSpend}</span>
              </td>
              <td className="p-4 align-middle text-right">
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.influenceScore >= 76 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : customer.influenceScore >= 51
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : customer.influenceScore >= 26
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                  }`}
                >
                  {customer.influenceScore}%
                </span>
              </td>
            </tr>
            ))}
            </tbody>
            </table>
            </div>

  {/* Pagination */}
  {totalPages > 1 && (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, customers.length * currentPage)} customers
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )}
</div>
  );
};

export default CustomerList;
