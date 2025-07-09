import ApiService from './ApiService'
import type {
    GetNotificationCountResponse,
    GetNotificationListResponse,
} from '@/@types/notification'

export async function apiGetNotificationCount() {
    return ApiService.fetchDataWithAxios<GetNotificationCountResponse>({
        url: '/notification/unread-count',
        method: 'get',
    })
}

export async function apiGetNotificationList() {
    return ApiService.fetchDataWithAxios<GetNotificationListResponse>({
        url: '/notification/my',
        method: 'get',
    })
}

export async function apiMarkNotificationAsRead(id: number) {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>(
        {
            url: `/notification/${id}/read`,
            method: 'post',
        },
    )
}

export async function apiMarkAllNotificationsAsRead() {
    return ApiService.fetchDataWithAxios<{ success: boolean; message: string }>(
        {
            url: '/notification/mark-all-read',
            method: 'post',
        },
    )
}

export async function apiGetSearchResult<T>(params: { query: string }) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/search/query',
        method: 'get',
        params,
    })
}
