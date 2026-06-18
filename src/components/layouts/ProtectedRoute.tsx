import { Navigate, Outlet } from 'react-router'
import AuthGateSkeleton from '@/components/skeletons/AuthGateSkeleton'
import { useAuth } from '@/lib/auth'

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return <AuthGateSkeleton />
    }

    return isAuthenticated ? <Outlet /> : <Navigate replace to="/login" />
}
