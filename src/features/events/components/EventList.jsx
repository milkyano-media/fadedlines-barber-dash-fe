// src/features/events/components/EventList.jsx
import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Activity,
  Trash2,
  Link,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  EVENT_TYPE_COLORS,
  getEventTypeLabel,
  getTrafficSourceLabel
} from '../constants/eventConstants';

// Initialize dayjs plugins
dayjs.extend(relativeTime);

/**
 * List component for displaying events with accordion functionality
 */
const EventList = ({ 
  events, 
  onDeleteEvent, 
  selectedEvents = new Set(), 
  onEventSelect, 
  onSelectAll, 
  isSelectAll = false 
}) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [copiedIds, setCopiedIds] = useState({});

  // Toggle accordion expansion for a row
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return dayjs(dateString).format('YYYY-MM-DD HH:mm:ss');
    } catch {
      return dateString;
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    try {
      return dayjs(dateString).fromNow();
    } catch {
      return '';
    }
  };

  // Determine if event came from website or non-web
  const getEventSource = (event) => {
    // Check for non-web booking flag
    if (
      event.properties?.non_web === true ||
      event.properties?.booking?.source === 'non-web'
    ) {
      return 'non-web';
    }

    // Default to website
    return 'website';
  };

  // Handle event deletion
  const handleDelete = (event, e) => {
    e.stopPropagation(); // Prevent row expansion
    if (window.confirm(`Are you sure you want to delete this event?`)) {
      onDeleteEvent?.(event.id);
    }
  };

  // Handle copy sequence ID
  const handleCopySequenceId = async (sequenceId, e) => {
    e.stopPropagation(); // Prevent row expansion
    try {
      await navigator.clipboard.writeText(sequenceId);
      setCopiedIds(prev => ({ ...prev, [sequenceId]: true }));
      setTimeout(() => {
        setCopiedIds(prev => ({ ...prev, [sequenceId]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (eventId, e) => {
    e.stopPropagation(); // Prevent row expansion
    const isSelected = e.target.checked;
    onEventSelect?.(eventId, isSelected);
  };

  // Handle select all checkbox
  const handleSelectAllChange = (e) => {
    e.stopPropagation();
    onSelectAll?.(e.target.checked);
  };

  if (!events || events.length === 0) {
    return (
      <div className='text-center py-8 text-muted-foreground'>
        No events found matching your criteria.
      </div>
    );
  }

  return (
    <Card>
      <CardContent className='p-0'>
        <div className='rounded-md overflow-hidden'>
          <table className='w-full caption-bottom text-sm'>
            <thead className='[&_tr]:border-b bg-muted/50'>
              <tr className='border-b transition-colors'>
                <th className='h-10 px-4 text-left align-middle font-medium'>
                  <input
                    type="checkbox"
                    checked={isSelectAll}
                    onChange={handleSelectAllChange}
                    className="rounded"
                  />
                </th>
                <th className='h-10 px-4 text-left align-middle font-medium'>
                  ID
                </th>
                <th className='h-10 px-4 text-left align-middle font-medium'>
                  Event Type
                </th>
                <th className='h-10 px-4 text-left align-middle font-medium'>
                  Source
                </th>
                <th className='h-10 px-4 text-left align-middle font-medium'>
                  Created At
                </th>
                <th className='h-10 px-4 text-left align-middle font-medium'>
                  Seq. ID
                </th>
                <th className='h-10 px-4 text-right align-middle font-medium'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='[&_tr:last-child]:border-0'>
              {events.map((event) => (
                <React.Fragment key={event.id}>
                  <tr
                    className={`border-b transition-colors hover:bg-muted/50 cursor-pointer ${
                      expandedRows[event.id] ? 'bg-muted/20' : ''
                    }`}
                    onClick={() => toggleRow(event.id)}
                  >
                    {/* Checkbox Column */}
                    <td className='p-4 align-middle'>
                      <input
                        type="checkbox"
                        checked={selectedEvents.has(event.id)}
                        onChange={(e) => handleCheckboxChange(event.id, e)}
                        className="rounded"
                      />
                    </td>

                    {/* ID Column */}
                    <td className='p-4 align-middle font-mono text-xs'>
                      {event.id}
                    </td>

                    {/* Event Type Column */}
                    <td className='p-4 align-middle'>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`p-1.5 rounded-full ${
                            EVENT_TYPE_COLORS[event.eventName] || 'bg-gray-100'
                          }`}
                        >
                          {event.eventName === 'page_visit' ? (
                            <Activity className='h-3 w-3' />
                          ) : (
                            <Calendar className='h-3 w-3' />
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            EVENT_TYPE_COLORS[event.eventName] || 'bg-gray-100'
                          }`}
                        >
                          {getEventTypeLabel(event.eventName)}
                        </span>
                      </div>
                    </td>

                    {/* Source Column */}
                    <td className='p-4 align-middle'>
                      <div className='flex items-center gap-2'>
                        {getEventSource(event) === 'website' ? (
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

                    {/* Created At Column */}
                    <td className='p-4 align-middle'>
                      <div className='flex flex-col'>
                        <span className='text-xs'>
                          {formatDate(event.createdAt)}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {formatRelativeTime(event.createdAt)}
                        </span>
                      </div>
                    </td>

                    {/* Sequence ID Column */}
                    <td className='p-4 align-middle'>
                      {event.conversionSequenceId ? (
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-1'>
                            <span
                              className='font-mono text-xs truncate max-w-24'
                              title={event.conversionSequenceId}
                            >
                              {event.conversionSequenceId.substring(0, 8)}...
                            </span>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='p-1 h-auto'
                              onClick={(e) => handleCopySequenceId(event.conversionSequenceId, e)}
                              title='Copy full sequence ID'
                            >
                              {copiedIds[event.conversionSequenceId] ? (
                                <Check className='h-3 w-3 text-green-500' />
                              ) : (
                                <Copy className='h-3 w-3' />
                              )}
                            </Button>
                          </div>
                          <span className='text-xs text-indigo-500 dark:text-indigo-400'>
                            Has Sequence
                          </span>
                        </div>
                      ) : (
                        <span className='text-xs text-muted-foreground'>
                          None
                        </span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className='p-4 align-middle text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='p-1 h-auto'
                          onClick={(e) => handleDelete(event, e)}
                        >
                          <Trash2 className='h-4 w-4 text-red-500' />
                        </Button>

                        {expandedRows[event.id] ? (
                          <ChevronUp className='h-5 w-5 text-muted-foreground' />
                        ) : (
                          <ChevronDown className='h-5 w-5 text-muted-foreground' />
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded content */}
                  {expandedRows[event.id] && (
                    <tr>
                      <td colSpan={7} className='p-0'>
                        <div className='p-4 bg-muted/10 border-b'>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Left column */}
                            <div className='space-y-3'>
                              <div>
                                <h4 className='text-sm font-medium mb-1'>
                                  Session & Visitor
                                </h4>
                                <div className='grid grid-cols-2 gap-2'>
                                  <div className='text-xs'>
                                    <span className='text-muted-foreground'>
                                      Session:
                                    </span>
                                    <div className='font-mono text-xs break-all'>
                                      {event.sessionId}
                                    </div>
                                  </div>
                                  <div className='text-xs'>
                                    <span className='text-muted-foreground'>
                                      Visitor:
                                    </span>
                                    <div className='font-mono text-xs break-all'>
                                      {event.uniqueVisitorId}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {event.conversionSequenceId && (
                                <div>
                                  <h4 className='text-sm font-medium mb-1'>
                                    Conversion Sequence
                                  </h4>
                                  <div className='font-mono text-xs break-all'>
                                    {event.conversionSequenceId}
                                  </div>
                                </div>
                              )}

                              {/* Traffic source */}
                              {event.properties?.trafficSource && (
                                <div>
                                  <h4 className='text-sm font-medium mb-1'>
                                    Traffic Source
                                  </h4>
                                  <span className='px-2 py-1 text-xs rounded-md bg-muted'>
                                    {getTrafficSourceLabel(
                                      event.properties.trafficSource
                                    )}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Right column */}
                            <div className='space-y-3'>
                              {/* Page information */}
                              {(event.properties?.pageUrl ||
                                event.properties?.page_url) && (
                                <div>
                                  <h4 className='text-sm font-medium mb-1'>
                                    Page Information
                                  </h4>
                                  <div className='flex items-center gap-1 text-xs break-all'>
                                    <Link className='h-3 w-3 flex-shrink-0' />
                                    <a
                                      href={
                                        event.properties?.pageUrl ||
                                        event.properties?.page_url
                                      }
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='text-primary hover:underline'
                                    >
                                      {event.properties?.pageUrl ||
                                        event.properties?.page_url}
                                      <ExternalLink className='h-3 w-3 inline ml-1' />
                                    </a>
                                  </div>
                                </div>
                              )}

                              {/* UTM Parameters */}
                              {(event.properties?.utm_source ||
                                event.properties?.attribution?.utm_source) && (
                                <div>
                                  <h4 className='text-sm font-medium mb-1'>
                                    UTM Parameters
                                  </h4>
                                  <div className='grid grid-cols-2 gap-2 text-xs'>
                                    <div>
                                      <span className='text-muted-foreground'>
                                        Source:
                                      </span>
                                      <div>
                                        {event.properties?.utm_source ||
                                          event.properties?.attribution
                                            ?.utm_source ||
                                          'None'}
                                      </div>
                                    </div>
                                    <div>
                                      <span className='text-muted-foreground'>
                                        Medium:
                                      </span>
                                      <div>
                                        {event.properties?.utm_medium ||
                                          event.properties?.attribution
                                            ?.utm_medium ||
                                          'None'}
                                      </div>
                                    </div>
                                    <div>
                                      <span className='text-muted-foreground'>
                                        Campaign:
                                      </span>
                                      <div>
                                        {event.properties?.utm_campaign ||
                                          event.properties?.attribution
                                            ?.utm_campaign ||
                                          'None'}
                                      </div>
                                    </div>
                                    <div>
                                      <span className='text-muted-foreground'>
                                        Content:
                                      </span>
                                      <div>
                                        {event.properties?.utm_content ||
                                          event.properties?.attribution
                                            ?.utm_content ||
                                          'None'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Click ID */}
                              {(event.properties?.fbclid ||
                                event.properties?.attribution?.fbclid) && (
                                <div>
                                  <h4 className='text-sm font-medium mb-1'>
                                    Click ID
                                  </h4>
                                  <div className='text-xs font-mono break-all'>
                                    {event.properties?.fbclid ||
                                      event.properties?.attribution?.fbclid}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Properties section */}
                          <div className='mt-4 pt-3 border-t'>
                            <div className='flex justify-between items-center mb-2'>
                              <h4 className='text-sm font-medium'>
                                All Properties
                              </h4>
                            </div>
                            <div className='bg-muted rounded-md p-3 max-h-48 overflow-auto'>
                              <pre className='text-xs overflow-x-auto whitespace-pre-wrap break-all'>
                                {JSON.stringify(event.properties, null, 2)}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventList;
