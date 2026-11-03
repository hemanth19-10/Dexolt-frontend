import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: JSON.parse(localStorage.getItem('cart')) || [],
  totalQuantity: 0,
  totalPrice: 0,
  coupon: null,
  discount: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(item => item._id === action.payload._id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
      // Recalculate totals
      calculateTotals(state)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload)
      localStorage.setItem('cart', JSON.stringify(state.items))
      calculateTotals(state)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item._id === id)
      if (item) {
        item.quantity = quantity
        if (quantity <= 0) {
          state.items = state.items.filter(i => i._id !== id)
        }
      }
      localStorage.setItem('cart', JSON.stringify(state.items))
      calculateTotals(state)
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('cart')
      calculateTotals(state)
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload
    },
    removeCoupon: (state) => {
      state.coupon = null
      state.discount = 0
    },
  },
})

function calculateTotals(state) {
  state.totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = state.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  state.totalPrice = subtotal - state.discount
}

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions
export default cartSlice.reducer