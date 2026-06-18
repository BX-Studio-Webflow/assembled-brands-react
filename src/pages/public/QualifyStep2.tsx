import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import StepProgress from '@/components/ui/StepProgress'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import OptionGroup from '@/components/ui/OptionGroup'
import Select from '@/components/ui/Select'
import PillButton from '@/components/ui/PillButton'
import { ASSET_TYPES, LOAN_AMOUNT_OPTIONS } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'
import { apiGetOnboardingProgress, apiSaveOnboardingStep2 } from '@/services/OnboardingService'
import { mapAssetType } from '@/lib/mappings/onboarding'
import type { OnboardingStep2Body } from '@/types/onboarding'

const ASSET_API_TO_LABEL: Record<string, string> = {
    inventory: 'Inventory',
    accounts_receivable: 'Accounts Receivable',
    purchase_orders: 'Purchase Orders',
    not_sure: 'Not Sure',
}

export default function QualifyStep2() {
    const navigate = useNavigate()
    const qualify = useApplicationStore((s) => s.qualify)
    const patch = useApplicationStore((s) => s.patchQualify)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        void apiGetOnboardingProgress().then((result) => {
            const step2 = result?.progress?.step2
            if (!step2) return
            patch({
                yearsInBusiness: step2.years_in_business ?? '',
                assetType: step2.asset_type
                    ? (ASSET_API_TO_LABEL[step2.asset_type] ?? step2.asset_type)
                    : '',
                loanAmount: step2.desired_loan_amount ?? '',
            })
        })
    }, [patch])

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!qualify.yearsInBusiness.trim()) {
            setError('Years in business is required')
            return
        }
        const assetType = mapAssetType(qualify.assetType)
        if (!assetType) {
            setError('Asset type is required')
            return
        }
        if (!qualify.loanAmount) {
            setError('Desired loan amount is required')
            return
        }

        setLoading(true)
        try {
            await apiSaveOnboardingStep2({
                years_in_business: qualify.yearsInBusiness.trim(),
                asset_type: assetType,
                desired_loan_amount:
                    qualify.loanAmount as OnboardingStep2Body['desired_loan_amount'],
            })
            navigate('/onboarding-wizard?step=step-3')
        } catch (err) {
            setError(
                (err as { message?: string }).message ??
                    'There was a problem saving your information',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <CenteredCardLayout>
            <div className="flex flex-col gap-[30px]">
                <StepProgress step={2} total={3} />

                <div className="flex flex-col gap-[15px]">
                    <h1 className="ab-h3">Diving in a bit more</h1>
                    <p className="ab-serif text-ink/70">
                        Help us understand your business.
                    </p>
                </div>

                <form className="flex flex-col gap-[30px]" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-[20px]">
                        <Field label="How long has your company been in business?">
                            <TextField
                                placeholder="Enter number of years"
                                value={qualify.yearsInBusiness}
                                onChange={(e) =>
                                    patch({ yearsInBusiness: e.target.value })
                                }
                            />
                        </Field>

                        <Field label="Asset type for collateral">
                            <OptionGroup
                                options={ASSET_TYPES}
                                value={qualify.assetType}
                                onChange={(v) => patch({ assetType: v })}
                            />
                        </Field>

                        <Field label="What is your desired loan amount?">
                            <Select
                                options={LOAN_AMOUNT_OPTIONS}
                                placeholder="Select loan amount"
                                value={qualify.loanAmount}
                                onChange={(v) => patch({ loanAmount: v })}
                            />
                        </Field>
                    </div>

                    {error && <p className="ab-text-m text-coral">{error}</p>}

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={() => navigate('/onboarding-wizard')}
                        >
                            Back
                        </PillButton>
                        <PillButton
                            type="submit"
                            variant="outline"
                            loading={loading}
                        >
                            Next
                        </PillButton>
                    </div>
                </form>
            </div>
        </CenteredCardLayout>
    )
}
