import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../api";
import authReducer from "./authSlice";
import { categoryApi } from "../api/CategoryAPI";
import { productApi } from "../api/ProductAPI";
import { wishlistApi } from "../api/WishlistAPI";
import { orderApi } from "../api/OrderAPI";
import { userApi } from "../api/UserAPI";
import { supplierApi } from "../api/SupplierAPI";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    category: categoryApi.reducer,
    product: productApi.reducer,
    wishlist: wishlistApi.reducer,
    order: orderApi.reducer,
    user: userApi.reducer,
    supplier: supplierApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
