import { useEffect, useRef, useMemo, memo } from 'react'
import Card from '@/components/ui/Card'
import ChatBox from '@/components/view/ChatBox'
import ChatAction from './ChatAction'
import { useChatStore } from '../store/chatStore'
import useResponsive from '@/utils/hooks/useResponsive'
import dayjs from 'dayjs'
import { TbChevronLeft } from 'react-icons/tb'

import type { ScrollBarRef } from '@/components/view/ChatBox'
import EventVideoPlayer from '@/views/concepts/events/EventStream/components/EventVideoPlayer'
import { EventStreamResponse } from '@/@types/events'
import NoUserFound from '@/assets/svg/NoUserFound'

// Memoized Video Player to prevent re-renders
const MemoizedEventVideoPlayer = memo(EventVideoPlayer)

const ChatBody = ({
    data,
    onStatusUpdate,
    isHost,
}: {
    data: EventStreamResponse
    onStatusUpdate: (
        status: 'active' | 'suspended' | 'cancelled' | 'ended',
    ) => void
    isHost: boolean
}) => {
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
                data.event.id.toString(),
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
        if (data.event.id) {
            subscribeToMessages(data.event.id.toString())
        }
    }, [data.event.id, subscribeToMessages])

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

    // Memoize video player props to prevent unnecessary re-renders
    const videoPlayerProps = useMemo(
        () => ({
            isHost,
            src: data.event.asset.presignedUrl,
            assetId: data.event.asset.id,
            eventId: data.event.id,
            onEnded: () => onStatusUpdate('ended'),
        }),
        [
            isHost,
            data.event.asset.presignedUrl,
            data.event.asset.id,
            data.event.id,
            onStatusUpdate,
        ],
    )

    return (
        <div className="w-full h-full flex flex-col">
            {/* Video Player - Takes 2/3 of the height */}
            <div className="h-2/3 w-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <MemoizedEventVideoPlayer {...videoPlayerProps} />
            </div>

            {/* Chat Body - Takes 1/3 of the height */}
            <div className="h-1/3 w-full mt-4">
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
            </div>
        </div>
    )
}

export default ChatBody
