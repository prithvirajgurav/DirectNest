import { FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi'

export default function VerificationBadge({ status, size = 'sm' }) {
  const config = {
    VERIFIED: { icon: FiCheckCircle, text: 'Verified', className: 'text-green-600' },
    APPROVED: { icon: FiCheckCircle, text: 'Verified', className: 'text-green-600' },
    PENDING: { icon: FiClock, text: 'Pending', className: 'text-yellow-600' },
    PENDING_VERIFICATION: { icon: FiClock, text: 'Pending Review', className: 'text-yellow-600' },
    UNDER_REVIEW: { icon: FiClock, text: 'Under Review', className: 'text-blue-600' },
    REJECTED: { icon: FiAlertCircle, text: 'Rejected', className: 'text-red-600' },
    SUSPENDED: { icon: FiAlertCircle, text: 'Suspended', className: 'text-red-600' },
  }

  const c = config[status] || config.PENDING
  const Icon = c.icon
  const sizeClass = size === 'sm' ? 'text-sm' : 'text-base'

  return (
    <span className={`inline-flex items-center gap-1 ${c.className} ${sizeClass}`}>
      <Icon className="h-4 w-4" />
      <span className="font-medium">{c.text}</span>
    </span>
  )
}
