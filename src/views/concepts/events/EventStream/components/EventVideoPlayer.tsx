import Card from '@/components/ui/Card'
import {
    MediaPlayer,
    MediaProvider,
    Poster,
    type MediaPlayerInstance,
} from '@vidstack/react'
import React, { useEffect, useRef } from 'react'
import '@vidstack/react/player/styles/default/layouts/video.css'
import '@vidstack/react/player/styles/default/theme.css'
import Notification from '@/components/ui/Notification'

import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'
import { toast } from '@/components/ui'

interface EventVideoPlayerProps {
    src?: string
    poster?: string
    assetId?: number
    eventId?: number
    onEnded: (status: 'ended' | 'suspended' | 'cancelled' | 'live' | 'early') => void
}

const onAutoPlay = () => {
    console.log('onAutoPlay - success')
}
const onAutoPlayFail = () => {
    console.log('onAutoPlayFail - failed')
    toast.push(
        <Notification type="danger">
            Ops, video did not play automatically due to restriction from your
            browser. Please press play button to start the video.
        </Notification>,
        {
            placement: 'top-center',
        },
    )
}

const EventVideoPlayer: React.FC<EventVideoPlayerProps> = ({
    src = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
    poster = 'https://ecme-react.themenate.net/img/landing/hero/hero.webp',
    assetId,
    eventId,
    onEnded,
}) => {
    const playerRef = useRef<MediaPlayerInstance>(null)
    const progressIntervalRef = useRef<NodeJS.Timeout>(null)

    useEffect(() => {
        // Load saved progress when component mounts
        const savedProgress = localStorage.getItem(
            `video-progress-${assetId}-${eventId}`,
        )
        if (savedProgress && playerRef.current) {
            playerRef.current.currentTime = parseFloat(savedProgress)
        }

        // Set up interval to save progress every 3 seconds
        progressIntervalRef.current = setInterval(() => {
            if (playerRef.current) {
                const currentTime = playerRef.current.currentTime
                localStorage.setItem(
                    `video-progress-${assetId}-${eventId}`,
                    currentTime.toString(),
                )
            }
        }, 3000)

        // Cleanup interval on unmount
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current)
            }
        }
    }, [src, assetId, eventId])

    return (
        <Card className="w-full h-full p-0 m-0">
            <MediaPlayer
                ref={playerRef}
                autoPlay
                muted
                title="..."
                storage={`video-storage-${assetId}-${eventId}`}
                src={src}
                className="w-full h-full"
                onAutoPlayFail={onAutoPlayFail}
                onAutoPlay={onAutoPlay}
                onEnded={() => onEnded('ended')}
            >
                <MediaProvider className="w-full h-full">
                    <Poster src={poster} alt="..." className="w-full h-full" />
                </MediaProvider>

                <DefaultVideoLayout
                    thumbnails="thumbnails.vtt"
                    icons={defaultLayoutIcons}
                />
            </MediaPlayer>
        </Card>
    )
}

export default EventVideoPlayer
