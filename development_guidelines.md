# Technical Guidance: Feature-Based Architecture

## Architecture Principles

### 1. Feature-Based Organization

Each feature is self-contained with its own:

- Components
- Services
- Hooks
- Constants
- Types (using JSDoc comments)

### 2. Separation of Concerns

- **Features**: Business logic and UI specific to a domain
- **Shared**: Reusable utilities, components, and services
- **Config**: Application-wide configuration

## Folder Structure Overview

```
src/
├── features/
│   ├── auth/
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   └── AuthProvider.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── types/
│   │   │   └── authTypes.js
│   │   └── LoginPage.jsx
│   ├── dashboard-home/
│   │   └── DashboardHomePage.jsx
│   ├── customers/
│   │   ├── components/
│   │   │   ├── CustomerList.jsx
│   │   │   └── CustomerCard.jsx
│   │   ├── constants/
│   │   │   └── customerConstants.js
│   │   ├── CustomersPage.jsx
│   │   └── CustomerDetailPage.jsx
│   ├── campaigns/
│   │   ├── components/
│   │   │   ├── CampaignList.jsx
│   │   │   └── CampaignCard.jsx
│   │   ├── constants/
│   │   │   └── campaignConstants.js
│   │   └── CampaignsPage.jsx
│   ├── conversions/
│   │   ├── components/
│   │   │   ├── ConversionsList.jsx
│   │   │   └── ConversionCard.jsx
│   │   ├── hooks/
│   │   │   └── useConversions.js
│   │   ├── services/
│   │   │   └── conversionsService.js
│   │   ├── types/
│   │   │   └── conversionTypes.js
│   │   ├── constants/
│   │   │   └── conversionConstants.js
│   │   └── ConversionsPage.jsx
│   └── not-found/
│       └── NotFoundPage.jsx
├── shared/
│   ├── api/
│   │   ├── config/
│   │   │   └── apiConfig.js
│   │   ├── clients/
│   │   │   ├── apiClient.js
│   │   │   └── v2Client.js
│   │   └── interceptors/
│   │       └── authInterceptor.js
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.jsx
│   │   │   ├── card.jsx
│   │   │   ├── input.jsx
│   │   │   ├── select.jsx
│   │   │   ├── table.jsx
│   │   │   └── pagination.jsx
│   │   ├── charts/
│   │   │   └── BaseChart.jsx
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── Navbar.jsx
│   │   ├── common/
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── SearchInput.jsx
│   │   └── list/
│   │       ├── BaseList.jsx
│   │       ├── ListContainer.jsx
│   │       ├── ListHeader.jsx
│   │       └── ListPagination.jsx
│   ├── constants/
│   │   ├── apiConstants.js
│   │   ├── appConstants.js
│   │   ├── routeConstants.js
│   │   └── styleConstants.js
│   ├── hooks/
│   │   ├── usePagination.js
│   │   ├── useDebounce.js
│   │   └── useLocalStorage.js
│   ├── routes/
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   └── utils/
│       ├── formatters.js
│       ├── validators.js
│       └── helpers.js
├── App.jsx
├── index.css
└── main.jsx
```

## Naming Conventions

### Files and Folders

- Features: `kebab-case` (e.g., `dashboard-home`)
- Components: `PascalCase.jsx` (e.g., `CustomerList.jsx`)
- Utilities: `camelCase.js` (e.g., `useAuth.js`)
- Constants: `camelCase` with `Constants` suffix (e.g., `customerConstants.js`)

### Variables and Functions

- Components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Functions: `camelCase`
- Custom Hooks: `use` prefix (e.g., `useAuth`)

## Code Organization Guidelines

### Feature Structure

Each feature folder should contain:

1. **Main Page Component**: The entry point for the feature
2. **components/**: Feature-specific components
3. **services/**: API calls and business logic
4. **hooks/**: Custom hooks for the feature
5. **constants/**: Feature-specific constants
6. **types/**: Type definitions using JSDoc

### Shared Resources

- **api/**: API configuration and clients
- **components/**: Reusable UI components
- **hooks/**: Global hooks
- **utils/**: Helper functions
- **constants/**: Application-wide constants

## Best Practices

### 1. Component Design

- Keep components small and focused
- Use composition over inheritance
- Implement proper error boundaries
- Add loading states for async operations

### 2. State Management

- Use React Context for global state (auth)
- Use local state for component-specific data
- Consider using custom hooks for complex state logic

### 3. API Integration

- Create service layers for API calls
- Use interceptors for auth tokens
- Implement proper error handling
- Create reusable API client instances

### 4. Performance

- Implement code splitting where necessary
- Use React.memo for expensive components
- Optimize re-renders with proper dependency arrays
- Lazy load routes and components

### 5. Error Handling

- Create consistent error handling patterns
- Implement error boundaries
- Provide meaningful error messages
- Log errors appropriately

### 6. Type Safety (JSDoc)

```javascript
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 */

/**
 * @param {User} user - The user object
 * @returns {Promise<void>}
 */
```

## Example Constants Structure

### apiConstants.js

```javascript
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
export const API_V1 = '/api/v1';
export const API_V2 = '/api/v2';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout'
  },
  CUSTOMERS: {
    BASE: '/customers',
    DETAIL: (id) => `/customers/${id}`
  }
};
```

### appConstants.js

```javascript
export const APP_NAME = 'Barber Dashboard';
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const DATE_FORMAT = {
  SHORT: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY'
};
```

## Base Component Patterns

### BaseList Component

```javascript
// BaseList.jsx
const BaseList = ({
  data,
  loading,
  error,
  columns,
  renderItem,
  onPageChange,
  currentPage,
  totalItems,
  pageSize
}) => {
  // Implementation
};
```

### ListContainer Pattern

```javascript
// ListContainer.jsx
const ListContainer = ({ children, title, actions }) => {
  return (
    <div className='list-container'>
      <ListHeader title={title} actions={actions} />
      <div className='list-content'>{children}</div>
    </div>
  );
};
```

## Routing Structure

### Route Configuration

```javascript
// App.jsx
const routesConfig = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    )
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHomePage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'campaigns', element: <CampaignsPage /> },
      { path: 'conversions', element: <ConversionsPage /> }
    ]
  }
];
```

## Development Workflow

1. **Feature Development**

   - Create feature folder
   - Implement components
   - Add services and hooks
   - Define constants and types

2. **Integration**

   - Connect to shared components
   - Integrate with API clients
   - Add routes
   - Test functionality

3. **Code Review**
   - Follow naming conventions
   - Ensure proper structure
   - Check for performance issues
   - Validate error handling
   - Ask for codes review after some task done
