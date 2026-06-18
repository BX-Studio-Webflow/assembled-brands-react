import { mutate } from 'swr'
import { swrKeys } from '@/lib/swr/keys'

export function revalidateFinancialProgress() {
    return mutate(swrKeys.financialProgress)
}

export function revalidateOnboardingProgress() {
    return mutate(swrKeys.onboardingProgress)
}

export function revalidateCompanyProfileSeed() {
    return mutate(swrKeys.companyProfileSeed)
}

export function revalidateSidebarProgress() {
    return Promise.all([
        mutate(swrKeys.sidebarProgress),
        mutate(swrKeys.financialProgress),
    ])
}

export function revalidateTeamInvitations() {
    return mutate(swrKeys.teamInvitations)
}

export function revalidateDealApplications() {
    return mutate(swrKeys.dealApplications)
}

export function revalidateAfterFinancialSave() {
    return Promise.all([
        revalidateFinancialProgress(),
        revalidateSidebarProgress(),
        revalidateCompanyProfileSeed(),
    ])
}

export function revalidateAfterOnboardingSave() {
    return Promise.all([
        revalidateOnboardingProgress(),
        revalidateSidebarProgress(),
        revalidateCompanyProfileSeed(),
    ])
}
