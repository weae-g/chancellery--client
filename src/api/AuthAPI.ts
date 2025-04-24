import { api } from "./index";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: {
    token: string;
    exp: string;
  };
  user: {
    id: number;
    email: string;
    phone: string;
    role: string;
  };
}

interface RegisterRequest {
  email: string;
  passwordHash: string;
  passwordRepeat: string;
  role: string;
  phone: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<void, RegisterRequest>({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
