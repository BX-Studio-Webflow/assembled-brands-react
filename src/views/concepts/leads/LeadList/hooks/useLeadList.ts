import { apiGetLeads } from '@/services/LeadsService'
import useSWR from 'swr'
import { useLeadListStore } from '../store/leadListStore'
import type { LeadListItem } from '@/@types/lead'

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
        ([_, params]) => apiGetLeads<LeadListItem[]>(params),
        {
            revalidateOnFocus: false,
        },
    )

    const leadList = data || []

    const leadListTotal = data?.length || 0

    return {
        leadList,
        leadListTotal,
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
