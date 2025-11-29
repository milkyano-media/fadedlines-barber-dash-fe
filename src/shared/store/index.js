import { configureStore } from "@reduxjs/toolkit";
import parametersReducer from "../../features/parameters/store/parametersSlice";

export const store = configureStore({
    reducer: {
        parameters: parametersReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Allow file objects for logo/favicon
        }),
});
