import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ title = 'No data found', message = '', icon: Icon = FiInbox, action }) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
