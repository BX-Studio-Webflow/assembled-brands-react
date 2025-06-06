import React, { useMemo } from 'react'
import Loading from '@/components/shared/Loading'
import useSWR, { mutate } from 'swr'
import { useParams } from 'react-router'
import { EventStreamResponse } from '@/@types/events'
import { apiStreamEvent } from '@/services/EventService'

import ChatBody from '../../chat/Chat/components/ChatBody'
import ChatSidebar from '../../chat/Chat/components/ChatSidebar'
import Card from '@/components/ui/Card'
import { EventProvider } from './context/EventContext'
import EventHeader from './components/EventHeader'
import EventHeaderExtra from './components/EventHeaderExtra'
import EventWaitingCard from './components/EventWaitingCard'

const EventStream = () => {
    const { id } = useParams()

    const swrKey = [`/event/stream/${id}`]
    const { data, isLoading } = useSWR<EventStreamResponse>(
        swrKey,
        () =>
            apiStreamEvent({
                event_id: Number(id),
                email: null,
                token: null,
                isHost: true,
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
        return { eventStatus: status, nextDate: next }
    }, [data])

    const handleCountdownEnd = () => {
        mutate(swrKey)
    }

    return (
        <EventProvider
            value={{ data: data || null, isLoading, eventStatus, nextDate }}
        >
            <Loading loading={isLoading}>
                <div className="flex flex-row justify-between gap-4 mb-4 ">
                    <EventHeader />
                    <EventHeaderExtra />
                </div>
                {data && eventStatus === 'live' && (
                    <>
                        <Card
                            className="h-full border-0"
                            bodyClass="h-full flex flex-col"
                        >
                            <div className="flex flex-auto h-full gap-8">
                                <ChatSidebar />
                                <ChatBody data={data} />
                            </div>
                        </Card>
                    </>
                )}
                {data && eventStatus !== 'live' && (
                    <EventWaitingCard onCountdownEnd={handleCountdownEnd} />
                )}
            </Loading>
        </EventProvider>
    )
}

export default EventStream
