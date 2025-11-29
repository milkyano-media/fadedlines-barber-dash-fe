/**
 * Deep equality check
 */
export const deepEqual = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Calculate diff between original and current parameters
 * Returns structured diff object for display in modal
 */
export const calculateDiff = (original, current) => {
    const diff = {
        theme: [],
        branding: [],
        features: [],
        general: [],
    };

    // Theme differences
    ["light", "dark"].forEach((mode) => {
        Object.keys(current.theme[mode]).forEach((key) => {
            if (current.theme[mode][key] !== original.theme[mode][key]) {
                diff.theme.push({
                    mode,
                    field: key,
                    from: original.theme[mode][key],
                    to: current.theme[mode][key],
                });
            }
        });
    });

    // Branding differences
    Object.keys(current.branding).forEach((key) => {
        if (current.branding[key] !== original.branding[key]) {
            diff.branding.push({
                field: key,
                from: original.branding[key],
                to: current.branding[key],
            });
        }
    });

    // Feature flag differences
    Object.keys(current.features).forEach((key) => {
        if (current.features[key] !== original.features[key]) {
            diff.features.push({
                field: key,
                from: original.features[key],
                to: current.features[key],
            });
        }
    });

    // General settings differences
    Object.keys(current.general).forEach((key) => {
        if (current.general[key] !== original.general[key]) {
            diff.general.push({
                field: key,
                from: original.general[key],
                to: current.general[key],
            });
        }
    });

    return diff;
};

/**
 * Check if diff is empty
 */
export const isDiffEmpty = (diff) => {
    return (
        diff.theme.length === 0 && diff.branding.length === 0 && diff.features.length === 0 && diff.general.length === 0
    );
};
