import React, { useEffect, useRef } from 'react'
import { useEvent } from '../context/EventContext'
import { Countdown } from '@/utils/countdown'
import { EventStreamResponse } from '@/@types/events'

interface EventWaitingCardProps {
    onCountdownEnd?: () => void
    event: EventStreamResponse
}

const EventWaitingCard: React.FC<EventWaitingCardProps> = ({
    onCountdownEnd,
    event,
}) => {
    const { eventStatus, nextDate } = useEvent()
    const countdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let countdown: Countdown | null = null
        if (eventStatus === 'early' && nextDate && countdownRef.current) {
            countdown = new Countdown(countdownRef.current, nextDate.start, {
                threshold: '0',
                reset: 'false',
                onEnd: () => {
                    onCountdownEnd?.()
                },
            })
            countdown.start()
        } else if (countdownRef.current) {
            countdownRef.current.textContent = ''
        }
        return () => {
            countdown?.destroy()
        }
    }, [eventStatus, nextDate, onCountdownEnd])

    return (
        <div
            className="flex flex-col items-center justify-center h-full rounded-lg p-4 sm:p-6 md:p-8 mb-4 relative"
            style={{
                backgroundImage: event.event.asset.image_presigned_url
                    ? `url(${event.event.asset.image_presigned_url})`
                    : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* Content with relative positioning to appear above overlay */}
            <div className="w-full sm:w-4/5 md:w-2/3 lg:w-1/2 xl:w-1/3 relative z-10 flex flex-col items-center backdrop-blur-sm bg-white/20 rounded-lg p-4 sm:p-6 md:p-8">
                <span
                    className="text-3xl sm:text-4xl md:text-5xl mb-4"
                    style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}
                >
                    {eventStatus === 'ended' ? '📹' : '🍿'}
                </span>
                <div className="text-center">
                    {eventStatus === 'early' && (
                        <>
                            <div className="font-bold text-white green-700 text-base sm:text-lg md:text-xl mb-2">
                                This event starts in
                            </div>
                            <div
                                ref={countdownRef}
                                className="font-bold text-white green-700 text-xl sm:text-2xl md:text-3xl"
                                aria-live="polite"
                            />
                        </>
                    )}
                    {eventStatus === 'ended' && (
                        <div className="font-bold text-white green-700 text-base sm:text-lg md:text-xl">
                            This event has ended
                        </div>
                    )}
                    {eventStatus === 'cancelled' && (
                        <div className="font-bold text-white red-700 text-base sm:text-lg md:text-xl">
                            This event was cancelled
                        </div>
                    )}
                    {eventStatus === 'suspended' && (
                        <div className="font-bold text-yellow-700 text-base sm:text-lg md:text-xl">
                            This event is suspended
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EventWaitingCard
