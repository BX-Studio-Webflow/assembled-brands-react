export interface Lead {
    id: number
    name: string
    email: string
    phone: string
    dial_code: string
    event_id: number | null
    registered_date: string | null
    membership_active: boolean
    form_identifier: string | null
    host_id: number
    token: string
    status_identifier: string
    lead_status: string | null
    source_url: string | null
    membership_level: string | null
    attended_event: boolean
    notes: string | null
    created_at: string
    updated_at: string
    events: Event[]
    date_array: number[] | null
    metadata: {
        event_name: string
        dates: number[]
    } | null
    membership: Membership | null
    callback: Callback | null
    tags: {
        id: number
        tag_id: number
        lead_id: number
        created_at: string
        updated_at: string
        tag: {
            id: number
            host_id: number
            tag: string
            created_at: string
            updated_at: string
        }
    }[]
    hostTags: {
        id: number
        host_id: number
        tag: string
        created_at: string
        updated_at: string
    }[]
    payments: {
        id: number
        contact_id: number
        lead_id: number
        event_id: number
        membership_id: number
        stripe_customer_id: string
        checkout_session_id: string
        amount: string
        currency: string
        status: string
        payment_type: string
        metadata: {
            dates?: number[]
            eventName?: string
            sessionId?: string
            membershipName?: string
        }
        created_at: string
        updated_at: string
    }[]
    bookings: {
        id: number
        lead_id: number
        host_id: number
        event_id: number
        membership_id: number
        metadata: {
            dates: number[]
            eventName: string
            membershipName: string
        }
        created_at: string
        updated_at: string
        event: {
            id: number
            event_name: string
            event_description: string
            status: string
            created_at: string
            updated_at: string
        }
    }[]
    dates?: {
        id: number
        date: string
        membership_id: number
        created_at: string
        updated_at: string
    }
}

export interface ParsedLead {
    name: string
    email: string
    phone: string
    dial_code: string
}

export interface Event {
    id: number
    event_name: string
    event_description: string
    event_type: string
    asset_id: number
    created_at: string
    updated_at: string
    status: string
    live_video_url: string
    success_url: string
    instructions: string
    landing_page_url: string
    live_venue_address: string
    host_id: number
}

export interface Membership {
    id: number
    name: string
    description: string
    price: number
    created_at: string
    updated_at: string
    host_id: number
}

export interface Callback {
    id: number
    lead_id: number
    scheduled_at: string
    status: string
    created_at: string
    updated_at: string
}

export interface Tag {
    id: string
    tag: string
    color?: string
    host_id: number
    created_at?: string
    updated_at?: string
}

export interface TagAssignment {
    tag_id: string
    lead_id: string
}

export interface TagAssignmentBody {
    lead_id: number
    tag: string
}

export interface CreateLeadRequestBody {
    name: string
    email: string
    phone: string
    dial_code: string
    event_id?: number
    host_id: number
    notes?: string
    
}

export interface CreateLeadBulkRequestBody {
    leads: CreateLeadRequestBody[]
    event_id?: number
}


export interface TagAssignmentResponse {
    id: number
    tag: string
}

export interface LeadSearchParams {
    query?: string
    status?: string
    event_id?: number
    host_id?: number
    tag_id?: string
    page?: number
    limit?: number
    sort_by?: string
    sort_order?: 'asc' | 'desc'
}

export interface LeadResponse {
    list: Lead[]
    total: number
}

export interface PurchaseMembershipResponse {
    success: boolean
    redirect_url: string
    message: string
}
