import { useEffect, useState } from 'react'
import { useAuth } from '@/auth'
import Loading from '@/components/shared/Loading'
import { apiGetLandingPage } from '@/services/AuthService'

const ProxyLanding = () => {
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        const fetchLanding = async () => {
            try {
                const response = await apiGetLandingPage()
                setContent(response)
                setError(null)
            } catch (error) {
                console.error('Failed to fetch landing page:', error)
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Failed to load landing page',
                )
            } finally {
                setLoading(false)
            }
        }

        fetchLanding()
    }, [user])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loading loading={true} />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">
                        Unable to load landing page
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div
            dangerouslySetInnerHTML={{ __html: content }}
            className="w-full min-h-screen"
        />
    )
}

export default ProxyLanding

