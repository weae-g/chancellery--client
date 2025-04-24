import { api } from "./index";

interface User {
  id: number;
  email: string;
  phone: string;
  role: string;
}

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "user",
    }),
    getUserByEmail: builder.query<User, string>({
      query: (email) => `user/${email}`,
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `user/${id}`,
    }),
    createUser: builder.mutation<User, Omit<User, "id">>({
      query: (data) => ({
        url: `user`,
        method: "POST",
        body: data,
      }),
    }),
    updateUser: builder.mutation<User, { id: number; data: Partial<Omit<User, "id">> }>({
      query: ({ id, data }) => ({
        url: `user/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteUser: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `user/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByEmailQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
