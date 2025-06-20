export interface EventTelemetry {
    id: number
    lead_id: number
    event_id: number
    session_id: string
    joined_at: string
    left_at: string | null
    total_watch_time: number | null
    device: string | null
    browser: string | null
    os: string | null
    ip_address: string | null
    created_at: string
}

export interface CreateTelemetryRequest {
    event_id: number
    session_id: string
    device?: string
    browser?: string
    os?: string
    ip_address?: string
    token: string
    email: string
    code: string
    [key: string]: unknown
}

export interface UpdateTelemetryRequest {
    total_watch_time?: number
    device?: string
    browser?: string
    os?: string
    ip_address?: string
    [key: string]: unknown
}

export interface LeaveEventRequest {
    session_id: string
    total_watch_time: number
    [key: string]: unknown
}

export interface UpdateWatchTimeRequest {
    session_id: string
    watch_time: number
    [key: string]: unknown
}

export interface EventAnalytics {
    totalSessions: number
    totalWatchTime: number
    averageWatchTime: number
    deviceStats: Record<string, number>
    browserStats: Record<string, number>
}

export interface TelemetryQueryParams {
    page?: number
    limit?: number
    event_id?: number
    lead_id?: number
}
