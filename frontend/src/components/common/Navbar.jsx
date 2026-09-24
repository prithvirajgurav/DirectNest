import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiHome, FiSearch, FiUser, FiLogOut, FiMenu, FiX, FiLayers } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from './NotificationBell'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setUserDropdownOpen(false)
    navigate('/')
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    if (user.role === 'ADMIN') return '/admin/dashboard'
    if (user.role === 'BUILDER') return '/builder/dashboard'
    return '/customer/dashboard'
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
                DN
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none">DirectNest</span>
                <span className="text-[10px] text-gray-500 font-medium">Find Property. Connect Directly.</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors">
                Home
              </Link>
              <Link to="/properties" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                Browse Properties
              </Link>
              <Link to="/about" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <NotificationBell />

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="max-w-[120px] truncate">{user?.fullName}</span>
                    <span className="badge badge-info text-[10px] uppercase">{user?.role}</span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-fadeIn"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FiLayers className="h-4 w-4" /> Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary text-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-900 hover:bg-gray-50"
          >
            Home
          </Link>
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50"
          >
            Browse Properties
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-600 hover:bg-gray-50"
          >
            Contact
          </Link>

          <div className="pt-4 border-t border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-primary-600 hover:bg-primary-50"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary text-center text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
