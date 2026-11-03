import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllCoupons, createCoupon, updateCoupon } from '../../features/coupons/couponsSlice'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'
import { FaEdit } from 'react-icons/fa'

const AdminCoupons = () => {
  const dispatch = useDispatch()
  const { coupons, loading } = useSelector((state) => state.coupons)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    expiresAt: '',
    usageLimit: '',
    isActive: true
  })

  useEffect(() => {
    dispatch(fetchAllCoupons())
  }, [dispatch])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let result
    if (editing) {
      result = await dispatch(updateCoupon({ id: editing, couponData: form }))
    } else {
      result = await dispatch(createCoupon(form))
    }
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editing ? 'Coupon updated' : 'Coupon created')
      setEditing(null)
      setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', expiresAt: '', usageLimit: '', isActive: true })
      dispatch(fetchAllCoupons())
    } else {
      toast.error('Failed to save coupon')
    }
  }

  const handleEdit = (coupon) => {
    setEditing(coupon._id)
    setForm(coupon)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Coupons</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit' : 'Create'} Coupon</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="code" placeholder="Coupon Code" value={form.code} onChange={handleChange} className="border rounded px-3 py-2" required />
          <select name="discountType" value={form.discountType} onChange={handleChange} className="border rounded px-3 py-2">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          <input name="discountValue" type="number" placeholder="Discount Value" value={form.discountValue} onChange={handleChange} className="border rounded px-3 py-2" required />
          <input name="minOrderAmount" type="number" placeholder="Min Order Amount" value={form.minOrderAmount} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="expiresAt" type="datetime-local" value={form.expiresAt} onChange={handleChange} className="border rounded px-3 py-2" />
          <input name="usageLimit" type="number" placeholder="Usage Limit" value={form.usageLimit} onChange={handleChange} className="border rounded px-3 py-2" />
          <div className="flex items-center gap-2">
            <label>
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} /> Active
            </label>
          </div>
          <div className="col-span-2 flex gap-4">
            <button type="submit" className="btn-primary px-4 py-2">
              {editing ? 'Update' : 'Create'}
            </button>
            {editing && <button onClick={() => { setEditing(null); setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', expiresAt: '', usageLimit: '', isActive: true }) }} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>}
          </div>
        </form>
      </div>

      {loading ? <Loader /> : (
        <table className="w-full bg-white rounded-lg shadow overflow-hidden">
          <thead className="bg-violet-100 text-violet-900">
            <tr>
              <th className="p-3 text-left">Code</th>
              <th className="p-3 text-left">Discount</th>
              <th className="p-3 text-left">Min Order</th>
              <th className="p-3 text-left">Expires</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c._id} className="border-b">
                <td className="p-3 font-mono">{c.code}</td>
                <td className="p-3">{c.discountValue}{c.discountType === 'percentage' ? '%' : '₹'}</td>
                <td className="p-3">{c.minOrderAmount ? `₹${c.minOrderAmount}` : '-'}</td>
                <td className="p-3">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : '-'}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-sm ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => handleEdit(c)} className="text-blue-500"><FaEdit /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
export default AdminCoupons