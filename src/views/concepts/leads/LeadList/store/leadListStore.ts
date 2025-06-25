import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Filter } from '../types'
import type { Lead } from '@/@types/lead'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 50,
    search: '',
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

export type LeadsListState = {
    tableData: TableQueries
    filterData: Filter
    selectedLead: Lead[]
}

type LeadsListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedLead: (checked: boolean, customer: Lead) => void
    setSelectAllLead: (customer: Lead[]) => void
}

const initialState: LeadsListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedLead: [],
}

export const useLeadListStore = create<LeadsListState & LeadsListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
        setSelectedLead: (checked, row) =>
            set((state) => {
                const prevData = state.selectedLead
                if (checked) {
                    return { selectedLead: [...prevData, ...[row]] }
                } else {
                    if (prevData.some((prevLead) => row.id === prevLead.id)) {
                        return {
                            selectedLead: prevData.filter(
                                (prevLead) => prevLead.id !== row.id,
                            ),
                        }
                    }
                    return { selectedLead: prevData }
                }
            }),
        setSelectAllLead: (row) => set(() => ({ selectedLead: row })),
    }),
)
