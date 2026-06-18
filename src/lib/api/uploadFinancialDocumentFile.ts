import { apiCreateAssetPresignedUrl, uploadToPresignedUrl } from '@/services/AssetService'
import { apiUploadFinancialDocument } from '@/services/FinancialWizardService'
import type { CreateAssetBody } from '@/types/asset'
import type { FinancialDocumentBody } from '@/types/financial-wizard'
import { fileToBase64 } from '@/lib/utils/fileToBase64'

export async function uploadFinancialDocumentFile(
    file: File,
    page: FinancialDocumentBody['page'],
    documentType: FinancialDocumentBody['document_type'],
    allowedMimeTypes?: readonly string[],
) {
    if (allowedMimeTypes && !allowedMimeTypes.includes(file.type)) {
        throw new Error('Invalid file type for this upload')
    }

    const assetPayload: CreateAssetBody = {
        fileName: file.name,
        contentType: file.type,
        assetType: 'document',
        fileSize: file.size,
        duration: 0,
    }

    const assetResponse = await apiCreateAssetPresignedUrl(assetPayload)
    const assetId = assetResponse.asset.id
    const presignedUrl = assetResponse.presignedUrl

    if (!presignedUrl) {
        throw new Error('Presigned URL not received from server')
    }

    await uploadToPresignedUrl(file, presignedUrl)

    const documentPayload: FinancialDocumentBody = {
        page,
        document_type: documentType,
        asset_id: assetId,
        file_name: file.name,
        file_mime_type: file.type,
        file_data: await fileToBase64(file),
    }

    await apiUploadFinancialDocument(documentPayload)
}
