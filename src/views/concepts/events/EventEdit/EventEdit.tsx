import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EventForm from '../EventForm'
import sleep from '@/utils/sleep'
import { apiGetEvent } from '@/services/EventService'
import useSWR from 'swr'
import { useParams, useNavigate } from 'react-router'
import { TbTrash } from 'react-icons/tb'
import type { EventFormType } from '../EventForm/validation/eventFormSchema'
import type { Event } from '@/@types/events'

const EventEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR<Event>(
        id ? `/event/${id}` : null,
        () => apiGetEvent(Number(id)),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: EventFormType) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                Event updated successfully!
            </Notification>,
            { placement: 'top-center' },
        )
        navigate('/concepts/Events/Event-list')
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(<Notification type="success">Event deleted!</Notification>, {
            placement: 'top-center',
        })
        navigate('/concepts/Events/Event-list')
    }

    const handleDelete = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    const EventFormProps = useMemo(() => {
        const defaultValues: EventFormType = {
            event_name: data?.event_name || '',
            event_description: data?.event_description || '',
            status: data?.status || 'active',
            event_type: data?.event_type || 'live_venue',
            live_venue_address: data?.live_venue_address || '',
            live_video_url: data?.live_video_url || '',
            asset_id: data?.asset_id || 0,
            membership_plans: (data?.membership_plans || []).map((plan) => ({
                ...plan,
                date: new Date(plan.date),
                isFree: plan.cost === 0,
            })) || [
                {
                    name: '',
                    isFree: false,
                    cost: 0,
                    date: new Date(),
                    payment_type: 'one_off',
                },
            ],
            terms: true,
            course_url_external: '',
            course_internal: false,
            invite_existing_leads: false,
        }

        return {
            defaultValues,
        }
    }, [data])

    return (
        <Loading loading={isLoading}>
            <EventForm onFormSubmit={handleFormSubmit} {...EventFormProps}>
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
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Update
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
                    Are you sure you want delete this? This action can&apos;t be
                    undo.{' '}
                </p>
            </ConfirmDialog>
        </Loading>
    )
}

export default EventEdit
