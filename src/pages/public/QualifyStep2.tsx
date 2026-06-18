import { useNavigate } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import StepProgress from '@/components/ui/StepProgress'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import OptionGroup from '@/components/ui/OptionGroup'
import PillButton from '@/components/ui/PillButton'
import { ASSET_TYPES } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'

export default function QualifyStep2() {
    const navigate = useNavigate()
    const qualify = useApplicationStore((s) => s.qualify)
    const patch = useApplicationStore((s) => s.patchQualify)

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

                <form
                    className="flex flex-col gap-[30px]"
                    onSubmit={(e) => {
                        e.preventDefault()
                        navigate('/onboarding-wizard?step=step-3')
                    }}
                >
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
                            <TextField
                                placeholder="$500K"
                                value={qualify.loanAmount}
                                onChange={(e) =>
                                    patch({ loanAmount: e.target.value })
                                }
                            />
                        </Field>
                    </div>

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={() => navigate('/onboarding-wizard')}
                        >
                            Back
                        </PillButton>
                        <PillButton type="submit" variant="outline">
                            Next
                        </PillButton>
                    </div>
                </form>
            </div>
        </CenteredCardLayout>
    )
}
