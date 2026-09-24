import { Outlet, Link, useNavigate } from 'react-router-dom'
import { FiHome, FiUser, FiCheckSquare, FiList, FiPlusCircle, FiMail, FiCalendar, FiBell, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function BuilderLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { path: '/builder/dashboard', icon: FiHome, label: 'Dashboard' },
    { path: '/builder/profile', icon: FiUser, label: 'Provider Profile' },
    { path: '/builder/verification', icon: FiCheckSquare, label: 'Verification' },
    { path: '/builder/properties', icon: FiList, label: 'My Properties' },
    { path: '/builder/properties/add', icon: FiPlusCircle, label: 'Add Property' },
    { path: '/builder/enquiries', icon: FiMail, label: 'Enquiries' },
    { path: '/builder/site-visits', icon: FiCalendar, label: 'Site Visits' },
    { path: '/builder/notifications', icon: FiBell, label: 'Notifications' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-2 text-primary-600">
            <div className="h-9 w-9 rounded-lg bg-primary-600 text-white flex items-center justify-center font-extrabold text-base">
              DN
            </div>
            <span className="text-gray-900 font-bold text-xl tracking-tight">Direct<span className="text-primary-600">Nest</span></span>
          </Link>
          <p className="mt-2 text-xs text-gray-500">Builder & Owner Portal</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <FiLogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
