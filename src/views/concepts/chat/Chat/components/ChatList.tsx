import { useEffect, useMemo, useRef } from 'react'

import { useChatStore } from '../store/chatStore'
import useChat from '../hooks/useChat'
import { TbChevronLeft, TbExternalLink, TbMail } from 'react-icons/tb'
import { Link, useSearchParams } from 'react-router'
import { Avatar, Card, ScrollBarRef } from '@/components/ui'
import { IconText } from '@/components/shared'
import { EventStreamResponse } from '@/@types/events'
import ChatBox from '@/components/view/ChatBox'
import NoUserFound from '@/assets/svg/NoUserFound'
import useResponsive from '@/utils/hooks/useResponsive'
import dayjs from 'dayjs'
import ChatAction from './ChatAction'

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
            await sendMessage(
                '1', // TODO: Replace with actual user ID
                'Angelina Gotelli', // TODO: Replace with actual user name
                value,
                false, // TODO: Replace with actual host status
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
        return messages.map((item) => ({
            id: item.id,
            sender: {
                id: item.senderId,
                name: item.name,
                avatarImageUrl: '/img/avatars/thumb-1.jpg', // TODO: Replace with actual avatar
            },
            content: item.text,
            timestamp: dayjs(item.timestamp).toDate(),
            type: 'regular' as const,
            isMyMessage: item.senderId === '1', // TODO: Replace with actual user ID
            showAvatar: item.senderId !== '1', // TODO: Replace with actual user ID
        }))
    }, [messages])

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
                <Card
                    className="h-full dark:border-gray-700"
                    bodyClass="h-[calc(100%-100px)] relative"
                    {...cardHeaderProps}
                >
                    <ChatBox
                        ref={scrollRef}
                        messageList={messageList}
                        placeholder="Enter a prompt here"
                        showAvatar={true}
                        avatarGap={true}
                        messageListClass="h-[calc(100%-100px)]"
                        bubbleClass="max-w-[300px]"
                        onInputChange={handleInputChange}
                    />
                </Card>
            )}
        </div>
    )
}

export default ChatList
