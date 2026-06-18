import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import TextField from '@/components/ui/TextField'
import Select from '@/components/ui/Select'
import PillButton from '@/components/ui/PillButton'
import FormPageSkeleton from '@/components/skeletons/FormPageSkeleton'
import RadioGroup from '@/components/ui/RadioGroup'
import { apiExchangeWarmLeadSession } from '@/services/DealApplicationService'
import { apiSubmitWarmLead, apiSubmitWarmLeadMe } from '@/services/OnboardingService'
import { useOnboardingProgress } from '@/lib/hooks/useOnboardingProgress'
import { revalidateAfterOnboardingSave } from '@/lib/swr/mutate'
import { useAuth } from '@/lib/auth'
import { isAuthenticated, persistLoginSession } from '@/lib/session'
import { US_STATE_OPTIONS, WARM_TEAM_MEMBER_OPTIONS } from '@/constants/options'

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
    const { data: onboarding } = useOnboardingProgress()

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
        if (!ready || !isAuthenticated()) return
        const step1 = onboarding?.progress?.step1
        const progressData = onboarding?.progress?.progress_data
        if (step1?.legal_name && !legalName) setLegalName(step1.legal_name)
        if (!legalName && progressData?.legal_name) {
            setLegalName(progressData.legal_name)
        }
        const state =
            step1?.incorporation_state ?? progressData?.incorporation_state
        if (state && !incorporationState) setIncorporationState(state)
        const revenue =
            step1?.net_revenue_last_12_months ??
            progressData?.net_revenue_last_12_months
        if (revenue && !netRevenue) setNetRevenue(revenue)
        const working =
            step1?.working_with_team_member ??
            progressData?.working_with_team_member
        if (working) setWorkingWithMember('yes')
        const member =
            step1?.team_member_email ?? progressData?.team_member_email
        if (member && !memberEmail) setMemberEmail(member)
    }, [
        ready,
        onboarding,
        legalName,
        incorporationState,
        netRevenue,
        memberEmail,
    ])

    async function onSubmit() {
        setSubmitting(true)
        setError(null)
        if (workingWithMember === 'yes' && !memberEmail) {
            setError('Please select a team member')
            setSubmitting(false)
            return
        }
        const shared = {
            legal_name: legalName,
            incorporation_state: incorporationState,
            net_revenue_last_12_months: netRevenue,
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

    if (!ready) {
        return <FormPageSkeleton title="Company information" fields={4} />
    }

    return (
        <CenteredCardLayout title="Company information">
            <div className="flex flex-col gap-[20px]">
                <TextField
                    placeholder="Legal company name"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                />
                <Select
                    placeholder="State of incorporation"
                    value={incorporationState}
                    options={US_STATE_OPTIONS}
                    isSearchable
                    onChange={setIncorporationState}
                />
                <TextField
                    placeholder="Net revenue last 12 months"
                    value={netRevenue}
                    onChange={(e) => setNetRevenue(e.target.value)}
                />
                <RadioGroup
                    name="working-with-member"
                    value={workingWithMember}
                    options={[
                        {
                            label: 'Working with a team member',
                            value: 'yes',
                        },
                        { label: 'No', value: 'no' },
                    ]}
                    onChange={(v) => {
                        setWorkingWithMember(v as 'yes' | 'no')
                        if (v === 'no') setMemberEmail('')
                    }}
                />
                {workingWithMember === 'yes' && (
                    <Select
                        placeholder="Select team member"
                        value={memberEmail}
                        options={WARM_TEAM_MEMBER_OPTIONS}
                        onChange={setMemberEmail}
                    />
                )}
                {error && <p className="ab-text-m text-coral">{error}</p>}
                <PillButton loading={submitting} onClick={() => void onSubmit()}>
                    Save and continue
                </PillButton>
            </div>
        </CenteredCardLayout>
    )
}
