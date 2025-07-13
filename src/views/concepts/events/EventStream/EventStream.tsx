import React, { useMemo, useState } from 'react'
import Loading from '@/components/shared/Loading'
import useSWR from 'swr'
import { useParams, useSearchParams } from 'react-router'
import { EventStreamResponse } from '@/@types/events'
import { apiStreamEvent } from '@/services/EventService'

import ChatBody from '../../chat/Chat/components/ChatBody'
import ChatSidebar from '../../chat/Chat/components/ChatSidebar'
import Card from '@/components/ui/Card'
import { EventProvider } from './context/EventContext'
import EventHeader from './components/EventHeader'
import EventActions from './components/EventActions'
import EventWaitingCard from './components/EventWaitingCard'
import { apiRecordLeaveEvent } from '@/services/TelemetryService'

const EventStream = () => {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const code = searchParams.get('code')
    const isHost = !token && !email && !code
    const [uiState, setUIState] = useState<'early' | 'live' | 'ended'>('early')
    console.log({ token, email, code, id })
    const swrKey = [`/event/stream/${id}`]
    const { data, isLoading } = useSWR<EventStreamResponse>(
        swrKey,
        () =>
            apiStreamEvent({
                email: email,
                token: token,
                event_id: Number(code || id),
                isHost: isHost, // If no token/email/code provided, assume it's a host
            }),
        { revalidateOnFocus: false },
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

    const handleStatusUpdate = async (
        status: 'active' | 'suspended' | 'cancelled' | 'ended',
    ) => {
        if (status === 'ended' && token && email && code) {
            await apiRecordLeaveEvent({
                token: token,
                email: email,
                code: code,
                scenario: 'VIDEO_ENDED',
            })
        }
    }

    const handleUIStateChange = (uiStatus: 'live' | 'ended' | 'early') => {
        setUIState(uiStatus)
    }

    return (
        <EventProvider
            value={{ data: data || null, isLoading, eventStatus, nextDate }}
        >
            <Loading loading={isLoading}>
                <div className="flex flex-row justify-between gap-4 mb-4 ">
                    <EventHeader
                        eventId={String(data?.event.id)}
                        status={
                            eventStatus as
                                | 'cancelled'
                                | 'suspended'
                                | 'ended'
                                | 'live'
                                | 'early'
                        }
                        eventName={data?.event.event_name || ''}
                        eventDescription={data?.event.event_description || ''}
                        nextDate={nextDate}
                        isHost={isHost}
                    />
                    <EventActions
                        eventId={data?.event.id || 0}
                        isHost={isHost}
                        eventStatus={
                            eventStatus as
                                | 'live'
                                | 'ended'
                                | 'early'
                                | 'cancelled'
                                | 'suspended'
                        }
                    />
                </div>
                {data && eventStatus === 'live' && (
                    <>
                        <Card
                            className="h-full border-0 mb-4"
                            bodyClass="h-full flex flex-col"
                        >
                            <div className="flex flex-auto w-full h-full gap-4">
                                <ChatSidebar event={data} isHost={isHost} />
                                <ChatBody
                                    data={data}
                                    isHost={isHost}
                                    nextDate={nextDate}
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
