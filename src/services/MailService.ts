import { MailRequestBody, MailSearchRequestBody } from '@/@types/mail'
import ApiService from './ApiService'

export async function apiGetMails<T>(params?: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/email',
        method: 'get',
        params,
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