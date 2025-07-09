import { useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import NotificationAvatar from './NotificationAvatar'
import NotificationToggle from './NotificationToggle'
import { HiOutlineMailOpen } from 'react-icons/hi'
import {
    apiGetNotificationList,
    apiGetNotificationCount,
    apiMarkNotificationAsRead,
    apiMarkAllNotificationsAsRead,
} from '@/services/CommonService'
import type {
    Notification,
    NotificationDisplayItem,
} from '@/@types/notification'
import isLastChild from '@/utils/isLastChild'
import useResponsive from '@/utils/hooks/useResponsive'
import { useNavigate } from 'react-router'

import type { DropdownRef } from '@/components/ui/Dropdown'

const notificationHeight = 'h-[280px]'

// Transform backend notification to frontend display format
const transformNotificationToDisplay = (
    notification: Notification,
): NotificationDisplayItem => {
    const getNotificationImage = (type: string) => {
        switch (type) {
            case 'comment':
                return '/img/others/notification-comment.png'
            case 'like':
                return '/img/others/notification-like.png'
            case 'system':
                return '/img/others/notification-system.png'
            case 'reminder':
                return '/img/others/notification-reminder.png'
            default:
                return '/img/others/notification-default.png'
        }
    }

    const getNotificationTarget = (notification: Notification): string => {
        if (notification.metadata?.lead_name) {
            return notification.metadata.lead_name
        }
        return 'System'
    }

    const getNotificationDescription = (notification: Notification): string => {
        const baseMessage = notification.message
        if (notification.metadata?.event_name) {
            return `${baseMessage} for event "${notification.metadata.event_name}"`
        }
        return baseMessage
    }

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

        if (diffInHours < 1) {
            return 'Just now'
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`
        } else if (diffInHours < 168) {
            // 7 days
            return `${Math.floor(diffInHours / 24)}d ago`
        } else {
            return date.toLocaleDateString()
        }
    }

    return {
        id: notification.id.toString(),
        target: getNotificationTarget(notification),
        description: getNotificationDescription(notification),
        date: formatDate(notification.created_at),
        image: getNotificationImage(notification.notification_type),
        type: notification.notification_type === 'system' ? 1 : 0,
        location: notification.link || '',
        locationLabel: notification.notification_type,
        status: notification.is_read ? 'read' : 'unread',
        readed: notification.is_read,
    }
}

const _Notification = ({ className }: { className?: string }) => {
    const [notificationList, setNotificationList] = useState<
        NotificationDisplayItem[]
    >([])
    const [unreadNotification, setUnreadNotification] = useState(false)
    const [noResult, setNoResult] = useState(false)
    const [loading, setLoading] = useState(false)

    const { larger } = useResponsive()

    const navigate = useNavigate()

    const getNotificationCount = async () => {
        try {
            const resp = await apiGetNotificationCount()
            if (resp.success && resp.count > 0) {
                setNoResult(false)
                setUnreadNotification(true)
            } else {
                setNoResult(true)
                setUnreadNotification(false)
            }
        } catch (error) {
            console.error('Failed to get notification count:', error)
            setNoResult(true)
        }
    }

    useEffect(() => {
        getNotificationCount()
    }, [])

    const onNotificationOpen = async () => {
        if (notificationList.length === 0) {
            setLoading(true)
            try {
                const resp = await apiGetNotificationList()
                if (resp.success) {
                    const transformedNotifications = resp.notifications.map(
                        transformNotificationToDisplay,
                    )
                    setNotificationList(transformedNotifications)
                    setUnreadNotification(resp.count > 0)
                    setNoResult(transformedNotifications.length === 0)
                }
            } catch (error) {
                console.error('Failed to get notifications:', error)
                setNoResult(true)
            } finally {
                setLoading(false)
            }
        }
    }

    const onMarkAllAsRead = async () => {
        try {
            await apiMarkAllNotificationsAsRead()
            const list = notificationList.map(
                (item: NotificationDisplayItem) => {
                    if (!item.readed) {
                        item.readed = true
                    }
                    return item
                },
            )
            setNotificationList(list)
            setUnreadNotification(false)
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error)
        }
    }

    const onMarkAsRead = async (id: string) => {
        try {
            await apiMarkNotificationAsRead(parseInt(id))
            const list = notificationList.map((item) => {
                if (item.id === id) {
                    item.readed = true
                }
                return item
            })
            setNotificationList(list)
            const hasUnread = list.some((item) => !item.readed)

            if (!hasUnread) {
                setUnreadNotification(false)
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error)
        }
    }

    const notificationDropdownRef = useRef<DropdownRef>(null)

    const handleViewAllActivity = () => {
        navigate('/concepts/account/activity-log')
        if (notificationDropdownRef.current) {
            notificationDropdownRef.current.handleDropdownClose()
        }
    }

    return (
        <Dropdown
            ref={notificationDropdownRef}
            renderTitle={
                <NotificationToggle
                    dot={unreadNotification}
                    className={className}
                />
            }
            menuClass="min-w-[280px] md:min-w-[340px]"
            placement={larger.md ? 'bottom-end' : 'bottom'}
            onOpen={onNotificationOpen}
        >
            <Dropdown.Item variant="header">
                <div className="dark:border-gray-700 px-2 flex items-center justify-between mb-1">
                    <h6>Notifications</h6>
                    <Button
                        variant="plain"
                        shape="circle"
                        size="sm"
                        icon={<HiOutlineMailOpen className="text-xl" />}
                        title="Mark all as read"
                        onClick={onMarkAllAsRead}
                    />
                </div>
            </Dropdown.Item>
            <ScrollBar
                className={classNames('overflow-y-auto', notificationHeight)}
            >
                {notificationList.length > 0 &&
                    notificationList.map((item, index) => (
                        <div key={item.id}>
                            <div
                                className={`relative rounded-xl flex px-4 py-3 cursor-pointer hover:bg-gray-100 active:bg-gray-100 dark:hover:bg-gray-700`}
                                onClick={() => onMarkAsRead(item.id)}
                            >
                                <div>
                                    <NotificationAvatar {...item} />
                                </div>
                                <div className="mx-3">
                                    <div>
                                        {item.target && (
                                            <span className="font-semibold heading-text">
                                                {item.target}{' '}
                                            </span>
                                        )}
                                        <span>{item.description}</span>
                                    </div>
                                    <span className="text-xs">{item.date}</span>
                                </div>
                                <Badge
                                    className="absolute top-4 ltr:right-4 rtl:left-4 mt-1.5"
                                    innerClass={`${
                                        item.readed
                                            ? 'bg-gray-300 dark:bg-gray-600'
                                            : 'bg-primary'
                                    } `}
                                />
                            </div>
                            {!isLastChild(notificationList, index) ? (
                                <div className="border-b border-gray-200 dark:border-gray-700 my-2" />
                            ) : (
                                ''
                            )}
                        </div>
                    ))}
                {loading && (
                    <div
                        className={classNames(
                            'flex items-center justify-center',
                            notificationHeight,
                        )}
                    >
                        <Spinner size={40} />
                    </div>
                )}
                {noResult && notificationList.length === 0 && (
                    <div
                        className={classNames(
                            'flex items-center justify-center',
                            notificationHeight,
                        )}
                    >
                        <div className="text-center">
                            <img
                                className="mx-auto mb-2 max-w-[150px]"
                                src="/img/others/no-notification.png"
                                alt="no-notification"
                            />
                            <h6 className="font-semibold">No notifications!</h6>
                            <p className="mt-1">Please Try again later</p>
                        </div>
                    </div>
                )}
            </ScrollBar>
            <Dropdown.Item variant="header">
                <div className="pt-4">
                    <Button
                        block
                        variant="solid"
                        onClick={handleViewAllActivity}
                    >
                        View All Activity
                    </Button>
                </div>
            </Dropdown.Item>
        </Dropdown>
    )
}

const Notification = withHeaderItem(_Notification)

export default Notification
