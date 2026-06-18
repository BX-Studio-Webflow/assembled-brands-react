import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { warmOptionalDocsConfig } from '@/configs/documentUpload'
import {
    revalidateDealApplications,
    revalidateFinancialProgress,
} from '@/lib/swr/mutate'
import { apiCompleteFinancialApplication } from '@/services/FinancialWizardService'

export default function FinanceDocsOptionalDocs() {
    return (
        <DocumentUploadPage
            {...warmOptionalDocsConfig}
            onAfterSubmit={async () => {
                const response = await apiCompleteFinancialApplication()
                sessionStorage.setItem(
                    'application-submitted-at',
                    response.application.updated_at ?? new Date().toISOString(),
                )
                await Promise.all([
                    revalidateFinancialProgress(),
                    revalidateDealApplications(),
                ])
            }}
        />
    )
}
