import { apiGetEvents } from '@/services/EventService'
import useSWR from 'swr'
import { useEventListStore } from '../store/eventListStore'
import type { EventQueryParams } from '@/@types/events'

export default function useEventList() {
    const { tableData, filterData, setTableData, setFilterData } =
        useEventListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/events', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetEvents(params as EventQueryParams),
        {
            revalidateOnFocus: false,
        },
    )

    // Flatten the backend events array for the table
    const EventList = (data?.events || []).map((item) => ({
        ...item.event,
        asset: item.asset,
        host: item.host,
        memberships: item.memberships,
    }))

    const EventListTotal = data?.total || 0

    return {
        EventList,
        EventListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        setFilterData,
    }
}
