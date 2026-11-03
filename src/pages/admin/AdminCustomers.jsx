import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCustomers, toggleCustomerStatus } from '../../features/admin/adminSlice'
import Loader from '../../components/common/Loader'
import { toast } from 'react-toastify'

const AdminCustomers = () => {
  const dispatch = useDispatch()
  const { customers, loading, error } = useSelector((state) => state.admin)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    const result = await dispatch(toggleCustomerStatus({ id, status: newStatus }))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Customer status updated')
      dispatch(fetchCustomers())
    } else {
      toast.error('Update failed')
    }
  }

  const filtered = customers?.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  ) || []

  return (
    <div className="mx-auto max-w-7xl"><p className="eyebrow">Audience</p><h1 className="mb-8 mt-2 text-4xl">Customers</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="field w-full md:w-96"
        />
      </div>
      {loading ? <Loader /> : error ? (
        <p className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
      ) : (
        <div className="surface overflow-x-auto">
          <table className="w-full">
            <thead className="bg-violet-100 text-violet-900">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="5" className="p-6 text-center text-slate-500">No customers found.</td></tr>
              ) : filtered.map(user => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone || '-'}</td>
                  <td className="p-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${user.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {user.isActive !== false ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleToggle(user._id, user.isActive !== false ? 'active' : 'inactive')}
                      className={`rounded-lg px-3 py-2 text-xs font-bold text-white ${user.isActive !== false ? 'bg-red-500 hover:bg-red-700' : 'bg-brand-green hover:bg-teal-700'}`}
                    >
                      {user.isActive !== false ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
export default AdminCustomers