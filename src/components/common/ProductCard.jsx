import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../features/cart/cartSlice'
import { FaStar, FaShoppingCart } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const ProductCard = ({ product }) => {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const canOrder = isAuthenticated && user?.role === 'customer'
  const { _id, name, images, image, gallery, price, discountPrice, compareAtPrice, rating, stock } = product
  const salePrice = discountPrice || price
  const originalPrice = compareAtPrice || price
  const hasDiscount = originalPrice > salePrice
  const imageUrl = images?.[0] || image || gallery?.[0] || '/product-placeholder.svg'

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-100">
      <Link to={`/product/${_id}`} className="block overflow-hidden">
        <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50">
          <img
            src={imageUrl}
            onError={(e) => e.target.src = '/product-placeholder.svg'}
            alt={name}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
              SALE
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${_id}`}>
          <h3 className="text-base font-bold text-slate-800 truncate hover:text-indigo-600 transition">
            {name}
          </h3>
        </Link>
        <div className="flex items-center mt-1">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.round(rating || 0) ? 'text-yellow-400' : 'text-slate-300'} />
            ))}
          </div>
          <span className="ml-2 text-xs text-slate-500">{rating ? Number(rating).toFixed(1) : 'New'}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-xl font-extrabold text-indigo-600">₹{salePrice}</span>
              <span className="text-sm text-slate-400 line-through">₹{originalPrice}</span>
            </>
          ) : (
            <span className="text-xl font-extrabold text-indigo-600">₹{price}</span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={`text-xs font-semibold ${stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {stock > 0 ? 'In stock' : 'Out of stock'}
          </span>
          <button
            onClick={() => {
              if (!canOrder) {
                toast.info(isAuthenticated ? 'Admins can manage products but cannot place orders.' : 'Please login as a customer to order.')
                return
              }
              dispatch(addToCart(product))
            }}
            disabled={stock === 0 || !canOrder}
            className="h-10 w-10 grid place-items-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-300 transition-all duration-200 shadow-md hover:shadow-lg"
            aria-label={canOrder ? `Add ${name} to cart` : 'Customer ordering only'}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard