import Card from '@/components/ui/Card'
import { Link } from 'react-router'


import { TbTrash } from 'react-icons/tb'

import type { FollowUpEmail } from '@/@types/mail'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { useState } from 'react'
import { toast } from '@/components/ui/toast'
import { apiDeleteFollowUpEmail } from '@/services/MailService'
import Notification from '@/components/ui/Notification'
import { AxiosError } from 'axios'
import { Skeleton } from '@/components/ui/Skeleton'
import NoUserFound from '@/assets/svg/NoUserFound'

interface BulkMailListContentProps {
    data: FollowUpEmail[]
    mutate: () => void
    isLoading: boolean
}

const BulkMailListContent = ({ data, mutate, isLoading }: BulkMailListContentProps) => {
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState<number | null>(null)

    const handleDelete = (customer: FollowUpEmail) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(customer.id)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
        setToDeleteId(null)
    }

    const handleConfirmDelete = async () => {
        if (!toDeleteId) return
        try {
            await apiDeleteFollowUpEmail(toDeleteId)
            toast.push(
                <Notification type="success">
                    Follow up email deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate()
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setDeleteConfirmationOpen(false)
            setToDeleteId(null)
        }
    }
    // Only render loading after all hooks
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <Skeleton height={150} />
                <div className="flex flex-auto items-center gap-2">
                    <div>
                        <Skeleton variant="circle" height={35} width={35} />
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                        <Skeleton height={10} />
                        <Skeleton height={10} width="60%" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>

            <div className="mt-8">
                <h5 className="mb-3">My templates</h5>
                <div className="flex flex-col gap-4">
                    {data.length === 0 ? (
                        <div className="flex flex-col items-center gap-4">
                            <NoUserFound />
                            <span className="font-semibold">
                                No templates saved. Click on the add follow up button to get started.
                            </span>
                        </div>
                    ) : (
                        data.map((email) => (
                            <Card key={email.id}>
                                <div className="flex justify-between">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex flex-col">
                                            <h6 className="font-bold hover:text-primary">
                                                <Link
                                                    to={`/concepts/accounts/settings/notification/${email.id}`}
                                                >
                                                    {email.title}
                                                </Link>
                                            </h6>
                                            <span>{email.timeline} days after event</span>
                                        </div>
                                    </div>



                                    <div className="my-1 sm:my-0 col-span-12 sm:col-span-1 flex md:items-center justify-end">
                                        <div
                                            className="cursor-pointer text-lg hover:text-red-500"
                                            role="button"
                                            onClick={() => handleDelete(email)}
                                        >
                                            <TbTrash />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )))}
                </div>
            </div>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove follow up email"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    {' '}
                    Are you sure you want to remove this follow up email? This action
                    can&apos;t be undone.{' '}
                </p>
            </ConfirmDialog>
        </div>
    )
}

export default BulkMailListContent
