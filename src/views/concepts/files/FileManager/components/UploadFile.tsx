import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Upload from '@/components/ui/Upload'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import UploadMedia from '@/assets/svg/UploadMedia'
import { Progress } from '@/components/ui/Progress'
import {
    apiCreateAsset,
    apiCreateMultipartAsset,
    apiCompleteMultipartUpload,
} from '@/services/AssetService'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB chunks
const LARGE_FILE_CHUNK_SIZE = 100 * 1024 * 1024 // 100MB chunks for files > 1GB

const getChunkSize = (fileSize: number) => {
    // For files larger than 1GB, use 100MB chunks
    if (fileSize > 1024 * 1024 * 1024) {
        return LARGE_FILE_CHUNK_SIZE
    }
    return CHUNK_SIZE
}

const getAssetType = (file: File) => {
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    return 'document'
}

const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src)
            resolve(Math.ceil(video.duration))
        }
        video.onerror = () => {
            URL.revokeObjectURL(video.src)
            reject(new Error('Failed to load video metadata'))
        }
        video.src = URL.createObjectURL(file)
    })
}

const UploadFile = ({ onUploadSuccess }: { onUploadSuccess?: () => void }) => {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [progressArr, setProgressArr] = useState<number[]>([])

    const handleUploadDialogClose = () => {
        setUploadDialogOpen(false)
        setUploadedFiles([])
        setProgressArr([])
        setIsUploading(false)
    }

    const uploadFileMultipart = async (file: File, idx: number) => {
        let duration = 0
        if (file.type.startsWith('video/')) {
            try {
                duration = await getVideoDuration(file)
            } catch {
                toast.push(
                    <Notification
                        title={'Could not get video duration'}
                        type="warning"
                    />,
                    { placement: 'top-center' },
                )
            }
        }

        const assetType = getAssetType(file) as
            | 'image'
            | 'video'
            | 'audio'
            | 'document'
            | 'profile_picture'
        const chunkSize = getChunkSize(file.size)
        const assetPayload = {
            fileName: file.name,
            contentType: file.type,
            assetType,
            fileSize: file.size,
            duration,
            partSize: chunkSize,
        }

        // Initiate multipart upload
        const { presignedUrls, asset } =
            await apiCreateMultipartAsset(assetPayload)
        const parts: { ETag: string; PartNumber: number }[] = []

        // Upload each part
        for (let i = 0; i < presignedUrls.length; i++) {
            const start = i * chunkSize
            const end = Math.min(start + chunkSize, file.size)
            const chunk = file.slice(start, end)

            const response = await fetch(presignedUrls[i], {
                method: 'PUT',
                body: chunk,
                headers: {
                    'Content-Type': file.type,
                },
            })

            if (!response.ok) {
                throw new Error(`Failed to upload part ${i + 1}`)
            }

            const etag = response.headers.get('ETag')
            if (!etag) {
                throw new Error(`No ETag received for part ${i + 1}`)
            }

            parts.push({ ETag: etag, PartNumber: i + 1 })

            // Update progress
            const percent = Math.round(((i + 1) / presignedUrls.length) * 100)
            setProgressArr((prev) => {
                const updated = [...prev]
                updated[idx] = percent
                return updated
            })
        }

        // Complete multipart upload
        await apiCompleteMultipartUpload(asset, parts)
        setProgressArr((prev) => {
            const updated = [...prev]
            updated[idx] = 100
            return updated
        })
    }

    const uploadFileDirect = async (file: File, idx: number) => {
        let duration = 0
        if (file.type.startsWith('video/')) {
            try {
                duration = await getVideoDuration(file)
            } catch {
                toast.push(
                    <Notification
                        title={'Could not get video duration'}
                        type="warning"
                    />,
                    { placement: 'top-center' },
                )
            }
        }

        const assetType = getAssetType(file)
        const assetPayload = {
            fileName: file.name,
            contentType: file.type,
            assetType,
            fileSize: file.size,
            duration,
        }

        const assetResp = await apiCreateAsset(assetPayload)
        const presignedUrl = assetResp.presignedUrl

        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round(
                        (event.loaded / event.total) * 100,
                    )
                    setProgressArr((prev) => {
                        const updated = [...prev]
                        updated[idx] = percent
                        return updated
                    })
                }
            })
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setProgressArr((prev) => {
                        const updated = [...prev]
                        updated[idx] = 100
                        return updated
                    })
                    resolve()
                } else {
                    reject(new Error('Failed to upload file to S3'))
                }
            })
            xhr.addEventListener('error', () => {
                reject(new Error('Network error during upload'))
            })
            xhr.open('PUT', presignedUrl)
            xhr.setRequestHeader('Content-Type', file.type)
            xhr.send(file)
        })
    }

    const handleUpload = async () => {
        if (uploadedFiles.length === 0) return
        setIsUploading(true)
        setProgressArr(Array(uploadedFiles.length).fill(0))
        try {
            // Limit to 10 files
            const filesToUpload = uploadedFiles.slice(0, 10)
            const uploadPromises = filesToUpload.map((file, idx) => {
                // Use multipart upload for files larger than 5MB
                if (file.size > CHUNK_SIZE) {
                    return uploadFileMultipart(file, idx)
                } else {
                    return uploadFileDirect(file, idx)
                }
            })

            await Promise.all(uploadPromises)
            toast.push(
                <Notification title={'Successfully uploaded'} type="success" />,
                { placement: 'top-center' },
            )
            if (onUploadSuccess) onUploadSuccess()
            handleUploadDialogClose()
        } catch (e: unknown) {
            toast.push(
                <Notification
                    title={e instanceof Error ? e.message : 'Upload failed'}
                    type="danger"
                />,
                { placement: 'top-center' },
            )
        } finally {
            setIsUploading(false)
            setProgressArr([])
        }
    }

    return (
        <>
            <Button variant="solid" onClick={() => setUploadDialogOpen(true)}>
                Upload
            </Button>
            <Dialog
                isOpen={uploadDialogOpen}
                shouldCloseOnOverlayClick={false}
                shouldCloseOnEsc={false}
                onRequestClose={handleUploadDialogClose}
                onClose={handleUploadDialogClose}
            >
                <h4>Upload File</h4>
                <Upload
                    draggable
                    multiple={true}
                    className="mt-6 bg-gray-100 dark:bg-transparent"
                    onChange={(files) => setUploadedFiles(files.slice(0, 10))}
                    onFileRemove={() => setUploadedFiles([])}
                >
                    <div className="my-4 text-center">
                        <div className="text-6xl mb-4 flex justify-center">
                            <UploadMedia height={150} width={200} />
                        </div>
                        <p className="font-semibold">
                            <span className="text-gray-800 dark:text-white">
                                Drop your file here, or{' '}
                            </span>
                            <span className="text-blue-500">browse</span>
                        </p>
                        <p className="mt-1 font-semibold opacity-60 dark:text-white">
                            through your machine
                        </p>
                    </div>
                </Upload>
                {isUploading && progressArr.length > 0 && (
                    <div className="mt-4 space-y-2">
                        {uploadedFiles.slice(0, 10).map((file, idx) => (
                            <div
                                key={file.name + idx}
                                className="flex items-center space-x-2"
                            >
                                <span className="truncate max-w-xs">
                                    {file.name.length > 10
                                        ? file.name.slice(0, 15) +
                                          '...' +
                                          file.name.slice(-5)
                                        : file.name}
                                </span>
                                <Progress
                                    percent={progressArr[idx] || 0}
                                    className="flex-1"
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-4">
                    <Button
                        block
                        loading={isUploading}
                        variant="solid"
                        disabled={uploadedFiles.length === 0 || isUploading}
                        onClick={handleUpload}
                    >
                        Upload
                    </Button>
                </div>
            </Dialog>
        </>
    )
}

export default UploadFile
