import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../features/products/productsSlice'
import { fetchCategories } from '../../features/products/productsSlice'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash } from 'react-icons/fa'

const AdminProducts = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)
  const { categories } = useSelector((state) => state.products) // already fetched
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    name: '', description: '', price: '', compareAtPrice: '', stock: '', category: '', image: '', featured: false, bestSeller: false, newArrival: false
  })

  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let result
    if (editing) {
      result = await dispatch(updateProduct({ id: editing, productData: form }))
    } else {
      result = await dispatch(createProduct(form))
    }
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editing ? 'Product updated' : 'Product created')
      setEditing(null)
      setForm({ name: '', description: '', price: '', compareAtPrice: '', stock: '', category: '', image: '', featured: false, bestSeller: false, newArrival: false })
      dispatch(fetchProducts())
    } else {
      toast.error('Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditing(product._id)
    setForm({ ...product, image: product.image || product.images?.[0] || product.gallery?.[0] || '', bestSeller: Boolean(product.bestSeller), newArrival: Boolean(product.newArrival) })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await dispatch(deleteProduct(id))
      toast.success('Deleted')
      dispatch(fetchProducts())
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit' : 'Add'} Product</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} className="border rounded px-3 py-2" required />
          <input name="compareAtPrice" type="number" placeholder="Compare-at Price" value={form.compareAtPrice} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} className="border rounded px-3 py-2" required />
          <select name="category" value={form.category} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
          <input name="image" type="url" placeholder="Image URL" value={form.image} onChange={handleChange} className="border rounded px-3 py-2" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border rounded px-3 py-2" />
          <div className="flex items-center gap-4">
            <label><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Featured</label>
            <label><input type="checkbox" name="bestSeller" checked={form.bestSeller} onChange={handleChange} /> Best seller</label>
            <label><input type="checkbox" name="newArrival" checked={form.newArrival} onChange={handleChange} /> New arrival</label>
          </div>
          <div className="col-span-2 flex gap-4">
            <button type="submit" className="btn-primary px-4 py-2">
              {editing ? 'Update' : 'Create'}
            </button>
            {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', compareAtPrice: '', stock: '', category: '', image: '', featured: false, bestSeller: false, newArrival: false }) }} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>
      </div>

      {loading ? <Loader /> : (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-violet-100 text-violet-900">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-b">
                <td className="p-3">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-500"><FaEdit /></button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-500"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
export default AdminProducts