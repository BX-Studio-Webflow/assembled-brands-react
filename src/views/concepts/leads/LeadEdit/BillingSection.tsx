import Table from '@/components/ui/Table'
import Badge from '@/components/ui/Badge'
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    createColumnHelper,
} from '@tanstack/react-table'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'
import type { Lead } from '@/@types/lead'

type BillingSectionProps = {
    data: Lead
}

const { Tr, Td, TBody } = Table

const statusColor: Record<string, string> = {
    succeeded: 'bg-emerald-500',
    pending: 'bg-amber-400',
    failed: 'bg-red-500',
    cancelled: 'bg-red-500',
}

const columnHelper = createColumnHelper<Lead['payments'][0]>()

const columns = [
    columnHelper.accessor(
        (row) =>
            row.metadata?.eventName ||
            row.metadata?.membershipName ||
            'Payment',
        {
            id: 'event_name',
            header: 'Type',
            cell: (props) => {
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-semibold capitalize">
                            {props.getValue()}
                        </span>
                    </div>
                )
            },
        },
    ),
    columnHelper.accessor(
        (row) => row.metadata?.membershipName || 'Membership',
        {
            id: 'membership_name',
            header: 'Membership',
            cell: (props) => {
                const row = props.row.original
                const dates = row.metadata?.dates || []
                console.log(dates)
                return (
                    <div className="flex items-center gap-2">
                        <span className="font-semibold capitalize">
                            {props.getValue()}
                        </span>
                        <span className="text-sm text-gray-500">
                            {dayjs(dates[0] * 1000).format('MMM D, YYYY')}
                        </span>
                    </div>
                )
            },
        },
    ),
    columnHelper.accessor('payment_type', {
        header: 'Type',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center gap-2">
                    <span className="font-semibold capitalize">
                        {row.payment_type.replace('_', ' ').toLowerCase()}
                    </span>
                </div>
            )
        },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center gap-2">
                    <Badge className={statusColor[row.status]} />
                    <span className="heading-text font-bold capitalize">
                        {row.status}
                    </span>
                </div>
            )
        },
    }),
    columnHelper.accessor('created_at', {
        header: 'Date',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center">
                    {dayjs(row.created_at).format('MM/DD/YYYY')}
                </div>
            )
        },
    }),
    columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (props) => {
            const row = props.row.original
            return (
                <div className="flex items-center">
                    <NumericFormat
                        displayType="text"
                        value={row.amount}
                        prefix={row.currency === 'gbp' ? '£' : '$'}
                        thousandSeparator={true}
                    />
                </div>
            )
        },
    }),
]

const BillingSection = ({ data }: BillingSectionProps) => {
    const table = useReactTable({
        data: data.payments || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <>
            <h6 className="mb-4">Payment History</h6>
            <Table>
                <TBody>
                    {table
                        .getRowModel()
                        .rows.slice(0, 10)
                        .map((row) => {
                            return (
                                <Tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => {
                                        return (
                                            <Td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            )
                        })}
                </TBody>
            </Table>
        </>
    )
}

export default BillingSection
