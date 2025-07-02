import { useState } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import dayjs from 'dayjs'
import { HiOutlineTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import type { Lead } from '@/@types/lead'
import { apiDeleteLead } from '@/services/LeadsService'

type CustomerInfoFieldProps = {
    title?: string
    value?: string
}

type ProfileSectionProps = {
    data: Lead
}

const CustomerInfoField = ({ title, value }: CustomerInfoFieldProps) => {
    return (
        <div>
            <span className="font-semibold">{title}</span>
            <p className="heading-text font-bold">{value}</p>
        </div>
    )
}

const ProfileSection = ({ data }: ProfileSectionProps) => {
    const navigate = useNavigate()
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleDialogClose = () => {
        setDialogOpen(false)
    }

    const handleDialogOpen = () => {
        setDialogOpen(true)
    }

    const handleDelete = async () => {
        setDialogOpen(false)
        try {
            await apiDeleteLead(String(data.id))
            toast.push(
                <Notification type="success">
                    Lead deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate('/concepts/lead/lead-list')
        } catch {
            toast.push(
                <Notification type="danger">
                    Failed to delete lead. Please try again.
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDialogOpen(false)
        }
    }

    const handleSendMessage = () => {
        navigate('/concepts/mail')
    }

    return (
        <>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4">
                    <CustomerInfoField title="Email" value={data.email} />
                    <CustomerInfoField
                        title="Phone"
                        value={`${data.dial_code}${data.phone}`}
                    />
                    <CustomerInfoField
                        title="Created"
                        value={dayjs(data.created_at).format(
                            'DD MMM YYYY hh:mm A',
                        )}
                    />
                </div>
                <div className="flex flex-col gap-4 mt-8">
                    <Button block variant="solid" onClick={handleSendMessage}>
                        Send Message
                    </Button>
                    <Button
                        block
                        customColorClass={() =>
                            'text-error hover:border-error hover:ring-1 ring-error hover:text-error'
                        }
                        icon={<HiOutlineTrash />}
                        onClick={handleDialogOpen}
                    >
                        Delete
                    </Button>
                </div>
                <ConfirmDialog
                    isOpen={dialogOpen}
                    type="danger"
                    title="Delete lead"
                    onClose={handleDialogClose}
                    onRequestClose={handleDialogClose}
                    onCancel={handleDialogClose}
                    onConfirm={handleDelete}
                >
                    <p>
                        Are you sure you want to delete this lead? All records
                        related to this lead will be deleted as well. This
                        action cannot be undone.
                    </p>
                </ConfirmDialog>
            </div>
        </>
    )
}

export default ProfileSection
