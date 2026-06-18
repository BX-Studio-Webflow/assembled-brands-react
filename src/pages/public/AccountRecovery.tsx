import { useState, type FormEvent } from 'react'
import AuthSplitLayout from '@/components/layouts/AuthSplitLayout'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import InlineLink from '@/components/ui/InlineLink'
import { apiStartAccountRecovery } from '@/services/AuthService'
import { isValidEmail } from '@/lib/routing/postLogin'

export default function AccountRecovery() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        if (!email.trim()) {
            setError('Email is required')
            return
        }
        if (!isValidEmail(email)) {
            setError('Please enter a valid email')
            return
        }

        setLoading(true)
        try {
            const response = await apiStartAccountRecovery({
                email: email.trim(),
            })
            setSuccess(
                response.message ||
                    'Please check your email for your verification',
            )
        } catch (err) {
            const axiosErr = err as {
                message?: string
                response?: { data?: { code?: string; message?: string } }
            }
            setError(
                axiosErr.response?.data?.message ??
                    axiosErr.message ??
                    'Unable to start account recovery',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthSplitLayout>
            <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[15px]">
                    <h1 className="ab-display">Account recovery</h1>
                    <p className="ab-serif">
                        Enter the email address associated with your account to
                        recover your account.
                    </p>
                </div>

                <form
                    className="flex max-w-[543px] flex-col gap-[30px]"
                    onSubmit={onSubmit}
                >
                    <TextField
                        required
                        type="email"
                        variant="soft"
                        placeholder="Enter your email"
                        autoComplete="email"
                        value={email}
                        error={!!error}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError(null)
                            setSuccess(null)
                        }}
                    />

                    {error && <p className="ab-text-m text-coral">{error}</p>}
                    {success && (
                        <p className="ab-text-m text-softgreen">{success}</p>
                    )}

                    <PillButton
                        type="submit"
                        loading={loading}
                        disabled={Boolean(success)}
                    >
                        {success ? 'Email sent' : 'Submit'}
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
