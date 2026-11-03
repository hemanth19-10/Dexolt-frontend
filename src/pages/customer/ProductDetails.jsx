import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, clearProduct } from '../../features/products/productsSlice'
import { fetchReviews, createReview, clearReviews } from '../../features/reviews/reviewsSlice'
import { addToCart } from '../../features/cart/cartSlice'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'
import { FaStar, FaMinus, FaPlus } from 'react-icons/fa'

const ProductDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentProduct, loading: productLoading } = useSelector((state) => state.products) || {}
  const { reviews = [], loading: reviewLoading } = useSelector((state) => state.reviews) || {}
  const { user, isAuthenticated } = useSelector((state) => state.auth) || {}
  const isCustomer = isAuthenticated && user?.role === 'customer'
  const [quantity, setQuantity] = useState(1)
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)

  useEffect(() => {
    dispatch(fetchProductById(id))
    dispatch(fetchReviews(id))
    return () => {
      dispatch(clearProduct())
      dispatch(clearReviews())
    }
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (!isCustomer) {
      toast.info(isAuthenticated ? 'Admins can manage products but cannot place orders.' : 'Please login as a customer to order.')
      return
    }
    dispatch(addToCart({ ...currentProduct, quantity }))
    toast.success('Added to cart')
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to review')
      return
    }
    if (!rating || !reviewText.trim()) {
      toast.error('Please provide rating and comment')
      return
    }
    const result = await dispatch(createReview({ productId: id, reviewData: { rating, comment: reviewText } }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Review submitted')
      setReviewText('')
      setRating(0)
      dispatch(fetchReviews(id))
    } else {
      toast.error('Failed to submit review')
    }
  }

  if (productLoading || !currentProduct) return <Loader />

  const { name, images, image, gallery, price, discountPrice, compareAtPrice, description, stock, category } = currentProduct
  const productImage = images?.[0] || image || gallery?.[0] || '/product-placeholder.svg'
  const salePrice = discountPrice || price
  const originalPrice = compareAtPrice || price

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image */}
        <div className="md:w-1/2">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-4 shadow-lg">
            <img
              src={productImage}
              onError={(e) => e.target.src = '/product-placeholder.svg'}
              alt={name}
              className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
            />
          </div>
        </div>
        {/* Info */}
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
          <p className="text-sm text-slate-500 mt-1">Category: {category?.name}</p>
          <div className="flex items-center mt-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(currentProduct.rating || 0) ? 'text-yellow-400' : 'text-slate-300'} />
              ))}
            </div>
            <span className="ml-2 text-sm text-slate-500">({currentProduct.rating || 0})</span>
          </div>
          <div className="mt-4">
            {originalPrice > salePrice ? (
              <>
                <span className="text-3xl font-extrabold text-indigo-600">₹{salePrice}</span>
                <span className="text-lg text-slate-400 line-through ml-3">₹{originalPrice}</span>
                <span className="ml-3 bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
                  Save {Math.round((1 - salePrice / originalPrice) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-extrabold text-indigo-600">₹{price}</span>
            )}
          </div>
          <p className="mt-4 text-slate-700 leading-relaxed">{description}</p>
          <div className="mt-4">
            <span className={`font-semibold ${stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {stock > 0 ? `In stock (${stock} available)` : 'Out of stock'}
            </span>
          </div>
          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="font-semibold">Qty:</span>
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 transition"
              >
                <FaMinus />
              </button>
              <span className="px-6 py-2 font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 transition"
              >
                <FaPlus />
              </button>
            </div>
          </div>
          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              disabled={stock === 0 || !isCustomer}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 disabled:bg-slate-400 transition shadow-lg hover:shadow-xl"
            >
              {isCustomer ? 'Add to cart' : 'Customer ordering only'}
            </button>
            <button className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-full hover:bg-emerald-700 transition shadow-lg hover:shadow-xl">
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        {reviewLoading ? (
          <Loader />
        ) : (
          <>
            {reviews.length === 0 ? (
              <p className="text-slate-500">No reviews yet. Be the first!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-slate-300'} />
                        ))}
                      </div>
                      <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                      <span className="ml-2 text-sm text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-1 text-slate-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitReview} className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-lg mb-4">Write a review</h3>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => {
                    const star = i + 1
                    return (
                      <button
                        type="button"
                        key={i}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        className="text-2xl focus:outline-none"
                      >
                        <FaStar className={star <= (hover || rating) ? 'text-yellow-400' : 'text-slate-300'} />
                      </button>
                    )
                  })}
                </div>
                <textarea
                  rows="3"
                  placeholder="Share your experience..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />
                <button type="submit" className="mt-3 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition">
                  Submit review
                </button>
              </form>
            ) : (
              <p className="mt-6 text-slate-500">Please <a href="/login" className="text-indigo-600 font-semibold">login</a> to leave a review.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ProductDetails