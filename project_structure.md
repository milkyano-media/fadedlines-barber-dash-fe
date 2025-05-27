# Project Structure

## Overview
This is a React + Vite frontend application for a barber dashboard system.

## Directory Structure

```
barber-dash-fe/
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── features/
│   │   ├── analytics/
│   │   │   ├── BarberAnalyticsPage.jsx
│   │   │   ├── CustomerAnalyticsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── BarberAnalyticsList.jsx
│   │   │   │   └── CustomerAnalyticsList.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBarberAnalytics.js
│   │   │   │   └── useCustomerAnalytics.js
│   │   │   └── services/
│   │   │       ├── analyticsService.js
│   │   │       └── barberAnalyticsService.js
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── contexts/
│   │   │   │   ├── AuthContext.jsx
│   │   │   │   └── AuthProvider.jsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.js
│   │   │   └── services/
│   │   │       └── authService.js
│   │   ├── campaigns/
│   │   │   ├── CampaignsPage.jsx
│   │   │   ├── components/
│   │   │   │   └── CampaignList.jsx
│   │   │   ├── constants/
│   │   │   ├── hooks/
│   │   │   │   └── useCampaigns.js
│   │   │   └── services/
│   │   │       └── campaignsService.js
│   │   ├── conversions/
│   │   │   ├── ConversionListPage.jsx
│   │   │   ├── ConversionSummaryPage.jsx
│   │   │   ├── ConversionsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── ConversionsList.jsx
│   │   │   │   └── ConversionsSummary.jsx
│   │   │   ├── constants/
│   │   │   │   └── conversionConstants.js
│   │   │   ├── hooks/
│   │   │   │   ├── useConversionsList.js
│   │   │   │   └── useConversionsSummary.js
│   │   │   ├── services/
│   │   │   │   └── conversionsService.js
│   │   │   └── types/
│   │   │       └── conversionTypes.js
│   │   ├── customers/
│   │   │   ├── CustomersPage.jsx
│   │   │   ├── components/
│   │   │   │   └── CustomerList.jsx
│   │   │   ├── constants/
│   │   │   ├── hooks/
│   │   │   └── services/
│   │   ├── dashboard-home/
│   │   │   ├── DashboardHomePage.jsx
│   │   │   ├── dashboardService.js
│   │   │   └── useDashboard.js
│   │   ├── events/
│   │   │   ├── EventsPage.jsx
│   │   │   ├── components/
│   │   │   │   └── EventList.jsx
│   │   │   ├── constants/
│   │   │   │   └── eventConstants.js
│   │   │   ├── hooks/
│   │   │   │   └── useEvents.js
│   │   │   └── services/
│   │   │       └── eventsService.js
│   │   ├── not-found/
│   │   │   └── NotFoundPage.jsx
│   │   └── sync-etl/
│   │       ├── SyncEtlPage.jsx
│   │       └── services/
│   │           └── syncEtlService.js
│   └── shared/
│       ├── api/
│       │   ├── clients/
│       │   │   └── apiClient.js
│       │   ├── config/
│       │   │   └── apiConfig.js
│       │   ├── interceptors/
│       │   └── services/
│       ├── components/
│       │   ├── DashboardLayout.jsx
│       │   ├── Navigation.jsx
│       │   ├── common/
│       │   │   ├── ErrorMessage.jsx
│       │   │   ├── LoadingSpinner.jsx
│       │   │   ├── Pagination.jsx
│       │   │   ├── ThemeToggle.jsx
│       │   │   └── Toast.jsx
│       │   ├── providers/
│       │   │   └── ThemeProvider.jsx
│       │   └── ui/
│       │       ├── button.jsx
│       │       ├── card.jsx
│       │       ├── input.jsx
│       │       ├── pagination.jsx
│       │       ├── select.jsx
│       │       └── tabs.jsx
│       ├── constants/
│       │   └── appConstants.js
│       ├── hooks/
│       │   ├── index.js
│       │   └── useDebounce.js
│       ├── lib/
│       │   └── twUtils.js
│       ├── routes/
│       │   ├── ProtectedRoute.jsx
│       │   └── PublicRoute.jsx
│       └── utils/
├── README.md
├── components.json
├── development_guidelines.md
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

## Key Directories

### `/src/features/`
Contains feature-specific modules organized by domain:
- **analytics**: Barber and customer analytics functionality
- **auth**: Authentication pages and context
- **campaigns**: Campaign management
- **conversions**: Conversion tracking and reporting
- **customers**: Customer management
- **dashboard-home**: Main dashboard page
- **events**: Event management
- **not-found**: 404 page
- **sync-etl**: Data synchronization features

### `/src/shared/`
Contains shared resources used across features:
- **api**: API client configuration and services
- **components**: Reusable UI components
- **constants**: Application-wide constants
- **hooks**: Custom React hooks
- **lib**: Utility libraries
- **routes**: Route components (Protected/Public)
- **utils**: General utility functions

## Tech Stack
- **React**: UI framework
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **ESLint**: Code linting
- **PostCSS**: CSS processing

## Configuration Files
- `vite.config.js`: Vite configuration
- `tailwind.config.js`: Tailwind CSS configuration
- `eslint.config.js`: ESLint rules
- `jsconfig.json`: JavaScript project configuration
- `postcss.config.js`: PostCSS configuration
- `components.json`: Component configuration
- `vercel.json`: Vercel deployment configuration