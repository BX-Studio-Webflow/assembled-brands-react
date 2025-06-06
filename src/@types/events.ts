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
    presignedUrl?: string
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

// Request type for creating an event
export interface CreateEventRequest {
    event_name: string
    event_description: string
    instructions?: string | null
    landing_page_url?: string | null
    asset_id: number
    event_type: 'live_venue' | 'prerecorded' | 'live_video_call'
    status: 'active' | 'suspended' | 'cancelled'
    live_video_url?: string | null
    calendar_url?: string | null
    live_venue_address?: string | null
    success_url?: string | null
    membership_plans: MembershipPlanRequest[]
}

export interface MembershipPlanRequest {
    id?: number
    name: string
    date: number
    payment_type: 'one_off' | 'recurring'
    cost: number
    isFree?: boolean
}

// Request type for updating an event (all fields optional except id in URL)
export type UpdateEventRequest = Partial<CreateEventRequest>

// Request type for cancelling an event
export interface CancelEventRequest {
    status: 'cancelled' | 'active' | 'suspended'
    id: number
}

// Request type for streaming a prerecorded event
export interface EventStreamRequest {
    event_id: number
    token?: string | null
    email?: string | null
    isHost?: boolean | null
}

// Response type for event memberships
export type EventMembershipsResponse = Membership[]

// Types for membership dates
export interface MembershipDate {
    id: number
    membership_id: number
    date: string
    created_at: string
    updated_at: string
    user_id: number
}

// Extended Membership interface with dates
export interface MembershipWithDates extends Membership {
    dates: MembershipDate[]
}

// Extended EventWithDetails interface with leadCount
export interface EventWithDetailsAndCount {
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
    asset: Asset
    host: Host
    leadCount: number
    memberships: MembershipWithDates[]
}

// Response type for streamPrerecordedEvent
export interface EventStreamResponse {
    event: EventWithDetailsAndCount
    isHost: boolean
    selectedDates?: MembershipDate[]
    lead?: {
        id: number
        email: string
        name: string
        created_at: string
        updated_at: string
    }
    membership?: MembershipWithDates
}

export type SaveInstantCallbackRequest = {
    lead_id: number
    event_id: number
    callback_type: 'instant' | 'scheduled'
    notes: string
    host_id: number
}
