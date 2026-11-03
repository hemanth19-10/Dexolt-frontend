import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CustomerRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user?.role !== 'customer') return <Navigate to="/admin" replace />

  return children
}

export default CustomerRoute
