import { api } from "./index";

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
  };
}

export const wishlistApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<WishlistItem[], number>({
      query: (userId) => `wishlist/${userId}`,
    }),
    addToWishlist: builder.mutation<
      WishlistItem,
      { userId: number; productId: number }
    >({
      query: (data) => ({
        url: "wishlist",
        method: "POST",
        body: data,
      }),
    }),
    removeFromWishlist: builder.mutation<
      { success: boolean },
      { userId: number; productId: number }
    >({
      query: ({ userId, productId }) => ({
        url: `wishlist/${userId}/${productId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApi;
