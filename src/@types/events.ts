export interface Event {
    event_name: string
    event_description: string
    instructions: string | null
    landing_page_url: string | null
    asset_id: number
    event_type: 'live_venue' | 'prerecorded' | 'live_video_call'
    status: 'active' | 'suspended' | 'cancelled'
    live_video_url: string | null
    calendar_url: string | null
    live_venue_address: string | null
    success_url: string | null
    membership_plans: MembershipPlan[]
}

export interface MembershipPlan {
    id: number
    name: string
    date: number
    payment_type: 'one_off' | 'recurring'
    cost: number
}

export interface GetEventsResponse {
    events: EventWithDetails[]
    total: number
}

export interface EventQueryParams {
    page?: number
    limit?: number
    search?: string
}

export interface EventWithDetails {
    event: EventDetails
    asset: Asset
    host: Host
    memberships: Membership[]
}

export interface EventDetails {
    id: number
    event_name: string
    event_description: string
    event_type: 'live_venue' | 'prerecorded' | 'live_video_call'
    asset_id: number
    created_at: string
    updated_at: string
    status: 'active' | 'suspended' | 'cancelled'
    live_video_url: string
    success_url: string
    instructions: string
    landing_page_url: string
    calendar_url: string
    live_venue_address: string
    host_id: number
}

export interface Asset {
    id: number
    asset_name: string
    asset_type: string
    content_type: string
    asset_url: string
    asset_size: number
    duration: number
    hls_url: string | null
    processing_status: string
    created_at: string
    updated_at: string
    user_id: number
}

export interface Host {
    name: string
    email: string
    profile_image: string
}

export interface Membership {
    id: number
    name: string
    description: string
    price: number
    payment_type: 'one_off' | 'recurring'
    price_point: string
    billing: string
    created_at: string
    updated_at: string
    user_id: number
}
