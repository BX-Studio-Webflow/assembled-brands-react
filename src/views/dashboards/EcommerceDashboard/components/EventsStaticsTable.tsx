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
import dayjs from 'dayjs'
import Tag from '@/components/ui/Tag'

type EventStats = {
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
    upcoming_dates: Array<{ id: number; date: string; lead_count: number; membership_name: string }>
    dates: Array<{ id: number; date: string; lead_count: number; membership_name: string }>
    membership_name: string[]
}

type EventsStatsData = {
    data: EventStats[]
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
    inactive: {
        label: 'Inactive',
        dotClass: 'bg-red-500',
        textClass: 'text-red-500',
    },
}

const EventColumn = ({ row }: { row: EventStats }) => {
    const navigate = useNavigate()

    const handleView = useCallback(() => {
        navigate(`/concepts/event/event-edit/${row.event_id}`)
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

const columnHelper = createColumnHelper<EventStats>()

const columns = [
    columnHelper.accessor('event_name', {
        header: 'Event Name',
        cell: (props) => <EventColumn row={props.row.original} />,
    }),


    columnHelper.accessor('dates', {
        header: 'Dates',
        cell: (props) => {
            const dates = props.getValue()
            const formatted = dates.map((d) => ({
                id: d.id,
                label: dayjs(Number(d.date) * 1000).format('ddd, DD MMM YYYY'),
                count: d.lead_count,
            }))
            return (
                <div className="flex flex-col gap-2">
                    {formatted.length > 0 ? (
                        formatted.map((d) => (
                            <span key={d.id} className="font-semibold">
                                {d.label}
                            </span>
                        ))
                    ) : (
                        <span className="font-semibold">No dates</span>
                    )}
                </div>

            )
        },
    }),
    columnHelper.accessor('registrations', {
        header: 'Registrations',
        cell: (props) => {
            const dates = props.row.original.dates || []
            return (
                <div className="flex flex-col gap-2">
                    {dates.length > 0 ? (
                        dates.map((d) => (
                            <span key={d.id} className="font-semibold">{d.lead_count}</span>
                        ))
                    ) : (
                        <span className="font-semibold">0</span>
                    )}
                </div>
            )
        },
    }),
    columnHelper.accessor('membership_name', {
        header: 'Membership Name',
        cell: (props) => {
            const dates = props.row.original.dates || []
            return (
                <div className="flex flex-col gap-2">
                    {dates.length > 0 ? (
                        dates.map((d, index) => (
                            <span key={index} className="font-semibold">{d.membership_name}</span>
                        ))
                    ) : (
                        <span className="font-semibold">No membership name</span>
                    )}
                </div>
            )
        },
    }),
    columnHelper.accessor('event_type', {
        header: 'Type',
        cell: (props) => {
            const type = props.getValue()
            const map: Record<string, string> = {
                prerecorded: 'text-white bg-indigo-600 border-0',
                live_venue:
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded',
                live_video_call:
                    'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0',
            }
            const label =
                type === 'prerecorded'
                    ? 'Pre-Recorded'
                    : type === 'live_venue'
                        ? 'Live Venue'
                        : 'Live Video Call'
            return (
                <Tag className={map[type] || 'text-white bg-indigo-600 border-0'}>
                    {label}
                </Tag>
            )
        },
    }),

  
    columnHelper.accessor('upcoming_dates', {
        header: 'Status',
        cell: (props) => {
            const upcomingDates = props.getValue()
            const status = upcomingDates.length > 0 ? 'active' : 'inactive'
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

const EventsStatsTable = ({ data = [] }: EventsStatsData) => {
    const navigate = useNavigate()
    const now = dayjs()
    const windowStart = now.subtract(15, 'day').startOf('day')
    const windowEnd = now.add(30, 'day').endOf('day')

    const filteredData = data.filter((ev) => {
        const dates = ev.dates || []
        return dates.some((d) => {
            const ts = Number(d.date)
            if (Number.isNaN(ts)) return false
            const dt = dayjs.unix(ts)
            return dt.isAfter(windowStart) && dt.isBefore(windowEnd)
        })
    })

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>Upcoming 30 day stats</h4>
                <Button
                    size="sm"
                    onClick={() => navigate('/concepts/event/event-list')}
                >
                    View All
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

export default EventsStatsTable
