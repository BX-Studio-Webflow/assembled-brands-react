import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from '@/lib/auth'
import ProtectedRoute from '@/components/layouts/ProtectedRoute'
import PortalLayout from '@/components/layouts/PortalLayout'

import Login from '@/pages/public/Login'
import GetStarted from '@/pages/public/GetStarted'
import AccountRecovery from '@/pages/public/AccountRecovery'
import ResetPassword from '@/pages/public/ResetPassword'
import AccountSetupFinishVerification from '@/pages/public/AccountSetupFinishVerification'
import OnboardingWizard from '@/pages/public/OnboardingWizard'
import NotAFit from '@/pages/public/NotAFit'
import OnboardingComplete from '@/pages/public/OnboardingComplete'
import ClaimAccount from '@/pages/public/ClaimAccount'
import ClaimAccountGetStarted from '@/pages/public/ClaimAccountGetStarted'

import CompanyProfile from '@/pages/portal/CompanyProfile'
import FinancialOverview from '@/pages/portal/FinancialOverview'
import FinancialReports from '@/pages/portal/FinancialReports'
import AccountsInventory from '@/pages/portal/AccountsInventory'
import EcommercePerformance from '@/pages/portal/EcommercePerformance'
import TeamOwnership from '@/pages/portal/TeamOwnership'
import Support from '@/pages/portal/Support'
import InviteTeam from '@/pages/portal/InviteTeam'

import OnboardingWarmLead from '@/pages/warm/OnboardingWarmLead'
import FinanceMyApplications from '@/pages/warm/FinanceMyApplications'
import FinanceDocsFinancialReport from '@/pages/warm/FinanceDocsFinancialReport'
import FinanceDocsForecasts from '@/pages/warm/FinanceDocsForecasts'
import FinanceDocsAccountsInventory from '@/pages/warm/FinanceDocsAccountsInventory'
import FinanceDocsEcommercePerformance from '@/pages/warm/FinanceDocsEcommercePerformance'
import FinanceDocsTeamOwnership from '@/pages/warm/FinanceDocsTeamOwnership'
import FinanceDocsOptionalDocs from '@/pages/warm/FinanceDocsOptionalDocs'
import WarmApplicationSubmitted from '@/pages/warm/WarmApplicationSubmitted'
import AcceptTeamInvitation from '@/pages/warm/AcceptTeamInvitation'

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate replace to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/register-get-started"
                        element={<GetStarted />}
                    />
                    <Route
                        path="/account-recovery"
                        element={<AccountRecovery />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route
                        path="/account-setup-finish-verification"
                        element={<AccountSetupFinishVerification />}
                    />
                    <Route
                        path="/warm/accept-team-invitation"
                        element={<AcceptTeamInvitation />}
                    />
                    <Route
                        path="/warm/onboarding-warm-lead"
                        element={<OnboardingWarmLead />}
                    />

                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/onboarding-wizard"
                            element={<OnboardingWizard />}
                        />
                        <Route
                            path="/onboarding-step-not-fit"
                            element={<NotAFit />}
                        />
                        <Route
                            path="/onboarding-complete"
                            element={<OnboardingComplete />}
                        />
                        <Route path="/claim-account" element={<ClaimAccount />} />
                        <Route
                            path="/claim-account-get-started"
                            element={<ClaimAccountGetStarted />}
                        />

                        <Route element={<PortalLayout />}>
                            <Route
                                path="/finance-company-profile"
                                element={<CompanyProfile />}
                            />
                            <Route
                                path="/finance-financial-overview"
                                element={<FinancialOverview />}
                            />
                            <Route
                                path="/finance-docs-financial-reports"
                                element={<FinancialReports />}
                            />
                            <Route
                                path="/finance-docs-accounts-and-inventory"
                                element={<AccountsInventory />}
                            />
                            <Route
                                path="/finance-docs-ecommerce-performance"
                                element={<EcommercePerformance />}
                            />
                            <Route
                                path="/finance-docs-team-and-ownership"
                                element={<TeamOwnership />}
                            />
                            <Route path="/support" element={<Support />} />
                            <Route
                                path="/invite-team-members"
                                element={<InviteTeam />}
                            />

                            <Route
                                path="/warm/finance-my-applications"
                                element={<FinanceMyApplications />}
                            />
                            <Route
                                path="/warm/finance-docs-financial-report"
                                element={<FinanceDocsFinancialReport />}
                            />
                            <Route
                                path="/warm/finance-docs-forecasts"
                                element={<FinanceDocsForecasts />}
                            />
                            <Route
                                path="/warm/finance-docs-accounts-and-inventory"
                                element={<FinanceDocsAccountsInventory />}
                            />
                            <Route
                                path="/warm/finance-docs-ecommerce-performance"
                                element={<FinanceDocsEcommercePerformance />}
                            />
                            <Route
                                path="/warm/finance-docs-team-and-ownership"
                                element={<FinanceDocsTeamOwnership />}
                            />
                            <Route
                                path="/warm/finance-docs-optional-docs"
                                element={<FinanceDocsOptionalDocs />}
                            />
                            <Route
                                path="/warm/application-submitted"
                                element={<WarmApplicationSubmitted />}
                            />
                            <Route
                                path="/warm/invite-team-members"
                                element={<InviteTeam />}
                            />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate replace to="/login" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
