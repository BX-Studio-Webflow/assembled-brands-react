import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import PublicShell from '@/components/layouts/PublicShell'
import BeigeCard from '@/components/shared/BeigeCard'
import HexPattern from '@/components/shared/HexPattern'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import InlineLink from '@/components/ui/InlineLink'
import { useAuth } from '@/lib/auth'
import { resolvePostLoginRoute , isValidEmail } from '@/lib/routing/postLogin'


export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [showRecovery, setShowRecovery] = useState(false)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setShowRecovery(false)

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
            const target = resolvePostLoginRoute(res.response)
            const [path, query] = target.split('?')
            navigate(query ? `${path}?${query}` : path)
            return
        }

        setError(res.error)
        if (res.code === 'AUTH_INVALID_PASSWORD') {
            setShowRecovery(true)
        }
    }

    return (
        <PublicShell mainClassName="p-4 md:p-[40px]">
            <BeigeCard className="flex flex-1 items-center justify-center px-6 py-12 md:pb-[56px] md:pl-[50px] md:pr-[40px] md:pt-[50px]">
                <HexPattern className="pointer-events-none absolute -right-10 top-1/2 hidden h-[560px] w-[520px] -translate-y-1/2 opacity-60 lg:block" />

                <div className="relative z-10 flex w-full max-w-[543px] flex-col gap-[30px]">
                    <h1 className="ab-display">Welcome to Assembled Brands</h1>

                    <form className="flex flex-col gap-[30px]" onSubmit={onSubmit}>
                        <div className="flex flex-col gap-5">
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
                            {showRecovery && (
                                <p className="ab-text-s">
                                    <InlineLink to="/account-recovery">
                                        Recover your account
                                    </InlineLink>
                                </p>
                            )}
                        </div>

                        <PillButton fullWidth loading={loading} type="submit">
                            Continue
                        </PillButton>
                    </form>

                    <div className="flex flex-wrap items-center gap-x-[10px] gap-y-1 border-t border-ink pt-5">
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
