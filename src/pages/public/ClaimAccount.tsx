import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import PublicShell from '@/components/layouts/PublicShell'
import BeigeCard from '@/components/shared/BeigeCard'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import { cx } from '@/lib/utils'
import { LOAN_URGENCY } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'
import { useAuth } from '@/lib/auth'
import photo from '@/assets-ab/claim-photo.png'

export default function ClaimAccount() {
    const navigate = useNavigate()
    const { signup } = useAuth()
    const claim = useApplicationStore((s) => s.claim)
    const patch = useApplicationStore((s) => s.patchClaim)
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: FormEvent) {
        e.preventDefault()
        setLoading(true)
        await signup(claim.workEmail || 'new.user@company.com', claim.password)
        setLoading(false)
        navigate('/app')
    }

    return (
        <PublicShell mainClassName="flex-col gap-[40px] p-4 md:p-[40px] lg:flex-row">
            <BeigeCard className="flex flex-1 items-center">
                <div className="w-full px-6 py-12 md:px-[50px] md:pr-10">
                    <div className="flex flex-col gap-[30px]">
                        <div className="flex flex-col gap-[15px]">
                            <h1 className="ab-display">Claim your account</h1>
                            <p className="ab-serif">
                                Complete your application in as little as 10
                                minutes
                            </p>
                        </div>

                        <form
                            className="flex max-w-[543px] flex-col gap-5"
                            onSubmit={onSubmit}
                        >
                            <Field label="Work email address">
                                <TextField
                                    required
                                    type="email"
                                    placeholder="you@company.com"
                                    value={claim.workEmail}
                                    onChange={(e) =>
                                        patch({ workEmail: e.target.value })
                                    }
                                />
                            </Field>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <TextField
                                    placeholder="First name"
                                    value={claim.firstName}
                                    onChange={(e) =>
                                        patch({ firstName: e.target.value })
                                    }
                                />
                                <TextField
                                    placeholder="Last name"
                                    value={claim.lastName}
                                    onChange={(e) =>
                                        patch({ lastName: e.target.value })
                                    }
                                />
                            </div>

                            <Field label="Enter a password">
                                <TextField
                                    required
                                    type="password"
                                    placeholder="Choose a password"
                                    autoComplete="new-password"
                                    value={claim.password}
                                    onChange={(e) =>
                                        patch({ password: e.target.value })
                                    }
                                />
                            </Field>

                            <Field label="Loan urgency">
                                <div className="grid grid-cols-2 gap-[20px] sm:grid-cols-4">
                                    {LOAN_URGENCY.map((opt) => {
                                        const active = claim.loanUrgency === opt
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                className={cx(
                                                    'ab-text-m border p-[15px] text-center transition-colors',
                                                    active
                                                        ? 'border-ink bg-ink text-offwhite'
                                                        : 'border-ink bg-offwhite text-ink hover:bg-ink/5',
                                                )}
                                                onClick={() =>
                                                    patch({ loanUrgency: opt })
                                                }
                                            >
                                                {opt}
                                            </button>
                                        )
                                    })}
                                </div>
                            </Field>

                            <div className="pt-2">
                                <PillButton type="submit" loading={loading}>
                                    Get started
                                </PillButton>
                            </div>
                        </form>
                    </div>
                </div>
            </BeigeCard>

            <section className="flex-1 lg:px-[60px]">
                <BeigeCard className="h-full min-h-[360px]">
                    <img
                        src={photo}
                        alt="Two business owners reviewing their funding application"
                        className="h-full min-h-[360px] w-full object-cover"
                    />
                </BeigeCard>
            </section>
        </PublicShell>
    )
}
