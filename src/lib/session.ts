import type { User } from '@/types/auth'

export function setCookie(name: string, value: string, days: number) {
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`
}

export function getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ')
    for (const c of cookies) {
        const [key, val] = c.split('=')
        if (key === name) return decodeURIComponent(val)
    }
    return null
}

export function deleteCookie(name: string) {
    setCookie(name, '', -1)
}

export function getStoredUser(): User | null {
    try {
        const raw = localStorage.getItem('user')
        return raw ? (JSON.parse(raw) as User) : null
    } catch {
        return null
    }
}

export function setStoredUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user))
}

export function clearSession() {
    deleteCookie('accessToken')
    localStorage.removeItem('x-team-id')
    localStorage.removeItem('x-deal-id')
    localStorage.removeItem('user')
}

export function persistLoginSession(
    token: string,
    user: User,
    teamId?: number,
) {
    setCookie('accessToken', token, 10)
    setStoredUser(user)
    if (teamId) {
        localStorage.setItem('x-team-id', teamId.toString())
    }
}

export function isAuthenticated(): boolean {
    return Boolean(getCookie('accessToken'))
}

export function getUserRole() {
    return getStoredUser()?.role
}

export function isAdmin() {
    const role = getUserRole()
    return role === 'admin' || role === 'super-admin'
}
