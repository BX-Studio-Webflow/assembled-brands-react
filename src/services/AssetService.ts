import type {
  AssetQuery,
  CompleteMultipartUploadBody,
  CompleteMultipartUploadResponse,
  CreateAssetBody,
  CreateAssetResponse,
  CreateMultipartAssetBody,
  CreateMultipartAssetResponse,
  DeleteAssetResponse,
  GetAssetResponse,
  GetAssetsResponse,
  RenameAssetBody,
  RenameAssetResponse,
  StartHlsConversionResponse,
} from '../types/asset';
import ApiService from './ApiService';

export const apiCreateAssetPresignedUrl = (data: CreateAssetBody) => {
  return ApiService.fetchDataWithAxios<CreateAssetResponse>({
    url: '/asset',
    method: 'post',
    data,
  });
};

export const apiGetAsset = (id: number) => {
  return ApiService.fetchDataWithAxios<GetAssetResponse>({
    url: `/asset/${id}`,
    method: 'get',
  });
};

export const apiGetAssets = (params?: AssetQuery) => {
  return ApiService.fetchDataWithAxios<GetAssetsResponse>({
    url: '/asset',
    method: 'get',
    params,
  });
};

export const apiCreateMultipartAsset = (data: CreateMultipartAssetBody) => {
  return ApiService.fetchDataWithAxios<CreateMultipartAssetResponse>({
    url: '/asset/multipart',
    method: 'post',
    data,
  });
};

export const apiCompleteMultipartUpload = (id: number, data: CompleteMultipartUploadBody) => {
  return ApiService.fetchDataWithAxios<CompleteMultipartUploadResponse>({
    url: `/asset/${id}/complete`,
    method: 'post',
    data,
  });
};

export const apiStartHlsConversion = (id: number) => {
  return ApiService.fetchDataWithAxios<StartHlsConversionResponse>({
    url: `/asset/${id}/start-hls-conversion`,
    method: 'post',
  });
};

export const apiRenameAsset = (id: number, data: RenameAssetBody) => {
  return ApiService.fetchDataWithAxios<RenameAssetResponse>({
    url: `/asset/${id}/rename`,
    method: 'put',
    data,
  });
};

export const apiDeleteAsset = (id: number) => {
  return ApiService.fetchDataWithAxios<DeleteAssetResponse>({
    url: `/asset/${id}`,
    method: 'delete',
  });
};

/** Step 2 of legacy document upload: PUT file bytes to S3 presigned URL. */
export function uploadToPresignedUrl(file: File, presignedUrl: string) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', presignedUrl)
    xhr.setRequestHeader('Content-Type', file.type)
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    }
    xhr.onerror = () => reject(new Error('Upload failed'))
    xhr.send(file)
  })
}
