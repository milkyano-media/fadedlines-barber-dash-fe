import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  getInfluenceColor,
  getInfluenceLabel,
  getEventBadgeColor,
  getConversionSource,
  getSourceTypeLabel,
  getSquareBookingUrl,
  extractCampaignName,
  SOURCE_TYPES
} from '../constants/conversionConstants';
import { Globe, Database, ExternalLink, Copy, Check, ClipboardCopy } from 'lucide-react';
import dayjs from 'dayjs';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import Toast from '@/components/common/Toast';

// Client-side source filtering function
const filterBySource = (conversions, sourceFilter) => {
  if (!sourceFilter || sourceFilter === 'all') return conversions;
  
  return conversions.filter(conversion => {
    const source = conversion.source || getConversionSource(conversion);
    return source === sourceFilter;
  });
};

const ConversionsList = ({ conversions, sourceFilter }) => {
  // Apply client-side filtering
  const filteredConversions = filterBySource(conversions, sourceFilter);
  const [expandedRows, setExpandedRows] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Debug: Log conversions data structure to console
  useEffect(() => {
    if (conversions && conversions.length > 0) {
      console.log('Conversion data example:', conversions[0]);
      console.log('Campaign extracted:', extractCampaignName(conversions[0]));
      
      // Analyze all conversions to check campaign info
      conversions.forEach(conversion => {
        // First page_visit event with utm info
        const pageVisitEvent = conversion.details?.events?.find(
          event => event.eventName === 'page_visit'
        );
        
        if (pageVisitEvent) {
          console.log(`Conversion ${conversion.id}:`, {
            campaignNameField: conversion.campaignName,
            extractedCampaign: extractCampaignName(conversion),
            utm: pageVisitEvent.utm,
            pageUrl: pageVisitEvent.pageUrl
          });
        }
      });
    }
  }, [conversions]);

  // Function to shorten the booking ID for display purposes
  const shortenBookingId = (bookingId) => {
    if (!bookingId) return '';
    // Check if it's already a shortened version (with 'booking-' prefix)
    if (bookingId.startsWith('booking-')) return bookingId;
    
    // For actual Square booking IDs, show only first 8 characters
    return bookingId.length > 8 ? `${bookingId.substring(0, 8)}...` : bookingId;
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Function to handle copying booking ID to clipboard
  const copyToClipboard = (text, e) => {
    e.stopPropagation(); // Prevent row expansion
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedId(text);
        setToastMessage(`Booking ID copied: ${shortenBookingId(text)}`);
        setShowToast(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <>
      <Card>
        <CardContent className='p-0'>
          <div className='rounded-md overflow-hidden'>
            <table className='w-full caption-bottom text-sm'>
              <thead className='[&_tr]:border-b'>
                <tr className='border-b transition-colors hover:bg-muted/50'>
                  <th className='h-10 px-4 text-left align-middle font-medium w-12'>
                    ID
                  </th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>
                    Booking ID
                  </th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>
                    Customer
                  </th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>
                    Barber
                  </th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>
                    Campaign
                  </th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>
                    Source
                  </th>
                  <th className='h-10 px-4 text-left align-middle font-medium'>
                    Ads Influence
                  </th>
                  <th className='h-10 px-4 text-center align-middle font-medium w-24'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='[&_tr:last-child]:border-0'>
                {conversions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className='p-4 align-middle text-center'>
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
                        <td className='p-4 align-middle font-medium'>
                          <div className="flex items-center gap-2">
                            {getSquareBookingUrl(conversion.bookingId) ? (
                              <a
                                href={getSquareBookingUrl(conversion.bookingId)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 hover:underline flex items-center"
                                onClick={(e) => e.stopPropagation()} // Prevent row toggle when clicking link
                                data-tooltip-id="booking-tooltip"
                                data-tooltip-content={`${conversion.bookingId} - Click to open booking in Square`}
                              >
                                {shortenBookingId(conversion.bookingId)}
                                <ExternalLink className="ml-1 h-3 w-3" />
                              </a>
                            ) : (
                              <span className="text-primary">{shortenBookingId(conversion.bookingId)}</span>
                            )}
                            {conversion.bookingId && !conversion.bookingId.startsWith('booking-') && (
                              <button
                                onClick={(e) => copyToClipboard(conversion.bookingId, e)}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted"
                                data-tooltip-id="copy-tooltip"
                                data-tooltip-content="Copy booking ID"
                              >
                                {copiedId === conversion.bookingId ? (
                                  <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className='p-4 align-middle'>
                          {conversion.customerName}
                        </td>
                        <td className='p-4 align-middle'>
                          {conversion.teamMemberName ? (
                            <span className='text-sm font-medium'>
                              {conversion.teamMemberName}
                            </span>
                          ) : (
                            <span className='text-muted-foreground'>
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className='p-4 align-middle'>
                          {/* Use extractCampaignName to get campaign from conversion or UTM params */}
                          {(() => {
                            const campaignName = extractCampaignName(conversion);
                            return campaignName ? (
                              <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'>
                                {campaignName}
                              </span>
                            ) : (
                              <span className='text-muted-foreground'>None</span>
                            );
                          })()}
                        </td>
                        <td className='p-4 align-middle'>
                          <div className='flex items-center gap-2'>
                            {conversion.source === SOURCE_TYPES.WEBSITE ? (
                              <>
                                <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs dark:bg-blue-900/30 dark:text-blue-400'>
                                  Website
                                </span>
                              </>
                            ) : (
                              <>
                                <span className='bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs dark:bg-purple-900/30 dark:text-purple-400'>
                                  Non-web
                                </span>
                              </>
                            )}
                          </div>
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
                        <td className='p-4 align-middle text-center'>
                          <button
                            onClick={() => toggleRow(conversion.id)}
                            className='text-green-500 hover:text-green-400 flex items-center justify-center mx-auto'
                          >
                            {expandedRows[conversion.id] ? (
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
                      {expandedRows[conversion.id] && (
                        <tr>
                          <td colSpan={8} className='bg-muted/20 p-4'>
                            <div className='mb-3'>
                              <h4 className='font-medium text-sm'>
                                Customer Journey
                              </h4>
                              <p className='text-xs text-muted-foreground'>
                                Conversion Sequence:{' '}
                                <span
                                  data-tooltip-id='seq-tooltip'
                                  data-tooltip-content={
                                    conversion.conversionSequenceId
                                  }
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
                                            {event.eventName ===
                                            'create_booking'
                                              ? '🛒\u00A0\u00A0Booking\u00A0\u00A0\u00A0'
                                              : '👁️\u00A0\u00A0Page Visit'}
                                          </span>

                                          <span
                                            className='px-2 py-1 text-xs rounded-md bg-muted max-w-md truncate'
                                            data-tooltip-id='url-tooltip'
                                            data-tooltip-content={event.pageUrl}
                                          >
                                            {event.pageUrl}
                                          </span>

                                          {event.fbclid &&
                                            event.eventName !==
                                              'create_booking' && (
                                              <span
                                                className='px-2 py-1 text-xs rounded-md bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                                                data-tooltip-id='fbclid-tooltip'
                                                data-tooltip-content={
                                                  event.fbclid
                                                }
                                              >
                                                📱 Click ID
                                              </span>
                                            )}

                                          {event.utm &&
                                            event.eventName !==
                                              'create_booking' && (
                                              <span
                                                className='px-2 py-1 text-xs rounded-md bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                data-tooltip-id='utm-tooltip'
                                                data-tooltip-content={event.utm}
                                              >
                                                📊 UTM Parameters
                                              </span>
                                            )}

                                          {/* Show points for any traffic source with score > 0 */}
                                          {event.score > 0 &&
                                          event.eventName !==
                                            'create_booking' ? (
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
                                            event.eventName !==
                                              'create_booking' && (
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
                                  {getSquareBookingUrl(conversion.bookingId) && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <a
                                        href={getSquareBookingUrl(conversion.bookingId)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:text-primary/80 hover:underline flex items-center w-fit"
                                      >
                                        View booking in Square
                                        <ExternalLink className="ml-1 h-3 w-3" />
                                      </a>
                                      <button
                                        onClick={(e) => copyToClipboard(conversion.bookingId, e)}
                                        className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-muted"
                                        data-tooltip-id="copy-tooltip"
                                        data-tooltip-content="Copy booking ID"
                                      >
                                        {copiedId === conversion.bookingId ? (
                                          <Check className="h-3 w-3 text-green-500" />
                                        ) : (
                                          <Copy className="h-3 w-3" />
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className='mt-2 sm:mt-0'>
                                  <h5 className='text-sm font-medium'>
                                    Barber
                                  </h5>
                                  <p className='text-sm'>
                                    {conversion.teamMemberName ||
                                      'Not assigned'}
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
                                <div className='mt-2 sm:mt-0'>
                                  <h5 className='text-sm font-medium'>
                                    Campaign
                                  </h5>
                                  {(() => {
                                    const campaignName = extractCampaignName(conversion);
                                    return campaignName ? (
                                      <p className='text-sm'>{campaignName}</p>
                                    ) : (
                                      <p className='text-sm text-muted-foreground'>None</p>
                                    );
                                  })()}
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
      <Tooltip
        id='url-tooltip'
        style={{
          maxWidth: '500px',
          textAlign: 'left',
          overflowWrap: 'break-word',
          wordBreak: 'break-all'
        }}
      />
      <Tooltip
        id='fbclid-tooltip'
        style={{
          maxWidth: '500px',
          textAlign: 'left',
          overflowWrap: 'break-word',
          wordBreak: 'break-all'
        }}
      />
      <Tooltip
        id='utm-tooltip'
        style={{
          maxWidth: '500px',
          textAlign: 'left',
          overflowWrap: 'break-word',
          wordBreak: 'break-all'
        }}
      />
      <Tooltip
        id='seq-tooltip'
        style={{
          maxWidth: '500px',
          textAlign: 'left',
          overflowWrap: 'break-word',
          wordBreak: 'break-all'
        }}
      />
      <Tooltip
        id='booking-tooltip'
        style={{
          maxWidth: '300px',
          textAlign: 'center'
        }}
      />
      <Tooltip
        id='copy-tooltip'
        style={{
          maxWidth: '200px',
          textAlign: 'center'
        }}
      />
      
      {/* Toast notification for copy success */}
      <Toast
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default ConversionsList;