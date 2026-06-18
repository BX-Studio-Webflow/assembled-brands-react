import DocumentUploadPage from '@/components/portal/DocumentUploadPage'

export default function WarmFinanceDocsAccountsInventory() {
    return (
        <DocumentUploadPage
            title="Accounts & Inventory"
            nextTo="/warm/finance-docs-ecommerce-performance"
            sections={[
                {
                    id: 'ai-inventory',
                    label: 'Monthly Inventory Reports',
                },
                {
                    id: 'ai-ar-aging',
                    label: 'Accounts Receivable Aging Reports',
                },
                {
                    id: 'ai-ap-aging',
                    label: 'Accounts Payable Aging Report',
                },
            ]}
        />
    )
}
