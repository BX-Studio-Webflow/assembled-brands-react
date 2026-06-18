import type { InternalAxiosRequestConfig } from 'axios'

import { appConfig } from '@/lib/config'
import { getCookie } from '@/lib/session'

export default function AxiosRequestIntrceptorConfigCallback(
    config: InternalAxiosRequestConfig,
) {
    const accessToken = getCookie(appConfig.TOKEN_NAME_IN_STORAGE) || ''

    if (accessToken) {
        config.headers[appConfig.REQUEST_HEADER_AUTH_KEY] =
            `${appConfig.TOKEN_TYPE} ${accessToken}`
    }

    const teamId = localStorage.getItem('x-team-id')
    if (teamId) {
        config.headers['X-Team-Id'] = teamId
    }

    const dealId = localStorage.getItem('x-deal-id')
    if (dealId) {
        config.headers['X-Deal-Id'] = dealId
    }

    return config
}
