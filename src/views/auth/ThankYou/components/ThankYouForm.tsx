import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { TbMail } from 'react-icons/tb'
import { Link } from 'react-router'
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
                <h4 className="mb-4">Host</h4>
                <Link
                    className="group flex items-center justify-between"
                    to="/concepts/customers/customer-details/11"
                >
                    <div className="flex items-center gap-2">
                        <Avatar
                            shape="circle"
                            src={
                                event.host.profile_image ||
                                '/img/avatars/man.png'
                            }
                        />
                        <div>
                            <div className="font-bold heading-text">
                                {event.host.name}
                            </div>
                            <span>
                                <span className="font-semibold">
                                    {event.business.email ||
                                        event.host.email}{' '}
                                </span>
                            </span>
                        </div>
                    </div>
                </Link>
                <hr className="my-5" />
                <IconText
                    className="mb-4"
                    icon={<TbMail className="text-xl opacity-70" />}
                >
                    <span>
                        An email has been sent to you confirming all the details
                        of this event
                    </span>
                </IconText>
                <hr className="my-5" />
                <h6 className="mb-4 font-bold">Pre event instructions</h6>
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
