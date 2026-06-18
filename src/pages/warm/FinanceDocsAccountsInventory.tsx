import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { warmAccountsInventoryConfig } from '@/configs/documentUpload'

export default function FinanceDocsAccountsInventory() {
    return <DocumentUploadPage {...warmAccountsInventoryConfig} />
}
