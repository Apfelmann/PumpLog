import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://auth.onlychris.net/api/Auth/",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userLogin) => ({
        url: "login",
        method: "POST",
        body: userLogin,
      }),
    }),
  }),
});

export const { useLoginMutation } = userApi;
