import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import MembershipForm, { MembershipFormSchema } from '../MembershipForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate, useSearchParams } from 'react-router'
import { apiCreateLead } from '@/services/LeadsService'
import { useAuth } from '@/auth'

const MembershipCreate = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [searchParams] = useSearchParams()
    const eventId = searchParams.get('eventId')
        ? Number(searchParams.get('eventId'))
        : undefined

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: MembershipFormSchema) => {
        setIsSubmiting(false) // Form submission is now handled in MembershipForm
        // Format data according to backend schema
        const leadData = {
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            phone: `${values.dialCode}${values.phoneNumber}`,
            host_id: user?.id || 0,
        }

        // Make API call
        await apiCreateLead(leadData)
        toast.push(
            <Notification type="success">Membership created!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/lead/lead-list')
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Membership discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/lead/lead-list')
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
                eventId={eventId}
                defaultValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    img: '',
                    phoneNumber: '',
                    dialCode: '',
                    tags: [],
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
