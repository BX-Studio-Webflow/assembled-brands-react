import ChatList from './ChatList'
import { useChatStore } from '../store/chatStore'
import classNames from '@/utils/classNames'
import { EventStreamResponse } from '@/@types/events'

interface ChatSidebarProps {
    event: EventStreamResponse
    isHost: boolean
    nextDate: { start: Date; end: Date } | null
}

const ChatSidebar = ({ event, isHost, nextDate }: ChatSidebarProps) => {
    const selectedChat = useChatStore((state) => state.selectedChat)

    return (
        <div
            className={classNames(
                'w-full md:w-[400px] md:block',
                selectedChat.id && 'hidden',
            )}
        >
            <ChatList event={event} isHost={isHost} nextDate={nextDate} />
        </div>
    )
}

export default ChatSidebar
