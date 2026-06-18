import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react'
import { apiSignIn } from '@/services/AuthService'
import type { SignInResponse, User } from '@/types/auth'
import {
    clearSession,
    getCookie,
    getStoredUser,
    isAuthenticated as hasSession,
    persistLoginSession,
    setStoredUser,
} from '@/lib/session'

export type AuthUser = User

type AuthContextValue = {
    user: AuthUser | null
    session: SignInResponse | null
    isAuthenticated: boolean
    loading: boolean
    login: (
        email: string,
        password: string,
    ) => Promise<
        | { ok: true; response: SignInResponse }
        | { ok: false; error: string; code?: string }
    >
    applySession: (response: SignInResponse) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [session, setSession] = useState<SignInResponse | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (hasSession()) {
            setUser(getStoredUser())
        }
        setLoading(false)
    }, [])

    const applySession = useCallback((response: SignInResponse) => {
        const team = response.teams?.[0]
        persistLoginSession(response.token, response.user, team?.team_id)
        setStoredUser(response.user)
        setUser(response.user)
        setSession(response)
    }, [])

    const login = useCallback<AuthContextValue['login']>(
        async (email, password) => {
            try {
                const response = await apiSignIn({ email, password })
                applySession(response)
                return { ok: true, response }
            } catch (error) {
                const err = error as {
                    message?: string
                    response?: { data?: { code?: string; message?: string } }
                }
                const code = err.response?.data?.code
                const message =
                    err.response?.data?.message ??
                    err.message ??
                    'Unable to sign in.'
                return { ok: false, error: message, code }
            }
        },
        [applySession],
    )

    const logout = useCallback(() => {
        clearSession()
        setUser(null)
        setSession(null)
    }, [])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            session,
            isAuthenticated: Boolean(user && getCookie('accessToken')),
            loading,
            login,
            applySession,
            logout,
        }),
        [user, session, loading, login, applySession, logout],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
