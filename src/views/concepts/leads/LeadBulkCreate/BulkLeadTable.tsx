
import Table from '@/components/ui/Table'

const { Tr, Th, Td, THead, TBody } = Table

type ParsedLead = {
    name: string
    email: string
    phone: string
}

type BulkLeadTableProps = {
    data: ParsedLead[]
}

const BulkLeadTable = ({ data }: BulkLeadTableProps) => {
    if (data.length === 0) {
        return null
    }

    return (
        <div className="mt-6">
            <Table>
                <THead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Phone</Th>
                    </Tr>
                </THead>
                <TBody>
                    {data.map((lead, index) => (
                        <Tr key={index}>
                            <Td>{lead.name}</Td>
                            <Td>{lead.email}</Td>
                            <Td>{lead.phone}</Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </div>
    )
}

export default BulkLeadTable

