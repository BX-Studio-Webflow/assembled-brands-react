import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Filter } from '../types'
import type { Lead } from '@/@types/lead'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialFilterData = {
    purchasedProducts: '',
    purchaseChannel: [
        'Retail Stores',
        'Online Retailers',
        'Resellers',
        'Mobile Apps',
        'Direct Sales',
    ],
}

export type CustomersListState = {
    tableData: TableQueries
    filterData: Filter
    selectedCustomer: Lead[]
}

type CustomersListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedCustomer: (checked: boolean, customer: Lead) => void
    setSelectAllCustomer: (customer: Lead[]) => void
}

const initialState: CustomersListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedCustomer: [],
}

export const useCustomerListStore = create<
    CustomersListState & CustomersListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedCustomer: (checked, row) =>
        set((state) => {
            const prevData = state.selectedCustomer
            if (checked) {
                return { selectedCustomer: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevCustomer) => row.id === prevCustomer.id)
                ) {
                    return {
                        selectedCustomer: prevData.filter(
                            (prevCustomer) => prevCustomer.id !== row.id,
                        ),
                    }
                }
                return { selectedCustomer: prevData }
            }
        }),
    setSelectAllCustomer: (row) => set(() => ({ selectedCustomer: row })),
}))
