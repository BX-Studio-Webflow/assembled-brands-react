import Table from '@/components/ui/Table'
import FileSegment from './FileSegment'
import FileRow from './FileRow'
import type { Asset } from '@/@types/asset'
import type { Layout } from '../store/useFileManagerStore'

type FileListProps = {
    fileList: Asset[]
    layout: Layout
    onRename: (id: string) => void
    onDownload: (url: string, fileName: string) => void
    onShare: (id: string) => void
    onDelete: (id: string) => void
    onClick: (id: string) => void
}

const { TBody, THead, Th, Tr } = Table

const FileList = (props: FileListProps) => {
    const {
        layout,
        fileList,
        onDelete,
        onDownload,
        onShare,
        onRename,
        onClick,
    } = props

    const renderFileSegment = (list: Asset[]) => (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4 lg:gap-6">
            {list.map((file) => (
                <FileSegment
                    key={file.id}
                    fileType={file.asset_type}
                    size={file.asset_size}
                    name={file.asset_name}
                    onClick={() => onClick(file.id.toString())}
                    onDownload={() =>
                        onDownload(file.presignedUrl, file.asset_name)
                    }
                    onShare={() => onShare(file.id.toString())}
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
                    <Th></Th>
                </Tr>
            </THead>
            <TBody>
                {list.map((file) => (
                    <FileRow
                        key={file.id}
                        fileType={file.asset_type}
                        size={file.asset_size}
                        name={file.asset_name}
                        onClick={() => onClick(file.id.toString())}
                        onDownload={() =>
                            onDownload(file.presignedUrl, file.asset_name)
                        }
                        onShare={() => onShare(file.id.toString())}
                        onDelete={() => onDelete(file.id.toString())}
                        onRename={() => onRename(file.id.toString())}
                    />
                ))}
            </TBody>
        </Table>
    )

    return (
        <div>
            {fileList.length > 0 && (
                <div>
                    <h4>Files</h4>
                    {layout === 'grid' && renderFileSegment(fileList)}
                    {layout === 'list' && renderFileRow(fileList)}
                </div>
            )}
        </div>
    )
}

export default FileList
