import DocumentUploadPage from '@/components/portal/DocumentUploadPage'

export default function TeamOwnership() {
    return (
        <DocumentUploadPage
            title="Team & Ownership"
            nextTo="/app/support"
            sections={[
                {
                    id: 'to-management-bios',
                    label: 'Please upload the management bios for our team.',
                },
                {
                    id: 'to-investor-deck',
                    label: 'Please provide the most recent investor deck.',
                },
                {
                    id: 'to-cap-table',
                    label: 'Please provide the most recent capitalization table.',
                },
            ]}
        />
    )
}
