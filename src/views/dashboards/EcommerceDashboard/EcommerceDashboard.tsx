import Loading from '@/components/shared/Loading'
import useSWR from 'swr'
import type {
    StatisticData,
} from './types'
import Overview from './components/Overview'
import RecentOrder from './components/RecentOrder'
import { apiGetDashboard } from '@/services/AuthService'

const EcommerceDashboard = () => {
    const { data, isLoading } = useSWR(
        ['/user/dashboard'],
        () => apiGetDashboard(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loading loading={true} />
            </div>
        )
    }

    // Transform data for Overview component
    const overviewData: StatisticData = {
        totalProfit: {
            thisMonth: {
                value: parseFloat(data?.revenue?.total_revenue || '0'),
                growShrink: 0,
                comparePeriod: 'vs last month',
                chartData: {
                    series: [
                        {
                            name: 'Revenue',
                            data: [
                                parseFloat(data?.revenue?.total_revenue || '0'),
                            ],
                        },
                    ],
                    date: [new Date().toISOString()],
                },
            },
            thisWeek: {
                value: parseFloat(data?.revenue?.revenue_last_30_days || '0'),
                growShrink: 0,
                comparePeriod: 'vs last week',
                chartData: {
                    series: [
                        {
                            name: 'Revenue',
                            data: [
                                parseFloat(
                                    data?.revenue?.revenue_last_30_days || '0',
                                ),
                            ],
                        },
                    ],
                    date: [new Date().toISOString()],
                },
            },
            thisYear: {
                value: parseFloat(data?.revenue?.total_revenue || '0'),
                growShrink: 0,
                comparePeriod: 'vs last year',
                chartData: {
                    series: [
                        {
                            name: 'Revenue',
                            data: [
                                parseFloat(data?.revenue?.total_revenue || '0'),
                            ],
                        },
                    ],
                    date: [new Date().toISOString()],
                },
            },
        },
        totalOrder: {
            thisMonth: {
                value: data?.revenue?.successful_payments || 0,
                growShrink: 0,
                comparePeriod: 'vs last month',
                chartData: {
                    series: [
                        {
                            name: 'Orders',
                            data: [data?.revenue?.successful_payments || 0],
                        },
                    ],
                    date: [new Date().toISOString()],
                },
            },
            thisWeek: {
                value: data?.revenue?.successful_payments || 0,
                growShrink: 0,
                comparePeriod: 'vs last week',
                chartData: {
                    series: [
                        {
                            name: 'Orders',
                            data: [data?.revenue?.successful_payments || 0],
                        },
                    ],
                    date: [new Date().toISOString()],
                },
            },
            thisYear: {
                value: data?.revenue?.successful_payments || 0,
                growShrink: 0,
                comparePeriod: 'vs last year',
                chartData: {
                    series: [
                        {
                            name: 'Orders',
                            data: [data?.revenue?.successful_payments || 0],
                        },
                    ],
                    date: [new Date().toISOString()],
                },
            },
        },
        totalImpression: {
            thisMonth: {
                value:
                    (data?.content?.total_leads || 0) +
                    (data?.content?.total_contacts || 0),
                growShrink: 0,
                comparePeriod: 'vs last month',
                chartData: {
                    series: [
                        {
                            name: 'Impressions',
                            data: [
                                (data?.content?.total_leads || 0) +
                                    (data?.content?.total_contacts || 0),
                            ],
                        },
                    ],
                    date: [new Date().toISOString()],
                },
            },
            thisWeek: {
                value:
                    (data?.content?.total_leads || 0) +
                    (data?.content?.total_contacts || 0),
                growShrink: 0,
                comparePeriod: 'vs last week',
                chartData: {
                    series: [
                        {
                            name: 'Impressions',
                            data: [
                                (data?.content?.total_leads || 0) +
                                    (data?.content?.total_contacts || 0),
                            ],
                        },
                    ],
                    date: [new Date().toISOString()],
                },
            },
            thisYear: {
                value:
                    (data?.content?.total_leads || 0) +
                    (data?.content?.total_contacts || 0),
                growShrink: 0,
                comparePeriod: 'vs last year',
                chartData: {
                    series: [
                        {
                            name: 'Impressions',
                            data: [
                                (data?.content?.total_leads || 0) +
                                    (data?.content?.total_contacts || 0),
                            ],
                        },
                    ],
                    date: [new Date().toISOString()],
                },
            },
        },
    }

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <div className="col-span-1 lg:col-span-2 xl:col-span-3">
                <Overview data={overviewData} />
            </div>

            <div className="col-span-1 lg:col-span-2 xl:col-span-3">
                <RecentOrder data={data?.revenue?.recent_successful_payments} />
            </div>
        </div>
    )
}

export { EcommerceDashboard }
