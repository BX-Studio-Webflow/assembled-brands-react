import { useState } from 'react'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import classNames from '@/utils/classNames'
import { TbCircleCheck, TbCircleCheckFilled, TbCalendar } from 'react-icons/tb'

const labelClass: Record<string, string> = {
    High: 'bg-red-200 dark:bg-red-200 dark:text-gray-900',
    Medium: 'bg-orange-200 dark:bg-orange-200 dark:text-gray-900',
    Low: 'bg-purple-200 dark:bg-purple-200 dark:text-gray-900',
}

type EngagementMetric = {
    id: string
    name: string
    value: number
    checked: boolean
    priority: 'High' | 'Medium' | 'Low'
}

interface EngagementMetricsProps {
    data?: {
        active_bookings?: number
        pending_callbacks?: number
        team_members?: number
        pending_invitations?: number
    }
}

const initialMetrics = (
    data?: EngagementMetricsProps['data'],
): EngagementMetric[] => [
    {
        id: 'active_bookings',
        name: 'Active Bookings',
        value: data?.active_bookings || 0,
        checked: false,
        priority:
            (data?.active_bookings || 0) <= 50
                ? 'Low'
                : (data?.active_bookings || 0) <= 200
                  ? 'Medium'
                  : 'High',
    },
    {
        id: 'pending_callbacks',
        name: 'Pending Callbacks',
        value: data?.pending_callbacks || 0,
        checked: false,
        priority:
            (data?.pending_callbacks || 0) <= 50
                ? 'Low'
                : (data?.pending_callbacks || 0) <= 200
                  ? 'Medium'
                  : 'High',
    },
    {
        id: 'team_members',
        name: 'Team Members',
        value: data?.team_members || 0,
        checked: false,
        priority:
            (data?.team_members || 0) <= 50
                ? 'Low'
                : (data?.team_members || 0) <= 200
                  ? 'Medium'
                  : 'High',
    },
    {
        id: 'pending_invitations',
        name: 'Pending Invitations',
        value: data?.pending_invitations || 0,
        checked: false,
        priority:
            (data?.pending_invitations || 0) <= 50
                ? 'Low'
                : (data?.pending_invitations || 0) <= 200
                  ? 'Medium'
                  : 'High',
    },
]

const EngagementMetrics = ({ data }: EngagementMetricsProps) => {
    const [metrics, setMetrics] = useState<EngagementMetric[]>(
        initialMetrics(data),
    )

    const handleChange = (id: string) => {
        setMetrics((metrics) =>
            metrics.map((metric) =>
                metric.id === id
                    ? { ...metric, checked: !metric.checked }
                    : metric,
            ),
        )
    }

    return (
        <Card>
            <div className="flex items-center justify-between">
                <h4>Engagement Overview</h4>
            </div>
            <div className="mt-4">
                {metrics.map((metric, index) => (
                    <div
                        key={metric.id}
                        className={classNames(
                            'flex items-center justify-between py-4 border-gray-200 dark:border-gray-600',
                            index !== metrics.length - 1 && 'border-b',
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <button
                                className="text-[26px] cursor-pointer"
                                role="button"
                                onClick={() => handleChange(metric.id)}
                            >
                                {metric.checked ? (
                                    <TbCircleCheckFilled className="text-primary" />
                                ) : (
                                    <TbCircleCheck className="hover:text-primary" />
                                )}
                            </button>
                            <div>
                                <div
                                    className={classNames(
                                        'heading-text font-bold mb-1',
                                        metric.checked &&
                                            'line-through opacity-50',
                                    )}
                                >
                                    {metric.name}
                                </div>
                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                    <TbCalendar className="text-lg" />
                                    {metric.value}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Tag className={labelClass[metric.priority]}>
                                {metric.priority}
                            </Tag>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default EngagementMetrics
