import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConversionSummaryPage from './ConversionSummaryPage';
import ConversionListPage from './ConversionListPage';

const ConversionsPage = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState('summary');

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <h1 className='text-3xl font-bold'>Conversions</h1>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className='w-full'
      >
        <TabsList className='grid w-full md:w-[400px] grid-cols-2'>
          <TabsTrigger value='summary'>Summary</TabsTrigger>
          <TabsTrigger value='list'>Conversion List</TabsTrigger>
        </TabsList>

        <TabsContent value='summary' className='mt-6'>
          {activeTab === 'summary' && <ConversionSummaryPage />}
        </TabsContent>

        <TabsContent value='list' className='mt-6'>
          {activeTab === 'list' && <ConversionListPage />}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversionsPage;
