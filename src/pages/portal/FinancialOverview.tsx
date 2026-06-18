import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import FormPageSkeleton from '@/components/skeletons/FormPageSkeleton'
import { useApplicationStore } from '@/store/applicationStore'
import { useFinancialProgress } from '@/lib/hooks/useFinancialProgress'
import { revalidateAfterFinancialSave } from '@/lib/swr/mutate'
import { apiSaveFinancialOverview } from '@/services/FinancialWizardService'

export default function FinancialOverview() {
    const navigate = useNavigate()
    const data = useApplicationStore((s) => s.financialOverview)
    const patch = useApplicationStore((s) => s.patchFinancialOverview)
    const { data: progress, isLoading } = useFinancialProgress()
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [seedApplied, setSeedApplied] = useState(false)

    useEffect(() => {
        if (!progress || seedApplied) return
        const overview = progress.financial_overview
        if (!overview) {
            setSeedApplied(true)
            return
        }
        patch({
            revenuesLast12: overview.revenue_last_12_months ?? '',
            netIncomeLast12: overview.net_income_last_12_months ?? '',
            projectedRevenue: overview.projected_revenue_next_12_months ?? '',
        })
        setSeedApplied(true)
    }, [patch, progress, seedApplied])

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!data.revenuesLast12.trim()) {
            setError('Revenue is required')
            return
        }

        setSubmitting(true)
        try {
            await apiSaveFinancialOverview({
                revenue_last_12_months: data.revenuesLast12.trim(),
                net_income_last_12_months: data.netIncomeLast12.trim(),
                projected_revenue_next_12_months: data.projectedRevenue.trim(),
            })
            await revalidateAfterFinancialSave()
            navigate('/finance-docs-financial-reports')
        } catch (err) {
            setError(
                (err as { message?: string }).message ??
                    'There was a problem saving your information',
            )
        } finally {
            setSubmitting(false)
        }
    }

    if (isLoading) {
        return <FormPageSkeleton title="Financial Overview" fields={3} />
    }

    return (
        <>
            <PageHeader title="Financial Overview" />
            <PortalCard>
                <form
                    className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]"
                    onSubmit={onSubmit}
                >
                    <h2 className="ab-h3">Basic Information</h2>

                    <Field label="What were the company’s revenues over the last 12 months?">
                        <TextField
                            variant="soft"
                            placeholder="$0"
                            value={data.revenuesLast12}
                            onChange={(e) =>
                                patch({ revenuesLast12: e.target.value })
                            }
                        />
                    </Field>

                    <Field label="What was the company’s net income over the last 12 months?">
                        <TextField
                            variant="soft"
                            placeholder="$0"
                            value={data.netIncomeLast12}
                            onChange={(e) =>
                                patch({ netIncomeLast12: e.target.value })
                            }
                        />
                    </Field>

                    <Field label="What is projected revenue for the next 12 months?">
                        <TextField
                            variant="soft"
                            placeholder="$0"
                            value={data.projectedRevenue}
                            onChange={(e) =>
                                patch({ projectedRevenue: e.target.value })
                            }
                        />
                    </Field>

                    {error && <p className="ab-text-m text-coral">{error}</p>}

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={() => navigate('/finance-company-profile')}
                        >
                            Back
                        </PillButton>
                        <PillButton
                            type="submit"
                            variant="outline"
                            loading={submitting}
                        >
                            Save & continue
                        </PillButton>
                    </div>
                </form>
            </PortalCard>
        </>
    )
}
