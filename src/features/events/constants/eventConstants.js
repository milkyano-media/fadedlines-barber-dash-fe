// src/features/events/constants/eventConstants.js

// Event types
export const EVENT_TYPES = {
    ALL: "all",
    PAGE_VISIT: "page_visit",
    CREATE_BOOKING: "create_booking",
    NEED_VERIFICATION: "need_verification",
    REGISTRATION_COMPLETED: "registration_completed",
    REGISTRATION_FAILED: "registration_failed",
};

// Registration event types (subset of EVENT_TYPES)
export const REGISTRATION_EVENT_TYPES = [
    EVENT_TYPES.NEED_VERIFICATION,
    EVENT_TYPES.REGISTRATION_COMPLETED,
    EVENT_TYPES.REGISTRATION_FAILED,
];

// Date ranges for filtering
export const DATE_RANGES = {
    LAST_7_DAYS: "7d",
    LAST_30_DAYS: "30d",
    LAST_90_DAYS: "90d",
    ALL_TIME: "all",
};

// Sort options
export const SORT_OPTIONS = {
    CREATED_AT_DESC: "createdAt_desc",
    CREATED_AT_ASC: "createdAt_asc",
};

// Badge colors for different event types
export const EVENT_TYPE_COLORS = {
    page_visit: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    create_booking: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
    need_verification: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
    registration_completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
    registration_failed: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200",
};

// Badge colors for different source types
export const SOURCE_TYPE_COLORS = {
    website: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    "non-web": "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
};

// Helper function to get event type label
export const getEventTypeLabel = (eventType) => {
    switch (eventType) {
        case "page_visit":
            return "Page Visit";
        case "create_booking":
            return "Booking Created";
        case "need_verification":
            return "Need Verification";
        case "registration_completed":
            return "Registration Completed";
        case "registration_failed":
            return "Registration Failed";
        default:
            return eventType;
    }
};

// Helper function to get source type label
export const getSourceTypeLabel = (source) => {
    switch (source) {
        case "website":
            return "Website";
        case "non-web":
            return "Non-web";
        default:
            return source;
    }
};

// Helper function to get traffic source label
export const getTrafficSourceLabel = (source) => {
    if (!source) return "Unknown";

    const sourceUpper = source.toUpperCase();
    switch (sourceUpper) {
        case "DIRECT":
            return "Direct";
        case "SOCIAL":
            return "Social Media";
        case "PAID_SOCIAL":
            return "Paid Social";
        case "ORGANIC":
            return "Organic Search";
        default:
            return source;
    }
};
