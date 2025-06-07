import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import {
    apiGetMembership,
    apiUpdateMembership,
} from '@/services/MembershipService'
import MembershipForm from '../MembershipForm'
import NoUserFound from '@/assets/svg/NoUserFound'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router'
import useSWR from 'swr'
import type { MembershipFormSchema } from '../MembershipForm'
import type { Membership } from '@/@types/membership'

const MembershipEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR<Membership>(
        id ? `/membership/${id}` : null,
        () => apiGetMembership(Number(id)),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: MembershipFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        try {
            await apiUpdateMembership(Number(id), values)
            setIsSubmiting(false)
            toast.push(
                <Notification type="success">Changes Saved!</Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate('/concepts/memberships/membership-list')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    Failed to update membership:{' '}
                    {error instanceof Error ? error.message : 'Unknown error'}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const getDefaultValues = (): MembershipFormSchema => {
        if (data) {
            return {
                name: data.name,
                description: data.description,
                price: data.price,
                payment_type: data.payment_type,
                price_point: data.price_point as
                    | 'standalone'
                    | 'course'
                    | 'podcast',
                billing: data.billing as 'per-day' | 'package' | undefined,
                dates: data.dates?.map((date) => date.toString()) || [],
            }
        }
        return {
            name: '',
            description: '',
            price: 0,
            payment_type: 'one_off',
            price_point: 'standalone',
            billing: undefined,
            dates: [],
        }
    }

    const handleConfirmDelete = () => {
        setDeleteConfirmationOpen(true)
        toast.push(
            <Notification type="success">Membership deleted!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/memberships/membership-list')
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        history.back()
    }

    return (
        <>
            {!isLoading && !data && (
                <div className="h-full flex flex-col items-center justify-center">
                    <NoUserFound height={280} width={280} />
                    <h3 className="mt-8">No membership found!</h3>
                </div>
            )}
            {!isLoading && data && (
                <>
                    <MembershipForm
                        defaultValues={getDefaultValues()}
                        newMembership={false}
                        onFormSubmit={handleFormSubmit}
                    >
                        <Container>
                            <div className="flex items-center justify-between px-8">
                                <Button
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    variant="plain"
                                    icon={<TbArrowNarrowLeft />}
                                    onClick={handleBack}
                                >
                                    Back
                                </Button>
                                <div className="flex items-center">
                                    <Button
                                        className="ltr:mr-3 rtl:ml-3"
                                        type="button"
                                        customColorClass={() =>
                                            'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                        }
                                        icon={<TbTrash />}
                                        onClick={handleDelete}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        loading={isSubmiting}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </Container>
                    </MembershipForm>
                    <ConfirmDialog
                        isOpen={deleteConfirmationOpen}
                        type="danger"
                        title="Delete membership"
                        onClose={handleCancel}
                        onRequestClose={handleCancel}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                    >
                        <p>
                            Are you sure you want to delete this membership?
                            This action can&apos;t be undone.
                        </p>
                    </ConfirmDialog>
                </>
            )}
        </>
    )
}

export default MembershipEdit
