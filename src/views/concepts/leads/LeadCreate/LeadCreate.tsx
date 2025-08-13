import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import LeadForm, { LeadFormSchema } from '../LeadForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { apiCreateLead } from '@/services/LeadsService'
import { useAuth } from '@/auth'
import { AxiosError } from 'axios'

const LeadCreate = () => {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: LeadFormSchema) => {
        setIsSubmiting(false) // Form submission is now handled in LeadForm
        // Format data according to backend schema
        const leadData = {
            name: `${values.firstName} ${values.lastName}`,
            email: values.email,
            dial_code: values.dialCode,
            phone: values.phoneNumber,
            host_id: user?.id || 0,
            event_id: values.event_id,
        }
        try {
            // Make API call
            await apiCreateLead(leadData)
            toast.push(
                <Notification type="success">
                    Lead created successfully!
                </Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate('/concepts/lead/lead-list')
        } catch (error) {
            console.error('Error creating lead:', error)
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
            throw error
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Lead discarded!</Notification>,
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
            <LeadForm
                newLead
                defaultValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    img: '',
                    phoneNumber: '',
                    dialCode: '',
                    event_id: 0,
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 gap-4 sm:gap-0">
                        <span className="w-full sm:w-auto"></span>
                        <div className="flex flex-col sm:flex-row items-center gap-2 ml-2 mr-2 w-full sm:w-auto">
                            <Button
                                block
                                className="w-full sm:w-auto"
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
                                block
                                className="w-full sm:w-auto"
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Container>
            </LeadForm>
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

export default LeadCreate
