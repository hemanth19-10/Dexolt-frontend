import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products/categories')
      return data // expects an array from API
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Admin actions
export const createCategory = createAsyncThunk(
  'categories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/categories', categoryData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/categories/${id}`, categoryData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/categories/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const initialState = {
  categories: [],   // ✅ MUST be an array
  loading: false,
  error: null,
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        // Ensure the payload is an array; if not, default to empty array
        state.categories = action.payload.categories || (Array.isArray(action.payload) ? action.payload : [])
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch categories'
        state.categories = []   // fallback to empty array
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload.category || action.payload)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const category = action.payload.category || action.payload
        const index = state.categories.findIndex(c => c._id === category._id)
        if (index !== -1) state.categories[index] = category
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(c => c._id !== action.payload)
      })
  },
})

export default categoriesSlice.reducer