import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import ApplicationListSkeleton from '@/components/skeletons/ApplicationListSkeleton'
import { useDealApplications } from '@/lib/hooks/useDealApplications'
import { fetchFinancialProgress } from '@/lib/api/financialProgress'
import { fetchOnboardingProgress } from '@/lib/api/onboardingProgress'
import { resolveWarmDealApplicationPath } from '@/lib/routing/warmRouting'
import { revalidateFinancialProgress, revalidateOnboardingProgress } from '@/lib/swr/mutate'
import type { DealApplicationSummary } from '@/types/deal-application'

export default function FinanceMyApplications() {
    const navigate = useNavigate()
    const { data: dealData, isLoading: dealsLoading } = useDealApplications()
    const [openingId, setOpeningId] = useState<number | null>(null)
    const [openError, setOpenError] = useState<string | null>(null)

    const applications = dealData?.applications ?? []

    async function openApplication(app: DealApplicationSummary) {
        setOpenError(null)
        setOpeningId(app.deal_id)
        try {
            localStorage.setItem('x-deal-id', app.deal_id.toString())

            const [onboardingResult, financialResult] = await Promise.allSettled([
                fetchOnboardingProgress(),
                fetchFinancialProgress(),
            ])

            void revalidateOnboardingProgress()
            void revalidateFinancialProgress()

            const onboardingProgress =
                onboardingResult.status === 'fulfilled'
                    ? onboardingResult.value?.progress
                    : null
            const financialProgress =
                financialResult.status === 'fulfilled'
                    ? financialResult.value
                    : null

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
            setOpeningId(null)
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
                    {applications.map((app) => (
                        <li key={app.id}>
                            <button
                                type="button"
                                disabled={openingId !== null}
                                className="flex w-full items-center justify-between border border-ink px-[15px] py-[22px] text-left hover:bg-beige/40 disabled:opacity-60"
                                onClick={() => void openApplication(app)}
                            >
                                <span className="ab-serif">
                                    {app.legal_name ?? `Deal ${app.deal_id}`}
                                </span>
                                <span className="ab-text-s uppercase">
                                    {openingId === app.deal_id
                                        ? 'Opening…'
                                        : app.status}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </PortalCard>
        </>
    )
}
