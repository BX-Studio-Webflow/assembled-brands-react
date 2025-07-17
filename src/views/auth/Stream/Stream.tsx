import React, { useMemo, useState } from 'react'
import Loading from '@/components/shared/Loading'
import useSWR from 'swr'
import { useSearchParams } from 'react-router'
import { EventStreamResponse, LivestreamStatus } from '@/@types/events'
import { apiStreamEvent } from '@/services/EventService'
import { Card } from '@/components/ui'
import ChatBody from '@/views/concepts/chat/Chat/components/ChatBody'
import ChatSidebar from '@/views/concepts/chat/Chat/components/ChatSidebar'
import EventHeader from '@/views/concepts/events/EventStream/components/EventHeader'
import EventActions from '@/views/concepts/events/EventStream/components/EventActions'
import EventWaitingCard from '@/views/concepts/events/EventStream/components/EventWaitingCard'
import { EventProvider } from '@/views/concepts/events/EventStream/context/EventContext'

const Stream = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const code = searchParams.get('code')
    const isHost = !token && !email && !code
    const [uiState, setUIState] = useState<LivestreamStatus>('early')
    const swrKey = [`/event/stream/${code}`]
    const { data, isLoading } = useSWR<EventStreamResponse>(
        swrKey,
        () =>
            apiStreamEvent({
                email: email,
                token: token,
                event_id: Number(code),
                isHost: !token && !email && !code, // If no token/email/code provided, assume it's a host
            }),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    // Compute eventStatus and nextDate
    const { eventStatus, nextDate } = useMemo(() => {
        if (!data?.event.memberships?.length)
            return { eventStatus: undefined, nextDate: null }
        const now = new Date()
        const sortedDates = data.event.memberships
            .flatMap((membership) => membership.dates)
            .map((date) => ({
                start: new Date(Number(date.date) * 1000),
                end: new Date(
                    Number(date.date) * 1000 +
                        (data.event.asset.duration || 0) * 1000,
                ),
            }))
            .sort((a, b) => a.start.getTime() - b.start.getTime())
        const next = sortedDates.find((date) => date.end > now) || null
        console.log({ sortedDates, next, actual: data.event.memberships })
        let status = 'early'
        if (!next) {
            status = 'ended'
        } else if (data.event.status === 'cancelled') {
            status = 'cancelled'
        } else if (data.event.status === 'suspended') {
            status = 'suspended'
        } else if (now > next.end) {
            status = 'ended'
        } else if (now > next.start) {
            status = 'live'
        }

        // Override with UI state if it's been set
        if (uiState !== 'early') {
            status = uiState
        }

        return { eventStatus: status, nextDate: next }
    }, [data, uiState])

    const handleUIStateChange = (uiStatus: LivestreamStatus) => {
        console.log('🫥 UI State Changed:', uiStatus)
        setUIState(uiStatus)
    }

    return (
        <EventProvider
            value={{ data: data || null, isLoading, eventStatus, nextDate }}
        >
            <Loading
                loading={isLoading}
                className="h-screen w-screen mr-16 ml-16 py-8"
            >
                <div className="flex flex-col w-full h-full m-2">
                    <div className="flex flex-row justify-between gap-4 mb-4 w-full">
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
                    {data && eventStatus === 'live' && (
                        <>
                            <Card
                                className="w-full h-full border-0"
                                bodyClass="h-full flex flex-col"
                            >
                                <div className="flex flex-auto h-full gap-8">
                                    <ChatSidebar
                                        event={data}
                                        isHost={false}
                                        nextDate={nextDate}
                                    />
                                    <ChatBody
                                        nextDate={nextDate}
                                        data={data}
                                        isHost={false}
                                        membershipId={
                                            data?.lead?.membership_id || 0
                                        }
                                        onStatusUpdate={handleUIStateChange}
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
                </div>
            </Loading>
        </EventProvider>
    )
}

export default Stream
