import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

const apiUrl = import.meta.env.VITE_PUBLIC_API_URL;

export const api = createApi({
  reducerPath: "api",
  baseQuery: async (args: any, api: any, extraOptions: any) => {
    const headers = new Headers(args.headers);
    const token = (api.getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `${token}`);
    }

    if (args.body instanceof FormData) {
      const request = new Request(`${apiUrl}${args.url}`, {
        method: args.method,
        headers: headers,
        body: args.body,
      });
      const response = await fetch(request);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      try {
        return await response.json();
      } catch (e) {
        throw new Error(`Failed to parse JSON response, ${e}`);
      }
    } else {
      return fetchBaseQuery({
        baseUrl: apiUrl, 
        prepareHeaders: (headers) => {
          if (token) {
            headers.set("Authorization", `${token}`);
          }
          return headers;
        },
      })(args, api, extraOptions);
    }
  },
  endpoints: () => ({}),
});