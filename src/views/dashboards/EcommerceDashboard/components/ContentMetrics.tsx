import {
    HiOutlineCalendar,
    HiOutlineMicrophone,
    HiOutlineBookOpen,
    HiOutlineUserGroup,
    HiOutlineUser,
} from 'react-icons/hi'
import Card from '@/components/ui/Card'

interface ContentMetricsProps {
    data?: {
        total_events?: number
        total_podcasts?: number
        total_courses?: number
        total_leads?: number
        total_contacts?: number
    }
}

const ContentMetrics = ({ data }: ContentMetricsProps) => {
    const metrics = [
        {
            title: 'Total Events',
            value: data?.total_events || 0,
            icon: <HiOutlineCalendar className="text-xl" />,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Total Podcasts',
            value: data?.total_podcasts || 0,
            icon: <HiOutlineMicrophone className="text-xl" />,
            color: 'text-purple-500',
            bgColor: 'bg-purple-100',
        },
        {
            title: 'Total Courses',
            value: data?.total_courses || 0,
            icon: <HiOutlineBookOpen className="text-xl" />,
            color: 'text-green-500',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Total Leads',
            value: data?.total_leads || 0,
            icon: <HiOutlineUserGroup className="text-xl" />,
            color: 'text-orange-500',
            bgColor: 'bg-orange-100',
        },
        {
            title: 'Total Contacts',
            value: data?.total_contacts || 0,
            icon: <HiOutlineUser className="text-xl" />,
            color: 'text-red-500',
            bgColor: 'bg-red-100',
        },
    ]

    return (
        <Card>
            <div className="p-4">
                <h4 className="mb-4">Content Overview</h4>
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
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    )
}

export default ContentMetrics
