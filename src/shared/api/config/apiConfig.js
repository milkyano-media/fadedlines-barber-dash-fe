// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
export const API_V1 = '/api/v1';
export const API_V2 = '/api/v2';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register'
  },
  CUSTOMERS: {
    BASE: '/customers',
    DETAIL: (id) => `/customers/${id}`,
    ANALYTICS: '/customers/analytics'
  },
  CAMPAIGNS: {
    BASE: '/campaigns',
    DETAIL: (id) => `/campaigns/${id}`,
    ANALYTICS: '/analytics/campaigns'
  },
  CONVERSIONS: {
    BASE: '/conversions',
    DETAIL: (id) => `/conversions/${id}`,
    SUMMARY: '/conversions/summary'
  },
  DASHBOARD: {
    ANALYTICS: '/analytics/dashboard'
  }
};

export const REQUEST_TIMEOUT = 30000; // 30 seconds
