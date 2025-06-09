import { MailRequestBody } from '@/@types/mail'
import ApiService from './ApiService'

export async function apiGetMails<T>(params?: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/Mail',
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
