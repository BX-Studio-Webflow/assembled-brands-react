import Card from '@/components/ui/Card'
import {
    HiOutlineCalendar,
    HiOutlineMicrophone,
    HiOutlineBookOpen,
    HiOutlineUserGroup,
    HiOutlineUser,
} from 'react-icons/hi'

interface ContentMetric {
    type: string
    title: string
    value: number
    icon: React.ReactNode
    color: string
}

interface RecentActivityProps {
    data?: {
        total_events?: number
        total_podcasts?: number
        total_courses?: number
        total_leads?: number
        total_contacts?: number
    }
}

const RecentActivity = ({ data }: RecentActivityProps) => {
    const metrics: ContentMetric[] = [
        {
            type: 'events',
            title: 'Total Events',
            value: data?.total_events || 0,
            icon: <HiOutlineCalendar className="text-xl" />,
            color: 'text-emerald-500',
        },
        {
            type: 'podcasts',
            title: 'Total Podcasts',
            value: data?.total_podcasts || 0,
            icon: <HiOutlineMicrophone className="text-xl" />,
            color: 'text-blue-500',
        },
        {
            type: 'courses',
            title: 'Total Courses',
            value: data?.total_courses || 0,
            icon: <HiOutlineBookOpen className="text-xl" />,
            color: 'text-amber-500',
        },
        {
            type: 'leads',
            title: 'Total Leads',
            value: data?.total_leads || 0,
            icon: <HiOutlineUserGroup className="text-xl" />,
            color: 'text-purple-500',
        },
        {
            type: 'contacts',
            title: 'Total Contacts',
            value: data?.total_contacts || 0,
            icon: <HiOutlineUser className="text-xl" />,
            color: 'text-rose-500',
        },
    ]

    return (
        <Card>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
                <h4>Content Overview</h4>
            </div>
            <div className="p-4">
                <div className="flex flex-col gap-4">
                    {metrics.map((metric) => (
                        <div
                            key={metric.type}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800 ${metric.color}`}
                                >
                                    {metric.icon}
                                </div>
                                <span>{metric.title}</span>
                            </div>
                            <span className="font-semibold">
                                {metric.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default RecentActivity
