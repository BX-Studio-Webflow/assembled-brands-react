import ApiService from './ApiService'
import type {
    Event,
    GetEventsResponse,
    EventQueryParams,
    CreateEventRequest,
    UpdateEventRequest,
    CancelEventRequest,
    EventStreamRequest,
    EventMembershipsResponse,
    EventStreamResponse,
} from '@/@types/events'

export async function apiGetEvents(params?: EventQueryParams) {
    return ApiService.fetchDataWithAxios<GetEventsResponse>({
        url: '/event',
        method: 'get',
        params,
    })
}

export async function apiGetEvent(id: number) {
    return ApiService.fetchDataWithAxios<Event>({
        url: `/event/${id}`,
        method: 'get',
    })
}

export async function apiCreateEvent(data: CreateEventRequest) {
    return ApiService.fetchDataWithAxios<Event>({
        url: '/event',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiStreamEvent(data: EventStreamRequest) {
    return ApiService.fetchDataWithAxios<EventStreamResponse>({
        url: '/event/stream',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}


export async function apiUpdateEvent(id: number, data: UpdateEventRequest) {
    return ApiService.fetchDataWithAxios<Event>({
        url: `/event/${id}`,
        method: 'put',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiDeleteEvent(id: number) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/event/${id}`,
        method: 'delete',
    })
}

export async function apiCancelEvent(data: CancelEventRequest) {
    return ApiService.fetchDataWithAxios<void>({
        url: '/event/cancel',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiGetEventMemberships(id: number) {
    return ApiService.fetchDataWithAxios<EventMembershipsResponse>({
        url: `/event/${id}/memberships`,
        method: 'get',
    })
}

export async function apiStreamPrerecordedEvent(data: EventStreamRequest) {
    return ApiService.fetchDataWithAxios<EventStreamResponse>({
        url: '/event/stream',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}
