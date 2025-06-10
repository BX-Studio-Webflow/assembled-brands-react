import ApiService from './ApiService'
import type {
    GetEventsResponse,
    EventQueryParams,
    EventWithDetailsAndCount,
} from '@/@types/events'

export async function apiGetEvents(params?: EventQueryParams) {
    return ApiService.fetchDataWithAxios<GetEventsResponse>({
        url: '/event',
        method: 'get',
        params,
    })
}

export async function apiGetEvent(id: number) {
    return ApiService.fetchDataWithAxios<EventWithDetailsAndCount>({
        url: `/event/${id}`,
        method: 'get',
    })
}
