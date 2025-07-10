export interface ClickAnalytics {
    id: number
    lead_id: number
    event_id: number
    link_url: string
    clicked_at: string
    click_type: 'schedule_callback' | 'upgrade'
    created_at: string
    updated_at: string
    lead?: {
        id: number
        name: string | null
        email: string | null
        phone: string | null
        dial_code: string | null
        event_id: number
        registered_date: string | null
        membership_active: boolean
        form_identifier: string | null
        host_id: number
        token: string | null
        status_identifier: string
        lead_status: number
        source_url: string | null
        membership_level: number
        created_at: string
        updated_at: string
    } | null
    event?: {
        id: number
        title: string
        description: string | null
        start_date: string
        end_date: string
        host_id: number
        created_at: string
        updated_at: string
    } | null
}

export interface CreateClickRequest {
    lead_id: number
    event_id: number
    link_url: string
    click_type?: 'schedule_callback' | 'upgrade'
    [key: string]: unknown
}

export interface UpdateClickRequest {
    link_url?: string
    click_type?: 'schedule_callback' | 'upgrade'
    [key: string]: unknown
}

export interface ClickAnalyticsResponse {
    success: boolean
    clicks?: ClickAnalytics[]
    click?: ClickAnalytics
    count?: number
    click_id?: number
    message?: string
}

export interface ClickQueryParams {
    page?: number
    limit?: number
    lead_id?: number
    event_id?: number
    click_type?: 'schedule_callback' | 'upgrade'
}
