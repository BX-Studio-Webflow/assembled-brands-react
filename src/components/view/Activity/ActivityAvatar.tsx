import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import acronym from '@/utils/acronym'
import classNames from '@/utils/classNames'
import useRandomBgColor from '@/utils/hooks/useRandomBgColor'
import {
    TbUser,
    TbTag,
    TbFileText,
    TbTicket,
    TbRefresh,
    TbMessage,
    TbBell,
    TbCalendar,
    TbCreditCard,
    TbUsers,
    TbBook,
    TbSettings,
} from 'react-icons/tb'
import {
    ADD_TAGS_TO_TICKET,
    ADD_FILES_TO_TICKET,
    UPDATE_TICKET,
    CREATE_TICKET,
    COMMENT,
    COMMENT_MENTION,
    ASSIGN_TICKET,
    avatarType,
    iconType,
} from './constants'
import type { AvatarProps } from '@/components/ui/Avatar'

type ActivityAvatar = {
    data?: {
        type: string
        userImg?: string
        userName: string
        notification?: {
            notification_type: string
            metadata?: {
                lead_name?: string
                event_name?: string
            }
        }
    }
}

const Icon = ({ type }: { type: string }) => {
    switch (type) {
        case ADD_TAGS_TO_TICKET:
            return <TbTag />
        case ADD_FILES_TO_TICKET:
            return <TbFileText />
        case UPDATE_TICKET:
            return <TbRefresh />
        case CREATE_TICKET:
            return <TbTicket />
        case COMMENT:
            return <TbMessage />
        case COMMENT_MENTION:
            return <TbMessage />
        case ASSIGN_TICKET:
            return <TbUser />
        default:
            return <TbUser />
    }
}

const NotificationIcon = ({
    notificationType,
}: {
    notificationType: string
}) => {
    switch (notificationType) {
        case 'new_booking':
            return <TbCalendar />
        case 'new_lead':
            return <TbUser />
        case 'new_event':
            return <TbBook />
        case 'new_payment':
            return <TbCreditCard />
        case 'new_membership':
            return <TbUsers />
        case 'system':
            return <TbSettings />
        case 'reminder':
            return <TbBell />
        default:
            return <TbBell />
    }
}

const getNotificationAvatarColor = (notificationType: string) => {
    switch (notificationType) {
        case 'new_booking':
            return 'bg-blue-200 text-blue-800'
        case 'new_lead':
            return 'bg-green-200 text-green-800'
        case 'new_event':
            return 'bg-purple-200 text-purple-800'
        case 'new_payment':
            return 'bg-emerald-200 text-emerald-800'
        case 'new_membership':
            return 'bg-orange-200 text-orange-800'
        case 'system':
            return 'bg-gray-200 text-gray-800'
        case 'reminder':
            return 'bg-yellow-200 text-yellow-800'
        default:
            return 'bg-gray-200 text-gray-800'
    }
}

const ActivityAvatar = ({ data }: ActivityAvatar) => {
    const color = useRandomBgColor()

    const defaultAvatarProps: AvatarProps = useMemo(
        () => ({ size: 35, shape: 'circle' }),
        [],
    )

    // Handle notification-based avatars - always use icons
    if (data?.notification) {
        const notificationType = data.notification.notification_type
        const avatarColor = getNotificationAvatarColor(notificationType)

        return (
            <Avatar
                className={avatarColor}
                icon={<NotificationIcon notificationType={notificationType} />}
                {...defaultAvatarProps}
            />
        )
    }

    // Handle regular activity avatars
    if (data && avatarType.includes(data.type)) {
        const avatarProps = data.userImg
            ? { src: data.userImg }
            : { className: classNames(color(data.userName || '')) }

        return (
            <Avatar {...avatarProps} {...defaultAvatarProps}>
                <span className="text-gray-900 font-bold">
                    {acronym(data.userName || '')}
                </span>
            </Avatar>
        )
    }

    if (data && iconType.includes(data.type)) {
        return (
            <Avatar
                className="text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-700"
                icon={<Icon type={data.type} />}
                {...defaultAvatarProps}
            />
        )
    }

    return null
}

export default ActivityAvatar
