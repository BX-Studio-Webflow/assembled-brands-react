import useSWR from 'swr'
import { fetchOnboardingProgress } from '@/lib/api/onboardingProgress'
import { swrKeys } from '@/lib/swr/keys'

export function useOnboardingProgress() {
    return useSWR(swrKeys.onboardingProgress, fetchOnboardingProgress)
}
