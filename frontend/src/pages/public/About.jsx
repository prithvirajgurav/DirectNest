import { FiShield, FiUsers, FiAward, FiCheckCircle, FiTarget, FiHeart } from 'react-icons/fi'

export default function About() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            About <span className="text-yellow-300">DirectNest</span>
          </h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            Democratizing Indian real estate by connecting property seekers directly with verified builders and owners — 100% brokerage free.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase mb-4">
              Our Vision
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Transparent, Direct, and Trustworthy Real Estate
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Traditional real estate is clouded by middleman commissions, unverified listings, duplicate ads, and opaque pricing.
            </p>
            <p className="text-gray-600 leading-relaxed">
              DirectNest was built with a single objective: empower home buyers and tenants to discover verified properties and communicate directly with real builders and property owners.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
              <FiShield className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-black text-gray-900">100%</div>
              <div className="text-xs text-gray-600 font-semibold mt-1">Verified Properties</div>
            </div>
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <FiCheckCircle className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-black text-gray-900">₹0</div>
              <div className="text-xs text-gray-600 font-semibold mt-1">Brokerage Fee</div>
            </div>
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
              <FiUsers className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-black text-gray-900">Direct</div>
              <div className="text-xs text-gray-600 font-semibold mt-1">Owner Contact</div>
            </div>
            <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100 text-center">
              <FiAward className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-black text-gray-900">RERA</div>
              <div className="text-xs text-gray-600 font-semibold mt-1">Compliant Builders</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-12">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Zero Brokerage Guarantee</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We believe you shouldn't have to pay hefty brokerage cuts just to find or list your own dream property.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Strict Verification Standards</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every builder undergoes credential validation, and each property listing requires verification approval before appearing in public searches.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Direct Communication</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Direct enquiries, site visit scheduling, and transparent builder ratings provide smooth, direct negotiations.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
