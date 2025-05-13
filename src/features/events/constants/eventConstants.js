// src/features/events/constants/eventConstants.js

// Event types
export const EVENT_TYPES = {
  ALL: 'all',
  PAGE_VISIT: 'page_visit',
  CREATE_BOOKING: 'create_booking'
};

// Date ranges for filtering
export const DATE_RANGES = {
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  LAST_90_DAYS: '90d',
  ALL_TIME: 'all'
};

// Sort options
export const SORT_OPTIONS = {
  CREATED_AT_DESC: 'createdAt_desc',
  CREATED_AT_ASC: 'createdAt_asc',
  EVENT_NAME_ASC: 'eventName_asc',
  EVENT_NAME_DESC: 'eventName_desc'
};

// Badge colors for different event types
export const EVENT_TYPE_COLORS = {
  page_visit: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  create_booking: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
};

// Badge colors for different source types
export const SOURCE_TYPE_COLORS = {
  website: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'non-web': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
};

// Helper function to get event type label
export const getEventTypeLabel = (eventType) => {
  switch (eventType) {
    case 'page_visit':
      return 'Page Visit';
    case 'create_booking':
      return 'Booking Created';
    default:
      return eventType;
  }
};

// Helper function to get source type label
export const getSourceTypeLabel = (source) => {
  switch (source) {
    case 'website':
      return 'Website';
    case 'non-web':
      return 'Non-web';
    default:
      return source;
  }
};

// Helper function to get traffic source label
export const getTrafficSourceLabel = (source) => {
  if (!source) return 'Unknown';
  
  const sourceUpper = source.toUpperCase();
  switch (sourceUpper) {
    case 'DIRECT':
      return 'Direct';
    case 'SOCIAL':
      return 'Social Media';
    case 'PAID_SOCIAL':
      return 'Paid Social';
    case 'ORGANIC':
      return 'Organic Search';
    default:
      return source;
  }
};
