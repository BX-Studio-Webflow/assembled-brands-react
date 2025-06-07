import Loading from '@/components/shared/Loading'
import EventDetailProducts from './components/EventDetailProducts'
import EventDetailPayment from './components/EventDetailPayment'
import EventDetailCustomer from './components/EventDetailCustomer'
import EventDetailsActivities from './components/EventDetailsActivities'
import EventDetailNote from './components/EventDetailNote'
import { apiGetEvent } from '@/services/EventService'
import useSWR from 'swr'
import { useParams } from 'react-router'
import type { GetEventDetailsResponse } from './types'

const EventDetails = () => {
    const { id } = useParams()

    const { data, isLoading } = useSWR<GetEventDetailsResponse, { id: string }>(
        [`/api/project/${id}`],
        () => apiGetEvent({ id }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    return (
        <Loading loading={isLoading}>
            {data && (
                <>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="gap-4 flex flex-col flex-auto">
                            <EventDetailProducts products={data.product} />
                            <EventDetailPayment
                                paymentStatus={data.paymentStatus}
                                paymentSummary={data.paymentSummary}
                            />
                            <EventDetailsActivities
                                activities={data.activity}
                                progressStatus={data.progressStatus}
                            />
                        </div>
                        <div className="lg:w-[320px] xl:w-[420px] gap-4 flex flex-col">
                            <EventDetailCustomer customer={data.customer} />
                            <EventDetailNote note={data.note} />
                        </div>
                    </div>
                </>
            )}
        </Loading>
    )
}

export default EventDetails
