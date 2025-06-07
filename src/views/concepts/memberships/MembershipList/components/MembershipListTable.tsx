import { useMemo, useState } from 'react'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useMembershipList from '../hooks/useMembershipList'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbTrash } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'
import type { Membership } from '@/@types/membership'
import { toast, Notification } from '@/components/ui'
import { apiDeleteMembership } from '@/services/MembershipService'

const paymentTypeColor: Record<string, string> = {
    one_off:
        'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    recurring: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
}

const NameColumn = ({ row }: { row: Membership }) => {
    return (
        <div className="flex items-center">
            <Link
                className={`hover:text-primary ml-2 rtl:mr-2 font-semibold text-gray-900 dark:text-gray-100`}
                to={`/concepts/memberships/membership-edit/${row.id}`}
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
            <Tooltip title="Delete">
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

const MembershipListTable = () => {
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState<number | ''>('')

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllMembership,
        setSelectedMembership,
        selectedMembership,
        mutate,
    } = useMembershipList()

    const handleEdit = (membership: Membership) => {
        navigate(`/concepts/memberships/membership-edit/${membership.id}`)
    }

    const handleDelete = (membership: Membership) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(membership.id)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleConfirmDelete = async () => {
        try {
            await apiDeleteMembership(Number(toDeleteId))
            toast.push(
                <Notification type="success">
                    Membership deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to delete membership. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setToDeleteId('')
        }
    }

    const columns: ColumnDef<Membership>[] = useMemo(
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
                header: 'Description',
                accessorKey: 'description',
                cell: (props) => {
                    return (
                        <span className="truncate max-w-[200px] block">
                            {props.row.original.description}
                        </span>
                    )
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    return <span>${props.row.original.price.toFixed(2)}</span>
                },
            },
            {
                header: 'Payment Type',
                accessorKey: 'payment_type',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center">
                            <Tag className={paymentTypeColor[row.payment_type]}>
                                <span className="capitalize">
                                    {row.payment_type}
                                </span>
                            </Tag>
                        </div>
                    )
                },
            },
            {
                header: 'Price Point',
                accessorKey: 'price_point',
            },
            {
                header: 'Created Date',
                accessorKey: 'created_at',
                cell: (props) => {
                    return (
                        <span>
                            {new Date(
                                props.row.original.created_at,
                            ).toLocaleDateString()}
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
        if (selectedMembership.length > 0) {
            setSelectAllMembership([])
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

    const handleRowSelect = (checked: boolean, row: Membership) => {
        setSelectedMembership(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Membership>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllMembership(originalRows)
        } else {
            setSelectAllMembership([])
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
                    selectedMembership.some(
                        (selected) => selected.id === row.id,
                    )
                }
                indeterminateCheckboxChecked={(rows) =>
                    rows.length === selectedMembership.length
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
                title="Remove membership"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this membership? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default MembershipListTable
