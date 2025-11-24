import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  saveSessionRequest,
  sessionResponse,
} from "../models/saveSession";
import type { RootState } from "../store/store";

// API base URL per environment. Override via VITE_API_BASE_URL if needed.
const fallbackBaseUrl = import.meta.env.DEV
  ? "http://localhost:5290/api"
  : `${window.location.origin}/api`;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl;

export const sessionApi = createApi({
  reducerPath: "sessionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/pumplog`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.session?.accessToken;
      console.log("Preparing headers for API request");
      if (token) {
        console.log("Attaching token to request headers", token);
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Session"],
  endpoints: (builder) => ({
    getTest: builder.query<string, void>({
      query: () => "",
    }),
    getSessions: builder.query<sessionResponse[], void>({
      query: () => "/sessions",
      providesTags: ["Session"],
    }),
    saveSession: builder.mutation<sessionResponse, saveSessionRequest>({
      query: (session) => ({
        url: "",
        method: "POST",
        body: session,
      }),
      invalidatesTags: ["Session"],
    }),
  }),
});

export const { useGetTestQuery, useGetSessionsQuery, useSaveSessionMutation } =
  sessionApi;
