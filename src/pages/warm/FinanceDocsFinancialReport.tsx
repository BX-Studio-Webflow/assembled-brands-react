import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { WARM_LEAD_EXCEL_FORMAT_LABEL } from '@/lib/validation/warmLead'

export default function FinanceDocsFinancialReport() {
    return (
        <DocumentUploadPage
            title="Financial Reports"
            nextTo="/warm/finance-docs-forecasts"
            sections={[
                {
                    id: 'wl-balance-sheet',
                    label: 'Monthly Balance Sheets',
                    formats: WARM_LEAD_EXCEL_FORMAT_LABEL,
                },
                {
                    id: 'wl-income-statement',
                    label: 'Monthly Income Statements',
                    formats: WARM_LEAD_EXCEL_FORMAT_LABEL,
                },
            ]}
        />
    )
}
