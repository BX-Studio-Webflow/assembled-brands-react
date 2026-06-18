import DocumentUploadPage from '@/components/portal/DocumentUploadPage'

export default function EcommercePerformance() {
    return (
        <DocumentUploadPage
            title="E-Commerce Performance"
            nextTo="/app/documents/team-ownership"
            sections={[
                {
                    id: 'ec-repeat-customers',
                    label: 'Shopify Repeat Customer Reports ** Please provide reports on repeat customers for at least the last 24 months, or longer if possible.',
                },
                {
                    id: 'ec-monthly-sales',
                    label: 'Shopify Monthly Sales Reports ** Please provide monthly sales reports from Shopify for the last 24 months, or longer if available.',
                },
            ]}
        />
    )
}
