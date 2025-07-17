import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import ThankYouForm from './components/ThankYouForm'
import { useNavigate } from 'react-router'

import { apiValidateTicketPayment } from '@/services/LeadsService'
import useSWR from 'swr'
import { EventWithDetailsAndCount } from '@/@types/events'
import { apiGetEvent } from '@/services/EventService'
import Split from './components/Split'

type ThankYouProps = {
    signInUrl?: string
}

export const ThankYouBase = ({ signInUrl = '/sign-in' }: ThankYouProps) => {
    const [params, setParams] = useState<{
        code: string
        token: string
        email: string
    }>({
        code: '',
        token: '',
        email: '',
    })
    const navigate = useNavigate()

    const handleContinue = () => {
        navigate(signInUrl)
    }

    useEffect(() => {
        // Check if we're on the callback URL with a code
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const email = urlParams.get('email')
        const code = urlParams.get('code')
        if (token && email && code) {
            setParams({ code, token, email })
        }
    }, [])
    //fetch the event/code, validate ticket payment
    const { data: event, isLoading: isEventLoading } =
        useSWR<EventWithDetailsAndCount>(
            params.code ? `/event/${params.code}` : null,
            () => apiGetEvent(Number(params.code)),
            {
                revalidateOnFocus: false,
                revalidateIfStale: false,
                revalidateOnReconnect: false,
            },
        )

    const {
        data: validateTicketPayment,
        isLoading: isValidateTicketPaymentLoading,
    } = useSWR<{ valid: boolean }>(
        params.code ? `lead/validate-ticket-payment` : null,
        () =>
            apiValidateTicketPayment({
                token: params.token,
                email: params.email,
                event_id: Number(params.code),
            }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    return (
        <div className="min-h-screen h-screen">
            <Split
                className="h-full"
                src={
                    event?.asset?.image_presigned_url ||
                    '/img/others/auth-split-img.png'
                }
                title={event?.event_name || ''}
                description={event?.event_description || ''}
            >
                <div>
                    <div className="mb-6">
                        <>
                            <h3 className="mb-1">All done!</h3>
                            <p className="font-semibold">
                                You have successfully registered for the{' '}
                                <span className="font-bold text-primary">
                                    {event?.event_name}
                                </span>{' '}
                                event and your space has been reserved.
                            </p>
                        </>
                    </div>

                    <ThankYouForm
                        event={event}
                        validateTicketPayment={validateTicketPayment}
                        isValidateTicketPaymentLoading={
                            isValidateTicketPaymentLoading
                        }
                        isEventLoading={isEventLoading}
                    >
                        <Button
                            block
                            variant="solid"
                            type="button"
                            onClick={handleContinue}
                        >
                            Continue
                        </Button>
                    </ThankYouForm>
                </div>
            </Split>
        </div>
    )
}

const ThankYou = () => {
    return <ThankYouBase />
}

export default ThankYou
