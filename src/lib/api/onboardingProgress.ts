import { apiGetOnboardingProgress } from '@/services/OnboardingService'
import type { OnboardingProgressApiResponse } from '@/types/onboarding'

function getErrorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'message' in err) {
        return String((err as { message: string }).message)
    }
    return ''
}

/** Cold qualify progress — absent for warm-only users; treat 400 as no application. */
export async function fetchOnboardingProgress(): Promise<
    OnboardingProgressApiResponse | undefined
> {
    try {
        return await apiGetOnboardingProgress()
    } catch (err) {
        const message = getErrorMessage(err)
        if (
            message.includes("can't find your application") ||
            message.includes('Have you started it yet')
        ) {
            return undefined
        }
        throw err
    }
}
