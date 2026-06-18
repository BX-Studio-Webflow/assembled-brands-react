import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import AuthSplitLayout from '@/components/layouts/AuthSplitLayout'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import InlineLink from '@/components/ui/InlineLink'
import { sleep } from '@/lib/utils'

export default function ResetPassword() {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        if (password !== confirm) {
            setError('Passwords do not match.')
            return
        }
        setError(null)
        setLoading(true)
        await sleep()
        setLoading(false)
        navigate('/login')
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
