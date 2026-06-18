import type { Business, UpdateBusinessRequest } from '@/types/business'
import type { FinancialWizardProgressResponse } from '@/types/financial-wizard'

export function getBusinessProfile(
    progress: FinancialWizardProgressResponse | undefined,
): Business | null {
    return progress?.company_profile ?? progress?.business ?? null
}

export function buildBusinessUpdatePayload(
    profile: Business,
    patch: Partial<
        Pick<
            UpdateBusinessRequest,
            | 'inventory_location'
            | 'international_location'
            | 'raised_external_equity'
        >
    >,
): UpdateBusinessRequest {
    return {
        legal_name: profile.legal_name,
        headquarters: profile.headquarters ?? '',
        description: profile.description ?? '',
        year_formed: profile.year_formed ?? '',
        accounting_software: profile.accounting_software || 'other',
        other_accounting_software: profile.other_accounting_software ?? '',
        inventory_location: patch.inventory_location ?? profile.inventory_location ?? undefined,
        international_location:
            patch.inventory_location === 'International'
                ? (patch.international_location ?? profile.international_location ?? '')
                : profile.international_location ?? '',
        raised_external_equity:
            patch.raised_external_equity ?? profile.raised_external_equity ?? undefined,
    }
}
