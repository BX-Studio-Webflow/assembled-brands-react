import ChatList from '../../../chat/Chat/components/ChatList'
import { useChatStore } from '../../../chat/Chat/store/chatStore'
import classNames from '@/utils/classNames'
import {
    EventDateCombination,
    EventStreamResponse,
    LivestreamStatus,
} from '@/@types/events'

interface EventSidebarProps {
    event: EventStreamResponse
    isHost: boolean
    nextDate: EventDateCombination
    eventStatus: LivestreamStatus
}

const EventSidebar = ({
    event,
    isHost,
    nextDate,
    eventStatus,
}: EventSidebarProps) => {
    const selectedChat = useChatStore((state) => state.selectedChat)

    return (
        <div
            className={classNames(
                'w-full lg:w-[400px] lg:block min-h-[400px] h-full',
                selectedChat.id && 'hidden lg:block',
            )}
        >
            <ChatList
                event={event}
                isHost={isHost}
                nextDate={nextDate}
                eventStatus={eventStatus}
            />
        </div>
    )
}

export default EventSidebar
