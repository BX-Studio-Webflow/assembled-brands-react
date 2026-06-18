import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import PublicShell from '@/components/layouts/PublicShell'
import BeigeCard from '@/components/shared/BeigeCard'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import InlineLink from '@/components/ui/InlineLink'
import { useAuth } from '@/lib/auth'
import { resolvePostLoginRoute, isValidEmail } from '@/lib/routing/postLogin'
import { cx } from '@/lib/utils'
import loginHexagon from '@/assets-ab/login-hexagon.png'

function loginBannerMessage(
    error: string | null,
    action: string | null,
): { tone: 'success' | 'info' | 'error'; text: string } | null {
    if (action === 'password-reset-success') {
        return {
            tone: 'success',
            text: 'Your password has been reset. Sign in with your new password.',
        }
    }
    if (error === 'unauthorized') {
        return {
            tone: 'error',
            text: 'Your session has expired. Please sign in again.',
        }
    }
    if (error === 'logged-out') {
        return {
            tone: 'info',
            text: 'You have been signed out.',
        }
    }
    return null
}

export default function Login() {
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const banner = useMemo(
        () =>
            loginBannerMessage(
                searchParams.get('error'),
                searchParams.get('action'),
            ),
        [searchParams],
    )

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)

        if (!email.trim()) {
            setError('Email is required')
            return
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email')
            return
        }
        if (!password) {
            setError('Password cannot be empty')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }

        setLoading(true)
        const res = await login(email, password)
        setLoading(false)

        if (res.ok) {
            if (searchParams.has('error') || searchParams.has('action')) {
                setSearchParams({}, { replace: true })
            }
            const target = resolvePostLoginRoute(res.response)
            const [path, query] = target.split('?')
            navigate(query ? `${path}?${query}` : path)
            return
        }

        setError(res.error)
    }

    return (
        <PublicShell mainClassName="p-4 md:p-[40px]">
            <BeigeCard className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12 md:pb-[56px] md:pl-[50px] md:pr-[40px] md:pt-[50px]">
                <img
                    aria-hidden
                    src={loginHexagon}
                    alt=""
                    className="pointer-events-none absolute -bottom-16 -right-10 z-0 hidden h-auto w-[566px] max-w-[55%] opacity-50 lg:block"
                />

                <div className="relative z-10 flex w-full max-w-[543px] flex-col gap-[30px]">
                    <h1 className="ab-display w-full">Welcome to Assembled Brands</h1>

                    {banner && (
                        <div
                            className={cx(
                                'rounded-[4px] px-4 py-3',
                                banner.tone === 'success' && 'bg-softgreen',
                                banner.tone === 'info' && 'bg-beige',
                                banner.tone === 'error' && 'bg-coral/15',
                            )}
                            role="status"
                        >
                            <p className="ab-text-m text-ink">{banner.text}</p>
                        </div>
                    )}

                    <form
                        className="flex w-full flex-col gap-[30px]"
                        onSubmit={onSubmit}
                    >
                        <div className="flex w-full flex-col gap-[20px]">
                            <TextField
                                required
                                type="email"
                                placeholder="Email Address"
                                autoComplete="email"
                                value={email}
                                error={!!error && error.includes('email')}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                required
                                type="password"
                                placeholder="Password"
                                autoComplete="current-password"
                                value={password}
                                error={!!error}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && (
                                <p className="ab-text-m text-coral">{error}</p>
                            )}
                        </div>

                        <div className="flex w-full items-center justify-between gap-4">
                            <PillButton loading={loading} type="submit">
                                Continue
                            </PillButton>
                            <InlineLink to="/account-recovery">
                                Forgot password
                            </InlineLink>
                        </div>
                    </form>

                    <div className="flex w-full flex-wrap items-center gap-x-[10px] gap-y-1 border-t border-ink pt-5">
                        <span className="ab-serif">
                            Looking to get started with Assembled Brands for your
                            business?
                        </span>
                        <InlineLink to="/register-get-started">Sign Up</InlineLink>
                    </div>
                </div>
            </BeigeCard>
        </PublicShell>
    )
}
