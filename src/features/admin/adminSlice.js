import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchDashboard = createAsyncThunk(
  'admin/dashboard',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/dashboard')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const fetchCustomers = createAsyncThunk(
  'admin/customers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/customers')
      return Array.isArray(data)
        ? data
        : data.customers || data.users || data.data || []
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const toggleCustomerStatus = createAsyncThunk(
  'admin/toggleCustomer',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const isActive = status === 'active'
      const { data } = await api.patch(`/admin/customers/${id}`, { isActive, status })
      return { response: data, id, isActive }
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const initialState = {
  dashboard: {
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    recentOrders: [],
  },
  customers: [],
  loading: false,
  error: null,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => { state.loading = true })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false
        const { metrics = {}, recentOrders = [] } = action.payload
        state.dashboard = {
          totalSales: metrics.sales || action.payload.totalSales || 0,
          totalOrders: metrics.orders || action.payload.totalOrders || 0,
          totalCustomers: metrics.customers || action.payload.totalCustomers || 0,
          totalProducts: metrics.products || action.payload.totalProducts || 0,
          recentOrders: recentOrders || action.payload.recentOrders || [],
        }
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to load dashboard'
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.error = null
        state.customers = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to load customers'
        state.customers = []
      })
      .addCase(toggleCustomerStatus.fulfilled, (state, action) => {
        const { response, id, isActive } = action.payload
        const customer = response?.customer || response?.user || response
        const index = state.customers.findIndex(c => c._id === (customer?._id || id))
        if (index !== -1) {
          state.customers[index] = {
            ...state.customers[index],
            ...(customer && typeof customer === 'object' ? customer : {}),
            isActive,
          }
        }
      })
  },
})
export default adminSlice.reducer