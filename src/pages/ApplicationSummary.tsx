import { Link, useSearchParams } from 'react-router'
import PageHeader from '@/components/ui/PageHeader'
import PortalCard from '@/components/ui/PortalCard'
import PillButton from '@/components/ui/PillButton'
import DocumentStatusRow from '@/components/applicationSummary/DocumentStatusRow'
import SummaryFieldRow from '@/components/applicationSummary/SummaryFieldRow'
import SummarySection from '@/components/applicationSummary/SummarySection'
import FormPageSkeleton from '@/components/skeletons/FormPageSkeleton'
import { SUPPORT_URL } from '@/configs/navigation'
import { useAuth } from '@/lib/auth'
import { buildApplicationSummary } from '@/lib/applicationSummary/buildApplicationSummary'
import { useDealApplications } from '@/lib/hooks/useDealApplications'
import { useFinancialProgress } from '@/lib/hooks/useFinancialProgress'
import { useOnboardingProgress } from '@/lib/hooks/useOnboardingProgress'

export default function ApplicationSummary() {
    const [searchParams] = useSearchParams()
    const showSubmittedSuccess = searchParams.has('submitted-success')
    const { user } = useAuth()
    const { data: onboardingData, isLoading: onboardingLoading } =
        useOnboardingProgress()
    const { data: financialProgress, isLoading: financialLoading } =
        useFinancialProgress()
    const { data: dealData, isLoading: dealsLoading } = useDealApplications()

    const isLoading = onboardingLoading || financialLoading || dealsLoading

    if (isLoading) {
        return (
            <FormPageSkeleton
                title={
                    showSubmittedSuccess
                        ? 'Application Submitted!'
                        : 'Application Summary'
                }
                fields={6}
            />
        )
    }

    const dealId = localStorage.getItem('x-deal-id')
    const dealApplication =
        dealData?.applications.find(
            (app) =>
                dealId != null && app.deal_id.toString() === dealId,
        ) ??
        dealData?.applications[0] ??
        null

    const completedAt =
        typeof sessionStorage !== 'undefined'
            ? sessionStorage.getItem('application-submitted-at')
            : null

    const summary = buildApplicationSummary({
        user,
        onboarding: onboardingData?.progress,
        financialProgress,
        dealApplication,
        completedAt,
    })

    return (
        <>
            <PageHeader
                title={
                    showSubmittedSuccess
                        ? 'Application Submitted!'
                        : 'Application Summary'
                }
            />

            <div className="flex flex-col gap-[30px]">
                {showSubmittedSuccess && (
                    <PortalCard>
                        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-[20px]">
                            <p className="ab-serif text-ink">
                                Our underwriting team is already reviewing your
                                financial package.
                            </p>
                            <p className="ab-serif text-ink">
                                Your originator will reach out to discuss how we
                                can support your growth with our flexible,
                                scalable asset-based funding tailored to your
                                brand.
                            </p>
                            <p className="ab-serif text-ink">
                                Questions in the meantime? Drop us a line at{' '}
                                <a
                                    className="border-b border-ink text-ink"
                                    href="mailto:sales@assembledbrands.com"
                                >
                                    sales@assembledbrands.com
                                </a>
                                .
                            </p>
                        </div>
                    </PortalCard>
                )}

                <PortalCard>
                    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-[30px]">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="ab-h3">Application Overview</h2>
                            <PillButton
                                disabled
                                type="button"
                                title="Coming soon"
                                className="opacity-60"
                            >
                                Download Submission Summary
                            </PillButton>
                        </div>

                        <SummarySection title="Company Information">
                            <dl className="flex flex-col gap-[12px]">
                                <SummaryFieldRow
                                    label="Company Name"
                                    value={summary.company.name}
                                />
                                <SummaryFieldRow
                                    label="Website"
                                    value={summary.company.website}
                                />
                                <SummaryFieldRow
                                    label="Industry"
                                    value={summary.company.industry}
                                />
                                <SummaryFieldRow
                                    label="Years in Business"
                                    value={summary.company.yearsInBusiness}
                                />
                                <SummaryFieldRow
                                    label="Headquarters Location"
                                    value={summary.company.headquarters}
                                />
                                <SummaryFieldRow
                                    label="Primary Contact Name"
                                    value={summary.company.contactName}
                                />
                                <SummaryFieldRow
                                    label="Primary Contact Email"
                                    value={summary.company.contactEmail}
                                />
                                <SummaryFieldRow
                                    label="Primary Contact Phone"
                                    value={summary.company.contactPhone}
                                />
                            </dl>
                        </SummarySection>

                        <SummarySection title="Funding Information">
                            <dl className="flex flex-col gap-[12px]">
                                <SummaryFieldRow
                                    label="Requested Facility Amount"
                                    value={summary.funding.requestedFacilityAmount}
                                />
                                <SummaryFieldRow
                                    label="Intended Use of Funds"
                                    value={summary.funding.intendedUseOfFunds}
                                />
                                <SummaryFieldRow
                                    label="Funding Timeline"
                                    value={summary.funding.fundingTimeline}
                                />
                            </dl>
                        </SummarySection>

                        <SummarySection title="Financial Reports">
                            <div className="flex flex-col gap-3">
                                {summary.financialReports.map((document) => (
                                    <DocumentStatusRow
                                        key={document.label}
                                        document={document}
                                    />
                                ))}
                            </div>
                        </SummarySection>

                        <SummarySection title="Accounts & Inventory">
                            <dl className="mb-2 flex flex-col gap-[12px]">
                                <SummaryFieldRow
                                    label="Inventory Location Selection"
                                    value={
                                        summary.inventoryLocation.selection ??
                                        undefined
                                    }
                                />
                                {summary.inventoryLocation.selection ===
                                    'International / Outside US & Canada' && (
                                    <SummaryFieldRow
                                        label="International City/Country"
                                        value={
                                            summary.inventoryLocation
                                                .internationalLocation ??
                                            undefined
                                        }
                                    />
                                )}
                            </dl>
                            <div className="flex flex-col gap-3">
                                {summary.accountsInventory.map((document) => (
                                    <DocumentStatusRow
                                        key={document.label}
                                        document={document}
                                    />
                                ))}
                            </div>
                        </SummarySection>

                        <SummarySection title="E-commerce Performance">
                            <div className="flex flex-col gap-3">
                                {summary.ecommerce.map((document) => (
                                    <DocumentStatusRow
                                        key={document.label}
                                        document={document}
                                    />
                                ))}
                            </div>
                        </SummarySection>

                        <SummarySection title="Team & Ownership">
                            <div className="flex flex-col gap-3">
                                {summary.teamOwnership.documents.map(
                                    (document) => (
                                        <DocumentStatusRow
                                            key={document.label}
                                            document={document}
                                        />
                                    ),
                                )}
                            </div>
                            <dl className="flex flex-col gap-[12px]">
                                <SummaryFieldRow
                                    label="Has company raised external equity capital?"
                                    value={
                                        summary.teamOwnership
                                            .raisedExternalEquity ?? undefined
                                    }
                                />
                            </dl>
                            {summary.teamOwnership.capTable && (
                                <DocumentStatusRow
                                    document={summary.teamOwnership.capTable}
                                />
                            )}
                        </SummarySection>

                        <SummarySection title="Optional Documents">
                            <div className="flex flex-col gap-3">
                                {summary.optionalDocuments.map((document) => (
                                    <DocumentStatusRow
                                        key={document.label}
                                        document={document}
                                    />
                                ))}
                            </div>
                        </SummarySection>

                        <SummarySection title="Submission Metadata">
                            <dl className="flex flex-col gap-[12px]">
                                <SummaryFieldRow
                                    label="Application ID"
                                    value={summary.applicationId ?? undefined}
                                />
                                <SummaryFieldRow
                                    label="Submitted Date/Time"
                                    value={summary.submittedAt ?? undefined}
                                />
                                <SummaryFieldRow
                                    label="Current Status"
                                    value={summary.status}
                                />
                            </dl>
                        </SummarySection>
                    </div>
                </PortalCard>

                <PortalCard>
                    <div className="mx-auto flex w-full max-w-[720px] flex-col gap-[20px]">
                        <h2 className="ab-h5">Contact Support</h2>
                        <p className="ab-serif text-ink">
                            Need to update something or have a question about your
                            submission? Our team is here to help.
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <a
                                className="ab-label border-b border-ink text-ink"
                                href="mailto:sales@assembledbrands.com"
                            >
                                sales@assembledbrands.com
                            </a>
                            <a
                                href={SUPPORT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ab-label border-b border-ink text-ink"
                            >
                                Support center
                            </a>
                            <Link
                                to="/warm/invite-team-members"
                                className="ab-label border-b border-ink text-ink"
                            >
                                Invite team members
                            </Link>
                        </div>
                    </div>
                </PortalCard>
            </div>
        </>
    )
}
