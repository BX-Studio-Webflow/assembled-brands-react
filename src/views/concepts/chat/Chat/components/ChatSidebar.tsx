import ChatList from './ChatList'
import { useChatStore } from '../store/chatStore'
import classNames from '@/utils/classNames'
import { EventStreamResponse } from '@/@types/events'

interface ChatSidebarProps {
    event: EventStreamResponse
    isHost: boolean
}

const ChatSidebar = ({ event, isHost }: ChatSidebarProps) => {
    const selectedChat = useChatStore((state) => state.selectedChat)

    return (
        <div
            className={classNames(
                'w-full md:w-[400px] md:block',
                selectedChat.id && 'hidden',
            )}
        >
            <ChatList event={event} isHost={isHost} />
        </div>
    )
}

export default ChatSidebar
