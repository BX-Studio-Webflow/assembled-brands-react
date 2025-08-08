import ChatList from '../../../chat/Chat/components/ChatList'
import { useChatStore } from '../../../chat/Chat/store/chatStore'
import classNames from '@/utils/classNames'
import { EventStreamResponse } from '@/@types/events'

interface EventSidebarProps {
    event: EventStreamResponse
    isHost: boolean
    nextDate: { start: Date; end: Date } | null
}

const EventSidebar = ({ event, isHost, nextDate }: EventSidebarProps) => {
    const selectedChat = useChatStore((state) => state.selectedChat)

    return (
        <div
            className={classNames(
                'w-full lg:w-[400px] lg:block min-h-[400px]',
                selectedChat.id && 'hidden lg:block',
            )}
        >
            <ChatList event={event} isHost={isHost} nextDate={nextDate} />
        </div>
    )
}

export default EventSidebar
