import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { coldFinancialReportsConfig } from '@/configs/documentUpload'

export default function FinancialReports() {
    return <DocumentUploadPage {...coldFinancialReportsConfig} />
}
