import DocumentUploadPage from '@/components/portal/DocumentUploadPage'

export default function WarmFinanceDocsEcommercePerformance() {
    return (
        <DocumentUploadPage
            title="E-Commerce Performance"
            nextTo="/warm/finance-docs-team-and-ownership"
            sections={[
                {
                    id: 'ec-repeat-customers',
                    label: 'Shopify Repeat Customer Reports',
                },
                {
                    id: 'ec-monthly-sales',
                    label: 'Shopify Monthly Sales Reports',
                },
            ]}
        />
    )
}
