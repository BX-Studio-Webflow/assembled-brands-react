import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Upload from '@/components/ui/Upload'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import UploadMedia from '@/assets/svg/UploadMedia'
import { Progress } from '@/components/ui/Progress'
import { apiCreateAsset } from '@/services/AssetService'

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
    const [progress, setProgress] = useState(0)

    const handleUploadDialogClose = () => {
        setUploadDialogOpen(false)
        setUploadedFiles([])
        setProgress(0)
    }

    const handleUpload = async () => {
        if (uploadedFiles.length === 0) return
        const file = uploadedFiles[0]
        setIsUploading(true)
        setProgress(0)
        try {
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
            // Upload to S3
            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round(
                            (event.loaded / event.total) * 100,
                        )
                        setProgress(percent)
                    }
                })
                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        setProgress(100)
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
            setProgress(0)
        }
    }

    return (
        <>
            <Button variant="solid" onClick={() => setUploadDialogOpen(true)}>
                Upload
            </Button>
            <Dialog
                isOpen={uploadDialogOpen}
                onClose={handleUploadDialogClose}
                onRequestClose={handleUploadDialogClose}
            >
                <h4>Upload File</h4>
                <Upload
                    draggable
                    className="mt-6 bg-gray-100 dark:bg-transparent"
                    onChange={(files) => setUploadedFiles(files.slice(0, 1))}
                    onFileRemove={() => setUploadedFiles([])}
                    multiple={false}
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
                {isUploading && <Progress percent={progress} />}
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
