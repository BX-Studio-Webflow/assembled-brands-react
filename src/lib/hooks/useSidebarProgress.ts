import useSWR from 'swr'
import { fetchSidebarProgress } from '@/lib/api/progress'
import { swrKeys } from '@/lib/swr/keys'

export function useSidebarProgress() {
    return useSWR(swrKeys.sidebarProgress, fetchSidebarProgress)
}
