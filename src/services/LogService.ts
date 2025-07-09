import ApiService from './ApiService'
import type { GetNotificationListResponse } from '@/@types/notification'

export async function apiGetLogs<T, U extends Record<string, unknown>>(
    params: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/api/logs',
        method: 'get',
        params,
    })
}

export async function apiGetNotificationLogs(params: {
    page?: number
    limit?: number
}) {
    return ApiService.fetchDataWithAxios<GetNotificationListResponse>({
        url: '/notification/my',
        method: 'get',
        params,
    })
}
