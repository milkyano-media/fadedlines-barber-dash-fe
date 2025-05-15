// Conversions Filter Constants
export const SOURCE_TYPES = {
  WEBSITE: 'website',
  NON_WEB: 'non-web'
};

// Source type colors
export const SOURCE_TYPE_COLORS = {
  website: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'non-web': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
};
export const DATE_RANGES = {
  LAST_7_DAYS: '7d',
  LAST_30_DAYS: '30d',
  LAST_90_DAYS: '90d',
  ALL_TIME: 'all'
};

export const INFLUENCE_FILTERS = {
  ALL: 'all',
  STRONG: 'strong', // 76-100%
  SIGNIFICANT: 'significant', // 51-75%
  PARTIAL: 'partial', // 26-50%
  ORGANIC: 'organic' // 0-25%
};

export const INFLUENCE_COLORS = {
  STRONG: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  SIGNIFICANT: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  PARTIAL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  ORGANIC: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
};

export const CHART_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C'
];

// Helper functions
export const getInfluenceColor = (score) => {
  if (score >= 76) return INFLUENCE_COLORS.STRONG;
  if (score >= 51) return INFLUENCE_COLORS.SIGNIFICANT;
  if (score >= 26) return INFLUENCE_COLORS.PARTIAL;
  return INFLUENCE_COLORS.ORGANIC;
};

export const getInfluenceLabel = (score) => {
  if (score >= 76) return 'Strongly influenced';
  if (score >= 51) return 'Significantly influenced';
  if (score >= 26) return 'Partially influenced';
  return 'Mostly organic';
};

// Helper function to determine if a conversion came from website or non-web
export const getConversionSource = (conversion) => {
  // First check if the conversion has a direct source property from backend
  if (conversion.source) {
    return conversion.source;
  }

  // Check if any events have a source property
  if (conversion?.details?.events) {
    const bookingEvent = conversion.details.events.find(event => event.eventName === 'create_booking');
    if (bookingEvent && bookingEvent.source) {
      return bookingEvent.source;
    }
  }
  
  // Check the booking event's properties for non-web flags
  if (conversion?.details?.events) {
    // Find the booking event in the events list
    const bookingEvent = conversion.details.events.find(event => event.eventName === 'create_booking');
    
    if (bookingEvent) {
      // Look for non-web specific flags in the booking event
      if (bookingEvent.properties) {
        // Check for 'source: non-web' in the booking properties
        if (bookingEvent.properties.booking?.source === 'non-web') {
          return SOURCE_TYPES.NON_WEB;
        }
        
        // Check for non_web flag in properties or attribution
        if (bookingEvent.properties.non_web === true || 
            bookingEvent.properties.attribution?.non_web === true) {
          return SOURCE_TYPES.NON_WEB;
        }
      }
    }
  }
  
  // Default to website source if no non-web flags are found
  return SOURCE_TYPES.WEBSITE;
};

// Helper function to get source type label
export const getSourceTypeLabel = (source) => {
  switch (source) {
    case SOURCE_TYPES.WEBSITE:
      return 'Website';
    case SOURCE_TYPES.NON_WEB:
      return 'Non-web';
    default:
      return source;
  }
};

export const getEventBadgeColor = (trafficSource, hasUtm) => {
  if (trafficSource === 'FACEBOOK' && hasUtm) {
    return 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
  }
  if (trafficSource === 'FACEBOOK') {
    return 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
  }
  if (trafficSource === 'DIRECT') {
    return 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
  }
  return 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
};

// Helper function to generate Square booking URL
export const getSquareBookingUrl = (bookingId) => {
  if (!bookingId || bookingId === 'None' || bookingId.startsWith('booking-')) {
    return null; // Return null for invalid or placeholder booking IDs
  }
  return `https://app.squareup.com/dashboard/appointments/reservations/${bookingId}/edit`;
};
