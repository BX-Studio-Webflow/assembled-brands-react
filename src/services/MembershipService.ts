import {
    CreateMembershipBody,
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

export async function apiCreateMembership(
    data: CreateMembershipBody,
): Promise<Membership> {
    return ApiService.fetchDataWithAxios<Membership>({
        url: '/membership',
        method: 'post',
        data,
    })
}

export async function apiUpdateMembership(
    id: number,
    data: CreateMembershipBody,
): Promise<Membership> {
    return ApiService.fetchDataWithAxios<Membership>({
        url: `/membership/${id}`,
        method: 'put',
        data,
    })
}
