import { NavLink } from 'react-router-dom'
import { FaTachometerAlt, FaBox, FaTags, FaShoppingBag, FaUsers, FaGift, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { useTheme } from '../../app/ThemeContext'

const Sidebar = () => {
  const dispatch = useDispatch()
  const { isDark, toggleTheme } = useTheme()
  const links = [
    { to: '/admin', icon: FaTachometerAlt, label: 'Dashboard' },
    { to: '/admin/products', icon: FaBox, label: 'Products' },
    { to: '/admin/categories', icon: FaTags, label: 'Categories' },
    { to: '/admin/orders', icon: FaShoppingBag, label: 'Orders' },
    { to: '/admin/customers', icon: FaUsers, label: 'Customers' },
    { to: '/admin/coupons', icon: FaGift, label: 'Coupons' },
  ]
  return (
    <div className="sticky top-0 hidden h-screen w-64 flex-col bg-[#211d4d] text-white md:flex">
      <div className="border-b border-violet-900 p-6"><div className="flex items-center gap-2 text-xl font-black">dexolt<span className="text-orange-400">.</span></div><p className="mt-1 text-xs text-violet-200/60">Operations workspace</p></div>
      <nav className="flex-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `mx-3 flex items-center rounded-xl px-4 py-3 text-sm font-semibold text-violet-200/70 hover:bg-violet-900/60 hover:text-white ${isActive ? 'bg-brand-blue text-white shadow-lg shadow-violet-950' : ''}`
            }
          >
            <Icon className="mr-3" />
            {label}
          </NavLink>
        ))}
      </nav>
      <button type="button" onClick={toggleTheme} className="mx-3 mb-3 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-violet-200/70 hover:bg-violet-900/60 hover:text-white" aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
        {isDark ? <FaSun /> : <FaMoon />} {isDark ? 'Light mode' : 'Dark mode'}
      </button>
      <button onClick={() => dispatch(logout())} className="flex items-center border-t border-violet-900 px-6 py-4 text-sm font-semibold text-violet-200/70 hover:text-white">
        <FaSignOutAlt className="mr-3" /> Logout
      </button>
    </div>
  )
}
export default Sidebar