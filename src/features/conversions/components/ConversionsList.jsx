import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getInfluenceColor, getInfluenceLabel, getEventBadgeColor } from '../constants/conversionConstants';
import dayjs from 'dayjs';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const ConversionsList = ({ conversions }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <>
      <Card>
        <CardContent className='p-0'>
          <div className='rounded-md overflow-hidden'>
            <table className='w-full caption-bottom text-sm'>
              <thead className='[&_tr]:border-b'>
                <tr className='border-b transition-colors hover:bg-muted/50'>
                  <th className='h-10 px-4 text-left align-middle font-medium w-12'>ID</th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>Booking ID</th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>Customer</th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>Barber</th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>Campaign</th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>Ads Influence</th>
                  <th className='h-10 px-4 text-right align-middle font-medium'>Actions</th>
                </tr>
              </thead>
              <tbody className='[&_tr:last-child]:border-0'>
                {conversions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className='p-4 align-middle text-center'>
                      No conversions found matching your search criteria
                    </td>
                  </tr>
                ) : (
                  conversions.map((conversion) => (
                    <React.Fragment key={conversion.id}>
                      <tr className='border-b transition-colors hover:bg-muted/50 cursor-pointer'>
                        <td className='p-4 align-middle font-medium'>
                          {conversion.id}
                        </td>
                        <td className='p-4 align-middle font-medium text-primary'>
                          {conversion.bookingId}
                        </td>
                        <td className='p-4 align-middle'>{conversion.customerName}</td>
                        <td className='p-4 align-middle'>
                          {conversion.teamMemberName ? 
                            <span className="text-sm font-medium">
                              {conversion.teamMemberName}
                            </span> : 
                            <span className="text-muted-foreground">Not assigned</span>
                          }
                        </td>
                        <td className='p-4 align-middle'>
                          {conversion.campaignName && conversion.campaignName !== 'None' ? (
                            <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'>
                              {conversion.campaignName}
                            </span>
                          ) : (
                            <span className='text-muted-foreground'>None</span>
                          )}
                        </td>
                        <td className='p-4 align-middle'>
                          <div className='flex items-center gap-2'>
                            <div className='w-full max-w-24 bg-muted rounded-full h-2'>
                              <div
                                className='h-2 rounded-full bg-primary'
                                style={{
                                  width: `${conversion.adsInfluenceScore}%`
                                }}
                              ></div>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getInfluenceColor(
                                conversion.adsInfluenceScore
                              )}`}
                            >
                              {conversion.adsInfluenceScore}%
                            </span>
                          </div>
                        </td>
                        <td className='p-4 align-middle text-right'>
                          <button
                            onClick={() => toggleRow(conversion.id)}
                            className='text-green-500 hover:text-green-400 flex items-center justify-end'
                          >
                            {expandedRows[conversion.id] ? (
                              <>
                                Hide <ChevronUp className='w-4 h-4 ml-1 text-green-500' />
                              </>
                            ) : (
                              <>
                                View <ChevronDown className='w-4 h-4 ml-1 text-green-500' />
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedRows[conversion.id] && (
                        <tr>
                          <td colSpan={7} className='bg-muted/20 p-4'>
                            <div className='mb-3'>
                              <h4 className='font-medium text-sm'>
                                Customer Journey
                              </h4>
                              <p className='text-xs text-muted-foreground'>
                                Conversion Sequence:{' '}
                                <span
                                  data-tooltip-id="seq-tooltip"
                                  data-tooltip-content={conversion.conversionSequenceId}
                                >
                                  {conversion.conversionSequenceId}
                                </span>
                              </p>

                              <div className='text-xs font-medium mt-2'>
                                <span className='font-bold'>
                                  Ads Influence Score Calculation:
                                </span>{' '}
                                {conversion.details.score.scoreCalculation}
                              </div>
                            </div>

                            <div className='overflow-hidden relative'>
                              {/* Timeline connector */}
                              <div className='absolute left-[1.55rem] top-0 h-full w-0.5 bg-border'></div>

                              {/* Events */}
                              <ul className='space-y-3'>
                                {conversion.details.events.map(
                                  (event, index) => (
                                    <li key={index} className='relative pl-8'>
                                      {/* Timeline dot */}
                                      <div
                                        className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-background ${
                                          event.eventName === 'create_booking'
                                            ? 'bg-green-500'
                                            : 'bg-blue-500'
                                        }`}
                                      ></div>

                                      <div className='flex flex-col md:flex-row md:items-center text-sm'>
                                        <div className='font-medium min-w-32'>
                                          {event.date}
                                        </div>

                                        <div className='flex items-center flex-wrap gap-2 mt-1 md:mt-0 overflow-hidden'>
                                          <span className='px-2 py-1 text-xs rounded-md bg-muted flex-shrink-0 min-w-[80px] text-center'>
                                            {event.eventName === 'create_booking'
                                              ? '🛒\u00A0\u00A0Booking\u00A0\u00A0\u00A0'
                                              : '👁️\u00A0\u00A0Page Visit'}
                                          </span>

                                          <span 
                                            className='px-2 py-1 text-xs rounded-md bg-muted max-w-md truncate'
                                            data-tooltip-id="url-tooltip"
                                            data-tooltip-content={event.pageUrl}
                                          >
                                            {event.pageUrl}
                                          </span>

                                          {event.fbclid && event.eventName !== 'create_booking' && (
                                            <span 
                                              className='px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                              data-tooltip-id="fbclid-tooltip"
                                              data-tooltip-content={event.fbclid}
                                            >
                                              📱 Click ID
                                            </span>
                                          )}

                                          {event.utm && event.eventName !== 'create_booking' && (
                                            <span 
                                              className='px-2 py-1 text-xs rounded-md bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                              data-tooltip-id="utm-tooltip"
                                              data-tooltip-content={event.utm}
                                            >
                                              📊 UTM Parameters
                                            </span>
                                          )}

                                          {/* Show points for any traffic source with score > 0 */}
                                          {event.score > 0 && event.eventName !== 'create_booking' ? (
                                            <span
                                              className={`px-2 py-1 text-xs rounded-md ${
                                                event.score === 1
                                                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-800 font-medium'
                                                  : 'bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800'
                                              }`}
                                            >
                                              +{event.score} pts
                                            </span>
                                          ) : (
                                            event.eventName !== 'create_booking' && (
                                              <span className='px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'>
                                                {event.trafficSource}
                                              </span>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div className='mt-4 pt-3 border-t'>
                              <div className='flex flex-col sm:flex-row sm:justify-between'>
                                <div>
                                  <h5 className='text-sm font-medium'>
                                    Service Details
                                  </h5>
                                  <p className='text-sm'>
                                    {conversion.serviceName} | $
                                    {conversion.amount}
                                  </p>
                                </div>
                                <div className='mt-2 sm:mt-0'>
                                  <h5 className='text-sm font-medium'>
                                    Barber
                                  </h5>
                                  <p className='text-sm'>
                                    {conversion.teamMemberName || 'Not assigned'}
                                  </p>
                                </div>
                                <div className='mt-2 sm:mt-0'>
                                  <h5 className='text-sm font-medium'>
                                    Ads Influence
                                  </h5>
                                  <p
                                    className={`text-sm font-medium ${getInfluenceColor(
                                      conversion.adsInfluenceScore
                                    )}`}
                                  >
                                    {getInfluenceLabel(
                                      conversion.adsInfluenceScore
                                    )}{' '}
                                    ({conversion.adsInfluenceScore}%)
                                  </p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Global tooltips */}
      <Tooltip id="url-tooltip" style={{ maxWidth: '500px', textAlign: 'left', overflowWrap: 'break-word', wordBreak: 'break-all' }} />
      <Tooltip id="fbclid-tooltip" style={{ maxWidth: '500px', textAlign: 'left', overflowWrap: 'break-word', wordBreak: 'break-all' }} />
      <Tooltip id="utm-tooltip" style={{ maxWidth: '500px', textAlign: 'left', overflowWrap: 'break-word', wordBreak: 'break-all' }} />
      <Tooltip id="seq-tooltip" style={{ maxWidth: '500px', textAlign: 'left', overflowWrap: 'break-word', wordBreak: 'break-all' }} />
    </>
  );
};

export default ConversionsList;
