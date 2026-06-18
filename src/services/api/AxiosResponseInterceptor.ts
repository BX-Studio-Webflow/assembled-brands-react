import type { AxiosError } from 'axios'

import { clearSession } from '@/lib/session'

const UNAUTHORIZED_CODES = [401, 419, 440]

export default function AxiosResponseIntrceptorErrorCallback(
    error: AxiosError,
) {
    const { response } = error

    if (window.location.pathname.includes('/login')) {
        return
    }

    if (response && UNAUTHORIZED_CODES.includes(response.status)) {
        clearSession()
        window.location.assign('/login?error=unauthorized')
    }
}
