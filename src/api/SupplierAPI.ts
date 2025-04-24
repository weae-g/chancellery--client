import { api } from "./index";

interface Supplier {
  id: number;
  name: string;
  address: string;
  phone: string;
}

export const supplierApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<Supplier[], void>({
      query: () => "supplier",
    }),
    getSupplierById: builder.query<Supplier, number>({
      query: (id) => `supplier/${id}`,
    }),
    createSupplier: builder.mutation<Supplier, Omit<Supplier, "id">>({
      query: (data) => ({
        url: "supplier",
        method: "POST",
        body: data,
      }),
    }),
    updateSupplier: builder.mutation<Supplier, Partial<Supplier> & { id: number }>({
      query: ({ id, ...data }) => ({
        url: `supplier/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteSupplier: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `supplier/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetSuppliersQuery,
  useGetSupplierByIdQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
