import { useState } from 'react'
import Timeline from '@/components/ui/Timeline'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Tooltip from '@/components/ui/Tooltip'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { HiPencil, HiOutlineTrash, HiTag } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import type { AvatarProps } from '@/components/ui/Avatar'

type TimelineAvatarProps = AvatarProps

const TimelineAvatar = ({ children, ...rest }: TimelineAvatarProps) => {
    return (
        <Avatar {...rest} size={25} shape="circle">
            {children}
        </Avatar>
    )
}

type CardSectionProps = {
    data: Partial<{
        code: string
        token: string
        action: string
        id?: string
        img?: string
        email?: string
        personalInfo?: {
            facebook?: string
            twitter?: string
            linkedIn?: string
            pinterest?: string
        }
    }>
}

const CardSection = ({ data = {} }: CardSectionProps) => {
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
        navigate('/concepts/customers/customer-list')
        toast.push(
            <Notification title={'Successfully Deleted'} type="success">
                Customer successfuly deleted
            </Notification>,
        )
    }

    const handleSendMessage = () => {
        navigate('/concepts/chat')
    }

    return (
        <Card className="w-full">
            <div className="max-w-[700px] mx-auto">
                <Timeline>
                    <Timeline.Item
                        media={
                            <TimelineAvatar
                                src="/img/avatars/thumb-3.jpg"
                                className="bg-blue-500"
                            />
                        }
                    >
                        <p className="my-1 flex items-center">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                Jane Smith
                            </span>
                            <span className="mx-2">
                                has invited you to join{' '}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                Awesome Inc
                            </span>
                        </p>
                        <Card className="mt-4">
                            <p>
                                Hey Brian, we&apos;d love to have you onboard
                                our team! Gain access to team projects, shared
                                resources, and collaboration tools.
                            </p>
                        </Card>
                    </Timeline.Item>
                    <Timeline.Item
                        media={
                            <TimelineAvatar className="text-gray-700 bg-gray-200 dark:text-gray-100">
                                <HiTag />
                            </TimelineAvatar>
                        }
                    >
                        <p className="flex items-center">
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                System{' '}
                            </span>
                            <span className="mx-2">assigned tags </span>
                            <Tag
                                prefix
                                className="mr-2 rtl:ml-2 cursor-pointer"
                                prefixClass="bg-rose-500"
                            >
                                New Member
                            </Tag>
                        </p>
                    </Timeline.Item>
                </Timeline>

                <div className="flex flex-col gap-4 mt-6">
                    <Button block variant="solid" onClick={handleSendMessage}>
                        Accept Invitation
                    </Button>
                    <Button
                        block
                        customColorClass={() =>
                            'text-error hover:border-error hover:ring-1 ring-error hover:text-error'
                        }
                        icon={<HiOutlineTrash />}
                        onClick={handleDialogOpen}
                    >
                        Decline Invitation
                    </Button>
                </div>

                <ConfirmDialog
                    isOpen={dialogOpen}
                    type="danger"
                    title="Delete customer"
                    onClose={handleDialogClose}
                    onRequestClose={handleDialogClose}
                    onCancel={handleDialogClose}
                    onConfirm={handleDelete}
                >
                    <p>
                        Are you sure you want to declindelete this customer? All
                        record related to this customer will be deleted as well.
                        This action cannot be undone.
                    </p>
                </ConfirmDialog>
            </div>
        </Card>
    )
}

export default CardSection
