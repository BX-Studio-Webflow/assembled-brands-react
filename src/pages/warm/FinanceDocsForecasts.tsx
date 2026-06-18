import DocumentUploadPage from '@/components/portal/DocumentUploadPage'
import { WARM_LEAD_EXCEL_FORMAT_LABEL } from '@/lib/validation/warmLead'

export default function FinanceDocsForecasts() {
    return (
        <DocumentUploadPage
            title="Financial Forecasts"
            nextTo="/warm/finance-docs-accounts-and-inventory"
            sections={[
                {
                    id: 'wl-income-forecast',
                    label: 'Income Statement Forecast',
                    formats: WARM_LEAD_EXCEL_FORMAT_LABEL,
                },
                {
                    id: 'wl-balance-forecast',
                    label: 'Balance Sheet Full Year Forecast',
                    formats: WARM_LEAD_EXCEL_FORMAT_LABEL,
                },
            ]}
        />
    )
}
