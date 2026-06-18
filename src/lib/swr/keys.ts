export const swrKeys = {
    financialProgress: 'financial-progress',
    onboardingProgress: 'onboarding-progress',
    dealApplications: 'deal-applications',
    teamInvitations: 'team-invitations',
    myTeams: 'my-teams',
    sidebarProgress: 'sidebar-progress',
    companyProfileSeed: 'company-profile-seed',
} as const

export type SwrKey = (typeof swrKeys)[keyof typeof swrKeys]
