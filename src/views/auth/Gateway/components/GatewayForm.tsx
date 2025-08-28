import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Radio from '@/components/ui/Radio'
import Checkbox from '@/components/ui/Checkbox'
import type { EventWithDetailsAndCount } from '@/@types/events'
import type { CommonProps } from '@/@types/common'
import { AxiosError } from 'axios'
import { apiPurchaseMembership } from '@/services/LeadsService'
import { Skeleton } from '@/components/ui'
import NoUserFound from '@/assets/svg/NoUserFound'

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

    // Filter and sort upcoming memberships
    const now = Date.now()
    const upcoming =
        event?.memberships
            ?.filter((m) => parseInt(m.dates[0]?.date || '0') * 1000 > now)
            .sort(
                (a, b) => parseInt(a.dates[0].date) - parseInt(b.dates[0].date),
            ) || []

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
            window.open(purchase.redirect_url, '_blank')
        } catch (error) {
            setMessage?.((error as AxiosError).message)
            setSubmitting(false)
        }
    }

    // Only render loading after all hooks
    if (!event) {
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
        <div className={className}>
            {!purchaseComplete ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onFormSubmit()
                    }}
                >
                    <Card>
                        {upcoming.length > 0 && (
                            <h6 className="mb-4 font-bold">Choose Ticket</h6>
                        )}
                        {upcoming.length === 0 ? (
                            <div className="flex flex-col items-center gap-4">
                                <NoUserFound />
                                <span className="font-semibold">
                                    No upcoming events available at this time.
                                </span>
                            </div>
                        ) : (
                            <Radio.Group
                                value={
                                    selectedMembershipId !== null
                                        ? selectedMembershipId.toString()
                                        : ''
                                }
                                className="w-full flex-col"
                                onChange={handleMembershipChange}
                            >
                                {upcoming.map((m) => (
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
                        )}

                        {upcoming.length > 0 && (
                            <div>
                                <hr className="my-5" />
                                <h6 className="mb-4 font-bold">
                                    Dates Available
                                </h6>
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
                                    {isSubmitting
                                        ? 'Placing Order...'
                                        : 'Purchase'}
                                </Button>
                            </div>
                        )}
                    </Card>
                </form>
            ) : (
                <>{children}</>
            )}
        </div>
    )
}

export default GatewayForm
