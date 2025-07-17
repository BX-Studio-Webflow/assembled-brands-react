import React, { useEffect, useRef } from 'react'
import Plyr from 'plyr'
import Hls from 'hls.js'
import 'plyr/dist/plyr.css'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import { toast } from '@/components/ui'
import useQuery from '@/utils/hooks/useQuery'
import { apiCreateTelemetry } from '@/services/TelemetryService'
import { LivestreamStatus } from '@/@types/events'
import WebSocketSyncManager from '@/utils/websocketSync'

interface NavigatorWithAutoplayPolicy extends Navigator {
    getAutoplayPolicy(type: string): string
}

interface EventVideoPlayerProps {
    normal_presigned_url: string
    hls_presigned_url: string
    poster: string
    assetId: number
    eventId: number
    membershipId: number
    onStatusUpdate: (status: LivestreamStatus) => void
    isHost: boolean
    nextDate: { start: Date; end: Date } | null
}

const EventVideoPlayer: React.FC<EventVideoPlayerProps> = ({
    normal_presigned_url = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
    hls_presigned_url = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
    assetId,
    eventId,
    membershipId,
    onStatusUpdate,
    isHost,
    nextDate,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<Plyr | null>(null)
    const hlsRef = useRef<Hls | null>(null)
    const progressIntervalRef = useRef<number | null>(null)
    const wsSyncRef = useRef<WebSocketSyncManager | null>(null)
    const query = useQuery()

    // Get token, email, and code from URL parameters
    const token = query.get('token') || ''
    const email = query.get('email') || ''
    const code = query.get('code') || ''

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const STORAGE_KEY = `video-progress-${assetId}-${eventId}`

        // Initialize WebSocket synchronization
        if (eventId) {
            wsSyncRef.current = new WebSocketSyncManager(
                eventId,
                nextDate?.start ? new Date(nextDate.start).getTime() : 0,
                nextDate?.end ? new Date(nextDate.end).getTime() : 0,
                {
                    onTimeSync: (serverTime) => {
                        if (playerRef.current) {
                            // Calculate time elapsed since stream start
                            const streamStartTime = nextDate?.start
                                ? new Date(nextDate.start).getTime()
                                : 0
                            const timeElapsed = Math.max(
                                0,
                                (serverTime * 1000 - streamStartTime) / 1000,
                            )

                            const timeDiff = Math.abs(
                                playerRef.current.currentTime - timeElapsed,
                            )
                            if (timeDiff > 1) {
                                // If drift is more than 1 seconds
                                console.log(
                                    `🔄 Syncing to server time: ${timeElapsed}s (drift: ${timeDiff.toFixed(1)}s)`,
                                )
                                playerRef.current.currentTime = timeElapsed
                            }
                        }
                    },

                    onConnected: (clientId) => {
                        console.log('🔗 WebSocket connected:', clientId)
                    },
                    onError: (error) => {
                        console.error('❌ WebSocket error:', error)
                    },
                    onClose: () => {
                        console.log('🔌 WebSocket disconnected')
                    },
                    onEventEnded: (eventId) => {
                        console.log('🔴 Event ended:', eventId)
                        onStatusUpdate('ended')
                    },
                },
            )
            wsSyncRef.current.connect()
        }

        // Create video element
        const video = document.createElement('video')
        video.setAttribute('playsinline', '')
        video.setAttribute('autoplay', '')
        video.setAttribute('muted', '')
        video.style.borderRadius = 'none'
        video.style.boxShadow = 'none'
        video.style.margin = 'none'
        Object.assign(video.style, {
            '--shadow-color': 'none',
        })
        container.appendChild(video)

        const controls = isHost
            ? ['current-time', 'mute', 'volume', 'fullscreen']
            : ['current-time', 'mute', 'volume', 'fullscreen']

        const startPlayback = (videoElement: HTMLVideoElement) => {
            playerRef.current = new Plyr(videoElement, {
                autoplay: true,
                muted: true,
                controls,
                clickToPlay: false,
            })

            // Check autoplay policy
            if ('getAutoplayPolicy' in navigator) {
                const autoplayPolicy = (
                    navigator as NavigatorWithAutoplayPolicy
                ).getAutoplayPolicy('mediaelement')
                console.log('Autoplay policy:', autoplayPolicy)

                if (autoplayPolicy === 'disallowed') {
                    toast.push(
                        <Notification type="danger">
                            Autoplay is not allowed. Please press the play
                            button to start the stream
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                    return
                }
            }

            // Calculate current time position based on nextDate.start
            if (nextDate?.start) {
                const streamStartTime = new Date(nextDate.start).getTime()
                const currentTime = Date.now()
                const timeElapsed = Math.max(
                    0,
                    (currentTime - streamStartTime) / 1000,
                ) // Convert to seconds

                console.log('Stream start time:', new Date(streamStartTime))
                console.log('Current time:', new Date(currentTime))

                videoElement.addEventListener('loadedmetadata', () => {
                    console.log('VIDEO READY: SEEKING TO:', timeElapsed)
                    if (timeElapsed <= videoElement.duration) {
                        videoElement.currentTime = timeElapsed
                    }
                })

                videoElement.addEventListener('error', (e) => {
                    console.log('VIDEO ERROR:', e)
                    const error = videoElement.error
                    if (!error) return

                    switch (error.code) {
                        case error.MEDIA_ERR_ABORTED:
                            console.log('Playback aborted.')
                            break
                        case error.MEDIA_ERR_NETWORK:
                            console.log('Network error during video download.')
                            break
                        case error.MEDIA_ERR_DECODE:
                            console.log('Decoding error.')
                            break
                        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                            console.log('Video source not supported.')
                            break
                        default:
                            console.log('An unknown error occurred.')
                            break
                    }
                })
            }
            videoElement.muted = true

            // Save progress periodically and broadcast time sync (host only)
            progressIntervalRef.current = window.setInterval(() => {
                if (videoElement.currentTime > 30) {
                    localStorage.setItem(
                        STORAGE_KEY,
                        videoElement.currentTime.toString(),
                    )
                }
            }, 3000) as unknown as number

            // Save progress on pause
            playerRef.current.on('pause', () => {
                localStorage.setItem(
                    STORAGE_KEY,
                    videoElement.currentTime.toString(),
                )
            })

            // Handle autoplay errors
            playerRef.current.on('error', () => {
                const { error } = videoElement
                toast.push(
                    <Notification type="danger">
                        An error occurred while playing this video
                    </Notification>,
                    {
                        placement: 'top-center',
                    },
                )
                console.error(error)
                if (error?.code === 4) {
                    // MEDIA_ERR_ABORTED
                    toast.push(
                        <Notification type="danger">
                            Autoplay was blocked due to browser policy. Please
                            press the play button to start the stream
                        </Notification>,
                        {
                            placement: 'top-center',
                        },
                    )
                }
            })

            playerRef.current.on('ended', () => {
                onStatusUpdate('ended')
                console.log('VIDEO ENDED')
            })

            // Host controls that broadcast to all clients

            // Save progress before unload
            window.addEventListener('beforeunload', () => {
                localStorage.setItem(
                    STORAGE_KEY,
                    videoElement.currentTime.toString(),
                )
            })
        }

        // Check if the video URL is an HLS stream (.m3u8)
        if (Hls.isSupported() && hls_presigned_url) {
            // Create Hls instance
            hlsRef.current = new Hls({
                liveSyncDurationCount: 2, // reduce latency
                maxLiveSyncPlaybackRate: 1.0, // prevent skipping ahead too fast
                enableWorker: true,
            })
            hlsRef.current.loadSource(hls_presigned_url)
            hlsRef.current.attachMedia(video)

            // Handle HLS manifest parsed event
            hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
                startPlayback(video)
            })

            // Handle HLS errors
            hlsRef.current.on(Hls.Events.ERROR, (_, data) => {
                console.error('HLS error:', data)
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            toast.push(
                                <Notification type="warning">
                                    Network error, attempting to recover...
                                </Notification>,
                                {
                                    placement: 'top-center',
                                },
                            )
                            hlsRef.current?.startLoad()
                            break
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            toast.push(
                                <Notification type="warning">
                                    Media error, attempting to recover...
                                </Notification>,
                                {
                                    placement: 'top-center',
                                },
                            )
                            hlsRef.current?.recoverMediaError()
                            break
                        default:
                            toast.push(
                                <Notification type="danger">
                                    Fatal HLS error, destroying...
                                </Notification>,
                                {
                                    placement: 'top-center',
                                },
                            )
                            cleanup()
                            break
                    }
                }
            })
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Fallback for Safari which has native HLS support
            video.src = hls_presigned_url

            video.addEventListener('loadedmetadata', () => {
                startPlayback(video)
            })
        } else {
            // Regular video playback
            video.setAttribute('src', normal_presigned_url)
            startPlayback(video)
        }

        const cleanup = () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current)
                progressIntervalRef.current = null
            }
            if (hlsRef.current) {
                hlsRef.current.destroy()
                hlsRef.current = null
            }
            if (playerRef.current) {
                // Save final position before cleanup
                localStorage.setItem(
                    STORAGE_KEY,
                    playerRef.current.currentTime.toString(),
                )
                playerRef.current.destroy()
                playerRef.current = null
            }
            if (container.firstChild) {
                container.removeChild(container.firstChild)
            }
            document.removeEventListener('keydown', handleEscape)

            // Cleanup WebSocket connection
            if (wsSyncRef.current) {
                wsSyncRef.current.disconnect()
                wsSyncRef.current = null
            }
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') cleanup()
        }

        document.addEventListener('keydown', handleEscape)

        // Cleanup on unmount
        return () => {
            cleanup()
        }
    }, [
        normal_presigned_url,
        hls_presigned_url,
        assetId,
        eventId,
        isHost,
        onStatusUpdate,
        nextDate,
        membershipId,
    ])

    //Fire telemetry once on load, then every 15 seconds
    useEffect(() => {
        // Only track telemetry for non-hosts
        if (isHost) return

        const sendTelemetry = async (isInitial: boolean = false) => {
            try {
                await apiCreateTelemetry({
                    event_id: Number(eventId),
                    device: navigator.userAgent,
                    browser: navigator.userAgent,
                    os: navigator.platform,
                    ip_address: '',
                    token: token,
                    is_initial: isInitial,
                    email: email,
                    code: code,
                })
            } catch (error) {
                console.error('Failed to create/update telemetry:', error)
            }
        }

        // Fire initial telemetry
        //sendTelemetry(true)

        // Set up interval for subsequent telemetry calls
        const interval = setInterval(sendTelemetry, 15000)

        return () => clearInterval(interval)
    }, [eventId, token, email, code, isHost])

    return (
        <Card className="w-full h-auto">
            <div ref={containerRef} className="w-full h-auto" />
        </Card>
    )
}

export default EventVideoPlayer
