import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';
import CustomerList from './components/CustomerList';

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('visitCount');

  // Dummy data for customers - expanded dataset
  const allCustomers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
      visitCount: 12,
      lastVisit: '2025-05-01',
      totalSpend: 540,
      influenceScore: 85
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(555) 234-5678',
      visitCount: 8,
      lastVisit: '2025-04-28',
      totalSpend: 320,
      influenceScore: 65
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      phone: '(555) 345-6789',
      visitCount: 15,
      lastVisit: '2025-05-02',
      totalSpend: 750,
      influenceScore: 92
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      phone: '(555) 456-7890',
      visitCount: 6,
      lastVisit: '2025-04-25',
      totalSpend: 280,
      influenceScore: 45
    },
    {
      id: 5,
      name: 'Robert Brown',
      email: 'robert.b@example.com',
      phone: '(555) 567-8901',
      visitCount: 10,
      lastVisit: '2025-04-29',
      totalSpend: 450,
      influenceScore: 78
    },
    {
      id: 6,
      name: 'Emily Davis',
      email: 'emily.d@example.com',
      phone: '(555) 678-9012',
      visitCount: 4,
      lastVisit: '2025-04-20',
      totalSpend: 180,
      influenceScore: 30
    },
    {
      id: 7,
      name: 'David Wilson',
      email: 'david.w@example.com',
      phone: '(555) 789-0123',
      visitCount: 9,
      lastVisit: '2025-05-01',
      totalSpend: 420,
      influenceScore: 85
    }
  ];

  // Filter and sort customers
  const filteredCustomers = allCustomers
    .filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === 'visitCount') return b.visitCount - a.visitCount;
      if (sortBy === 'totalSpend') return b.totalSpend - a.totalSpend;
      if (sortBy === 'influenceScore') return b.influenceScore - a.influenceScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Top Customers (Dummy)</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Leaderboard</CardTitle>
          <CardDescription>
            Showing customers with the most visits to the barbershop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-[200px]"
            >
              <option value="visitCount">Sort by Visits</option>
              <option value="totalSpend">Sort by Spend</option>
              <option value="influenceScore">Sort by Influence Score</option>
              <option value="name">Sort by Name</option>
            </Select>
          </div>

          <CustomerList 
            customers={paginatedCustomers}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </CardContent>
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            Total customers: {filteredCustomers.length}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CustomersPage;
