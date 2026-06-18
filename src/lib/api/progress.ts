import { apiGetUserMe } from '@/services/AuthService'
import { apiGetFinancialProgress } from '@/services/FinancialWizardService'
import { apiGetOnboardingProgress } from '@/services/OnboardingService'
import { apiGetMyTeams } from '@/services/TeamService'
import type { User } from '@/types/auth'
import type { Business } from '@/types/business'
import type { FinancialWizardProgressResponse } from '@/types/financial-wizard'
import type { OnboardingProgressApiResponse } from '@/types/onboarding'
import type { MyTeam } from '@/types/team'
import { getStoredUser } from '@/lib/session'

const emptyFinancialProgress = (
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

function normalizeFinancialProgress(
    data:
        | FinancialWizardProgressResponse
        | { progress: null; business?: Business | null }
        | undefined,
): FinancialWizardProgressResponse | undefined {
    if (!data) return undefined
    if ('percentage' in data && typeof data.percentage === 'number') {
        return data
    }
    if ('progress' in data && data.progress === null) {
        return emptyFinancialProgress(data.business)
    }
    return undefined
}

/** Legacy `fetchProgressData` from shared/utils/helpers.ts */
export async function fetchProgressData(userId?: string) {
    const [financialResult, userResult, teamsResult, onboardingResult] =
        await Promise.allSettled([
            apiGetFinancialProgress(userId),
            apiGetUserMe(),
            apiGetMyTeams(),
            apiGetOnboardingProgress(),
        ])

    const financialProgress = normalizeFinancialProgress(
        financialResult.status === 'fulfilled'
            ? financialResult.value
            : undefined,
    )
    const user: User =
        userResult.status === 'fulfilled'
            ? userResult.value
            : (getStoredUser() ?? {
                  id: 0,
                  email: 'hello@company.com',
                  first_name: 'Full',
                  last_name: 'Name',
                  createdAt: '',
                  is_verified: false,
                  role: 'user',
                  phone: '',
                  dial_code: '',
                  profile_picture: '',
                  authority: [],
                  bio: null,
                  is_banned: false,
                  is_deleted: false,
                  stripe_connect_id: null,
                  subscription_status: null,
                  auth_provider: 'email',
              })
    const teams: MyTeam[] =
        teamsResult.status === 'fulfilled' ? teamsResult.value : []
    const onboardingProgress: OnboardingProgressApiResponse | undefined =
        onboardingResult.status === 'fulfilled'
            ? onboardingResult.value
            : undefined

    return { financialProgress, user, teams, onboardingProgress }
}

export async function fetchSidebarProgress(userId?: string) {
    const data = await fetchProgressData(userId)
    const percentage = data.financialProgress?.percentage ?? 0
    const fullName =
        `${data.user.first_name || 'Full'} ${data.user.last_name || 'Name'}`.trim()
    const isTeamMemberOnly =
        data.teams.length > 0 &&
        data.teams.every((team) => team.role === 'member')
    const userName = isTeamMemberOnly
        ? data.financialProgress?.business?.legal_name || fullName
        : fullName

    return {
        ...data,
        percentage,
        userName,
        userEmail: data.user.email || 'hello@company.com',
    }
}
