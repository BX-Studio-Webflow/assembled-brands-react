import { useState, type FormEvent } from 'react'
import AuthSplitLayout from '@/components/layouts/AuthSplitLayout'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import InlineLink from '@/components/ui/InlineLink'
import { apiColdLeadRegister } from '@/services/AuthService'
import { isValidEmail } from '@/lib/routing/postLogin'

export default function GetStarted() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [exists, setExists] = useState(false)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        setExists(false)

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
            const response = await apiColdLeadRegister({
                work_email: email.trim(),
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
            const code = axiosErr.response?.data?.code
            const message =
                axiosErr.response?.data?.message ??
                axiosErr.message ??
                'Unable to register'
            setError(message)
            if (code === 'USER_EXISTS') {
                setExists(true)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthSplitLayout>
            <div className="flex flex-col gap-[30px]">
                <div className="flex flex-col gap-[15px]">
                    <h1 className="ab-display">Get started</h1>
                    <p className="ab-serif">
                        Funding for CPG brands *(gentled prompt for types of
                        funding)
                    </p>
                </div>

                <form
                    noValidate
                    className="flex max-w-[543px] flex-col gap-[30px]"
                    onSubmit={onSubmit}
                >
                    <TextField
                        required
                        type="email"
                        placeholder="What's your work email?"
                        autoComplete="email"
                        value={email}
                        error={!!error || exists}
                        onChange={(e) => {
                            setEmail(e.target.value)
                            setError(null)
                            setExists(false)
                            setSuccess(null)
                        }}
                    />

                    {error && <p className="ab-text-m text-coral">{error}</p>}
                    {success && (
                        <p className="ab-text-m text-softgreen">{success}</p>
                    )}

                    <div className="flex flex-col gap-[15px]">
                        <PillButton
                            fullWidth
                            type="submit"
                            variant={exists ? 'muted' : 'stack'}
                            disabled={Boolean(success)}
                            loading={loading}
                        >
                            {success
                                ? 'Email sent'
                                : exists
                                  ? 'An account with this email already exists'
                                  : 'Get started'}
                        </PillButton>

                        {exists && (
                            <div className="flex flex-wrap items-center gap-x-[10px] gap-y-1">
                                <span className="ab-serif">Forgot password?</span>
                                <InlineLink to="/account-recovery">
                                    Recover account
                                </InlineLink>
                            </div>
                        )}
                    </div>

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
