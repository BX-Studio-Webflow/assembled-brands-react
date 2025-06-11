/* eslint-disable react-refresh/only-export-components */
import Card from '@/components/ui/Card'
import {
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlinePhone,
    HiOutlineMail,
} from 'react-icons/hi'

interface EngagementMetric {
    id: string
    name: string
    value: number
    icon: React.ReactNode
    priority: 'high' | 'medium' | 'low'
}

interface CurrentTasksProps {
    data?: {
        active_bookings?: number
        pending_callbacks?: number
        team_members?: number
        pending_invitations?: number
    }
}

const CurrentTasks = ({ data }: CurrentTasksProps) => {
    const metrics: EngagementMetric[] = [
        {
            id: '1',
            name: 'Active Bookings',
            value: data?.active_bookings || 0,
            icon: <HiOutlineCalendar className="text-xl" />,
            priority: 'high',
        },
        {
            id: '2',
            name: 'Pending Callbacks',
            value: data?.pending_callbacks || 0,
            icon: <HiOutlinePhone className="text-xl" />,
            priority: 'medium',
        },
        {
            id: '3',
            name: 'Team Members',
            value: data?.team_members || 0,
            icon: <HiOutlineUserGroup className="text-xl" />,
            priority: 'low',
        },
        {
            id: '4',
            name: 'Pending Invitations',
            value: data?.pending_invitations || 0,
            icon: <HiOutlineMail className="text-xl" />,
            priority: 'medium',
        },
    ]

    const labelClass = {
        high: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-500',
        medium: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-500',
        low: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-500',
    }

    return (
        <Card>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <h4>Engagement Overview</h4>
            </div>
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    {metrics.map((metric) => (
                        <div
                            key={metric.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                                    {metric.icon}
                                </div>
                                <span>{metric.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold">
                                    {metric.value}
                                </span>
                                <span
                                    className={`px-2 py-1 rounded-full text-xs ${labelClass[metric.priority]}`}
                                >
                                    {metric.priority.charAt(0).toUpperCase() +
                                        metric.priority.slice(1)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default CurrentTasks
