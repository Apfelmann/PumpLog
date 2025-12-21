import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Exercise, BodyPart } from "../models/exercise";
import type { RootState } from "../store/store";
import { API_BASE_URL } from "../constants";

export const exerciseApi = createApi({
  reducerPath: "exerciseApi",
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
  tagTypes: ["exercises", "bodyParts"],
  endpoints: (builder) => ({
    getExercises: builder.query<Exercise[], void>({
      query: () => "/Exercises",
      providesTags: ["exercises"],
    }),
    getBodyParts: builder.query<BodyPart[], void>({
      query: () => "/BodyParts",
      providesTags: ["bodyParts"],
    }),
    createExercise: builder.mutation<Exercise, Partial<Exercise>>({
      query: (exercise) => ({
        url: "/Exercise",
        method: "POST",
        body: exercise,
      }),
      invalidatesTags: ["exercises"],
    }),
  }),
});

export const {
  useGetExercisesQuery,
  useGetBodyPartsQuery,
  useCreateExerciseMutation,
} = exerciseApi;
