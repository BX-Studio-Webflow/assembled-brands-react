import React from 'react'
import Loading from '@/components/shared/Loading'
import useSWR from 'swr'
import { useParams } from 'react-router'
import { EventStreamResponse } from '@/@types/events'
import { apiStreamEvent } from '@/services/EventService'
import ContactInfoDrawer from '../../chat/Chat/components/ContactInfoDrawer'
import ChatBody from '../../chat/Chat/components/ChatBody'
import ChatSidebar from '../../chat/Chat/components/ChatSidebar'
import Card from '@/components/ui/Card'
import { EventProvider } from './context/EventContext'

const EventStream = () => {
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

    console.log('EventStream - SWR data:', data)
    console.log('EventStream - isLoading:', isLoading)

    return (
        <EventProvider value={{ data: data || null, isLoading }}>
            <Loading loading={isLoading}>
                {data && (
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
                        <ContactInfoDrawer />
                    </>
                )}
            </Loading>
        </EventProvider>
    )
}

export default EventStream
