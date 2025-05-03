/**
 * Format currency values
 * @param {number} value - The value to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Format dates consistently
 * @param {string|Date} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'withTime')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  const dateObj = new Date(date);
  
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    withTime: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  };

  return dateObj.toLocaleDateString('en-US', options[format]);
};

/**
 * Format percentages
 * @param {number} value - The value to format (0-100)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Get influence level based on score
 * @param {number} score - The influence score (0-100)
 * @returns {Object} Influence level info
 */
export const getInfluenceLevel = (score) => {
  if (score >= 76) return { level: 'strong', label: 'Strongly influenced', range: '76-100%' };
  if (score >= 51) return { level: 'significant', label: 'Significantly influenced', range: '51-75%' };
  if (score >= 26) return { level: 'partial', label: 'Partially influenced', range: '26-50%' };
  return { level: 'organic', label: 'Mostly organic', range: '0-25%' };
};

/**
 * Format traffic source name
 * @param {string} source - The traffic source key
 * @returns {string} Formatted traffic source name
 */
export const formatTrafficSource = (source) => {
  const sourceMap = {
    DIRECT: 'Direct',
    SOCIAL: 'Social',
    PAID_SOCIAL: 'Paid Social',
    ORGANIC: 'Organic',
    OTHER: 'Other'
  };
  
  return sourceMap[source] || source;
};
