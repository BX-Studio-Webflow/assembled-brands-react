import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import {
    WARM_LEAD_BUSINESS_PLAN_FORMAT_LABEL,
    WARM_LEAD_INSTORE_VELOCITY_FORMAT_LABEL,
} from '@/lib/validation/warmLead'

export default function FinanceDocsOptionalDocs() {
    return (
        <DocumentUploadPage
            title="Optional Documents"
            nextTo="/warm/invite-team-members"
            sections={[
                {
                    id: 'wl-instore-velocity',
                    label: 'In-store velocity reports',
                    formats: WARM_LEAD_INSTORE_VELOCITY_FORMAT_LABEL,
                },
                {
                    id: 'wl-business-plan',
                    label: 'Business plan',
                    formats: WARM_LEAD_BUSINESS_PLAN_FORMAT_LABEL,
                },
            ]}
        />
    )
}
