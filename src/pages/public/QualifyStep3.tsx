import { useNavigate } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import StepProgress from '@/components/ui/StepProgress'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import OptionGroup from '@/components/ui/OptionGroup'
import Select from '@/components/ui/Select'
import PillButton from '@/components/ui/PillButton'
import { COMPANY_TYPES, YES_NO } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'

export default function QualifyStep3() {
    const navigate = useNavigate()
    const qualify = useApplicationStore((s) => s.qualify)
    const patch = useApplicationStore((s) => s.patchQualify)

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        // Dummy qualification rule: must have $10MM+ revenue to be a fit.
        if (qualify.revenuesOver10mm === 'no') navigate('/onboarding-step-not-fit')
        else navigate('/claim-account')
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
                            <Select
                                options={YES_NO}
                                value={qualify.revenuesOver10mm}
                                placeholder="Select an option"
                                onChange={(v) => patch({ revenuesOver10mm: v })}
                            />
                        </Field>
                    </div>

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={() => navigate('/onboarding-wizard?step=2')}
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
