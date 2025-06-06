export interface Podcast {
    id: number
    asset_name: string
    asset_type: string
    content_type: 'image' | 'video' | 'audio' | 'document' | 'profile_picture'
    asset_url: string
    asset_size: number
    duration: number
    hls_url: string | null
    processing_status: 'pending' | 'processing' | 'completed' | 'failed'
    created_at: string
    updated_at: string
    user_id: number
    presignedUrl: string
}

export interface PodcastDetails {
    podcast: {
        id: number
        title: string
        description: string
        cover_image_asset_id: number
        podcast_type: 'link' | 'prerecorded'
        episode_type: 'single' | 'multiple'
        host_id: number
        status: 'published' | 'draft'
        created_at: string
        updated_at: string
        link_url: string
        landing_page_url: string
    }
    cover: {
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
    host: {
        id: number
        name: string
        email: string
    }
    memberships: Array<{
        id: number
        name: string
        description: string
        price: number
        payment_type: 'one_off' | 'subscription'
        price_point: 'podcast' | 'episode'
        billing: 'per-day' | 'per-week' | 'per-month' | 'per-year'
        created_at: string
        updated_at: string
        user_id: number
    }>
    coverPresignedUrl: string
}

export interface GetPodcastsResponse {
    podcasts: PodcastDetails[]
    total: number
}

export interface PodcastQueryParams {
    page?: number
    limit?: number
    asset_type?: string
    search?: string
}

export interface CreateS3PresignedURlRequestParams {
    fileName: string
    contentType: string
    assetType: string
    fileSize: number
    duration: number
    [key: string]: unknown
}
