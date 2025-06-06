import Segment from '@/components/ui/Segment'
import { TbUserCircle, TbUsers } from 'react-icons/tb'
import { useChatStore } from '../store/chatStore'
import type { TabType } from '../types'

const ChatSegment = () => {
    const selectedTabType = useChatStore((state) => state.selectedTabType)
    const setselectedTabType = useChatStore(
        (state) => state.setselectedTabType,
    )

    return (
        <Segment
            className="w-full"
            value={selectedTabType}
            onChange={(value) => setselectedTabType(value as TabType)}
        >
            <Segment.Item className="flex-1" value="event">
                <div className="flex items-center justify-center gap-2">
                    <TbUsers className="text-xl" />
                    <span>Event</span>
                </div>
            </Segment.Item>
            <Segment.Item className="flex-1" value="chat">
                <div className="flex items-center justify-center gap-2">
                    <TbUserCircle className="text-xl" />
                    <span>Chat</span>
                </div>
            </Segment.Item>
        </Segment>
    )
}

export default ChatSegment
