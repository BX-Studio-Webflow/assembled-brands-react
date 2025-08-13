import { create } from 'zustand'
import type { Asset } from '@/@types/asset'

export type Layout = 'grid' | 'list'

type DialogProps = {
    open: boolean
    id: string
}

export type FileManagerState = {
    fileList: Asset[]
    layout: Layout
    selectedFile: string
    openedDirectoryId: string
    deleteDialog: DialogProps
    inviteDialog: DialogProps
    renameDialog: DialogProps
}

type FileManagerAction = {
    setFileList: (payload: Asset[]) => void
    setLayout: (payload: Layout) => void
    setOpenedDirectoryId: (payload: string) => void
    setSelectedFile: (payload: string) => void
    setDeleteDialog: (payload: DialogProps) => void
    setInviteDialog: (payload: DialogProps) => void
    setRenameDialog: (payload: DialogProps) => void
    deleteFile: (payload: string) => void
    renameFile: (payload: { id: string; fileName: string }) => void
}

const initialState: FileManagerState = {
    fileList: [],
    layout: 'list',
    selectedFile: '',
    openedDirectoryId: '',
    deleteDialog: { open: false, id: '' },
    inviteDialog: { open: false, id: '' },
    renameDialog: { open: false, id: '' },
}

export const useFileManagerStore = create<FileManagerState & FileManagerAction>(
    (set, get) => ({
        ...initialState,
        setFileList: (payload) => set(() => ({ fileList: payload })),
        setLayout: (payload: Layout) => set(() => ({ layout: payload })),
        setOpenedDirectoryId: (payload) =>
            set(() => ({ openedDirectoryId: payload })),
        setSelectedFile: (payload) => set(() => ({ selectedFile: payload })),
        setDeleteDialog: (payload) => set(() => ({ deleteDialog: payload })),
        setInviteDialog: (payload) => set(() => ({ inviteDialog: payload })),
        setRenameDialog: (payload) => set(() => ({ renameDialog: payload })),
        deleteFile: (payload) =>
            set(() => ({
                fileList: get().fileList.filter(
                    (file) => file.id.toString() !== payload,
                ),
            })),
        renameFile: (payload) =>
            set(() => ({
                fileList: get().fileList.map((file) => {
                    if (file.id.toString() === payload.id) {
                        return {
                            ...file,
                            asset_name: payload.fileName,
                        }
                    }
                    return file
                }),
            })),
    }),
)
