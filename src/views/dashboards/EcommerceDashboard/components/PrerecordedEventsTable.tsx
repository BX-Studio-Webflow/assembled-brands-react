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

type PrerecordedEvent = {
    event_id: number
    event_name: string
    event_type: string
    status: string
    created_at: string
    registrations: number
    attendees: number
    non_attendees: number
    fallthrough_rate: number
    earnings: number
}

type PrerecordedEventsData = {
    data: PrerecordedEvent[]
}

const { Tr, Td, TBody, THead, Th } = Table

const eventStatusColor: Record<
    string,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    active: {
        label: 'Active',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    suspended: {
        label: 'Suspended',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    cancelled: {
        label: 'Cancelled',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
}

const EventColumn = ({ row }: { row: PrerecordedEvent }) => {
    const navigate = useNavigate()

    const handleView = useCallback(() => {
        navigate(`/events/${row.event_id}`)
    }, [navigate, row])

    return (
        <span
            className={`cursor-pointer select-none font-semibold hover:text-primary`}
            onClick={handleView}
        >
            {row.event_name}
        </span>
    )
}

const columnHelper = createColumnHelper<PrerecordedEvent>()

const columns = [
    columnHelper.accessor('event_name', {
        header: 'Event Name',
        cell: (props) => <EventColumn row={props.row.original} />,
    }),
    columnHelper.accessor('registrations', {
        header: 'Registrations',
        cell: (props) => {
            return (
                <NumericFormat
                    className="heading-text font-bold"
                    displayType="text"
                    value={props.getValue()}
                    thousandSeparator={true}
                />
            )
        },
    }),
    columnHelper.accessor('attendees', {
        header: 'Attendees',
        cell: (props) => {
            return (
                <NumericFormat
                    className="heading-text font-bold"
                    displayType="text"
                    value={props.getValue()}
                    thousandSeparator={true}
                />
            )
        },
    }),
    columnHelper.accessor('earnings', {
        header: 'Earnings',
        cell: (props) => {
            const earnings = props.getValue()
            return (
                <NumericFormat
                    className="heading-text font-bold"
                    displayType="text"
                    value={earnings}
                    prefix={'$'}
                    thousandSeparator={true}
                    decimalScale={2}
                />
            )
        },
    }),
    columnHelper.accessor('fallthrough_rate', {
        header: 'Fallthrough Rate',
        cell: (props) => {
            const rate = props.getValue()
            return <span className="font-semibold">{rate.toFixed(1)}%</span>
        },
    }),
    columnHelper.accessor('status', {
        header: 'Status',
        cell: (props) => {
            const { status } = props.row.original
            return (
                <div className="flex items-center">
                    <Badge className={eventStatusColor[status].dotClass} />
                    <span
                        className={`ml-2 rtl:mr-2 capitalize font-semibold ${eventStatusColor[status].textClass}`}
                    >
                        {eventStatusColor[status].label}
                    </span>
                </div>
            )
        },
    }),
]

const PrerecordedEventsTable = ({ data = [] }: PrerecordedEventsData) => {
    const navigate = useNavigate()
    console.log(data)
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>Event Statistics</h4>
                <Button size="sm" onClick={() => navigate('/events')}>
                    View All Events
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

export default PrerecordedEventsTable
