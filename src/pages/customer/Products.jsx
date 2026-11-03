import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, fetchCategories } from '../../features/products/productsSlice'
import ProductCard from '../../components/common/ProductCard'
import Loader from '../../components/common/Loader'
import Pagination from '../../components/common/Pagination'
import { useSearchParams } from 'react-router-dom'

const Products = () => {
  const dispatch = useDispatch()
  const { products = [], totalPages = 1, currentPage = 1, loading = false } = useSelector((state) => state.products) || {}
  const { categories = [] } = useSelector((state) => state.categories) || {}
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    keyword: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '',
    page: parseInt(searchParams.get('page')) || 1,
  })

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.keyword) params.set('search', filters.keyword)
    if (filters.category) params.set('category', filters.category)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.sort) params.set('sort', filters.sort)
    params.set('page', filters.page)
    setSearchParams(params, { replace: true })
    dispatch(fetchProducts(params.toString()))
  }, [filters, dispatch, setSearchParams])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }))
  }

  const handlePageChange = (page) => setFilters(prev => ({ ...prev, page }))

  const safeProducts = Array.isArray(products) ? products : []
  const safeCategories = Array.isArray(categories) ? categories : []

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 text-center md:text-left">
        <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Collection</span>
        <h1 className="text-4xl md:text-5xl font-extrabold mt-1">Cleaning, simplified.</h1>
        <p className="mt-3 text-slate-500 max-w-xl">Effective essentials that make keeping your space fresh feel effortless.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4 bg-white p-6 rounded-2xl shadow-md h-fit sticky top-24">
          <h3 className="text-lg font-bold mb-5">Filters</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Search</label>
              <input
                type="text"
                name="keyword"
                value={filters.keyword}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Search products..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              >
                <option value="">All</option>
                {safeCategories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Min</label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="₹0"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Max</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder="₹1000"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Sort by</label>
              <select
                name="sort"
                value={filters.sort}
                onChange={handleFilterChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              >
                <option value="">Default</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>
            <button
              onClick={() => setFilters({ keyword: '', category: '', minPrice: '', maxPrice: '', sort: '', page: 1 })}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl transition"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-slate-500">{safeProducts.length} products found</p>
          </div>
          {loading ? (
            <Loader />
          ) : safeProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-slate-500">No products match your filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <div className="mt-10 flex justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products