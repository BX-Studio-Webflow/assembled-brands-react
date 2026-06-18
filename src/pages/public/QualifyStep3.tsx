import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import StepProgress from '@/components/ui/StepProgress'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import OptionGroup from '@/components/ui/OptionGroup'
import RadioGroup from '@/components/ui/RadioGroup'
import PillButton from '@/components/ui/PillButton'
import QualifyStepSkeleton from '@/components/skeletons/QualifyStepSkeleton'
import { COMPANY_TYPES, YES_NO } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'
import { useOnboardingProgress } from '@/lib/hooks/useOnboardingProgress'
import { revalidateAfterOnboardingSave } from '@/lib/swr/mutate'
import { apiSaveOnboardingStep3 } from '@/services/OnboardingService'
import { mapCompanyType } from '@/lib/mappings/onboarding'
import type { OnboardingStep3Body } from '@/types/onboarding'

const COMPANY_API_TO_LABEL: Record<string, string> = {
    cpg: 'CPG Company',
    distributor_wholesaler: 'Distributor or Wholesaler',
    service_provider: 'SaaS Company',
    other: 'Other',
}

export default function QualifyStep3() {
    const navigate = useNavigate()
    const qualify = useApplicationStore((s) => s.qualify)
    const patch = useApplicationStore((s) => s.patchQualify)
    const { data: onboarding, isLoading } = useOnboardingProgress()
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [seedApplied, setSeedApplied] = useState(false)

    useEffect(() => {
        if (!onboarding || seedApplied) return
        const step3 = onboarding?.progress?.step3
        if (!step3) {
            setSeedApplied(true)
            return
        }
        patch({
            companyType: step3.company_type
                ? (COMPANY_API_TO_LABEL[step3.company_type] ??
                  step3.company_type)
                : '',
            otherCompanyType: step3.company_type_other ?? '',
            revenuesOver10mm: step3.revenue_qualification ?? '',
        })
        setSeedApplied(true)
    }, [onboarding, patch, seedApplied])

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        const companyType = mapCompanyType(qualify.companyType)
        if (!companyType) {
            setError('Company type is required')
            return
        }
        if (companyType === 'other' && !qualify.otherCompanyType.trim()) {
            setError('Please specify the company type')
            return
        }
        if (!qualify.revenuesOver10mm) {
            setError('Revenue qualification is required')
            return
        }

        setSubmitting(true)
        try {
            await apiSaveOnboardingStep3({
                company_type: companyType,
                revenue_qualification:
                    qualify.revenuesOver10mm as OnboardingStep3Body['revenue_qualification'],
                ...(companyType === 'other'
                    ? { company_type_other: qualify.otherCompanyType.trim() }
                    : {}),
            })
            await revalidateAfterOnboardingSave()

            if (qualify.revenuesOver10mm === 'no') {
                navigate('/onboarding-step-not-fit')
            } else {
                navigate('/finance-company-profile')
            }
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
        return (
            <CenteredCardLayout>
                <QualifyStepSkeleton step={3} />
            </CenteredCardLayout>
        )
    }

    return (
        <CenteredCardLayout>
            <div className="flex flex-col gap-[30px]">
                <StepProgress step={3} total={3} />

                <div className="flex flex-col gap-[15px]">
                    <h1 className="ab-h3">
                        Is Assembled Brands right for your business?
                    </h1>
                    <p className="ab-serif text-ink/70">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse varius enim in eros.
                    </p>
                </div>

                <form className="flex flex-col gap-[30px]" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-[20px]">
                        <Field label="Type of company?">
                            <OptionGroup
                                options={COMPANY_TYPES}
                                value={qualify.companyType}
                                onChange={(v) => patch({ companyType: v })}
                            />
                        </Field>

                        {qualify.companyType === 'Other' && (
                            <Field label="Other type of company?">
                                <TextField
                                    placeholder="Specify the type of company"
                                    value={qualify.otherCompanyType}
                                    onChange={(e) =>
                                        patch({ otherCompanyType: e.target.value })
                                    }
                                />
                            </Field>
                        )}

                        <Field label="Has the company generated $10MM+ of revenues over the last 12 months?">
                            <RadioGroup
                                name="revenue-qualification"
                                options={YES_NO}
                                value={qualify.revenuesOver10mm}
                                onChange={(v) =>
                                    patch({ revenuesOver10mm: v })
                                }
                            />
                        </Field>
                    </div>

                    {error && <p className="ab-text-m text-coral">{error}</p>}

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={() => navigate('/onboarding-wizard?step=2')}
                        >
                            Back
                        </PillButton>
                        <PillButton
                            type="submit"
                            variant="outline"
                            loading={submitting}
                        >
                            Finish
                        </PillButton>
                    </div>
                </form>
            </div>
        </CenteredCardLayout>
    )
}
