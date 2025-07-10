import { useState, useEffect } from 'react'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { Log } from './components/Log'
import LogAction from './components/LogAction'
import { apiGetNotificationLogs } from '@/services/LogService'
import type { Notification } from '@/@types/notification'

// Notification types for filtering
const NOTIFICATION_TYPES = {
    NEW_BOOKING: 'new_booking',
    NEW_LEAD: 'new_lead',
    NEW_EVENT: 'new_event',
    NEW_PAYMENT: 'new_payment',
    NEW_MEMBERSHIP: 'new_membership',
    SYSTEM: 'system',
    REMINDER: 'reminder',
} as const

const defaultSelectedTypes = [
    NOTIFICATION_TYPES.NEW_BOOKING,
    NOTIFICATION_TYPES.NEW_LEAD,
    NOTIFICATION_TYPES.NEW_EVENT,
    NOTIFICATION_TYPES.NEW_PAYMENT,
    NOTIFICATION_TYPES.NEW_MEMBERSHIP,
    NOTIFICATION_TYPES.SYSTEM,
    NOTIFICATION_TYPES.REMINDER,
]

// Transform notifications to activity log format without date grouping
const transformNotificationsToActivities = (notifications: Notification[]) => {
    return notifications
        .map((notification) => {
            const date = new Date(notification.created_at)

            const event = {
                type: notification.notification_type,
                dateTime: Math.floor(date.getTime() / 1000),
                notification,
                userName: notification.metadata?.lead_name || 'System',
                userImg: notification.metadata?.lead_email
                    ? `/img/avatars/thumb-${(Math.abs(notification.metadata.lead_email.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 10) + 1}.jpg`
                    : undefined,
                title: notification.title,
                message: notification.message,
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
                title?: string
                message?: string
                tags?: string[]
                files?: string[]
                assignee?: string
            }>
        }>
    >([])
    const [selectedTypes, setSelectedTypes] =
        useState<string[]>(defaultSelectedTypes)

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
    }, [])

    const handleFilterChange = (selected: string) => {
        if (selectedTypes.includes(selected)) {
            setSelectedTypes((prevData) =>
                prevData.filter((prev) => prev !== selected),
            )
        } else {
            setSelectedTypes((prevData) => [...prevData, ...[selected]])
        }
    }

    return (
        <AdaptiveCard>
            <div className="max-w-[800px] mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3>Activity Log</h3>
                    <LogAction
                        selectedType={selectedTypes}
                        onFilterChange={handleFilterChange}
                    />
                </div>
                <Log activities={activities} filter={selectedTypes} />
            </div>
        </AdaptiveCard>
    )
}

export default ActivityLog
