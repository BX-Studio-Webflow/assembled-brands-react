import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import CenteredCardLayout from '@/components/layouts/CenteredCardLayout'
import StepProgress from '@/components/ui/StepProgress'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import OptionGroup from '@/components/ui/OptionGroup'
import PillButton from '@/components/ui/PillButton'
import { EMPLOYEE_RANGES } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'
import { apiGetOnboardingProgress, apiSaveOnboardingStep1 } from '@/services/OnboardingService'
import {
    isValidWebsite,
    mapEmployeeCount,
} from '@/lib/mappings/onboarding'

const EMPLOYEE_API_TO_LABEL: Record<string, string> = {
    just_me: 'Just me',
    '2-10': '2-10',
    '11-50': '11-50',
    '51-100': '51-100',
    '101-500': '101-500',
    '501+': '501+',
}

export default function QualifyStep1() {
    const navigate = useNavigate()
    const qualify = useApplicationStore((s) => s.qualify)
    const patch = useApplicationStore((s) => s.patchQualify)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        void apiGetOnboardingProgress().then((result) => {
            const step1 = result?.progress?.step1
            if (!step1) return
            patch({
                legalName: step1.legal_name ?? '',
                employees: step1.employee_count
                    ? (EMPLOYEE_API_TO_LABEL[step1.employee_count] ??
                      step1.employee_count)
                    : '',
                website: step1.website ?? '',
            })
        })
    }, [patch])

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!qualify.legalName.trim()) {
            setError('Legal name is required')
            return
        }
        const employeeCount = mapEmployeeCount(qualify.employees)
        if (!employeeCount) {
            setError('Employee count is required')
            return
        }
        if (!qualify.website.trim()) {
            setError('Website is required')
            return
        }
        if (!isValidWebsite(qualify.website)) {
            setError('Enter a valid website address')
            return
        }

        setLoading(true)
        try {
            await apiSaveOnboardingStep1({
                legal_name: qualify.legalName.trim(),
                employee_count: employeeCount,
                website: qualify.website.trim(),
            })
            navigate('/onboarding-wizard?step=2')
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
                <StepProgress step={1} total={3} />

                <div className="flex flex-col gap-[15px]">
                    <h1 className="ab-h3">Let’s confirm your company info</h1>
                    <p className="ab-serif text-ink/70">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse varius enim in eros.
                    </p>
                </div>

                <form className="flex flex-col gap-[30px]" onSubmit={onSubmit}>
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

                    {error && <p className="ab-text-m text-coral">{error}</p>}

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={() => navigate('/onboarding-wizard?step=start')}
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
