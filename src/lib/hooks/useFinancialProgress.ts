import useSWR from 'swr'
import { fetchFinancialProgress } from '@/lib/api/financialProgress'
import { swrKeys } from '@/lib/swr/keys'

export function useFinancialProgress() {
    return useSWR(swrKeys.financialProgress, () => fetchFinancialProgress())
}
