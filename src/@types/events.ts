import { Callback } from './lead'
import { LobbyTelemetry } from './telemetry'
import { Business } from './business'

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
    image_asset: Asset
    host: Host
    memberships: Membership[]
}

export interface EventDetails {
    id: number
    event_name: string
    event_description: string
    event_type: 'live_venue' | 'prerecorded' | 'live_video_call'
    asset_id: number
    image_asset_id: number
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
    hls_presigned_url?: string
    image_presigned_url?: string
}

export interface Host {
    name: string
    email: string
    profile_image: string
    phone: string
    dial_code: string
    role: 'host' | 'master' | 'owner'
    bio: string
    id: number
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
    dates: MembershipDate[]
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
    image_asset_id: number
    created_at: string
    updated_at: string
    status: 'active' | 'suspended' | 'cancelled' | 'ended'
    live_video_url: string
    success_url: string
    duration: number
    instructions: string
    landing_page_url: string
    calendar_url: string
    upgrade_url: string
    live_venue_address: string
    host_id: number
    asset: Asset
    host: Host
    business: Business
    leadCount: number
    memberships: MembershipWithDates[]
    attendance_stats: {
        event_attended: number
        event_not_attended: number
    }
    click_analytics: {
        clicks: Click[]
        clickCount: number
        scheduleCallbackCount: number
        upgradeCount: number
    }
    instant_callbacks: Callback[]
}

export interface Click {
    id: number
    lead_id: number
    event_id: number
    link_url: string
    clicked_at: string
    click_type: 'schedule_callback' | 'upgrade'
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
        membership_id: number
    }
    membership?: MembershipWithDates
    lobby_telemetry?: LobbyTelemetry[]
}

export type SaveInstantCallbackRequest = {
    lead_id: number
    event_id: number
    callback_type: 'instant' | 'scheduled'
    notes: string
    host_id: number
}

export type LivestreamStatus =
    | 'early'
    | 'live'
    | 'ended'
    | 'cancelled'
    | 'suspended'
