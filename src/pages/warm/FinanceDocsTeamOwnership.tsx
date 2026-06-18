import DocumentUploadPage from '@/components/portal/DocumentUploadPage'

export default function WarmFinanceDocsTeamOwnership() {
    return (
        <DocumentUploadPage
            title="Team & Ownership"
            nextTo="/warm/finance-docs-optional-docs"
            sections={[
                {
                    id: 'to-management-bios',
                    label: 'Management bios',
                },
                {
                    id: 'to-investor-deck',
                    label: 'Investor deck',
                },
                {
                    id: 'to-cap-table',
                    label: 'Cap table',
                },
            ]}
        />
    )
}
