import DocumentUploadPage from '@/components/portal/DocumentUploadPage'

export default function AccountsInventory() {
    return (
        <DocumentUploadPage
            title="Accounts & Inventory"
            nextTo="/finance-docs-ecommerce-performance"
            sections={[
                {
                    id: 'ai-inventory',
                    label: 'Monthly Inventory Reports ** Please provide inventory reports for at least the last 24 months, or longer if possible.',
                },
                {
                    id: 'ai-ar-aging',
                    label: 'Accounts Receivable Aging Reports ** Please provide AR aging reports for the last 24 months, or longer if available.',
                },
                {
                    id: 'ai-ap-aging',
                    label: 'Accounts Payable Aging Report ** Please provide the accounts payable aging report for the next 24 months, or longer if possible.',
                },
            ]}
        />
    )
}
