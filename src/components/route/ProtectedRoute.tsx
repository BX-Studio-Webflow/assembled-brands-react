import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import {
    Navigate,
    NavigateFunction,
    Outlet,
    useNavigate,
    useLocation,
} from 'react-router'
import { useAuth } from '@/auth'
import { User } from '@/@types/auth'
import { ONBOARDING_PREFIX_PATH } from '@/constants/route.constant'
import { useEffect, useRef } from 'react'
import { useSessionUser } from '@/store/authStore'
import useSWR from 'swr'
import { apiGetBusiness } from '@/services/BusinessService'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
    const { authenticated, user } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const pathName = location.pathname
    const setUser = useSessionUser((state) => state.setUser)
    const hasUpdated = useRef(false)

    // Fetch business data
    const { data: businessData } = useSWR(
        authenticated && user ? '/business/my' : null,
        apiGetBusiness,
        {
            revalidateOnFocus: false,
        },
    )

    const getPathName =
        pathName === '/' ? '' : `?${REDIRECT_URL_KEY}=${pathName}`

    useEffect(() => {
        if (authenticated && user) {
            const currentPath = location.pathname

            // Don't redirect if we're already on the onboarding or pricing pages
            if (currentPath.includes(ONBOARDING_PREFIX_PATH)) {
                return
            }

            // Only update if we haven't updated yet and have business data
            if (!hasUpdated.current && businessData) {
                const { user } = businessData
                setUser({
                    ...user,
                })

                hasUpdated.current = true

                //check subscription status after updating user data
                checkSubscriptionStatus(user, navigate)
            }
        }
    }, [
        authenticated,
        user,
        navigate,
        location.pathname,
        setUser,
        businessData,
    ])

    if (!authenticated) {
        return (
            <Navigate
                replace
                to={`${unAuthenticatedEntryPath}${getPathName}`}
            />
        )
    }

    return <Outlet />
}

const checkSubscriptionStatus = (user: User, navigate: NavigateFunction) => {
    const BAD_SUBSCRIPTION_STATUSES = [
        'past_due',
        'canceled',
        'incomplete',
        'incomplete_expired',
        'paused',
        'unpaid',
    ]

    const status = user.subscription_status

    if (!status || BAD_SUBSCRIPTION_STATUSES.includes(status)) {
        navigate(`${ONBOARDING_PREFIX_PATH}/pricing?action=add-subscription`)
    }
}

export default ProtectedRoute
