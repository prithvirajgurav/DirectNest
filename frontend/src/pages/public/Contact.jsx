import { useState } from 'react'
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi'
import { toast } from 'react-toastify'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please complete all required fields')
      return
    }
    setSent(true)
    toast.success('Thank you! Your message has been received.')
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            Contact Support & Inquiries
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
            Have questions about listing your property, account verification, or finding a home? Our team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="bg-indigo-700 text-white rounded-3xl p-8 flex flex-col justify-between shadow-lg">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6 text-indigo-100 text-sm">
                <div className="flex items-start gap-4">
                  <FiMapPin className="h-6 w-6 text-indigo-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">Headquarters</h3>
                    <p>DirectNest Tech Hub, Shivaji University Road, Kolhapur, Maharashtra 416004</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FiMail className="h-6 w-6 text-indigo-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">Email Us</h3>
                    <p>support@directnest.com</p>
                    <p>partners@directnest.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <FiPhone className="h-6 w-6 text-indigo-300 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white">Call Us</h3>
                    <p>+91 (0231) 260-9000</p>
                    <p>Mon - Sat (9:00 AM - 7:00 PM IST)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-indigo-600/50 text-xs text-indigo-200">
              DirectNest — 100% Brokerage Free Real Estate Marketplace
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            {sent ? (
              <div className="py-16 text-center">
                <FiCheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
                  Thank you for reaching out. A DirectNest support specialist will respond to {form.email} within 24 business hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false)
                    setForm({ name: '', email: '', phone: '', subject: '', message: '' })
                  }}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="rahul@example.com"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Listing assistance, partnership"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Message *</label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition"
                >
                  <FiSend className="h-4 w-4" />
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
