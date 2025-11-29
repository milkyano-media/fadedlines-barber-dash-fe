import { createSelector } from "@reduxjs/toolkit";
import { calculateDiff } from "../utils/diffUtils";

// Base selectors
export const selectParametersState = (state) => state.parameters;
export const selectParameters = (state) => state.parameters.parameters;
export const selectOriginalParameters = (state) => state.parameters.originalParameters;

// Section selectors
export const selectTheme = (state) => state.parameters.parameters.theme;
export const selectBranding = (state) => state.parameters.parameters.branding;
export const selectFeatures = (state) => state.parameters.parameters.features;
export const selectGeneral = (state) => state.parameters.parameters.general;

// UI state selectors
export const selectIsDirty = (state) => state.parameters.isDirty;
export const selectIsSaving = (state) => state.parameters.isSaving;
export const selectError = (state) => state.parameters.error;

// Memoized diff selector for modal
export const selectParametersDiff = createSelector(
    [selectParameters, selectOriginalParameters],
    (current, original) => {
        if (!original) return null;
        return calculateDiff(original, current);
    },
);

// Section-specific dirty checks
export const selectIsThemeDirty = createSelector([selectTheme, selectOriginalParameters], (theme, original) => {
    if (!original) return false;
    return JSON.stringify(theme) !== JSON.stringify(original.theme);
});

export const selectIsBrandingDirty = createSelector(
    [selectBranding, selectOriginalParameters],
    (branding, original) => {
        if (!original) return false;
        return JSON.stringify(branding) !== JSON.stringify(original.branding);
    },
);

export const selectIsFeaturesDirty = createSelector(
    [selectFeatures, selectOriginalParameters],
    (features, original) => {
        if (!original) return false;
        return JSON.stringify(features) !== JSON.stringify(original.features);
    },
);

export const selectIsGeneralDirty = createSelector([selectGeneral, selectOriginalParameters], (general, original) => {
    if (!original) return false;
    return JSON.stringify(general) !== JSON.stringify(original.general);
});
