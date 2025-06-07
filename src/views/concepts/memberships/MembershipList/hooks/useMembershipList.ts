import useSWR from 'swr'
import { useMembershipListStore } from '../store/membershipListStore'
import { apiGetMemberships } from '@/services/MembershipService'

export default function useMembershipList() {
    const {
        tableData,
        filterData,
        setTableData,
        selectedMembership,
        setSelectedMembership,
        setSelectAllMembership,
        setFilterData,
    } = useMembershipListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/membership', { ...tableData, ...filterData }],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ([_, params]) => apiGetMemberships(),
        {
            revalidateOnFocus: false,
        },
    )

    const customerList = data?.plans || []

    const customerListTotal = data?.total || 0

    return {
        customerList,
        customerListTotal,
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        setTableData,
        selectedMembership,
        setSelectedMembership,
        setSelectAllMembership,
        setFilterData,
    }
}
