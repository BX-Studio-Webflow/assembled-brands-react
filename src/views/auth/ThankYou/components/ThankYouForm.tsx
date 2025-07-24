import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { EventWithDetailsAndCount } from '@/@types/events'
import type { CommonProps } from '@/@types/common'

interface ThankYouFormProps extends CommonProps {
    event?: EventWithDetailsAndCount
    validateTicketPayment?: { valid: boolean }
    isValidateTicketPaymentLoading?: boolean
    isEventLoading?: boolean
}

const ThankYouForm = (props: ThankYouFormProps) => {
    const { className, event } = props

    const handleClickContinue = () => {
        window.open(event?.landing_page_url, '_blank')
    }

    if (!event) {
        return <div>Loading event...</div>
    }

    return (
        <div className={className}>
            <Card>
                <h6 className="mb-4 font-bold">Pre-Event Note</h6>
                <div>
                    <p>{event?.instructions}</p>
                </div>
                <hr className="my-5" />
                <Button
                    block
                    className="mt-4"
                    variant="solid"
                    onClick={() => handleClickContinue()}
                >
                    Continue
                </Button>
            </Card>
        </div>
    )
}

export default ThankYouForm
