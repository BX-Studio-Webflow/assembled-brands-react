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

export type MembershipsListState = {
    tableData: TableQueries
    filterData: Filter
    selectedMembership: Lead[]
}

type MembershipsListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedMembership: (checked: boolean, customer: Lead) => void
    setSelectAllMembership: (customer: Lead[]) => void
}

const initialState: MembershipsListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedMembership: [],
}

export const useMembershipListStore = create<
    MembershipsListState & MembershipsListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedMembership: (checked, row) =>
        set((state) => {
            const prevData = state.selectedMembership
            if (checked) {
                return { selectedMembership: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevMembership) => row.id === prevMembership.id)
                ) {
                    return {
                        selectedMembership: prevData.filter(
                            (prevMembership) => prevMembership.id !== row.id,
                        ),
                    }
                }
                return { selectedMembership: prevData }
            }
        }),
    setSelectAllMembership: (row) => set(() => ({ selectedMembership: row })),
}))
