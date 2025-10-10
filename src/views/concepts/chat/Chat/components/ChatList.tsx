import { useEffect, useMemo, useRef } from 'react'

import { useChatStore } from '../store/chatStore'
import useChat from '../hooks/useChat'
import { TbChevronLeft } from 'react-icons/tb'
import { Avatar, Card, ScrollBarRef } from '@/components/ui'
import { EventDateCombination, EventStreamResponse, LivestreamStatus } from '@/@types/events'
import ChatBox from '@/components/view/ChatBox'
import useResponsive from '@/utils/hooks/useResponsive'
import dayjs from 'dayjs'
//import ChatAction from './ChatAction'
import useAuth from '@/auth/useAuth'

interface ChatListProps {
    event: EventStreamResponse
    isHost: boolean
    nextDate: EventDateCombination
    eventStatus: LivestreamStatus
}

const ChatList = ({ event, isHost, nextDate ,eventStatus }: ChatListProps) => {
    console.log({ nextDate, eventStatus })
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
            if (!value) return
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
                                <Avatar
                                    size={40}
                                    src={
                                        event.event.host.profile_image ||
                                        '/img/avatars/user.png'
                                    }
                                    shape="circle"
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between">
                                    <div className="font-bold heading-text truncate">
                                        Live chat
                                    </div>
                                </div>
                                <div>Team member is online</div>
                            </div>
                        </button>
                    </div>
                ),
                extra: (
                    <div>
                        <div></div>
                    </div>
                ),
                className: 'bg-gray-100 dark:bg-gray-600 h-[100px]',
            },
        }),
        [smaller.md, setSelectedChat, selectedChat.muted, event.event.host],
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
        //past messages before nextDate will not be shown
        const filteredMessages = messages.filter((item) => {
            const messageTimestamp = dayjs(item.timestamp)
            return eventStatus === 'ended' ? true : messageTimestamp.isAfter(nextDate?.start)
        })
        return filteredMessages.map((item) => {
            // First determine who the current user is in this event context
            const currentUserId =
                event.lead?.id?.toString() ||
                event.event.host.id?.toString() ||
                user?.id?.toString()

            // Then check if the message sender is the current user
            const isCurrentUserSender = item.senderId === currentUserId

            const isHostMessage =
                item.senderId === event.event.host.id?.toString()
            return {
                id: item.id,
                sender: {
                    id: item.senderId,
                    name: item.name,
                    avatarImageUrl: isHostMessage
                        ? event.event.host.profile_image
                        : '/img/avatars/user.png',
                },
                content: item.text,
                verified: isHostMessage,
                timestamp: dayjs(item.timestamp).toDate(),
                type: 'regular' as const,
                isMyMessage: isCurrentUserSender,
                showAvatar: !isCurrentUserSender,
            }
        })
    }, [messages, user, event.lead, event.event.host])

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
