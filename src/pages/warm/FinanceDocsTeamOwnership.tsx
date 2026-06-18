import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { warmTeamOwnershipConfig } from '@/configs/documentUpload'

export default function FinanceDocsTeamOwnership() {
    return <DocumentUploadPage {...warmTeamOwnershipConfig} />
}
