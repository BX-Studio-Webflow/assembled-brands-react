import { useNavigate } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import StepProgress from '@/components/ui/StepProgress'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import OptionGroup from '@/components/ui/OptionGroup'
import PillButton from '@/components/ui/PillButton'
import { EMPLOYEE_RANGES } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'

export default function QualifyStep1() {
    const navigate = useNavigate()
    const qualify = useApplicationStore((s) => s.qualify)
    const patch = useApplicationStore((s) => s.patchQualify)

    return (
        <CenteredCardLayout>
            <div className="flex flex-col gap-[30px]">
                <StepProgress step={1} total={3} />

                <div className="flex flex-col gap-[15px]">
                    <h1 className="ab-h3">Let’s confirm your company info</h1>
                    <p className="ab-serif text-ink/70">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse varius enim in eros.
                    </p>
                </div>

                <form
                    className="flex flex-col gap-[30px]"
                    onSubmit={(e) => {
                        e.preventDefault()
                        navigate('/onboarding-wizard?step=2')
                    }}
                >
                    <div className="flex flex-col gap-[20px]">
                        <Field label="What is your company’s legal name?">
                            <TextField
                                placeholder="Enter the name of your company"
                                value={qualify.legalName}
                                onChange={(e) =>
                                    patch({ legalName: e.target.value })
                                }
                            />
                        </Field>

                        <Field label="How many employees does the company have?">
                            <OptionGroup
                                options={EMPLOYEE_RANGES}
                                value={qualify.employees}
                                onChange={(v) => patch({ employees: v })}
                            />
                        </Field>

                        <Field label="Website Link">
                            <TextField
                                placeholder="Enter your website link"
                                value={qualify.website}
                                onChange={(e) => patch({ website: e.target.value })}
                            />
                        </Field>
                    </div>

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={() => navigate('/onboarding-wizard?step=start')}
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
