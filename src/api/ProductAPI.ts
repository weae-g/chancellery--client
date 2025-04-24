import { api } from "./index";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  imageId: number | null;
  quantity: number;
  categoryId: number;
  supplierId: number;
  createdAt: string;
  category: Category;
  supplier: Supplier;
  imageUrl?: string;
}

export const productApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "product",
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `product/${id}`,
    }),
    getProductImage: builder.query<Blob, number>({
      query: (id) => ({
        url: `product/${id}/image`,
        responseHandler: async (response: any) => response.blob(),
        cache: "no-cache",
      }),
    }),
    createProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: `product`,
        method: "POST",
        body: formData,
      }),
    }),
    updateProduct: builder.mutation<
      Product,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `product/${id}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteProduct: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `product/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetProductImageQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
