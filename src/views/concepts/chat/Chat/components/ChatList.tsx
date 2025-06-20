import { useEffect, useMemo, useRef } from 'react'

import { useChatStore } from '../store/chatStore'
import useChat from '../hooks/useChat'
import { TbChevronLeft } from 'react-icons/tb'
import { Card, ScrollBarRef } from '@/components/ui'
import { EventStreamResponse } from '@/@types/events'
import ChatBox from '@/components/view/ChatBox'
import NoUserFound from '@/assets/svg/NoUserFound'
import useResponsive from '@/utils/hooks/useResponsive'
import dayjs from 'dayjs'
import ChatAction from './ChatAction'
import useAuth from '@/auth/useAuth'

interface ChatListProps {
    event: EventStreamResponse
    isHost: boolean
}

const ChatList = ({ event, isHost }: ChatListProps) => {
    const chatsFetched = useChatStore((state) => state.chatsFetched)
    const { user } = useAuth()

    const { fetchChats } = useChat()

    useEffect(() => {
        if (!chatsFetched) {
            fetchChats()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const scrollRef = useRef<ScrollBarRef>(null)
    const selectedChat = useChatStore((state) => state.selectedChat)
    const messages = useChatStore((state) => state.messages)
    const sendMessage = useChatStore((state) => state.sendMessage)
    const subscribeToMessages = useChatStore(
        (state) => state.subscribeToMessages,
    )
    const setSelectedChat = useChatStore((state) => state.setSelectedChat)

    const { smaller } = useResponsive()

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    const handleInputChange = async ({
        value,
        attachments,
    }: {
        value: string
        attachments?: File[]
    }) => {
        try {
            const senderId =
                event.lead?.id?.toString() ||
                event.event.host.id?.toString() ||
                user?.id?.toString()
            const name = event.lead?.name || event.event.host.name || user?.name
            await sendMessage(
                senderId,
                name,
                value,
                isHost,
                event.event.id.toString(),
            )

            if (attachments?.length) {
                // TODO: Handle file uploads
                console.log('File attachments:', attachments)
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    const cardHeaderProps = useMemo(
        () => ({
            header: {
                content: (
                    <div className="flex items-center gap-2">
                        {smaller.md && (
                            <button
                                className="text-xl hover:text-primary"
                                onClick={() => setSelectedChat({})}
                            >
                                <TbChevronLeft />
                            </button>
                        )}
                        <button
                            className="flex items-center gap-2"
                            role="button"
                        >
                            <div>
                                <NoUserFound height={40} width={40} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between">
                                    <div className="font-bold heading-text truncate">
                                        Event chat
                                    </div>
                                </div>
                                <div>Chat with your host</div>
                            </div>
                        </button>
                    </div>
                ),
                extra: <ChatAction muted={selectedChat.muted} />,
                className: 'bg-gray-100 dark:bg-gray-600 h-[100px]',
            },
        }),
        [smaller.md, setSelectedChat, selectedChat.muted],
    )

    useEffect(() => {
        if (event.event.id) {
            subscribeToMessages(event.event.id.toString())
        }
    }, [event.event.id, subscribeToMessages])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const messageList = useMemo(() => {
        console.log(messages)
        return messages.map((item) => {
            // Determine if the current user is the sender
            // Check in order: event.lead -> event.host -> currentUser from auth
            const isCurrentUserSender =
                item.senderId === event.lead?.id?.toString() ||
                item.senderId === event.event.host.id?.toString() ||
                item.senderId === user?.id?.toString()

            return {
                id: item.id,
                sender: {
                    id: item.senderId,
                    name: item.name,
                    avatarImageUrl: '/img/avatars/thumb-1.jpg', // TODO: Replace with actual avatar
                },
                content: item.text,
                timestamp: dayjs(item.timestamp).toDate(),
                type: 'regular' as const,
                isMyMessage: isCurrentUserSender,
                showAvatar: !isCurrentUserSender,
            }
        })
    }, [messages, user?.id, event.lead?.id, event.event.host.id])

    return (
        <div className="flex flex-col h-full">
            <Card
                className="h-full dark:border-gray-700"
                bodyClass="h-[calc(100%-100px)] relative"
                {...cardHeaderProps}
            >
                <ChatBox
                    ref={scrollRef}
                    messageList={messageList}
                    placeholder="Enter a message here"
                    showAvatar={true}
                    avatarGap={true}
                    messageListClass="h-[calc(100%-100px)]"
                    bubbleClass="max-w-[300px]"
                    onInputChange={handleInputChange}
                />
            </Card>
        </div>
    )
}

export default ChatList
