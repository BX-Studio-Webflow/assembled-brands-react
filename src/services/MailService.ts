import { CreateBulkMailBody, MailRequestBody, MailSearchRequestBody } from '@/@types/mail'
import ApiService from './ApiService'

export async function apiGetMails<T>(params?: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/email',
        method: 'get',
        params,
    })
}

export async function apiGetMail<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/email/${id}`,
        method: 'get',
    })
}

export async function apiCreateFollowUpEmail(data: CreateBulkMailBody) {
    return ApiService.fetchDataWithAxios({
        url: '/email/follow-up',
        method: 'post',
        data,
    })
}

export async function apiCreateMail(data: MailRequestBody) {
    return ApiService.fetchDataWithAxios({
        url: '/email',
        method: 'post',
        data,
    })
}

export async function apiSearchMails(data: MailSearchRequestBody) {
    return ApiService.fetchDataWithAxios({
        url: '/lead/search',
        method: 'post',
        data,
    })
}

export async function apiToggleMail(id: number, action: 'flag' | 'star') {
    return ApiService.fetchDataWithAxios({
        url: '/email/toggle',
        method: 'post',
        data: { id, action },
    })
}

export async function apiDeleteMail(id: number) {
    return ApiService.fetchDataWithAxios({
        url: `/email/${id}`,
        method: 'delete',
    })
}
