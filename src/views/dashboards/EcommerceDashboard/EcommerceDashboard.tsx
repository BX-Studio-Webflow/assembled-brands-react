import { useEffect } from 'react'
import useSWR from 'swr'
import Loading from '@/components/shared/Loading'
import Overview from './components/Overview'
import { apiGetDashboard } from '@/services/AuthService'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { DashboardResponse } from '@/@types/auth'
import EventsStatsTable from './components/EventsStaticsTable'

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
    const { data, error, isLoading } = useSWR<DashboardResponse>(
        '/api/dashboard',
        apiGetDashboard,
        {
            revalidateOnFocus: false,
        },
    )
    if (isLoading) {
        return <Loading loading={true} />
    }

    if (error) {
        return <div>Error loading dashboard data</div>
    }

    const pastEvents = data?.events?.events_flat.filter((event) => event.upcoming_dates.length === 0)
    const upcomingEvents = data?.events?.events_flat.filter((event) => event.upcoming_dates.length > 0)
    
    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="col-span-1">
                <Overview data={data} />
            </div>

            <div className="col-span-1">
                <EventsStatsTable data={upcomingEvents || []} title="upcoming" />
            </div>
            <div className="col-span-1">
                <EventsStatsTable data={pastEvents || []} title="past" />
            </div>
        </div>
    )
}

export default EcommerceDashboard
