import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slice/userSlice";
import { sessionApi } from "../services/sessionApi";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sessionApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
