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
            <h6 className="font-bold">Bookings</h6>
            <p className="font-semibold">{booking.event.event_name}</p>
            <p className="text-sm text-gray-500">
                {booking.event.event_description}
            </p>
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

const ActivitySection = ({ bookings }: { bookings: EventBooking[] }) => {
    return (
        <>
            {bookings.map((booking) => (
                <div key={booking.id} className="mb-4">
                    <div className="mb-4 font-bold uppercase flex items-center gap-4">
                        <span className="w-[70px] heading-text">
                            {dayjs(booking.created_at).format('DD MMMM')}
                        </span>
                        <div className="border-b border-2 border-gray-200 dark:border-gray-600 border-dashed w-full"></div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center">
                            <span className="font-semibold w-[100px]">
                                {dayjs(booking.created_at).format('h:mm A')}
                            </span>
                            <Card
                                className="max-w-[600px] w-full"
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

export default ActivitySection
