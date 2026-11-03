import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaChevronDown, FaMoon, FaSun } from 'react-icons/fa'
import { useTheme } from '../../app/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { totalQuantity } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleSearch = (event) => {
    event.preventDefault()
    const value = search.trim()
    navigate(value ? `/products?search=${encodeURIComponent(value)}` : '/products')
    setIsOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-indigo-950/30 bg-gradient-to-r from-[#211d4d] via-[#312e81] to-[#5146c7] text-white shadow-lg shadow-indigo-950/10 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="src\assets\LogoDexolt.png" alt="Dexolt" className="h-10 w-10 rounded-xl shadow-lg shadow-black/20" />
          <span className="text-xl font-black tracking-tight text-white">Dexolt<span className="text-orange-300">.</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 md:flex">
          <Link to="/products" className="font-semibold text-indigo-100 hover:text-white">Shop</Link>
          <Link to="/about" className="font-semibold text-indigo-100 hover:text-white">Our story</Link>
          <Link to="/contact" className="font-semibold text-indigo-100 hover:text-white">Contact</Link>
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={13} />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" className="w-52 rounded-full border border-white/20 bg-white/10 px-4 py-2 pl-10 text-sm text-white placeholder:text-indigo-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30" />
          </form>
          {user?.role !== 'admin' && (
            <Link to="/cart" className="relative">
              <FaShoppingCart size={20} className="text-indigo-100 hover:text-white" />
              {totalQuantity > 0 && (
                <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-brand-green text-xs text-white">
                  {totalQuantity}
                </span>
              )}
            </Link>
          )}
          <button type="button" onClick={toggleTheme} className="theme-toggle" aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
            {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
          {isAuthenticated ? (
            <div className="group relative" onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}>
              <button onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} className="flex items-center gap-2 font-semibold text-white">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-orange-200"><FaUser size={13} /></span>
                <span>{user?.name?.split(' ')[0]}</span><FaChevronDown size={10} />
              </button>
              <div className={`absolute right-0 top-full w-48 pt-2 ${profileOpen ? 'block' : 'hidden'}`}>
                <div className="rounded-xl border border-slate-200 bg-white py-2 text-slate-700 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800">Profile</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800">Admin</Link>
                  )}
                  {user?.role === 'customer' && <Link to="/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800">Orders</Link>}
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800">Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary rounded-full px-5 py-2">Sign in</Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="space-y-3 border-t border-white/10 bg-[#211d4d] p-5 md:hidden">
          <Link to="/products" className="block font-semibold text-indigo-100">Shop</Link>
          <Link to="/about" className="block font-semibold text-indigo-100">Our story</Link>
          <Link to="/contact" className="block font-semibold text-indigo-100">Contact</Link>
          <form onSubmit={handleSearch} className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={13} />
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-3 pl-10 text-sm text-white placeholder:text-indigo-200 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30" />
          </form>
          <button type="button" onClick={toggleTheme} className="theme-toggle w-full justify-center" aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
            {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="block">Profile</Link>
              {user?.role === 'customer' && <Link to="/orders" className="block">Orders</Link>}
              {user?.role === 'admin' && <Link to="/admin" className="block">Open admin panel</Link>}
              <button onClick={handleLogout} className="block w-full text-left">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary block rounded-full text-center">Sign in</Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar