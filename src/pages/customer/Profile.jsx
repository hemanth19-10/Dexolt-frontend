import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react'
import { getMe } from '../../features/auth/authSlice'
import api from '../../api/axios'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user } = useSelector((state) => state.auth) || {}
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.patch('/auth/profile', formData)
      dispatch(getMe())
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">Account</span>
          <h1 className="text-4xl font-extrabold mt-1">Your profile</h1>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
              <input
                name="email"
                value={formData.email}
                readOnly
                className="w-full border border-slate-300 rounded-xl px-4 py-2 bg-slate-50 cursor-not-allowed opacity-70"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md hover:shadow-lg"
            >
              Save changes
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile