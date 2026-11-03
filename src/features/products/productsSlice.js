import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (query = '', { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products?${query}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const fetchCategories = createAsyncThunk(
  'products/categories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products/categories')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

// Admin actions
export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/products', productData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/products/${id}`, productData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/products/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data)
    }
  }
)

const initialState = {
  products: [],          // ✅ array
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
  categories: [],        // if you keep categories here too, but it's better to have a separate slice
  currentProduct: null,
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProduct: (state) => { state.currentProduct = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
          state.loading = false
          state.products = Array.isArray(action.payload.items) ? action.payload.items : (action.payload.products || [])
          state.totalPages = action.payload.pagination?.pages || action.payload.totalPages || 1
          state.currentPage = action.payload.pagination?.page || action.payload.currentPage || 1
        })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch products'
      })
      .addCase(fetchProductById.pending, (state) => { state.loading = true })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload.product || action.payload
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload?.message || 'Failed to fetch product'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories || action.payload
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload.product || action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const product = action.payload.product || action.payload
        const index = state.products.findIndex(p => p._id === product._id)
        if (index !== -1) state.products[index] = product
        if (state.currentProduct?._id === product._id) state.currentProduct = product
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload)
      })
  },
})
export const { clearProduct, clearError } = productsSlice.actions
export default productsSlice.reducer