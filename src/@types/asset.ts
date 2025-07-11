export interface Asset {
    id: number
    asset_name: string
    asset_type: 'image' | 'video' | 'audio' | 'document' | 'profile_picture'
    content_type: string // Allow any MIME type
    asset_url: string
    asset_size: string // Store as string to match backend
    duration: number
    hls_url: string | null
    processing_status: 'pending' | 'processing' | 'completed' | 'failed'
    upload_id?: string
    mediaconvert_job_id?: string
    mediaconvert_job_status?: 'pending' | 'processing' | 'completed' | 'failed'
    mediaconvert_job_progress?: number
    mediaconvert_job_current_phase?: string
    upload_status?: 'pending' | 'completed' | 'failed'
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
