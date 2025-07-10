import ApiService from './ApiService'
import type {
    CreateClickRequest,
    UpdateClickRequest,
    ClickAnalyticsResponse,
} from '@/@types/click'

export async function apiCreateClick(data: CreateClickRequest) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: '/click',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiGetClick(id: number) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/${id}`,
        method: 'get',
    })
}

export async function apiGetClicksByEvent(eventId: number) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/event/${eventId}`,
        method: 'get',
    })
}

export async function apiGetClicksByLead(leadId: number) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/lead/${leadId}`,
        method: 'get',
    })
}

export async function apiGetClicksByLeadAndEvent(
    leadId: number,
    eventId: number,
) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/lead/${leadId}/event/${eventId}`,
        method: 'get',
    })
}

export async function apiGetClicksByType(
    clickType: 'schedule_callback' | 'upgrade',
) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/type/${clickType}`,
        method: 'get',
    })
}

export async function apiUpdateClick(id: number, data: UpdateClickRequest) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/${id}`,
        method: 'put',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiDeleteClick(id: number) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/${id}`,
        method: 'delete',
    })
}

export async function apiDeleteClicksByEvent(eventId: number) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/event/${eventId}`,
        method: 'delete',
    })
}

export async function apiDeleteClicksByLead(leadId: number) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/lead/${leadId}`,
        method: 'delete',
    })
}

export async function apiGetClickCountByEvent(eventId: number) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/event/${eventId}/count`,
        method: 'get',
    })
}

export async function apiGetClickCountByLead(leadId: number) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/lead/${leadId}/count`,
        method: 'get',
    })
}

export async function apiGetClickCountByType(
    clickType: 'schedule_callback' | 'upgrade',
) {
    return ApiService.fetchDataWithAxios<ClickAnalyticsResponse>({
        url: `/click/type/${clickType}/count`,
        method: 'get',
    })
}
