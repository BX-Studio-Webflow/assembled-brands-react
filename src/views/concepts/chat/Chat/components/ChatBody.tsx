import { useMemo, memo } from 'react'

import EventVideoPlayer from '@/views/concepts/events/EventStream/components/EventVideoPlayer'
import { EventStreamResponse } from '@/@types/events'

// Memoized Video Player to prevent re-renders
const MemoizedEventVideoPlayer = memo(EventVideoPlayer)

const ChatBody = ({
    data,
    onStatusUpdate,
    isHost,
    nextDate,
}: {
    data: EventStreamResponse
    onStatusUpdate: (
        status: 'active' | 'suspended' | 'cancelled' | 'ended',
    ) => void
    isHost: boolean
    nextDate: { start: Date; end: Date } | null
}) => {
    // Memoize video player props to prevent unnecessary re-renders
    const videoPlayerProps = useMemo(
        () => ({
            isHost,
            src: data.event.asset.presignedUrl,
            assetId: data.event.asset.id,
            eventId: data.event.id,
            onEnded: () => onStatusUpdate('ended'),
            nextDate,
        }),
        [
            isHost,
            data.event.asset.presignedUrl,
            data.event.asset.id,
            data.event.id,
            onStatusUpdate,
            nextDate,
        ],
    )

    return (
        <div className="w-full rounded-2xl">
            <MemoizedEventVideoPlayer {...videoPlayerProps} />
        </div>
    )
}

export default ChatBody
