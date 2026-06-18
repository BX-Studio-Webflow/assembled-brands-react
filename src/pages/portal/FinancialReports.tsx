import DocumentUploadPage from '@/components/portal/DocumentUploadPage'

export default function FinancialReports() {
    return (
        <DocumentUploadPage
            title="Financial Reports"
            nextTo="/app/documents/accounts-inventory"
            sections={[
                {
                    id: 'fr-balance-sheets',
                    label: 'Monthly Balance Sheets ** Please provide monthly balance sheets for at least the last 24 months, or longer if possible.',
                },
                {
                    id: 'fr-income-statements',
                    label: 'Monthly Income Statements ** Monthly income statements for the last 24 months, or longer if possible.',
                },
                {
                    id: 'fr-income-forecasts',
                    label: 'Monthly Income Forecasts ** Please provide monthly income forecasts for the next 24 months, or longer if possible.',
                },
            ]}
        />
    )
}
