import { useState, useEffect } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import DebouceInput from '@/components/shared/DebouceInput'
import { useFileManagerStore } from '../store/useFileManagerStore'
import { apiRenameAsset } from '@/services/AssetService'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

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

    useEffect(() => {
        setNewName(currentName)
    }, [renameDialog.id, currentName])

    const handleDialogClose = () => {
        setRenameDialog({ id: '', open: false })
    }

    const handleSubmit = async () => {
        if (!renameDialog.id || !newName) return
        setLoading(true)
        try {
            await apiRenameAsset(Number(renameDialog.id), newName)
            toast.push(
                <Notification
                    title={'File renamed successfully'}
                    type="success"
                />,
                { placement: 'top-center' },
            )
            if (onRenameSuccess) onRenameSuccess()
            handleDialogClose()
        } catch (e: unknown) {
            toast.push(
                <Notification
                    title={e instanceof Error ? e.message : 'Rename failed'}
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
