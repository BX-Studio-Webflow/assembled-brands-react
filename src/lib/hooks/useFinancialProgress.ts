import useSWR from 'swr'
import { apiGetFinancialProgress } from '@/services/FinancialWizardService'
import { swrKeys } from '@/lib/swr/keys'

export function useFinancialProgress() {
    return useSWR(swrKeys.financialProgress, apiGetFinancialProgress)
}
