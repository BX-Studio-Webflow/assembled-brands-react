import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Events, Filter } from '../types'
import dayjs from 'dayjs'

export const initialTableData: TableQueries = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        Event: '',
        key: '',
    },
}

export const initialFilterData = {
    date: [dayjs().subtract(1, 'week').toDate(), new Date()] as [Date, Date],
    status: 'all',
    paymentMethod: ['Credit card', 'Debit card', 'Paypal', 'Stripe', 'Cash'],
}

export type EventListState = {
    tableData: TableQueries
    filterData: Filter
    EventList: Events
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
