import type { FinancialDocumentBody } from '@/types/financial-wizard'
import {
    COLD_DOCUMENT_FORMAT_LABEL,
    COLD_DOCUMENT_INVALID_MESSAGE,
    COLD_DOCUMENT_MIME_TYPES,
} from '@/lib/validation/documents'
import {
    WARM_LEAD_BUSINESS_PLAN_ACCEPT,
    WARM_LEAD_BUSINESS_PLAN_FORMAT_LABEL,
    WARM_LEAD_BUSINESS_PLAN_INVALID_MESSAGE,
    WARM_LEAD_BUSINESS_PLAN_MIME_TYPES,
    WARM_LEAD_CAP_TABLE_INVALID_MESSAGE,
    WARM_LEAD_EXCEL_ACCEPT,
    WARM_LEAD_EXCEL_FORMAT_LABEL,
    WARM_LEAD_EXCEL_INVALID_MESSAGE,
    WARM_LEAD_EXCEL_MIME_TYPES,
    WARM_LEAD_INSTORE_VELOCITY_ACCEPT,
    WARM_LEAD_INSTORE_VELOCITY_FORMAT_LABEL,
    WARM_LEAD_INSTORE_VELOCITY_INVALID_MESSAGE,
    WARM_LEAD_INSTORE_VELOCITY_MIME_TYPES,
    WARM_LEAD_TEAM_LEADERSHIP_ACCEPT,
    WARM_LEAD_TEAM_LEADERSHIP_FORMAT_LABEL,
    WARM_LEAD_TEAM_LEADERSHIP_INVALID_MESSAGE,
    WARM_LEAD_TEAM_LEADERSHIP_MIME_TYPES,
} from '@/lib/validation/warmLead'

export type DocumentUploadSectionConfig = {
    id: string
    label: string
    documentType: FinancialDocumentBody['document_type']
    formats?: string
    accept?: string
    allowedMimeTypes: readonly string[]
    invalidMessage: string
}

export type DocumentUploadPageConfig = {
    title: string
    page: FinancialDocumentBody['page']
    nextTo: string
    requireAll?: boolean
    sections: DocumentUploadSectionConfig[]
}

const coldMime = {
    allowedMimeTypes: COLD_DOCUMENT_MIME_TYPES,
    formats: COLD_DOCUMENT_FORMAT_LABEL,
    invalidMessage: COLD_DOCUMENT_INVALID_MESSAGE,
}

const warmExcel = {
    allowedMimeTypes: WARM_LEAD_EXCEL_MIME_TYPES,
    formats: WARM_LEAD_EXCEL_FORMAT_LABEL,
    accept: WARM_LEAD_EXCEL_ACCEPT,
    invalidMessage: WARM_LEAD_EXCEL_INVALID_MESSAGE,
}

export const coldFinancialReportsConfig: DocumentUploadPageConfig = {
    title: 'Financial Reports',
    page: 'financial-reports',
    nextTo: '/finance-docs-accounts-and-inventory',
    requireAll: true,
    sections: [
        {
            id: 'fr-balance-sheets',
            label: 'Monthly Balance Sheets ** Please provide monthly balance sheets for at least the last 24 months, or longer if possible.',
            documentType: 'monthly_balance_sheet',
            ...coldMime,
        },
        {
            id: 'fr-income-statements',
            label: 'Monthly Income Statements ** Monthly income statements for the last 24 months, or longer if possible.',
            documentType: 'monthly_income_statement',
            ...coldMime,
        },
        {
            id: 'fr-income-forecasts',
            label: 'Monthly Income Forecasts ** Please provide monthly income forecasts for the next 24 months, or longer if possible.',
            documentType: 'monthly_income_forecast',
            ...coldMime,
        },
    ],
}

export const coldAccountsInventoryConfig: DocumentUploadPageConfig = {
    title: 'Accounts & Inventory',
    page: 'accounts-inventory',
    nextTo: '/finance-docs-ecommerce-performance',
    requireAll: true,
    sections: [
        {
            id: 'ai-inventory',
            label: 'Monthly Inventory Reports ** Please provide inventory reports for at least the last 24 months, or longer if possible.',
            documentType: 'monthly_inventory_report',
            ...coldMime,
        },
        {
            id: 'ai-ar-aging',
            label: 'Accounts Receivable Aging Reports ** Please provide AR aging reports for the last 24 months, or longer if available.',
            documentType: 'accounts_receivable_aging',
            ...coldMime,
        },
        {
            id: 'ai-ap-aging',
            label: 'Accounts Payable Aging Report ** Please provide the accounts payable aging report for the next 24 months, or longer if possible.',
            documentType: 'accounts_payable_aging',
            ...coldMime,
        },
    ],
}

export const coldEcommerceConfig: DocumentUploadPageConfig = {
    title: 'E-Commerce Performance',
    page: 'ecommerce-performance',
    nextTo: '/finance-docs-team-and-ownership',
    requireAll: true,
    sections: [
        {
            id: 'ec-repeat-customers',
            label: 'Shopify Repeat Customer Reports ** Please provide reports on repeat customers for at least the last 24 months, or longer if possible.',
            documentType: 'shopify_repeat_customers',
            ...coldMime,
        },
        {
            id: 'ec-monthly-sales',
            label: 'Shopify Monthly Sales Reports ** Please provide monthly sales reports from Shopify for the last 24 months, or longer if available.',
            documentType: 'shopify_monthly_sales',
            ...coldMime,
        },
    ],
}

export const coldTeamOwnershipConfig: DocumentUploadPageConfig = {
    title: 'Team & Ownership',
    page: 'team-ownership',
    nextTo: '/invite-team-members',
    requireAll: true,
    sections: [
        {
            id: 'to-management-bios',
            label: 'Please upload the management bios for our team.',
            documentType: 'management_bios',
            ...coldMime,
        },
        {
            id: 'to-investor-deck',
            label: 'Please provide the most recent investor deck.',
            documentType: 'investor_deck',
            ...coldMime,
        },
        {
            id: 'to-cap-table',
            label: 'Please provide the most recent capitalization table.',
            documentType: 'cap_table',
            ...coldMime,
        },
    ],
}

export const warmFinancialReportsConfig: DocumentUploadPageConfig = {
    title: 'Financial Reports',
    page: 'financial-reports',
    nextTo: '/warm/finance-docs-forecasts',
    requireAll: true,
    sections: [
        {
            id: 'wl-balance-sheet',
            label: 'Monthly Balance Sheets',
            documentType: 'monthly_balance_sheet',
            ...warmExcel,
        },
        {
            id: 'wl-income-statement',
            label: 'Monthly Income Statements',
            documentType: 'monthly_income_statement',
            ...warmExcel,
        },
    ],
}

export const warmForecastsConfig: DocumentUploadPageConfig = {
    title: 'Financial Forecasts',
    page: 'financial-reports',
    nextTo: '/warm/finance-docs-accounts-and-inventory',
    requireAll: true,
    sections: [
        {
            id: 'wl-income-forecast',
            label: 'Income Statement Forecast',
            documentType: 'income_statement_forecast',
            ...warmExcel,
        },
        {
            id: 'wl-balance-forecast',
            label: 'Balance Sheet Full Year Forecast',
            documentType: 'balance_sheet_full_year_forecast',
            ...warmExcel,
        },
    ],
}

export const warmAccountsInventoryConfig: DocumentUploadPageConfig = {
    title: 'Accounts & Inventory',
    page: 'accounts-inventory',
    nextTo: '/warm/finance-docs-ecommerce-performance',
    requireAll: true,
    sections: [
        {
            id: 'ai-inventory',
            label: 'Monthly Inventory Reports',
            documentType: 'monthly_inventory_report',
            ...warmExcel,
        },
        {
            id: 'ai-ar-aging',
            label: 'Accounts Receivable Aging Reports',
            documentType: 'accounts_receivable_aging',
            ...warmExcel,
        },
        {
            id: 'ai-ap-aging',
            label: 'Accounts Payable Aging Report',
            documentType: 'accounts_payable_aging',
            ...warmExcel,
        },
    ],
}

export const warmEcommerceConfig: DocumentUploadPageConfig = {
    title: 'E-Commerce Performance',
    page: 'ecommerce-performance',
    nextTo: '/warm/finance-docs-team-and-ownership',
    requireAll: true,
    sections: [
        {
            id: 'ec-sales-over-time',
            label: 'Shopify Sales Over Time',
            documentType: 'shopify_sales_over_time',
            ...warmExcel,
        },
        {
            id: 'ec-first-vs-returning',
            label: 'Shopify First vs Returning Customers',
            documentType: 'shopify_first_vs_returning_customers',
            ...warmExcel,
        },
    ],
}

export const warmTeamOwnershipConfig: DocumentUploadPageConfig = {
    title: 'Team & Ownership',
    page: 'team-ownership',
    nextTo: '/warm/finance-docs-optional-docs',
    requireAll: false,
    sections: [
        {
            id: 'to-management-bios',
            label: 'Management bios',
            documentType: 'management_bios',
            allowedMimeTypes: WARM_LEAD_TEAM_LEADERSHIP_MIME_TYPES,
            formats: WARM_LEAD_TEAM_LEADERSHIP_FORMAT_LABEL,
            accept: WARM_LEAD_TEAM_LEADERSHIP_ACCEPT,
            invalidMessage: WARM_LEAD_TEAM_LEADERSHIP_INVALID_MESSAGE,
        },
        {
            id: 'to-investor-deck',
            label: 'Investor deck',
            documentType: 'investor_deck',
            allowedMimeTypes: WARM_LEAD_TEAM_LEADERSHIP_MIME_TYPES,
            formats: WARM_LEAD_TEAM_LEADERSHIP_FORMAT_LABEL,
            accept: WARM_LEAD_TEAM_LEADERSHIP_ACCEPT,
            invalidMessage: WARM_LEAD_TEAM_LEADERSHIP_INVALID_MESSAGE,
        },
        {
            id: 'to-cap-table',
            label: 'Cap table',
            documentType: 'cap_table',
            allowedMimeTypes: WARM_LEAD_EXCEL_MIME_TYPES,
            formats: WARM_LEAD_EXCEL_FORMAT_LABEL,
            accept: WARM_LEAD_EXCEL_ACCEPT,
            invalidMessage: WARM_LEAD_CAP_TABLE_INVALID_MESSAGE,
        },
    ],
}

export const warmOptionalDocsConfig: DocumentUploadPageConfig = {
    title: 'Optional Documents',
    page: 'team-ownership',
    nextTo: '/warm/invite-team-members',
    requireAll: false,
    sections: [
        {
            id: 'wl-instore-velocity',
            label: 'In-store velocity reports',
            documentType: 'instore_velocity_reports',
            allowedMimeTypes: WARM_LEAD_INSTORE_VELOCITY_MIME_TYPES,
            formats: WARM_LEAD_INSTORE_VELOCITY_FORMAT_LABEL,
            accept: WARM_LEAD_INSTORE_VELOCITY_ACCEPT,
            invalidMessage: WARM_LEAD_INSTORE_VELOCITY_INVALID_MESSAGE,
        },
        {
            id: 'wl-business-plan',
            label: 'Business plan',
            documentType: 'business_plan',
            allowedMimeTypes: WARM_LEAD_BUSINESS_PLAN_MIME_TYPES,
            formats: WARM_LEAD_BUSINESS_PLAN_FORMAT_LABEL,
            accept: WARM_LEAD_BUSINESS_PLAN_ACCEPT,
            invalidMessage: WARM_LEAD_BUSINESS_PLAN_INVALID_MESSAGE,
        },
    ],
}

export function getDocumentsForPage(
    progress: import('@/types/financial-wizard').FinancialWizardProgressResponse,
    page: FinancialDocumentBody['page'],
) {
    switch (page) {
        case 'financial-reports':
            return progress.financial_reports
        case 'accounts-inventory':
            return progress.accounts_inventory
        case 'ecommerce-performance':
            return progress.ecommerce_performance
        case 'team-ownership':
            return progress.team_ownership
        default:
            return []
    }
}
