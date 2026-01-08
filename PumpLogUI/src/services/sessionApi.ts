import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  saveSessionRequest,
  sessionResponse,
} from "../models/saveSession";
import type { Section } from "../models/section";
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
    saveSection: builder.mutation<Section, Partial<Section>>({
      query: (section) => ({
        url: "/SaveSection",
        method: "POST",
        body: section,
      }),
      invalidatesTags: ["activesessions"],
    }),
    deleteSection: builder.mutation<void, string>({
      query: (sectionGuid) => ({
        url: `/DeleteSection/${sectionGuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["activesessions"],
    }),
  }),
});

export const {
  useGetSessionsQuery,
  useSaveSessionMutation,
  useSaveSectionMutation,
  useDeleteSectionMutation,
} = sessionApi;
