import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import { apiVerifyRegistration } from '@/services/AuthService'
import { persistLoginSession } from '@/lib/session'

export default function AccountSetupFinishVerification() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const token = Number(params.get('token'))
    const id = Number(params.get('id'))

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)

        if (password.length < 8) {
            setError('Password must be at least 8 characters long')
            return
        }
        if (password !== confirm) {
            setError('Passwords do not match')
            return
        }
        if (!token || !id) {
            setError('Invalid verification link')
            return
        }

        setLoading(true)
        try {
            const response = await apiVerifyRegistration({
                token,
                id,
                password,
            })
            persistLoginSession(response.token, response.user)
            navigate('/onboarding-wizard?step=start')
        } catch (err) {
            const message =
                (err as { message?: string }).message ??
                'Verification failed. Please try again.'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <CenteredCardLayout title="Set your password">
            <form className="flex flex-col gap-[30px]" onSubmit={onSubmit}>
                <TextField
                    required
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    required
                    type="password"
                    placeholder="Confirm password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                />
                {error && <p className="ab-text-m text-coral">{error}</p>}
                <PillButton fullWidth loading={loading} type="submit">
                    Continue
                </PillButton>
            </form>
        </CenteredCardLayout>
    )
}
