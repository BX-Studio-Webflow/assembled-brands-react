import { useEffect } from 'react'

import { useChatStore } from '../store/chatStore'
import useChat from '../hooks/useChat'
import { TbExternalLink, TbMail } from 'react-icons/tb'
import ChatStats from './ChatStats'
import { Link, useSearchParams } from 'react-router'
import { Avatar, Card } from '@/components/ui'
import { IconText } from '@/components/shared'
import { EventStreamResponse } from '@/@types/events'

interface ChatListProps {
    event: EventStreamResponse
    isHost: boolean
}

const ChatList = ({ event, isHost }: ChatListProps) => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const code = searchParams.get('code')
    const chatsFetched = useChatStore((state) => state.chatsFetched)

    const { fetchChats } = useChat()

    useEffect(() => {
        if (!chatsFetched) {
            fetchChats()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="flex flex-col h-full">
            {token && email && code ? (
                <Card>
                    <h4 className="mb-4">Host</h4>
                    {event?.event?.host && (
                        <Link
                            className="group flex items-center justify-between"
                            to="/concepts/customers/customer-details/11"
                        >
                            <div className="flex items-center gap-2">
                                <Avatar
                                    shape="circle"
                                    src={event.event.host.profile_image || ''}
                                />
                                <div>
                                    <div className="font-bold heading-text">
                                        {event.event.host.name || ''}
                                    </div>
                                    <span>
                                        <span className="font-semibold">
                                            {event.event.host.email || ''}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <TbExternalLink className="text-xl hidden group-hover:block" />
                        </Link>
                    )}
                    <hr className="my-5" />
                    {event?.event?.host && (
                        <IconText
                            className="mb-4"
                            icon={<TbMail className="text-xl opacity-70" />}
                        >
                            <span>{event.event.host.email || ''}</span>
                        </IconText>
                    )}
                </Card>
            ) : (
                <ChatStats eventId={event.event.id} isHost={isHost} />
            )}
        </div>
    )
}

export default ChatList
