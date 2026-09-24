import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiShield, FiHeart } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                DN
              </div>
              <span className="text-xl font-bold text-white tracking-tight">DirectNest</span>
            </div>
            <p className="text-sm text-gray-400">
              Find Property. Connect Directly.
              Connecting home buyers directly with verified builders and owners without brokerage fees.
            </p>
            <div className="flex items-center gap-2 text-xs text-primary-400">
              <FiShield className="h-4 w-4" />
              <span>100% Verified Listings & Providers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">Browse Properties</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Popular Searches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties?propertyType=BHK1" className="hover:text-white transition-colors">1 BHK Apartments</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=BHK2" className="hover:text-white transition-colors">2 BHK Apartments</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=BHK3" className="hover:text-white transition-colors">3 BHK Luxury Flats</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=BHK4" className="hover:text-white transition-colors">4 BHK & Villas</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FiMapPin className="h-4 w-4 text-primary-500 shrink-0" />
                <span>Tarabai Park, Kolhapur, Maharashtra 416003</span>
              </li>
              <li className="flex items-center gap-2">
                <FiPhone className="h-4 w-4 text-primary-500 shrink-0" />
                <span>+91 98220 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <FiMail className="h-4 w-4 text-primary-500 shrink-0" />
                <span>support@directnest.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} DirectNest Marketplace. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Security Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
