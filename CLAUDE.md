# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (runs on port 5175)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Environment Configuration

Copy `.env.example` to `.env` and configure:

- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:3001)
- `VITE_APP_NAME` - Application name

## Architecture Overview

This is a React 19 + Vite dashboard application for barber shop analytics and management, structured using vertical slice architecture where each feature is self-contained.

### Folder Structure

```
src/
├── features/           # Feature modules (auth, analytics, campaigns, conversions, events, etc.)
│   └── [feature]/
│       ├── components/      # Feature-specific UI components
│       ├── hooks/          # Feature-specific custom hooks
│       ├── services/       # API service layer
│       ├── constants/      # Feature constants
│       └── [Feature]Page.jsx
├── shared/            # Shared resources (accessible via '@/' alias)
│   ├── api/          # API client configuration
│   ├── components/   # Reusable UI components
│   │   ├── ui/      # Shadcn-ui style primitives (button, card, input, etc.)
│   │   └── common/  # App-specific reusable components
│   ├── constants/    # App-wide constants
│   ├── hooks/        # Shared custom hooks
│   ├── lib/          # Utility functions
│   └── routes/       # Route protection components
├── App.jsx           # Root component with router configuration
└── main.jsx          # Application entry point
```

### Authentication System

Authentication uses React Context with localStorage persistence:

- **Auth Flow**: Login/register → token + user data stored in localStorage → AuthProvider maintains global auth state
- **Storage Keys**:
    - `auth_token` - JWT token (auto-attached to all API requests)
    - `user_data` - Serialized user object
- **Auth Context**: src/features/auth/contexts/AuthProvider.jsx
- **Hook**: `useAuth()` from src/features/auth/hooks/useAuth.js
- **Route Guards**:
    - `ProtectedRoute` - Wraps authenticated routes, redirects to /login if unauthenticated
    - `PublicRoute` - Wraps login/register, redirects authenticated users to dashboard

### Routing Structure

React Router v7 with nested routes:

```
/ (ProtectedRoute + DashboardLayout)
  ├── /dashboard       # Dashboard home
  ├── /customers       # Customer analytics
  ├── /barbers         # Barber analytics
  ├── /campaigns       # Campaign performance
  ├── /conversions     # Conversion tracking
  ├── /events          # Event logging
  └── /sync-etl        # ETL sync
/login (PublicRoute)
/register (PublicRoute)
```

Routes configured in src/App.jsx using createBrowserRouter. DashboardLayout (src/shared/components/DashboardLayout.jsx) provides responsive sidebar navigation with mobile menu.

### API Communication

Centralized axios instance with automatic token injection:

- **Configuration**: src/shared/api/config/apiConfig.js
- **Base URL**: From `VITE_API_BASE_URL` environment variable
- **API Client**: src/shared/api/clients/apiClient.js (ApiClient class)
- **Version**: All endpoints use `/api/v2` prefix
- **Interceptors**:
    - Request: Auto-attaches Bearer token from localStorage
    - Response: Handles 401 errors, clears auth on token expiration
- **Service Layer**: Each feature has its own service file (e.g., conversionsService.js, campaignsService.js) that uses the API client

### State Management

No Redux or external state library. Uses:

- **React Context**: Global state (AuthContext, ThemeProvider)
- **Custom Hooks**: Feature-specific data fetching following consistent pattern:

```javascript
const useFeatureData = (options) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        // Fetch from service layer
    }, []);

    return { data, loading, error, fetchData };
};
```

Examples: useConversionsList, useCampaigns, useEvents

### UI Components

Three-tier component system:

1. **Primitives** (src/shared/components/ui/): Radix UI-based design system components (button, card, input, select, tabs, badge, popover, pagination)
2. **Common** (src/shared/components/common/): App-specific reusable components (LoadingSpinner, ErrorMessage, ThemeToggle)
3. **Feature-specific**: Components within each feature directory

**Styling**:

- Tailwind CSS with utility-first approach
- Dark mode via CSS variables and next-themes
- `cn()` utility (src/shared/lib/twUtils.js) for conditional classes (clsx + tailwind-merge)
- Responsive design with mobile-first breakpoints

### Key Patterns

- **Import Alias**: `@/` maps to `src/shared/` (configured in vite.config.js)
- **Feature Isolation**: Features are self-contained, communicate through shared API services
- **Consistent Hooks**: All data-fetching hooks return { data, loading, error, refetch }
- **Error Handling**: Component-level error states, API errors logged and displayed
- **Loading States**: Consistent loading indicators across features

### Technology Stack

**Core**: React 19, React Router 7, Vite, Tailwind CSS 3

**UI**: Radix UI (headless components), Lucide React (icons), Recharts (charts), React Datepicker

**Data**: React Context API, Axios, dayjs (dates)

**Dev**: ESLint (with react-hooks + react-refresh plugins), SWC (fast refresh)
