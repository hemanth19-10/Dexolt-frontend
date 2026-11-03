import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllOrders, updateOrderStatus } from '../../features/orders/ordersSlice'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

const AdminOrders = () => {
  const dispatch = useDispatch()
  const { orders, loading, error } = useSelector((state) => state.orders)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    dispatch(fetchAllOrders())
  }, [dispatch])

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await dispatch(updateOrderStatus({ orderId, status: newStatus }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Order status updated')
    } else {
      toast.error('Update failed')
    }
  }

  const filteredOrders = filter ? orders.filter(o => o.status === filter) : orders

  const statusOptions = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      <div className="mb-4 flex gap-2">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={() => setFilter('')} className="btn-secondary px-4 py-2">Clear</button>
      </div>
      {loading ? <Loader /> : error ? (
        <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-violet-100 text-violet-900">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order._id} className="border-b">
                  <td className="p-3">#{order._id.slice(-6)}</td>
                  <td className="p-3">{order.user?.name || 'Guest'}</td>
                  <td className="p-3">₹{order.total ?? order.totalAmount ?? 0}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm font-medium 
                      ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
export default AdminOrders