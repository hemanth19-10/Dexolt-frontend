import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchReviews = createAsyncThunk(
  'reviews/fetch',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews/${productId}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const createReview = createAsyncThunk(
  'reviews/create',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/reviews/${productId}`, reviewData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const initialState = {
  reviews: [],
  loading: false,
  error: null,
}

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => { state.reviews = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.loading = true })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false
        state.reviews = action.payload.reviews || action.payload
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch reviews'
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload.review || action.payload)
      })
  },
})
export const { clearReviews } = reviewsSlice.actions
export default reviewsSlice.reducer