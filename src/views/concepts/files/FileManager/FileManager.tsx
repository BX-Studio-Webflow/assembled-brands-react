import { useEffect } from 'react'
import Table from '@/components/ui/Table'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import FileManagerHeader from './components/FileManagerHeader'
import FileSegment from './components/FileSegment'
import FileList from './components/FileList'
import FileManagerDeleteDialog from './components/FileManagerDeleteDialog'
import FileManagerRenameDialog from './components/FileManagerRenameDialog'
import { useFileManagerStore } from './store/useFileManagerStore'
import { apiGetAssets } from '@/services/AssetService'
import useSWRMutation from 'swr/mutation'
import type { GetAssetsResponse } from '@/@types/asset'

const { THead, Th, Tr } = Table

async function getAssets() {
    const response = await apiGetAssets()
    return response
}

const FileManager = () => {
    const {
        layout,
        fileList,
        setFileList,
        setDeleteDialog,
        setRenameDialog,
        setSelectedFile,
    } = useFileManagerStore()

    const { trigger, isMutating } = useSWRMutation(`/assets`, getAssets, {
        onSuccess: (resp: GetAssetsResponse) => {
            setFileList(resp.assets)
        },
    })

    useEffect(() => {
        if (fileList.length === 0) {
            trigger()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleDelete = (id: string) => {
        setDeleteDialog({ id, open: true })
    }

    const handleRename = (id: string) => {
        setRenameDialog({ id, open: true })
    }

    const handleClick = (fileId: string) => {
        // Find the file by ID and open in new tab
        const file = fileList.find((f) => f.id.toString() === fileId)
        if (file) {
            window.open(file.presignedUrl, '_blank')
        }
        setSelectedFile(fileId)
    }

    return (
        <>
            <div>
                <FileManagerHeader onUploadSuccess={trigger} />
                <div className="mt-6">
                    {isMutating ? (
                        layout === 'grid' ? (
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 gap-4 lg:gap-6">
                                {[...Array(4).keys()].map((item) => (
                                    <FileSegment
                                        key={item}
                                        loading={isMutating}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Table>
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
                                <TableRowSkeleton
                                    avatarInColumns={[0]}
                                    columns={6}
                                    rows={5}
                                    avatarProps={{
                                        width: 30,
                                        height: 30,
                                    }}
                                />
                            </Table>
                        )
                    ) : (
                        <FileList
                            fileList={fileList}
                            layout={layout}
                            onDelete={handleDelete}
                            onRename={handleRename}
                            onClick={handleClick}
                        />
                    )}
                </div>
            </div>

            <FileManagerDeleteDialog onDeleteSuccess={trigger} />
            <FileManagerRenameDialog onRenameSuccess={trigger} />
        </>
    )
}

export default FileManager
