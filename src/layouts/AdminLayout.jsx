import { Outlet } from 'react-router-dom'
import Sidebar from '../components/admin/Sidebar'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import BackButton from '../components/common/BackButton'

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth)
  const location = useLocation()
  if (location.pathname === '/admin/login') return <><div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8"><BackButton fallback="/" /></div><Outlet /></>
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />
      <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <BackButton fallback="/" showOnHome homeLabel="Back to store" />
        <Outlet />
      </div>
    </div>
  )
}
export default AdminLayout