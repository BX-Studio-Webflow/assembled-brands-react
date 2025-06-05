export type Order = {
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
    asset?: any
    host?: any
    memberships?: any[]
}

export type Orders = Order[]

export type Filter = {
    date: [Date, Date]
    status: string
    paymentMethod: string[]
}

export type GetOrdersResponse = {
    list: Orders
    total: number
}
