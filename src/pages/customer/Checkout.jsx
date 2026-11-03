import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createOrder } from '../../features/orders/ordersSlice'
import { clearCart } from '../../features/cart/cartSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Checkout = () => {
  const { items, totalPrice } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [address, setAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'India'
  })
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [onlinePaymentMethod, setOnlinePaymentMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    const orderData = {
      items: items.map(item => ({
        product: item._id,
        quantity: item.quantity,
      })),
      shippingAddress: address,
      paymentMethod: paymentMethod.toLowerCase() === 'cod' ? 'cod' : 'online',
      ...(paymentMethod === 'ONLINE' && {
        paymentProvider: onlinePaymentMethod,
        ...(onlinePaymentMethod === 'upi' && upiId.trim() ? { upiId: upiId.trim() } : {}),
      }),
    }

    const result = await dispatch(createOrder(orderData))
    if (createOrder.fulfilled.match(result)) {
      dispatch(clearCart())
      toast.success('Order placed successfully!')
      navigate(`/order/${(result.payload.order || result.payload)._id}`)
    } else {
      toast.error(result.payload?.message || 'Order failed')
    }
    setSubmitting(false)
  }

  if (items.length === 0) {
    return <div className="container mx-auto px-4 py-16 text-center">Your cart is empty. <a href="/products" className="text-brand-blue">Shop now</a></div>
  }

  return (
    <div className="page-shell"><p className="eyebrow">Almost there</p><h1 className="mb-8 mt-2 text-4xl">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} className="surface p-6 md:p-8">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <div className="mb-4">
              <label className="block text-sm">Address</label>
              <input name="address" value={address.address} onChange={handleChange} className="field" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm">City</label>
              <input name="city" value={address.city} onChange={handleChange} className="field" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Postal Code</label>
              <input name="postalCode" value={address.postalCode} onChange={handleChange} className="field" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm">Payment Method</label>
              <select id="payment-method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="field">
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment (UPI/Card)</option>
              </select>
            </div>
            {paymentMethod === 'ONLINE' && (
              <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 p-4">
                <p className="mb-3 font-semibold text-violet-950">Choose online payment</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ['upi', 'UPI'],
                    ['card', 'Debit / Credit Card'],
                    ['netbanking', 'Net Banking'],
                  ].map(([value, label]) => (
                    <label key={value} className={`cursor-pointer rounded-lg border bg-white p-3 text-sm ${onlinePaymentMethod === value ? 'border-violet-600 ring-2 ring-violet-200' : 'border-slate-200'}`}>
                      <input
                        type="radio"
                        name="onlinePaymentMethod"
                        value={value}
                        checked={onlinePaymentMethod === value}
                        onChange={(e) => setOnlinePaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {onlinePaymentMethod === 'upi' && (
                  <div className="mt-4">
                    <label htmlFor="upi-id" className="block text-sm font-medium">UPI ID (optional)</label>
                    <input
                      id="upi-id"
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="field mt-1"
                    />
                    <p className="mt-2 text-xs text-slate-600">You can also pay with Google Pay, PhonePe, Paytm, or any UPI app on the payment screen.</p>
                  </div>
                )}
                {onlinePaymentMethod === 'card' && (
                  <p className="mt-4 text-xs text-slate-600">Your card details will be entered securely on the payment gateway and are never stored by Dexolt.</p>
                )}
                {onlinePaymentMethod === 'netbanking' && (
                  <p className="mt-4 text-xs text-slate-600">You will choose your bank securely on the payment gateway.</p>
                )}
              </div>
            )}
            <button type="submit" disabled={submitting} className="btn-primary w-full bg-brand-green hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Processing...' : paymentMethod === 'ONLINE' ? 'Pay Online & Place Order' : 'Place Order'}
            </button>
          </form>
        </div>
        <div className="surface lg:w-1/3 p-6">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          {items.map(item => (
            <div key={item._id} className="flex justify-between text-sm mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalPrice + 50}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Checkout