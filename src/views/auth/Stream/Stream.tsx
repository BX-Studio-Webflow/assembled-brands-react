import React from 'react'
import Loading from '@/components/shared/Loading'
import { useSearchParams } from 'react-router'
import { LivestreamStatus } from '@/@types/events'
import { Card } from '@/components/ui'
import EventHeader from '@/views/concepts/events/EventStream/components/EventHeader'
import EventActions from '@/views/concepts/events/EventStream/components/EventActions'
import EventWaitingCard from '@/views/concepts/events/EventStream/components/EventWaitingCard'
import { EventProvider } from '@/views/concepts/events/EventStream/context/EventContext'
import EventSidebar from '@/views/concepts/events/EventStream/components/EventSidebar'
import EventBody from '@/views/concepts/events/EventStream/components/EventBody'
import { useEventStream } from '@/views/concepts/events/EventStream/hooks/useEventStream'

const Stream = () => {
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
        eventId: Number(code),
        token,
        email,
        code,
        isHost: isHostFromParams,
    })

    return (
        <EventProvider
            value={{ data: data || null, isLoading, eventStatus, nextDate }}
        >
            <Loading
                loading={isLoading}
                className="h-screen w-screen px-2 sm:px-4 md:px-8 lg:px-16 py-4 sm:py-6 md:py-8"
            >
                <div className="flex flex-col w-full h-full ml-2 mr-2">
                    {/* Header Section - Mobile Optimized */}
                    <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 mb-4 w-full">
                        <EventHeader
                            eventId={String(data?.event.id)}
                            status={eventStatus as LivestreamStatus}
                            eventName={data?.event.event_name || ''}
                            eventDescription={
                                data?.event.event_description || ''
                            }
                            nextDate={nextDate}
                        />
                        <EventActions
                            eventId={data?.event.id || 0}
                            isHost={isHost}
                            eventStatus={eventStatus as LivestreamStatus}
                        />
                    </div>

                    {/* Live Event Content */}
                    {data && eventStatus === 'live' && (
                        <>
                            <Card
                                className="w-full h-full border-0"
                                bodyClass="h-full flex flex-col"
                            >
                                <div className="flex flex-col lg:flex-row flex-auto h-full gap-2 sm:gap-4 lg:gap-8">
                                    <EventSidebar
                                        event={data}
                                        isHost={isHost}
                                        nextDate={nextDate}
                                        eventStatus={
                                            eventStatus as LivestreamStatus
                                        }
                                    />
                                    <EventBody
                                        nextDate={nextDate}
                                        data={data}
                                        isHost={isHost}
                                        membershipId={
                                            data?.lead?.membership_id || 0
                                        }
                                        onStatusUpdate={handleStatusUpdate}
                                    />
                                </div>
                            </Card>
                        </>
                    )}

                    {/* Waiting/Ended Event Content */}
                    {data && eventStatus !== 'live' && (
                        <EventWaitingCard
                            event={data}
                            onCountdownEnd={() => handleUIStateChange('live')}
                        />
                    )}
                </div>
            </Loading>
        </EventProvider>
    )
}

export default Stream
