export interface ServerTimeResponse {
    serverTime: string
    timestamp: number
    timezone: string
    eventId?: string | null
    latency?: number
}

export interface TimeSyncRequest {
    eventId?: number
    clientTime: number
    clientTimezone: string
}

export interface TimeSyncResponse {
    serverTime: string
    timestamp: number
    timezone: string
    eventId?: number
    calculatedLatency: number
    recommendedSyncInterval: number
}

export interface EventTimeInfoResponse {
    eventId: number
    eventStartTime: string
    eventEndTime: string
    serverTime: string
    timeUntilStart: number
    timeUntilEnd: number
}

export interface TimeSyncUpdateRequest {
    eventId: number
    clientTime: number
    timeOffset: number
    syncQuality: 'good' | 'poor' | 'excellent'
}

export interface TimeSyncAnalyticsResponse {
    totalSyncs: number
    averageLatency: number
    syncSuccessRate: number
    averageTimeOffset: number
    lastSyncTime: string
}

export interface TimeSyncState {
    timeOffset: number
    isTimeSynced: boolean
    syncInterval: number
    lastSyncTime: number
    syncQuality: 'good' | 'poor' | 'excellent'
}
