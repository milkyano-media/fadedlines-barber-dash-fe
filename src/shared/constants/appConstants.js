export const APP_NAME = 'Barber Dashboard';
export const DEFAULT_PAGE_SIZE = 10;

export const DATE_FORMAT = {
  SHORT: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  WITH_TIME: 'MMM DD, YYYY HH:mm'
};

export const INFLUENCE_LEVELS = {
  STRONG: 'strong',          // 76-100%
  SIGNIFICANT: 'significant', // 51-75%
  PARTIAL: 'partial',        // 26-50%
  ORGANIC: 'organic'          // 0-25%
};

export const INFLUENCE_COLORS = {
  [INFLUENCE_LEVELS.STRONG]: '#22c55e',
  [INFLUENCE_LEVELS.SIGNIFICANT]: '#3b82f6',
  [INFLUENCE_LEVELS.PARTIAL]: '#eab308',
  [INFLUENCE_LEVELS.ORGANIC]: '#6b7280'
};

export const INFLUENCE_RANGES = {
  [INFLUENCE_LEVELS.STRONG]: { min: 76, max: 100 },
  [INFLUENCE_LEVELS.SIGNIFICANT]: { min: 51, max: 75 },
  [INFLUENCE_LEVELS.PARTIAL]: { min: 26, max: 50 },
  [INFLUENCE_LEVELS.ORGANIC]: { min: 0, max: 25 }
};

export const TRAFFIC_SOURCES = {
  DIRECT: 'DIRECT',
  SOCIAL: 'SOCIAL',
  PAID_SOCIAL: 'PAID_SOCIAL',
  ORGANIC: 'ORGANIC',
  OTHER: 'OTHER'
};

export const TRAFFIC_SOURCE_COLORS = {
  [TRAFFIC_SOURCES.DIRECT]: '#64748b',
  [TRAFFIC_SOURCES.SOCIAL]: '#3b82f6',
  [TRAFFIC_SOURCES.PAID_SOCIAL]: '#8b5cf6',
  [TRAFFIC_SOURCES.ORGANIC]: '#22c55e',
  [TRAFFIC_SOURCES.OTHER]: '#94a3b8'
};
