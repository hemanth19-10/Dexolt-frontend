import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboard } from '../../features/admin/adminSlice'
import Loader from '../../components/common/Loader'
import { FaShoppingBag, FaUsers, FaBox, FaMoneyBillWave } from 'react-icons/fa'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { dashboard, loading } = useSelector((state) => state.admin)

  useEffect(() => {
    dispatch(fetchDashboard())
  }, [dispatch])

  if (loading) return <Loader />

  const stats = [
    { label: 'Total Sales', value: `₹${dashboard.totalSales || 0}`, icon: FaMoneyBillWave, color: 'bg-brand-green' },
    { label: 'Total Orders', value: dashboard.totalOrders || 0, icon: FaShoppingBag, color: 'bg-brand-blue' },
    { label: 'Total Customers', value: dashboard.totalCustomers || 0, icon: FaUsers, color: 'bg-violet-500' },
    { label: 'Total Products', value: dashboard.totalProducts || 0, icon: FaBox, color: 'bg-brand-accent' },
  ]

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-end justify-between"><div><p className="eyebrow">Overview</p><h1 className="mt-1 text-3xl md:text-4xl">Good morning, admin.</h1><p className="mt-2 text-sm text-slate-500">Here’s what’s happening with your store today.</p></div><span className="hidden rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-brand-green sm:block">● Live data</span></div>
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="surface flex items-center p-5">
            <div className={`${stat.color} mr-4 rounded-xl p-3 text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="surface p-6">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-bold">Recent orders</h2><span className="text-xs font-semibold text-slate-400">Latest activity</span></div>
        <ul>
          {dashboard.recentOrders?.map(order => (
            <li key={order._id} className="flex justify-between border-b border-slate-100 py-4 text-sm last:border-0">
              <span>Order #{order._id.slice(-6)}</span>
              <span className="font-semibold">₹{order.total ?? order.totalAmount ?? 0}</span>
              <span className="text-sm text-gray-500">{order.status}</span>
            </li>
          )) || <p>No recent orders</p>}
        </ul>
      </div>
    </div>
  )
}
export default AdminDashboard