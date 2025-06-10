export interface Asset {
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

export interface GetAssetsResponse {
    assets: Asset[]
    total: number
}

export interface AssetQueryParams {
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
