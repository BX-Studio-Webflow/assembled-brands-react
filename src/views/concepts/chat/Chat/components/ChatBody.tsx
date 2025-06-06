import { useState, useEffect, useRef, useMemo } from 'react'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import ChatBox from '@/components/view/ChatBox'
import ChatAction from './ChatAction'
import { useChatStore } from '../store/chatStore'
import classNames from '@/utils/classNames'
import useResponsive from '@/utils/hooks/useResponsive'
import dayjs from 'dayjs'
import {
    TbChevronLeft,
    TbPictureInPicture,
    TbMaximize,
    TbMinimize,
} from 'react-icons/tb'
import type { ChatType } from '../types'
import type { ScrollBarRef } from '@/components/view/ChatBox'
import EventVideoPlayer from '@/views/concepts/orders/EventStream/components/EventVideoPlayer'
import { EventStreamResponse } from '@/@types/events'
import NoUserFound from '@/assets/svg/NoUserFound'

const ChatBody = ({ data }: { data: EventStreamResponse }) => {
    const scrollRef = useRef<ScrollBarRef>(null)
    const selectedChat = useChatStore((state) => state.selectedChat)
    const selectedTabType = useChatStore((state) => state.selectedTabType)
    const messages = useChatStore((state) => state.messages)
    const sendMessage = useChatStore((state) => state.sendMessage)
    const subscribeToMessages = useChatStore(
        (state) => state.subscribeToMessages,
    )
    const setSelectedChat = useChatStore((state) => state.setSelectedChat)
    const setContactInfoDrawer = useChatStore(
        (state) => state.setContactInfoDrawer,
    )
    const [isVideoPiP, setIsVideoPiP] = useState(false)
    const [isFullSize, setIsFullSize] = useState(false)

    const { smaller } = useResponsive()

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    const handleProfileClick = () => {
        setContactInfoDrawer({
            userId: selectedChat.user?.id as string,
            chatId: selectedChat.id as string,
            chatType: selectedChat.chatType as ChatType,
            open: true,
        })
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

    const cardHeaderProps = {
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
                        onClick={handleProfileClick}
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
    }

    useEffect(() => {
        if (data.event.id) {
            subscribeToMessages(data.event.id.toString())
        }
    }, [data.event.id, subscribeToMessages])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Automatically enable PiP when a chat is selected
    useEffect(() => {
        if (selectedChat.id) {
            setIsVideoPiP(true)
        } else {
            setIsVideoPiP(false)
        }
    }, [selectedChat.id])

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

    const togglePiP = () => {
        setIsVideoPiP(!isVideoPiP)
        if (!isVideoPiP) {
            setIsFullSize(false)
        }
    }

    const toggleFullSize = () => {
        setIsFullSize(!isFullSize)
    }

    return (
        <div className="w-full md:block">
            {selectedTabType === 'chat' ? (
                <Card
                    className="flex-1 h-full max-h-full dark:border-gray-700"
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
            ) : (
                <div className="flex-1 h-full max-h-full flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 p-0 m-0">
                    <EventVideoPlayer src={data.event.asset.presignedUrl} />
                </div>
            )}
            {isVideoPiP && selectedTabType === 'event' && (
                <div
                    className={classNames(
                        'fixed z-50 rounded-lg overflow-hidden shadow-lg transition-all duration-300',
                        isFullSize
                            ? 'top-0 right-0 w-full h-full'
                            : 'top-4 right-4 w-160 h-96',
                    )}
                >
                    <div className="relative w-full h-full">
                        <EventVideoPlayer src={data.event.asset.presignedUrl} />
                        <button
                            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                            onClick={togglePiP}
                        >
                            <TbPictureInPicture />
                        </button>
                        <button
                            className="absolute top-2 right-12 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
                            onClick={toggleFullSize}
                        >
                            {isFullSize ? <TbMinimize /> : <TbMaximize />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatBody
