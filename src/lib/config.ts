const API_LOCAL_DEV_URL = 'http://127.0.0.1:8787'
const API_REMOTE_DEV_URL =
    'https://assembled-brands-dev.crystal-e8a.workers.dev'

type DevMode = 'local' | 'remote-dev'

function resolveApiBaseUrl() {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL as string
    }
    const devMode =
        (localStorage.getItem('api-mode') as DevMode | null) ?? 'remote-dev'
    return devMode === 'local' ? API_LOCAL_DEV_URL : API_REMOTE_DEV_URL
}

export const appConfig = {
    get apiBaseUrl() {
        return resolveApiBaseUrl()
    },
    apiVersion: '/api/v1',
    accessTokenPersistStrategy: 'cookie' as const,
    TOKEN_NAME_IN_STORAGE: 'accessToken',
    TOKEN_TYPE: 'Bearer',
    REQUEST_HEADER_AUTH_KEY: 'Authorization',
}
