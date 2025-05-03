// Conversions Filter Constants
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
