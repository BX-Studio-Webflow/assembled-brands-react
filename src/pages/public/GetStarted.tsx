import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import AuthSplitLayout from '@/components/layouts/AuthSplitLayout'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import InlineLink from '@/components/ui/InlineLink'
import { useAuth } from '@/lib/auth'
import { sleep } from '@/lib/utils'
import { useApplicationStore } from '@/store/applicationStore'

export default function GetStarted() {
    const navigate = useNavigate()
    const { emailExists } = useAuth()
    const patchClaim = useApplicationStore((s) => s.patchClaim)
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const exists = email.trim().length > 0 && emailExists(email)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        if (exists) return
        setLoading(true)
        await sleep(400)
        patchClaim({ workEmail: email.trim() })
        setLoading(false)
        navigate('/apply')
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
                        error={exists}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div className="flex flex-col gap-[15px]">
                        <PillButton
                            fullWidth
                            type="submit"
                            variant={exists ? 'muted' : 'stack'}
                            disabled={exists}
                            loading={loading}
                        >
                            {exists
                                ? 'An account with this email already exists'
                                : 'Get started'}
                        </PillButton>

                        {exists && (
                            <div className="flex flex-wrap items-center gap-x-[10px] gap-y-1">
                                <span className="ab-serif">Forgot password?</span>
                                <InlineLink to="/recover">
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
