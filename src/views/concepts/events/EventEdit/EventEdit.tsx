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
import type { EventFormSchema } from '../EventForm'

type GetEventDetailsResponse = {
    id: string
    progressStatus: number
    paymentStatus: number
    dateTime: number
    paymentSummary: {
        subTotal: number
        tax: number
        deliveryFees: number
        total: number
        customerPayment: number
    }
    note: string
    shipping: {
        deliveryFees: number
        estimatedMin: number
        estimatedMax: number
        shippingLogo: string
        shippingVendor: string
    }
    product: {
        id: string
        name: string
        productCode: string
        img: string
        price: number
        quantity: number
        total: number
        details: Record<string, string[]>
    }[]
    activity: {
        date: number
        events: {
            time: number
            action: string
            recipient?: string
        }[]
    }[]
    customer: {
        name: string
        firstName: string
        lastName: string
        email: string
        phone: string
        dialCode: string
        phoneNumber: string
        img: string
        previousEvent: number
        country: string
        address: string
        postcode: string
        city: string
    }
}

const EventEdit = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    const { data, isLoading } = useSWR<GetEventDetailsResponse, { id: string }>(
        [`/api/project/${id}`],
        () => apiGetEvent({ id }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: EventFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        await sleep(800)
        setIsSubmiting(false)
        toast.push(
            <Notification type="success">
                Event: #{data?.id} updated!
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
        const products = data
            ? data.product.map(
                  ({ id, name, productCode, img, price, quantity }) => {
                      return {
                          id,
                          name,
                          productCode,
                          img,
                          price,
                          quantity,
                          stock: 0,
                      }
                  },
              )
            : []

        const defaultValues = {
            firstName: data?.customer.name || '',
            lastName: data?.customer.lastName || '',
            email: data?.customer.email || '',
            dialCode: data?.customer.dialCode || '',
            phoneNumber: data?.customer.phoneNumber || '',
            country: data?.customer.country || '',
            address: data?.customer.address || '',
            postcode: data?.customer.postcode || '',
            city: data?.customer.city || '',
            paymentMethod: 'paypal',
            paypalEmail: data?.customer.email,
        } as EventFormSchema

        return {
            defaultProducts: products,
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
