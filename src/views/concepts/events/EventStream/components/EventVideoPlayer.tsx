import React, { useEffect, useRef } from 'react'
import Plyr from 'plyr'
import Hls from 'hls.js'
import 'plyr/dist/plyr.css'
import Card from '@/components/ui/Card'
import Notification from '@/components/ui/Notification'
import { toast } from '@/components/ui'
import useQuery from '@/utils/hooks/useQuery'
import { apiCreateTelemetry } from '@/services/TelemetryService'

interface NavigatorWithAutoplayPolicy extends Navigator {
    getAutoplayPolicy(type: string): string
}

interface EventVideoPlayerProps {
    src?: string
    poster?: string
    assetId?: number
    eventId?: number
    onEnded: (
        status: 'ended' | 'suspended' | 'cancelled' | 'live' | 'early',
    ) => void
    isHost: boolean
    nextDate: { start: Date; end: Date } | null
}

const EventVideoPlayer: React.FC<EventVideoPlayerProps> = ({
    src = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.mp4',
    poster = 'https://ecme-react.themenate.net/img/landing/hero/hero.webp',
    assetId,
    eventId,
    onEnded,
    isHost,
    nextDate,
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const playerRef = useRef<Plyr | null>(null)
    const hlsRef = useRef<Hls | null>(null)
    const progressIntervalRef = useRef<number | null>(null)
    const query = useQuery()

    // Get token, email, and code from URL parameters
    const token = query.get('token') || ''
    const email = query.get('email') || ''
    const code = query.get('code') || ''

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const STORAGE_KEY = `video-progress-${assetId}-${eventId}`

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

            // Save progress periodically
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
                onEnded('ended')
            })

            // Save progress before unload
            window.addEventListener('beforeunload', () => {
                localStorage.setItem(
                    STORAGE_KEY,
                    videoElement.currentTime.toString(),
                )
            })
        }

        // Check if the video URL is an HLS stream (.m3u8)
        if (Hls.isSupported() && src.endsWith('.m3u8')) {
            // Create Hls instance
            hlsRef.current = new Hls()
            hlsRef.current.loadSource(src)
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
            video.src = src

            video.addEventListener('loadedmetadata', () => {
                startPlayback(video)
            })
        } else {
            // Regular video playback
            video.setAttribute('src', src)
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
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') cleanup()
        }

        document.addEventListener('keydown', handleEscape)

        // Cleanup on unmount
        return () => {
            cleanup()
        }
    }, [src, assetId, eventId, poster, isHost, onEnded, nextDate])

    //Fire this every 20 seconds
    useEffect(() => {
        // Only track telemetry for non-hosts
        if (isHost) return

        const interval = setInterval(async () => {
            try {
                await apiCreateTelemetry({
                    event_id: Number(eventId),
                    device: navigator.userAgent,
                    browser: navigator.userAgent,
                    os: navigator.platform,
                    ip_address: '',
                    token: token,
                    email: email,
                    code: code,
                })
            } catch (error) {
                console.error('Failed to create/update telemetry:', error)
            }
        }, 10000)

        return () => clearInterval(interval)
    }, [eventId, token, email, code, isHost])

    return (
        <Card className="w-full h-auto">
            <div ref={containerRef} className="w-full h-auto" />
        </Card>
    )
}

export default EventVideoPlayer
