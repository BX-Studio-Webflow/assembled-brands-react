import { useMemo, memo } from 'react'

import EventVideoPlayer from '@/views/concepts/events/EventStream/components/EventVideoPlayer'
import { EventStreamResponse } from '@/@types/events'
import ChatStats from './ChatStats'

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
            {/* Video Player - Takes 1/2 of the height */}
            <div className="h-2/3 w-full rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <MemoizedEventVideoPlayer {...videoPlayerProps} />
            </div>

            {/* Chat Body - Takes 1/2 of the height */}
            <div className="h-1/3 w-full mt-4">
                <ChatStats eventId={data.event.id} isHost={isHost} />
            </div>
        </div>
    )
}

export default ChatBody
