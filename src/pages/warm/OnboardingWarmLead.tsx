import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import StepProgress from '@/components/ui/StepProgress'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import Select from '@/components/ui/Select'
import PillButton from '@/components/ui/PillButton'
import QualifyStepSkeleton from '@/components/skeletons/QualifyStepSkeleton'
import RadioGroup from '@/components/ui/RadioGroup'
import { apiExchangeWarmLeadSession } from '@/services/DealApplicationService'
import { apiSubmitWarmLead, apiSubmitWarmLeadMe } from '@/services/OnboardingService'
import { useOnboardingProgress } from '@/lib/hooks/useOnboardingProgress'
import { revalidateAfterOnboardingSave } from '@/lib/swr/mutate'
import { useAuth } from '@/lib/auth'
import { isAuthenticated, persistLoginSession } from '@/lib/session'
import { US_STATE_OPTIONS, WARM_TEAM_MEMBER_OPTIONS } from '@/constants/options'

const WORKING_WITH_MEMBER_OPTIONS = [
    { label: 'No', value: 'no' },
    { label: 'Yes', value: 'yes' },
]

export default function OnboardingWarmLead() {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const { applySession } = useAuth()
    const dealIdParam = params.get('deal_id')
    const dealId = dealIdParam ? parseInt(dealIdParam, 10) : null

    const [legalName, setLegalName] = useState('')
    const [incorporationState, setIncorporationState] = useState('')
    const [netRevenue, setNetRevenue] = useState('')
    const [workingWithMember, setWorkingWithMember] = useState<'yes' | 'no'>('no')
    const [memberEmail, setMemberEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [ready, setReady] = useState(false)
    const seededRef = useRef(false)
    const { data: onboarding, isLoading: onboardingLoading } =
        useOnboardingProgress()

    useEffect(() => {
        async function init() {
            if (localStorage.getItem('x-team-id')) {
                setReady(true)
                return
            }
            if (!dealId || Number.isNaN(dealId)) {
                if (!isAuthenticated()) {
                    setError('Invalid invite link — deal ID missing')
                }
                setReady(true)
                return
            }
            try {
                const response = await apiExchangeWarmLeadSession(dealId)
                persistLoginSession(
                    response.token,
                    response.user as import('@/types/auth').User,
                    response.teams?.[0]?.team_id,
                )
                localStorage.removeItem('x-team-id')
                localStorage.removeItem('x-deal-id')
                setReady(true)
            } catch {
                setError('Failed to initialize warm-lead session')
                setReady(true)
            }
        }
        void init()
    }, [dealId])

    useEffect(() => {
        if (!ready || !isAuthenticated() || seededRef.current) return
        const step1 = onboarding?.progress?.step1
        const progressData = onboarding?.progress?.progress_data
        if (!step1 && !progressData) return

        if (step1?.legal_name || progressData?.legal_name) {
            setLegalName(step1?.legal_name ?? progressData?.legal_name ?? '')
        }
        const state =
            step1?.incorporation_state ?? progressData?.incorporation_state
        if (state) setIncorporationState(state)
        const revenue =
            step1?.net_revenue_last_12_months ??
            progressData?.net_revenue_last_12_months
        if (revenue) setNetRevenue(revenue)
        const working =
            step1?.working_with_team_member ??
            progressData?.working_with_team_member
        if (working) setWorkingWithMember('yes')
        const member =
            step1?.team_member_email ?? progressData?.team_member_email
        if (member) setMemberEmail(member)

        seededRef.current = true
    }, [ready, onboarding])

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        if (!legalName.trim()) {
            setError('Company legal name is required')
            setSubmitting(false)
            return
        }
        if (!incorporationState) {
            setError('State of incorporation is required')
            setSubmitting(false)
            return
        }
        if (!netRevenue.trim()) {
            setError('Net revenue is required')
            setSubmitting(false)
            return
        }
        if (workingWithMember === 'yes' && !memberEmail) {
            setError('Please choose a team member')
            setSubmitting(false)
            return
        }

        const shared = {
            legal_name: legalName.trim(),
            incorporation_state: incorporationState,
            net_revenue_last_12_months: netRevenue.trim(),
            working_with_team_member: workingWithMember === 'yes',
            team_member_email:
                workingWithMember === 'yes' ? memberEmail : undefined,
        }
        try {
            if (isAuthenticated()) {
                await apiSubmitWarmLeadMe(shared)
                await revalidateAfterOnboardingSave()
                navigate('/warm/finance-docs-financial-report')
            } else {
                if (!dealId || Number.isNaN(dealId)) {
                    setError('Deal ID is required')
                    return
                }
                const response = await apiSubmitWarmLead({
                    deal_id: dealId,
                    ...shared,
                })
                applySession(response)
                await revalidateAfterOnboardingSave()
                navigate('/warm/finance-docs-financial-report')
            }
        } catch (err) {
            setError(
                (err as { message?: string }).message ??
                    'Unable to save onboarding details',
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (!ready || (isAuthenticated() && onboardingLoading && !seededRef.current)) {
        return (
            <CenteredCardLayout>
                <QualifyStepSkeleton step={1} total={2} />
            </CenteredCardLayout>
        )
    }

    return (
        <CenteredCardLayout>
            <div className="flex flex-col gap-[30px]">
                <StepProgress step={1} total={2} />

                <div className="flex flex-col gap-[15px]">
                    <h1 className="ab-h3">Let&apos;s confirm your company info</h1>
                    <p className="ab-serif text-ink/70">
                        Let&apos;s start with the basics. Introducing your
                        business and telling us how you track your books helps us
                        see how we can best support your cash flow needs.
                    </p>
                </div>

                <form className="flex flex-col gap-[30px]" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-[20px]">
                        <Field label="What is your company's legal name?">
                            <TextField
                                placeholder="Enter the name of your company"
                                value={legalName}
                                onChange={(e) => setLegalName(e.target.value)}
                            />
                        </Field>

                        <Field label="In what state is the company incorporated in?">
                            <Select
                                isSearchable
                                placeholder="Select state"
                                value={incorporationState}
                                options={US_STATE_OPTIONS}
                                onChange={setIncorporationState}
                            />
                        </Field>

                        <Field label="What was the company's last 12 months NET Revenue">
                            <TextField
                                placeholder="Enter amount"
                                inputMode="decimal"
                                value={netRevenue}
                                onChange={(e) => setNetRevenue(e.target.value)}
                            />
                        </Field>

                        <Field label="Are you working with a member of the Assembled Brands team?">
                            <RadioGroup
                                name="working-with-member"
                                value={workingWithMember}
                                options={WORKING_WITH_MEMBER_OPTIONS}
                                onChange={(v) => {
                                    setWorkingWithMember(v as 'yes' | 'no')
                                    if (v === 'no') setMemberEmail('')
                                }}
                            />
                        </Field>

                        {workingWithMember === 'yes' && (
                            <Field label="Choose Member">
                                <Select
                                    placeholder="Choose Member"
                                    value={memberEmail}
                                    options={WARM_TEAM_MEMBER_OPTIONS}
                                    onChange={setMemberEmail}
                                />
                            </Field>
                        )}
                    </div>

                    {error && <p className="ab-text-m text-coral">{error}</p>}

                    <div className="flex justify-end">
                        <PillButton
                            type="submit"
                            variant="outline"
                            loading={submitting}
                        >
                            Next
                        </PillButton>
                    </div>
                </form>
            </div>
        </CenteredCardLayout>
    )
}
