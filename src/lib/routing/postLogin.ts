import type { SignInResponse } from '@/types/auth'
import type { FinancialWizardProgressResponse } from '@/types/financial-wizard'

const FINANCIAL_WIZARD_PAGES = [
    'company-profile',
    'financial-overview',
    'financial-reports',
    'accounts-inventory',
    'ecommerce-performance',
    'team-ownership',
] as const

const FINANCIAL_WIZARD_PAGE_TO_ROUTE: Record<
    (typeof FINANCIAL_WIZARD_PAGES)[number],
    string
> = {
    'company-profile': '/finance-company-profile',
    'financial-overview': '/finance-financial-overview',
    'financial-reports': '/finance-docs-financial-reports',
    'accounts-inventory': '/finance-docs-accounts-and-inventory',
    'ecommerce-performance': '/finance-docs-ecommerce-performance',
    'team-ownership': '/finance-docs-team-and-ownership',
}

function isFinancialWizardStepComplete(
    page: (typeof FINANCIAL_WIZARD_PAGES)[number],
    progress: FinancialWizardProgressResponse | null | undefined,
): boolean {
    if (!progress) return false

    switch (page) {
        case 'company-profile':
            return progress.company_profile !== null
        case 'financial-overview':
            return progress.financial_overview !== null
        case 'financial-reports':
            return progress.financial_reports.length > 0
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

export function getNextFinancialWizardStep(
    progress: FinancialWizardProgressResponse | null | undefined,
): string | null {
    if (!progress) {
        return '/finance-company-profile'
    }

    const currentPage = progress.current_page as
        | (typeof FINANCIAL_WIZARD_PAGES)[number]
    const currentPageIndex = FINANCIAL_WIZARD_PAGES.indexOf(currentPage)

    if (currentPageIndex === -1) {
        return '/finance-company-profile'
    }

    if (!isFinancialWizardStepComplete(currentPage, progress)) {
        return (
            FINANCIAL_WIZARD_PAGE_TO_ROUTE[currentPage] ??
            '/finance-company-profile'
        )
    }

    for (let i = currentPageIndex + 1; i < FINANCIAL_WIZARD_PAGES.length; i++) {
        const page = FINANCIAL_WIZARD_PAGES[i]
        if (!isFinancialWizardStepComplete(page, progress)) {
            return FINANCIAL_WIZARD_PAGE_TO_ROUTE[page]
        }
    }

    return null
}

/** Legacy login redirect logic from `pages/login/index.ts`. */
export function resolvePostLoginRoute(response: SignInResponse): string {
    const isTeamMemberOnly =
        response.teams &&
        response.teams.length > 0 &&
        response.teams.every((t) => t.role === 'member')

    if (isTeamMemberOnly) {
        return '/warm/finance-my-applications'
    }

    if (response.dealApplications && response.dealApplications.length > 0) {
        return '/warm/finance-my-applications'
    }

    const currentOnboardingStep = response.onboardingProgress?.current_step
    const onboardingIsComplete = response.onboardingProgress?.is_complete

    if (!response.onboardingProgress) {
        return '/onboarding-wizard?step=start'
    }
    if (!onboardingIsComplete && currentOnboardingStep === 1) {
        return '/onboarding-wizard'
    }
    if (!onboardingIsComplete && currentOnboardingStep === 2) {
        return '/onboarding-wizard?step=2'
    }
    if (!onboardingIsComplete && currentOnboardingStep === 3) {
        return '/onboarding-wizard?step=step-3'
    }

    const nextFinancialWizardStep = getNextFinancialWizardStep(
        response.financialWizardProgress,
    )
    if (nextFinancialWizardStep) {
        return nextFinancialWizardStep
    }

    return '/warm/invite-team-members'
}

export function isValidEmail(email: string) {
    if (!email) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
