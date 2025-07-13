import ApiService from './ApiService'
import type {
    ServerTimeResponse,
    TimeSyncRequest,
    TimeSyncResponse,
    EventTimeInfoResponse,
    TimeSyncUpdateRequest,
    TimeSyncAnalyticsResponse,
} from '@/@types/timeSync'

export async function apiGetServerTime() {
    return ApiService.fetchDataWithAxios<ServerTimeResponse>({
        url: '/event/server-time',
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiSyncTime(data: TimeSyncRequest) {
    return ApiService.fetchDataWithAxios<TimeSyncResponse>({
        url: '/events/time/sync',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiGetEventTimeInfo(eventId: number) {
    return ApiService.fetchDataWithAxios<EventTimeInfoResponse>({
        url: `/events/${eventId}/time-info`,
        method: 'get',
    })
}

export async function apiUpdateTimeSync(data: TimeSyncUpdateRequest) {
    return ApiService.fetchDataWithAxios<{ message: string }>({
        url: '/events/time/sync/update',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiGetTimeSyncAnalytics(eventId: number) {
    return ApiService.fetchDataWithAxios<TimeSyncAnalyticsResponse>({
        url: `/events/${eventId}/time-sync/analytics`,
        method: 'get',
    })
}
