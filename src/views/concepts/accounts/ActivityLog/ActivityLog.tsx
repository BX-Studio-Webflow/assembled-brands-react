import { useState, useEffect } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { Log } from './components/Log'
import LogAction from './components/LogAction'
import { apiGetNotificationLogs } from '@/services/LogService'
import type { Notification } from '@/@types/notification'
import {
    UPDATE_TICKET,
    COMMENT,
    COMMENT_MENTION,
    ASSIGN_TICKET,
    ADD_TAGS_TO_TICKET,
    ADD_FILES_TO_TICKET,
    CREATE_TICKET,
} from '@/components/view/Activity/constants'

const defaultSelectedType = [
    UPDATE_TICKET,
    COMMENT,
    COMMENT_MENTION,
    ASSIGN_TICKET,
    ADD_TAGS_TO_TICKET,
    ADD_FILES_TO_TICKET,
    CREATE_TICKET,
]

// Transform notifications to activity log format without date grouping
const transformNotificationsToActivities = (notifications: Notification[]) => {
    return notifications
        .map((notification) => {
            const date = new Date(notification.created_at)

            // Map notification type to activity type
            const getActivityType = (notificationType: string) => {
                switch (notificationType) {
                    case 'comment':
                        return COMMENT
                    case 'like':
                        return UPDATE_TICKET
                    case 'system':
                        return CREATE_TICKET
                    case 'reminder':
                        return ASSIGN_TICKET
                    default:
                        return UPDATE_TICKET
                }
            }

            const event = {
                type: getActivityType(notification.notification_type),
                dateTime: Math.floor(date.getTime() / 1000),
                notification,
                userName: notification.metadata?.lead_name || 'System',
                userImg: notification.metadata?.lead_email
                    ? `/img/avatars/thumb-${(Math.abs(notification.metadata.lead_email.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 10) + 1}.jpg`
                    : undefined,
                comment: notification.message,
                tags: notification.metadata?.event_name
                    ? [notification.metadata.event_name]
                    : undefined,
                files: undefined,
                assignee: undefined,
            }

            return {
                id: notification.id.toString(),
                date: Math.floor(date.getTime() / 1000),
                events: [event],
            }
        })
        .sort((a, b) => b.date - a.date) // Sort by newest first
}

const ActivityLog = () => {
    const [activities, setActivities] = useState<
        Array<{
            id: string
            date: number
            events: Array<{
                type: string
                dateTime: number
                notification: Notification
                userName: string
                userImg?: string
                comment?: string
                tags?: string[]
                files?: string[]
                assignee?: string
            }>
        }>
    >([])
    const [showMentionedOnly, setShowMentionedOnly] = useState(false)
    const [selectedType, setSelectedType] =
        useState<string[]>(defaultSelectedType)

    const getLogs = async (index: number) => {
        try {
            const resp = await apiGetNotificationLogs({
                page: index,
                limit: 20,
            })

            if (resp.success) {
                const transformedActivities =
                    transformNotificationsToActivities(resp.notifications)
                setActivities((prevActivities) => [
                    ...prevActivities,
                    ...transformedActivities,
                ])
            }
        } catch (error) {
            console.error('Failed to get notification logs:', error)
        }
    }

    useEffect(() => {
        getLogs(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFilterChange = (selected: string) => {
        setShowMentionedOnly(false)
        if (selectedType.includes(selected)) {
            setSelectedType((prevData) =>
                prevData.filter((prev) => prev !== selected),
            )
        } else {
            setSelectedType((prevData) => [...prevData, ...[selected]])
        }
    }

    const handleCheckboxChange = (bool: boolean) => {
        setShowMentionedOnly(bool)
        if (bool) {
            setSelectedType([COMMENT_MENTION])
        } else {
            setSelectedType(defaultSelectedType)
        }
    }

    return (
        <AdaptiveCard>
            <div className="max-w-[800px] mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3>Activity Log</h3>
                    <LogAction
                        selectedType={selectedType}
                        showMentionedOnly={showMentionedOnly}
                        onFilterChange={handleFilterChange}
                        onCheckboxChange={handleCheckboxChange}
                    />
                </div>
                <Log activities={activities} filter={selectedType} />
            </div>
        </AdaptiveCard>
    )
}

export default ActivityLog
