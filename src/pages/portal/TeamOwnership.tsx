import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { coldTeamOwnershipConfig } from '@/configs/documentUpload'

export default function TeamOwnership() {
    return <DocumentUploadPage {...coldTeamOwnershipConfig} />
}
