import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMyOrders } from '../../features/orders/ordersSlice'
import { Link } from 'react-router-dom'
import Loader from '../../components/common/Loader'

const Orders = () => {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.orders) || { orders: [], loading: false }

  useEffect(() => {
    dispatch(fetchMyOrders())
  }, [dispatch])

  // ✅ Ensure orders is an array
  const safeOrders = Array.isArray(orders) ? orders : []

  if (loading) return <Loader />

  return (
    <div className="page-shell"><p className="eyebrow">Your account</p><h1 className="mb-8 mt-2 text-4xl">My orders</h1>
      {safeOrders.length === 0 ? (
        <p>No orders yet. <Link to="/products" className="text-brand-blue">Start shopping</Link></p>
      ) : (
        <div className="space-y-4">
          {safeOrders.map(order => (
            <div key={order._id} className="surface flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className={`px-2 py-1 rounded text-sm font-medium 
                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <span className="font-bold">₹{order.total || order.totalAmount}</span>
              </div>
              <Link to={`/order/${order._id}`} className="text-brand-blue hover:underline">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders