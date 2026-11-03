import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrderById, clearOrder } from '../../features/orders/ordersSlice'
import Loader from '../../components/common/Loader'

const OrderDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentOrder, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrderById(id))
    return () => dispatch(clearOrder())
  }, [dispatch, id])

  if (loading || !currentOrder) return <Loader />

  return (
    <div className="page-shell"><p className="eyebrow">Order history</p><h1 className="mb-8 mt-2 text-4xl">Order details</h1>
      <div className="surface p-6 md:p-8">
        <p><strong>Order ID:</strong> {currentOrder._id}</p>
        <p><strong>Date:</strong> {new Date(currentOrder.createdAt).toLocaleString()}</p>
        <p><strong>Status:</strong> {currentOrder.status}</p>
        <p><strong>Total:</strong> ₹{currentOrder.total || currentOrder.totalAmount}</p>
        <h3 className="font-semibold mt-4">Items</h3>
        <ul>
          {(currentOrder.items || currentOrder.orderItems)?.map(item => (
            <li key={item._id} className="border-b py-2 flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <p><strong>Shipping Address:</strong> {currentOrder.shippingAddress?.address}, {currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.postalCode}</p>
        </div>
      </div>
    </div>
  )
}
export default OrderDetails