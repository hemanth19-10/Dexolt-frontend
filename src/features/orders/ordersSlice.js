import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const createOrder = createAsyncThunk(
  'orders/create',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', orderData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const fetchMyOrders = createAsyncThunk(
  'orders/mine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders/mine')
      return data   // API should return an array
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Admin actions
export const fetchAllOrders = createAsyncThunk(
  'admin/orders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/orders/${orderId}/status`, { status })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const initialState = {
  orders: [],          // ✅ array
  currentOrder: null,
  loading: false,
  error: null,
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => { state.currentOrder = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload.order || action.payload)
      })
      // Fetch my orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false
        // Ensure payload is an array
        state.orders = Array.isArray(action.payload) ? action.payload : (action.payload?.orders || [])
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch orders'
        state.orders = []   // fallback
      })
      // Fetch order by ID
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order || action.payload
      })
      // Admin: fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = Array.isArray(action.payload) ? action.payload : (action.payload?.orders || [])
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch orders'
      })
      // Admin: update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const { orderId, status } = action.meta.arg
        const response = action.payload
        const order = response?.order || response
        const index = state.orders.findIndex(o => o._id === (order?._id || orderId))
        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...(order && typeof order === 'object' ? order : {}),
            status,
          }
        }
        if (state.currentOrder?._id === orderId) {
          state.currentOrder = { ...state.currentOrder, ...(order || {}), status }
        }
      })
  },
})

export const { clearOrder, clearError } = ordersSlice.actions
export default ordersSlice.reducer