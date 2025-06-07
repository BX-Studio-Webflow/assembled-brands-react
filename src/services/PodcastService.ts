import ApiService from './ApiService'
import type {
    Podcast,
    GetPodcastsResponse,
    PodcastQueryParams,
    CreatePodcastRequest,
    PodcastDetails,
} from '@/@types/podcast'

export async function apiGetPodcasts(
    params?: PodcastQueryParams,
): Promise<GetPodcastsResponse> {
    return ApiService.fetchDataWithAxios<GetPodcastsResponse>({
        url: '/podcast',
        method: 'get',
        params,
    })
}

export async function apiGetPodcast(id: number): Promise<PodcastDetails> {
    return ApiService.fetchDataWithAxios<PodcastDetails>({
        url: `/podcast/${id}`,
        method: 'get',
    })
}

export async function apiCreatePodcast(data: CreatePodcastRequest) {
    return ApiService.fetchDataWithAxios<Podcast>({
        url: '/podcast',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiDeletePodcast(id: number) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/podcast/${id}`,
        method: 'delete',
    })
}
