export interface Lead {
    id: number
    name: string
    email: string
    phone: string
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
    created_at: string
    updated_at: string
    events: Event[]
    membership: Membership | null
    callback: Callback | null
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
    name: string
    color?: string
    host_id: number
    created_at?: string
    updated_at?: string
}

export interface TagAssignment {
    tag_id: string
    lead_id: string
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
