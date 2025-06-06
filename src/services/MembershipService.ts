import {
    GetMembershipsResponse,
    Membership,
    MembershipQueryParams,
} from '@/@types/membership'
import ApiService from './ApiService'

export async function apiGetMemberships(
    params?: MembershipQueryParams,
): Promise<GetMembershipsResponse> {
    return ApiService.fetchDataWithAxios<GetMembershipsResponse>({
        url: '/membership',
        method: 'get',
        params,
    })
}

export async function apiGetMembership(id: number): Promise<Membership> {
    return ApiService.fetchDataWithAxios<Membership>({
        url: `/membership/${id}`,
        method: 'get',
    })
}
