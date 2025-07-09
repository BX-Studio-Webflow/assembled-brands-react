import type { Notification } from '@/@types/notification'

export type Activity = {
    id: string
    date: number
    events: Array<{
        type: string
        dateTime: number
        ticket?: string
        status?: number
        userName: string
        userImg?: string
        comment?: string
        tags?: string[]
        files?: string[]
        assignee?: string
    }>
}

export type Activities = Activity[]

export type GetActivityLogResponse = {
    data: Activities
    loadable: boolean
}

// New types for notification-based activity log
export type NotificationActivity = {
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
}

export type NotificationActivities = NotificationActivity[]

export type GetNotificationActivityLogResponse = {
    data: NotificationActivities
    loadable: boolean
}
