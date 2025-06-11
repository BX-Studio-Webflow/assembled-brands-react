import ChatList from './ChatList'
import { useChatStore } from '../store/chatStore'
import classNames from '@/utils/classNames'
import { EventStreamResponse } from '@/@types/events'

interface ChatSidebarProps {
    event: EventStreamResponse
}

const ChatSidebar = ({ event }: ChatSidebarProps) => {
    const selectedChat = useChatStore((state) => state.selectedChat)
    console.log(event)
    return (
        <div
            className={classNames(
                'w-full md:w-[300px] md:block',
                selectedChat.id && 'hidden',
            )}
        >
            <ChatList event={event} />
        </div>
    )
}

export default ChatSidebar
