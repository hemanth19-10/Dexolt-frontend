import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaLeaf, FaFlask, FaTint, FaStar } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../features/products/productsSlice'
import { fetchCategories } from '../../features/categories/categoriesSlice'
import ProductCard from '../../components/common/ProductCard'
import CategoryCard from '../../components/common/CategoryCard'
import Loader from '../../components/common/Loader'
import dexoltImage from '../../assets/dexoltimage.png'

const Home = () => {
  const dispatch = useDispatch()
  const { products = [], loading: productsLoading = false } = useSelector((state) => state.products) || {}
  const { categories = [], loading: categoriesLoading = false } = useSelector((state) => state.categories) || {}

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const featured = Array.isArray(products) ? products.filter(p => p.featured).slice(0, 4) : []
  const bestSellers = Array.isArray(products) ? products.filter(p => p.bestSeller).slice(0, 4) : []
  const newArrivals = Array.isArray(products) ? products.filter(p => p.newArrival).slice(0, 4) : []

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4c1d95] text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <span className="inline-block bg-orange-500/20 text-orange-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">✨ New arrivals</span>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Clean smarter, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-400">live better</span>
              </h1>
              <p className="mt-4 text-lg text-slate-300 max-w-lg">
                Thoughtfully crafted cleaning essentials for a fresher, healthier home.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to="/products" className="group inline-flex items-center gap-2 bg-white text-[#1e1b4b] px-8 py-3.5 rounded-full font-bold hover:bg-orange-400 hover:text-white transition-all duration-300 shadow-lg">
                  Shop now <FaArrowRight className="group-hover:translate-x-1 transition" />
                </Link>
                <Link to="/about" className="inline-flex items-center gap-2 border border-white/30 hover:border-white px-8 py-3.5 rounded-full font-medium transition-all duration-300">
                  Learn more
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
                <span><FaStar className="inline text-yellow-400 mr-1.5" /> 4.9 ★ (2k+ reviews)</span>
                <span>🌿 Eco‑friendly</span>
                <span>🚚 Free shipping over ₹499</span>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src={dexoltImage}
                onError={(e) => e.target.src = '/product-placeholder.svg'}
                alt="Dexolt logo"
                className="max-w-full h-auto drop-shadow-2xl hover:scale-105 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Categories</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">Shop by category</h2>
            </div>
            <Link to="/products" className="text-indigo-600 font-semibold hover:text-indigo-800 transition hidden sm:block">
              View all →
            </Link>
          </div>
          {categoriesLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(0, 6).map(cat => (
                <CategoryCard key={cat._id} category={cat} />
              ))}
              {categories.length === 0 && <p className="col-span-full text-center text-gray-500">No categories</p>}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Curated</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">Featured essentials</h2>
            </div>
            <Link to="/products" className="text-indigo-600 font-semibold hover:text-indigo-800 transition">
              See all →
            </Link>
          </div>
          {productsLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
              {featured.length === 0 && <p className="col-span-full text-center text-gray-500">No featured products</p>}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Bestsellers</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">Most loved</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map(p => <ProductCard key={p._id} product={p} />)}
            {bestSellers.length === 0 && <p className="col-span-full text-center text-gray-500">No best sellers</p>}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Just in</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-1">New arrivals</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
            {newArrivals.length === 0 && <p className="col-span-full text-center text-gray-500">No new arrivals</p>}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 text-center">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Why Dexolt</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-1">Made with intention</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <FaLeaf className="text-4xl text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Eco‑friendly</h3>
              <p className="text-slate-600 mt-2">Safe for your family and the planet.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <FaFlask className="text-4xl text-indigo-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Lab tested</h3>
              <p className="text-slate-600 mt-2">Proven effectiveness against tough stains.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300">
              <FaTint className="text-4xl text-cyan-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Water‑soluble</h3>
              <p className="text-slate-600 mt-2">Concentrated formulas that save water.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-1">What our customers say</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <p className="text-slate-700 italic">“Dexolt's floor cleaner leaves my tiles shining!”</p>
              <p className="mt-4 font-semibold">— Sarah K.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <p className="text-slate-700 italic">“The hand wash is so gentle and smells amazing.”</p>
              <p className="mt-4 font-semibold">— John D.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <p className="text-slate-700 italic">“I love the washing liquid – clothes come out fresh.”</p>
              <p className="mt-4 font-semibold">— Emily R.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home