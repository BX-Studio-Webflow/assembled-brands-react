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
    has_left: boolean
    left_scenario: string | null
    created_at: string
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
}

export interface CreateTelemetryRequest {
    event_id: number
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
    token: string
    email: string
    code: string
    scenario:
        | 'TAB_CLOSED'
        | 'TAB_SWITCHED'
        | 'PAGE_NAVIGATED'
        | 'VIDEO_ENDED'
        | 'BROWSER_CLOSED'
        | 'COMPONENT_UNMOUNTED'
        | 'PAGE_FOCUSED'
    [key: string]: unknown
}

export interface UpdateWatchTimeRequest {
    telemetry_id: number
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

// Lobby Telemetry Types
export interface LobbyTelemetry {
    id: number
    event_id: number
    lead_id: number
    session_id: string
    joined_at: string
    left_at: string | null
    duration: number | null
    exit_reason: string | null
    created_at: string
    lead?: {
        id: number
        name: string | null
        email: string | null
        phone: string | null
        dial_code: string | null
    } | null
}

export interface CreateLobbyTelemetryRequest {
    event_id: number
    token: string
    email: string
    code: string
}

export interface LeaveLobbyRequest {
    lead_id: number
    event_id: number
    exit_reason: 'event_started' | 'left' | 'timeout'
}

export interface LobbyAnalytics {
    totalLobbySessions: number
    totalLobbyTime: number
    averageLobbyTime: number
    exitReasonStats: Record<string, number>
}
