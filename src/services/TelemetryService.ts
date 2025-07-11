import ApiService from './ApiService'
import type {
    EventTelemetry,
    CreateTelemetryRequest,
    UpdateTelemetryRequest,
    LeaveEventRequest,
    UpdateWatchTimeRequest,
    EventAnalytics,
} from '@/@types/telemetry'

export async function apiCreateTelemetry(data: CreateTelemetryRequest) {
    return ApiService.fetchDataWithAxios<{
        message: string
        telemetryId: number
        watchTime: number
    }>({
        url: '/telemetry',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiGetTelemetry(id: number) {
    return ApiService.fetchDataWithAxios<EventTelemetry>({
        url: `/telemetry/${id}`,
        method: 'get',
    })
}

export async function apiGetTelemetryByLeadId(leadId: number) {
    return ApiService.fetchDataWithAxios<EventTelemetry[]>({
        url: `/telemetry/lead/${leadId}`,
        method: 'get',
    })
}

export async function apiGetTelemetryByEventId(eventId: number) {
    return ApiService.fetchDataWithAxios<EventTelemetry[]>({
        url: `/telemetry/event/${eventId}`,
        method: 'get',
    })
}

export async function apiGetActiveSessions(eventId: number) {
    return ApiService.fetchDataWithAxios<EventTelemetry[]>({
        url: `/telemetry/event/${eventId}/active`,
        method: 'get',
    })
}

export async function apiGetEventAnalytics(eventId: number) {
    return ApiService.fetchDataWithAxios<EventAnalytics>({
        url: `/telemetry/event/${eventId}/analytics`,
        method: 'get',
    })
}

export async function apiUpdateTelemetry(
    id: number,
    data: UpdateTelemetryRequest,
) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `/telemetry/${id}`,
        method: 'put',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiRecordLeaveEvent(data: LeaveEventRequest) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: '/telemetry/leave',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiUpdateWatchTime(data: UpdateWatchTimeRequest) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: '/telemetry/watch-time',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiDeleteTelemetry(id: number) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `/telemetry/${id}`,
        method: 'delete',
    })
}

export async function apiClearTelemetryLogs(eventId: number) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: `/telemetry/clear-logs/${eventId}`,
        method: 'delete',
    })
}

// Lobby Telemetry APIs
export async function apiCreateLobbyTelemetry(data: {
    event_id: number
    token: string
    email: string
    code: string
}) {
    return ApiService.fetchDataWithAxios<{
        message: string
        telemetryId: number
        sessionId: string
    }>({
        url: '/telemetry/lobby-telemetry',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiLeaveLobby(data: {
    lead_id: number
    event_id: number
    exit_reason: 'event_started' | 'left' | 'timeout'
}) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: '/telemetry/lobby-telemetry/exit',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiGetLobbyAnalytics(eventId: number) {
    return ApiService.fetchDataWithAxios<{
        totalLobbySessions: number
        totalLobbyTime: number
        averageLobbyTime: number
        exitReasonStats: Record<string, number>
    }>({
        url: `/telemetry/lobby-telemetry/event/${eventId}/analytics`,
        method: 'get',
    })
}
