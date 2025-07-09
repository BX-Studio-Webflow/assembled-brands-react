export interface GetNotificationCountResponse {
    count: number
}

export interface GetNotificationListResponse {
    success: boolean
    notifications: Notification[]
    unreadNotifications: Notification[]
    count: number
}

export interface Notification {
    id: number
    user_id: number
    notification_type: string
    is_read: boolean
    message: string
    link: string
    metadata: {
        lead_id: number
        event_id: number | null
        lead_name: string
        event_name: string | null
        lead_email: string
    }
    created_at: string
    updated_at: string
}
