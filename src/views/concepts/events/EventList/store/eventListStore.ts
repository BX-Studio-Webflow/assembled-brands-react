import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { EventItems, Filter } from '../types'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    search: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialFilterData: Filter = {
    eventType: 'all',
    sortOrder: 'desc',
}

export type EventListState = {
    tableData: TableQueries
    filterData: Filter
    EventList: EventItems
}

type EventListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
}

const initialState: EventListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    EventList: [],
}

export const useEventListStore = create<EventListState & EventListAction>(
    (set) => ({
        ...initialState,
        setFilterData: (payload) => set(() => ({ filterData: payload })),
        setTableData: (payload) => set(() => ({ tableData: payload })),
    }),
)
