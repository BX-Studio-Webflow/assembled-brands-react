import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import MembershipForm, { MembershipFormSchema } from '../MembershipForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { apiCreateMembership } from '@/services/MembershipService'
import { AxiosError } from 'axios'

const MembershipCreate = () => {
    const navigate = useNavigate()
    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: MembershipFormSchema) => {
        setIsSubmiting(true)
        try {
            await apiCreateMembership({
                name: values.name,
                description: values.description,
                price: values.price,
                payment_type: values.payment_type,
                price_point: values.price_point,
                billing: values.billing,
                dates: values.dates,
            })
            toast.push(
                <Notification type="success">Membership created!</Notification>,
                { placement: 'top-center' },
            )
            navigate('/concepts/memberships/membership-list')
        } catch (error) {
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        }
        setIsSubmiting(false)
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Membership discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/memberships/membership-list')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <MembershipForm
                newMembership
                defaultValues={{
                    name: '',
                    description: '',
                    price: 0,
                    payment_type: 'one_off',
                    price_point: 'standalone',
                    billing: undefined,
                    dates: [],
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Container>
            </MembershipForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default MembershipCreate
