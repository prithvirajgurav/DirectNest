import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiAlertCircle } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [role, setRole] = useState('CUSTOMER') // CUSTOMER or BUILDER
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    // Builder specific
    businessName: '',
    providerType: 'BUILDER',
    experienceYears: '',
    city: '',
    state: 'Maharashtra',
    reraNumber: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }

    if (role === 'BUILDER') {
      if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role
      }

      if (role === 'BUILDER') {
        payload.businessName = formData.businessName
        payload.providerType = formData.providerType
        payload.experienceYears = formData.experienceYears ? parseInt(formData.experienceYears, 10) : 0
        payload.city = formData.city
        payload.state = formData.state
        payload.reraNumber = formData.reraNumber
      }

      await register(payload)
      toast.success('Registration successful! Welcome to DirectNest.')

      if (role === 'BUILDER') {
        navigate('/builder/dashboard')
      } else {
        navigate('/customer/dashboard')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
      setErrors({ submit: message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Create Your Account
            </h2>
            <p className="text-gray-600">
              Join DirectNest to find or list verified properties
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-100 rounded-xl mb-8">
            <button
              type="button"
              onClick={() => setRole('CUSTOMER')}
              className={`py-3 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${
                role === 'CUSTOMER'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiUser className="h-4 w-4" />
              Property Buyer / Tenant
            </button>
            <button
              type="button"
              onClick={() => setRole('BUILDER')}
              className={`py-3 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2 ${
                role === 'BUILDER'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiBriefcase className="h-4 w-4" />
              Builder / Owner
            </button>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`block w-full pl-11 pr-4 py-2.5 border ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  } rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-4 py-2.5 border ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <FiPhone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`block w-full pl-11 pr-4 py-2.5 border ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    } rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Password * (min 6 characters)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-11 pr-4 py-2.5 border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Create a strong password"
                />
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Builder Specific Fields */}
            {role === 'BUILDER' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Builder / Business Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Business / Company Name *
                    </label>
                    <input
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleChange}
                      className={`block w-full px-3.5 py-2.5 border ${
                        errors.businessName ? 'border-red-300' : 'border-gray-300'
                      } rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="e.g. Acme Builders"
                    />
                    {errors.businessName && <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Account Type
                    </label>
                    <select
                      name="providerType"
                      value={formData.providerType}
                      onChange={handleChange}
                      className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="BUILDER">Builder / Developer</option>
                      <option value="OWNER">Individual Owner</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Experience (Years)
                    </label>
                    <input
                      name="experienceYears"
                      type="number"
                      min="0"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. 10"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      className={`block w-full px-3.5 py-2.5 border ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      } rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      placeholder="e.g. Kolhapur"
                    />
                    {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      RERA Number (Optional)
                    </label>
                    <input
                      name="reraNumber"
                      type="text"
                      value={formData.reraNumber}
                      onChange={handleChange}
                      className="block w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="P52800012345"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'BUILDER' ? 'Builder' : 'Buyer'}`}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
