import Avatar from '@/components/ui/Avatar'
import {
    HiOutlineCalendar,
    HiOutlineUser,
    HiOutlineCreditCard,
    HiOutlineUserGroup,
    HiOutlineBookOpen,
    HiOutlineBell,
    HiOutlineCog,
} from 'react-icons/hi'

const NotificationAvatar = (props: {
    type: number
    target: string
    image: string
    status: string
    locationLabel: string
}) => {
    const { locationLabel } = props

    // Get icon and color based on notification type
    const getNotificationIcon = (notificationType: string) => {
        switch (notificationType) {
            case 'new_booking':
                return {
                    icon: <HiOutlineCalendar />,
                    className: 'bg-blue-200 text-blue-800',
                }
            case 'new_lead':
                return {
                    icon: <HiOutlineUser />,
                    className: 'bg-green-200 text-green-800',
                }
            case 'new_event':
                return {
                    icon: <HiOutlineBookOpen />,
                    className: 'bg-purple-200 text-purple-800',
                }
            case 'new_payment':
                return {
                    icon: <HiOutlineCreditCard />,
                    className: 'bg-emerald-200 text-emerald-800',
                }
            case 'new_membership':
                return {
                    icon: <HiOutlineUserGroup />,
                    className: 'bg-orange-200 text-orange-800',
                }
            case 'system':
                return {
                    icon: <HiOutlineCog />,
                    className: 'bg-gray-200 text-gray-800',
                }
            case 'reminder':
                return {
                    icon: <HiOutlineBell />,
                    className: 'bg-yellow-200 text-yellow-800',
                }
            default:
                return {
                    icon: <HiOutlineBell />,
                    className: 'bg-gray-200 text-gray-800',
                }
        }
    }

    const { icon, className } = getNotificationIcon(locationLabel)

    return <Avatar shape="circle" className={className} icon={icon} />
}

export default NotificationAvatar
