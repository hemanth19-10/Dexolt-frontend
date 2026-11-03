import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Customer Pages
import Home from './pages/customer/Home'
import Products from './pages/customer/Products'
import ProductDetails from './pages/customer/ProductDetails'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import Login from './pages/customer/Login'
import Register from './pages/customer/Register'
import ForgotPassword from './pages/customer/ForgotPassword'
import Profile from './pages/customer/Profile'
import Orders from './pages/customer/Orders'
import OrderDetails from './pages/customer/OrderDetails'
import About from './pages/customer/About'
import Contact from './pages/customer/Contact'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminLogin from './pages/admin/AdminLogin'

// Route Guards
import CustomerRoute from './components/common/CustomerRoute'
import AdminRoute from './components/admin/AdminRoute'

export const router = createBrowserRouter([
  // 🛒 Customer Panel
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'cart', element: <CustomerRoute><Cart /></CustomerRoute> },
      { path: 'checkout', element: <CustomerRoute><Checkout /></CustomerRoute> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'profile', element: <CustomerRoute><Profile /></CustomerRoute> },
      { path: 'orders', element: <CustomerRoute><Orders /></CustomerRoute> },
      { path: 'order/:id', element: <CustomerRoute><OrderDetails /></CustomerRoute> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
  // 🔐 Admin Panel
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminRoute><AdminDashboard /></AdminRoute> },
      { path: 'products', element: <AdminRoute><AdminProducts /></AdminRoute> },
      { path: 'categories', element: <AdminRoute><AdminCategories /></AdminRoute> },
      { path: 'orders', element: <AdminRoute><AdminOrders /></AdminRoute> },
      { path: 'customers', element: <AdminRoute><AdminCustomers /></AdminRoute> },
      { path: 'coupons', element: <AdminRoute><AdminCoupons /></AdminRoute> },
      { path: 'login', element: <AdminLogin /> }, // No guard here to allow login
    ],
  },
])