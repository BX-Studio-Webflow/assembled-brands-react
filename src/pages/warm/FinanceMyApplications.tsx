import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import ApplicationListSkeleton from '@/components/skeletons/ApplicationListSkeleton'
import { useDealApplications } from '@/lib/hooks/useDealApplications'
import { useFinancialProgress } from '@/lib/hooks/useFinancialProgress'
import { useOnboardingProgress } from '@/lib/hooks/useOnboardingProgress'
import { resolveWarmDealApplicationPath } from '@/lib/routing/warmRouting'
import type { DealApplicationSummary } from '@/types/deal-application'

export default function FinanceMyApplications() {
    const navigate = useNavigate()
    const { data: dealData, isLoading: dealsLoading } = useDealApplications()
    const { data: financial, isLoading: financialLoading } =
        useFinancialProgress()
    const { data: onboarding, isLoading: onboardingLoading } =
        useOnboardingProgress()

    const applications = dealData?.applications ?? []
    const loading = dealsLoading || financialLoading || onboardingLoading

    function openApplication(app: DealApplicationSummary) {
        if (!financial || !onboarding) return
        localStorage.setItem('x-deal-id', app.deal_id.toString())
        const path = resolveWarmDealApplicationPath(
            app.deal_id,
            onboarding.progress?.step1 ?? { legal_name: app.legal_name },
            financial,
        )
        navigate(path)
    }

    if (loading) {
        return <ApplicationListSkeleton />
    }

    return (
        <>
            <PageHeader title="My applications" />
            <PortalCard>
                {applications.length === 0 && (
                    <p className="ab-serif">No deal applications found.</p>
                )}
                <ul className="flex flex-col gap-[20px]">
                    {applications.map((app) => (
                        <li key={app.id}>
                            <button
                                type="button"
                                className="flex w-full items-center justify-between border border-ink px-[15px] py-[22px] text-left hover:bg-beige/40"
                                onClick={() => openApplication(app)}
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
