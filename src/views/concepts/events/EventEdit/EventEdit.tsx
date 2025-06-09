import { useState, useMemo } from 'react'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Container from '@/components/shared/Container'
import Loading from '@/components/shared/Loading'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import EventForm from '../EventForm'
import { apiGetEvent, apiUpdateEvent } from '@/services/EventService'
import useSWR from 'swr'
import { useParams, useNavigate } from 'react-router'
import { TbTrash } from 'react-icons/tb'
import type { EventFormType } from '../EventForm/validation/eventFormSchema'
import type { EventWithDetailsAndCount } from '@/@types/events'
import { AxiosError } from 'axios'

const EventEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data, isLoading } = useSWR<EventWithDetailsAndCount>(
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
        try {
            setIsSubmiting(true)
            const payload = {
                event_name: values.event_name,
                event_description: values.event_description,
                status: values.status,
                event_type: values.event_type,
                live_venue_address: values.live_venue_address,
                live_video_url: values.live_video_url,
                asset_id: values.asset_id,
                instructions: values.instructions,
                landing_page_url: values.landing_page_url,
                success_url: values.success_url,
                calendar_url: values.calendar_url,
                membership_plans: values.membership_plans.map((plan) => ({
                    name: plan.name,
                    date:
                        typeof plan.date === 'object' &&
                        plan.date instanceof Date
                            ? Math.floor(plan.date.getTime() / 1000)
                            : Math.floor(plan.date / 1000),
                    payment_type: plan.payment_type,
                    cost: plan.isFree ? 0 : plan.cost,
                    isFree: plan.isFree,
                })),
            }

            await apiUpdateEvent(Number(id), payload)

            toast.push(
                <Notification type="success">
                    Event updated successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate('/concepts/event/event-list')
        } catch (error) {
            console.error('Error updating event:', error)
            toast.push(
                <Notification type="danger">
                    {(error as AxiosError).message}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(true)
        toast.push(<Notification type="success">Event deleted!</Notification>, {
            placement: 'top-center',
        })
        navigate('/concepts/event/event-list')
    }

    const handleDelete = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    const EventFormProps = useMemo(() => {
        console.log('Raw data:', data)
        console.log('Memberships:', data?.memberships)

        const membershipPlans = (data?.memberships || []).map((plan) => {
            const isFree = plan.price === 0
            return {
                name: plan.name || '',
                isFree,
                cost: isFree ? 0 : plan.price || 0,
                date: plan.dates?.[0]?.date
                    ? new Date(Number(plan.dates[0].date) * 1000)
                    : new Date(),
                payment_type: plan.payment_type || 'one_off',
            }
        })

        console.log('Mapped membership plans:', membershipPlans)

        const defaultValues: EventFormType = {
            event_name: data?.event_name || '',
            event_description: data?.event_description || '',
            status: data?.status || 'active',
            event_type: data?.event_type || 'live_venue',
            live_venue_address: data?.live_venue_address || '',
            live_video_url: data?.live_video_url || '',
            asset_id: data?.asset_id || 0,
            instructions: data?.instructions || '',
            landing_page_url: data?.landing_page_url || '',
            success_url: data?.success_url || '',
            calendar_url: data?.calendar_url || '',
            membership_plans:
                membershipPlans.length > 0
                    ? membershipPlans
                    : [
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

        console.log('Final defaultValues:', defaultValues)

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
