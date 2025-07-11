import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, DollarSign, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import dayjs from 'dayjs';

const CampaignList = ({ campaigns }) => {
  const [expandedRows, setExpandedRows] = useState({});

  // Toggle accordion expansion for a row
  const toggleRow = (campaignName) => {
    setExpandedRows((prev) => ({
      ...prev,
      [campaignName]: !prev[campaignName]
    }));
  };

  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No campaigns found.
      </div>
    );
  }

  return (
    <Card>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <div className='inline-block min-w-full align-middle'>
            <div className='overflow-hidden rounded-md'>
              <table className='w-full min-w-[640px] caption-bottom text-sm'>
            <thead className='[&_tr]:border-b'>
              <tr className='border-b transition-colors hover:bg-muted/50'>
                <th className='h-10 px-4 text-left align-middle font-medium'>
                  Campaign Name
                </th>
                <th className='h-10 px-4 text-center align-middle font-medium'>
                  Conversions
                </th>
                <th className='h-10 px-4 text-center align-middle font-medium'>
                  Revenue
                </th>
                <th className='h-10 px-4 text-center align-middle font-medium'>
                  Avg. Value
                </th>
                <th className='h-10 px-4 text-center align-middle font-medium w-24'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='[&_tr:last-child]:border-0'>
              {campaigns.map((campaign) => (
                <React.Fragment key={campaign.campaignName}>
                  <tr className='border-b transition-colors hover:bg-muted/50 cursor-pointer'>
                    <td className='p-4 align-middle font-medium'>
                      <div className='flex items-center gap-2'>
                        <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'>
                          Campaign
                        </span>
                        <span className='font-semibold'>{campaign.campaignName}</span>
                      </div>
                    </td>
                    <td className='p-4 align-middle text-center'>
                      <span className='font-bold text-lg'>{campaign.totalConversions}</span>
                    </td>
                    <td className='p-4 align-middle text-center'>
                      <span className='font-bold text-lg'>${campaign.totalRevenue.toFixed(2)}</span>
                    </td>
                    <td className='p-4 align-middle text-center'>
                      <span className='font-medium'>${campaign.avgConversionValue.toFixed(2)}</span>
                    </td>
                    <td className='p-4 align-middle text-center'>
                      <button
                        onClick={() => toggleRow(campaign.campaignName)}
                        className='text-green-500 hover:text-green-400 flex items-center justify-center mx-auto'
                      >
                        {expandedRows[campaign.campaignName] ? (
                          <>
                            Hide{' '}
                            <ChevronUp className='w-4 h-4 ml-1 text-green-500' />
                          </>
                        ) : (
                          <>
                            View{' '}
                            <ChevronDown className='w-4 h-4 ml-1 text-green-500' />
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[campaign.campaignName] && (
                    <tr>
                      <td colSpan={5} className='bg-muted/20 p-4'>
                        <div className='mb-3'>
                          <h4 className='font-medium text-sm mb-2'>
                            Latest Conversions ({campaign.latestConversions.length})
                          </h4>
                          
                          {campaign.latestConversions.length > 0 ? (
                            <div className='space-y-2'>
                              {campaign.latestConversions.map((conversion) => (
                                <div key={conversion.id} className='flex items-center justify-between p-3 bg-background rounded-md border'>
                                  <div className='flex-1'>
                                    <div className='flex items-center gap-4'>
                                      <div>
                                        <p className='font-medium text-sm'>{conversion.customerName}</p>
                                        <p className='text-xs text-muted-foreground'>
                                          {dayjs(conversion.bookingDate).format('MMM DD, YYYY HH:mm')}
                                        </p>
                                      </div>
                                      <div>
                                        <p className='text-sm'>{conversion.serviceName}</p>
                                        <p className='text-xs text-muted-foreground'>
                                          Barber: {conversion.teamMemberName}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='text-right'>
                                    <p className='font-bold'>${Number(conversion.amount).toFixed(2)}</p>
                                    <p className='text-xs text-muted-foreground'>
                                      ID: {conversion.bookingId}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className='text-sm text-muted-foreground'>No conversions found</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignList;
