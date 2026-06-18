import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import AuthSplitLayout from '@/components/layouts/AuthSplitLayout'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import InlineLink from '@/components/ui/InlineLink'
import {
    apiForgotPassword,
    apiResetPassword,
} from '@/services/AuthService'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const token = params.get('token')
    const email = params.get('email')?.replace(/ /g, '+') ?? ''

    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [expired, setExpired] = useState(false)
    const [resendMessage, setResendMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        if (!token || !email) {
            setError('Invalid recovery link')
            return
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }

        setError(null)
        setLoading(true)
        try {
            await apiResetPassword({
                password,
                token: Number(token),
                email,
            })
            navigate('/login?action=password-reset-success')
        } catch (err) {
            const axiosErr = err as {
                message?: string
                response?: { data?: { code?: string; message?: string } }
            }
            const code = axiosErr.response?.data?.code
            const message =
                axiosErr.response?.data?.message ??
                axiosErr.message ??
                'Unable to reset password'
            if (code === 'INVALID_TOKEN' || code === 'USER_NOT_FOUND') {
                setExpired(true)
            }
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    async function resendLink() {
        if (!email) return
        setResendMessage(null)
        try {
            await apiForgotPassword({ email })
            setResendMessage('A new recovery link has been sent to your email.')
        } catch (err) {
            const axiosErr = err as { message?: string }
            setResendMessage(
                axiosErr.message ??
                    'Unable to send a new link. Please try again.',
            )
        }
    }

    if (!token || !email) {
        return (
            <AuthSplitLayout>
                <div className="flex flex-col gap-[30px]">
                    <h1 className="ab-display">Account recovery</h1>
                    <p className="ab-serif text-coral">
                        This recovery link is invalid. Request a new one from{' '}
                        <InlineLink to="/account-recovery">
                            account recovery
                        </InlineLink>
                        .
                    </p>
                </div>
            </AuthSplitLayout>
        )
    }

    return (
        <AuthSplitLayout>
            <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[15px]">
                    <h1 className="ab-display">Account recovery</h1>
                    <p className="ab-serif">Please enter your new password</p>
                </div>

                <form
                    className="flex max-w-[543px] flex-col gap-[30px]"
                    onSubmit={onSubmit}
                >
                    <div className="flex flex-col gap-5">
                        <TextField
                            required
                            type="password"
                            variant="soft"
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            value={password}
                            error={!!error}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            required
                            type="password"
                            variant="soft"
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            value={confirm}
                            error={!!error}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                        {error && <p className="ab-text-m text-coral">{error}</p>}
                        {expired && (
                            <button
                                type="button"
                                className="ab-text-s text-left underline"
                                onClick={() => void resendLink()}
                            >
                                Resend recovery link
                            </button>
                        )}
                        {resendMessage && (
                            <p className="ab-text-s text-ink/70">{resendMessage}</p>
                        )}
                    </div>

                    <PillButton type="submit" loading={loading}>
                        Submit
                    </PillButton>

                    <div className="flex flex-wrap items-center gap-x-[10px] gap-y-1 border-t border-ink pt-5">
                        <span className="ab-serif">
                            Already have an account?
                        </span>
                        <InlineLink to="/login">Log in</InlineLink>
                    </div>
                </form>
            </div>
        </AuthSplitLayout>
    )
}
