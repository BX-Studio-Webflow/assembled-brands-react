import useSWR from 'swr'
import { apiGetMyDealApplications } from '@/services/DealApplicationService'
import { swrKeys } from '@/lib/swr/keys'

export function useDealApplications() {
    return useSWR(swrKeys.dealApplications, apiGetMyDealApplications)
}
