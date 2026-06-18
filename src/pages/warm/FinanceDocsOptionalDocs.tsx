import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { warmOptionalDocsConfig } from '@/configs/documentUpload'

export default function FinanceDocsOptionalDocs() {
    return <DocumentUploadPage {...warmOptionalDocsConfig} />
}
