import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  saveSessionRequest,
  sessionResponse,
} from "../models/saveSession";
import type { RootState } from "../store/store";
import { API_BASE_URL } from "../constants";

export const sessionApi = createApi({
  reducerPath: "sessionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/pumplog`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.session?.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["activesessions"],
  endpoints: (builder) => ({
    getSessions: builder.query<sessionResponse[], void>({
      query: () => "/ActiveSessions",
      providesTags: ["activesessions"],
    }),
    saveSession: builder.mutation<sessionResponse, Partial<saveSessionRequest>>(
      {
        query: (session) => ({
          url: "",
          method: "POST",
          body: session,
        }),
        invalidatesTags: ["activesessions"],
      }
    ),
  }),
});

export const { useGetSessionsQuery, useSaveSessionMutation } = sessionApi;
