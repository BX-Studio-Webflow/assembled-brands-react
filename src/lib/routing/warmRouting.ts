import type { FinancialWizardProgressResponse } from '@/types/financial-wizard'

const WARM_WIZARD_PAGE_TO_ROUTE = {
    'accounts-inventory': '/warm/finance-docs-accounts-and-inventory',
    'ecommerce-performance': '/warm/finance-docs-ecommerce-performance',
    'team-ownership': '/warm/finance-docs-team-and-ownership',
} as const

const FINANCIAL_WIZARD_PAGES_FOR_WARM = [
    'accounts-inventory',
    'ecommerce-performance',
    'team-ownership',
] as const

function isWarmWizardDocumentStepComplete(
    page: (typeof FINANCIAL_WIZARD_PAGES_FOR_WARM)[number],
    progress: FinancialWizardProgressResponse | null | undefined,
): boolean {
    if (!progress) return false

    switch (page) {
        case 'accounts-inventory':
            return progress.accounts_inventory.length > 0
        case 'ecommerce-performance':
            return progress.ecommerce_performance.length > 0
        case 'team-ownership':
            return progress.team_ownership.length > 0
        default:
            return false
    }
}

export function isWarmFinancialReportStepComplete(
    progress: FinancialWizardProgressResponse | null | undefined,
) {
    const reports = progress?.financial_reports ?? []
    return (
        reports.some((doc) => doc.document_type === 'monthly_balance_sheet') &&
        reports.some((doc) => doc.document_type === 'monthly_income_statement')
    )
}

export function isWarmForecastStepComplete(
    progress: FinancialWizardProgressResponse | null | undefined,
) {
    const reports = progress?.financial_reports ?? []
    return (
        reports.some(
            (doc) => doc.document_type === 'income_statement_forecast',
        ) &&
        reports.some(
            (doc) => doc.document_type === 'balance_sheet_full_year_forecast',
        )
    )
}

/** Picks the next warm-lead page after login / my-applications. */
export function resolveWarmDealApplicationPath(
    dealId: number,
    onboardingApplication?: { legal_name?: string | null } | null,
    financialProgress?: FinancialWizardProgressResponse | null,
): string {
    if (!onboardingApplication?.legal_name?.trim()) {
        return `/warm/onboarding-warm-lead?deal_id=${dealId}`
    }

    if (!isWarmFinancialReportStepComplete(financialProgress)) {
        return '/warm/finance-docs-financial-report'
    }

    if (!isWarmForecastStepComplete(financialProgress)) {
        return '/warm/finance-docs-forecasts'
    }

    for (const page of FINANCIAL_WIZARD_PAGES_FOR_WARM) {
        if (!isWarmWizardDocumentStepComplete(page, financialProgress)) {
            return WARM_WIZARD_PAGE_TO_ROUTE[page]
        }
    }

    return '/warm/finance-docs-optional-docs'
}
