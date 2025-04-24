import { api } from "./index";

interface DashboardStats {
  usersCount: number;
  ordersCount: number;
  productsCount: number;
  totalRevenue: string;
  notificationsCount: number;
  recentOrders: Array<Order>;
  recentProducts: Array<Product>;
}

interface Order {
  id: number;
  totalPrice: string;
  status: string;
  createdAt: string;
  userId: number;
  user: User;
  orderItems: Array<OrderItem>;
}

interface User {
  id: number;
  email: string;
  phone: string;
  role: string;
}

interface OrderItem {
  productId: number;
  quantity: number;
  price: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  quantity: number;
  createdAt: string;
}

export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "dashboard/stats",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
