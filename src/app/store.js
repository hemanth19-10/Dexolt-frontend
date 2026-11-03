import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import cartReducer from '../features/cart/cartSlice'
import productsReducer from '../features/products/productsSlice'
import ordersReducer from '../features/orders/ordersSlice'
import categoriesReducer from '../features/categories/categoriesSlice'
import couponsReducer from '../features/coupons/couponsSlice'
import adminReducer from '../features/admin/adminSlice'
import reviewsReducer from '../features/reviews/reviewsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    orders: ordersReducer,
    categories: categoriesReducer,
    coupons: couponsReducer,
    admin: adminReducer,
    reviews: reviewsReducer,
  },
})