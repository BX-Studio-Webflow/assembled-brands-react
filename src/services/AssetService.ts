import ApiService from './ApiService'
import type { Asset, GetAssetsResponse, AssetQueryParams } from '@/@types/asset'

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

export async function apiCreateAsset(data: FormData) {
    return ApiService.fetchDataWithAxios<Asset>({
        url: '/asset',
        method: 'post',
        data: data as unknown as Record<string, unknown>,
        headers: {
            'Content-Type': 'multipart/form-data',
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
