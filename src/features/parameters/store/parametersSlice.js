import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./initialState";
import { deepEqual } from "../utils/diffUtils";

const parametersSlice = createSlice({
    name: "parameters",
    initialState,
    reducers: {
        // Initialize original parameters (call on mount)
        initializeParameters: (state) => {
            state.originalParameters = JSON.parse(JSON.stringify(state.parameters));
            state.isDirty = false;
        },

        // Theme actions
        updateThemeColor: (state, action) => {
            const { mode, colorKey, value } = action.payload;
            state.parameters.theme[mode][colorKey] = value;
            state.isDirty = !deepEqual(state.parameters, state.originalParameters);
        },

        applyThemePreset: (state, action) => {
            const { mode, preset } = action.payload;
            Object.assign(state.parameters.theme[mode], preset);
            state.isDirty = !deepEqual(state.parameters, state.originalParameters);
        },

        // Branding actions
        updateBranding: (state, action) => {
            const { field, value } = action.payload;
            state.parameters.branding[field] = value;
            state.isDirty = !deepEqual(state.parameters, state.originalParameters);
        },

        // Feature flags actions
        toggleFeature: (state, action) => {
            const feature = action.payload;
            state.parameters.features[feature] = !state.parameters.features[feature];
            state.isDirty = !deepEqual(state.parameters, state.originalParameters);
        },

        // General settings actions
        updateGeneralSetting: (state, action) => {
            const { field, value } = action.payload;
            state.parameters.general[field] = value;
            state.isDirty = !deepEqual(state.parameters, state.originalParameters);
        },

        // Global actions
        saveParameters: (state) => {
            state.isSaving = true;
            state.error = null;
        },

        saveParametersSuccess: (state) => {
            state.originalParameters = JSON.parse(JSON.stringify(state.parameters));
            state.isDirty = false;
            state.isSaving = false;
        },

        saveParametersFailure: (state, action) => {
            state.isSaving = false;
            state.error = action.payload;
        },

        // Reset current section only
        resetSection: (state, action) => {
            const section = action.payload;
            if (state.originalParameters && state.originalParameters[section]) {
                state.parameters[section] = JSON.parse(JSON.stringify(state.originalParameters[section]));
                state.isDirty = !deepEqual(state.parameters, state.originalParameters);
            }
        },

        // Reset all to defaults (from initialState)
        resetToDefaults: (state) => {
            state.parameters = JSON.parse(JSON.stringify(initialState.parameters));
            state.isDirty = !deepEqual(state.parameters, state.originalParameters);
        },

        // Discard all changes
        discardChanges: (state) => {
            if (state.originalParameters) {
                state.parameters = JSON.parse(JSON.stringify(state.originalParameters));
                state.isDirty = false;
            }
        },
    },
});

export const {
    initializeParameters,
    updateThemeColor,
    applyThemePreset,
    updateBranding,
    toggleFeature,
    updateGeneralSetting,
    saveParameters,
    saveParametersSuccess,
    saveParametersFailure,
    resetSection,
    resetToDefaults,
    discardChanges,
} = parametersSlice.actions;

export default parametersSlice.reducer;
