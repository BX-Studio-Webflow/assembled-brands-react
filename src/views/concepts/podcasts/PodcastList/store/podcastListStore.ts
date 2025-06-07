import { create } from 'zustand'
import type { TableQueries } from '@/@types/common'
import type { Podcast, Filter } from '../types'

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
    minAmount: 0,
    maxAmount: 5000,
    productStatus: 'published',
    productType: ['Bags', 'Cloths', 'Devices', 'Shoes', 'Watches'],
}

export type PodcastsListState = {
    tableData: TableQueries
    filterData: Filter
    selectedPodcast: Partial<Podcast>[]
}

type PodcastsListAction = {
    setFilterData: (payload: Filter) => void
    setTableData: (payload: TableQueries) => void
    setSelectedPodcast: (checked: boolean, customer: Podcast) => void
    setSelectAllPodcast: (customer: Podcast[]) => void
}

const initialState: PodcastsListState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedPodcast: [],
}

export const usePodcastListStore = create<
    PodcastsListState & PodcastsListAction
>((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedPodcast: (checked, row) =>
        set((state) => {
            const prevData = state.selectedPodcast
            if (checked) {
                return { selectedPodcast: [...prevData, ...[row]] }
            } else {
                if (prevData.some((prevPodcast) => row.id === prevPodcast.id)) {
                    return {
                        selectedPodcast: prevData.filter(
                            (prevPodcast) => prevPodcast.id !== row.id,
                        ),
                    }
                }
                return { selectedPodcast: prevData }
            }
        }),
    setSelectAllPodcast: (row) => set(() => ({ selectedPodcast: row })),
}))
