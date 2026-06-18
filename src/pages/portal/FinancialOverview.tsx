import { useState } from 'react'
import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import StepProgress from '@/components/ui/StepProgress'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import PillButton from '@/components/ui/PillButton'
import { useApplicationStore } from '@/store/applicationStore'
import type { JSX } from 'react'

const TOTAL = 4

export default function FinancialOverview() {
    const navigate = useNavigate()
    const data = useApplicationStore((s) => s.financialOverview)
    const patch = useApplicationStore((s) => s.patchFinancialOverview)
    const [step, setStep] = useState(1)

    const back = () =>
        step === 1 ? navigate('/finance-company-profile') : setStep((s) => s - 1)
    const next = () =>
        step === TOTAL
            ? navigate('/finance-docs-financial-reports')
            : setStep((s) => s + 1)

    const steps: Record<number, JSX.Element> = {
        1: (
            <>
                <Field label="What were the company’s revenues over the last 12 months?">
                    <TextField
                        variant="soft"
                        placeholder="$0"
                        value={data.revenuesLast12}
                        onChange={(e) => patch({ revenuesLast12: e.target.value })}
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
            </>
        ),
        2: (
            <>
                <Field label="What is your gross profit over the last 12 months?">
                    <TextField
                        variant="soft"
                        placeholder="$0"
                        value={data.grossProfit}
                        onChange={(e) => patch({ grossProfit: e.target.value })}
                    />
                </Field>
                <Field label="What is your gross margin?">
                    <TextField
                        variant="soft"
                        placeholder="e.g. 42%"
                        value={data.grossMargin}
                        onChange={(e) => patch({ grossMargin: e.target.value })}
                    />
                </Field>
            </>
        ),
        3: (
            <Field label="In which territory is the business primarily based?">
                <TextField
                    variant="soft"
                    placeholder="e.g. United States"
                    value={data.territory}
                    onChange={(e) => patch({ territory: e.target.value })}
                />
            </Field>
        ),
        4: (
            <Field label="What was your biggest expense over the last 12 months?">
                <TextField
                    variant="soft"
                    placeholder="Describe your largest expense"
                    value={data.biggestExpense}
                    onChange={(e) => patch({ biggestExpense: e.target.value })}
                />
            </Field>
        ),
    }

    return (
        <>
            <PageHeader title="Financial Overview" />
            <PortalCard>
                <form
                    className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]"
                    onSubmit={(e) => {
                        e.preventDefault()
                        next()
                    }}
                >
                    <StepProgress step={step} total={TOTAL} />
                    <h2 className="ab-h3">Basic Information</h2>

                    <div className="flex flex-col gap-[30px]">{steps[step]}</div>

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={back}
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </PillButton>
                        <PillButton type="submit" variant="outline">
                            {step === TOTAL ? 'Save & continue' : 'Next'}
                        </PillButton>
                    </div>
                </form>
            </PortalCard>
        </>
    )
}
