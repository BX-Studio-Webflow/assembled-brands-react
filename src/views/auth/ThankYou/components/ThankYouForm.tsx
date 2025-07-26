import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import type { EventWithDetailsAndCount } from '@/@types/events'
import type { CommonProps } from '@/@types/common'
import { Skeleton } from '@/components/ui/Skeleton'

interface ThankYouFormProps extends CommonProps {
    event?: EventWithDetailsAndCount
    validateTicketPayment?: { valid: boolean }
    isValidateTicketPaymentLoading?: boolean
    isEventLoading?: boolean
}

const ThankYouForm = (props: ThankYouFormProps) => {
    const { className, event } = props

    const handleClickContinue = () => {
        window.open(event?.success_url, '_blank')
    }

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
