import type { AxiosError } from 'axios'
import axios from 'axios'

import { appConfig } from '@/lib/config'
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestInterceptor'
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseInterceptor'

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: appConfig.apiBaseUrl + appConfig.apiVersion,
})

AxiosBase.interceptors.request.use(
    (config) => AxiosRequestIntrceptorConfigCallback(config),
    (error) => Promise.reject(error),
)

AxiosBase.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error)
        return Promise.reject(error)
    },
)

export default AxiosBase
