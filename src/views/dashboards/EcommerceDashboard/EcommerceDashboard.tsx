import { useEffect } from 'react'
import useSWR from 'swr'
import Loading from '@/components/shared/Loading'
import Overview from './components/Overview'
import { apiGetDashboard } from '@/services/AuthService'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { DashboardResponse } from '@/@types/auth'
import EventsStatsTable from './components/EventsStaticsTable'
import EmptyState from './components/EmptyState'
import { useAuth } from '@/auth'
import dayjs from 'dayjs'
import NoUserFound from '@/assets/svg/NoUserFound'

const EcommerceDashboard = () => {
    const { user } = useAuth()

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
        return (
            <div className="flex flex-col items-center gap-4">
                <NoUserFound />
                <span className="font-semibold">
                    An error occurred while loading dashboard data. Please try
                    again later.
                </span>
            </div>
        )
    }

    const pastEvents = data?.events?.events_flat.filter(
        (event) => event.upcoming_dates.length === 0,
    )
    const upcomingEvents = data?.events?.events_flat.filter(
        (event) => event.upcoming_dates.length > 0,
    )

    const isNewUser = dayjs(user?.createdAt).isAfter(
        dayjs().subtract(1, 'month'),
    )
    const isEmptyState =
        upcomingEvents?.length === 0 && pastEvents?.length === 0 && isNewUser

    return (
        <div className="grid grid-cols-1 gap-4">
            {isEmptyState ? (
                <div className="col-span-1">
                    <EmptyState />
                </div>
            ) : (
                <>
                    <div className="col-span-1">
                        <Overview data={data} />
                    </div>
                    <div className="col-span-1">
                        <EventsStatsTable
                            data={upcomingEvents || []}
                            title="upcoming"
                        />
                    </div>
                    <div className="col-span-1">
                        <EventsStatsTable
                            data={pastEvents || []}
                            title="past"
                        />
                    </div>
                </>
            )}
        </div>
    )
}

export default EcommerceDashboard
