import Table from '@/components/ui/Table'
import FileType from './FileType'
import FileItemDropdown from './FileItemDropdown'
import fileSizeUnit from '@/utils/fileSizeUnit'
import FileIcon from '@/components/view/FileIcon'
import type { BaseFileItemProps } from '../types'

type FileRowProps = BaseFileItemProps & {
    mediaconvert_job_status?: string
    mediaconvert_job_progress?: number
}

const { Tr, Td } = Table

const FileRow = (props: FileRowProps) => {
    const { 
        fileType, 
        size, 
        name, 
        mediaconvert_job_status, 
        mediaconvert_job_progress,
        onClick, 
        ...rest 
    } = props

    const getStatusDisplay = () => {
        if (mediaconvert_job_status === 'completed') {
            return <span className="text-green-600 font-medium">Completed</span>
        }
        if (mediaconvert_job_status === 'processing') {
            return <span className="text-blue-600 font-medium">Processing</span>
        }
        if (mediaconvert_job_status === 'failed') {
            return <span className="text-red-600 font-medium">Failed</span>
        }
        return <span className="text-gray-600 font-medium">Pending</span>
    }

    const getProgressDisplay = () => {
        if (mediaconvert_job_status === 'completed') {
            return <span className="text-green-600">100%</span>
        }
        if (mediaconvert_job_status === 'failed') {
            return <span className="text-red-600">Failed</span>
        }
        if (mediaconvert_job_progress !== undefined && mediaconvert_job_progress > 0) {
            return (
                <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${mediaconvert_job_progress}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-gray-600">{mediaconvert_job_progress}%</span>
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
                <FileType type={fileType || ''} />
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
