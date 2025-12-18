import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slice/userSlice";
import { sessionApi } from "../services/sessionApi";
import { exerciseApi } from "../services/exerciseApi";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [exerciseApi.reducerPath]: exerciseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      sessionApi.middleware,
      exerciseApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
