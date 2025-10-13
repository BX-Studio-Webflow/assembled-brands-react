import React, { useMemo, useState } from 'react'
import Loading from '@/components/shared/Loading'
import useSWR from 'swr'
import { useParams, useSearchParams } from 'react-router'
import { EventStreamResponse, EventTimelinesType, LivestreamStatus } from '@/@types/events'
import { apiStreamEvent } from '@/services/EventService'

import EventBody from './components/EventBody'
import EventSidebar from './components/EventSidebar'
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
    const [uiState, setUIState] = useState<LivestreamStatus>('early')
    console.log({ token, email, code, id })
    const swrKey = [`/event/stream/${id}`]
    const { data, isLoading } = useSWR<EventStreamResponse>(
        swrKey,
        () =>
            apiStreamEvent({
                email: email,
                token: token,
                event_id: Number(code || id),
                isHost: isHost,
            }),
        { revalidateOnFocus: false },
    )

    const setEventTimelines = (start: Date, end: Date, event_id: number) => {
        const event_timelines: EventTimelinesType = {
            start: start,
            end: end,
            event_id: event_id,
        }
        localStorage.setItem('event_timelines', JSON.stringify(event_timelines))
    }

    // Compute eventStatus and nextDate
    const { eventStatus, nextDate } = useMemo(() => {
        if (!data?.event.memberships?.length)
            return {
                eventStatus: undefined,
                nextDate: null,
                membershipId: null,
            }
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


        let status: LivestreamStatus = 'early'
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
            setEventTimelines(next.start, next.end, data.event.id)
        }

        // Override with UI state if it's been set
        if (uiState !== 'early') {
            status = uiState
            if (status === 'live' && next) {
                setEventTimelines(next.start, next.end, data.event.id)
            }
        }

        return { eventStatus: status, nextDate: next }
    }, [data, uiState])



    const handleStatusUpdate = async (status: LivestreamStatus) => {
        if (status === 'ended' && token && email && code) {
            await apiRecordLeaveEvent({
                token: token,
                email: email,
                code: code,
                scenario: 'VIDEO_ENDED',
            })
        }
        setUIState(status)
    }

    const handleUIStateChange = (uiStatus: LivestreamStatus) => {
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
