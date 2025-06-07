import { useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tag from '@/components/ui/Tag'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import useMembershipList from '../hooks/useMembershipList'
import { Link, useNavigate } from 'react-router'
import cloneDeep from 'lodash/cloneDeep'
import { TbPencil, TbEye } from 'react-icons/tb'
import type { OnSortParam, ColumnDef, Row } from '@/components/shared/DataTable'
import type { Lead } from '@/@types/lead'
import type { TableQueries } from '@/@types/common'

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
                to={`/concepts/customers/customer-details/${row.id}`}
            >
                {row.name}
            </Link>
        </div>
    )
}

const ActionColumn = ({
    onEdit,
    onViewDetail,
}: {
    onEdit: () => void
    onViewDetail: () => void
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
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
        </div>
    )
}

const MembershipListTable = () => {
    const navigate = useNavigate()

    const {
        customerList,
        customerListTotal,
        tableData,
        isLoading,
        setTableData,
        setSelectAllMembership,
        setSelectedMembership,
        selectedMembership,
    } = useMembershipList()

    const handleEdit = (customer: Lead) => {
        navigate(`/concepts/lead/lead-edit/${customer.id}`)
    }

    const handleViewDetails = (customer: Lead) => {
        navigate(`/concepts/lead/lead-details/${customer.id}`)
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
                header: 'Registered Date',
                accessorKey: 'registered_date',
                cell: (props) => {
                    return (
                        <span>
                            {props.row.original.registered_date || 'N/A'}
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
                        onViewDetail={() =>
                            handleViewDetails(props.row.original)
                        }
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

    const handleRowSelect = (checked: boolean, row: Lead) => {
        setSelectedMembership(checked, row)
    }

    const handleAllRowSelect = (checked: boolean, rows: Row<Lead>[]) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllMembership(originalRows)
        } else {
            setSelectAllMembership([])
        }
    }

    return (
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
                selectedMembership.some((selected) => selected.id === row.id)
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
    )
}

export default MembershipListTable
