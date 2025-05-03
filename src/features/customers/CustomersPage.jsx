import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import CustomerList from './components/CustomerList';

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data for customers
  const customers = [
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
    }
  ];

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Top Customers</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Leaderboard</CardTitle>
          <CardDescription>
            Showing customers with the most visits to the barbershop
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <CustomerList customers={filteredCustomers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersPage;
