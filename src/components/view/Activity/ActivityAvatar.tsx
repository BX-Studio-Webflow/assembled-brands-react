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
    TbHeart,
    TbBell,
    TbAlertCircle,
    TbMail,
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
        case 'comment':
            return <TbMessage />
        case 'like':
            return <TbHeart />
        case 'system':
            return <TbAlertCircle />
        case 'reminder':
            return <TbBell />
        default:
            return <TbMail />
    }
}

const getNotificationAvatarColor = (notificationType: string) => {
    switch (notificationType) {
        case 'comment':
            return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900'
        case 'like':
            return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
        case 'system':
            return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900'
        case 'reminder':
            return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900'
        default:
            return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700'
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
