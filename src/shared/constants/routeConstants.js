export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CUSTOMERS: {
    BASE: '/customers',
    DETAIL: (id) => `/customers/${id}`
  },
  CAMPAIGNS: {
    BASE: '/campaigns',
    DETAIL: (id) => `/campaigns/${id}`
  },
  CONVERSIONS: {
    BASE: '/conversions'
  }
};

export const PUBLIC_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER
];

export const PRIVATE_ROUTES = [
  ROUTES.HOME,
  ROUTES.DASHBOARD,
  ROUTES.CUSTOMERS.BASE,
  ROUTES.CAMPAIGNS.BASE,
  ROUTES.CONVERSIONS.BASE
];
