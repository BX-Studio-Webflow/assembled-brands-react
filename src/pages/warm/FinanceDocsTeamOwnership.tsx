import { useRef, useState } from 'react'
import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import Field from '@/components/ui/Field'
import RadioGroup from '@/components/ui/RadioGroup'
import { warmTeamOwnershipConfig } from '@/configs/documentUpload'
import {
    buildBusinessUpdatePayload,
    getBusinessProfile,
} from '@/lib/api/businessProfile'
import { YES_NO } from '@/constants/options'
import { apiUpdateBusiness } from '@/services/BusinessService'
import type { Business, UpdateBusinessRequest } from '@/types/business'

export default function FinanceDocsTeamOwnership() {
    const [raisedExternalEquity, setRaisedExternalEquity] = useState('')
    const businessProfileRef = useRef<Business | null>(null)

    const capTableRequired = raisedExternalEquity === 'yes'

    const sections = warmTeamOwnershipConfig.sections.filter(
        (section) =>
            section.documentType !== 'cap_table' || capTableRequired,
    )

    return (
        <DocumentUploadPage
            {...warmTeamOwnershipConfig}
            sections={sections}
            requireAll={false}
            renderAfterSection={(sectionId) =>
                sectionId === 'to-investor-deck' ? (
                    <div className="flex w-full flex-col gap-[20px]">
                        <Field label="Has your company raised external capital?">
                            <RadioGroup
                                name="raised-external-equity"
                                options={YES_NO}
                                value={raisedExternalEquity}
                                onChange={setRaisedExternalEquity}
                            />
                        </Field>
                    </div>
                ) : null
            }
            isSectionRequired={(section) => {
                if (section.documentType === 'management_bios') return true
                if (section.documentType === 'cap_table') return capTableRequired
                return false
            }}
            validateSubmit={() => {
                if (!raisedExternalEquity) {
                    return 'Please select whether your company has raised external capital'
                }
                return null
            }}
            onProgressLoaded={(progress) => {
                const profile = getBusinessProfile(progress)
                businessProfileRef.current = profile
                if (profile?.raised_external_equity) {
                    setRaisedExternalEquity(profile.raised_external_equity)
                }
            }}
            onBeforeSubmit={async () => {
                const profile = businessProfileRef.current
                if (!profile?.legal_name) {
                    throw new Error('Business profile not found')
                }
                await apiUpdateBusiness(
                    buildBusinessUpdatePayload(profile, {
                        raised_external_equity:
                            raisedExternalEquity as UpdateBusinessRequest['raised_external_equity'],
                    }),
                )
            }}
        />
    )
}
