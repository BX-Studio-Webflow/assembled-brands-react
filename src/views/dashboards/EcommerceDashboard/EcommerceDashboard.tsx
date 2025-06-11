import { useEffect } from 'react'
import useSWR from 'swr'
import Loading from '@/components/shared/Loading'
import Overview from './components/Overview'
import RecentOrder from './components/RecentOrder'
import EngagementMetrics from './components/EngagementMetrics'
import ContentMetrics from './components/ContentMetrics'
import { apiGetDashboard } from '@/services/AuthService'

const EcommerceDashboard = () => {
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

    const createPeriodData = (value: number, growShrink: number) => ({
        value,
        growShrink,
        comparePeriod: 'vs last period',
        chartData: {
            series: [
                {
                    name: 'Value',
                    data: [value],
                },
            ],
            date: [new Date().toISOString()],
        },
    })

    const overviewData = {
        totalProfit: {
            thisWeek: createPeriodData(
                data?.data.revenue?.total_revenue || 0,
                data?.data.revenue?.revenue_last_30_days
                    ? (data.data.revenue.revenue_last_30_days /
                          (data.data.revenue.total_revenue || 1)) *
                          100
                    : 0,
            ),
            thisMonth: createPeriodData(
                data?.data.revenue?.total_revenue || 0,
                data?.data.revenue?.revenue_last_30_days
                    ? (data.data.revenue.revenue_last_30_days /
                          (data.data.revenue.total_revenue || 1)) *
                          100
                    : 0,
            ),
            thisYear: createPeriodData(
                data?.data.revenue?.total_revenue || 0,
                data?.data.revenue?.revenue_last_30_days
                    ? (data.data.revenue.revenue_last_30_days /
                          (data.data.revenue.total_revenue || 1)) *
                          100
                    : 0,
            ),
        },
        totalOrder: {
            thisWeek: createPeriodData(
                data?.data.revenue?.successful_payments || 0,
                data?.data.engagement?.new_bookings_last_30_days
                    ? (data.data.engagement.new_bookings_last_30_days /
                          (data.data.revenue.successful_payments || 1)) *
                          100
                    : 0,
            ),
            thisMonth: createPeriodData(
                data?.data.revenue?.successful_payments || 0,
                data?.data.engagement?.new_bookings_last_30_days
                    ? (data.data.engagement.new_bookings_last_30_days /
                          (data.data.revenue.successful_payments || 1)) *
                          100
                    : 0,
            ),
            thisYear: createPeriodData(
                data?.data.revenue?.successful_payments || 0,
                data?.data.engagement?.new_bookings_last_30_days
                    ? (data.data.engagement.new_bookings_last_30_days /
                          (data.data.revenue.successful_payments || 1)) *
                          100
                    : 0,
            ),
        },
        totalImpression: {
            thisWeek: createPeriodData(
                data?.data.content?.total_contacts || 0,
                data?.data.engagement?.new_contacts_last_30_days
                    ? (data.data.engagement.new_contacts_last_30_days /
                          (data.data.content.total_contacts || 1)) *
                          100
                    : 0,
            ),
            thisMonth: createPeriodData(
                data?.data.content?.total_contacts || 0,
                data?.data.engagement?.new_contacts_last_30_days
                    ? (data.data.engagement.new_contacts_last_30_days /
                          (data.data.content.total_contacts || 1)) *
                          100
                    : 0,
            ),
            thisYear: createPeriodData(
                data?.data.content?.total_contacts || 0,
                data?.data.engagement?.new_contacts_last_30_days
                    ? (data.data.engagement.new_contacts_last_30_days /
                          (data.data.content.total_contacts || 1)) *
                          100
                    : 0,
            ),
        },
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            <div className="col-span-1">
                <Overview data={overviewData} />
            </div>

            <div className="col-span-1">
                <RecentOrder
                    data={data?.data.revenue?.recent_successful_payments}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <EngagementMetrics data={data?.data.engagement} />
                </div>
                <div className="col-span-1">
                    <ContentMetrics data={data?.data.content} />
                </div>
            </div>
        </div>
    )
}

export default EcommerceDashboard
