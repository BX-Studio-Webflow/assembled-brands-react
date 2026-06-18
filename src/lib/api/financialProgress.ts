import { apiGetFinancialProgress } from '@/services/FinancialWizardService'
import type { Business } from '@/types/business'
import type { FinancialWizardProgressResponse } from '@/types/financial-wizard'

export const emptyFinancialProgress = (
    business: Business | null | undefined = null,
): FinancialWizardProgressResponse => ({
    current_page: 'company-profile',
    is_complete: false,
    percentage: 0,
    company_profile: null,
    financial_overview: null,
    financial_reports: [],
    accounts_inventory: [],
    ecommerce_performance: [],
    team_ownership: [],
    business: business ?? null,
})

export function normalizeFinancialProgress(
    data:
        | FinancialWizardProgressResponse
        | { progress: null; business?: Business | null }
        | undefined,
): FinancialWizardProgressResponse | undefined {
    if (!data) return undefined
    if ('percentage' in data && typeof data.percentage === 'number') {
        return {
            ...emptyFinancialProgress(data.business),
            ...data,
            financial_reports: data.financial_reports ?? [],
            accounts_inventory: data.accounts_inventory ?? [],
            ecommerce_performance: data.ecommerce_performance ?? [],
            team_ownership: data.team_ownership ?? [],
        }
    }
    if ('progress' in data && data.progress === null) {
        return emptyFinancialProgress(data.business)
    }
    return undefined
}

export async function fetchFinancialProgress(userId?: string) {
    const data = await apiGetFinancialProgress(userId)
    return normalizeFinancialProgress(data) ?? emptyFinancialProgress()
}
