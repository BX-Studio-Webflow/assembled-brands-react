import { useEffect } from 'react'
import Table from '@/components/ui/Table'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import FileManagerHeader from './components/FileManagerHeader'
import FileSegment from './components/FileSegment'
import FileList from './components/FileList'
import FileManagerDeleteDialog from './components/FileManagerDeleteDialog'
import FileManagerInviteDialog from './components/FileManagerInviteDialog'
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
        setInviteDialog,
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

    const handleShare = (id: string) => {
        setInviteDialog({ id, open: true })
    }

    const handleDelete = (id: string) => {
        setDeleteDialog({ id, open: true })
    }

    const handleDownload = (url: string, fileName: string) => {
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleRename = (id: string) => {
        setRenameDialog({ id, open: true })
    }

    const handleClick = (fileId: string) => {
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
                                        <Th></Th>
                                    </Tr>
                                </THead>
                                <TableRowSkeleton
                                    avatarInColumns={[0]}
                                    columns={4}
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
                            onDownload={handleDownload}
                            onShare={handleShare}
                            onDelete={handleDelete}
                            onRename={handleRename}
                            onClick={handleClick}
                        />
                    )}
                </div>
            </div>

            <FileManagerDeleteDialog onDeleteSuccess={trigger} />
            <FileManagerInviteDialog />
            <FileManagerRenameDialog onRenameSuccess={trigger} />
        </>
    )
}

export default FileManager
