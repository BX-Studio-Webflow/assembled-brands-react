import { useMemo, useState } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import useEventlist from '../hooks/useEventList'
import { apiDeleteEvent } from '@/services/EventService'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router'
import { TbTrash, TbEye, TbPencil, TbDownload, TbShare, TbLink } from 'react-icons/tb'
import type { OnSortParam, ColumnDef } from '@/components/shared/DataTable'
import type { EventItem } from '../types'
import type { TableQueries } from '@/@types/common'
import { FaVideo, FaMapMarkerAlt, FaFilm, FaLink } from 'react-icons/fa'
import { useAuth } from '@/auth'
import dayjs from 'dayjs'
import { AxiosError } from 'axios'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'

const EventStatusColor: Record<
    string,
    { label: string; bgClass: string; textClass: string }
> = {
    active: {
        label: 'Active',
        bgClass: 'bg-success-subtle',
        textClass: 'text-success',
    },
    suspended: {
        label: 'Suspended',
        bgClass: 'bg-warning-subtle',
        textClass: 'text-warning',
    },
    cancelled: {
        label: 'Cancelled',
        bgClass: 'bg-error-subtle',
        textClass: 'text-error',
    },
    inactive: {
        label: 'Inactive',
        bgClass: 'bg-error-subtle',
        textClass: 'text-error',
    },
}

const ActionColumn = ({ row }: { row: EventItem }) => {
    const navigate = useNavigate()
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [venueDialogOpen, setVenueDialogOpen] = useState(false)
    const { mutate } = useEventlist()

    const onDelete = () => {
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await apiDeleteEvent(row.id)
            toast.push(
                <Notification type="success">
                    Event deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate()
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteDialogOpen(false)
        }
    }

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false)
    }

    const onView = (event_type: string) => {
        if (event_type === 'prerecorded')
            navigate(`/concepts/event/stream/${row.id}`)
        else if (event_type === 'live_venue') setVenueDialogOpen(true)
        else if (event_type === 'live_video_call')
            window.open(row.live_video_url, '_blank')
    }


    const onVenueDialogClose = () => {
        setVenueDialogOpen(false)
    }

    return (
        <>
            <div className="flex justify-end text-lg gap-1">
                <Tooltip wrapperClass="flex" title="View Event">
                    <span
                        className={`cursor-pointer p-2  hover:text-blue-500`}
                        onClick={() => onView(row.event_type)}
                    >
                        <TbLink />

                    </span>
                </Tooltip>
                <Tooltip wrapperClass="flex" title="Delete Event">
                    <span
                        className="cursor-pointer p-2 hover:text-red-500"
                        onClick={onDelete}
                    >
                        <TbTrash />
                    </span>
                </Tooltip>
            </div>
            <ConfirmDialog
                isOpen={deleteDialogOpen}
                type="danger"
                title="Delete Event"
                onClose={handleCancelDelete}
                onRequestClose={handleCancelDelete}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to delete this event? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
            <Dialog
                isOpen={venueDialogOpen}
                onClose={onVenueDialogClose}
                onRequestClose={onVenueDialogClose}
            >
                <h5 className="mb-4">Venue Information</h5>
                <div className="mb-4">
                    <h6 className="font-semibold mb-2">Event Details</h6>
                    <p className="text-gray-600 mb-2">{row.event_name}</p>
                    <p className="text-gray-600 mb-2">
                        {row.event_description || 'No description available'}
                    </p>
                </div>
                <div className="mb-4">
                    <h6 className="font-semibold mb-2">Venue Address</h6>
                    <p className="text-gray-600">
                        {row.live_venue_address || 'No venue address available'}
                    </p>
                </div>
                {row.instructions && (
                    <div className="mb-4">
                        <h6 className="font-semibold mb-2">Instructions</h6>
                        <p className="text-gray-600">{row.instructions}</p>
                    </div>
                )}
                <div className="text-right mt-6">
                    <Button variant="solid" onClick={onVenueDialogClose}>
                        Close
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

const EventListTable = () => {
    const { EventList, EventListTotal, tableData, isLoading, setTableData } =
        useEventlist()
    const navigate = useNavigate()
    const { user } = useAuth()

    const columns: ColumnDef<EventItem>[] = useMemo(
        () => [

            ...(user?.role === 'master' || user?.role === 'owner'
                ? [
                    {
                        header: 'Host ID',
                        accessorKey: 'host_id',
                        cell: (props: { row: { original: EventItem } }) => {
                            const { host_id } = props.row.original
                            return (
                                <span className="font-semibold">
                                    {host_id}
                                </span>
                            )
                        },
                    },
                ]
                : []),
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props: { row: { original: EventItem } }) => {
                    const { memberships } = props.row.original
                    //if any date is in the future, return active
                    const isActive = memberships?.some(m => m.dates?.some(d => dayjs(Number(d.date) * 1000).isAfter(dayjs())))
                    const status = isActive ? 'active' : 'inactive'
                    return (
                        <Tag
                            className={EventStatusColor[status]?.bgClass || ''}
                        >
                            <span
                                className={`capitalize font-semibold ${EventStatusColor[status]?.textClass || ''}`}
                            >
                                {EventStatusColor[status]?.label || status}
                            </span>
                        </Tag>
                    )
                },
            },
            {
                header: 'Image',
                accessorKey: 'image_asset_id',
                cell: (props: { row: { original: EventItem } }) => {
                    const { image_asset } = props.row.original
                    return (
                        <Avatar className="mr-4" shape="round" src={image_asset?.presignedUrl || '/img/avatars/thumb-1.jpg'} />
                    )
                },
            },
            {
                header: 'Name',
                accessorKey: 'event_name',
                cell: (props: { row: { original: EventItem } }) => {
                    const { event_name } = props.row.original
                    return <span className="font-semibold">{event_name}</span>
                },
            },
            {
                header: 'Type',
                accessorKey: 'event_type',
                cell: (props: { row: { original: EventItem } }) => {
                    const { event_type } = props.row.original
                    return (
                        <span className="font-semibold">
                            {event_type === 'prerecorded'
                                ? 'Pre Recorded'
                                : event_type === 'live_venue'
                                    ? 'Live Venue'
                                    : 'Live Video Call'}
                        </span>
                    )
                },
            },

            {
                header: 'Tickets',
                accessorKey: 'memberships',
                cell: (props: { row: { original: EventItem } }) => {
                    const { memberships } = props.row.original
                    const date_list = memberships
                        ?.map(
                            (m) =>
                                `${dayjs(
                                    Number(m.dates?.[0]?.date) *
                                    1000,
                                ).format(
                                    'ddd, DD MMM YYYY',
                                )} - £${m?.price}`,
                        )

                    return (
                        <Tooltip title={
                            <div>
                                {date_list?.map((d) => (
                                    <div key={d}>{d}</div>
                                ))}
                            </div>
                        }>
                            <span className="font-semibold">
                                {memberships && memberships?.length > 0
                                    ? date_list?.length
                                    : ''}
                            </span>
                        </Tooltip>
                    )
                },
            },
            {
                header: 'Created',
                accessorKey: 'created_at',
                cell: (props: { row: { original: EventItem } }) => {
                    const { created_at } = props.row.original
                    return (
                        <span className="font-semibold">
                            {created_at
                                ? new Date(created_at).toLocaleString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                                : ''}
                        </span>
                    )
                },
            },
            {
                header: 'Event',
                accessorKey: 'event',
                cell: (props) => {
                    const { event_type, id } = props.row.original
                    let icon = null
                    if (event_type === 'prerecorded')
                        icon = (
                            <FaFilm
                                className="inline-block mr-1"
                                onClick={() => {
                                    navigate(`/concepts/event/stream/${id}`)
                                }}
                            />
                        )
                    else if (event_type === 'live_venue')
                        icon = <FaMapMarkerAlt className="inline-block mr-1" />
                    else if (event_type === 'live_video_call')
                        icon = <FaVideo className="inline-block mr-1" />

                    return id ? (
                        <span className="font-semibold flex items-center gap-2">
                            {icon}
                            id {id}
                        </span>
                    ) : null
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props: { row: { original: EventItem } }) => (
                    <ActionColumn row={props.row.original} />
                ),
            },
        ],
        [user?.role],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
    }

    const handlePaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowClick = (row: EventItem) => {
        navigate(`/concepts/event/event-edit/${row.id}`)
    }

    return (
        <DataTable
            columns={columns}
            data={EventList}
            noData={!isLoading && EventList.length === 0}
            skeletonAvatarColumns={[0]}
            skeletonAvatarProps={{ width: 28, height: 28 }}
            loading={isLoading}
            pagingData={{
                total: EventListTotal,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            onPaginationChange={handlePaginationChange}
            onRowClick={handleRowClick}
            onSelectChange={handleSelectChange}
            onSort={handleSort}
        />
    )
}

export default EventListTable
