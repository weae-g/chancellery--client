import { api } from "./index";

interface Category {
  id: number;
  name: string;
  description: string;
}

export const categoryApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => "category",
    }),
    getCategoryById: builder.query<Category, number>({
      query: (id) => `category/${id}`,
    }),
    createCategory: builder.mutation<Category, Omit<Category, "id">>({
      query: (data) => ({
        url: `category`,
        method: "POST",
        body: data,
      }),
    }),
    updateCategory: builder.mutation<Category, Partial<Category> & { id: number }>({
      query: ({ id, ...data }) => ({
        url: `category/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteCategory: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `category/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
