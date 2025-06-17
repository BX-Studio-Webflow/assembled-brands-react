import React, { useEffect, useRef } from 'react'
import Plyr from 'plyr-react'
import 'plyr-react/plyr.css'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import { toast } from '@/components/ui'

interface EventVideoPlayerProps {
    src?: string
    poster?: string
    assetId?: number
    eventId?: number
    onEnded: (
        status: 'ended' | 'suspended' | 'cancelled' | 'live' | 'early',
    ) => void
    isHost: boolean
}

const EventVideoPlayer: React.FC<EventVideoPlayerProps> = ({
    src = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
    poster = 'https://ecme-react.themenate.net/img/landing/hero/hero.webp',
    assetId,
    eventId,
    onEnded,
    isHost,
}) => {
    const playerRef = useRef<any>(null)
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
            const player = playerRef.current?.plyr
            if (player) {
                localStorage.setItem(
                    `video-progress-${assetId}-${eventId}`,
                    player.currentTime.toString(),
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

    const handleAutoPlayFail = () => {
        toast.push(
            <Notification type="danger">
                Ops, video did not play automatically due to restriction from
                your browser. Please press play button to start the video.
            </Notification>,
            {
                placement: 'top-center',
            },
        )
    }

    return (
        <Card className="w-full h-full p-0 m-0">
            <Plyr
                ref={playerRef}
                muted={true}
                autoPlay={true}
                source={{
                    type: 'video',
                    sources: [
                        {
                            src,
                            type: 'video/mp4',
                        },
                    ],
                    poster,
                }}
                options={{
                    controls: isHost
                        ? [
                              'play-large',
                              'play',
                              'current-time',
                              'mute',
                              'volume',
                              'fullscreen',
                              'captions',
                              'settings',
                              'pip',
                              'airplay',
                              'download',
                              'share',
                              'fullscreen',
                              'airplay',
                              'download',
                          ]
                        : [
                              'play-large',
                              'play',
                              'current-time',
                              'mute',
                              'volume',
                              'fullscreen',
                          ],
                    autoplay: true,
                }}
                onEnded={() => onEnded('ended')}
                onError={handleAutoPlayFail}
            />
        </Card>
    )
}

export default EventVideoPlayer
