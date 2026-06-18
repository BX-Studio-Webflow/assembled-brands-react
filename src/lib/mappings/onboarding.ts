import type {
    OnboardingStep1Body,
    OnboardingStep2Body,
    OnboardingStep3Body,
} from '@/types/onboarding'

const EMPLOYEE_COUNT_MAP: Record<string, OnboardingStep1Body['employee_count']> = {
    'Just me': 'just_me',
    '2-10': '2-10',
    '11-50': '11-50',
    '51-100': '51-100',
    '101-500': '101-500',
    '501+': '501+',
}

const ASSET_TYPE_MAP: Record<string, OnboardingStep2Body['asset_type']> = {
    Inventory: 'inventory',
    'Accounts Receivable': 'accounts_receivable',
    'Purchase Orders': 'purchase_orders',
    'Not Sure': 'not_sure',
}

const COMPANY_TYPE_MAP: Record<string, OnboardingStep3Body['company_type']> = {
    'CPG Company': 'cpg',
    'Distributor or Wholesaler': 'distributor_wholesaler',
    'SaaS Company': 'service_provider',
    'Consulting Firm': 'service_provider',
    Other: 'other',
}

export function mapEmployeeCount(label: string) {
    return EMPLOYEE_COUNT_MAP[label]
}

export function mapAssetType(label: string) {
    return ASSET_TYPE_MAP[label]
}

export function mapCompanyType(label: string) {
    return COMPANY_TYPE_MAP[label]
}

export function isValidWebsite(url: string) {
    if (!url.trim()) return false
    try {
        const normalized = url.startsWith('http') ? url : `https://${url}`
        const parsed = new URL(normalized)
        return Boolean(parsed.hostname.includes('.'))
    } catch {
        return false
    }
}
