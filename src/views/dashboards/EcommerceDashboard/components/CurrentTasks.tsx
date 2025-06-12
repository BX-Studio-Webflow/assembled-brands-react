import Card from '@/components/ui/Card'
import {
    HiOutlineCalendar,
    HiOutlineUserGroup,
    HiOutlinePhone,
    HiOutlineMail,
} from 'react-icons/hi'

interface EngagementMetricsProps {
    data?: {
        active_bookings?: number
        pending_callbacks?: number
        team_members?: number
        pending_invitations?: number
    }
}

const EngagementMetrics = ({ data }: EngagementMetricsProps) => {
    const metrics = [
        {
            title: 'Active Bookings',
            value: data?.active_bookings || 0,
            icon: <HiOutlineCalendar className="text-xl" />,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100',
            priority: 'High',
        },
        {
            title: 'Pending Callbacks',
            value: data?.pending_callbacks || 0,
            icon: <HiOutlinePhone className="text-xl" />,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100',
            priority: 'Medium',
        },
        {
            title: 'Team Members',
            value: data?.team_members || 0,
            icon: <HiOutlineUserGroup className="text-xl" />,
            color: 'text-green-500',
            bgColor: 'bg-green-100',
            priority: 'Low',
        },
        {
            title: 'Pending Invitations',
            value: data?.pending_invitations || 0,
            icon: <HiOutlineMail className="text-xl" />,
            color: 'text-purple-500',
            bgColor: 'bg-purple-100',
            priority: 'Medium',
        },
    ]

    return (
        <Card>
            <div className="p-4">
                <h4 className="mb-4">Engagement Overview</h4>
                <div className="grid grid-cols-1 gap-4">
                    {metrics.map((metric, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`p-2 rounded-full ${metric.bgColor} ${metric.color}`}
                                >
                                    {metric.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-medium">
                                        {metric.title}
                                    </div>
                                    <div className="text-2xl font-semibold">
                                        {metric.value}
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`text-sm font-medium ${metric.color}`}
                            >
                                {metric.priority}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default EngagementMetrics
