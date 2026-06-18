import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { coldAccountsInventoryConfig } from '@/configs/documentUpload'

export default function AccountsInventory() {
    return <DocumentUploadPage {...coldAccountsInventoryConfig} />
}
