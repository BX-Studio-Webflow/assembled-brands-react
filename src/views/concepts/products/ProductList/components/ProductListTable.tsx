import { useMemo, useState } from 'react'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useProductList from '../hooks/useProductList'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router'
import { TbPencil, TbTrash } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { PodcastRow } from '../types'
import type { TableQueries } from '@/@types/common'
import Tag from '@/components/ui/Tag'

const ProductColumn = ({ row }: { row: PodcastRow }) => {
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

const ProductListTable = () => {
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

    const handleConfirmDelete = () => {
        const newProductList = productList.filter((podcast: PodcastRow) => {
            return !(toDeleteId === podcast.id)
        })
        setSelectAllProduct([])
        mutate(
            {
                list: newProductList,
                total: productListTotal - selectedProduct.length,
            },
            false,
        )
        setDeleteConfirmationOpen(false)
        setToDeleteId('')
    }

    const {
        productList,
        productListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllProduct,
        setSelectedProduct,
        selectedProduct,
        mutate,
    } = useProductList()

    const columns: ColumnDef<PodcastRow>[] = useMemo(
        () => [
            {
                header: 'Podcast',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return <ProductColumn row={row} />
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
        if (selectedProduct.length > 0) {
            setSelectAllProduct([])
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
        setSelectedProduct(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<PodcastRow>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllProduct(originalRows)
        } else {
            setSelectAllProduct([])
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
                    selectedProduct.some((selected) => selected.id === row.id)
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
                title="Remove products"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove this product? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default ProductListTable
