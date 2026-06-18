import useSWR from 'swr'
import { apiGetOnboardingProgress } from '@/services/OnboardingService'
import { swrKeys } from '@/lib/swr/keys'

export function useOnboardingProgress() {
    return useSWR(swrKeys.onboardingProgress, apiGetOnboardingProgress)
}
