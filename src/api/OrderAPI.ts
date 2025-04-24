import { api } from "./index";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: object;
  quantity: number;
  categoryId: number;
  supplierId: number;
  createdAt: string;
}

interface OrderItem {
  id: number;
  quantity: number;
  price: string;
  orderId: number;
  productId: number;
  product: Product;
}

interface User {
  id: number;
  email: string;
  phone: string;
  role: string;
}

interface Order {
  id: number;
  totalPrice: string;
  status: string;
  createdAt: string;
  confirmedAt?: string;
  payment: string;
  userId: number;
  user: User;
  orderItems: OrderItem[];
}

interface CreateOrderDto {
  totalPrice: number;
  payment: string;
  userId: number;
}

export const orderApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => "orders",
    }),

    getUserOrders: builder.query<Order[], number>({
      query: (userId) => `orders/user/${userId}`,
    }),

    getOrderById: builder.query<Order, number>({
      query: (orderId) => `orders/${orderId}`,
    }),

    createOrder: builder.mutation<Order, CreateOrderDto>({
      query: (data) => ({
        url: "orders",
        method: "POST",
        body: data,
      }),
    }),

    updateOrderStatus: builder.mutation<
      Order,
      { orderId: number; status: string }
    >({
      query: ({ orderId, status }) => ({
        url: `orders/${orderId}/status`,
        method: "PUT",
        body: { status },
      }),
    }),

    deleteOrder: builder.mutation<{ success: boolean; id: number }, number>({
      query: (orderId) => ({
        url: `orders/${Number(orderId)}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;
