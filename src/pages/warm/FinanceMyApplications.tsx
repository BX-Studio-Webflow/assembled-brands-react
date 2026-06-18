import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import PillButton from '@/components/ui/PillButton'
import ApplicationListSkeleton from '@/components/skeletons/ApplicationListSkeleton'
import { useDealApplications } from '@/lib/hooks/useDealApplications'
import { fetchFinancialProgress } from '@/lib/api/financialProgress'
import { fetchOnboardingProgress } from '@/lib/api/onboardingProgress'
import { resolveWarmDealApplicationPath } from '@/lib/routing/warmRouting'
import {
    revalidateFinancialProgress,
    revalidateOnboardingProgress,
} from '@/lib/swr/mutate'
import type { DealApplicationSummary } from '@/types/deal-application'

type LoadingAction = {
    dealId: number
    mode: 'view' | 'edit'
}

export default function FinanceMyApplications() {
    const navigate = useNavigate()
    const { data: dealData, isLoading: dealsLoading } = useDealApplications()
    const [loadingAction, setLoadingAction] = useState<LoadingAction | null>(
        null,
    )
    const [openError, setOpenError] = useState<string | null>(null)

    const applications = dealData?.applications ?? []

    async function loadDealContext(app: DealApplicationSummary) {
        localStorage.setItem('x-deal-id', app.deal_id.toString())

        const [onboardingResult, financialResult] = await Promise.allSettled([
            fetchOnboardingProgress(),
            fetchFinancialProgress(),
        ])

        await Promise.all([
            revalidateOnboardingProgress(),
            revalidateFinancialProgress(),
        ])

        return {
            onboardingProgress:
                onboardingResult.status === 'fulfilled'
                    ? onboardingResult.value?.progress
                    : null,
            financialProgress:
                financialResult.status === 'fulfilled'
                    ? financialResult.value
                    : null,
        }
    }

    async function viewApplication(app: DealApplicationSummary) {
        setOpenError(null)
        setLoadingAction({ dealId: app.deal_id, mode: 'view' })
        try {
            await loadDealContext(app)
            navigate('/application-summary')
        } catch (err) {
            setOpenError(
                (err as { message?: string }).message ??
                    'Unable to open this application. Please try again.',
            )
        } finally {
            setLoadingAction(null)
        }
    }

    async function editApplication(app: DealApplicationSummary) {
        setOpenError(null)
        setLoadingAction({ dealId: app.deal_id, mode: 'edit' })
        try {
            const { onboardingProgress, financialProgress } =
                await loadDealContext(app)

            const legalName =
                onboardingProgress?.step1?.legal_name ??
                onboardingProgress?.progress_data?.legal_name ??
                app.legal_name

            const path = resolveWarmDealApplicationPath(
                app.deal_id,
                { legal_name: legalName },
                financialProgress,
            )
            navigate(path)
        } catch (err) {
            setOpenError(
                (err as { message?: string }).message ??
                    'Unable to open this application. Please try again.',
            )
        } finally {
            setLoadingAction(null)
        }
    }

    if (dealsLoading) {
        return <ApplicationListSkeleton />
    }

    return (
        <>
            <PageHeader title="My applications" />
            <PortalCard>
                {openError && (
                    <p className="ab-text-m mb-4 text-coral">{openError}</p>
                )}
                {applications.length === 0 && (
                    <p className="ab-serif">No deal applications found.</p>
                )}
                <ul className="flex flex-col gap-[20px]">
                    {applications.map((app) => {
                        const isLoading =
                            loadingAction?.dealId === app.deal_id
                        const loadingView =
                            isLoading && loadingAction?.mode === 'view'
                        const loadingEdit =
                            isLoading && loadingAction?.mode === 'edit'

                        return (
                            <li
                                key={app.id}
                                className="flex flex-col gap-4 border border-ink px-[15px] py-[22px] sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="flex min-w-0 flex-col gap-1">
                                    <span className="ab-serif truncate">
                                        {app.legal_name ??
                                            `Deal ${app.deal_id}`}
                                    </span>
                                    <span className="ab-text-s uppercase text-ink/60">
                                        {app.status}
                                    </span>
                                </div>
                                <div className="flex shrink-0 flex-wrap items-center gap-3">
                                    <PillButton
                                        type="button"
                                        variant="outline"
                                        disabled={loadingAction !== null}
                                        loading={loadingView}
                                        onClick={() =>
                                            void viewApplication(app)
                                        }
                                    >
                                        View
                                    </PillButton>
                                    <PillButton
                                        type="button"
                                        variant="stack"
                                        disabled={loadingAction !== null}
                                        loading={loadingEdit}
                                        onClick={() =>
                                            void editApplication(app)
                                        }
                                    >
                                        Edit
                                    </PillButton>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </PortalCard>
        </>
    )
}
