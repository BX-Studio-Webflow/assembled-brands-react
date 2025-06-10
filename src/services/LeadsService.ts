import ApiService from './ApiService'
import type {
    Lead,
    LeadSearchParams,
    Tag,
    TagAssignment,
    TagAssignmentBody,
    TagAssignmentResponse,
} from '@/@types/lead'

export async function apiGetLeads<T>(params?: Record<string, unknown>) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/lead',
        method: 'get',
        params,
    })
}

export async function apiGetLead<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/lead/${id}`,
        method: 'get',
    })
}

export async function apiCreateLead(data: Partial<Lead>) {
    return ApiService.fetchDataWithAxios<Lead>({
        url: '/v1/lead/tag',
        method: 'post',
        data,
    })
}

export async function apiCreateTagAssignment(data: TagAssignmentBody) {
    return ApiService.fetchDataWithAxios<TagAssignmentResponse>({
        url: '/lead/tag',
        method: 'post',
        data,
    })
}

export async function apiUpdateLead(id: string, data: Partial<Lead>) {
    return ApiService.fetchDataWithAxios<Lead>({
        url: `/lead/${id}`,
        method: 'put',
        data,
    })
}

export async function apiDeleteLead(id: string) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/lead/${id}`,
        method: 'delete',
    })
}

export async function apiSearchLeads(params: LeadSearchParams) {
    return ApiService.fetchDataWithAxios<Lead[]>({
        url: '/lead/search',
        method: 'post',
        data: params,
    })
}

export async function apiGetUniqueLeads() {
    return ApiService.fetchDataWithAxios<Lead[]>({
        url: '/lead/unique-leads',
        method: 'post',
    })
}

export async function apiDeleteTag(id: string, leadId: string) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/lead/tag/${id}/lead/${leadId}`,
        method: 'delete',
    })
}

export async function apiUnassignTag(tagId: string, leadId: string) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/lead/tag/${tagId}/lead/${leadId}`,
        method: 'delete',
    })
}

export async function apiAssignTag(data: TagAssignment) {
    return ApiService.fetchDataWithAxios<void>({
        url: '/lead/tag/assign',
        method: 'post',
        data,
    })
}

// External form and membership purchase
export async function apiValidateEventLink(data: { event_id: string }) {
    return ApiService.fetchDataWithAxios<{ valid: boolean }>({
        url: '/lead/lead-validate-event',
        method: 'post',
        data,
    })
}

export async function apiValidateTicketPayment(data: { event_id: string }) {
    return ApiService.fetchDataWithAxios<{ valid: boolean }>({
        url: '/lead/validate-ticket-payment',
        method: 'post',
        data,
    })
}

export async function apiHandleExternalForm(data: Partial<Lead>) {
    return ApiService.fetchDataWithAxios<Lead>({
        url: '/lead/external-form',
        method: 'post',
        data,
    })
}

export async function apiPurchaseMembership(data: {
    membership_id: string
    lead_id: string
}) {
    return ApiService.fetchDataWithAxios<Lead>({
        url: '/lead/purchase-membership',
        method: 'post',
        data,
    })
}
