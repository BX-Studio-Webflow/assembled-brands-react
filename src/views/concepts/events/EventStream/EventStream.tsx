import React from 'react'
import Loading from '@/components/shared/Loading'
import { useParams, useSearchParams } from 'react-router'
import { LivestreamStatus } from '@/@types/events'

import EventBody from './components/EventBody'
import EventSidebar from './components/EventSidebar'
import Card from '@/components/ui/Card'
import { EventProvider } from './context/EventContext'
import EventHeader from './components/EventHeader'
import EventActions from './components/EventActions'
import EventWaitingCard from './components/EventWaitingCard'
import { useEventStream } from './hooks/useEventStream'

const EventStream = () => {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const code = searchParams.get('code')
    const isHostFromParams = !token && !email && !code

    const {
        data,
        isLoading,
        eventStatus,
        nextDate,
        isHost,
        handleStatusUpdate,
        handleUIStateChange,
    } = useEventStream({
        eventId: Number(code || id),
        token,
        email,
        code,
        isHost: isHostFromParams,
    })

    return (
        <EventProvider
            value={{ data: data || null, isLoading, eventStatus, nextDate }}
        >
            <Loading loading={isLoading}>
                <div className="flex flex-row justify-between gap-4 mb-4 ">
                    <EventHeader
                        eventId={String(data?.event.id)}
                        status={eventStatus as LivestreamStatus}
                        eventName={data?.event.event_name || ''}
                        eventDescription={data?.event.event_description || ''}
                        nextDate={nextDate}
                        isHost={isHost}
                    />
                    <EventActions
                        eventId={data?.event.id || 0}
                        isHost={isHost}
                        eventStatus={eventStatus as LivestreamStatus}
                    />
                </div>
                {data && eventStatus === 'live' && (
                    <>
                        <Card
                            className="h-full border-0 mb-4"
                            bodyClass="h-full flex flex-col"
                        >
                            <div className="flex flex-auto w-full h-full gap-4">
                                <EventSidebar
                                    event={data}
                                    isHost={isHost}
                                    nextDate={nextDate}
                                    eventStatus={eventStatus}
                                />
                                <EventBody
                                    data={data}
                                    isHost={isHost}
                                    nextDate={nextDate}
                                    membershipId={
                                        data?.lead?.membership_id || 0
                                    }
                                    onStatusUpdate={handleStatusUpdate}
                                />
                            </div>
                        </Card>
                    </>
                )}
                {data && eventStatus !== 'live' && (
                    <EventWaitingCard
                        event={data}
                        onCountdownEnd={() => handleUIStateChange('live')}
                    />
                )}
            </Loading>
        </EventProvider>
    )
}

export default EventStream
