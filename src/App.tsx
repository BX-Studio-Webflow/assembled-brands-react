import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from '@/lib/auth'
import ProtectedRoute from '@/components/layouts/ProtectedRoute'
import PortalLayout from '@/components/layouts/PortalLayout'

import Login from '@/pages/public/Login'
import GetStarted from '@/pages/public/GetStarted'
import AccountRecovery from '@/pages/public/AccountRecovery'
import ResetPassword from '@/pages/public/ResetPassword'
import QualifyIntro from '@/pages/public/QualifyIntro'
import QualifyStep1 from '@/pages/public/QualifyStep1'
import QualifyStep2 from '@/pages/public/QualifyStep2'
import QualifyStep3 from '@/pages/public/QualifyStep3'
import NotAFit from '@/pages/public/NotAFit'
import ClaimAccount from '@/pages/public/ClaimAccount'

import CompanyProfile from '@/pages/portal/CompanyProfile'
import FinancialOverview from '@/pages/portal/FinancialOverview'
import FinancialReports from '@/pages/portal/FinancialReports'
import AccountsInventory from '@/pages/portal/AccountsInventory'
import EcommercePerformance from '@/pages/portal/EcommercePerformance'
import TeamOwnership from '@/pages/portal/TeamOwnership'
import Support from '@/pages/portal/Support'
import InviteTeam from '@/pages/portal/InviteTeam'

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<Navigate replace to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/get-started" element={<GetStarted />} />
                    <Route path="/recover" element={<AccountRecovery />} />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Qualification funnel */}
                    <Route path="/apply" element={<QualifyIntro />} />
                    <Route path="/apply/step-1" element={<QualifyStep1 />} />
                    <Route path="/apply/step-2" element={<QualifyStep2 />} />
                    <Route path="/apply/step-3" element={<QualifyStep3 />} />
                    <Route path="/apply/not-a-fit" element={<NotAFit />} />
                    <Route path="/apply/claim" element={<ClaimAccount />} />

                    {/* Authenticated portal */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/app" element={<PortalLayout />}>
                            <Route
                                index
                                element={
                                    <Navigate
                                        replace
                                        to="/app/company-profile"
                                    />
                                }
                            />
                            <Route
                                path="company-profile"
                                element={<CompanyProfile />}
                            />
                            <Route
                                path="financial-overview"
                                element={<FinancialOverview />}
                            />
                            <Route
                                path="documents/financial-reports"
                                element={<FinancialReports />}
                            />
                            <Route
                                path="documents/accounts-inventory"
                                element={<AccountsInventory />}
                            />
                            <Route
                                path="documents/ecommerce"
                                element={<EcommercePerformance />}
                            />
                            <Route
                                path="documents/team-ownership"
                                element={<TeamOwnership />}
                            />
                            <Route path="support" element={<Support />} />
                            <Route path="invite" element={<InviteTeam />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<Navigate replace to="/login" />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
