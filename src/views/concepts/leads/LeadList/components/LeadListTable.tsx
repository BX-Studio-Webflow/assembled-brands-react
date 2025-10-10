import { useMemo, useState } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useLeadList from '../hooks/useLeadList'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbTrash } from 'react-icons/tb'
import {
    HiPhone,
    HiCalendar,
    HiCheckCircle,
    HiPlusCircle,
    HiTicket,
    HiXCircle,
    HiOutlineGlobe,
    HiOutlineCursorClick,
    HiUserGroup,
    HiTag,
    HiClock,
} from 'react-icons/hi'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { LeadListItem } from '@/@types/lead'
import type { TableQueries } from '@/@types/common'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { apiDeleteLead } from '@/services/LeadsService'
import dayjs from 'dayjs'

const NameColumn = ({ row }: { row: LeadListItem }) => {
    return (
        <div className="flex items-center">
            <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap`}
                to={`/concepts/lead/lead-edit/${row.id}`}
            >
                {row.name}
            </Link>
        </div>
    )
}

const ActionColumn = ({ onDelete }: { onDelete: () => void }) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="View">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onDelete}
                >
                    <TbTrash />
                </div>
            </Tooltip>
        </div>
    )
}

const LeadListTable = () => {
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState<string | null>(null)

    const {
        leadList,
        leadListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllLead,
        setSelectedLead,
        selectedLead,
        mutate,
    } = useLeadList()

    const handleDelete = (customer: LeadListItem) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(String(customer.id))
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
        setToDeleteId(null)
    }

    const handleConfirmDelete = async () => {
        if (!toDeleteId) return
        try {
            await apiDeleteLead(toDeleteId)
            toast.push(
                <Notification type="success">
                    Lead deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to delete lead. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setToDeleteId(null)
        }
    }

    const columns: ColumnDef<LeadListItem>[] = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <NameColumn row={row} />
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: (props) => {
                    const { row } = props
                    const dialCode = row.original.dial_code || ''
                    const phone = row.original.phone || ''
                    return `${dialCode}${phone}`
                },
            },
            {
                header: 'Status',
                accessorKey: 'lead_status',
                cell: (props) => {
                    const row = props.row.original

                    let statusText = 'New lead'
                    let statusIcon = (
                        <HiPlusCircle className="text-base text-red-600 mr-1 rtl:ml-1" />
                    )
                    let statusClass =
                        'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 border-0'

                    if (row.lead_status === 'call_back') {
                        statusText = 'Call Back'
                        statusIcon = (
                            <HiPhone className="text-base text-orange-600 mr-1 rtl:ml-1" />
                        )
                        statusClass =
                            'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100 border-0'
                    } else if (row.lead_status === 'scheduled_call_back') {
                        statusText = 'Scheduled call back'
                        statusIcon = (
                            <HiClock className="text-base text-yellow-600 mr-1 rtl:ml-1" />
                        )
                        statusClass =
                            'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-100 border-0'
                    } else if (row.lead_status === 'attended_event') {
                        statusText = 'Attended event'
                        statusIcon = (
                            <HiCheckCircle className="text-base text-emerald-600 mr-1 rtl:ml-1" />
                        )
                        statusClass =
                            'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0'
                    } else if (row.lead_status === 'registered_for_event') {
                        statusText = 'Registered for event'
                        statusIcon = (
                            <HiCalendar className="text-base text-blue-600 mr-1 rtl:ml-1" />
                        )
                        statusClass =
                            'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100 border-0'
                    } else if (row.lead_status === 'new_lead') {
                        statusText = 'New lead'
                        statusIcon = (
                            <HiPlusCircle className="text-base text-red-600 mr-1 rtl:ml-1" />
                        )
                        statusClass =
                            'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 border-0'
                    }
                    const sourceClass =
                        row.status_identifier === 'manual'
                            ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-100 border-0'
                            : row.status_identifier === 'landing_page'
                              ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100 border-0'
                              : row.status_identifier === 'bulk_import'
                                ? 'bg-violet-100 text-violet-600 dark:bg-violet-500/20 dark:text-violet-100 border-0'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-100 border-0'
                    const sourceIcon =
                        row.status_identifier === 'manual' ? (
                            <HiOutlineCursorClick className="text-base text-green-600 mr-1 rtl:ml-1" />
                        ) : row.status_identifier === 'landing_page' ? (
                            <HiOutlineGlobe className="text-base text-indigo-600 mr-1 rtl:ml-1" />
                        ) : row.status_identifier === 'bulk_import' ? (
                            <HiUserGroup className="text-base text-violet-600 mr-1 rtl:ml-1" />
                        ) : (
                            <HiPlusCircle className="text-base text-gray-600 mr-1 rtl:ml-1" />
                        )
                    const sourceText =
                        row.status_identifier === 'manual'
                            ? 'Manual'
                            : row.status_identifier === 'landing_page'
                              ? 'Landing page'
                              : row.status_identifier === 'bulk_import'
                                ? 'Bulk import'
                                : 'Unknown'

                    return (
                        <div className="flex items-center gap-1">
                            <Tag className={statusClass} prefix={statusIcon}>
                                <span className="capitalize">{statusText}</span>
                            </Tag>
                            <Tag className={sourceClass} prefix={sourceIcon}>
                                <span className="capitalize">{sourceText}</span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Tags',
                accessorKey: 'tags',
                cell: (props) => {
                    const row = props.row.original

                    const tags = row.tags.map((tag) => tag.tag)

                    return (
                        <div className="flex items-center gap-1">
                            <Tooltip
                                title={
                                    tags.length > 0
                                        ? tags.join(', ')
                                        : 'No tags'
                                }
                            >
                                <Tag
                                    className="bg-lime-100 text-lime-600 dark:bg-lime-500/20 dark:text-lime-100 border-0"
                                    prefix={
                                        <HiTag className="text-base text-lime-600 mr-1 rtl:ml-1" />
                                    }
                                >
                                    <span className="capitalize">
                                        {tags.length}
                                    </span>
                                </Tag>
                            </Tooltip>
                        </div>
                    )
                },
            },
            {
                header: 'Event',
                accessorKey: 'events',
                cell: (props) => {
                    const row = props.row.original

                    if (row.lead_status === 'new_lead') {
                        return (
                            <Tag
                                className="bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-100 border-0"
                                prefix={
                                    <HiXCircle className="text-base text-gray-600 mr-1 rtl:ml-1" />
                                }
                            >
                                <span className="capitalize">
                                    No Event Registered
                                </span>
                            </Tag>
                        )
                    }

                    const eventName =
                        row.events[0]?.event_name || 'Unknown Event'

                    return (
                        <div className="flex items-center">
                            <Tag
                                className="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-100 border-0"
                                prefix={
                                    <HiTicket className="text-base text-purple-600 mr-1 rtl:ml-1" />
                                }
                            >
                                <span className="capitalize">
                                    {eventName}{' '}
                                    {row.metadata?.dates &&
                                    row.metadata?.dates.length > 0
                                        ? ' - ' +
                                          dayjs(
                                              Number(row.metadata?.dates[0]) *
                                                  1000,
                                          ).format('MMMM D, YYYY h:mm A')
                                        : ''}
                                </span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Registered',
                accessorKey: 'created_at',
                cell: (props) => {
                    const { created_at } = props.row.original
                    return (
                        <span className="font-semibold">
                            {created_at
                                ? dayjs(created_at).format(
                                      'MMMM D, YYYY h:mm A',
                                  )
                                : ''}
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onDelete={() => handleDelete(props.row.original)}
                    />
                ),
            },
        ],

        [],
    )

    const handleSetTableData = (data: TableQueries) => {
        setTableData(data)
        if (selectedLead.length > 0) {
            setSelectAllLead([])
        }
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

    const handleRowSelect = (checked: boolean, row: LeadListItem) => {
        setSelectedLead(checked, row)
    }

    const handleAllRowSelect = (
        checked: boolean,
        rows: Row<LeadListItem>[],
    ) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllLead(originalRows)
        } else {
            setSelectAllLead([])
        }
    }

    const handleRowClick = (row: LeadListItem) => {
        navigate(`/concepts/lead/lead-edit/${row.id}`)
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={leadList}
                noData={!isLoading && leadList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: leadListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedLead.some((selected) => selected.id === row.id)
                }
                indeterminateCheckboxChecked={(rows) =>
                    rows.length === selectedLead.length
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
                onRowClick={handleRowClick}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove lead"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove this lead? This action
                    can&apos;t be undone.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LeadListTable
