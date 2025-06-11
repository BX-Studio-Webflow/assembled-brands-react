import { useCallback } from 'react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'
import { useNavigate } from 'react-router'
import { NumericFormat } from 'react-number-format'
import dayjs from 'dayjs'

type Payment = {
    id: number
    contact_id: number
    lead_id: number
    event_id: number
    membership_id: number
    beneficiary_id: number
    stripe_customer_id: string
    checkout_session_id: string
    amount: string
    currency: string
    status:
        | 'succeeded'
        | 'failed'
        | 'pending'
        | 'processing'
        | 'canceled'
        | 'refunded'
    payment_type: 'one_off' | 'subscription'
    metadata: {
        dates: number[]
        eventName: string
        sessionId: string
        membershipName: string
    }
    created_at: string
    updated_at: string
}

type RecentOrderProps = {
    data: Payment[]
}

const { Tr, Td, TBody, THead, Th } = Table

const paymentStatusColor: Record<
    string,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    succeeded: {
        label: 'Success',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    failed: {
        label: 'Failed',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
    pending: {
        label: 'Pending',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    processing: {
        label: 'Processing',
        dotClass: 'bg-blue-500',
        textClass: 'text-blue-500',
    },
    canceled: {
        label: 'Canceled',
        dotClass: 'bg-gray-500',
        textClass: 'text-gray-500',
    },
    refunded: {
        label: 'Refunded',
        dotClass: 'bg-purple-500',
        textClass: 'text-purple-500',
    },
}

const PaymentColumn = ({ row }: { row: Payment }) => {
    const navigate = useNavigate()

    const handleView = useCallback(() => {
        navigate(`/payments/${row.id}`)
    }, [navigate, row])

    return (
        <span
            className={`cursor-pointer select-none font-semibold hover:text-primary`}
            onClick={handleView}
        >
            #{row.id}
        </span>
    )
}

const columnHelper = createColumnHelper<Payment>()

const columns = [
    columnHelper.accessor('id', {
        header: 'Payment',
        cell: (props) => <PaymentColumn row={props.row.original} />,
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (props) => {
            const { status } = props.row.original
            return (
                <div className="flex items-center">
                    <Badge className={paymentStatusColor[status].dotClass} />
                    <span
                        className={`ml-2 rtl:mr-2 capitalize font-semibold ${paymentStatusColor[status].textClass}`}
                    >
                        {paymentStatusColor[status].label}
                    </span>
                </div>
            )
        },
    }),
    columnHelper.accessor('created_at', {
        header: 'Date',
        cell: (props) => {
            const row = props.row.original
            return <span>{dayjs(row.created_at).format('DD/MM/YYYY')}</span>
        },
    }),
    columnHelper.accessor('metadata.eventName', {
        header: 'Event',
    }),
    columnHelper.accessor('metadata.membershipName', {
        header: 'Membership',
    }),
    columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (props) => {
            const { amount, currency } = props.row.original
            return (
                <NumericFormat
                    className="heading-text font-bold"
                    displayType="text"
                    value={amount}
                    prefix={currency === 'gbp' ? '£' : '$'}
                    thousandSeparator={true}
                />
            )
        },
    }),
]

const RecentOrder = ({ data = [] }: RecentOrderProps) => {
    const navigate = useNavigate()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>Recent Payments</h4>
                <Button size="sm" onClick={() => navigate('/payments')}>
                    View All Payments
                </Button>
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
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
        </Card>
    )
}

export default RecentOrder
