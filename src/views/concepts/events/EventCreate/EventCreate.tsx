import { useState } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Container from '@/components/shared/Container'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EventForm from '../EventForm'
import { useNavigate } from 'react-router'
import { TbTrash } from 'react-icons/tb'
import { apiCreateEvent } from '@/services/EventService'
import { CreateEventRequest } from '@/@types/events'
import { EventFormType } from '../EventForm/types'

const EventCreate = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: EventFormType) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        const payload = {
            ...values,
            membership_plans: values.membership_plans.map((plan) => ({
                ...plan,
                date:
                    typeof plan.date === 'object' && plan.date instanceof Date
                        ? Math.floor(plan.date.getTime() / 1000)
                        : Math.floor(plan.date / 1000),
            })),
        }
        await apiCreateEvent(payload as CreateEventRequest)

        setIsSubmiting(false)
        toast.push(<Notification type="success">Event created!</Notification>, {
            placement: 'top-center',
        })
        navigate('/concepts/event/event-list')
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(
            <Notification type="success">Event discarded!</Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/events/event-list')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <EventForm onFormSubmit={handleFormSubmit}>
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'bEvent-error ring-1 ring-error text-error hover:bEvent-error hover:ring-error hover:text-error bg-transparent'
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
            </EventForm>
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

export default EventCreate
