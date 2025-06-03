import { apiGetLeads } from '@/services/LeadsService'
import useSWR from 'swr'
import { useCustomerListStore } from '../store/customerListStore'
import type { Lead } from '@/@types/lead'

export default function useCustomerList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    } = useCustomerListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/lead', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetLeads<Lead[]>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const customerList = data || []

    const customerListTotal = data?.length || 0

    return {
        customerList,
        customerListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedCustomer,
        setSelectedCustomer,
        setSelectAllCustomer,
        setFilterData,
    }
}
