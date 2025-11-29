export const initialState = {
    // Current editable values
    parameters: {
        theme: {
            light: {
                primary: "#000000",
                secondary: "#64748b",
                accent: "#3b82f6",
                background: "#ffffff",
                foreground: "#0a0a0a",
            },
            dark: {
                primary: "#ffffff",
                secondary: "#94a3b8",
                accent: "#60a5fa",
                background: "#0a0a0a",
                foreground: "#fafafa",
            },
        },
        branding: {
            appName: "Barber Dashboard",
            appLogo: "/logo.svg",
            logoFileName: "",
            faviconUrl: "/favicon.ico",
            faviconFileName: "",
        },
        features: {
            maintenanceMode: false,
            showAnalytics: true,
            allowRegistration: true,
            darkModeEnabled: true,
        },
        general: {
            timezone: "UTC",
            sessionTimeout: 60,
            itemsPerPage: 20,
            analyticsRetention: 90,
            eventLogRetention: 30,
        },
    },

    // Original values for comparison (deep copy on init/save)
    originalParameters: null,

    // UI state
    isDirty: false,
    isSaving: false,
    error: null,
};
