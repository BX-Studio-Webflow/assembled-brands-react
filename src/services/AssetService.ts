import ApiService from './ApiService'
import type {
    Asset,
    GetAssetsResponse,
    AssetQueryParams,
    CreateS3PresignedURlRequestParams,
} from '@/@types/asset'

export async function apiGetAssets(params?: AssetQueryParams) {
    return ApiService.fetchDataWithAxios<GetAssetsResponse>({
        url: '/asset',
        method: 'get',
        params,
    })
}

export async function apiGetAsset(id: number) {
    return ApiService.fetchDataWithAxios<Asset>({
        url: `/asset/${id}`,
        method: 'get',
    })
}

export async function apiCreateAsset(data: CreateS3PresignedURlRequestParams) {
    return ApiService.fetchDataWithAxios<Asset>({
        url: '/asset',
        method: 'post',
        data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function apiRenameAsset(id: number, newName: string) {
    return ApiService.fetchDataWithAxios<Asset>({
        url: `/asset/${id}/rename`,
        method: 'put',
        data: { name: newName },
    })
}

export async function apiDeleteAsset(id: number) {
    return ApiService.fetchDataWithAxios<void>({
        url: `/asset/${id}`,
        method: 'delete',
    })
}

export const apiCreateMultipartAsset = async (payload: {
    fileName: string
    contentType: string
    assetType: 'image' | 'video' | 'audio' | 'document' | 'profile_picture'
    fileSize: number
    duration: number
    partSize: number
}) => {
    const response = await ApiService.fetchDataWithAxios<{
        uploadId: string
        key: string
        presignedUrls: string[]
        asset: number
    }>({
        url: '/asset/multipart',
        method: 'post',
        data: payload,
    })
    return response
}

export const apiCompleteMultipartUpload = async (
    assetId: number,
    parts: Array<{ ETag: string; PartNumber: number }>,
) => {
    const response = await ApiService.fetchDataWithAxios<{ success: boolean }>({
        url: `/asset/${assetId}/complete`,
        method: 'post',
        data: { parts },
    })
    return response
}
