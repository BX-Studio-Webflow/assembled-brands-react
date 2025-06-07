import { useMemo, useState } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import usePodcastList from '../hooks/usePodcastList'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router'
import { TbPencil, TbTrash } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { PodcastRow } from '../types'
import type { TableQueries } from '@/@types/common'
import Tag from '@/components/ui/Tag'
import { apiDeletePodcast } from '@/services/PodcastService'
import { toast, Notification } from '@/components/ui'

const PodcastColumn = ({ row }: { row: PodcastRow }) => {
    return (
        <div className="flex items-center gap-2">
            <div>
                <div className="font-bold heading-text mb-1">{row.name}</div>
            </div>
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
        <div className="flex items-center justify-end gap-3">
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

const PodcastListTable = () => {
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = (product: PodcastRow) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(product.id)
    }

    const handleEdit = (product: PodcastRow) => {
        navigate(`/concepts/podcasts/podcast-edit/${product.id}`)
    }

    const handleConfirmDelete = async () => {
        try {
            await apiDeletePodcast(Number(toDeleteId))
            toast.push(
                <Notification type="success">
                    Podcast deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate()
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to delete podcast. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setToDeleteId('')
        }
    }

    const {
        productList,
        productListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllPodcast,
        setSelectedPodcast,
        selectedPodcast,
        mutate,
    } = usePodcastList()

    const columns: ColumnDef<PodcastRow>[] = useMemo(
        () => [
            {
                header: 'Podcast',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <PodcastColumn row={row} />
                },
            },
            {
                header: 'Memberships',
                accessorKey: 'membershipNames',
                cell: (props) => {
                    const { membershipNames } = props.row.original
                    return (
                        <span className="font-semibold capitalize">
                            <span className="text-sm text-gray-500">
                                {membershipNames}
                            </span>
                        </span>
                    )
                },
            },

            {
                header: 'Episode Type',
                accessorKey: 'episodeType',
                cell: (props) => {
                    const { episodeType } = props.row.original
                    return (
                        <Tag
                            className={`${
                                episodeType === 'multiple'
                                    ? 'bg-emerald-100 text-emerald-600 dark:text-emerald-100 dark:bg-emerald-500/20'
                                    : 'bg-amber-100 text-amber-600 dark:text-amber-100 dark:bg-amber-500/20'
                            } border-0 capitalize`}
                        >
                            {episodeType}
                        </Tag>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    return (
                        <span className="font-semibold capitalize">
                            {status}
                        </span>
                    )
                },
            },
            {
                header: 'Created',
                accessorKey: 'createdAt',
                cell: (props) => {
                    const { createdAt } = props.row.original
                    return (
                        <span className="font-semibold">
                            {new Date(createdAt).toLocaleDateString()}
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
        if (selectedPodcast.length > 0) {
            setSelectAllPodcast([])
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

    const handleRowSelect = (checked: boolean, row: PodcastRow) => {
        setSelectedPodcast(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<PodcastRow>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllPodcast(originalRows)
        } else {
            setSelectAllPodcast([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={productList}
                noData={!isLoading && productList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: productListTotal,
                    pageIndex: tableData.pageIndex as number,
                    pageSize: tableData.pageSize as number,
                }}
                checkboxChecked={(row) =>
                    selectedPodcast.some((selected) => selected.id === row.id)
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
                title="Remove podcast"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove this podcast? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default PodcastListTable
