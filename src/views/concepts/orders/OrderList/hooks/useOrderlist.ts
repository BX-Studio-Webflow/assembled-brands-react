import { apiGetEvents } from '@/services/EventService'
import useSWR from 'swr'
import { useOrderListStore } from '../store/orderListStore'
import type { EventQueryParams } from '@/@types/events'

export default function useOrderList() {
    const { tableData, filterData, setTableData, setFilterData } =
        useOrderListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/events', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetEvents(params as EventQueryParams),
        {
            revalidateOnFocus: false,
        },
    )

    // Flatten the backend events array for the table
    const orderList = (data?.events || []).map((item) => ({
        ...item.event,
        asset: item.asset,
        host: item.host,
        memberships: item.memberships,
    }))

    const orderListTotal = data?.total || 0

    return {
        orderList,
        orderListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        setFilterData,
    }
}
