import { useMemo, memo } from 'react'

import EventVideoPlayer from '@/views/concepts/events/EventStream/components/EventVideoPlayer'
import { EventStreamResponse, LivestreamStatus } from '@/@types/events'

// Memoized Video Player to prevent re-renders
const MemoizedEventVideoPlayer = memo(EventVideoPlayer)

const ChatBody = ({
    data,
    onStatusUpdate,
    isHost,
    nextDate,
    membershipId,
}: {
    data: EventStreamResponse
    onStatusUpdate: (status: LivestreamStatus) => void
    isHost: boolean
    nextDate: { start: Date; end: Date } | null
    membershipId: number
}) => {
    // Memoize video player props to prevent unnecessary re-renders
    const videoPlayerProps = useMemo(
        () => ({
            isHost,
            normal_presigned_url: data.event.asset.presignedUrl || '',
            hls_presigned_url: data.event.asset.hls_presigned_url || '',
            assetId: data.event.asset.id,
            eventId: data.event.id,
            onEnded: () => onStatusUpdate('ended'),
            nextDate,
            membershipId,
            poster: data.event.asset.image_presigned_url || '',
        }),
        [
            isHost,
            data.event.asset.presignedUrl,
            data.event.asset.hls_presigned_url,
            data.event.asset.id,
            data.event.id,
            onStatusUpdate,
            nextDate,
            membershipId,
            data.event.asset.image_presigned_url,
        ],
    )

    return (
        <div className="w-full rounded-2xl">
            <MemoizedEventVideoPlayer {...videoPlayerProps} />
        </div>
    )
}

export default ChatBody
