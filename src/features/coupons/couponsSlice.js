import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const validateCoupon = createAsyncThunk(
  'coupons/validate',
  async (code, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/coupons/validate/${code}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Admin actions
export const fetchAllCoupons = createAsyncThunk(
  'admin/coupons',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/coupons')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const createCoupon = createAsyncThunk(
  'admin/createCoupon',
  async (couponData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/coupons', couponData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const updateCoupon = createAsyncThunk(
  'admin/updateCoupon',
  async ({ id, couponData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/coupons/${id}`, couponData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const initialState = { coupons: [], loading: false, error: null }
const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload.coupons || action.payload
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.push(action.payload.coupon || action.payload)
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        const coupon = action.payload.coupon || action.payload
        const index = state.coupons.findIndex(c => c._id === coupon._id)
        if (index !== -1) state.coupons[index] = coupon
      })
  },
})
export default couponsSlice.reducer