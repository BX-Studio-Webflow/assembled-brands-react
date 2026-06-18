import { useNavigate } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import Field from '@/components/ui/Field'
import TextField from '@/components/ui/TextField'
import Select from '@/components/ui/Select'
import PillButton from '@/components/ui/PillButton'
import { US_STATES, ACCOUNTING_SOFTWARE } from '@/constants/options'
import { useApplicationStore } from '@/store/applicationStore'

export default function CompanyProfile() {
    const navigate = useNavigate()
    const data = useApplicationStore((s) => s.companyProfile)
    const patch = useApplicationStore((s) => s.patchCompanyProfile)

    return (
        <>
            <PageHeader title="Company Profile" />
            <PortalCard>
                <form
                    className="mx-auto flex w-full max-w-[543px] flex-col gap-[30px]"
                    onSubmit={(e) => {
                        e.preventDefault()
                        navigate('/finance-financial-overview')
                    }}
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

                    {data.accountingSoftware === 'Other' && (
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

                    <div className="flex justify-end gap-[10px]">
                        <PillButton
                            type="button"
                            variant="solid"
                            onClick={() => navigate('/finance-financial-overview')}
                        >
                            Cancel
                        </PillButton>
                        <PillButton type="submit" variant="outline">
                            Save and continue
                        </PillButton>
                    </div>
                </form>
            </PortalCard>
        </>
    )
}
