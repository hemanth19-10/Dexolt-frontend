import { useSelector, useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart, applyCoupon } from '../../features/cart/cartSlice'
import { validateCoupon } from '../../features/coupons/couponsSlice'
import { Link } from 'react-router-dom'
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react'
import { toast } from 'react-toastify'

const Cart = () => {
  const { items, totalPrice } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const [couponCode, setCouponCode] = useState('')

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    const result = await dispatch(validateCoupon(couponCode))
    if (validateCoupon.fulfilled.match(result)) {
      dispatch(applyCoupon(result.payload))
      toast.success('Coupon applied!')
    } else {
      toast.error(result.payload?.message || 'Invalid coupon')
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/products" className="bg-brand-blue text-white px-6 py-3 rounded-full">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {items.map(item => (
            <div key={item._id} className="flex items-center border-b py-4">
              <img
                src={item.images?.[0] || '/product-placeholder.svg'}
                onError={(event) => { event.currentTarget.src = '/product-placeholder.svg' }}
                alt={item.name}
                className="h-20 w-20 rounded object-cover"
              />
              <div className="flex-1 ml-4">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="font-semibold text-brand-blue">₹{item.price}</p>
                <div className="flex items-center mt-2">
                  <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))} className="px-2 border">-</button>
                  <span className="px-4">{item.quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))} className="px-2 border">+</button>
                  <button onClick={() => dispatch(removeFromCart(item._id))} className="ml-4 text-red-500"><FaTrash /></button>
                </div>
              </div>
              <div className="font-bold">₹{item.price * item.quantity}</div>
            </div>
          ))}
          <button onClick={() => dispatch(clearCart())} className="mt-4 text-red-500">Clear Cart</button>
        </div>
        <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Shipping</span>
            <span>₹50</span>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1 border rounded px-3 py-1"
            />
            <button onClick={handleApplyCoupon} className="rounded-lg bg-violet-100 px-4 py-1 text-violet-700 hover:bg-violet-200">Apply</button>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{totalPrice + 50}</span>
          </div>
          <Link to="/checkout" className="block w-full mt-4 bg-brand-green text-white text-center py-3 rounded-full hover:bg-green-700">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Cart