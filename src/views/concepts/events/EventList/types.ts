export type EventItem = {
    // Event fields
    id: number
    event_name: string
    event_description: string
    event_type: 'prerecorded' | 'live_venue' | 'live_video_call'
    asset_id: number
    created_at: string
    status: string
    live_video_url: string
    success_url: string
    instructions: string
    landing_page_url: string
    calendar_url: string | null
    live_venue_address: string
    updated_at: string
    host_id: number
    // Optionals for asset, host, memberships
    asset?: {
        asset_name: string
        asset_size: number
        asset_type: 'video' | 'image' | 'audio' | 'document'
        asset_url: string
        content_type: string
        created_at: string
        duration: number
        hls_url: string | null
        id: number
        processing_status: 'pending' | 'processing' | 'completed' | 'failed'
        updated_at: string
        user_id: number
    }
    host?: {
        email: string
        name: string
        profile_image: string | null
    }
    memberships?: {
        billing: string | null
        created_at: string
        description: string
        id: number
        name: string
        payment_type: 'one_off' | 'recurring'
        price: number
        price_point: string
        updated_at: string
        user_id: number
    }[]
}

export type EventItems = EventItem[]

export type Filter = {
    date: [Date, Date]
    eventType: string
    sortOrder: string
}

export type GetEventsResponse = {
    list: EventItem[]
    total: number
}
