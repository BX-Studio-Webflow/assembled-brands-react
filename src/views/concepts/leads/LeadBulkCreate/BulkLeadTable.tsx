import { ParsedLead } from '@/@types/lead'
import Table from '@/components/ui/Table'

const { Tr, Th, Td, THead, TBody } = Table

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
                        <Th>Dial Code</Th>
                        <Th>Phone</Th>
                    </Tr>
                </THead>
                <TBody>
                    {data.map((lead, index) => (
                        <Tr key={index}>
                            <Td>{lead.name}</Td>
                            <Td>{lead.email}</Td>
                            <Td>{lead.dial_code}</Td>
                            <Td>{lead.phone}</Td>
                        </Tr>
                    ))}
                </TBody>
            </Table>
        </div>
    )
}

export default BulkLeadTable
