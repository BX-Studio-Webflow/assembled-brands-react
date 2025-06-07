import { apiGetLeads } from '@/services/LeadsService'
import useSWR from 'swr'
import { useLeadListStore } from '../store/leadListStore'
import type { Lead } from '@/@types/lead'

export default function useLeadList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedLead,
        setSelectedLead,
        setSelectAllLead,
        setFilterData,
    } = useLeadListStore((state) => state)

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
        selectedLead,
        setSelectedLead,
        setSelectAllLead,
        setFilterData,
    }
}
