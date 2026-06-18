import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import PillButton from '@/components/ui/PillButton'
import { apiGetMyDealApplications } from '@/services/DealApplicationService'
import { apiGetFinancialProgress } from '@/services/FinancialWizardService'
import { apiGetOnboardingProgress } from '@/services/OnboardingService'
import { resolveWarmDealApplicationPath } from '@/lib/routing/warmRouting'
import type { DealApplicationSummary } from '@/types/deal-application'

export default function FinanceMyApplications() {
    const navigate = useNavigate()
    const [applications, setApplications] = useState<DealApplicationSummary[]>(
        [],
    )
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        void apiGetMyDealApplications()
            .then((res) => setApplications(res.applications))
            .finally(() => setLoading(false))
    }, [])

    async function openApplication(app: DealApplicationSummary) {
        localStorage.setItem('x-deal-id', app.deal_id.toString())
        const [financial, onboarding] = await Promise.all([
            apiGetFinancialProgress(),
            apiGetOnboardingProgress(),
        ])
        const path = resolveWarmDealApplicationPath(
            app.deal_id,
            onboarding.progress?.step1 ?? { legal_name: app.legal_name },
            financial,
        )
        navigate(path)
    }

    return (
        <>
            <PageHeader title="My applications" />
            <PortalCard>
                {loading && <p className="ab-text-s text-ink/60">Loading…</p>}
                {!loading && applications.length === 0 && (
                    <p className="ab-serif">No deal applications found.</p>
                )}
                <ul className="flex flex-col gap-[20px]">
                    {applications.map((app) => (
                        <li key={app.id}>
                            <button
                                type="button"
                                className="flex w-full items-center justify-between border border-ink px-[15px] py-[22px] text-left hover:bg-beige/40"
                                onClick={() => void openApplication(app)}
                            >
                                <span className="ab-serif">
                                    {app.legal_name ?? `Deal ${app.deal_id}`}
                                </span>
                                <span className="ab-text-s uppercase">{app.status}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </PortalCard>
        </>
    )
}
