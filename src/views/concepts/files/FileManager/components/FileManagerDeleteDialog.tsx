import { useFileManagerStore } from '../store/useFileManagerStore'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiDeleteAsset } from '@/services/AssetService'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

type FileManagerDeleteDialogProps = {
    onDeleteSuccess?: () => void
}

const FileManagerDeleteDialog = ({
    onDeleteSuccess,
}: FileManagerDeleteDialogProps) => {
    const { deleteDialog, setDeleteDialog } = useFileManagerStore()

    const handleDeleteDialogClose = () => {
        setDeleteDialog({ id: '', open: false })
    }

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.id) return
        try {
            await apiDeleteAsset(Number(deleteDialog.id))
            toast.push(
                <Notification
                    title={'File deleted successfully'}
                    type="success"
                />,
                { placement: 'top-center' },
            )
            if (onDeleteSuccess) onDeleteSuccess()
        } catch (e: unknown) {
            toast.push(
                <Notification
                    title={e instanceof Error ? e.message : 'Delete failed'}
                    type="danger"
                />,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteDialog({ id: '', open: false })
        }
    }

    return (
        <ConfirmDialog
            isOpen={deleteDialog.open}
            type="danger"
            title="Delete file"
            onClose={handleDeleteDialogClose}
            onRequestClose={handleDeleteDialogClose}
            onCancel={handleDeleteDialogClose}
            onConfirm={handleDeleteConfirm}
        >
            <p>
                Are you sure you want to delete this file? This action can&apos;t
                be undone.
            </p>
        </ConfirmDialog>
    )
}

export default FileManagerDeleteDialog
