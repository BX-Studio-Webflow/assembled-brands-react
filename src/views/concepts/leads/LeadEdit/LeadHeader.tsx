import Badge from '@/components/ui/Badge'
import dayjs from 'dayjs'
import { Lead } from '@/@types/lead'
import { NumericFormat } from 'react-number-format'
import Tag from '@/components/ui/Tag'

interface LeadHeaderProps {
    lead: Lead
}

const TimeLineContent = (props: { lead: Lead }) => {
    const { lead } = props

    // Get the most recent payment
    const latestPayment = lead.payments?.[0]

    if (!latestPayment) {
        return (
            <div>
                <h6 className="font-bold">Payment</h6>
                <p className="font-semibold">No payment history</p>
                <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-gray-400" />
                    <span className="text-sm capitalize">No payment</span>
                </div>
            </div>
        )
    }

    return (
        <div>
            <h6 className="font-bold">
                <NumericFormat
                    displayType="text"
                    value={latestPayment.amount}
                    prefix={latestPayment.currency === 'gbp' ? '£' : '$'}
                    thousandSeparator={true}
                />
            </h6>
            <p className="font-semibold">
                <div className="flex">
                    <div className="mr-2 rtl:ml-2">
                        <Tag
                            className={
                                latestPayment.status === 'succeeded'
                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0'
                                    : latestPayment.status === 'failed' ||
                                        latestPayment.status === 'cancelled'
                                      ? 'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0'
                                      : 'text-amber-600 bg-amber-100 dark:text-amber-100 dark:bg-amber-500/20 border-0'
                            }
                        >
                            {latestPayment.status}
                        </Tag>
                    </div>
                    <div className="mr-2 rtl:ml-2">
                        <Tag className="text-white bg-indigo-600 border-0">
                            {latestPayment.payment_type.replace('_', ' ')}
                        </Tag>
                    </div>
                    <div className="mr-2 rtl:ml-2">
                        <Tag className="bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-100 border-0 rounded">
                            {dayjs(latestPayment.created_at).format(
                                'D MMMM YYYY',
                            )}
                        </Tag>
                    </div>
                </div>
            </p>
        </div>
    )
}

const LeadHeader = ({ lead }: LeadHeaderProps) => {
    return (
        <div className="flex flex-row justify-between gap-4">
            <div className="flex flex-col gap-2 mb-4">
                <h6 className="font-bold">
                    {lead.bookings[0]?.event.event_name}
                </h6>

                <div className="flex items-center gap-2">
                    <Badge
                        className={
                            lead.bookings[0]?.event.status === 'cancelled'
                                ? 'bg-red-500'
                                : 'bg-emerald-500'
                        }
                    />
                    <span className="text-sm capitalize">
                        {dayjs(
                            Number(lead.bookings[0]?.metadata.dates?.[0] || 0) *
                                1000,
                        ).format('D MMMM YYYY')}
                    </span>

                    <span className="text-sm capitalize">
                        {lead.bookings[0]?.metadata.membershipName}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <TimeLineContent lead={lead} />
            </div>
        </div>
    )
}

export default LeadHeader
