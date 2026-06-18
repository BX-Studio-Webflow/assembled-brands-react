import useSWR from 'swr'
import { fetchFinancialProgress } from '@/lib/api/financialProgress'
import { fetchOnboardingProgress } from '@/lib/api/onboardingProgress'
import { swrKeys } from '@/lib/swr/keys'

async function fetchCompanyProfileSeed() {
    const [financial, onboarding] = await Promise.all([
        fetchFinancialProgress(),
        fetchOnboardingProgress(),
    ])
    return { financial, onboarding }
}

export function useCompanyProfileSeed() {
    return useSWR(swrKeys.companyProfileSeed, fetchCompanyProfileSeed)
}
