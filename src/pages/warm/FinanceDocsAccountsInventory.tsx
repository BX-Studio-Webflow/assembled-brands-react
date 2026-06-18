import { useRef, useState } from 'react'
import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import Field from '@/components/ui/Field'
import Select from '@/components/ui/Select'
import TextField from '@/components/ui/TextField'
import { warmAccountsInventoryConfig } from '@/configs/documentUpload'
import {
    buildBusinessUpdatePayload,
    getBusinessProfile,
} from '@/lib/api/businessProfile'
import { WARM_LEAD_INTERNATIONAL_LOCATION_PLACEHOLDER } from '@/lib/validation/warmLead'
import { INVENTORY_LOCATION_OPTIONS } from '@/constants/options'
import { apiUpdateBusiness } from '@/services/BusinessService'
import type { Business, UpdateBusinessRequest } from '@/types/business'

export default function FinanceDocsAccountsInventory() {
    const [inventoryLocation, setInventoryLocation] = useState('')
    const [internationalLocation, setInternationalLocation] = useState('')
    const businessProfileRef = useRef<Business | null>(null)

    const showInternational = inventoryLocation === 'International'

    function inventoryLocationFields() {
        return (
            <div className="flex w-full flex-col gap-[20px]">
                <Field label="Where is your company-owned inventory currently held?">
                    <Select
                        options={INVENTORY_LOCATION_OPTIONS}
                        placeholder="Select inventory location"
                        value={inventoryLocation}
                        onChange={setInventoryLocation}
                    />
                </Field>
                {showInternational && (
                    <Field label="Please specify the city and country:">
                        <TextField
                            variant="soft"
                            placeholder={WARM_LEAD_INTERNATIONAL_LOCATION_PLACEHOLDER}
                            value={internationalLocation}
                            onChange={(e) =>
                                setInternationalLocation(e.target.value)
                            }
                        />
                    </Field>
                )}
            </div>
        )
    }

    return (
        <DocumentUploadPage
            {...warmAccountsInventoryConfig}
            renderAfterSection={(sectionId) =>
                sectionId === 'ai-inventory' ? inventoryLocationFields() : null
            }
            validateSubmit={() => {
                if (!inventoryLocation) {
                    return 'Please select where your company-owned inventory is held'
                }
                if (
                    inventoryLocation === 'International' &&
                    !internationalLocation.trim()
                ) {
                    return 'Please specify the city and country'
                }
                return null
            }}
            onProgressLoaded={(progress) => {
                const profile = getBusinessProfile(progress)
                businessProfileRef.current = profile
                if (profile?.inventory_location) {
                    setInventoryLocation(profile.inventory_location)
                }
                if (profile?.international_location) {
                    setInternationalLocation(profile.international_location)
                }
            }}
            onBeforeSubmit={async () => {
                const profile = businessProfileRef.current
                if (!profile?.legal_name) {
                    throw new Error('Business profile not found')
                }
                const inventory = {
                    inventory_location: inventoryLocation as NonNullable<
                        UpdateBusinessRequest['inventory_location']
                    >,
                    ...(inventoryLocation === 'International'
                        ? { international_location: internationalLocation.trim() }
                        : {}),
                }
                await apiUpdateBusiness(
                    buildBusinessUpdatePayload(profile, inventory),
                )
            }}
        />
    )
}
