export interface GetNotificationCountResponse {
    success: boolean
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
    notification_type:
        | 'comment'
        | 'like'
        | 'system'
        | 'reminder'
        | 'new_lead'
        | 'new_booking'
        | 'new_payment'
    is_read: boolean
    message: string
    title: string
    link?: string
    metadata?: {
        lead_id?: number
        event_id?: number | null
        lead_name?: string
        event_name?: string | null
        lead_email?: string
        [key: string]: unknown
    }
    created_at: string
    updated_at: string
}

// Frontend display types for the notification component
export interface NotificationDisplayItem {
    id: string
    target: string
    description: string
    title: string
    message: string
    date: string
    image: string
    type: number
    location: string
    locationLabel: string
    status: string
    readed: boolean
}
