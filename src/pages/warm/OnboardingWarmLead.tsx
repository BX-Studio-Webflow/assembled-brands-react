import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import TextField from '@/components/ui/TextField'
import Select from '@/components/ui/Select'
import PillButton from '@/components/ui/PillButton'
import { apiExchangeWarmLeadSession } from '@/services/DealApplicationService'
import { apiGetOnboardingProgress, apiSubmitWarmLead, apiSubmitWarmLeadMe } from '@/services/OnboardingService'
import { useAuth } from '@/lib/auth'
import { isAuthenticated, persistLoginSession } from '@/lib/session'

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
    const [loading, setLoading] = useState(false)
    const [ready, setReady] = useState(false)

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
        void apiGetOnboardingProgress().then((result) => {
            const step1 = result?.progress?.step1
            if (step1?.legal_name) setLegalName(step1.legal_name)
        })
    }, [ready])

    async function onSubmit() {
        setLoading(true)
        setError(null)
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
                navigate('/warm/finance-docs-financial-report')
            }
        } catch (err) {
            setError(
                (err as { message?: string }).message ??
                    'Unable to save onboarding details',
            )
        } finally {
            setLoading(false)
        }
    }

    if (!ready) {
        return (
            <CenteredCardLayout title="Loading…">
                <p className="ab-text-s text-ink/60">Preparing your application…</p>
            </CenteredCardLayout>
        )
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
                    options={[
                        { label: 'California', value: 'CA' },
                        { label: 'New York', value: 'NY' },
                        { label: 'Delaware', value: 'DE' },
                    ]}
                    onChange={setIncorporationState}
                />
                <TextField
                    placeholder="Net revenue last 12 months"
                    value={netRevenue}
                    onChange={(e) => setNetRevenue(e.target.value)}
                />
                <div className="flex gap-[20px]">
                    <label className="flex items-center gap-2">
                        <input
                            checked={workingWithMember === 'yes'}
                            name="member"
                            type="radio"
                            onChange={() => setWorkingWithMember('yes')}
                        />
                        Working with a team member
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            checked={workingWithMember === 'no'}
                            name="member"
                            type="radio"
                            onChange={() => setWorkingWithMember('no')}
                        />
                        No
                    </label>
                </div>
                {workingWithMember === 'yes' && (
                    <TextField
                        placeholder="Team member email"
                        value={memberEmail}
                        onChange={(e) => setMemberEmail(e.target.value)}
                    />
                )}
                {error && <p className="ab-text-m text-coral">{error}</p>}
                <PillButton loading={loading} onClick={() => void onSubmit()}>
                    Save and continue
                </PillButton>
            </div>
        </CenteredCardLayout>
    )
}
