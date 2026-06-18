import useSWR from 'swr'
import { apiGetFinancialProgress } from '@/services/FinancialWizardService'
import { apiGetOnboardingProgress } from '@/services/OnboardingService'
import { swrKeys } from '@/lib/swr/keys'

async function fetchCompanyProfileSeed() {
    const [financial, onboarding] = await Promise.all([
        apiGetFinancialProgress(),
        apiGetOnboardingProgress(),
    ])
    return { financial, onboarding }
}

export function useCompanyProfileSeed() {
    return useSWR(swrKeys.companyProfileSeed, fetchCompanyProfileSeed)
}
