import { useEffect } from 'react'
import useSWR from 'swr'
import Loading from '@/components/shared/Loading'
import Overview from './components/Overview'
import RecentOrder from './components/RecentOrder'
import EngagementMetrics from './components/EngagementMetrics'
import { apiGetDashboard } from '@/services/AuthService'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

const EcommerceDashboard = () => {
    useEffect(() => {
        // Check if we're on the callback URL with a code
        const urlParams = new URLSearchParams(window.location.search)
        const action = urlParams.get('action')
        if (action === 'success') {
            toast.push(
                <Notification type="success">
                    We&apos;re thrilled to welcome you aboard. Your subscription
                    is now active, and you&apos;re all set to start enjoying
                    everything we have to offer.
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
        }
    }, [])
    const { data, error, isLoading } = useSWR(
        '/api/dashboard',
        apiGetDashboard,
        {
            revalidateOnFocus: false,
        },
    )

    useEffect(() => {
        if (data) {
            console.log('Dashboard data:', data)
        }
    }, [data])

    if (isLoading) {
        return <Loading loading={true} />
    }

    if (error) {
        return <div>Error loading dashboard data</div>
    }

    const overviewData = {
        totalEarned: parseFloat(data?.revenue?.total_revenue || '0'),
        totalRegistration:
            data?.prerecorded_events?.totals?.total_registrations || 0,
        totalNonAttendee:
            data?.prerecorded_events?.totals?.total_non_attendees || 0,
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="col-span-1">
                <Overview data={overviewData} />
            </div>

            <div className="col-span-1">
                <RecentOrder
                    data={data?.revenue?.recent_successful_payments || []}
                />
            </div>

            <div className="col-span-1">
                <EngagementMetrics data={data?.engagement} />
            </div>
        </div>
    )
}

export default EcommerceDashboard
