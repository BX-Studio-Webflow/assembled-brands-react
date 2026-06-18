import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { warmFinancialReportsConfig } from '@/configs/documentUpload'

export default function FinanceDocsFinancialReport() {
    return <DocumentUploadPage {...warmFinancialReportsConfig} />
}
