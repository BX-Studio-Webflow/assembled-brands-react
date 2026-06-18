import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react'
import { seededUsers, type DummyUser } from './dummyData'

const STORAGE_KEY = 'ab.auth.user'
const USERS_KEY = 'ab.auth.users'

export type AuthUser = {
    email: string
    name: string
}

type AuthResult = { ok: true } | { ok: false; error: string }

type AuthContextValue = {
    user: AuthUser | null
    isAuthenticated: boolean
    loading: boolean
    login: (email: string, password: string) => Promise<AuthResult>
    signup: (email: string, password?: string) => Promise<AuthResult>
    emailExists: (email: string) => boolean
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Fake network latency so the dummy flow feels real. */
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function readUsers(): DummyUser[] {
    try {
        const raw = localStorage.getItem(USERS_KEY)
        if (raw) return JSON.parse(raw) as DummyUser[]
    } catch {
        /* ignore */
    }
    return seededUsers
}

function writeUsers(users: DummyUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) setUser(JSON.parse(raw) as AuthUser)
            if (!localStorage.getItem(USERS_KEY)) writeUsers(seededUsers)
        } catch {
            /* ignore */
        }
        setLoading(false)
    }, [])

    const persist = useCallback((next: AuthUser | null) => {
        setUser(next)
        if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        else localStorage.removeItem(STORAGE_KEY)
    }, [])

    const emailExists = useCallback(
        (email: string) =>
            readUsers().some(
                (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
            ),
        [],
    )

    const login = useCallback<AuthContextValue['login']>(
        async (email, password) => {
            await wait(550)
            const match = readUsers().find(
                (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
            )
            if (!match) return { ok: false, error: 'No account found for that email.' }
            if (match.password !== password)
                return { ok: false, error: 'Incorrect password. Try again.' }
            persist({ email: match.email, name: match.name })
            return { ok: true }
        },
        [persist],
    )

    const signup = useCallback<AuthContextValue['signup']>(
        async (email, password = 'password') => {
            await wait(550)
            const normalized = email.trim().toLowerCase()
            if (readUsers().some((u) => u.email.toLowerCase() === normalized))
                return {
                    ok: false,
                    error: 'An account with this email already exists',
                }
            const next = readUsers().concat({
                email: email.trim(),
                password,
                name: email.split('@')[0],
            })
            writeUsers(next)
            persist({ email: email.trim(), name: email.split('@')[0] })
            return { ok: true }
        },
        [persist],
    )

    const logout = useCallback(() => persist(null), [persist])

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: !!user,
            loading,
            login,
            signup,
            emailExists,
            logout,
        }),
        [user, loading, login, signup, emailExists, logout],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
    return ctx
}
