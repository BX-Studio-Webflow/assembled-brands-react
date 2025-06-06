import React from 'react'
import { useParams } from 'react-router'
import useSWR from 'swr'
import { EventStreamResponse } from '@/@types/events'
import { apiStreamEvent } from '@/services/EventService'
import { EventProvider } from '../context/EventContext'
import EventHeader from './EventHeader'

const EventHeaderWrapper = () => {
    const { id } = useParams()

    const { data, isLoading } = useSWR<EventStreamResponse>(
        [`/event/stream/${id}`],
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

    return (
        <EventProvider value={{ data: data || null, isLoading }}>
            <EventHeader />
        </EventProvider>
    )
}

export default EventHeaderWrapper
