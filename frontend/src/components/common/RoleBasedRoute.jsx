import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RoleBasedRoute({ roles, children }) {
  const { user } = useAuth()

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
