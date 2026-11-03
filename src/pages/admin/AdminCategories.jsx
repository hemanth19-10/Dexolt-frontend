import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../features/categories/categoriesSlice'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash } from 'react-icons/fa'

const AdminCategories = () => {
  const dispatch = useDispatch()
  const { categories, loading } = useSelector((state) => state.categories)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', image: '' })

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    let result
    if (editing) {
      result = await dispatch(updateCategory({ id: editing, categoryData: form }))
    } else {
      result = await dispatch(createCategory(form))
    }
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editing ? 'Category updated' : 'Category created')
      setEditing(null)
      setForm({ name: '', description: '', image: '' })
      dispatch(fetchCategories())
    } else {
      toast.error('Failed to save category')
    }
  }

  const handleEdit = (cat) => {
    setEditing(cat._id)
    setForm(cat)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this category?')) {
      await dispatch(deleteCategory(id))
      toast.success('Deleted')
      dispatch(fetchCategories())
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Categories</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit' : 'Add'} Category</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" required />
          <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} className="border rounded px-3 py-2" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="col-span-2 border rounded px-3 py-2" />
          <div className="col-span-2 flex gap-4">
            <button type="submit" className="btn-primary px-4 py-2">
              {editing ? 'Update' : 'Create'}
            </button>
            {editing && <button onClick={() => { setEditing(null); setForm({ name: '', description: '', image: '' }) }} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>
      </div>

      {loading ? <Loader /> : (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-violet-100 text-violet-900">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat._id} className="border-b">
                <td className="p-3">{cat.name}</td>
                <td className="p-3">{cat.description}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => handleEdit(cat)} className="text-blue-500"><FaEdit /></button>
                  <button onClick={() => handleDelete(cat._id)} className="text-red-500"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
export default AdminCategories