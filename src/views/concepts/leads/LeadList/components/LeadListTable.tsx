import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useLeadList from '../hooks/useLeadList'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbTrash } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Lead } from '@/@types/lead'
import type { TableQueries } from '@/@types/common'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { apiDeleteLead } from '@/services/LeadsService'

const statusColor: Record<string, string> = {
    active: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    blocked: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: Lead }) => {
    return (
        <div className="flex items-center">
            <Avatar
                size={40}
                shape="circle"
                src={
                    'https://cdn.prod.website-files.com/6835c75868daca6e9cfac75f/6835c75968daca6e9cfac934_Testimonial%20Avatar%20(1).webp'
                }
            />
            <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                to={`/concepts/lead/lead-edit/${row.id}`}
            >
                {row.name}
            </Link>
        </div>
    )
}

const ActionColumn = ({
    onEdit,
    onDelete,
}: {
    onEdit: () => void
    onDelete: () => void
}) => {
    return (
        <div className="flex items-center gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
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
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllLead,
        setSelectedLead,
        selectedLead,
        mutate,
    } = useLeadList()

    const handleEdit = (customer: Lead) => {
        navigate(`/concepts/lead/lead-edit/${customer.id}`)
    }

    const handleDelete = (customer: Lead) => {
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

    const columns: ColumnDef<Lead>[] = useMemo(
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
                    return (
                        <div className="flex items-center">
                            <Tag
                                className={
                                    statusColor[row.lead_status || 'active']
                                }
                            >
                                <span className="capitalize">
                                    {row.lead_status || 'Active'}
                                </span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Created',
                accessorKey: 'created_at',
                cell: (props) => {
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
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onDelete={() => handleDelete(props.row.original)}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleRowSelect = (checked: boolean, row: Lead) => {
        setSelectedLead(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Lead>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllLead(originalRows)
        } else {
            setSelectAllLead([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={customerList}
                noData={!isLoading && customerList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: customerListTotal,
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
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LeadListTable
