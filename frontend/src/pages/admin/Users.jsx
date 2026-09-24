import { useState, useEffect } from 'react'
import { FiUsers, FiSearch, FiUserCheck, FiUserX, FiMail, FiPhone } from 'react-icons/fi'
import { adminApi } from '../../api/adminApi'
import { toast } from 'react-toastify'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getUsers({
        page: 0,
        size: 50,
        role: roleFilter || undefined,
        search: search || undefined
      })
      const data = response.data?.data || response.data
      setUsers(data?.content || (Array.isArray(data) ? data : []))
    } catch (error) {
      console.error('Failed to load users:', error)
      toast.error('Failed to load user accounts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  const handleToggleStatus = async (user) => {
    const action = user.active ? 'suspend' : 'activate'
    if (!window.confirm(`Are you sure you want to ${action} ${user.email}?`)) return

    try {
      if (user.active) {
        await adminApi.suspendUser(user.id)
        toast.info(`User ${user.email} suspended`)
      } else {
        await adminApi.activateUser(user.id)
        toast.success(`User ${user.email} activated`)
      }
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} user`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor registered buyer, builder, and administrator accounts
          </p>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            fetchUsers()
          }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / email..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <FiSearch className="absolute left-3 top-2.5 text-gray-400 h-3.5 w-3.5" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { label: 'All Users', value: '' },
          { label: 'Buyers / Customers', value: 'CUSTOMER' },
          { label: 'Builders / Owners', value: 'BUILDER' },
          { label: 'Administrators', value: 'ADMIN' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRoleFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              roleFilter === tab.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading user accounts...</div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Contact</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Joined</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900 text-sm">{u.fullName}</div>
                      <div className="text-gray-400 text-[11px]">{u.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        u.role === 'BUILDER' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {u.phone || '—'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        u.active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {u.active ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${
                            u.active
                              ? 'text-rose-600 hover:bg-rose-50 border border-rose-200'
                              : 'text-emerald-600 hover:bg-emerald-50 border border-emerald-200'
                          }`}
                        >
                          {u.active ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <FiUsers className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-sm text-gray-500">No users found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
