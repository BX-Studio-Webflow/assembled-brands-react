import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import Select from '@/components/ui/Select'
import PillButton from '@/components/ui/PillButton'
import FormPageSkeleton from '@/components/skeletons/FormPageSkeleton'
import { US_STATES, ACCOUNTING_SOFTWARE } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'
import { useCompanyProfileSeed } from '@/lib/hooks/useCompanyProfileSeed'
import { revalidateAfterFinancialSave } from '@/lib/swr/mutate'
import { apiUpdateBusiness } from '@/services/BusinessService'

export default function CompanyProfile() {
    const navigate = useNavigate()
    const data = useApplicationStore((s) => s.companyProfile)
    const patch = useApplicationStore((s) => s.patchCompanyProfile)
    const { data: seed, isLoading } = useCompanyProfileSeed()
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [seedApplied, setSeedApplied] = useState(false)

    useEffect(() => {
        if (!seed || seedApplied) return
        const { financial, onboarding } = seed
        const profile = financial.company_profile ?? financial.business
        const step1 = onboarding?.progress?.step1
        const step2 = onboarding?.progress?.step2

        patch({
            legalName:
                profile?.legal_name ??
                step1?.legal_name ??
                financial.business?.legal_name ??
                '',
            headquarters: profile?.headquarters ?? '',
            yearFormed: profile?.year_formed ?? step2?.years_in_business ?? '',
            accountingSoftware: profile?.accounting_software ?? '',
            accountingOther: profile?.other_accounting_software ?? '',
        })
        setSeedApplied(true)
    }, [patch, seed, seedApplied])

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!data.legalName.trim()) {
            setError('Company legal name is required')
            return
        }

        setSubmitting(true)
        try {
            await apiUpdateBusiness({
                legal_name: data.legalName.trim(),
                headquarters: data.headquarters,
                description: '',
                year_formed: data.yearFormed,
                accounting_software: data.accountingSoftware,
                other_accounting_software: data.accountingOther || '',
            })
            await revalidateAfterFinancialSave()
            navigate('/finance-financial-overview')
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
        return <FormPageSkeleton title="Company Profile" fields={5} />
    }

    return (
        <>
            <PageHeader title="Company Profile" />
            <PortalCard>
                <form
                    className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]"
                    onSubmit={onSubmit}
                >
                    <h2 className="ab-h3">Basic Information</h2>

                    <Field label="What is the company’s legal name?">
                        <TextField
                            variant="soft"
                            placeholder="Enter the name of your company"
                            value={data.legalName}
                            onChange={(e) => patch({ legalName: e.target.value })}
                        />
                    </Field>

                    <Field label="Where is the company headquartered?">
                        <Select
                            isSearchable
                            options={US_STATES}
                            value={data.headquarters}
                            placeholder="Select a State"
                            onChange={(v) => patch({ headquarters: v })}
                        />
                    </Field>

                    <Field label="What year was the company formed?">
                        <TextField
                            variant="soft"
                            placeholder="e.g. 2018"
                            value={data.yearFormed}
                            onChange={(e) => patch({ yearFormed: e.target.value })}
                        />
                    </Field>

                    <Field label="What accounting software do you use?">
                        <Select
                            options={ACCOUNTING_SOFTWARE}
                            value={data.accountingSoftware}
                            placeholder="Select one"
                            onChange={(v) => patch({ accountingSoftware: v })}
                        />
                    </Field>

                    {data.accountingSoftware === 'other' && (
                        <Field label="Other">
                            <TextField
                                variant="soft"
                                placeholder="Which software do you use?"
                                value={data.accountingOther}
                                onChange={(e) =>
                                    patch({ accountingOther: e.target.value })
                                }
                            />
                        </Field>
                    )}

                    {error && <p className="ab-text-m text-coral">{error}</p>}

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={() =>
                                navigate('/onboarding-wizard?step=step-3')
                            }
                        >
                            Cancel
                        </PillButton>
                        <PillButton
                            type="submit"
                            variant="outline"
                            loading={submitting}
                        >
                            Save and continue
                        </PillButton>
                    </div>
                </form>
            </PortalCard>
        </>
    )
}
