import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider } from './context/AuthContext'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import CustomerLayout from './layouts/CustomerLayout'
import BuilderLayout from './layouts/BuilderLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import Home from './pages/public/Home'
import PropertySearch from './pages/public/PropertySearch'
import PropertyDetails from './pages/public/PropertyDetails'
import ProviderProfile from './pages/public/ProviderProfile'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import About from './pages/public/About'
import Contact from './pages/public/Contact'

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard'
import CustomerProfile from './pages/customer/Profile'
import Favorites from './pages/customer/Favorites'
import MyEnquiries from './pages/customer/MyEnquiries'
import MySiteVisits from './pages/customer/MySiteVisits'
import CustomerNotifications from './pages/customer/Notifications'

// Builder Pages
import BuilderDashboard from './pages/builder/Dashboard'
import BuilderProfilePage from './pages/builder/BuilderProfile'
import Verification from './pages/builder/Verification'
import MyProperties from './pages/builder/MyProperties'
import AddProperty from './pages/builder/AddProperty'
import EditProperty from './pages/builder/EditProperty'
import PropertyImages from './pages/builder/PropertyImages'
import PropertyDocuments from './pages/builder/PropertyDocuments'
import BuilderEnquiries from './pages/builder/Enquiries'
import BuilderSiteVisits from './pages/builder/SiteVisits'
import BuilderNotifications from './pages/builder/Notifications'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminProviders from './pages/admin/Providers'
import AdminVerifications from './pages/admin/Verifications'
import AdminProperties from './pages/admin/Properties'
import AdminPropertyReview from './pages/admin/PropertyReview'
import AdminReports from './pages/admin/Reports'

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute'
import RoleBasedRoute from './components/common/RoleBasedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertySearch />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/providers/:id" element={<ProviderProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Customer Routes */}
          <Route element={<ProtectedRoute><RoleBasedRoute roles={['CUSTOMER']}><CustomerLayout /></RoleBasedRoute></ProtectedRoute>}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
            <Route path="/customer/favorites" element={<Favorites />} />
            <Route path="/customer/enquiries" element={<MyEnquiries />} />
            <Route path="/customer/site-visits" element={<MySiteVisits />} />
            <Route path="/customer/notifications" element={<CustomerNotifications />} />
          </Route>

          {/* Builder Routes */}
          <Route element={<ProtectedRoute><RoleBasedRoute roles={['BUILDER']}><BuilderLayout /></RoleBasedRoute></ProtectedRoute>}>
            <Route path="/builder/dashboard" element={<BuilderDashboard />} />
            <Route path="/builder/profile" element={<BuilderProfilePage />} />
            <Route path="/builder/verification" element={<Verification />} />
            <Route path="/builder/properties" element={<MyProperties />} />
            <Route path="/builder/properties/add" element={<AddProperty />} />
            <Route path="/builder/properties/:id/edit" element={<EditProperty />} />
            <Route path="/builder/properties/:id/images" element={<PropertyImages />} />
            <Route path="/builder/properties/:id/documents" element={<PropertyDocuments />} />
            <Route path="/builder/enquiries" element={<BuilderEnquiries />} />
            <Route path="/builder/site-visits" element={<BuilderSiteVisits />} />
            <Route path="/builder/notifications" element={<BuilderNotifications />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute><RoleBasedRoute roles={['ADMIN']}><AdminLayout /></RoleBasedRoute></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/providers" element={<AdminProviders />} />
            <Route path="/admin/verifications" element={<AdminVerifications />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/properties/:id/review" element={<AdminPropertyReview />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
