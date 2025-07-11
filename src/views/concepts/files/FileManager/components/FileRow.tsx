import Table from '@/components/ui/Table'
import FileType from './FileType'
import FileItemDropdown from './FileItemDropdown'
import fileSizeUnit from '@/utils/fileSizeUnit'
import FileIcon from '@/components/view/FileIcon'
import Tag from '@/components/ui/Tag'
import type { BaseFileItemProps } from '../types'

type FileRowProps = BaseFileItemProps & {
    content_type: string
    mediaconvert_job_status?: string
    mediaconvert_job_progress?: number
}

const { Tr, Td } = Table

const FileRow = (props: FileRowProps) => {
    const {
        fileType,
        size,
        name,
        content_type,
        mediaconvert_job_status,
        mediaconvert_job_progress,
        onClick,
        ...rest
    } = props

    const getStatusDisplay = () => {
        // Non-video types are completed by default
        if (fileType !== 'video') {
            return (
                <Tag className="text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-100 border-0">
                    Completed
                </Tag>
            )
        }

        if (mediaconvert_job_status === 'completed') {
            return (
                <Tag className="text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-100 border-0">
                    Completed
                </Tag>
            )
        }
        if (mediaconvert_job_status === 'processing') {
            return (
                <Tag className="text-blue-600 bg-blue-100 dark:bg-blue-500/20 dark:text-blue-100 border-0">
                    Processing
                </Tag>
            )
        }
        if (mediaconvert_job_status === 'failed') {
            return (
                <Tag className="text-red-600 bg-red-100 dark:bg-red-500/20 dark:text-red-100 border-0">
                    Failed
                </Tag>
            )
        }
        return (
            <Tag className="text-orange-600 bg-orange-100 dark:bg-orange-500/20 dark:text-orange-100 border-0">
                Pending
            </Tag>
        )
    }

    const getProgressDisplay = () => {
        console.log(
            mediaconvert_job_status,
            mediaconvert_job_progress,
            fileType,
        )
        // Non-video types are completed by default
        if (fileType !== 'video') {
            return <span className="text-emerald-600 font-medium">100%</span>
        }

        if (mediaconvert_job_status === 'completed') {
            return <span className="text-emerald-600 font-medium">100%</span>
        }
        if (mediaconvert_job_status === 'failed') {
            return <span className="text-red-600 font-medium">Failed</span>
        }
        if (
            mediaconvert_job_progress !== undefined &&
            mediaconvert_job_progress > 0
        ) {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${mediaconvert_job_progress}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-gray-600">
                        {mediaconvert_job_progress}%
                    </span>
                </div>
            )
        }
        return <span className="text-gray-500">0%</span>
    }

    return (
        <Tr>
            <Td width="50%">
                <div
                    className="inline-flex items-center gap-2 cursor-pointer group"
                    role="button"
                    onClick={onClick}
                >
                    <div className="text-3xl">
                        <FileIcon type={fileType || ''} />
                    </div>
                    <div className="font-bold heading-text group-hover:text-primary">
                        {name}
                    </div>
                </div>
            </Td>
            <Td>{fileSizeUnit(size || 0)}</Td>
            <Td>
                <FileType type={content_type || ''} />
            </Td>
            <Td>{getStatusDisplay()}</Td>
            <Td>{getProgressDisplay()}</Td>
            <Td>
                <div className="flex justify-end">
                    <FileItemDropdown {...rest} />
                </div>
            </Td>
        </Tr>
    )
}

export default FileRow
