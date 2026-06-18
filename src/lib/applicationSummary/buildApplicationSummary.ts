import { getBusinessProfile } from '@/lib/api/businessProfile'
import {
    INVENTORY_LOCATION_OPTIONS,
    LOAN_AMOUNT_OPTIONS,
    US_STATE_OPTIONS,
} from '@/constants/options'
import type { User } from '@/types/auth'
import type { DealApplicationSummary } from '@/types/deal-application'
import type { FinancialDocument , FinancialWizardProgressResponse } from '@/types/financial-wizard'
import type { OnboardingProgressResponse } from '@/types/onboarding'


export type SummaryDocument = {
    label: string
    filename: string | null
    fileType: string | null
}

export type ApplicationSummaryData = {
    applicationId: string | null
    submittedAt: string | null
    status: string
    company: {
        name: string
        website: string
        industry: string
        yearsInBusiness: string
        headquarters: string
        contactName: string
        contactEmail: string
        contactPhone: string
    }
    funding: {
        requestedFacilityAmount: string
        intendedUseOfFunds: string
        fundingTimeline: string
    }
    financialReports: SummaryDocument[]
    inventoryLocation: {
        selection: string | null
        internationalLocation: string | null
    }
    accountsInventory: SummaryDocument[]
    ecommerce: SummaryDocument[]
    teamOwnership: {
        documents: SummaryDocument[]
        raisedExternalEquity: string | null
        capTable: SummaryDocument | null
    }
    optionalDocuments: SummaryDocument[]
}

const NOT_PROVIDED = 'Not Provided'

const COMPANY_TYPE_LABELS: Record<string, string> = {
    cpg: 'CPG Company',
    distributor_wholesaler: 'Distributor or Wholesaler',
    service_provider: 'Service Provider',
    other: 'Other',
}

function display(value: string | null | undefined): string {
    const trimmed = value?.trim()
    return trimmed ? trimmed : NOT_PROVIDED
}

function formatPhone(user: User | null): string {
    if (!user?.phone?.trim()) return NOT_PROVIDED
    const dial = user.dial_code?.trim()
    return dial ? `${dial} ${user.phone}` : user.phone
}

function stateLabel(code: string | null | undefined): string {
    if (!code?.trim()) return NOT_PROVIDED
    return (
        US_STATE_OPTIONS.find((option) => option.value === code)?.label ?? code
    )
}

function loanAmountLabel(value: string | null | undefined): string {
    if (!value?.trim()) return NOT_PROVIDED
    return (
        LOAN_AMOUNT_OPTIONS.find((option) => option.value === value)?.label ??
        value
    )
}

function inventoryLocationLabel(value: string | null | undefined): string | null {
    if (!value) return null
    return (
        INVENTORY_LOCATION_OPTIONS.find((option) => option.value === value)
            ?.label ?? value
    )
}

function fileExtension(filename: string): string {
    const parts = filename.split('.')
    if (parts.length < 2) return 'FILE'
    return parts.pop()!.toUpperCase()
}

function toSummaryDocument(
    label: string,
    doc: FinancialDocument | null | undefined,
): SummaryDocument {
    const filename = doc?.asset_name?.trim() ?? null
    return {
        label,
        filename,
        fileType: filename ? fileExtension(filename) : null,
    }
}

function findDocument(
    documents: FinancialDocument[],
    documentType: FinancialDocument['document_type'],
): FinancialDocument | null {
    return (
        documents.find(
            (doc) => doc.document_type === documentType && doc.is_current !== false,
        ) ?? null
    )
}

function collectDocuments(
    sources: FinancialDocument[],
    entries: Array<{
        label: string
        type: FinancialDocument['document_type']
    }>,
): SummaryDocument[] {
    return entries.map(({ label, type }) =>
        toSummaryDocument(label, findDocument(sources, type)),
    )
}

function formatSubmittedAt(value: string | null | undefined): string | null {
    if (!value) return null
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(date)
}

function resolveApplicationId(
    dealApplication: DealApplicationSummary | null,
    financialProgress: FinancialWizardProgressResponse | undefined,
): string | null {
    if (dealApplication) {
        return String(dealApplication.id)
    }
    const financialReports = financialProgress?.financial_reports
    const firstDoc = financialReports?.[0]
    if (firstDoc?.application_id) {
        return String(firstDoc.application_id)
    }
    return null
}

function resolveSubmittedAt(
    dealApplication: DealApplicationSummary | null,
    completedAt: string | null | undefined,
): string | null {
    if (completedAt) return formatSubmittedAt(completedAt)
    if (dealApplication?.status === 'submitted') {
        return formatSubmittedAt(
            dealApplication.updated_at ?? dealApplication.created_at,
        )
    }
    return formatSubmittedAt(new Date().toISOString())
}

export function buildApplicationSummary(params: {
    user: User | null
    onboarding: OnboardingProgressResponse | null | undefined
    financialProgress: FinancialWizardProgressResponse | undefined
    dealApplication: DealApplicationSummary | null
    completedAt?: string | null
}): ApplicationSummaryData {
    const { user, onboarding, financialProgress, dealApplication, completedAt } =
        params
    const step1 = onboarding?.step1
    const step2 = onboarding?.step2
    const step3 = onboarding?.step3
    const progressData = onboarding?.progress_data
    const business = getBusinessProfile(financialProgress)

    const financialReports = financialProgress?.financial_reports ?? []
    const accountsInventory = financialProgress?.accounts_inventory ?? []
    const ecommerce = financialProgress?.ecommerce_performance ?? []
    const teamOwnership = financialProgress?.team_ownership ?? []

    const industryRaw = step3?.company_type_other?.trim()
        ? step3.company_type_other
        : step3?.company_type
        ? (COMPANY_TYPE_LABELS[step3.company_type] ?? step3.company_type)
        : null

    const raisedExternalEquity = business?.raised_external_equity ?? null

    const headquartersState =
        step1?.incorporation_state ?? progressData?.incorporation_state
    const headquarters = business?.headquarters?.trim()
        ? business.headquarters
        : headquartersState?.trim()
          ? stateLabel(headquartersState)
          : NOT_PROVIDED

    return {
        applicationId: resolveApplicationId(dealApplication, financialProgress),
        submittedAt: resolveSubmittedAt(dealApplication, completedAt),
        status: 'Submitted',
        company: {
            name: display(
                step1?.legal_name ??
                    progressData?.legal_name ??
                    business?.legal_name,
            ),
            website: display(step1?.website),
            industry: display(industryRaw),
            yearsInBusiness: display(
                step2?.years_in_business ?? business?.year_formed,
            ),
            headquarters,
            contactName: display(
                user
                    ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
                    : null,
            ),
            contactEmail: display(user?.email ?? business?.email),
            contactPhone: formatPhone(user),
        },
        funding: {
            requestedFacilityAmount: loanAmountLabel(
                step2?.desired_loan_amount,
            ),
            intendedUseOfFunds: NOT_PROVIDED,
            fundingTimeline: NOT_PROVIDED,
        },
        financialReports: collectDocuments(financialReports, [
            {
                label: 'Monthly Income Statements',
                type: 'monthly_income_statement',
            },
            {
                label: 'Monthly Balance Sheets',
                type: 'monthly_balance_sheet',
            },
            {
                label: 'Forecasted Income Statement',
                type: 'income_statement_forecast',
            },
            {
                label: 'Forecasted Balance Sheet',
                type: 'balance_sheet_full_year_forecast',
            },
        ]),
        inventoryLocation: {
            selection: inventoryLocationLabel(business?.inventory_location),
            internationalLocation:
                business?.inventory_location === 'International'
                    ? business.international_location?.trim() || null
                    : null,
        },
        accountsInventory: collectDocuments(accountsInventory, [
            {
                label: 'Inventory Reports',
                type: 'monthly_inventory_report',
            },
            {
                label: 'Accounts Receivable Aging Reports',
                type: 'accounts_receivable_aging',
            },
            {
                label: 'Accounts Payable Aging Reports',
                type: 'accounts_payable_aging',
            },
        ]),
        ecommerce: collectDocuments(ecommerce, [
            {
                label: 'Shopify Monthly Sales Reports',
                type: 'shopify_sales_over_time',
            },
            {
                label: 'Shopify Repeat Customer Reports',
                type: 'shopify_first_vs_returning_customers',
            },
        ]),
        teamOwnership: {
            documents: collectDocuments(teamOwnership, [
                { label: 'Management Bios', type: 'management_bios' },
                { label: 'Investor Deck', type: 'investor_deck' },
            ]),
            raisedExternalEquity: raisedExternalEquity
                ? raisedExternalEquity === 'yes'
                    ? 'Yes'
                    : 'No'
                : null,
            capTable:
                raisedExternalEquity === 'yes'
                    ? toSummaryDocument(
                          'Capitalization Table',
                          findDocument(teamOwnership, 'cap_table'),
                      )
                    : null,
        },
        optionalDocuments: collectDocuments(teamOwnership, [
            {
                label: 'In-store Velocity Reports',
                type: 'instore_velocity_reports',
            },
            { label: 'Business Plan', type: 'business_plan' },
        ]),
    }
}
