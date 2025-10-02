import { useCallback } from 'react'
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
import { DashboardResponse } from '@/@types/auth'

type EventRow = DashboardResponse['events']['events_flat'][number]

type EventsStatsData = {
    data: EventRow[]
    title: 'past' | 'upcoming'
}

const { Tr, Td, TBody, THead, Th } = Table


const EventColumn = ({ row }: { row: EventRow }) => {
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

const columnHelper = createColumnHelper<EventRow>()

const columns = [
    columnHelper.accessor('event_name', {
        header: 'Event Name',
        cell: (props) => <EventColumn row={props.row.original} />,
    }),
    columnHelper.accessor('membership_name', {
        header: 'Ticket name',
        cell: (props) => {
            const date = props.row.original.dateItem
            return (
                <span className="font-semibold">
                    {date?.membership_name || 'No membership name'}
                </span>
            )
        },
    }),
    columnHelper.display({
        id: 'date',
        header: 'Date',
        cell: (props) => {
            const date = props.row.original.dateItem
            const label = date
                ? dayjs(Number(date.date) * 1000).format('ddd, DD MMM YYYY')
                : 'No date'
            return <span className="font-semibold">{label}</span>
        },
    }),
    columnHelper.accessor('registrations', {
        header: 'Registrations',
        cell: (props) => {
            const date = props.row.original.dateItem
            return (
                <span className="font-semibold">
                    {date ? date.lead_count : 0}
                </span>
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
                    ? 'Pre Recorded'
                    : type === 'live_venue'
                        ? 'Live Venue'
                        : 'Live Video Call'
            return (
                <Tag
                    className={map[type] || 'text-white bg-indigo-600 border-0'}
                >
                    {label}
                </Tag>
            )
        },
    }),
]

const EventsStatsTable = ({
    data = [],
    title = 'upcoming',
}: EventsStatsData) => {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h4>
                    {title === 'upcoming' ? 'Upcoming events' : 'Past events'}
                </h4>

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
