import { lazy, Suspense, useEffect, useState } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import SettingsMenu from './components/SettingsMenu'
import SettingMobileMenu from './components/SettingMobileMenu'
import useResponsive from '@/utils/hooks/useResponsive'
import { useSettingsStore } from './store/settingsStore'
import { Notification as NotificationComponent } from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import useSWR from 'swr'
import { apiSaveStripeOauthState } from '@/services/AuthService'
import { AxiosError } from 'axios'

const Profile = lazy(() => import('./components/SettingsProfile'))
const Security = lazy(() => import('./components/SettingsSecurity'))
const Notification = lazy(() => import('./components/SettingsNotification'))
const Billing = lazy(() => import('./components/SettingsBilling'))
const Integration = lazy(() => import('./components/SettingIntegration'))
const Team = lazy(() => import('./components/SettingsTeam'))
const Business = lazy(() => import('./components/SettingsBusiness'))

const Settings = () => {
    const { currentView } = useSettingsStore()
    const { smaller, larger } = useResponsive()
    const [params, setParams] = useState<{
        code: string
        state: string
    }>({
        state: '',
        code: '',
    })

    useEffect(() => {
        // Check if we're on the callback URL with a code
        const urlParams = new URLSearchParams(window.location.search)
        const state = urlParams.get('state')
        const code = urlParams.get('code')
        if (state && code) {
            setParams({ state, code })
        }
    }, [])

    const { data, error } = useSWR(
        params.code && params.state
            ? `/stripe/connect/oauth/callback?code=${params.code}&state=${params.state}`
            : null,
        () =>
            apiSaveStripeOauthState({
                code: params.code,
                state: params.state,
            }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    useEffect(() => {
        if (params.code && params.state) {
            if (data) {
                toast.push(
                    <NotificationComponent type="success">
                        Please wait while we finalize your connection to stripe.
                    </NotificationComponent>,
                    { placement: 'top-center' },
                )
            }
            if (error) {
                toast.push(
                    <NotificationComponent type="danger">
                        {(error as AxiosError).message}
                    </NotificationComponent>,
                    { placement: 'top-center' },
                )
            }
        }
    }, [data, error, params.code, params.state])

    console.log({ params })
    return (
        <AdaptiveCard className="h-full">
            <div className="flex flex-auto h-full">
                {larger.lg && (
                    <div className="'w-[200px] xl:w-[280px]">
                        <SettingsMenu />
                    </div>
                )}
                <div className="xl:ltr:pl-6 xl:rtl:pr-6 flex-1 py-2">
                    {smaller.lg && (
                        <div className="mb-6">
                            <SettingMobileMenu />
                        </div>
                    )}
                    <Suspense fallback={<></>}>
                        {currentView === 'profile' && <Profile />}
                        {currentView === 'business' && <Business />}
                        {currentView === 'security' && <Security />}
                        {currentView === 'team' && <Team />}
                        {currentView === 'notification' && <Notification />}
                        {currentView === 'billing' && <Billing />}
                        {currentView === 'integration' && <Integration />}
                    </Suspense>
                </div>
            </div>
        </AdaptiveCard>
    )
}

export default Settings
