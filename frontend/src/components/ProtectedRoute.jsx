import { Navigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getMe } from '../store/slices/authSlice'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const location = useLocation()

  // Validate token on initial load if we have a token but no user data
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !user) {
      dispatch(getMe())
    }
  }, [dispatch, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

