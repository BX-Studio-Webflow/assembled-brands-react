import { useMemo } from 'react'
import Table from '@/components/ui/Table'
import FileSegment from './FileSegment'
import FileRow from './FileRow'
import type { Asset } from '@/@types/asset'
import type { Layout } from '../store/useFileManagerStore'

type FileListProps = {
    fileList: Asset[]
    layout: Layout
    onRename: (id: string) => void
    onDelete: (id: string) => void
    onClick: (id: string) => void
}

const { TBody, THead, Th, Tr } = Table

const FileList = (props: FileListProps) => {
    const { layout, fileList, onDelete, onRename, onClick } = props

    // Group assets by type
    const groupedAssets = useMemo(() => {
        const groups: Record<string, Asset[]> = {
            video: [],
            image: [],
            audio: [],
            document: [],
        }

        fileList.forEach((asset) => {
            if (asset.asset_type === 'profile_picture') {
                // Group profile pictures with regular images
                groups.image.push(asset)
            } else if (groups[asset.asset_type]) {
                groups[asset.asset_type].push(asset)
            }
        })

        return groups
    }, [fileList])

    const renderFileSegment = (list: Asset[]) => (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4 lg:gap-6">
            {list.map((file) => (
                <FileSegment
                    key={file.id}
                    fileType={file.asset_type}
                    size={Number(file.asset_size)}
                    name={file.asset_name}
                    mediaconvert_job_status={file.mediaconvert_job_status}
                    mediaconvert_job_progress={file.mediaconvert_job_progress}
                    onClick={() => onClick(file.id.toString())}
                    onDelete={() => onDelete(file.id.toString())}
                    onRename={() => onRename(file.id.toString())}
                />
            ))}
        </div>
    )

    const renderFileRow = (list: Asset[]) => (
        <Table className="mt-4">
            <THead>
                <Tr>
                    <Th>File</Th>
                    <Th>Size</Th>
                    <Th>Type</Th>
                    <Th>Status</Th>
                    <Th>Progress</Th>
                    <Th></Th>
                </Tr>
            </THead>
            <TBody>
                {list.map((file) => (
                    <FileRow
                        key={file.id}
                        fileType={file.asset_name.split('.').pop()}
                        size={Number(file.asset_size)}
                        name={file.asset_name}
                        content_type={file.content_type}
                        mediaconvert_job_status={file.mediaconvert_job_status}
                        mediaconvert_job_progress={
                            file.mediaconvert_job_progress
                        }
                        onClick={() => onClick(file.id.toString())}
                        onDelete={() => onDelete(file.id.toString())}
                        onRename={() => onRename(file.id.toString())}
                    />
                ))}
            </TBody>
        </Table>
    )

    const renderAssetSection = (
        assetType: string,
        assets: Asset[],
        title: string,
    ) => {
        if (assets.length === 0) return null

        return (
            <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4 capitalize">
                    {title}
                </h4>
                {layout === 'grid' && renderFileSegment(assets)}
                {layout === 'list' && renderFileRow(assets)}
            </div>
        )
    }

    return (
        <div>
            {fileList.length > 0 && (
                <div>
                    {renderAssetSection('video', groupedAssets.video, 'Videos')}
                    {renderAssetSection('image', groupedAssets.image, 'Images')}
                    {renderAssetSection(
                        'audio',
                        groupedAssets.audio,
                        'Audio Files',
                    )}
                    {renderAssetSection(
                        'document',
                        groupedAssets.document,
                        'Documents',
                    )}
                </div>
            )}
        </div>
    )
}

export default FileList
