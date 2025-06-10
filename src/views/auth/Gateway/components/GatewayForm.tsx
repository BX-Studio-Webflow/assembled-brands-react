import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { TbMail, TbExternalLink } from 'react-icons/tb'
import { Link, useNavigate } from 'react-router'
import Radio from '@/components/ui/Radio'
import Checkbox from '@/components/ui/Checkbox'
import type { EventWithDetailsAndCount } from '@/@types/events'
import type { CommonProps } from '@/@types/common'
import { AxiosError } from 'axios'
import { apiPurchaseMembership } from '@/services/LeadsService'

interface GatewayFormProps extends CommonProps {
    event?: EventWithDetailsAndCount
    validateTicketPayment?: { valid: boolean }
    isValidateTicketPaymentLoading?: boolean
    isEventLoading?: boolean
    purchaseComplete: boolean
    setMessage: (message: string) => void
    setResetComplete: (complete: boolean) => void
    params: {
        code: string
        token: string
        email: string
    }
}

const GatewayForm = (props: GatewayFormProps) => {
    const navigate = useNavigate()
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [selectedMembershipId, setSelectedMembershipId] = useState<
        number | null
    >(null)
    const [selectedDates, setSelectedDates] = useState<string[]>([])

    const {
        className,
        setMessage,
        setResetComplete,
        purchaseComplete,
        children,
        event,
        params,
    } = props

    // Find the selected membership object
    const selectedMembership =
        event?.memberships?.find((m) => m.id === selectedMembershipId) ||
        event?.memberships?.[0]

    useEffect(() => {
        if (event?.memberships?.length && selectedMembershipId === null) {
            setSelectedMembershipId(event.memberships[0].id)
        }
    }, [event, selectedMembershipId])

    // Auto-select the date if only one is available
    useEffect(() => {
        if (selectedMembership && selectedMembership.dates?.length === 1) {
            setSelectedDates([selectedMembership.dates[0].id.toString()])
        }
    }, [selectedMembershipId, event])

    // When membership changes, reset selected dates
    const handleMembershipChange = (id: string) => {
        setSelectedMembershipId(Number(id))
        setSelectedDates([])
    }

    // Example submit handler (update as needed)
    const onFormSubmit = async () => {
        try {
            // Example: send selectedMembershipId and selectedDates
            const purchase = await apiPurchaseMembership({
                event_id: Number(params.code),
                token: params.token,
                email: params.email,
                dates: selectedDates.map((id) => Number(id)),
                membership_id: Number(selectedMembershipId),
            })
            setSubmitting(false)
            setResetComplete(true)
            navigate(purchase.redirect_url)
        } catch (error) {
            setMessage?.((error as AxiosError).message)
            setSubmitting(false)
        }
    }

    // Only render loading after all hooks
    if (!event) {
        return <div>Loading event...</div>
    }

    return (
        <div className={className}>
            {!purchaseComplete ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onFormSubmit()
                    }}
                >
                    <Card>
                        <h4 className="mb-4">Host</h4>
                        <Link
                            className="group flex items-center justify-between"
                            to="/concepts/customers/customer-details/11"
                        >
                            <div className="flex items-center gap-2">
                                <Avatar
                                    shape="circle"
                                    src={event.host.profile_image}
                                />
                                <div>
                                    <div className="font-bold heading-text">
                                        {event.host.name}
                                    </div>
                                    <span>
                                        <span className="font-semibold">
                                            {event.host.email}{' '}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <TbExternalLink className="text-xl hidden group-hover:block" />
                        </Link>
                        <hr className="my-5" />
                        <IconText
                            className="mb-4"
                            icon={<TbMail className="text-xl opacity-70" />}
                        >
                            <span>{event.host.email}</span>
                        </IconText>
                        <hr className="my-5" />
                        <h6 className="mb-4 font-bold">Choose Ticket</h6>
                        <Radio.Group
                            value={
                                selectedMembershipId !== null
                                    ? selectedMembershipId.toString()
                                    : ''
                            }
                            onChange={handleMembershipChange}
                            className="w-full flex-col"
                        >
                            {event.memberships?.map((m) => (
                                <Radio
                                    key={m.id}
                                    value={m.id.toString()}
                                    className="block mb-2 p-4 rounded-lg border cursor-pointer bg-blue-50 w-full"
                                >
                                    <div className="flex flex-col justify-between w-full">
                                        <span>{m.name}</span>
                                        <span className="font-bold">
                                            £{m.price}
                                        </span>
                                    </div>
                                </Radio>
                            ))}
                        </Radio.Group>
                        <hr className="my-5" />
                        <h6 className="mb-4 font-bold">Dates Available</h6>
                        <Checkbox.Group
                            value={selectedDates}
                            onChange={setSelectedDates}
                        >
                            {selectedMembership?.dates?.map((date) => (
                                <Checkbox
                                    key={date.id}
                                    value={date.id.toString()}
                                    className="block mb-2 w-full flex items-center gap-x-2"
                                >
                                    {new Date(
                                        Number(date.date) * 1000,
                                    ).toLocaleString()}
                                </Checkbox>
                            ))}
                        </Checkbox.Group>
                        <Button
                            block
                            className="mt-4"
                            loading={isSubmitting}
                            variant="solid"
                            type="submit"
                        >
                            {isSubmitting ? 'Placing Order...' : 'Purchase'}
                        </Button>
                    </Card>
                </form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default GatewayForm
