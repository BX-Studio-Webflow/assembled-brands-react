import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/lib/auth'

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-offwhite">
                <span className="ab-label text-ink/60">Loading…</span>
            </div>
        )
    }

    return isAuthenticated ? <Outlet /> : <Navigate replace to="/login" />
}
