import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { Navigate, NavigateFunction, Outlet, useNavigate } from 'react-router'
import { useAuth } from '@/auth'
import { User } from '@/@types/auth'
import { ONBOARDING_PREFIX_PATH } from '@/constants/route.constant'
import { useEffect } from 'react'

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute = () => {
    const { authenticated, user } = useAuth()
    const navigate = useNavigate()
    const pathName = location.pathname

    const getPathName =
        pathName === '/' ? '' : `?${REDIRECT_URL_KEY}=${pathName}`

    useEffect(() => {
        if (authenticated) {
            checkSubscriptionStatus(user, navigate)
        }
    }, [authenticated, user, navigate])

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
    console.log('subscription status', user.subscription_status)
    const BAD_SUBSCRIPTION_STATUSES = [
        'past_due',
        'canceled',
        'incomplete',
        'incomplete_expired',
        'paused',
        'unpaid',
    ]

    const status = user.subscription_status

    if (!status) {
        // No subscription at all — likely new user
        navigate(
            `${ONBOARDING_PREFIX_PATH}/business-onboarding?action=add-subscription`,
        )
    } else if (BAD_SUBSCRIPTION_STATUSES.includes(status)) {
        // Subscription exists but has issues
        navigate(`${ONBOARDING_PREFIX_PATH}/pricing?action=add-subscription`)
    }
}

export default ProtectedRoute
