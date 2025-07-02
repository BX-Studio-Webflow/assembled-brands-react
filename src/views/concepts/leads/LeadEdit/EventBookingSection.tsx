import Card from '@/components/ui/Card'
import dayjs from 'dayjs'
import {
    PiCalendarDuotone,
    PiCalendarCheckDuotone,
    PiCalendarXDuotone,
} from 'react-icons/pi'
import { Badge } from '@/components/ui/Badge'

type EventBooking = {
    id: number
    lead_id: number
    host_id: number
    event_id: number
    created_at: string
    updated_at: string
    membership_id: number
    metadata: {
        eventName: string | null | undefined
        membershipName: string | null | undefined
        dates: number[] | null | undefined
    }
    event: {
        id: number
        event_name: string
        event_description: string
        status: string
        created_at: string
        updated_at: string
    }
}

const TimeLineMedia = (props: { status: string }) => {
    const { status } = props

    switch (status) {
        case 'active':
            return <PiCalendarCheckDuotone />
        case 'cancelled':
            return <PiCalendarXDuotone />
        default:
            return <PiCalendarDuotone />
    }
}

const TimeLineContent = (props: { booking: EventBooking }) => {
    const { booking } = props

    return (
        <div>
            <h6 className="font-bold">Events</h6>
            <p className="font-semibold">{booking.event.event_name}</p>

            <div className="flex items-center gap-2">
                <span className="text-sm capitalize">
                    {dayjs(
                        Number(booking.metadata.dates?.[0] || 0) * 1000,
                    ).format('D MMMM YYYY')}
                </span>
                <span className="text-sm capitalize">
                    {booking.metadata.membershipName}
                </span>
            </div>
            <div className="mt-2 flex items-center gap-2">
                <Badge
                    className={
                        booking.event.status === 'cancelled'
                            ? 'bg-red-500'
                            : 'bg-emerald-500'
                    }
                />
                <span className="text-sm capitalize">
                    {booking.event.status}
                </span>
            </div>
        </div>
    )
}

const EventBookingSection = ({ bookings }: { bookings: EventBooking[] }) => {
    return (
        <>
            {bookings.map((booking) => (
                <div key={booking.id} className="mb-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center">
                            <Card
                                className="w-full"
                                bodyClass="py-3"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-primary text-3xl">
                                        <TimeLineMedia
                                            status={booking.event.status}
                                        />
                                    </div>

                                    <TimeLineContent booking={booking} />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default EventBookingSection
