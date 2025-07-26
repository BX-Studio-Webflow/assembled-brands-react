import { useEffect, useState } from 'react'
import Alert from '@/components/ui/Alert'
import GatewayForm from './components/GatewayForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import SplitWithImage from '@/components/layouts/AuthLayout/SplitWithImage'
import { apiValidateTicketPayment } from '@/services/LeadsService'
import useSWR from 'swr'
import { EventWithDetailsAndCount } from '@/@types/events'
import { apiGetEvent } from '@/services/EventService'

export const GatewayBase = () => {
    const [purchaseComplete, setResetComplete] = useState(false)

    const [message, setMessage] = useTimeOutMessage()
    const [params, setParams] = useState<{
        code: string
        token: string
        email: string
    }>({
        code: '',
        token: '',
        email: '',
    })

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
        <div className="min-h-screen h-screen w-full">
            <SplitWithImage
                title={event?.event_name || ''}
                description={event?.event_description || ''}
                src={
                    event?.host?.profile_image ||
                    '/img/others/auth-split-img.png'
                }
                className="h-full"
            >
                <div>
                    <div className="mb-6">
                        <>
                            <h3 className="mb-1">{event?.event_name}</h3>
                            <p className="font-semibold heading-text">
                                {event?.event_description}
                            </p>
                        </>
                    </div>
                    {message && (
                        <Alert showIcon className="mb-4" type="danger">
                            <span className="break-all">{message}</span>
                        </Alert>
                    )}

                    <GatewayForm
                        event={event}
                        validateTicketPayment={validateTicketPayment}
                        isValidateTicketPaymentLoading={
                            isValidateTicketPaymentLoading
                        }
                        params={params}
                        isEventLoading={isEventLoading}
                        purchaseComplete={purchaseComplete}
                        setMessage={setMessage}
                        setResetComplete={setResetComplete}
                    ></GatewayForm>
                </div>
            </SplitWithImage>
        </div>
    )
}

const Gateway = () => {
    return <GatewayBase />
}

export default Gateway
