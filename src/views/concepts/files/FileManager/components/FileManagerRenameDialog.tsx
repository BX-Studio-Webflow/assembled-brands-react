import { useState, useEffect } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import DebouceInput from '@/components/shared/DebouceInput'
import { useFileManagerStore } from '../store/useFileManagerStore'
import { apiRenameAsset } from '@/services/AssetService'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { AxiosError } from 'axios'

type FileManagerRenameDialogProps = {
    onRenameSuccess?: () => void
}

const FileManagerRenameDialog = ({
    onRenameSuccess,
}: FileManagerRenameDialogProps) => {
    const { renameDialog, setRenameDialog, fileList } = useFileManagerStore()
    const [newName, setNewName] = useState('')
    const [loading, setLoading] = useState(false)

    // Find the current file name for the selected file
    const currentFile = fileList.find(
        (f) => f.id.toString() === renameDialog.id,
    )
    const currentName = currentFile ? currentFile.asset_name : ''

    // Extract filename without extension
    const getFilenameWithoutExtension = (filename: string) => {
        const lastDotIndex = filename.lastIndexOf('.')
        return lastDotIndex !== -1
            ? filename.substring(0, lastDotIndex)
            : filename
    }

    // Get file extension
    const getFileExtension = (filename: string) => {
        const lastDotIndex = filename.lastIndexOf('.')
        return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : ''
    }

    useEffect(() => {
        // Set only the filename without extension
        setNewName(getFilenameWithoutExtension(currentName))
    }, [renameDialog.id, currentName])

    const handleDialogClose = () => {
        setRenameDialog({ id: '', open: false })
    }

    const handleSubmit = async () => {
        if (!renameDialog.id || !newName) return
        setLoading(true)
        try {
            // Add the extension back when submitting
            const extension = getFileExtension(currentName)
            const fullFilename = newName + extension

            await apiRenameAsset(Number(renameDialog.id), fullFilename)
            toast.push(
                <Notification
                    title={'File renamed successfully'}
                    type="success"
                />,
                { placement: 'top-center' },
            )
            if (onRenameSuccess) onRenameSuccess()
            handleDialogClose()
        } catch (error) {
            toast.push(
                <Notification
                    title={(error as AxiosError).message}
                    type="danger"
                />,
                { placement: 'top-center' },
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            isOpen={renameDialog.open}
            contentClassName="mt-[50%]"
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            <h4>Rename</h4>
            <div className="mt-6">
                <DebouceInput
                    placeholder="New name"
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
            </div>
            <div className="mt-6 flex justify-end items-center gap-2">
                <Button size="sm" onClick={handleDialogClose}>
                    Close
                </Button>
                <Button
                    variant="solid"
                    size="sm"
                    disabled={newName.length === 0 || loading}
                    loading={loading}
                    onClick={handleSubmit}
                >
                    <span className="flex justify-center min-w-10">Ok</span>
                </Button>
            </div>
        </Dialog>
    )
}

export default FileManagerRenameDialog
