import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar/Avatar'
import Notification from '@/components/ui/Notification'
import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import dayjs from 'dayjs'
import { HiPencil, HiOutlineTrash } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import type { Lead } from '@/@types/lead'

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

    const handleDelete = () => {
        setDialogOpen(false)
        navigate('/concepts/lead/lead-list')
        toast.push(
            <Notification title={'Successfully Deleted'} type="success">
                Lead successfully deleted
            </Notification>,
        )
    }

    const handleSendMessage = () => {
        navigate('/concepts/chat')
    }

    const handleEdit = () => {
        navigate(`/concepts/lead/lead-edit/${data.id}`)
    }

    return (
        <Card className="w-full">
            <div className="flex justify-end">
                <Tooltip title="Edit lead">
                    <button
                        className="close-button button-press-feedback"
                        type="button"
                        onClick={handleEdit}
                    >
                        <HiPencil />
                    </button>
                </Tooltip>
            </div>
            <div className="flex flex-col xl:justify-between h-full 2xl:min-w-[360px] mx-auto">
                <div className="flex xl:flex-col items-center gap-4 mt-6">
                    <Avatar size={90} shape="circle">
                        {data.name.charAt(0)}
                    </Avatar>
                    <h4 className="font-bold">{data.name}</h4>
                    <p className="text-gray-500">{data.status_identifier}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-7 gap-x-4 mt-10">
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
                    {data.tags && data.tags.length > 0 && (
                        <div className="mb-7">
                            <span>Tags</span>
                            <div className="flex flex-wrap mt-4 gap-2">
                                {data.tags.map((tagAssignment) => (
                                    <span
                                        key={tagAssignment.id}
                                        className="px-2 py-1 bg-primary-50 text-primary-500 rounded-full text-xs"
                                    >
                                        {tagAssignment.tag.tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-4">
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
        </Card>
    )
}

export default ProfileSection
